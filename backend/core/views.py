from django.shortcuts import render
from django.contrib.auth.models import User, Group
from core.models import CustomUser
from rest_framework import viewsets
from rest_framework import permissions
from core.serializers import *


class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer
    permission_classes = []


class GroupViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    permission_classes = [permissions.IsAuthenticated]
    
class CustomUserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows custome users to be viewed or edited.
    """
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer
    permission_classes = []
    
#http://localhost:8000/datums/?name=Datum1&history=7
    
class DatumViewSet(viewsets.ModelViewSet):
    
    permission_classes = []
    
    
    def get_queryset(self):
        print(self.request.query_params)
        datum = self.request.query_params.get("name")
        history = int(self.request.query_params.get("history"))
        
        if datum and history:
            return Datum.objects.get(id=datum).valuehistory_set.all()[:history]
        elif datum:
            return Datum.objects.filter(id=datum)
        else:
            return Datum.objects.all()
    
    def get_serializer_class(self):
        history = self.request.query_params.get("history")
        
        if history:
            return ValueHistorySerializer
        else:
            return DatumSerializer
             
    
    queryset = CustomUser.objects.all()