//import * as dotenv from 'dotenv';
//dotenv.config();
const express = require('express');
//import * as express from 'express';
import * as bodyParser from 'body-parser';
const app = express();

//import BigNumber from 'bignumber.js';

var session = require('express-session')
app.use(session({secret:'trackBitcoinCash__BCH420'}));


const request = require('request');

//BITBOX in this bitch
 let BITBOX = require('bitbox-sdk').BITBOX;
 let bitbox = new BITBOX();
// let SLPSDK = require('slp-sdk');
// let SLP = new SLPSDK();
//let socket = new bitbox.Socket({callback: () => {console.log('Bitbox Socket connected')}, wsURL: 'wss://ws.bitcoin.com'});

// SLPDB queries
/*
const queryAllUnconf2Faucet = {
  "v": 3,
  "q": {
    "db": ["u"],
    "find": {
      "out.e.a": "simpleledger:address"
    }
  }
}

const queryAllUnconf = {
  "v": 3,
  "q": {
    "db": ["u"],
    "find": {
    },
    "limit": 25
  }
}
*/

// deal with numbers with commas
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// configure Express
app.set('views', __dirname + '/views');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');


//csurf cookie thangs
//var csrf = require('csurf')

//parser for our cookies
const cookieParser = require('cookie-parser');
//var csrfProtection = csrf({ cookie: true })

app.use(cookieParser());
//app.use(csrfMiddleware);



  // initial GET REQ from USER.
app.get('/', function(req, res){

// var cashAddr = 'qqs74sypnfjzkxeq0ltqnt76v5za02amfgg7frk99g';

// initialize the session from the request.
  let session = req.session;

 // console.log(session);
// if session addressArray doesn't exist, create a new one to store addresses
  if(!session.addressArray){
    session.addressArray = new Array ();
  }


// return index page
  res.render('index', { addressArray: session.addressArray, errorAddress: null, errorEmail: null });

})




// TEST PAGE FOR FUTURE DEV
app.get('/testpay', function (req, res) {
  //startWebSocket();
  res.render('testpay', {});
})


// write to file
var fs = require('fs')


// EMAIL SIGN UP, just add to a log file.
app.post('/email', async function (req, res) {

  let session = req.session;
  let email = req.body.email;


  fs.appendFile('emails.txt', email, function (err) {

  if (err) {
    // append failed
  } else {
    // done
    }
  })

  // render the page, pass back in the session addressArray for user
  res.render('index', {addressArray: session.addressArray,  errorAddress: null, errorEmail: null });

})


app.post('/', async function (req, res) {

//  console.log(req.session);
  // console.log(req.POST);
  let session = req.session;
  let addressArray = session.addressArray;
  if(!session.addressArray){
    session.addressArray = new Array();
  }
  let cashAddr = req.body.address;

  (async () => {
    try{


                    // use BITBOX to get details of BCH address submitted by user
                    let details = await bitbox.Address.details(cashAddr);
                    // use BITBOX to GET BCH PRICE IN USD
                    let usd = await bitbox.Price.current('usd');
                    usd = usd / 100;

                    //console.log(details);

                    let slpaddress = details.slpAddress.trim();

                    let bch = details.balance;

                   // console.log('BCH BAL (cashAddr)', bch);

                    let balanceUsd = details.balance * usd;
                  //  console.log('USD BAL', balanceUsd);

                    let totalRec = (details.totalReceived * usd).toFixed(2);
                    let unconfirmedBalusd = (details.unconfirmedBalance * usd).toFixed(2);

                    balanceUsd = numberWithCommas(balanceUsd.toFixed(2));

                    session.addressArray.push({
                      'cashAddr':cashAddr,
                      'bch': bch,
                      'usd': balanceUsd,
                      'totalRec': totalRec,
                      'unconfBal': details.unconfirmedBalance,
                      'unconfBalUsd': unconfirmedBalusd
                    })

                    res.render('index', { addressArray: addressArray, errorAddress: null, errorEmail: null});
        }catch(error){
          console.log(error);
          res.render('index', { addressArray: addressArray, errorAddress: error, errorEmail: null});
        }

      })()


})

const port = 8081;

app.listen(port, function () {
  console.log('TrackBitcoin.Cash server is listening on port '+port+'!')
})
