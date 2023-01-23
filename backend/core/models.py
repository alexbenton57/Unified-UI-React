from django.db import models
from random import randint
from django.apps import apps

# Create your models here.
class CustomUser(models.Model):
    
    id = models.CharField("id", max_length=40, primary_key=True, unique=True, editable=False)
    first_name = models.CharField("first_name", max_length=40)
    last_name = models.CharField("last_name", max_length=40)
    email = models.CharField("email", max_length=100)
    color = models.CharField("color", max_length=40)
    
    def __str__(self):
        return(self.id)
    
    def save(self, *args, **kwargs):
        self.id = "{} {}".format(self.first_name.title(),self.last_name.title())
        super(CustomUser, self).save(*args, **kwargs)
        
class Datum(models.Model):
    
    id = models.CharField("id", max_length=40, primary_key=True, unique=True, editable=False)
    value = models.IntegerField("value")
    
    def update(self, val=None):
        value = val if val else randint(0, 100)
        self.value = value
        HistModel = apps.get_model("core", "ValueHistory")
        hist = HistModel(datum=self, value=value)
        hist.save()
        self.save()
        

class ValueHistory(models.Model):
    
    datum = models.ForeignKey(Datum, on_delete=models.CASCADE)
    value = models.IntegerField("value")
    id = models.AutoField("id", primary_key=True)
    time = models.DateTimeField("time", auto_now_add=True)
    
    def __str__(self):
        return (self.datum.id+str(id))
        
class Checklist(models.Model):
    
    id = models.SlugField("id", max_length=50, primary_key=True, unique=True, editable=False)
    name = models.CharField("name", max_length=50)
    
    def __str__(self):
        return self.name
    
    def add(self, text):
        newItem = ChecklistItem(text=text, complete=False, deleted=False, checklist=self)
        newItem.save()
        

class ChecklistItem(models.Model):
    
    id = models.BigAutoField(primary_key=True, unique=True, editable=False)
    text = models.TextField()
    complete = models.BooleanField()
    deleted = models.BooleanField()
    time_created = models.DateTimeField(auto_now_add=True)
    checklist = models.ForeignKey(Checklist, related_name="items", on_delete=models.CASCADE)
    
    def __str__(self):
        return self.text
        
    

    
