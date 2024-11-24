import express from "express";
import { user } from "../models/userModel.js";
import { Activity } from "../models/activityModel.js";
import { student } from "../models/studentModel.js";
import nodemailer from 'nodemailer'
import { ActivityClass, PublishVisitor, ReminderVisitor, CancelVisitor } from '../src/visitorPrueba.js';

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const newUser = {
      username: req.body.username,
      password: req.body.password,
      name: req.body.name,
      secondName: req.body.secondName,
      lastName: req.body.lastName,
      secondLastName: req.body.secondLastName,
      officePhone: req.body.officePhone,
      phoneNumber: req.body.phoneNumber,
      campus: req.body.campus,
      isAdministrative: req.body.isAdministrative,
      teacherID: req.body.teacherID,
      profilePic: req.body.profilePic,
    };
    const userNew = await user.create(newUser);
    return res.status(201).send(userNew);
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
});

router.post('/RestorePassword', async (req, res) =>{
  const email = req.body.email
  await user.findOne({username: email}).then((user) =>{
    if(!user){
      return res.send({status: "User does not exist"})
    }
    var transporter = nodemailer.createTransport({
      service: "gmail",
      port: 465,
      secure: true,
      logger: true,
      debug: true,
      secureConnection: false,
      auth: {
          user: 'poogr40@gmail.com',
          pass: 'septtczjgleebadu'
      }, 
      tls: {
          rejectUnauthorized: true
      }
    });
    var mailOptions = {
      from: 'poogr40@gmail.com',
      to: email,
      subject: 'Password recovery - Sistema Nuevos Ingresos',
      text: `Por favor ingrese al siguiente link para restaurar tu contraseña: \n https://tecportfolio.onrender.com/RestorePassword/${user._id}`
    };
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
          res.status(500).json({error: 'Email not sent', detail: 'EMAIL_NOT_SEND'});
      } else {
          res.json({message: 'User exist', id: id})
      }
    });
  })
})

router.post('/restore/:id', async (req, res) => {
  const id = req.params.id
  const pass = req.body.password
  const regex = /^\d{8}$/;
  if (!regex.test(pass)) {
    return res.send({status: "Invalid Password"})
  }
  try {
    const result = await user.findByIdAndUpdate(id, {
      $set : {password: pass}
    })
    res.send({result, status: "Success"})
  } catch (error) {
    console.log(error)
    res.send({status: "Not Success"})
  }
  

})

router.post('/LoadData', async (req, res) =>{
  console.log("load data")
  try {
    const systemDate = new Date(req.body.fecha)
    const list = await Activity.find({})
    list.map((act) => {
      const activityData = {
          _id: act._id,
          nombre: act.nombre,
          estado: act.estado,
          semana: act.semana,
          tipo: act.tipo,
          afiche: act.afiche,
          fecha: act.fecha,
          fechaPublicacion: act.fechaPublicacion,
          hora: act.hora,
          recordatorios: act.recordatorios,
      };
      const activity = new ActivityClass(activityData)
      const publishVisitor = new PublishVisitor(systemDate);
      const reminderVisitor = new ReminderVisitor(systemDate);
      const cancelVisitor = new CancelVisitor(systemDate);
      activity.accept(publishVisitor);
      activity.accept(reminderVisitor);
      activity.accept(cancelVisitor);
    })
    
  } catch (error) {
    
  }
  console.log("termino")
})

router.get("/NotiAlert/:id", async (req,res)=>{
  const id = req.params.id
  try {
    student.findById(id).then((result)=>{
      let buzon = result.buzon
      let flag = false
      buzon.map((n) =>{
        if(!n.read)
          flag = true
      })
      res.send(flag)
    })
    
  } catch (error) {
    console.log(error)
  }
})

router.post('/ChangePass/:id', async (req,res)=>{
  const id = req.params.id
  const {contrasenaActual, contrasenaNueva} = req.body
  try {
    const result = await student.findById(id)
    console.log(contrasenaActual)
    console.log(result.password)
    if(result.password !== contrasenaActual){
      console.log("incorrecta")
      return res.send({message: "Actual Incorrecta"})
    }
    await student.findByIdAndUpdate(id, {
      $set: {password: contrasenaNueva} 
    })
    return res.send({message: ""})
  } catch (error) {
    console.log(error)
  }
})

router.post('/EditarEstudiante/:id', async (req, res)=>{
  const {profilePic, phoneNumber} = req.body
  const id = req.params.id
  try {
    const result = await student.findByIdAndUpdate(id, {
      $set: {phoneNumber: phoneNumber, profilePic: profilePic},
    }, {new: true})
    res.send(result)
  } catch (error) {
    console.log(error)
  }
})

router.get('/perfil/:id', async (req, res)=>{
  let result;
  const id = req.params.id
  try {
    result = await student.findById(id)
    return res.send(result)
  } catch (error) {
    console.log(error)
  }
})

router.get("/filterBuzon/:id", async (req,res)=>{
  const id = req.params.id
  const filter = req.query.filter
  try {
    student.findById(id).then((result)=>{
      let buzon = result.buzon
      let aux = []
      console.log(filter)
      if(filter === "Todos"){
        return res.send(result.buzon)
      }else if(filter === "Leído"){
        buzon.map((n) =>{
          if(n.read)
            aux.push(n)
        })
      }else if(filter === "No leído"){
        buzon.map((n) =>{
          if(!n.read)
            aux.push(n)
        })
      }
      res.send(aux)
    })
    
  } catch (error) {
    console.log(error)
  }
})

router.post("/uploadBuzon/:id", async (req, res)=>{
  const id = req.params.id
  try {
    const result  = await student.findByIdAndUpdate(id, {
      $set: {buzon: req.body.aux}
    })
    res.send(result.buzon)
  } catch (error) {
    console.log(error)
  }
})

router.get("/buzon/:id", async (req, res)=>{
  const id = req.params.id
  try {
    const result  = await student.findById(id)
    res.send(result.buzon)
  } catch (error) {
    console.log(error)
  }
})

router.post("/login", (req, res) => {
  const { username, password } = req.body;
  user.findOne({ username: username }).then((user) => {
    if (user) {
      console.log("encontro usuario");
      if (user.password === password) {
        console.log("son iguales las contrasenas");
        res.json({ status: true, message: "Usuario logeado", user: user });
        
      } else {
        console.log("no son iguales las contrasenas");
        res.json({status: false, message: "Contraseña Incorrecta" });
      }
    } else {
      student.findOne({email: username}).then((user)=>{
        if (user) {
          console.log("encontro estudiante");
          if (user.password === password) { //cmbiar esto
            console.log("son iguales las contrasenas");
            res.json({ status: true, message: "student", user: user });
            
          } else {
            console.log(user.password)
            console.log(password)
            console.log("no son iguales las contrasenas");
            res.json({status: false, message: "Contraseña Incorrecta" });
          }
        }else{
          res.json({ message: "Usuario no encontrado" });
        }
      })
    }
  });
});

export default router;
