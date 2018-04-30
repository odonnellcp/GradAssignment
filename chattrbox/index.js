var path = require("path");
var fs = require("fs");
var server = require("diet");
var wss = require("./websockets-server");
var mime = require("mime");

var handleError = function(err, res) {
  fs.readFile("app/error.html", function(err, data) {
    console.log();
    res.end(data);
  });
};

var app = server();
app.listen(8000);

app.footer(function($) {
  console.log("Responding to a request.");
  var pathname = $.url.pathname;
  var extension = path.extname(pathname);
  var filePath = app.path + pathname;
  console.log("Full file path is " + "'" + filePath + "'");
  var mimeType = mime.getType(filePath);
  console.log("MIME Type is " + "'" + mimeType + "'");
  if (extension){
    fs.readFile(filePath, function(err, data){
      if (err){
        console.log("Load Error Page");
        handleError(err, $);
        $.return();
      }else{
        console.log("No error");
        $.header("Content-Type", mimeType);
        $.end(data);
        $.return();
      }
    });
  }else {
    $.return();
  }
});
