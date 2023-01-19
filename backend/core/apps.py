from django.apps import AppConfig
import threading
import time 
from random import random
def updateLoop(datumId):
    
    from core.models import Datum
    datum = Datum.objects.get(id=datumId)

    while(True):
        datum.update()   
        time.sleep(random()*300)
 
    
class CoreConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'core'
    
    def ready(self):
        for id in ["datum1", "datum2", "datum3"]:
            thread = threading.Thread(target=updateLoop, daemon=True, args=(id,))
            thread.start()
