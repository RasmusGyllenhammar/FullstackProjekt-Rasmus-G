const express = require('express')
const http = require('http') //moduel för hantera sockets
const app = express()
const server = http.createServer(app)
const socketio = require('socket.io') //init
const io = socketio(server) //variabel
const formatMessage = require('./utils/messages')
const bcrypt = require('bcrypt')
const PORT = process.env.PORT || 3000;

const dbModule = require('./dBModule')
const personModel = require('./Personmodule')
const staticDir = __dirname + '\\static\\'
app.use(express.static(staticDir)) //statiska filer


app.set('view engine', 'ejs')
app.use(express.json())
app.use(express.urlencoded({extended: false})) //säger att att vi vill få åtkomst till infon i forms genom vår req variabel i post metod

const admin = 'Livechat-Football Admin'

//kör när en person joinar skriver den detta dvs refresh sidan
io.on('connection', socket => {
  

  //välkommnar nuvarande användare
  socket.emit('message', formatMessage(admin,'welcome to live chat Football'))

  //skcika ut när en användare connects, bara till alla andra än en själv
  socket.broadcast.emit('message', formatMessage(admin, 'A user has joined the chat'));

  

  //kolla efter chatMessage
  socket.on('chatMessage', (msg) => {
   io.emit('message', formatMessage('User', msg))
  }) 
 //kopplar ifrån
 socket.on('disconnect', () => {
  io.emit('message', formatMessage(admin, 'A user has left the chat'))
  })
})



app.get('/', (req, res) => {
  res.render('index.ejs', {name: req.body.name})
})

app.get('/about', (req, res) => {
  res.render('about.ejs')
})

var username = ""

app.get('/livechat', (req, res) => {
 if (username == "") {
   res.render('login.ejs')
 } else {
  res.render('livechat.ejs', { username : personModel.getAllPersons.name })
 }
 
})

app.get('/login', async (req, res) => {
    res.render('login.ejs')
  
   
  })
  
app.post('/login', async (req, res) => {
    
    const user = await personModel.getUser(req.body.email);
    //skickar in vårt lösenord från forumläret samt krypterande lösenordet
      await bcrypt.compare(req.body.password, user.password, (err, success) => { //när compare är färdig så kallas funktionen
      if (err) {
        console.log(err);
      }
      
        if (success){
          console.log("succes, you logged in");
          res.render('livechat.ejs', {name : user.name})
          
        } 
        else{
          console.log("fail, u failed to log in");
          res.render('login.ejs')
          
        } 
      })

      
   
})

app.get('/register', (req, res) => {
    res.render('register.ejs')
  })
app.post('/register', async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10) //krypterar lösenordet man får via formuläret och 20 är en svårighetsgrad
        const logInInformation = await personModel.createPerson(req.body.name, req.body.email, hashedPassword) 
        await dbModule.Store(logInInformation) 
        console.log(logInInformation)
        res.redirect('/login') //ifall allt ovanför gick bra att utföra så tar man sig vidare till login sidan
    } catch {
        res.redirect('/register') //ifall något gick snett så kommer man tillbaka till sidan
    }
  
  })

  


server.listen(PORT, () => console.log(`server runnin on port ${PORT}!`));