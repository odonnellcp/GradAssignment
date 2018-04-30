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
  var source = app.path + pathname;
  var mimeType = mime.getType(source);
  console.log(mimeType);
  if (extension) {
    fs.readFile(source, function(error, data) {
      if (!error) {
        console.log("No error");
        $.header("Content-Type", mimeType);
        $.end(data);
        $.return();
      } else {
        console.log("Error Page");
        handleError(error, $);
        $.return();
      }
    });
  } else {
    $.return();
  }
});
