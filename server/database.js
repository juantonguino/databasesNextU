var mongoose= require('mongoose')
mongoose.connect('mongodb://localhost:27017/database', {useNewUrlParser: true});
EventSchema= new mongoose.Schema({title: String, start:String, end:String})

var UserSchema= new mongoose.Schema ({ name: String, password: String, events:[EventSchema]})
module.exports.User = mongoose.model('User', UserSchema );