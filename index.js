const express = require('express');
const app = express();
const socket = require('socket.io')
//Array to store incomming messages
var messages = []; //Warning: Messages are lost on server restart

// Setting view engine
app.set('view engine', 'ejs');
app.use('/public', express.static(__dirname + '/public'));


// Render index
app.get('/', function(req,res){
  res.render('index');
});

// Start server
var server = app.listen(process.env.port || 3000, function(){
  console.log("Listening on port 3000");
});



// Settig up socket service
var socketIO = socket(server);
// When a new socket connets
socketIO.on('connection', function(socket){

    console.log("CONNECTED - SOCKET " + socket.id);
    // If there are any old messages, serve them to this new client
    for(var m = 0; m < messages.length; m++) {
      socket.emit('receive-old-messages', messages[m])
    }

    // Send the client count (How many people are currently online)
    socket.emit('online-count', {count: socketIO.engine.clientsCount});

    console.log("Connected Clients: ", socketIO.engine.clientsCount);

    //If client sent a message, validate, store it on array and emit it back
    socket.on('sending-message', function(data){
      // Empty messages are not allowed
      if(data.message == "") {
        //pass
      } else {
        //Push this new message to array for storage
      messages.push({message: data.message, id: data.id})
      socketIO.sockets.emit('receive-message', data);
      }
    });
});
