
module.exports.register = (app,db) => {

    const BASE_API_URL = "/api/v1/pedidos";

    var initialData = [
        {
            id: 1,
            producto: "Pan de trigo",
            cantidad: 3,
            fecha: "2022-03-04",
            comprador: "José Fernández",
            entregado: true   
        },
        {
            id: 2,
            producto: "Pan de espelta",
            cantidad: 20,
            fecha: "2022-13-05",
            comprador: "María López",
            entregado: false   
        }
        
    ];

    var data = initialData;

    //LOAD INITIAL DATA

    app.get(BASE_API_URL + "/loadInitialData", (req,res) => {

        //inicializamos el vector
        if(data.length === 0){
            initialData.forEach((a)=>{
                data.push(a);
            });
        }
        res.send(JSON.stringify(data,null,2));
        
    
    });

    

    //GET DE UN RECURSO CONCRETO
    
    app.get(BASE_API_URL+"/:id",(req,res)=>{
        filteredData = data.filter((d)=>{
            return (d.id == req.params.id);
        })
        if(filteredData.length === 0){
            res.sendStatus(404,"NOT FOUND");
        }else{
            //se devuelve un unico objeto
            res.send(JSON.stringify(filteredData[0], null, 2));
        }
    });

    //GET GENERAL
    
    app.get(BASE_API_URL, (req,res) => {
        //hay busqueda
        if(Object.keys(req.query).length > 0){
            console.log("Query:",req.query);
            selectedData = filterQuery(req,data);

            if(req.query.limit != undefined || req.query.offset != undefined){
                selectedData = pagingMaker(req,selectedData);
            }
        }
        //no hay busqueda
        else{
            selectedData = data;
        }

        if(selectedData.includes("ERROR")) {
            res.sendStatus(400,"BAD REQUEST"); 
        } else if(selectedData.length === 0) {
            res.sendStatus(404,"NOT FOUND");
        }else{
            res.send(JSON.stringify(selectedData, null, 2));
        } 
    });

    //POST CORRECTO
    
    app.post(BASE_API_URL, (req,res) => {
        //comprobamos que los parametros existan
        if( 
            checkBody(req)
        ){ 
            res.sendStatus(400,"BAD REQUEST");  
        }else{
            filteredData = data.filter((d)=>{
                return (
                    d.id == req.body.id && 
                    d.producto == req.body.producto &&
                    d.cantidad == req.body.cantidad &&
                    d.fecha == req.body.fecha &&
                    d.entregado == req.body.entregado &&
                    d.comprador == req.body.comprador
                    );
            })
    
            if(filteredData.length === 0){
                data.push(req.body);
                res.sendStatus(201,"CREATED");
            }else{
                res.sendStatus(409,"CONFLICT");
            }
        }
    });

    //POST NO PERMITIDO

    app.post(BASE_API_URL +"/:id", (req,res) => {
        res.sendStatus(405,"METHOD NOT ALLOWED");
    });

    //PUT CORRECTO

    app.put(BASE_API_URL +"/:id", (req,res) => {

        //comprobamos que los parametros del req existan
        if(
            checkBody(req)
        ){ 
            res.sendStatus(400,"BAD REQUEST");  
        }else{
            existsStat = data.filter((d)=>{
                return (
                    d.id == req.params.id 
                    
                    );
            })
    
            var indice = data.indexOf(existsStat[0]);
    
            if(existsStat.length === 0){
                res.sendStatus(404,"NOT FOUND");
            }
            else{
                data[indice].producto = req.body.producto;
                data[indice].cantidad = req.body.cantidad;
                data[indice].fecha = req.body.fecha;
                data[indice].entregado = req.body.entregado;
                data[indice].comprador = req.body.comprador;

                res.sendStatus(200,"OK");
            } 
        }   
    });

    //PUT NO PERMITIDO

    app.put(BASE_API_URL, (req,res) => {
        res.sendStatus(405,"METHOD NOT ALLOWED");
    });

    //DELETE GENERAL

    app.delete(BASE_API_URL,(req,res)=>{
        data = []
        res.sendStatus(200,"OK");
    
    });

    //DELETE DE UN RECURSO CONCRETO
    
    app.delete(BASE_API_URL + "/:id",(req,res)=>{
        data = data.filter((d)=>{
            return (d.id != req.params.id);
        })
        res.sendStatus(200,"OK");
    
    });

    

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

    //FUNCION DE FILTRADO
    function filterQuery(req,data){
        filteredStats = data.filter((d)=>{
            
            var flag = true;

            if(req.query.id != undefined) {
                if(d.id != req.query.id)  {
                    flag = false;
                }
            }
            if(req.query.producto != undefined) {
                if(d.producto != req.query.producto)  {
                    flag = false;
                }
            }
            if(req.query.fecha != undefined) {
                if(d.fecha != req.query.fecha)  {
                    flag = false;
                }
            }
            if(req.query.cantidad != undefined) {
                if(d.cantidad != req.query.pe_to_gdp)  {
                    flag = false;
                }
            }
            if(req.query.comprador != undefined) {
                if(d.comprador != req.query.comprador)  {
                    flag = false;
                }
            }
            if(req.query.entregado != undefined) {
                if(d.entregado != req.query.entregado)  {
                    flag = false;
                }
            }
            return flag  
        });
        return filteredStats;
    }

    

};
