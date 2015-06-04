var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var usernames = {};
var audienceNum = 0;
var port = 30000;
server.listen(process.env.PORT || port);
console.log('server is listening on ' + port);
app.set('view engine', 'ejs');
app.set('view options', { layout: false });
app.use(express.methodOverride());
app.use(express.bodyParser());
app.use(app.router);
app.use('/public', express.static('public'));

app.get('/', function (req, res) {
  res.render('index');
});

// a generic method to check connection length
function filterNullValues (i) {
  return (i!==null);
}

io.sockets.on('connection', function(socket) {

  // an Audience Count method io.sockets.clents().length
  function updateAudienceCount() {
    var count = io.sockets.clients().filter(filterNullValues).length - Object.keys(usernames).length;
    return count;
  }
  updateAudienceCount();
  socket.on('sendchat', function (data) {
    io.sockets.emit('updatechat', socket.username, data);
  });


  // here is the thing for adding audience number
  socket.on('addAudience', function(){
    io.sockets.emit('updateAudience', updateAudienceCount());
    io.sockets.emit('updateusers', usernames);
  });


  // when user connects event
  socket.on('adduser', function(username) {
    if(socket.username === undefined){
      socket.username = username;
      usernames[username] = username;
      socket.emit('servernotification', { connected: true, to_self: true, username: username });
      socket.broadcast.emit('servernotification', { connected: true, username: username });
      io.sockets.emit('updateusers', usernames);
      io.sockets.emit('updateAudience', updateAudienceCount());
      }
  });

  // when the user disconnects.. perform this
  socket.on('disconnect', function(){
    if(socket.username !== undefined){
      delete usernames[socket.username];
    }
    io.sockets.emit('updateusers', usernames);
    // NOTICE!! this line of code below actually needs some attention.
    //
    io.sockets.emit('updateAudience', (updateAudienceCount() - 1));
    // check whether connection is a player
    if(socket.username === undefined){
      socket.broadcast.emit('servernotification', { username: "An audience" });
    }else{
      socket.broadcast.emit('servernotification', { username: socket.username });
    }
  });


  // drawing under test
  socket.on('drawing', function(x, y) {
    io.sockets.emit('drawdot', x, y);
  });
});
