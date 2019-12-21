var express = require('express');
var mongoose = require('mongoose');
var chalk = require('chalk');
var app = express();
var person = require('./Routes/personRouite');
app.use(express.json());

mongoose.connect("mongodb://localhost:27017/sampledemo",{});
mongoose.connection.on('error',function(error) {
    console.log(chalk.red("An error occur while connecting to database"));
    process.exit(1)
}).once('open',function(){
    console.log(chalk.blue("Successfully connect to database"));
})
app.use('/person',person)

app.listen(3001,function(error){
    if(error){
        console.log(chalk.red("An error occur while connecting to the localhost"));
    }
    console.log(chalk.blue("Successfully connected to localhost http://localhost:3000"));
})

