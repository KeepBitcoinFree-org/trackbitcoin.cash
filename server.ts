import * as dotenv from 'dotenv';
dotenv.config();
const express = require('express');
//import * as express from 'express';
import * as bodyParser from 'body-parser';
const app = express();


//import * as slpjs from 'slpjs';
//import { SlpFaucetHandler } from './slpfaucet';
import BigNumber from 'bignumber.js';

var session = require('express-session')
app.use(session({secret:'trackBitcoinCash__BCH420'}));


const request = require('request');

//bitbox in this bitch - for future dev
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
      "out.e.a": "qqs74sypnfjzkxeq0ltqnt76v5za02amfgg7frk99g"
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



function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}


// var app = express();
//import * as bodyParser from 'body-parser';
// configure Express
  app.set('views', __dirname + '/views');
 //app.use(express.static(__dirname + '/public'));


  // initial get request from user.
app.get('/', function(req, res){

// var cashAddr = 'qqs74sypnfjzkxeq0ltqnt76v5za02amfgg7frk99g';

 	let session = req.session;

 	if(!session.addressArray){
 		session.addressArray = new Array ();
 	}

// ;(async () => {
//   let res = await bitbox.BitDB.get(queryBCHaddress);
//   console.log(res.c);

// });

	// console.log(bitbox.Mnemonic.generate());


//TODO: USE COOKIES TO STORE USER ADDRESSES FOREVER & LOAD THEM.


	// return index page
  res.render('index', { addressArray: session.addressArray });
//  res.render('index', { user: req.user });


})


app.get('/login', function(req, res){
  res.render('login', { user: req.user });
});




// FAUCET CODE


function removeFromArray(userIP, address, redditId){
			//error, remove userIP & address from arrays.
          // const indexIP = users.indexOf(userIP);
          // const indexAd = addressArray.indexOf(address);
          // const indexRd = redditIdArray.indexOf(redditId);
          // if (indexIP > -1) {
          //   users.splice(indexIP, 1);
          // }
          // if (indexAd > -1) {
          // 	addressArray.splice(indexAd, 1);
          // }
          // if (indexRd > -1) {
          // 	redditIdArray.splice(indexRd, 1);
          // }
}

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

//csurf cookie thangs
//var csrf = require('csurf')
const cookieParser = require('cookie-parser');
//var csrfProtection = csrf({ cookie: true })

app.use(cookieParser());
//app.use(csrfMiddleware);


app.get('/testpay', function (req, res) {
	//startWebSocket();
	res.render('testpay', {});
})


app.post('/email', async function (req, res) {

	let session = req.session;
	let email = req.body.email;
	console.log('USER ENTERED EMAIL: ' + email);

	res.render('index', {addressArray: session.addressArray});

})


app.post('/', async function (req, res) {

	// console.log(req.POST);
	let session = req.session;
	let addressArray = session.addressArray;
	let cashAddr = req.body.address;

	(async () => {
                    // use BITBOX to get details of BCH address submitted by user
                    let details = await bitbox.Address.details(cashAddr);
                    // use BITBOX to GET BCH PRICE IN USD
                    let usd = await bitbox.Price.current('usd');
                    usd = usd / 100;

                    //console.log(details);

                    let slpaddress = details.slpAddress;

                    let bch = details.balance;
        
                    console.log('BCH BAL (cashAddr)', bch);

                    let balanceUsd = details.balance * usd;
                    console.log('USD BAL', balanceUsd);

                    let totalRec = (details.totalReceived * usd).toFixed(2);
                    let unconfirmedBalusd = (details.unconfirmedBalance * usd).toFixed(2);
                    //TODO: if $ is over 3 digits, add a comma  = $420,420
                    balanceUsd = numberWithCommas(balanceUsd.toFixed(2));

                    session.addressArray.push({
                    	'cashAddr':cashAddr,
                    	'bch': bch,
                    	'usd': balanceUsd,
                    	'totalRec': totalRec,
                    	'unconfBal': details.unconfirmedBalance,
                    	'unconfBalUsd': unconfirmedBalusd
                    })

                    res.render('index', { addressArray: addressArray});

			})()




})



app.listen(process.env.PORT, function () {
	console.log('SLP faucet server listening on port '+process.env.PORT+'!')
})

