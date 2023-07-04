const express =require("express");
const bodyPraser =require("body-parser");
const request=require("request");
const app=express();
const mongoose=require("mongoose");

mongoose.connect("mongodb://127.0.0.1/WMC",{useNewUrlParser:true});

const controlSchema=new mongoose.Schema({
    fName:String,
    lName:String,
    email:String,
    password:String,
    phone_number:Number
})

const Control=mongoose.model("Control",controlSchema);

const userSchema=new mongoose.Schema({
    fName:String,
    lName:String,
    email:String,
    password:String,
    phone_number:Number
})

const User=mongoose.model("User",userSchema);



app.use(express.static(__dirname+"/public"));
app.use(bodyPraser.urlencoded({extended:true}));

app.get("/",function(req,res){
    res.sendFile("C:/Users/gujar/Desktop/WMC/sign_up_index.html");
});


app.post("/",function(req,res)
{
    /*user = new User({
        fName: req.body.fname,
        lName: req.body.lname,
        email: req.body.email,
        password: req.body.password,
        phone_number: req.body.phone_number
    })
    user.save().then(function (doc) {
        console.log(doc._id.toString());
    }).catch(function (error) {
        console.log(error);
    });*/
    
});

app.get("/login_page",async function(req,res){
    res.sendFile("C:/Users/gujar/Desktop/WMC/login_index.html");
    /*const x=await Control.find();
    console.log(x);*/
});

app.post("/login_page",function(req,res)
{
    /*control = new Control({
        fName: "Neel",
        lName: "Sheth",
        email: req.body.email,
        password: req.body.password,
        phone_number: 9426941917
    })
    control.save().then(function (doc) {
        console.log(doc._id.toString());
    }).catch(function (error) {
        console.log(error);
    });*/

    /*Control.find(function(err,control){
        if(err){
            console.log(err);
        }
        else
        {
            console.log(control);
        }
    });*/
});


app.listen(3000,function(){
    console.log("Server is running on port 3000")
});