var http = require("http");
var express = require("express");

var app = express();

app.use('/dist',express.static(__dirname+'/dist'));

app.get("/", function(req, res) {
	res.sendFile('index.html', {root: __dirname});
});

var server = http.createServer(app);
server.listen(3000);
