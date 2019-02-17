var express= require('express')
var bodyParser= require('body-parser')
var http= require('http')
var session = require("express-session");
var database= require('./database')

var port = 3000

app=express()
app.use(session({resave: true, saveUninitialized: true, secret: 'SOMERANDOMSECRETHERE', cookie: { maxAge: 60000 }}));
app.use(bodyParser.urlencoded({extended:false}))
app.use(express.static('client'))
app.use(bodyParser.json())
app.get('/api',(req,res)=>{
    res.send("info api")
})
app.post('/register',(req,res)=>{
    username= req.body.user
    pass=req.body.pass
    user = new database.User
    user.name=username
    user.password=pass
    user.save()
    res.send("OK")
})
app.post('/login',(req,res)=>{
    username= req.body.user
    pass=req.body.pass
    database.User.find({name:username, password:pass}, (err, userret)=>{
        if(userret.length>0){
            req.session.userid=userret[0]._id            
            res.send("Validado")
        }else{
            res.send("no valido")
        }
    })
    
})

app.post('/events/new',(req,res)=>{
    event= req.body
    gedtUser(req.session.userid).then((user)=>{        
        user.events.push(event)
        user.save()
        event= user.events[user.events.length-1];
        res.send(event) 
    }).catch((error)=>{console.log(error)})

})
app.get('/events/all',(req,res)=>{
    gedtUser(req.session.userid).then((user)=>{
        res.send(user.events)
        
    }).catch(err=>{
        console.log(err);
        
    });
    
})
app.post('/events/delete/:id',(req,res)=>{
    gedtUser(req.session.userid).then((user)=>{
        eventreq= req.body.id;
        console.log(eventreq);
        for(i=0; i<user.events.length; i++){
            event=user.events[i]
            if (eventreq==event._id){
                user.events.splice(i,1)
                user.save()
            }
        }
        res.send("eliminado")
    }).catch(err=>{
        console.log(err);
        
    });
    
})

app.post('/events/update',(req,res)=>{
    console.log("update")
    console.log(req.body)
    gedtUser(req.session.userid).then((user)=>{
        eventreq= req.body;
        console.log(eventreq._id);
        for(i=0; i<user.events.length; i++){
            event=user.events[i]
            if (eventreq._id==event._id){
                user.events[i]=eventreq;
                user.save()
            }
        }
        res.send("eliminado")
    }).catch(err=>{
        console.log(err);
        
    });
    
})
server=http.createServer(app);
server.listen(port,()=>{console.log("the server is running by the port: "+port)})
function gedtUser(id){
    var promise= new Promise((resolve,reject)=>{
        database.User.find({_id:id}, (err, userret)=>{
            if(err){
                reject(error.message);
                
            }
            return resolve(userret[0])
    
        })
    })
    return promise
};