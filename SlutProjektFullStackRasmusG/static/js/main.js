const chatForm = document.getElementById('chat-form')
const chatMessages = document.querySelector('.chat-messages');




const socket = io();



//sms från servern sida, varje gång vi får ett meddelande går igenom här
socket.on('message', message => {
    console.log(message);
    outputMessage(message);

    //scrolla ner för varje meddelande, funkar ej än får fixa det
    chatMessages.scrollTop = chatMessages.scrollHeight;
} );

//message submit
 chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    //fångar upp texten i formet
    const msg = await e.target.elements.msg.value;
    //skickar sms till server
    socket.emit('chatMessage', msg);
   //outputMessage(`You: ${msg}`)
    
   //töm sms-fältet, fokuserar på en tom input
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
})

//meddelande till DOm, objekt o inte en string längre
//namnge username här
function outputMessage(message) {
    
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
       ${message.text}
    </p>`;
    document.querySelector('.chat-messages').appendChild(div); 
    //när det skapas ett nytt sms så får den en ny div
}