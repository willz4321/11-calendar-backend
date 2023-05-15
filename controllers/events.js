const {response} = require('express');
const Evento = require('../models/Events');

const getEventos = async( req, res= response) => {

  const events = await Evento.find()
                             .populate('user', 'name');
    res.json({
      ok: true,
      events
    });
};

const crearEvento = async( req, res= response) => {

  const evento = new Evento(req.body);
  
  try {
    
    evento.user = req.uid;
    
    const eventSave = await evento.save();
    
      res.json({
        ok: true,
        evento: eventSave
      })

  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Hable con el admin'
    })
  }
};

const actualizarEvento = async( req, res= response) => {

    const eventoId = req.params.id;
    const uid = req.uid;

      try {
        
        const evento = await Evento.findById(eventoId);

        if(!evento){
          return res.status(404).json({
            ok: false,
            msg: 'Evento no existe por ese ID'
          })
        }

        if (evento.user.toString() !== uid ) {
          return res.status(401).json({
            ok: false,
            msg: 'No tiene privilegio de editar este evento'
          });
        }

        const nuevoEvento = {
          ...req.body,
          user: uid
        }

        const eventoActualizado = await Evento.findByIdAndUpdate(eventoId, nuevoEvento, {new : true});

        res.json({
          ok: true,
          evento: eventoActualizado
        })

      } catch (error) {
        console.log(error);
        res.status(500).json({
          ok: false,
          msg: 'Hable con el admin'
        });
      }
   };

const eliminarEvento = async( req, res= response) => {

  const eventoId = req.params.id;
  const uid = req.uid;

    try {
      
      const evento = await Evento.findById(eventoId);

      if(!evento){
       return res.status(404).json({
          ok: false,
          msg: 'Evento no existe por ese ID'
        })
      }

      if (evento.user.toString() !== uid ) {
        return res.status(401).json({
          ok: false,
          msg: 'No puede eliminar este evento'
        });
      }


      await Evento.findByIdAndDelete(eventoId);

      res.json({
        ok: true,
        msg: 'Evento eliminado con exito'
      })

    } catch (error) {
      console.log(error);
      res.status(500).json({
        ok: false,
        msg: 'Hable con el admin'
      });
    }
};

module.exports = {
    getEventos,
    crearEvento,
    actualizarEvento,
    eliminarEvento
}
