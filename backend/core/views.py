from django.shortcuts import render
from django.contrib.auth.models import User, Group
from core.models import *
from core.serializers import *

from rest_framework import viewsets, permissions, routers, status
from rest_framework.response import Response
from rest_framework.views import APIView

from django.http import Http404

import pprint
pp = pprint.PrettyPrinter(indent=4)


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
            return Datum.objects.get(id=datum).valuehistory_set.all().order_by('-time')[:history]
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
    
class ChecklistViewSet(viewsets.ModelViewSet):
    
    permission_classes = []
    queryset = Checklist.objects.all()
    serializer_class = ChecklistSerializer
    
    # PUT /checklist/<CLtoUpdate>
    def update(self, request, *args, **kwargs):
        checklist_id_from_url = request.parser_context["kwargs"]["pk"]
        checklist_from_url = Checklist.objects.get(pk=checklist_id_from_url)
        items = []
        
        for task in self.request.data:


            try: 
                checklist_item = ChecklistItem.objects.get(id=task["id"])
                checklist_id = task["checklist"].split(r"/")[-2]
                print(checklist_id)
                assert Checklist.objects.get(id=checklist_id) == checklist_from_url
            except (AssertionError):
                return Response("Checklist from POST url does not match checklist associated with checklist item", status=status.HTTP_400_BAD_REQUEST)
            except(ValueError):
                checklist_item = ChecklistItem(checklist=checklist_from_url)
                print("Adding new item to checklist {} from task: {}".format(checklist_id_from_url.upper(), task))

            checklist_item.text=task["text"]
            checklist_item.complete=task["complete"]
            checklist_item.deleted=task["deleted"]
            items.append(checklist_item)
            
        for item in items:
            item.save()       

        return Response({"data": self.request.data}, status=status.HTTP_200_OK)
        

    
    def partial_update(self, request, *args, **kwargs):
        
        print("partial update method triggered")
        print(self.request)
        
        return super().partial_update(request, *args, **kwargs)
    
    # POST /checklist/<newCL>
    def create(self, request, *args, **kwargs):
        print("create action triggered")
        pp.pprint(self.request.data)
        pp.pprint(self.request)
        print(self.request.get_full_path())
        return Response({}, status=status.HTTP_200_OK)
        
        #return super().create(request, *args, **kwargs)


class ChecklistDetail(APIView):
    
    def get_object(self, pk):
        try:
            return Checklist.objects.get(pk=pk)
        except Checklist.DoesNotExist:
            raise Http404

    
    def get(self, request, format=None):
        pass
    
    
    


class ChecklistItemViewSet(viewsets.ModelViewSet):
    
    permission_classes = []
    queryset = ChecklistItem.objects.all()
    serializer_class = ChecklistItemSerializer
    
    def update(self, request, *args, **kwargs):
        
        print("update method triggered")
        print(self.request)
        
        return super().update(request, *args, **kwargs)
    
    def partial_update(self, request, *args, **kwargs):
        
        print("partial update method triggered")
        print(self.request)
        
        return super().partial_update(request, *args, **kwargs)
    
    def create(self, request, *args, **kwargs):
        print("create action triggered")
        print(self.request)
        return super().create(request, *args, **kwargs)
    
router = routers.DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'groups', GroupViewSet)
router.register(r'customusers', CustomUserViewSet)
router.register(r'datums', DatumViewSet)
router.register(r'checklist', ChecklistViewSet)
router.register(r'checklistitem', ChecklistItemViewSet)