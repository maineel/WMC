const express =require("express");
const bodyPraser =require("body-parser");
const request=require("request");
const app=express();

app.set("view engine","ejs");
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


app.post("/",async function(req,res)
{
    if(req.body.fname!='' && req.body.lname!='' && req.body.email!='' && req.body.password!='' && req.body.phone_number!='')
    {
        const x=await Control.find({email:req.body.email});
        const y=await Control.find({password:req.body.password});

        if(x[0]!=undefined && y[0]!=undefined)
        {
            user = new User({
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
            });
        }
        else
        {
            console.log("User aldready exists");
        }
    }
    else
    {
        console.log("Please enter value for all the fields");
    }
});

app.get("/login_page", function(req,res){
    res.sendFile("C:/Users/gujar/Desktop/WMC/login_index.html");
});

app.post("/login_page",async function(req,res)
{

    var form_email=req.body.email;
    var form_password=req.body.password;

    const x=await Control.find({email:form_email});
    console.log();

    if(x[0]===undefined)
    {
        console.log("Please enter a valid email");
    }
    else
    {
        var y=x[0].password;
        if(form_password===y)
        {
            console.log("Succesfully logged in");
        }
        else
        {
            console.log("Please enter a valid password");
        }
    }
});


app.listen(3000,function(){
    console.log("Server is running on port 3000")
});
