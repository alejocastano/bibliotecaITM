module.exports = function(app, swig,MongoClient,mongoConString) {

	app.get("/autenticarse", function(req, res) {
		var respuesta = swig.renderFile('views/login.html', {});
		res.send(respuesta);
	});
        
	app.post("/autenticarse", function(req, res) {
		var usuario = req.body.usuario;
                var clave   = req.body.clave;
                
                MongoClient.connect(mongoConString, function(err, db) { 
                var collection = db.collection('usuarios');
                
                collection.find({ usuario : usuario,clave: clave}).toArray(function(err, usuario){ 
                db.close(); 
                if (usuario.length >0) {
                    req.session.usuario = usuario;
                    res.redirect("/libro")
                }else {
                    res.redirect("/autenticarse" +
                    "?mensaje=Usuario o clave incorrectos"+
                    "&tipoMensaje=alert-danger ");
                }
                });
            });
        });


        app.get("/registrarse", function(req, res) {
		var respuesta = swig.renderFile('views/registrarse.html', {});
		res.send(respuesta);
	});
        
        app.post("/registrarse", function(req, res) {
                var usuario = req.body.usuario;
                var clave = req.body.clave;
                
                MongoClient.connect(mongoConString, function(err, db) { 
                var collection = db.collection('usuarios');
                var usuario1 = new Usuario( usuario, clave);
                collection.insert(usuario1, function (err, result) { 
                if (err) { res.send("Ocurrio un error al intentar registar el usuario"); 
                } else { 
                    res.redirect("/registrarse?mensaje=Usuario registrado exitosamente")
                } 
                db.close(); });
                });
            });
        
        
        function Usuario (usuario, clave) { this.usuario = usuario; this.clave = clave; }

};
