var express = require('express');
var app     = express();

var expressSession = require('express-session');
app.use(expressSession({
    secret: '12345',
    resave: true,
    saveUninitialized: true
}));

var mongoConString = 'mongodb://andreszuleta:andres123@ds151382.mlab.com:51382/bibliotecaitm';
var mongo = require('mongodb');
var MongoClient = require('mongodb').MongoClient;
var swig  = require('swig');
var bodyParser = require('body-parser');
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true })); 

var routerUsuarioSession = express.Router(); 
routerUsuarioSession.use(function(req, res, next) {
	 console.log("routerUsuarioSession");
	  if ( req.session.usuario ) {
	     next();
	  } else {
	     res.redirect("/autenticarse");
	  }
});

require("./routes/usuarios.js")(app,swig,MongoClient,mongoConString);
require("./routes/libros.js")(app,swig,MongoClient,mongoConString,mongo);

app.use("/libro/",routerUsuarioSession);
app.set('port', 8080);
app.set('db','mongodb://andreszuleta:andres123@ds151382.mlab.com:51382/bibliotecaitm');


app.get('/', function (req, res) {
	res.redirect('/principal');
})

app.get("/principal", function(req, res) {
    res.send(swig.renderFile('views/biblioteca.html'));
});

app.listen(app.get('port'), function() {
	console.log("Servidor activo en : "+app.get('port'));
})

function Anuncio (descripcion, precio) { this.descripcion = descripcion; this.precio = precio; }