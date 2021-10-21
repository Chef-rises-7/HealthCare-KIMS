import logging
import sys
from datetime import datetime, date, timedelta

from django.db import transaction, IntegrityError
from rest_framework.decorators import api_view

from .models import *
from .serializers import *
from .utils import *

import jwt
from rest_framework.exceptions import AuthenticationFailed

logger = logging.getLogger('db')


@api_view(['POST'])
@transaction.atomic(durable=True)
@precheck([PHONE_NUMBER, BENEFICIARYS, DOSES])  # Prechecks for the request parameters sent.
def generateToken(request): # It generates a beneficiary for a user if not present. Generate token for users if not present. If errors are present it responses respective error message.
    try:
        data = request.data
        print(data)
        response_tokens = []

        if len(data[BENEFICIARYS]) != len(data[DOSES]): # Length of beneficiaries and doses fields should be equal.
            raise RuntimeError("Length of " + BENEFICIARYS + " and " + DOSES + " is different")

        registration_id = generateRandomString()  # It generates random string.

        for data_obj in data[BENEFICIARYS]: # Prechecks for required field of beneficiaries for each user.
            required_fields = [BENEFICIARY_ID, NAME, BIRTH_YEAR, VACCINE]
            for field in required_fields:
                if field not in data_obj:
                    raise ValueError(field + ' Not Found')
            if data_obj[BENEFICIARY_ID] not in data[DOSES]: # Beneficiary id present in beneficiaries field should also be present in doses field.
                raise IntegrityError(BENEFICIARY_ID + " " + data_obj[BENEFICIARY_ID] + ' is not present in ' + DOSES)

        for data_obj in data[BENEFICIARYS]:  # Checks if a user have already booked a token for the current day.
            beneficiary = Beneficiary.objects.filter(id=str(data_obj[BENEFICIARY_ID]), date = date.today())
            if(len(beneficiary)):
                raise ValueError("name: "+data_obj[NAME]+" beneficiaryId: "+data_obj[BENEFICIARY_ID]+" already booked.")

        for data_obj in data[BENEFICIARYS]: # Generates a beneficiary and token for each user sequentially.

            beneficiary = Beneficiary()
            beneficiary.id = str(data_obj[BENEFICIARY_ID])
            beneficiary.phone_number = int(data[PHONE_NUMBER])
            beneficiary.name = str(data_obj[NAME])
            beneficiary.birth_year = str(data_obj[BIRTH_YEAR])
            beneficiary.vaccine = str(data_obj[VACCINE])
            if GENDER in data_obj.keys():
                beneficiary.gender = str(data_obj[GENDER])
                beneficiary.photo_id_type = str(data_obj[PHOTO_ID_TYPE])
                beneficiary.photo_id_number = str(data_obj[PHOTO_ID_NUMBER])
                beneficiary.comorbidity_ind = str(data_obj[COMORBIDITY_IND])
                beneficiary.vaccination_status = str(data_obj[VACCINATION_STATUS])
                if data_obj[DOSE1_DATE] == "":
                    beneficiary.dose1_date = None
                else:
                    beneficiary.dose1_date = datetime.strptime(data_obj[DOSE1_DATE], '%d-%m-%Y')
                if data_obj[DOSE2_DATE] == "":
                    beneficiary.dose2_date = None
                else:
                    beneficiary.dose2_date = datetime.strptime(data_obj[DOSE2_DATE], '%d-%m-%Y')
            beneficiary.date = date.today()
            beneficiary.save()

            age = int(date.today().year) - int(beneficiary.birth_year)
            print("age: ",age)

            no_of_slots_booked = 0

            total_slots = Slot.objects.filter(date=date.today())
            for slot in total_slots:
                no_of_slots_booked+=slot.booked  #total number of tokens booked on the current day.
            age_group = ""
            if 45 > age >= 18: # Determining age group of the user.
                age_group = "18to45"
            else:
                age_group = "45plus"

            # Find a slot with respect to user details on the current day.
            required_slot = Slot.objects.filter(date=date.today(),dose_choice=data[DOSES][data_obj[BENEFICIARY_ID]],age_group=age_group,vaccine=data_obj[VACCINE])
            
            if len(required_slot):
                token = Token.objects.filter(beneficiary=beneficiary , date =date.today())
                if not len(token):
                    token = Token()
                    token.registration_id = registration_id
                    token.token_number = no_of_slots_booked + 1
                    token.beneficiary = beneficiary
                    token.slot = required_slot[0]
                    token.dose = data[DOSES][beneficiary.id]
                    token.date = date.today()
                    token.created_by = data[PHONE_NUMBER]
                    token.name = data_obj[NAME]
                    token.vaccine = data_obj[VACCINE]
                    token.age = age
                    token.availability = required_slot[0].availability
                    token.booked = required_slot[0].booked + 1
                    token.save()
                    required_slot[0].booked = required_slot[0].booked + 1
                    required_slot[0].save()

                    ser_token = TokenSerializer(token).data
                    ser_token["availability"] = required_slot[0].availability
                    response_tokens.append(ser_token)
                else:
                    raise IntegrityError('Token already generated')
            else:
                raise IntegrityError('Slot not found on ' + date.today() + ' '+ age_group + ', ' + data[DOSES][data_obj[BENEFICIARY_ID]] + ', ' + data_obj[VACCINE] )
                

        encrypted_registration_id = encrypt(str(registration_id)) # Encrypts the registration id.

        return Response( 
            {'action': "Generate Token", 'message': "Beneficiaries Found", 'qr_payload': encrypted_registration_id , "response_tokens" : response_tokens},
            status=status.HTTP_200_OK)
    except ValueError as e:
        return Response({'action': "Generate Token", 'message': str(e)},
                        status=status.HTTP_400_BAD_REQUEST)
    except IntegrityError as e:
        return Response({'action': "Generate Token", 'message': str(e)},
                        status=status.HTTP_400_BAD_REQUEST)
    except:
        logger.warning("Generate Token: " + str(sys.exc_info()))
        return Response({'action': "Generate Token", 'message': "Error Occurred {0}".format(
            str(sys.exc_info()[1]))},
                        status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@precheck([PHONE_NUMBER])
def getActiveSlots(request):  # Responses the tokens generated by a particular user.
    try:
        data = request.data
        beneficiaries = {}
        tokens =  Token.objects.filter(created_by = data[PHONE_NUMBER], date = date.today())
        if len(tokens):
            for token in tokens:
                ser_token = TokenSerializer(token).data
                print(token.registration_id)
                curr_slot = Slot.objects.filter(id=token.slot.id)
                ser_token["qr_payload"] = encrypt(token.registration_id)
                ser_token["availability"] = curr_slot[0].availability
                if token.registration_id in beneficiaries.keys():
                    beneficiaries[token.registration_id].append(ser_token)
                else:
                    beneficiaries[token.registration_id] = [ser_token]
            return Response( 
            {'action': "Get Beneficiaries", 'message': "Beneficiaries Found", 'data': beneficiaries},
            status=status.HTTP_200_OK)
        else:
            return Response( 
            {'action': "Get Beneficiaries", 'message': "Beneficiaries Not Found"},
            status=status.HTTP_400_BAD_REQUEST)

    except:
        logger.warning("Get Beneficiaries: " + str(sys.exc_info()))
        return Response({'action': "Get Beneficiaries", 'message': "Error Occurred {0}".format(
            str(sys.exc_info()[1]))},
                        status=status.HTTP_400_BAD_REQUEST)


def create_slot(vaccine,dose_choice,age_group):  # Creates a instance of a Slot.
    new_slot = Slot()
    new_slot.vaccine = vaccine
    new_slot.date = date.today()
    new_slot.dose_choice = dose_choice
    new_slot.age_group = age_group
    new_slot.availability = 0
    new_slot.booked = 0
    new_slot.save()

    ser_new_slot = SlotSerializer(new_slot).data
    return ser_new_slot


@api_view(['GET'])
def getSlots(request): # Responses Slot information for the current day.
    try:
        slots = Slot.objects.filter(date=date.today())
        data = []
        if len(slots) == 0: # If no slots are created so far, it creates 8 slots for the current day.
            data.append(create_slot("covishield",'dose1','18to45'))
            data.append(create_slot("covishield",'dose1','45plus'))
            data.append(create_slot("covishield",'dose2','18to45'))
            data.append(create_slot("covishield",'dose2','45plus'))
            data.append(create_slot("covaxin",'dose1','18to45'))
            data.append(create_slot("covaxin",'dose1','45plus'))
            data.append(create_slot("covaxin",'dose2','18to45'))
            data.append(create_slot("covaxin",'dose2','45plus'))
        else:
            data = Slot.objects.filter(date = date.today())
            print(data)
            data = SlotSerializer(data, many=True).data
        return Response({'action': "Get Slots", 'message': "Slots Retrieved", 'slots': data},
                        status=status.HTTP_200_OK)

    except:
        logger.warning("Get Slots: " + str(sys.exc_info()))
        return Response({'action': "Get Slots", 'message': "Error Occurred {0}".format(
            str(sys.exc_info()[1]))},
                        status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@precheck([PAYLOAD])
def verifyToken(request):
    try:

        return Response({'action': "Verify Token", 'message': "Token Verified"},
                        status=status.HTTP_200_OK)
    except:
        logger.warning("Verify Token: " + str(sys.exc_info()))
        return Response({'action': "Verify Token", 'message': "Error Occurred {0}".format(
            str(sys.exc_info()[1]))},
                        status=status.HTTP_400_BAD_REQUEST)



@api_view(['POST'])
@transaction.atomic(durable=True)
@precheck([DOSE_1,DOSE_2,AGE_GROUP_18_TO_45,AGE_GROUP_45_PLUS,COVISHIELD,COVAXIN,AVAILABILITY])
def addAndUpdateSlots(request): #Adds a Slot if not present or Update it for the current day.
    token = request.COOKIES.get('jwt')

    try:
        payload = jwt.decode(token,'SECRET_KEY',algorithms=["HS256"])
    except jwt.ExpiredSignatureError:
        raise AuthenticationFailed("Unauthenticated_2")

    dose_choice = ""
    data = request.data
    if data[DOSE_1]: # Determine dose choice for the slot.
        dose_choice = DOSE_1
    else:
        dose_choice = DOSE_2
    
    age_group = ""

    if data[AGE_GROUP_18_TO_45]: # Determine age group for the slot.
        age_group = AGE_GROUP_18_TO_45
    else:
        age_group = AGE_GROUP_45_PLUS

    vaccine = ""
    
    if data[COVISHIELD]:  # Determine vaccine for the slot.
        vaccine = COVISHIELD
    else:
        vaccine = COVAXIN
    try:

        slot = Slot.objects.filter(vaccine=vaccine,dose_choice=dose_choice,age_group=age_group,date = date.today())
        if len(slot):
            slot[0].availability = data[AVAILABILITY]
            slot[0].save()
        else:
            new_slot = Slot()
            new_slot.vaccine = vaccine
            new_slot.date = datetime.today()
            new_slot.dose_choice = dose_choice
            new_slot.age_group = age_group
            new_slot.availability = data[AVAILABILITY]
            new_slot.booked = 0
            new_slot.created_at = datetime.utcnow()

            new_slot.save()
        
        return Response({'action': "Add Slots",
            "message": "slot created successfully"
        })
    except IntegrityError as e:
        return Response({'action': "Add Slots", 'message': str(e)},
                        status=status.HTTP_400_BAD_REQUEST)
    except:
        logger.warning("Add Slots: " + str(sys.exc_info()))
        return Response({'action': "Add Slots", 'message': "Error Occurred {0}".format(
            str(sys.exc_info()[1]))}, 
                        status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def getTokens(request):  # Responses all the tokens generated so far.
    data = request.data
    try:
        if "specification" not in data.keys():
            raise IntegrityError("specification not found")
        
        specification = data["specification"]
        if specification == "all":
            tokens = Token.objects.filter()
        elif specification == "byDate":
            if "date" not in data.keys():
                raise IntegrityError("date not found")
            tokens = Token.objects.filter(date=data["date"])
        elif specification == "byFromToDate":
            if "fromDate" not in data.keys():
                raise IntegrityError("fromDate not found")
            if "toDate" not in data.keys():
                raise IntegrityError("toDate not found")
            tokens = Token.objects.filter(date__range=[data["fromDate"],data["toDate"]])
        elif specification == "byMonth":
            if "year" not in data.keys():
                raise IntegrityError("year not found")
            if "month" not in data.keys():
                raise IntegrityError("month not found")
            tokens = Token.objects.filter(date__year=data["year"],date__month=data["month"])
        else:
            raise IntegrityError("wrong specification")
        if not len(tokens):
            return Response({
                "message": "No Tokens found"
            })
        serializer = TokenSerializer(tokens,many=True)
        return Response(serializer.data)
    except:
        logger.warning("Add Slots: " + str(sys.exc_info()))
        return Response({'action': "Add Slots", 'message': "Error Occurred {0}".format(
            str(sys.exc_info()[1]))}, 
                        status=status.HTTP_400_BAD_REQUEST)