const Bancos= require('../app/models/bancos');
const Grupos= require('../app/models/grupos');
const NameArray=["Alejandro","Fernando","Dominga","Armando","Arturo","Lennittza","Ricardo","Eduardo","Paola","Ramon"];
const LastNameArray=["Duran","Aparicio","Cova","Martinez","Brito","Zorrilla","Hernandez"];
module.exports={
  getPago(){
    const a= {
      banco: Bancos[Math.floor(Math.random() * Bancos.length)],
      referencia: Math.floor(Math.random() * 1000 + 100).toString(),
      monto: Math.floor(Math.random() * 1000 + 100).toString(),
    };
    return a;
  },
  getStudent(){
    const a={
      nombre:NameArray[Math.floor(Math.random() * NameArray.length)],
      apellido:LastNameArray[Math.floor(Math.random() * LastNameArray.length)],
      tlf: Math.floor(Math.random()*1000),
      cedula: Math.floor(Math.random()*Math.random()*100),
      grupo: Grupos[Math.floor(Math.random() * Grupos.length)],
    };
    a.email=`${a.nombre}_${a.apellido}@noexiste.com`;
    return a;
  },
  getPadre(){
    const a={
      nombre:NameArray[Math.floor(Math.random() * NameArray.length)],
      apellido:LastNameArray[Math.floor(Math.random() * LastNameArray.length)],
      tlf: Math.random()*Math.random()*10,
      pagos:[],
      hijos:[]
    };
    a.email=`${a.nombre}_${a.apellido}@noexiste.com`;
    return a;
  }
};