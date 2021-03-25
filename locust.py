import json
from random import random, randrange
from sys import getsizeof
from locust import HttpUser, task, between

debug = True


def printDebug(msg):
    
    if debug:
        print(msg)


def loadData():
    try:
    
        with open("traffic.json", 'r') as data_file:
            
            array = json.loads(data_file.read())
            return array
        
        print (f'>> Reader: Datos cargados correctamente, {len(array)} datos -> {getsizeof(array)} bytes.')
    except Exception as e:
        
        print (f'>> Reader: No se cargaron los datos {e}')
        return []

array = loadData()


class Reader():

    
    def pickRandom(self):
        
        length = len(array)
        
        if (length > 0):
            
            random_index = randrange(0, length - 1) if length > 1 else 0

            
            return array.pop(random_index)

        
        else:
            
            print (">> Reader: No hay más valores para leer en el archivo.")
            
            return None

class MessageTraffic(HttpUser):
    
    wait_time = between(0.1, 0.9)


    def on_start(self):
        print (">> MessageTraffic: Iniciando el envio de tráfico")
        
        self.reader = Reader()
        

    
    @task
    def PostMessage(self):
        
        random_data = self.reader.pickRandom()
        
        
        if (random_data is not None):
            
            data_to_send = json.dumps(random_data)
            
            printDebug (data_to_send)

            
            self.client.post("/", json=random_data)

        
        else:
            print(">> MessageTraffic: Envio de tráfico finalizado, no hay más datos que enviar.")
            
            self.stop(True)

    
    @task
    def GetMessages(self):      
        
        self.client.get("/")  