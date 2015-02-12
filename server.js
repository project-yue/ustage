var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var nodes = { };
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

io.sockets.on('connection', function(socket) {
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

  // here is the thing for updating audienceNum; work in progress
  socket.on('addAudience', function(){
    audienceNum++;
    console.log("number is " +audienceNum);
    // io.sockets.emit('updateAudience', audienceNum);
  });

  // when user connects event
  socket.on('adduser', function(username) {
    // audienceNum++;
    socket.username = username;
    usernames[username] = username;
    socket.emit('servernotification', { connected: true, to_self: true, username: username });
    socket.broadcast.emit('servernotification', { connected: true, username: username });
    io.sockets.emit('updateusers', usernames);
    // console.log(audienceNum);
  });

  // when the user disconnects.. perform this
  socket.on('disconnect', function(){
    audienceNum--;
    delete usernames[socket.username];
    io.sockets.emit('updateusers', usernames);
    socket.broadcast.emit('servernotification', { username: socket.username });
  });

  // drawing function
  // socket.on("drawing", function(msg){
  //   io.emit("drawing", msg);
  // });


});
