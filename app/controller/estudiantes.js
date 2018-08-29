const Estudiante = require(`../models/estudiante`);
const Grupos = require('../models/grupos');
const {
  sendOk,
  sendError
} = require('./help');
// const Pago        = require(`../models/pago`);


//READ Obtener todos los JSON
exports.findAll = function (req, res) {
  // iferr(`Encontrar Estudiantes`);
  // if (false) {   //TODO conseguir por REGEXP
  // } else {
  Estudiante.find({}).populate({
    "path": "pagos",
  }).exec(function (err, todosEstudiantes) {
      if (err) {
        console.log(err);
        res.send(err)
      }
      else {
        res.status(200).json(todosEstudiantes);
      }
    });
  // }
}
exports.findAllByBanco = function (req, res) {
  // iferr(`Encontrar Estudiantes`);
  // if (false) {   //TODO conseguir por REGEXP
  // } else {
  const banco = req.params.banco;

  Estudiante
      .aggregate([
        {"$match": {"nombre": "Paola"}},
        {"$unwind": "$pagos"},
        {
          "$lookup": {
            "from": "pagos",
            "localField": "pagos",
            "foreignField": "_id",
            "as": "pagos"
          }
        },
        {"$match": {"resultingStuff.banco": banco}},
      ])
      .exec(function (err, todosEstudiantes) {
        if (err) {
          console.log(err);
          // res.send(err)
        }
        else {
          console.log(`JSON con estudiantes que hecho pagos desde el banco:${req.banco}`);
          res.status(200).json(todosEstudiantes);
        }
      });
  // }
};
exports.findAllByMonthYear = async function (req, res) {
  let filtroMes = req.params.mes,
      filtroAno = req.params.ano;

  const estIdDelBanco = await Estudiante
      .aggregate([
        {"$unwind": "$pagos"},
        {
          "$lookup": {
            "from": "pagos",
            "localField": "pagos",
            "foreignField": "_id",
            "as": "pagos"
          }
        },
        {"$unwind": "$pagos"},
        {
          "$project":
              {
                "mes": {$month: "$pagos.fecha"},
                "ano": {$year: "$pagos.fecha"},
              }
        },
        {
          "$match":
              {
                "mes": Number.parseInt(filtroMes),
                "ano": Number.parseInt(filtroAno),
              }
        },
        {
          $group: {_id: null, array: {$push: "$_id"}}
        },
        {
          $project: {array: true, _id: false}
        }

      ]);
  const idArray = estIdDelBanco[0].array;
  Estudiante.find({"_id": {"$in": idArray}})
      .populate('pagos')
      .exec(function (err, todosEstudiantes) {
        if (err) {
          console.log(err);
          res.send(err)
        }
        else {
          console.log(JSON.stringify(todosEstudiantes));
          res.status(200).json(todosEstudiantes);
        }
      })
};


//READ Obtener JSON de un estudiante especifico
exports.findOne = function (req, res) {
  const estId = req.params.id;
  const errMsg = `No existe el estudiante ${estId}`;
  console.log(`Se ha buscado ${estId}`);

  Estudiante.findOne({'_id': estId}).populate('pagos')
      .then(estudiante => {
        if (estudiante == null) {
          sendError(errMsg, res);
        } else {
          sendOk('Se encontro al estudiante:', res, estudiante);
        }
      })
      .catch(err => sendError(errMsg, res, err))
};

//CREATE -- Añadir Nuevo estudiante a la DB
exports.create = function (req, res) {
  let newData = nuevoEst(req);
  console.log(`Se va a crear: ${newData.nombre}`);

  Estudiante.create(newData)
      .then(est => {
        sendOk('Se creo al estudiante:', res, est);
      })
      .catch(err => sendError('No se creo ningun estudiante', res, err))
};

//UPDATE -- Actualizar Usuario
exports.update = function (req, res) {
  const estId = req.params.id;
  let newData = req.body;
  if (Grupos.indexOf(newData.grupo) === -1) {
    newData.grupo = Grupos[0]
  }

  const errMsg = `No existe el estudiante|No se pudo actualizar ${estId}`;
  console.log(`Se va a actualizar ${estId}`);
  Estudiante.findByIdAndUpdate(estId, {$set: newData})
      .then(est => {
        if (est == null) {
          sendError(errMsg, res);
        } else {
          sendOk('Se actualizó al estudiante:', res);
        }
      })
      .catch(err => sendError(errMsg, res, err))
};

//DELETE - remueve a un estudiante y a sus pagos de la Db
exports.delete = async function (req, res) {
  const estId = req.params.id;
  console.log(`Se va a eliminar el Estudiante ${estId}`);

  await Estudiante.eliminarById(req.params.id);
  //TODO este timeout esta peligroso
  setTimeout(() => {
    Estudiante.findById(req.params.id)
        .then(est => {
          if (est == null) {
            sendOk(`Se elimino el usuario`, res)
          }
          else (sendError(`No se elimino a ${est.nombre}`, res, est))
        });
  }, 2000)
};


//Pagos
exports.crearPagoById = async function (req, res) {
  const estId = req.params.id;
  console.log(req.body.banco);
  let pagoNuevo = newPago(req);
  console.log(`Se va a acreditar a ${estId} el pago de ${pagoNuevo}`);
  Estudiante.crearPagoById(estId, pagoNuevo)
      .then(p => {
        sendOk("Creado", res, p)
      })
      .catch(e => {
        sendError("No creado", res, e)
      })

  // pago.then(p => {console.log(p);res.send(p)});
};

function nuevoEst(req) {
  let newData = {
    nombre: req.body.nombre,
    apellido: req.body.apellido,
    email: req.body.email,
    grupo: req.body.grupo,
    tlf: req.body.tlf,
    pagos: req.body.pagos,
  };
  if (!Array.isArray(newData.pagos)) {
    newData.pagos = [];
  }
  if (Grupos.indexOf(newData.grupo) === -1) {
    newData.grupo = Grupos[0]
  }
  return newData;
}

function newPago(req) {
  let newData = {
    banco: req.body.banco,
    referencia: req.body.referencia,
    monto: req.body.monto,
  };
  // if (Bancos.indexOf(newData.banco) === -1) {
  //   newData.banco = Bancos[0]
  // }
  return newData;
}


