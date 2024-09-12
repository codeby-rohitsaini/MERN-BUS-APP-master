var express = require('express');
var router = express.Router();
var User = require('../models/User')
var bcrypt = require('bcrypt');
var moment = require('moment');
var bodyParser = require('body-parser')
const nodemailer = require("nodemailer");
const twilio = require('twilio');

const accountSid = process.env.SID;
const authToken = process.env.TOKEN;
const client = new twilio(accountSid, authToken);

router.post('/verify-otp',(req, res) => {
    const { enteredOtp, generatedOtp} = req.body;
    if(enteredOtp !== generatedOtp) {
        res.status(400).json({msg: 'Otp verification failed'});
    }else{
        res.status(200).json({msg: 'Otp verification successfully'});
    }
})


router.get('/', (req, res) => {
    res.send("Register Here")
});

//Body-Parser
var jsonParser = bodyParser.json()

router.post('/', jsonParser, async (req, res) => {
    //Hash Password 
    const hashPassword = await bcrypt.hash(req.body.password, 10)
    
    const Otp = Math.floor(100000 + Math.random() * 900000).toString(); // Generate 6-digit OTP
    console.log(Otp)

    let user = {
        name: req.body.name,
        email: req.body.email,
        password: hashPassword,
        mobile: req.body.mobile,
        gender: req.body.gender,
        Otp: Otp,
        dob: moment(req.body.dob).format('YYYY-MM-DD')
    }
    let newUser = new User(user)

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.USER,
          pass: process.env.PASS,
        },
      });

      async function main(email) {
        // send mail with defined transport object
        const info = await transporter.sendMail({
          from: '"Rohit Saini" <rs8307627706@gmail.com>', // sender address
          to: email, // list of receivers
          subject: "Bus reservation", // Subject line
          text: "Hello world?", // plain text body
          html: "You area successfully registered to bus reservation. </b>", // html body
        });
      
        console.log("Message sent: %s", info.messageId);
        // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
      }
     
      //twilio code
      const sendOTP = (phoneNumber,Otp) => {
      
        client.messages.create({
            body: `Your OTP code is ${Otp}`,
            to: phoneNumber,  // Text this number
            from: '+16418631779' // From a valid Twilio number
        })
        .then((message) => {
            console.log('OTP sent:', message.sid);
            // localStorage.setItem('otp', otp);
            // localStorage.setItem('phoneNumber', phoneNumber);
        })
        .catch((error) => console.error('Error sending OTP:', error));
      };
    
    // console.log(newUser)
    newUser.save((err, reslut) => {
        if (err) {
            console.log(err);
        }
        
        else {
            main(req.body.email).catch(console.error);
            sendOTP(req.body.mobile,Otp);
            // console.log(reslut)
            res.status(201).json(reslut)
        }
    })


});



module.exports = router;
