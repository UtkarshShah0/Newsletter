
const express = require("express");
const https = require("https");
const response = require("express");


const app = express(); //instance of express
app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));//it is used to access css files, images in public folder



app.get("/", function(req, res){
    res.sendFile(__dirname+"/signup.html")  // for windows -> __dirname+"\\signup.html"
})

app.post("/", function(req, res){

    const name = req.body.Name;
    const mail = req.body.Email;


    const data ={
        members: [
            {
                email_address: mail,
                status: "subscribed",
                merge_fields: {
                    FNAME: name
                }
            }
        ] 
    };

    const jsonData = JSON.stringify(data);

    const url= "https://us14.api.mailchimp.com/3.0/lists/ee9d8716e3";

    const options = {
        method: "POST",
        auth: "utkarsh:a0ede3d027a59b09d5bd116945b0faf8-us14"
    }


    const request = https.request(url, options, function(response){

        if (response.statusCode === 200) {
            res.sendFile(__dirname+"/success.html");
        }
        else {
            res.sendFile(__dirname+"/failure.html");
        }


        response.on("data", function(data){
            console.log(JSON.parse(data));  //It is the data dent by mail chimp while sending post request
        })
    })
    //https post request stored in const request now we will use it request.write to send json data
    request.write(jsonData);
    request.end();
    console.log(name +" "+ mail);
})


app.post("/failure", function(req, res){
    res.redirect("/")
})


app.listen(process.env.PORT || 3000, function(){
    console.log("Server is running on port 3000");
})



