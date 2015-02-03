function getName() {
  var name = window.names[Math.floor(Math.random() * window.names.length)];

  var tokens = name.split(',');

  if(tokens.length > 1) {
    return $.trim(tokens[1]) + " " + $.trim(tokens[0]);
  }

  return name;
}

function escaped(s) {
  return $("<div></div>").html(s).html();
}

function searchUrlFor(name) {
  return 'https://www.google.com/search?q=' + encodeURIComponent(name) + '%20site:wikipedia.org&btnI=3564';
}

// return date time
function getSystemTime(){
  var dt = new Date($.now());
  var time = dt.getHours() + ":" + dt.getMinutes() + ":"+ dt.getSeconds();
  return time;
}

var name = getName();
$("#data").attr('placeholder', 'send message as ' + name);

var socket = io.connect('/');

// on connection to server, ask for user's name with an anonymous callback
socket.on('connect', function() {
  // call the server-side function 'adduser' and send one parameter (value of prompt)
  socket.emit('adduser', name);
});

// listener, whenever the server emits 'updatechat', this updates the chat body
socket.on('updatechat', function (username, data) {
  $('#conversation').prepend(getSystemTime() + ' <b>'+  escaped(username) + ':</b> ' + escaped(data) + "<br/>");
});

// listener, whenever the server emits 'updateusers', this updates the username list
socket.on('updateusers', function(data) {
  $('#users').empty();
  $.each(data, function(key, value) {
    $('#users').prepend('<div><a href="' + searchUrlFor(key) + '" target="_blank">' + key + '</div>');
  });
});

socket.on('servernotification', function (data) {
  var searchUrl = searchUrlFor(data.username);
  if(data.connected) {
    if(data.to_self) data.username = "you";
    $('#conversation').prepend('connected: <a href="' + searchUrl + '" target="_blank">' + escaped(data.username) + "</a><br/>");
  } else {
    $('#conversation').prepend('disconnected: <a href="' + searchUrl + '" target="_blank">' + escaped(data.username) + "</a><br/>");
  }
});

// on load of page
$(function(){
  // when the client hits ENTER on their keyboard
  $('#data').keypress(function(e) {
    if(e.which == 13) {
      var message = $('#data').val();
      $('#data').val('');
      // tell server to execute 'sendchat' and send along one parameter
      socket.emit('sendchat', message);
    }
  });
});
// sign in button binding
$(function(){
  $('#signInBtn').on('click', function (e) {
    // $('#myModal').modal('toggle');
    alert("hi");
  });
});

function draw() {
  var canvas = document.getElementById("mycanvas");

  if (canvas.getContext) {
    var ctx = canvas.getContext("2d");

    ctx.fillStyle = "rgb(200,0,0)";
    ctx.fillRect(10, 10, 55, 50);

    ctx.fillStyle = "rgba(0,0,200,0.5)";
    ctx.fillRect(30, 30, 55, 50);
  } else {
    alert("Canvas isn't supported.");
  }
}

$(function() {
  draw();
  // prepareCanvas();
});
