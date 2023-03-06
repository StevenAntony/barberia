const express = require('express');
const mongoose = require('mongoose');
const bodyparser = require('body-parser');

// Para la autentificación
const passport = require('passport');
const flash = require('connect-flash');

const cors = require('cors');

require('dotenv').config()

const app = express();
require('./core/LocalAuth');

// Archivos estaticos como, css,js,img etc
app.use('/assets',express.static(__dirname + "/public"));

// Motor de plantilla
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");


// capturar body
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());

// Conexión a Base de datos
// ${process.env.USER_DB}:${process.env.PASSWORD_DB}@

const url = process.env.APP_ENV == 'local' 
                ? `mongodb://${process.env.SERVE_DB}/${process.env.NAME_DB}?retryWrites=true&w=majority`
                : `mongodb+srv://${process.env.USER_DB}:${process.env.PASSWORD_DB}@cluster0.rldp8ft.mongodb.net/${process.env.NAME_DB}?retryWrites=true&w=majority`;
mongoose.connect(url,{ useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => console.log('Base de datos conectada'))
        .catch(e => console.log('error db:', e));
        
// import ruta
app.use(cors({origin: '*'}));
app.use('/cliente', require('./routes/cliente'));
app.use('/atencion', require('./routes/atencion'));
app.use('/caja', require('./routes/caja'));
app.use('/corte', require('./routes/corte'));
app.use('/usuario', require('./routes/usuario'));
app.use('/auth', require('./routes/auth'));
app.use('/analisis', require('./routes/analisis/ingreso.js'));
app.use('/producto', require('./routes/producto.js'));

// Apis de la barberia
app.use('/api/v1/auth',require('./routes/api/v1/auth.js'));

app.get('/', (req, res) => {
    res.redirect('/auth/signin');
});

app.get('/home', (req, res, next) => {   
    res.render('home',{ nameApp: process.env.NAME_APP,userAuth:req.user  });
});

// iniciar server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(process.env.APP_ENV);
    console.log(`servidor andando en: ${PORT}`)
})