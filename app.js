const express = require("express");
const bodyPraser = require("body-parser");
const request = require("request");
const session = require('express-session');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');
const https = require("https");
const app = express();

app.set("view engine", "ejs");
const mongoose = require("mongoose");
const { METHODS } = require("http");
app.use(express.static(__dirname));
app.use(bodyPraser.urlencoded({ extended: true }));

app.use(session({
    secret: "We are the beasts of the wizarding world.",
    resave: false,
    saveUninitialized: false
}))

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb://127.0.0.1/WMC", { useNewUrlParser: true });
//mongoose.set("useCreateIndex",true);

const controlSchema = new mongoose.Schema({
    fName: String,
    lName: String,
    email: String,
    password: String,
    phone_number: Number
})

const Control = mongoose.model("Control", controlSchema);

const flightSchema = new mongoose.Schema({
    username:String,
    flight_details:Object,
    ticket_details:Object
})

const Flight = mongoose.model("Flight", flightSchema);

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    name:String
})

userSchema.plugin(passportLocalMongoose);

const User = mongoose.model("User", userSchema);

passport.use(User.createStrategy());
passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});

const placesSchema = new mongoose.Schema({
    img_name: String,
    heading: String,
    description: String,
    card_title: String,
    img_class: String
})

const Place = mongoose.model("Place", placesSchema);

app.get("/sign_up_page", function (req, res) {
    res.render("sign_up_index");
});


app.post("/sign_up_page", async function (req, res) {
    /*if(req.body.fname!='' && req.body.lname!='' && req.body.email!='' && req.body.password!='' && req.body.phone_number!='')
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
    }*/
    User.register({ username: req.body.username, name:req.body.name }, req.body.password, function (err, user) {
        if (err) {
            console.log(err);
        }
        else {
            if (user) {
                passport.authenticate("local")(req, res, function () {
                    res.redirect("/");
                });
            }
        }
    });
});

app.get("/login_page", function (req, res) {
    res.render("login_index");
});

var logged_in_user;
app.post("/login_page", async function (req, res) {

    /*var form_email=req.body.email;
    var form_password=req.body.password;

    const x=await User.find({email:form_email});
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
    }*/
    const user = new User({
        username: req.body.username,
        password: req.body.password
    });
    req.login(user, function (err) {
        if (err) {
            console.log(err);
        }
        else {
            if (user) {
                passport.authenticate("local")(req, res, function () {
                    logged_in_user=req.user.username;
                    console.log(logged_in_user);
                    res.redirect("/");
                });
            }
        }
    });
});

app.get("/", function (req, res) {
    if (req.isAuthenticated()) {
        res.render("landing_index");
    }
    else {
        res.redirect("/login_page");
    }
});

var places_v1;
app.get("/places", async function (req, res) {
    places_v1 = await Place.find({});
    await res.render("places_index", { places: places_v1 });
});

app.post("/places",async function(req,res){
    var str=req.body.search_btn;
    var str1=str.substring(0, str.indexOf(' ')); 
    var str2=str.substring(str.indexOf(' ') + 1);
    var str3=str1.substring(0,1);
    var str4=str1.substring(1,str1.length);
    var str5=str2.substring(0,1);
    var str6=str2.substring(1,str2.length);
    var place_name=str3.toUpperCase()+str4.toLowerCase()+" "+str5.toUpperCase()+str6.toLowerCase();
    places_v1 = await Place.find({heading:place_name});
    await res.render("places_index", { places: places_v1 });
    console.log(place_name);
});

app.get("/add_places", function (req, res) {
    res.render("add_places");
});

app.post("/add_places", async function (req, res) {
    if (req.body.img_name != '' && req.body.heading != '' && req.body.description != '' && req.body.card_title != '' && req.body.img_class != '') {
        const x = await Place.find({ heading: req.body.heading });

        if (x[0] === undefined) {
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
            places_v1 = await Place.find({});
            res.redirect("/places");
        }
        else {
            console.log("Place aldready exists");
        }
    }
    else {
        console.log("Please enter value for all the fields");
    }
});

app.get("/flight_book", function (req, res) {
    res.render("flight_book");
})

var from, to, airline_class, adults, infants, children, arrival_date, departure_date, nonstop, currency;

app.post("/flight_book", function (req, res) {
    from = req.body.from;
    to = req.body.to;
    infants = req.body.infants;
    airline_class = req.body.airline_class;
    adults = req.body.adults;
    arrival_date = req.body.arrival_date;
    departure_date = req.body.departure_date;
    children = req.body.children;
    nonstop = req.body.nonstop;
    currency = req.body.currency;
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

var flight_details, flights = [];
app.get("/flight_details", async function (req, res) {
    access_token = await getAccessToken("rEwzGVYgsiG0tnWzuNXG0s7sGEDXitZ0", "zBEQyAQru0SBqRAe");
    console.log(access_token);
    var url = "https://test.api.amadeus.com/v2/shopping/flight-offers?";
    url = url + "originLocationCode=" + from + "&destinationLocationCode=" + to + "&departureDate=" + departure_date;
    if (isValidDate(arrival_date)) {
        url = url + "&returnDate=" + arrival_date;
    }
    url = url + "&adults=" + adults;
    if (children != 0) {
        url = url + "&children=" + children;
    }
    if (infants != 0) {
        url = url + "&infants=" + infants;
    }
    if (airline_class != "Preferred Class") {
        url = url + "&travelClass=" + airline_class;
    }
    if (nonstop != "Flight type") {
        url = url + "&nonStop=" + nonstop;
    }
    if (currency != "Currency") {
        url = url + "&currencyCode=" + currency;
    }
    if (isValidDate(arrival_date)) {
        url = url + "&max=4";
    }
    else {
        url = url + "&max=4";
    }
    const options = {
        headers: {
            Authorization: 'Bearer ' + access_token
        }
    }
    var count;
    var return_stops, return_duration, return_departure_code, return_arrival_code, return_departure_terminal, return_arrival_terminal, return_departure_time, return_arrival_time, return_carrier_code, carrier_name;
    var id, bookableSeats, stops, duration, departure_code, arrival_code, departure_terminal, arrival_terminal, departure_time, arrival_time, carrier_code, total, data_currency, additional_services;
    https.get(url, options, function (response) {
        console.log(response.statusCode);
        response.on("data", async function (data) {
            flight_details = JSON.parse(data);
            //console.log(flight_details.data[0]);
            if (response.statusCode === 200) {
                count = flight_details.meta.count;
                if (count != 0) {
                    for (let i = 0; i < count; i++) {
                        id = i;
                        bookableSeats = flight_details.data[i].numberOfBookableSeats;
                        stops = flight_details.data[i].itineraries[0].segments[0].numberOfStops;
                        duration = flight_details.data[i].itineraries[0].duration;
                        departure_code = flight_details.data[i].itineraries[0].segments[0].departure.iataCode;
                        departure_time = flight_details.data[i].itineraries[0].segments[0].departure.at;
                        departure_terminal = flight_details.data[i].itineraries[0].segments[0].departure.terminal;
                        arrival_code = flight_details.data[i].itineraries[0].segments[0].arrival.iataCode;
                        arrival_time = flight_details.data[i].itineraries[0].segments[0].arrival.at;
                        arrival_terminal = flight_details.data[i].itineraries[0].segments[0].arrival.terminal;
                        carrier_code = flight_details.data[i].itineraries[0].segments[0].carrierCode;
                        total = flight_details.data[i].price.grandTotal;
                        data_currency = flight_details.data[i].price.currency;
                        additional_services = flight_details.data[i].price.additionalServices;
                        if (isValidDate(arrival_date)) {
                            return_stops = flight_details.data[i].itineraries[1].segments[0].numberOfStops;
                            return_duration = flight_details.data[i].itineraries[1].duration;
                            return_departure_code = flight_details.data[i].itineraries[1].segments[0].departure.iataCode;
                            return_departure_time = flight_details.data[i].itineraries[1].segments[0].departure.at;
                            return_departure_terminal = flight_details.data[i].itineraries[1].segments[0].departure.terminal;
                            return_arrival_code = flight_details.data[i].itineraries[1].segments[0].arrival.iataCode;
                            return_arrival_time = flight_details.data[i].itineraries[1].segments[0].arrival.at;
                            return_arrival_terminal = flight_details.data[i].itineraries[1].segments[0].arrival.terminal;
                            return_carrier_code = flight_details.data[i].itineraries[1].segments[0].carrierCode;
                            var flight = {
                                id: id,
                                bookableSeats: bookableSeats,
                                stops: stops,
                                duration: duration,
                                departure_code: departure_code,
                                departure_terminal: departure_terminal,
                                departure_time: departure_time.substring(11),
                                arrival_code: arrival_code,
                                arrival_terminal: arrival_terminal,
                                arrival_time: arrival_time.substring(11),
                                carrier_code: carrier_code,
                                total: total,
                                data_currency: data_currency,
                                additional_services: additional_services,
                                return_stops:return_stops,
                                return_duration:return_duration,
                                return_departure_code:return_departure_code,
                                return_departure_time:return_departure_time,
                                return_departure_terminal:return_departure_terminal,
                                return_carrier_code:return_carrier_code,
                                return_arrival_code:return_arrival_code,
                                return_arrival_time:return_arrival_time,
                                return_arrival_terminal:return_arrival_terminal,
                                departure_date:departure_date,
                                airline_class:airline_class
                            };
                        }
                        else
                        {
                            var flight = {
                                id: id,
                                departure_date:departure_date,
                                bookableSeats: bookableSeats,
                                stops: stops,
                                duration: duration,
                                departure_code: departure_code,
                                departure_terminal: departure_terminal,
                                departure_time: departure_time.substring(11),
                                arrival_code: arrival_code,
                                arrival_terminal: arrival_terminal,
                                arrival_time: arrival_time.substring(11),
                                carrier_code: carrier_code,
                                total: total,
                                data_currency: data_currency,
                                additional_services: additional_services,
                                airline_class:airline_class
                            };
                        }
                        flights[i] = flight;
                    }
                    if(isValidDate(arrival_date))
                    {
                        res.render("flight_details_ret", { flights: flights });
                    }
                    else
                    {
                        res.render("flight_details", { flights: flights });
                    }
                }
                else {
                    res.redirect("/flight_book")
                }
            }
        })
    });
});

var flight_no;
app.post("/flight_details",function (req,res) {
    flight_no=req.body.id;
    res.redirect("/ticket_details");
});


app.get("/ticket_details", function (req, res) {
    if (req.isAuthenticated()) {
        console.log(req.user.username);
        res.render("ticket_details", { adults: adults, infants: infants, children: children });
    }
    else {
        res.redirect("/login_page");
    }
});

var ticket_detail;
app.post("/ticket_details",function(req,res){
    ticket_detail={
        name_details:req.body.Name,
        email_details:req.body.Email,
        phoneno_details:req.body.Phoneno
    };
    res.redirect("/payment");
});

app.get("/payment",function(req,res){
    res.render("payment");
});

app.post("/payment",function(req,res){
    flight = new Flight({
        username:logged_in_user,
        flight_details:flights[flight_no],
        ticket_details:ticket_detail
    })
    flight.save().then(function (doc) {
        console.log(doc._id.toString());
    }).catch(function (error) {
        console.log(error);
    });
    res.redirect("/");
});

app.get("/download_ticket",async function(req,res){
    var flights=await Flight.find({username : "kevaljuthani99@gmail.com" });
    //console.log(flights);
    res.render("ticket",{flights: flights});
})

app.listen(3000, function () {
    console.log("Server is running on port 3000")
});


/*var url2="https://test.api.amadeus.com/v1/reference-data/airlines?airlineCodes="+carrier_code[i];
                            https.get(url2,options,function(response2){
                                console.log(response2.statusCode);
                                response2.on("data2",async function(data2){
                                    carrier_details=JSON.parse(data2);
                                    console.log(carrier_details.data[0].businessName);
                                    carrier_name[i]=carrier_details.data[0].businessName;
                                })
                            });*/


/*var hotelid=[];
app.get("/hotel_search",async function(req,res){
    access_token=await getAccessToken("rEwzGVYgsiG0tnWzuNXG0s7sGEDXitZ0","zBEQyAQru0SBqRAe");
    console.log(access_token);
    var url="https://test.api.amadeus.com/v1/reference-data/locations/hotels/by-city?cityCode="+"NCL"+"&radius=5&ratings=4";
    const options = {
        headers: {
            Authorization: 'Bearer '+access_token
        }
    };

    https.get(url,options,function(response){
        console.log(response.statusCode);
        response.on("data",async function(data){
            hotel_details=JSON.parse(data);
            console.log(hotel_details);
            for(let i=0;i<hotel_details.meta.count;i++)
            {
                hotelid[i]=hotel_details.data[i].hotelId;
            }
        });
    });
    res.redirect("/hotel_details");
});

app.get("/hotel_details",async function(req,res){
    access_token=await getAccessToken("rEwzGVYgsiG0tnWzuNXG0s7sGEDXitZ0","zBEQyAQru0SBqRAe");
    console.log(access_token);
    var url="https://test.api.amadeus.com/v3/shopping/hotel-offers?";
    const options = {
        headers: {
            Authorization: 'Bearer '+access_token
        }
    };
    url=url+"hotelIds="+hotelid;
    url=url+"&adults="+adults+"&checkInDate="+checkindate+"&checkOutDate="+checkoutdate; 
    if(rooms!=undefined){
        url=url+"&roomQuantity="+rooms;
    }
    if(boardtype!=undefined){
        url=url+"&boardtype="+boardtype;
    }
    if(payment_currency!=undefined){
        url=url+"&currency="+payment_currency;
    }
});*/