module.exports = function(app, swig,MongoClient,mongoConString,mongo) {

	app.get("/libro/registrar", function(req, res) {
		var respuesta = swig.renderFile('views/registroLibro.html', {});
		res.send(respuesta);
	});
        
        app.post("/libro/registrar", function(req, res) {
        var titulo     = req.body.titulo;
        var autor       =  req.body.autor;
        var publicador  = req.body.publicador;
        
        MongoClient.connect(mongoConString, function(err, db) { 
        var collection = db.collection('libros');
        var libro1 = new Libros( titulo, autor,publicador);
        collection.insert(libro1, function (err, result) { 
        if (err) { res.send("Ocurrio un error al intentar registar el usuario"); 
        } else { 
            res.redirect("/libro?mensaje=El libro "+ titulo +" fue registrado exitosamente")
        } 
        db.close(); });
        });
    });
    
        app.get("/libro/modificar/:id", function(req, res) {
            MongoClient.connect(mongoConString, function(err, db) { 
                var collection = db.collection('libros');    
                var id = mongo.ObjectID(req.params.id);
                collection.find({ _id : id }).toArray(function(err, libros){  
                db.close(); 
                    if (libros.length >0) {
                    var respuesta = swig.renderFile('views/libroModificar.html', 
				{
					libro : libros[0]
				});
				res.send(respuesta);
                }else {
                    
                res.redirect("/libros" +
                "?mensaje=No existe"+
                "&tipoMensaje=alert-danger ");
                }
                });
            });
    });
    
    
    
        app.post("/libro/modificar/:id", function (req, res) {
            MongoClient.connect(mongoConString,
            function(err, db) {
                var libro1 = new Libros(req.body.titulo,req.body.autor
                        ,req.body.publicador);
                var collection = db.collection('libros');
                // Transformar a Mongo ObjectID
                var id = require('mongodb').ObjectID(req.params.id);
                collection.update({ _id : id }, libro1, function (err, result) {
                if (err) {
                    res.send("Error al modificar "+err)} else {
                    res.redirect("/libro?mensaje=Libro eliminado exitosamente"+
                    "&tipoMensaje=alert-danger ");
                    }
                    db.close();
                });
            });
         });
         
         
         app.get('/libro/eliminar/:id', function (req, res) {
            MongoClient.connect(mongoConString,
            function(err, db) {
                var collection = db.collection('libros');
                var id = require('mongodb').ObjectID(req.params.id);
                collection.remove({ _id: id }, function (err, result) { 
                if (err) {
                    console.log("Error al eliminar "+err)
                 } else {
                    res.redirect("/libro?mensaje=Libro eliminado exitosamente"+
                    "&tipoMensaje=alert-danger ");
                    db.close();
                }
                });
            });
        });
    
    	app.get('/libro', function (req, res) {
		    MongoClient.connect(mongoConString, function(err, db) { 
                var collection = db.collection('libros');
                
                collection.find().toArray(function(err, libros){ 
                db.close(); 
                if (libros.length >0) {
                    var respuesta = swig.renderFile('views/libros.html', 
				{
					libros : libros
				});
				res.send(respuesta);
                }else {
                    res.redirect("/libros" +
                    "?mensaje=Aún no se registran libros");
                }
                });
            });
	});

        
       function Libros (titulo, autor,publicador) { this.titulo    = titulo; this.autor = autor; this.publicador = publicador}

};
