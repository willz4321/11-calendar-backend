const express = require('express');
const { dbConnection } = require('./database/config');
const cors = require('cors');

require('dotenv').config();

console.log(process.env);
//crear el servidor de express
const app = express();

//Base de datos
dbConnection();

// Configuración de CORS
var corsOptions = {
  origin: 'https://willz4321.github.io'
};

//Directorio Publico
app.use( express.static('public'));

//Lectura y parseo del body
app.use(express.json());

//Rutas
app.use('/api/auth', cors(corsOptions), require('./routes/auth'));
app.use('/api/events', cors(corsOptions), require('./routes/events'));

//Escuchar peticiones
app.listen( process.env.PORT, () => {
    console.log(`Servidor corriendo en puerto ${process.env.PORT} `);
} );
