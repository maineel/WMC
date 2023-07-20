const express =require("express");
const bodyPraser =require("body-parser");
const request=require("request");
const encrypt=require("mongoose-encryption");
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

const secret="WelcomeToTheWorldOfHarryPotter";
userSchema.plugin(encrypt,{secret: secret, encryptedFields:["password"]});

const placesSchema=new mongoose.Schema({
    img_name:String,
    heading:String,
    description:String,
    card_title:String,
    img_class:String
})

const Place=mongoose.model("Place",placesSchema);

app.use(express.static(__dirname));
app.use(bodyPraser.urlencoded({extended:true}));

app.get("/sign_up_page",function(req,res){
    res.sendFile("C:/Users/gujar/Desktop/WMC/sign_up_index.html");
});


app.post("/sign_up_page",async function(req,res)
{
    if(req.body.fname!='' && req.body.lname!='' && req.body.email!='' && req.body.password!='' && req.body.phone_number!='')
    {
        const x=await User.findOne({email:req.body.email});
        console.log(x);
        if(x!=null)
        {
            console.log("User aldready exists");
        }
        else
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

app.get("/",function(req,res){
    res.sendFile("C:/Users/gujar/Desktop/WMC/landing_index.html");
});

var places_v1;
app.get("/places",async function(req,res){
    places_v1=await Place.find({});
    await res.render("places_index",{places:places_v1});
});

app.get("/add_places",function(req,res){
    res.render("add_places");
});

app.post("/add_places",async function(req,res){
    if(req.body.img_name!='' && req.body.heading!='' && req.body.description!='' && req.body.card_title!='' && req.body.img_class!='')
    {
        const x=await Place.find({heading:req.body.heading});

        if(x[0]===undefined)
        {
            place = new Place({
                img_name: req.body.img_name,
                heading: req.body.heading,
                description: req.body.description,
                card_title: req.body.card_title,
                img_class: req.body.img_class
            })
            place.save().then(function (doc) {
                console.log(doc._id.toString());
            }).catch(function (error) {
                console.log(error);
            });
            places_v1=await Place.find({});
            res.redirect("/places");
        }
       else
        {
            console.log("Place aldready exists");
        }
    }
    else
    {
        console.log("Please enter value for all the fields");
    }
});

app.get("/flight_book",function(req,res){
    res.render("flight_book");
})

var from,to,airline,airline_class,passengers,arrival_date,departure_date;

app.post("/flight_book",function(req,res){
    from=req.body.from;
    to=req.body.to;
    airline=req.body.airline;
    airline_class=req.body.airline_class;
    passengers=req.body.passengers;
    arrival_date=req.body.arrival_date;
    departure_date=req.body.departure_date;
})

app.get("/flight_details",async function(req,res){
    await res.render("flight_details",{from:from,to:to,airline:airline,airline_class:airline_class,passengers:passengers,arrival_date:arrival_date,departure_date,departure_date});
});

app.listen(3000,function(){
    console.log("Server is running on port 3000")
});
