import logging
import sys
from datetime import datetime, date

from django.db import transaction, IntegrityError
from rest_framework.decorators import api_view

from .models import *
from .serializers import *
from .utils import *

logger = logging.getLogger('db')


@api_view(['POST'])
@transaction.atomic(durable=True)
@precheck([PHONE_NUMBER, BENEFICIARYS, DATE, SLOT, DOSES])
def generateToken(request):
    try:
        data = request.data
        if (datetime.strptime(data[DATE], '%d-%m-%Y').date() - date.today()).days > ADVANCE_DAYS:
            raise RuntimeError("Can't book slots on this Day")

        if len(data[BENEFICIARYS]) != len(data[DOSES]):
            raise RuntimeError("Length of " + BENEFICIARYS + " and " + DOSES + " is different")

        registration_id = generateRandomString()

        for data_obj in data[BENEFICIARYS]:
            required_fields = [BENEFICIARY_ID, NAME, GENDER, BIRTH_YEAR, PHOTO_ID_TYPE, PHOTO_ID_NUMBER,
                               COMORBIDITY_IND, VACCINATION_STATUS, VACCINE, DOSE1_DATE, DOSE2_DATE]
            for field in required_fields:
                if field not in data_obj:
                    raise ValueError(field + ' Not Found')

            if data_obj[BENEFICIARY_ID] not in data[DOSES]:
                raise IntegrityError(BENEFICIARY_ID + " " + data_obj[BENEFICIARY_ID] + ' is not present in ' + DOSES)

            beneficiary = Beneficiary.objects.filter(id=str(data_obj[BENEFICIARY_ID]))

            if not len(beneficiary):
                beneficiary = Beneficiary()
                beneficiary.id = str(data_obj[BENEFICIARY_ID])
                beneficiary.phone_number = int(data[PHONE_NUMBER])
                beneficiary.name = str(data_obj[NAME])
                beneficiary.birth_year = str(data_obj[BIRTH_YEAR])
                beneficiary.gender = str(data_obj[GENDER])
                beneficiary.photo_id_type = str(data_obj[PHOTO_ID_TYPE])
                beneficiary.photo_id_number = str(data_obj[PHOTO_ID_NUMBER])
                beneficiary.comorbidity_ind = str(data_obj[COMORBIDITY_IND])
                beneficiary.vaccination_status = str(data_obj[VACCINATION_STATUS])
                beneficiary.vaccine = str(data_obj[VACCINE])
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

            no_of_slots_booked = 0
            slot_18_to_45 = Slot.objects.filter(date=datetime.strptime(data[DATE], '%d-%m-%Y'), slot=data[SLOT],
                                                age_group=AGE_GROUP_18_TO_45)
            slot_45_Plus = Slot.objects.filter(date=datetime.strptime(data[DATE], '%d-%m-%Y'), slot=data[SLOT],
                                               age_group=AGE_GROUP_45_PLUS)

            if len(slot_18_to_45):
                no_of_slots_booked += slot_18_to_45[0].booked
            if len(slot_45_Plus):
                no_of_slots_booked += slot_45_Plus[0].booked

            if 45 > age >= 18:

                if len(slot_18_to_45):
                    if (slot_18_to_45[0].availability - slot_18_to_45[0].booked) > 0:
                        token = Token.objects.filter(beneficiary=beneficiary, slot=slot_18_to_45[0])
                        if not len(token):
                            token = Token()
                            token.registration_id = registration_id
                            token.token_number = no_of_slots_booked + 1
                            token.beneficiary = beneficiary
                            token.slot = slot_18_to_45[0]
                            token.dose = data[DOSES][beneficiary.id]
                            token.save()
                            slot_18_to_45[0].booked = slot_18_to_45[0].booked + 1
                            slot_18_to_45[0].save()
                        else:
                            raise IntegrityError('Token already generated')
                    else:
                        raise IntegrityError('Slot not available on ' + data[DATE] + ' ' + data[SLOT] + " "
                                             + 'AGE_GROUP_18_TO_45')
                else:
                    raise IntegrityError("Slot not Found on " + data[DATE] + ' ' + data[SLOT] + " "
                                         + 'AGE_GROUP_18_TO_45')
            elif age >= 45:

                if len(slot_45_Plus):
                    if (slot_45_Plus[0].availability - slot_45_Plus[0].booked) > 0:
                        token = Token.objects.filter(beneficiary=beneficiary, slot=slot_45_Plus[0])
                        if not len(token):
                            token = Token()
                            token.registration_id = registration_id
                            token.token_number = no_of_slots_booked + 1
                            token.beneficiary = beneficiary
                            token.slot = slot_45_Plus[0]
                            token.dose = data[DOSES][beneficiary.id]
                            token.save()
                            slot_45_Plus[0].booked = slot_45_Plus[0].booked + 1
                            slot_45_Plus[0].save()
                        else:
                            raise IntegrityError('Token already generated')
                    else:
                        raise IntegrityError(
                            'No Free Slot available on ' + data[DATE] + ' ' + data[SLOT] + " " + 'AGE_GROUP_45_PLUS')
                else:
                    raise IntegrityError("Slot not Found on " + data[DATE] + ' ' + data[SLOT] + " "
                                         + 'AGE_GROUP_45_PLUS')
            else:
                raise IntegrityError(beneficiary.id + " has age less than 18 Years")

        encrypted_registration_id = encrypt(str(registration_id))

        return Response(
            {'action': "Generate Token", 'message': "Beneficiaries Found", 'qr_payload': encrypted_registration_id},
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


@api_view(['GET'])
def getSlots(request):
    try:
        data = Slot.objects.filter(date__gte=date.today())
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
