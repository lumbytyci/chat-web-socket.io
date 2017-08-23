// Connecting client to socket
var socket = io.connect("http://localhost:3000");



//Assign a key(unique-id) to each new client and store it as a cookie
//The very first socket.id is used as a key
//TO-DO: Sessions
socket.on('connect', function(){
  //Check if this client already has a key defined
  if(Cookies.get('key') == undefined) {
      Cookies.set('key', String(socket.id), { expires: 31 });
  } else {
    //If the client already has a key assigned, just log it
    console.log(Cookies.get('key'))
  }
});

//DOM
var message = document.getElementById('msg-input');
var send = document.getElementById('send-button');
var chat = document.getElementById('output');


//Get the number of online clients from server and alert
socket.on('online-count', function(data){
  alert("There " +(data.count>1? "are " : "is ") + data.count + " currently online!");
});


//Listener of the send button, on Click, send message to server
send.addEventListener('click', function(){
   socket.emit("sending-message", {message: message.value, id: Cookies.get('key')});
});

//Get message from the server
socket.on('receive-message', function(data){
  //Check if message was created by this client, if so, output message on the right of chat
  if(data.id == Cookies.get('key')) {
  chat.innerHTML += '<li class="message right appeared"><div class="avatar"><div class="profile-name">ME</div></div><div class="text_wrapper"> <div class="text">' + data.message + '</div></div> </li>';
} else {
  //If it's a message from another client output on left
  chat.innerHTML += '<li class="message left appeared"><div class="avatar"><div class="profile-name">#</div></div><div class="text_wrapper"> <div class="text">' + data.message + '</div></div> </li>';
}
});

// Reload old messages if clients refreshes or joined later
socket.on('receive-old-messages', function(data){
  if(Cookies.get('key') == data.id) {
  chat.innerHTML += '<li class="message right appeared"><div class="avatar"><div class="profile-name">ME</div></div><div class="text_wrapper"> <div class="text">' + data.message + '</div></div> </li>';
  } else {
  chat.innerHTML += '<li class="message left appeared"><div class="avatar"><div class="profile-name">#</div></div><div class="text_wrapper"> <div class="text">' + data.message + '</div></div> </li>';
  }
});

// Enter key triggers the send button
window.onkeyup = function(e) {
   var key = e.keyCode ? e.keyCode : e.which;
   if (key == 13) { // 13 -> ENTER KEYPRESS
       send.click(); // send message
   }
}
