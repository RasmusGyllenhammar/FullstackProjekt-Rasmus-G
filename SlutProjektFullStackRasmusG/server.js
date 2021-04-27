const express = require('express')
const http = require('http') //moduel för hantera sockets
const app = express()
const server = http.createServer(app)
const socketio = require('socket.io')
const bcrypt = require('bcrypt')

const dbModule = require('./dBModule')
const personModel = require('./Personmodule')
const staticDir = __dirname + '\\static\\'
app.use(express.static(staticDir)) //statiska filer


app.set('view engine', 'ejs')
app.use(express.json())
app.use(express.urlencoded({extended: false})) //säger att att vi vill få åtkomst till infon i forms genom vår req variabel i post metod

app.get('/', (req, res) => {
  res.render('index.ejs', {name: req.body.name})
})

app.get('/about', (req, res) => {
  res.render('about.ejs')
})

app.get('/chat', (req, res) => {
  res.render('chat.ejs')
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
          res.render('index.ejs', {name : user.name})
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

  


server.listen(3000)