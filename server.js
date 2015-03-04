var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var usernames = {};
var audienceNum = 0;
var port = 3000;
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

  // an Audience Count method
  function updateAudienceCount() {
    var count = io.sockets.clients().filter(filterNullValues).length - Object.keys(usernames).length;
    return count;
  }
  updateAudienceCount();
  socket.on('sendchat', function (data) {
    // test start,
    // it currently only works on the server-end.
    // the problem is I dont know how to pass it to the client side.
    var Cylon = require('cylon');
    Cylon.robot({
      connection: { name: 'speech', adaptor: 'speech', voice: 'en-m3', speed: 90 },
      device: {name: 'mouth', driver: 'speech'},

      work: function(my) {
        my.mouth.say("Still yet passed to the client side!");
      }
    }).start();
    //test end
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
    delete usernames[socket.username];
    io.sockets.emit('updateusers', usernames);
    // io.sockets.emit('updateAudience', updateAudienceCount());
    // check whether connection is a player
    if(socket.username === undefined){
      socket.broadcast.emit('servernotification', { username: "An audience" });
    }else{
      socket.broadcast.emit('servernotification', { username: socket.username });
    }
    io.sockets.emit('updateAudience', updateAudienceCount());
  });

  // drawing under test
  socket.on('drawing', function(x, y) {
    io.sockets.emit('drawdot', x, y);
  });
});
