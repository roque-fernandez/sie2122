
    const BASE_API_URL = "/api/v1/pedidos";

    var data = [
        {
            id: 1,
            producto: "Pan de trigo",
            cantidad: 3,
            fecha: "03/05/2022",
            comprador: "José Fernández",
            entregado: true   
        },
        {
            id: 2,
            producto: "Pan de espelta",
            cantidad: 20,
            fecha: "04/05/2022",
            comprador: "María López",
            entregado: false   
        }
        
    ];

module.exports.register = (app,db) => {

    //LOAD INITIAL DATA

    app.get(BASE_API_URL + "/loadInitialData", (req, res) => {

        db.find({}, function (err, filteredList) {
            if (err) {
                res.sendStatus(500, "ERROR EN CLIENTE");
                return;
            }
            if (filteredList == 0) {
                for (var i = 0; i < data.length; i++) {
                    db.insert(data[i]);
                }
                res.sendStatus(200, "OK.");
                return;
            }else{
            res.sendStatus(200, "Ya inicializados")
        }
        });
    })

    //GET GENERAL
    
    app.get(BASE_API_URL, (req, res) => {

        var year = req.query.year;
        var from = req.query.from;
        var to = req.query.to;

        //Comprobamos query

        for (var i = 0; i < Object.keys(req.query).length; i++) {
            var element = Object.keys(req.query)[i];
            if (element != "year" && element != "from" && element != "to" && element != "limit" && element != "offset") {
                res.sendStatus(400, "BAD REQUEST");
                return;
            }
        }

        db.find({}, function (err, filteredList) {
            if (err) {
                res.sendStatus(500, "ERROR EN CLIENTE");
                return;
            }


            // Resultado sin ID
            if (req.query.limit != undefined || req.query.offset != undefined) {
                filteredList = pagingMaker(req, filteredList);
            }
            filteredList.forEach((element) => {
                delete element._id;
            });

            //Comprobamos fields
            if(req.query.fields!=null){
                //Comprobamos si los campos son correctos
                var listaFields = req.query.fields.split(",");
                for(var i = 0; i<listaFields.length;i++){
                    var element = listaFields[i];
                    if(element != "id" && element != "producto" && element != "cantidad"  && element != "fecha" && element!="comprador" && element!="entregado"){
                        res.sendStatus(400, "BAD REQUEST");
                        return;
                    }
                }
                //Escogemos los campos correspondientes
                filteredList = checkFields(req,filteredList);
            }
            res.send(JSON.stringify(filteredList, null, 2));
        })
    })

    //GET DE UN RECURSO CONCRETO
    
    app.get(BASE_API_URL + "/:id", (req, res) => {

        var id = req.params.id

        db.find({}, function (err, filteredList) {
            if (err) {
                res.sendStatus(500, "ERROR EN CLIENTE");
                return;
            }
            filteredList = filteredList.filter((reg) => {
                return (reg.id == id);
            });
            if (filteredList == 0) {
                res.sendStatus(404, "NOT FOUND");
                return;
            }

            //RESULTADO

            //Paginación
            if (req.query.limit != undefined || req.query.offset != undefined) {
                filteredList = pagingMaker(req, filteredList);
                res.send(JSON.stringify(filteredList, null, 2));
            }
            filteredList.forEach((element) => {
                delete element._id;
            });
            //Comprobamos fields
            if(req.query.fields!=null){
                //Comprobamos si los campos son correctos
                var listaFields = req.query.fields.split(",");
                for(var i = 0; i<listaFields.length;i++){
                    var element = listaFields[i];
                    if(element != "id" && element != "producto" && element != "cantidad"  && element != "fecha" && element!="comprador" && element!="entregado"){
                        res.sendStatus(400, "BAD REQUEST");
                        return;
                    }
                }
                //Escogemos los campos correspondientes
                filteredList = checkFields(req,filteredList);
            }
            res.send(JSON.stringify(filteredList[0], null, 2));
        });
    })

    //POST CORRECTO
    
    app.post(BASE_API_URL, (req, res) => {

        if (checkBody(req)) {
            res.sendStatus(400, "BAD REQUEST");
        } else {
            db.find({}, function (err, filteredList) {

                if (err) {
                    res.sendStatus(500, "ERROR EN CLIENTE");
                    return;
                }

                filteredList = filteredList.filter((reg) => {
                    return (req.body.id == reg.id)
                })

                if (filteredList.length != 0) {
                    res.sendStatus(409, "CONFLICT");
                } else {
                    db.insert(req.body);
                    res.sendStatus(201, "CREATED");
                }
            })
        }
    })

    //POST NO PERMITIDO

    app.post(BASE_API_URL +"/:id", (req,res) => {
        res.sendStatus(405,"METHOD NOT ALLOWED");
    });

    //PUT CORRECTO

    app.put(BASE_API_URL + "/:id", (req, res) => {

        //comprobamos body

        if (checkBody(req)) {
            res.sendStatus(400, "BAD REQUEST");
            return;
        }
        var idR = req.params.id;

        db.find({}, function (err, filteredList) {
            if (err) {
                res.sendStatus(500, "ERROR EN CLIENTE");
                return;
            }

            //comprobamos que el elemento exista
            filteredList = filteredList.filter((reg) => {
                return (reg.id == idR);
            });
            if (filteredList == 0) {
                res.sendStatus(404, "NOT FOUND");
                return;
            }

            //comprobamos que los campos coincidan
            if (idR != req.body.id) {
                res.sendStatus(400, "BAD REQUEST");
                return;
            }

            //actualizamos valor
            db.update({$and:[{id: String(idR)}]}, {$set: req.body}, {},function(err) {
                if (err) {
                    res.sendStatus(500, "ERROR EN CLIENTE");
                }else{
                    res.sendStatus(200,"UPDATED");
                }
            });
        })
    })

    //PUT NO PERMITIDO

    app.put(BASE_API_URL, (req,res) => {
        res.sendStatus(405,"METHOD NOT ALLOWED");
    });

    //DELETE GENERAL

    app.delete(BASE_API_URL,(req, res)=>{
        db.remove({}, { multi: true }, (err, numRemoved)=>{
            if (err){
                res.sendStatus(500,"ERROR EN CLIENTE");
                return;
            }
            res.sendStatus(200,"DELETED");
            return;
        });
    })

    //DELETE DE UN RECURSO CONCRETO
    
    app.delete(BASE_API_URL+"/:id",(req, res)=>{
        var idR = req.params.id;

        db.find({id: parseInt(idR)}, {}, (err, filteredList)=>{
            if (err){
                res.sendStatus(500,"ERROR EN CLIENTE");
                return;
            }
            if(filteredList==0){
                res.sendStatus(404,"NOT FOUND");
                return;
            }
            db.remove({id: parseInt(idR)}, {}, (err)=>{
                if (err){
                    res.sendStatus(500,"ERROR EN CLIENTE");
                    return;
                }
            
                res.sendStatus(200,"DELETED");
                return;
                
            });
        });

    })

    //FUNCION DE PAGINACION

    function pagingMaker(req, list){
        var res = [];
        var limit = req.query.limit;
        var offset = req.query.offset;
        
        if(limit < 1 || offset < 0 || offset > list.length){
            res.push("ERROR EN PARAMETROS LIMIT Y/O OFFSET");
            return res;
        }

        //limit no definido
        if(limit == undefined && offset != undefined){
            limit = list.length - offset;
        }
        //offset no definido
        else if(limit != undefined && offset == undefined){
            offset = 0;
        }

        res = list.slice(offset,parseInt(limit)+parseInt(offset));
        return res;
    }

    //FUNCION PARA COMPROBAR LOS CAMPOS DE PETICION

    function checkBody(req) {
        return (
            req.body.id == null ||
            req.body.producto == null ||
            req.body.cantidad == null ||
            req.body.fecha == null ||
            req.body.comprador == null ||
            req.body.entregado == null
        )
    }

    //FUNCION PARA COMPROBAR LOS CAMPOS DEL OBJETO

    function checkFields(req, lista){
        var fields = req.query.fields;
        var hasId = false;
        var hasProducto = false;
        var hasCantidad = false;
        var hasFecha = false;
        var hasComprador = false;
        var hasEntregado = false;

        fields = fields.split(",");

        for(var i = 0; i<fields.length;i++){
            var element = fields[i];
            if(element=='id'){
                hasId=true;
            }
            if(element=='producto'){
                hasProducto=true;
            }
            if(element=='cantidad'){
                hasCantidad=true;
            }
            if(element=='fecha'){
                hasFecha=true;
            }
            if(element=='comprador'){
                hasComprador=true;
            }
            if(element=='entregado'){
                hasEntregado=true;
            }
        }

        //id
        if(!hasId){
            lista.forEach((element)=>{
                delete element.id;
            })
        }

        //producto
        if(!hasProducto){
            lista.forEach((element)=>{
                delete element.producto;
            })
        }

        //cantidad
        if(!hasCantidad){
            lista.forEach((element)=>{
                delete element.cantidad;
            })
        }

        //fecha
        if(!hasFecha){
            lista.forEach((element)=>{
                delete element.fecha;
            })
        }

        //comprador
        if(!hasComprador){
            lista.forEach((element)=>{
                delete element.comprador;
            })
        }

        //entregado
        if(!hasEntregado){
            lista.forEach((element)=>{
                delete element.entregado;
            })
        }

        return lista;

    }

    

};
