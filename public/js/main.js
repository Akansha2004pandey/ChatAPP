const chatForm=document.getElementById('chat-form');
const chatMessages=document.querySelector('.chat-messages');
const socket=io();
//Message from server

socket.on('message',message=>{
    console.log(message);
    //call it once message is received from the server
    //this function is called for DOM manipulation
    outputMessage(message);
    //scroll down
    chatMessages.scrollTop=chatMessages.scrollHeight;
    //clear input
    
})

// all this is going to happen on the client side
//Message submit 
chatForm.addEventListener('submit',(e)=>{
    e.preventDefault();
    //this is done to prevent the default behavior
    const message=e.target.elements.msg.value;
    //emit a message to the server
    console.log(message);
    socket.emit('chatMessage',message);
    e.target.elements.msg.value='';
    e.target.elements.msg.focus();
})
function outputMessage(message){
     const div=document.createElement('div');
     div.classList.add('message');
     div.innerHTML=`<p class="meta">${message.username} <span>${message.time}</span></p>
     <p class="text">
        ${message.text}
     </p>`;
     document.querySelector('.chat-messages').appendChild(div);

}