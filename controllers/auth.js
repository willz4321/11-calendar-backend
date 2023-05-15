const {response} = require('express');
const bcryptjs = require('bcryptjs');
const Usuario = require('../models/Usuario');
const { generarJWT } = require('../helpers/jwt');

const crearUsuario =  async(req,res = response) => {
  
  const {email,password} = req.body;

    try {
        let usuario = await Usuario.findOne({email});
         
          if(usuario) {
            return res.status(400).json({
                ok: false,
                msg: 'Un usuario existe con ese correo'
            });
          }

         usuario = new Usuario(req.body);

         //Encriptar contraseña
         const salt = bcryptjs.genSaltSync();
         usuario.password = bcryptjs.hashSync( password, salt);

        await usuario.save();

        //Generar JWT
        const token = await generarJWT(usuario.id, usuario.name);
      
          res.status(201).json({
              ok: true,
              uid: usuario.id,
              name: usuario.name,
              token
          }) 
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el admin'
        })
    }
};

const loginUsuario =  async(req,res = response) => {

  const {email,password} = req.body;
  
  try {

    const usuario = await Usuario.findOne({email});
         
    if(!usuario) {
      return res.status(400).json({
          ok: false,
          msg: 'Un usuario no existe con ese correo'
      });
    }

    //Confirmar password
    const validPassword = bcryptjs.compareSync(password, usuario.password);

    if(!validPassword) {
        return res.status(400).json({
            ok: false,
            msg: 'password incorrecto'
        })
    }

    //Generar nuestro JWT
    const token = await generarJWT(usuario.id, usuario.name);

    res.json({
        ok: true,
        uid: usuario.id,
        name: usuario.name,
        token
    })
    
  } catch (error) {
    console.log(error);
    res.status(500).json({
        ok: false,
        msg: 'Por favor hable con el admin'
    })
  }
 
};
const revalidarToken = async (req,res = response) => {
   
  const {uid, name} = req;

    //Generar JWT
    const token = await generarJWT(uid,name);

    res.json({
        ok: true,
        name,
        uid,
        token
    })
};
module.exports = {
    crearUsuario,
    loginUsuario,
    revalidarToken,
}