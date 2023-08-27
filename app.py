from flask import Flask, render_template, request,jsonify
import datetime

#crear objeto de tipo flask
app = Flask(__name__)

#lista para guardar las personas registradas
listaPersonas=[]

@app.route("/")
def inicio():
    return render_template("frmPersonas.html")

@app.route("/iniciar", methods=["GET"])
def iniciar():
     return jsonify({"listaPersonas":listaPersonas})


@app.route("/agregar",methods=["POST"])
def agregar():
    """_summary_
        Función que agrega una persona a una lista
        con los datos que vienen del cliente
    Returns:
        _type_: objeto json con 3 datos.
    """
    estado=False
    mensaje=""
    try:
        identificacion = request.form["txtIdentificacion"]
        nombre = request.form["txtNombre"]
        correo= request.form["txtCorreo"]
        fechaNacimiento=request.form["txtFechaNacimiento"]
        for p in listaPersonas:
            if(p[0]==identificacion or p[2]==correo):
                mensaje="Persona ya existe con identificación o correo"
                break
        else:
            persona=[identificacion,nombre,correo,fechaNacimiento]
            listaPersonas.append(persona)
            mensaje="Persona agregada correctamente"   
            estado=True         
    except Exception as error:
        mensaje = error
        
    return jsonify({"estado":estado, "mensaje":mensaje, "listaPersonas":listaPersonas})
        
    
@app.route("/actualizar",methods=["POST"])
def actualizar():
    """_summary_
        Actualiza una persona de la lista
    
        Returns:
        _type_: objeto json con 3 datos.
    """
    mensaje=""
    estado=False    
    try:
        idAnterior = request.form["txtIdAnterior"]
        identificacion = request.form["txtIdentificacion"]
        nombre = request.form["txtNombre"]
        correo= request.form["txtCorreo"]
        fechaNacimiento=request.form["txtFechaNacimiento"]
        for p in listaPersonas:
             if(p[0]==identificacion or p[2]==correo) and (p[0]!=idAnterior):
                mensaje="Persona ya existe con identificación o correo"
                break
        else:
            for per in listaPersonas:
                if(per[0]==idAnterior):
                    per[0]=identificacion
                    per[1]=nombre
                    per[2]=correo
                    per[3]=fechaNacimiento
                    mensaje="Persona Actualizada"
                    estado=True
                    break               
    except Exception as error:
        mensaje=error
    return jsonify({"estado":estado, "mensaje":mensaje, "listaPersonas":listaPersonas})

@app.route("/eliminar",methods=["POST"])
def eliminar():
    """_summary_
        Elimina una persona de la lista
    
        Returns:
        _type_: objeto json con 3 datos.
    """
    mensaje=""
    estado=False
    datos = request.json
    identificacion = datos["identificacion"]
    try:
        for p in listaPersonas:
            if(p[0]==identificacion):
                listaPersonas.remove(p)
                estado=True
                mensaje="Persona eliminada correctamente"
                break
    except Exception as error:
        mensaje=error
    return jsonify({"estado":estado, "mensaje":mensaje, "listaPersonas":listaPersonas})


#iniciar el servidor web
if __name__=='__main__':
    app.run(port=3000,debug=True)
