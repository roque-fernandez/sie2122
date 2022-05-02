const express = require("express");
const path = require("path");

const backend_V1 = require("./src/back/index");




const app = express();

//BASE DE DATOS
var Datastore = require("nedb");

DB = new Datastore();

const port = process.env.PORT || 8091;
const bodyParser = require("body-parser");

app.use(bodyParser.json());

//BACKEND
backend_V1.register(app,DB);

app.use("/", express.static('public'));

app.listen(port, () => {
    console.log(`Server TRULY ready`);
});

console.log(`Server ready at port ${port}`);