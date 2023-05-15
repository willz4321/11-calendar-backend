
const {Router} = require('express');
const {check} = require('express-validator');
const {validarCampos} = require('../middlewares/validar-campos');
const {validarJWT} = require('../middlewares/validar-jwt');
const { getEventos, crearEvento, actualizarEvento, eliminarEvento } = require('../controllers/events');
const { isDate } = require('../helpers/isDate');

const router = Router();

//Todas tienen que validar TOken
router.use( validarJWT);

//Obtener eventos
router.get('/', getEventos);

//Crear un nuevo evento
router.post(
    '/',
    [
      check('title', 'El titulo es obligatorio',).not().isEmpty(),
      check('start', 'Fecha de inicio obligatoria',).custom(isDate),
      check('end', 'Fecha de fin obligatoria',).custom(isDate),
      validarCampos
    ],
    crearEvento);

//Actualizar evento
router.put('/:id', actualizarEvento);

//Obtener eventos
router.delete('/:id', eliminarEvento);

module.exports = router;