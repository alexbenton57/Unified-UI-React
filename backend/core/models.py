from django.db import models

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
        
