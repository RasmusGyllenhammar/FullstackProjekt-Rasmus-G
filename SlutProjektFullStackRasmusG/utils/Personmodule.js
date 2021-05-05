const mongoose = require('mongoose');

const personSchema = new mongoose.Schema({ //nytt schema, dokument och beskriver vad de kommer innehålla
    name: String,
    email: String,
    password : String
});

const Person = mongoose.model('Person', personSchema); //skapas en modell av typen model av typen personschemat

exports.createPerson = (name, email, password) => { // skapar en ny modell med det innehållet vi skickat med och returna modellen där det är request
  var person = new Person({
    name: name,
    email: email,
    password: password //andra password är parametern
  })
  return person
}
//för att skicka ut varje meddelande efter varandra
exports.getAllPersons = async () => {
  const personList = await Person.find({})
  return personList
}
//skickar med userEmail och baserat på användaren skrivit på i email fältet så jämnför man ifall det finns i databasen och hämtar den ifall det finns
exports.getUser = async function(uEmail) {
  var uPersonList = await Person.findOne({email : uEmail}) //hitta en användare med den här mailen
  return uPersonList 
}
//göra en till exports?
