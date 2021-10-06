import random
import string
import sys
from rest_framework import status
from rest_framework.response import Response
from cryptography.fernet import Fernet
from .constants import *


def precheck(required_data=None):
    if required_data is None:
        required_data = []

    def decorator(view_func):
        def wrapper_func(request, *args, **kwargs):
            try:
                request_data = None
                if request.method == 'GET':
                    request_data = request.GET
                elif request.method == 'POST':
                    request_data = request.data
                    if not len(request_data):
                        request_data = request.POST
                if len(request_data):
                    for i in required_data:
                        if i not in request_data:
                            return Response({'action': "Pre check", 'message': str(i) + " Not Found"},
                                            status=status.HTTP_400_BAD_REQUEST)
                else:
                    return Response({'action': "Pre check", 'message': "Message Data not Found"},
                                    status=status.HTTP_400_BAD_REQUEST)

                return view_func(request, *args, **kwargs)
            except:
                return Response({'action': "Pre check", 'message': "Error Occurred " + str(sys.exc_info())},
                                status=status.HTTP_400_BAD_REQUEST)

        return wrapper_func

    return decorator


def generateRandomString():
    try:
        N = 15
        res = ''.join(random.choices(string.ascii_uppercase + string.digits, k=N))
        return res
    except:
        return False


def encrypt(message):
    try:

        fernet = Fernet(QR_CODE_ENCRYPTION_KEY)

        # then use the Fernet class instance
        # to encrypt the string string must must
        # be encoded to byte string before encryption
        encMessage = fernet.encrypt(message.encode())

        print("original string: ", message)
        print("encrypted string: ", encMessage)

        return encMessage
    except:
        return False
