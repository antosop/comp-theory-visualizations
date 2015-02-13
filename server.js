var webpack = require("webpack");
var http = require("http");
var express = require("express");

var compiler = webpack({
	//configuration
	entry: {
		main: "./content/scripts/main.js",
		d3: "./node_modules/d3/d3.js"
	},
	output: {
		path: __dirname + "/dist",
		filename: "[name].bundle.js"
	}
});

compiler.watch(200, function(err, stats){
	//...
});

var app = express();

app.use('/dist',express.static(__dirname+'/dist'))

app.get("/", function(req, res) {
	res.sendFile('index.html', {root: __dirname});
});

var server = http.createServer(app);
server.listen(3000);
