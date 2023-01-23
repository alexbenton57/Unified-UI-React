from django.contrib.auth.models import User, Group
from core.models import *
from rest_framework import serializers


class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ['url', 'username', 'email', 'groups']


class GroupSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Group
        fields = ['url', 'name']
        
class CustomUserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['first_name', 'last_name', 'email', 'color']
        
class DatumSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Datum
        fields = ['id', 'value']
        
class ValueHistorySerializer(serializers.HyperlinkedModelSerializer):
        
    class Meta:
        model = ValueHistory
        fields = ['value', 'time']
        
class ChecklistItemSerializer(serializers.HyperlinkedModelSerializer):
    
    class Meta:
        model = ChecklistItem
        fields = ["id","text", "complete", "deleted", "time_created", "checklist"]
        
class ChecklistSerializer(serializers.HyperlinkedModelSerializer):
    
    items = ChecklistItemSerializer(many=True, read_only=True)
    
    class Meta:
        model= Checklist
        fields = ["id", "name", "items"]