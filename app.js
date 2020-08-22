const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const https = require('https');

app = express();
app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static('public'));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/signup.html');
})

app.post('/', function (req, res) {
    let firstName = req.body.firstName;
    let lastName = req.body.lastName;
    let email = req.body.email;

    const data = {
        members: [{
            email_address: email,
            status: 'subscribed',
            merge_fields: {
                FNAME: firstName,
                LNAME: lastName,
            }
        }]
    }
    const jsonData = JSON.stringify(data);

    const url = "https://us17.api.mailchimp.com/3.0/lists/c7624d41bb";

    const options = {
        method: 'POST',
        auth: 'Xenon1:10a89695a48a9ff86611523b6b4da79e-us17'
    }

    const request = https.request(url, options, function (response) {
        if (response.statusCode === 200) {
            res.sendFile(__dirname + '/success.html')
        } else {
            res.sendFile(__dirname + '/failure.html')
        }
        console.log(response.statusCode)
        response.on('data', function (data) {
            console.log(JSON.parse(data));
        })
    })
    request.write(jsonData)
    request.end();
})

app.post('/failure', function (req, res) {
        res.redirect('/');
})


app.listen(process.env.PORT || 3000, function () {
    console.log('Server started on Port 3000');
})


