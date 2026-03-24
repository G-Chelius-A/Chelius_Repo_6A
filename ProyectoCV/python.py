import tkinter
from tkinter import *
import time , collections
import time
import numpy as np 
import serial
import threading

isRun = True
global vec2
vec2=np.arange(3,dtype=None)
value = 0
valo=0
i=0

def controled(int):#funcion para enviar el PWM al pin 11 del arduino
	pwmv=str(s1.get())
	time.sleep(0.01)
	Conexion.write((pwmv+"\n").encode())
	time.sleep(0.01)

SerialPort = 'COM5' #'/dev/ttyUSB0'
baudRate = 19200

try:
	Conexion = serial.Serial(SerialPort,baudRate) #Puente entre la comunicación

except:
	print("No se puede Conectar el Arduino al puerto")
	print("Verifique que el Arduino este conectado")


def askQuit():
    root.quit()
    root.destroy()	

root=tkinter.Tk()
root.configure(bg="#EEECE8")
root.protocol('WM_DELETE_WINDOW', askQuit)
root.wm_title("Digidata")
root.geometry('500x500+100+100')

def recibeDatos():
    global data
    time.sleep(0.1) # da tiempo para resivir datos
    Conexion.reset_input_buffer() # resetea el bufer de entrada
    while (isRun):#bucle para estar recibiendo los datos del puerto serial
        data = str(Conexion.readline().strip())
        if(data=="b'inicio'"):#Ordena los datos recibidos apartir de la palabra inicio que envia el arduino
            for i in range(3):# guarda los valores numericos en la variable vec2
                value =float(Conexion.readline().strip())
                vec2[i]=value
        labela.config(text= "{:.3f}".format(((vec2[0])*(5)/1024)) ,fg="red")#Muestra el valor del A0 del arduino en volts

      
hiloRecepcion = threading.Thread(target = recibeDatos) #Creamos un hilo para la recepción de datos del puerto serial
hiloRecepcion.start() #Iniciamos el hilo para la recepción de datos

labela=tkinter.Label(root,width="10",height="1",fg="Blue",text="N.T",font=('Arial',40))
labela.place(x=200,y=200)# etiqueta para visualizar el valor del A0 del arduino

s1 = tkinter.Scale( root, from_ = 0, to = 200,length=250, orient = HORIZONTAL,command=controled)
s1.place(x=200,y=100)# Genera un PWM en el pin 11 del arduino

root.mainloop()#mantiene la interfaz visualizada en la pantalla
isRun = False# 
hiloRecepcion.join()
Conexion.close() # finaliza la conexion serial