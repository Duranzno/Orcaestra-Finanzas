//funciones de ayuda
const   {Bancos,Grupos}=require('../models/');


let sendOk=function(okMsg, res, object) {
  console.log(`rest| ${okMsg} `);
 if (typeof object === "null") {
    res.status(200).json(okMsg);
  } else {
    res.status(200).json(object);
  }
};

let sendError=function (errMsg, res, err) {
  console.log(`rest | ${errMsg} ${err}`);
  if (err == null) {
    res.status(400).send(errMsg);
  } else {
    console.error(err);
    res.status(400).send(errMsg);
  }
};

let newPago=function(req) {
  let newData = {
    banco: req.body.banco,
    referencia: req.body.referencia,
    monto: req.body.monto,
  };
  if (Bancos.indexOf(newData.banco) === -1) {
    newData.banco = Bancos[0];
  }
  return newData;
};
let newEstudiante=function(req) {
  // console.log("NEWESTUDIANTE")
  // console.log("PAGOS DE newEstudiante",req.body.pagos)
  let newData = {
    nombre: req.body.nombre,
    apellido: req.body.apellido,
    email: req.body.email,
    grupo: req.body.grupo,
    tlf: req.body.tlf,
    // pagos: req.body.pagos,
  };
  // if (!Array.isArray(newData.pagos)) {
  //   newData.pagos = [];
  // }
  if (Grupos.indexOf(newData.grupo) === -1) {
    newData.grupo = Grupos[0];
  }
  return newData;
};
let newPadre=function(req) {
  let newData = {
    nombre: req.body.nombre,
    apellido: req.body.apellido,
    email: req.body.email,
    tlf: req.body.tlf,
    pagos: req.body.pagos,
    hijos:req.body.hijos,
  };
  if (!Array.isArray(newData.pagos)) {
    newData.pagos = [];
  }
  if (!Array.isArray(newData.hijos)) {
    newData.hijos= [];
  }
  return newData;
};

module.exports = {sendOk, sendError, newPago,newEstudiante,newPadre};
