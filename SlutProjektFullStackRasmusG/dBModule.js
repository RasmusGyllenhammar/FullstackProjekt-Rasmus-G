const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/FullstackProjektLOGGin', {useNewUrlParser: true});

const db = mongoose.connection;
//kollar ifall man har connect
db.on('error', console.error.bind(console, 'connection error:')); //om servern får error gör, skriv ut detta
db.once('open', function(){ //Callback, anropar när den är färdig
 console.log("Its working!");//har connected 
});


exports.Store = (input) => { //tar in en viss input/element och anropar funktion save till det objektet
    input.save(() => {
        console.log("kung du kom in")
    })

}