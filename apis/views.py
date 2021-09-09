import logging
import sys
from datetime import datetime, date, timedelta

from django.db import transaction, IntegrityError
from rest_framework.decorators import api_view

from .models import *
from .serializers import *
from .utils import *

logger = logging.getLogger('db')


@api_view(['POST'])
@transaction.atomic(durable=True)
@precheck([PHONE_NUMBER, BENEFICIARYS, DOSES])
def generateToken(request):
    print("loda bhenchod")
    try:
        data = request.data
        response_tokens = []
        # if (datetime.strptime(data[DATE], '%d-%m-%Y').date() - date.today()).days > ADVANCE_DAYS:
        #     raise RuntimeError("Can't book slots on this Day")

        if len(data[BENEFICIARYS]) != len(data[DOSES]):
            raise RuntimeError("Length of " + BENEFICIARYS + " and " + DOSES + " is different")

        registration_id = generateRandomString()

        for data_obj in data[BENEFICIARYS]:
            print("->" , data_obj)
            required_fields = [BENEFICIARY_ID, NAME, GENDER, BIRTH_YEAR, PHOTO_ID_TYPE, PHOTO_ID_NUMBER,
                               COMORBIDITY_IND, VACCINATION_STATUS, VACCINE, DOSE1_DATE, DOSE2_DATE]
            for field in required_fields:
                if field not in data_obj:
                    raise ValueError(field + ' Not Found')

            if data_obj[BENEFICIARY_ID] not in data[DOSES]:
                raise IntegrityError(BENEFICIARY_ID + " " + data_obj[BENEFICIARY_ID] + ' is not present in ' + DOSES)

            beneficiary = Beneficiary.objects.filter(id=str(data_obj[BENEFICIARY_ID]), date = date.today())

            if not len(beneficiary):
                beneficiary = Beneficiary()
                beneficiary.id = str(data_obj[BENEFICIARY_ID])
                beneficiary.phone_number = int(data[PHONE_NUMBER])
                beneficiary.name = str(data_obj[NAME])
                beneficiary.birth_year = str(data_obj[BIRTH_YEAR])
                # print(str(data_obj[BIRTH_YEAR]))
                beneficiary.gender = str(data_obj[GENDER])
                beneficiary.photo_id_type = str(data_obj[PHOTO_ID_TYPE])
                beneficiary.photo_id_number = str(data_obj[PHOTO_ID_NUMBER])
                beneficiary.comorbidity_ind = str(data_obj[COMORBIDITY_IND])
                beneficiary.vaccination_status = str(data_obj[VACCINATION_STATUS])
                beneficiary.vaccine = str(data_obj[VACCINE])
                beneficiary.date = date.today()

                if data_obj[DOSE1_DATE] == "":
                    beneficiary.dose1_date = None
                else:
                    beneficiary.dose1_date = datetime.strptime(data_obj[DOSE1_DATE], '%d-%m-%Y')
                if data_obj[DOSE2_DATE] == "":
                    beneficiary.dose2_date = None
                else:
                    beneficiary.dose2_date = datetime.strptime(data_obj[DOSE2_DATE], '%d-%m-%Y')
                beneficiary.save()
            else:
                beneficiary = beneficiary[0]

            age = int(date.today().year) - int(beneficiary.birth_year)
            print("age: ",age)

            no_of_slots_booked = 0

            total_slots = Slot.objects.filter(date=date.today())
            for slot in total_slots:
                no_of_slots_booked+=slot.booked
            age_group = ""
            if 45 > age >= 18:
                age_group = "18to45"
            else:
                age_group = "45plus"
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
                    token.save()
                    required_slot[0].booked = required_slot[0].booked + 1
                    required_slot[0].save()

                    ser_token = TokenSerializer(token).data
                    ser_token["name"] = data_obj[NAME]
                    ser_token["vaccine"] = data_obj[VACCINE]
                    ser_token["age"] = age
                    ser_token["availability"] = required_slot[0].availability
                    ser_token["booked"] = required_slot[0].booked
                    response_tokens.append(ser_token)
                else:
                    raise IntegrityError('Token already generated')
            else:
                raise IntegrityError('Slot not found on ' + data[DATE] + ' '+ age_group + ', ' + data[DOSES][data_obj[BENEFICIARY_ID]] + ', ' + data_obj[VACCINE] )
                

        encrypted_registration_id = encrypt(str(registration_id))

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
def getBeneficiaries(request):
    try:
        data = request.data
        beneficiaries = {}
        tokens =  Token.objects.filter(created_by = data[PHONE_NUMBER], date = date.today())
        if len(tokens):
            for token in tokens:
                ser_token = TokenSerializer(token).data
                print(token.registration_id)
                if token.registration_id in beneficiaries.keys():
                    beneficiaries[token.registration_id].append(ser_token)
                else:
                    beneficiaries[token.registration_id] = [ser_token]
                    # beneficiaries[token.registration_id].append(ser_token)
            # beneficiaries = Token.objects.filter(registration_id = token[0].registration_id , date = date.today())
            # beneficiaries_data = []
            # for beneficiary in beneficiaries:
            #     bene_data=BeneficiarySerializer(beneficiary).data
            #     beneficiaries_data.append(bene_data)
            return Response( 
            {'action': "Get Beneficiaries", 'message': "Beneficiaries Found", 'data': beneficiaries},
            status=status.HTTP_200_OK)
        else:
            return Response( 
            {'action': "Get Beneficiaries", 'message': "Beneficiaries Not Found"},
            status=status.HTTP_400_OK)

    except:
        logger.warning("Get Beneficiaries: " + str(sys.exc_info()))
        return Response({'action': "Get Beneficiaries", 'message': "Error Occurred {0}".format(
            str(sys.exc_info()[1]))},
                        status=status.HTTP_400_BAD_REQUEST)


def create_slot(vaccine,dose_choice,age_group):
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
def getSlots(request):
    try:
        slots = Slot.objects.filter(date=date.today())
        data = []
        if len(slots) == 0:
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
def addSlots(request):
    dose_choice = ""
    data = request.data
    if data[DOSE_1]:
        dose_choice = DOSE_1
    else:
        dose_choice = DOSE_2
    
    age_group = ""

    if data[AGE_GROUP_18_TO_45]:
        age_group = AGE_GROUP_18_TO_45
    else:
        age_group = AGE_GROUP_45_PLUS

    vaccine = ""
    
    if data[COVISHIELD]:
        vaccine = COVISHIELD
    else:
        vaccine = COVAXIN
    try:

        slot = Slot.objects.filter(vaccine=vaccine,dose_choice=dose_choice,age_group=age_group,date = date.today())
        if len(slot):
            raise IntegrityError('Slot already generated')
        new_slot = Slot()
        new_slot.vaccine = vaccine
        new_slot.date = datetime.today()
        new_slot.dose_choice = dose_choice
        new_slot.age_group = age_group
        new_slot.availability = data[AVAILABILITY]
        new_slot.booked = 0
        new_slot.created_at = datetime.utcnow()

        new_slot.save()
        return Response({
            "message": "slot created successfully"
        })
    except IntegrityError as e:
        return Response({'action': "Generate Token", 'message': str(e)},
                        status=status.HTTP_400_BAD_REQUEST)
    except:
        logger.warning("Add Slots: " + str(sys.exc_info()))
        return Response({'action': "Add Slots", 'message': "Error Occurred {0}".format(
            str(sys.exc_info()[1]))}, 
                        status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def getTokens(request):
    # start = request.data[START_DATE]
    # end = request.data[END_DATE]

    try:
        tokens = Token.objects.filter()
        if not tokens:
            return Response({
                "message": "No Tokens found"
            })
        serializer = TokenSerializer(tokens,many=True)
        # serializer.is_valid(raise_exception=True)
        return Response(serializer.data)
    except:
        logger.warning("Add Slots: " + str(sys.exc_info()))
        return Response({'action': "Add Slots", 'message': "Error Occurred {0}".format(
            str(sys.exc_info()[1]))}, 
                        status=status.HTTP_400_BAD_REQUEST)