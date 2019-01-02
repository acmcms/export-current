var example = require("exampleModule");

if( example.exampleMethod("Arg") != "exampleMethod(Arg)" ) throw "bad method";
if( example.exampleField != "exampleField" ) throw "bad field";