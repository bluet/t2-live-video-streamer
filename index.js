var express = require('express');
var app = express();
var server = require('http').Server(app);
var sockjs = require('sockjs');
var os = require('os');
var path = require('path');
var cp = require('child_process');
var port = 8080;

var av = require('tessel-av');


app.use(express.static(path.join(__dirname, '/public')));

var vstream = sockjs.createServer({ sockjs_url: 'http://cdn.jsdelivr.net/sockjs/1.0.1/sockjs.min.js' });
vstream.on('connection', function(conn) {
	var camera = new av.Camera();
	camera.stream()
	
	conn.on('data', () => camera.stream());
	
	camera.on('data', (data) => {
		conn.write(data.toString('base64'));
	});
	
	conn.on('close', function() {});
});

vstream.installHandlers(server, {prefix:'/vstream'});


server.listen(port, function () {
  console.log(`http://${os.hostname()}.local:${port}`);
});

process.on("SIGINT", _ => server.close());
