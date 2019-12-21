var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var PersonSchema = new Schema({
    Name:{
        type: String,
       //type : Array, 
       required: "True",
        trim: "True"
    },
    EmailAddress:{
        type: String,
        required: "True",
        trim: "True"
    },
    Password:{
        type: String,
        required: "true",
        trim: "true"
    },
    Role:{
        type: String,
        required: "true",
        trim: "true"
    }
},{collection : 'Person',timestamp:"true"})  //in collection table name
module.exports = mongoose.model('Person',PersonSchema); //in model first table name and then schema name
