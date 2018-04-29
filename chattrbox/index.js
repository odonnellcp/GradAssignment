var http = require("http");
var path = require('path');
var fs = require("fs");
var server = require("diet");
var wss = require("./websockets-server");
var mime = require("mime");

var handleError = function(err, res) {
  fs.readFile("app/error.html", function(err, data) {
    res.end(data);
  });
};

/*var app = server(function(req, res) {
  console.log("Responding to a request.");

  var filePath = extract(req.url);
  var mimeType = mime.getType(filePath);
  fs.readFile(filePath, function(err, data) {
    if (err) {
      handleError(err, res);
      return;
    } else {
      res.setHeader("Content-Type", mimeType);
      res.end(data);
    }
  });
});*/

var app = server();
app.listen(8000);

app.footer(function($){
  console.log("Responding to a request.");
  var pathname   = $.url.pathname

  var mimeType   = mime.getType(pathname)
  var extension  = path.extname(pathname)
  var source     = app.path + pathname

  if(extension){
    $.header("Content-Type", mimeType)
    fs.readFile(source, function(error, data){
      if(!error) {
        $.end(data)
        $.return()
      } else if (error.type != "ENOENT") {
        $.status(error.status || 500, "File not found");
        $.return();
      } else {
        throw error;
        $.return()
      }
    })
  } else {
    $.return()
  }
})
