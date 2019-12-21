var express = require('express');
var Person = require('../Schema/personSchema');
var Router = express.Router();
var chalk = require('chalk');
var validator = require('validator');
var jwthelper = require('jsonwebtoken');
var decodeddata;

Router.use('',function(req,res,next){
    if(req.headers.authorization){
        decodeddata = jwthelper.verify(req.headers.authorization,"secert");
        if(decodeddata){
            if(decodeddata.Role == "Admin")
                return next();
            else if(decodeddata.Role == "write" && req.method!="DELETE" && req.method!="POST")
                return next();
            else if(decodeddata.Role == "read" && req.method == "GET")
                return next();
            else
                return res.json("Ypu do not have any permission")
        }
        console.log(chalk.red("Decoded data not found"));
        return res.status(401).send("401 error please pass the token");
    }
})

Router.get('/login/:id',async function(req,res){
    try{
        var id = req.params.id;
        var loginuser = await Person.findById(id);
        var token = jwthelper.sign({Name:loginuser.Name,Role:loginuser.Role,_id:loginuser._id},"secert",{})
        console.log(token)
        console.log(chalk.green("Successfully login"));
        return res.json(loginuser)
    }catch(e){
        console.log(chalk.red("An error occur at time of login"));
        return res.status(500).send("An error occur at time of login");
    }
})

Router.post('/createperson',async function(req,res){
    try{
        var body = req.body;
        var email = req.body.EmailAddress;
        var validemail = validator.isEmail(email);
        if(validemail){
            var person = new Person(body);
            var createperson = await person.save();
            console.log(chalk.green("Successfully created a person"));
            return res.json(createperson);
        }
        else
            console.log(chalk.red("Please enter valid email address"));
            return res.status(500).send("Please enter valid email address")
    }catch(e){
        console.log(chalk.red("An error while createing a person"));
        return res.status(500).send('An error occur while creating a person')
    }
})


Router.get('/',async function(req,res){
    try{
        var persondetail = await Person.find({})
        console.log(chalk.green("Successfully listed the person's details"))
        return res.json(persondetail);
    }catch(e){
        console.log(chalk.red("An error occur while listing the person details"));
        return res.status(500).send("An error occur while listing a person details")
    }
})

Router.get('/specificperson/:id',async function(req,res){
    try{
        var id = req.params.id;
        var specificperson = await Person.findById(id);
        if(specificperson == null)
             return res.json("Data does not exists");
        console.log(chalk.green("Successfully fetch a particular record"))
        return res.json(specificperson);
    }catch(e){
        if(decodeddata.Role == "Admin")
            return res.json("Data not found");
        else
            return res.status(403).send("403 error data not found");
    }
})

Router.put('/updateperson/:id',function(req,res,next){
    console.log(decodeddata);
    if(decodeddata.Role == 'write'){
        console.log("decoded id",decodeddata._id);
        console.log("params id",req.params.id)
        if(decodeddata._id == req.params.id)
            return next();
        else    
            console.log(chalk.red("You dont have any permission"));
            return res.json("You dont have any permission");
    }
    else    
        return next();
},async function(req,res){
    try{
        var data = req.body;
        var id = req.params.id;
        var updateperson = await Person.findByIdAndUpdate(id,data);
        console.log(chalk.green("Successfully update a particular record"));
        return res.status(200).send("Successfully updated a particular record");
    }catch(e){
        console.log(chalk.red("An error occur while updating a specific person"));
        return res.status(500).send("An error occur while updating a specific person");
    }
})

Router.delete('/deleteperson/:id',async function(req,res){
    try{
        var id = req.params.id;
        var deleteperson = await Person.findByIdAndDelete(id);
        if(deleteperson == null)
        {
            console.log(chalk.red("Record not found"));
            return res.json("Record not found")
        }
        console.log(chalk.green("Successfully deleted record"));
        return res.json(deleteperson);
    }catch(e){
        console.log(chalk.red("An error occur while deleteing a specific person"));
        return res.status(500).send("An error occur while deleteing a specific person");
    }
})
module.exports = Router;