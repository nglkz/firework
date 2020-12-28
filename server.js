var express = require('express');

var app = express();

app.use(express.static(__dirname))

app.get('/',function(req,res){
	res.send("index.html")
})

var server=app.listen(9999,function(){
	console.log(9999+'开启')
})