const express =require("express");
const bodyPraser =require("body-parser");
const request=require("request");
const encrypt=require("mongoose-encryption");
const https=require("https");
const app=express();

app.set("view engine","ejs");
const mongoose=require("mongoose");
const { METHODS } = require("http");

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

var from,to,airline_class,adults,infants,children,arrival_date,departure_date,nonstop,currency;

app.post("/flight_book",function(req,res){
    from=req.body.from;
    to=req.body.to;
    infants=req.body.infants;
    airline_class=req.body.airline_class;
    adults=req.body.adults;
    arrival_date=req.body.arrival_date;
    departure_date=req.body.departure_date;
    children=req.body.children;
    nonstop=req.body.nonstop;
    currency=req.body.currency;
    res.redirect("/flight_details");
    //console.log(from+" "+to+" "+infants+" "+children+" "+adults+" "+arrival_date+" "+departure_date+" "+nonstop+" "+currency+" "+airline_class);
})

/*app.get("/flight_details",async function(req,res){
    await res.render("flight_details",{from:from,to:to,airline:airline,airline_class:airline_class,passengers:passengers,arrival_date:arrival_date,departure_date,departure_date});
});*/


    // Function to get the access token
    function getAccessToken(clientId, clientSecret) {
        return new Promise((resolve, reject) => {
        const tokenEndpoint = 'https://test.api.amadeus.com/v1/security/oauth2/token';
        const authString = `${clientId}:${clientSecret}`;
        const base64AuthString = Buffer.from(authString).toString('base64');
    
        const options = {
            method: 'POST',
            headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Basic ${base64AuthString}`
            }
        };
    
        const req = https.request(tokenEndpoint, options, (res) => {
            let data = '';
    
            res.on('data', (chunk) => {
            data += chunk;
            });
    
            res.on('end', () => {
            if (res.statusCode >= 200 && res.statusCode < 300) {
                const response = JSON.parse(data);
                resolve(response.access_token);
            } else {
                reject(new Error(`Failed to get access token. Status code: ${res.statusCode}`));
            }
            });
        });
    
        req.on('error', (error) => {
            reject(error);
        });
    
        req.write('grant_type=client_credentials');
        req.end();
        });
    }

    function isValidDate(dateString) {
        // Regular expression for date in the format 'YYYY-MM-DD'
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      
        return dateRegex.test(dateString);
      }
      
var flight_details;
app.get("/flight_details",async function(req,res)
{
    access_token=await getAccessToken("rEwzGVYgsiG0tnWzuNXG0s7sGEDXitZ0","zBEQyAQru0SBqRAe");
    console.log(access_token);
    var url="https://test.api.amadeus.com/v2/shopping/flight-offers?";
    url=url+"originLocationCode="+from+"&destinationLocationCode="+to+"&departureDate="+departure_date;
    if(isValidDate(arrival_date))
    {
        url=url+"&returnDate="+arrival_date;
    }
    url=url+"&adults="+adults;
    if(children!=0)
    {
        url=url+"&children="+children;
    }
    if(infants!=0)
    {
        url=url+"&infants="+infants;
    }
    if(airline_class!="Preferred Class")
    {
        url=url+"&travelClass="+airline_class;
    }
    if(nonstop!="Flight type")
    {
        url=url+"&nonStop="+nonstop;
    }
    if(currency!="Currency")
    {
        url=url+"&currencyCode="+currency;
    }
    if(isValidDate(arrival_date))
    {
        url=url+"&max=4";
    }
    else
    {
        url=url+"&max=7";
    }
    const options = {
        headers: {
            Authorization: 'Bearer '+access_token
        }
    }
    var count;
    var return_stops=[],return_duration=[],return_departure_code=[],return_arrival_code=[],return_departure_terminal=[],return_arrival_terminal=[],return_departure_time=[],return_arrival_time=[],return_carrier_code=[];
    var bookableSeats=[],stops=[],duration=[],departure_code=[],arrival_code=[],departure_terminal=[],arrival_terminal=[],departure_time=[],arrival_time=[],carrier_code=[],total=[],data_currency=[],additional_services=[];
    https.get(url,options,function(response){
        console.log(response.statusCode);
        response.on("data",async function(data){
            flight_details=JSON.parse(data);
            console.log(flight_details.data[0]);
            if(response.statusCode===200)
            {
                count=flight_details.meta.count;
                if(count!=0)
                {
                    for(let i=0;i<count;i++)
                    {
                        bookableSeats[i]=flight_details.data[i].numberOfBookableSeats;
                        stops[i]=flight_details.data[i].itineraries[0].segments[0].numberOfStops;
                        duration[i]=flight_details.data[i].itineraries[0].duration;
                        departure_code[i]=flight_details.data[i].itineraries[0].segments[0].departure.iataCode;
                        departure_time[i]=flight_details.data[i].itineraries[0].segments[0].departure.at;
                        departure_terminal[i]=flight_details.data[i].itineraries[0].segments[0].departure.terminal;
                        arrival_code[i]=flight_details.data[i].itineraries[0].segments[0].arrival.iataCode;
                        arrival_time[i]=flight_details.data[i].itineraries[0].segments[0].arrival.at;
                        arrival_terminal[i]=flight_details.data[i].itineraries[0].segments[0].arrival.terminal;
                        carrier_code[i]=flight_details.data[i].itineraries[0].segments[0].carrierCode;
                        total[i]=flight_details.data[i].price.grandTotal;
                        data_currency[i]=flight_details.data[i].price.currency;
                        additional_services[i]=flight_details.data[i].price.additionalServices;
                        if(isValidDate(arrival_date))
                        {
                            return_stops[i]=flight_details.data[i].itineraries[1].segments[0].numberOfStops;
                            return_duration[i]=flight_details.data[i].itineraries[1].duration;
                            return_departure_code[i]=flight_details.data[i].itineraries[1].segments[0].departure.iataCode;
                            return_departure_time[i]=flight_details.data[i].itineraries[1].segments[0].departure.at;
                            return_departure_terminal[i]=flight_details.data[i].itineraries[1].segments[0].departure.terminal;
                            return_arrival_code[i]=flight_details.data[i].itineraries[1].segments[0].arrival.iataCode;
                            return_arrival_time[i]=flight_details.data[i].itineraries[1].segments[0].arrival.at;
                            return_arrival_terminal[i]=flight_details.data[i].itineraries[1].segments[0].arrival.terminal;
                            return_carrier_code[i]=flight_details.data[i].itineraries[1].segments[0].carrierCode;
                        }
                    }
                    console.log(bookableSeats);
                    console.log(stops);
                    console.log(duration);
                    console.log(departure_code);
                    console.log(departure_terminal);
                    console.log(departure_time);
                    console.log(arrival_code);
                    console.log(arrival_terminal);
                    console.log(arrival_time);
                    console.log(carrier_code);
                    console.log(return_stops);
                    console.log(return_duration);
                    console.log(return_departure_code);
                    console.log(return_departure_terminal);
                    console.log(return_departure_time);
                    console.log(return_arrival_code);
                    console.log(return_arrival_terminal);
                    console.log(return_arrival_time);
                    console.log(return_carrier_code);
                    console.log(total);
                    console.log(data_currency);
                    console.log(additional_services);
                }
            }
        })
    });

        
});

app.listen(3000,function(){
    console.log("Server is running on port 3000")
});

