const express = require('express');
const mongoose = require('mongoose');
const bodyparser = require('body-parser');

// Para la autentificación
const session = require('express-session');
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
app.use(session({
    secret: 'mysecretsession',
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 60000000,_expires : 60000000 }
}));

// Conexión a Base de datos
// ${process.env.USER_DB}:${process.env.PASSWORD_DB}@
const url = `mongodb://${process.env.SERVE_DB}/${process.env.NAME_DB}?retryWrites=true&w=majority`;
mongoose.connect(url,{ useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => console.log('Base de datos conectada'))
        .catch(e => console.log('error db:', e))

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
    app.locals.signinMessage = req.flash('signinMessage');
    app.locals.signupMessage = req.flash('signupMessage');
    app.locals.user = req.user;
    next();
});

// import ruta
app.use(cors({origin: '*'}));
app.use('/cliente', require('./routes/cliente'));
app.use('/corte', require('./routes/corte'));
app.use('/auth', require('./routes/auth'));

app.get('/', (req, res) => {
    // console.log(req.query.login);
    // res.render("login", { nameApp: process.env.NAME_APP });
    res.redirect('/auth/signin');
});

app.get('/home',isAuthenticated, (req, res, next) => {
    
    res.render('home',{ nameApp: process.env.NAME_APP,userAuth:req.user  });
});

function isAuthenticated(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    res.redirect('/auth/signin')
}

// iniciar server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`servidor andando en: ${PORT}`)
})