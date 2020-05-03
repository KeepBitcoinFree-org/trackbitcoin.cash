import * as dotenv from 'dotenv';
dotenv.config();
const express = require('express');
//import * as express from 'express';
import * as bodyParser from 'body-parser';
const app = express();

//import BigNumber from 'bignumber.js';

//var session = require('express-session')
//app.use(session({secret:'trackBitcoinCash__BCH420'}));


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
//const cookieSession = require('cookie-session');

app.use(cookieParser());
//app.use(csrfMiddleware);



  // ************ initial GET REQ from USER. *************
app.get('/', function(req, res){

// var cashAddr = 'qqs74sypnfjzkxeq0ltqnt76v5za02amfgg7frk99g';

// initialize the session from the request. 
 // let session = req.session;

 // console.log(req.cookies);
 // console.log(req.cookies['trackbitcoin.cash']);

let addressArray = req.cookies['trackbitcoin.cash'];

 if(!addressArray){
  addressArray = new Array ();
  res.cookie('trackbitcoin.cash', addressArray, { expire: 2147483647, httpOnly: true });
  res.render('index', { addressArray: addressArray, errorAddress: null, errorEmail: null });
 }else{
 
  // let addressArray = req.cookies['trackbitcoin.cash'];
  let usersAddresses = new Array();

 // let cashAddr = req.body.address.trim();
  let errorAddress = null;

// console.log('addressArray', addressArray);

    let x = 0;
  
    addressArray.forEach(function(value){
      x++;
  //  console.log(value.cashAddr);

    if(usersAddresses.indexOf(value.cashAddr) == -1){
      usersAddresses.push(value.cashAddr);
    }

    });

    // if(usersAddresses.indexOf(cashAddr) == -1){
    //   usersAddresses.push(cashAddr);
    // }

   //  if(x == 0){
   //     console.log('addressArray doesnt exist, lets add the submitted address')

   // //     usersAddresses.push(cashAddr);

   //    }

  // console.log('usersAddresses', usersAddresses);
  


if(usersAddresses.length > 0){
 (async () => {
    try{
                    // use BITBOX to get details of BCH address submitted by user
                    let details = await bitbox.Address.details(usersAddresses);
                    // use BITBOX to GET BCH PRICE IN USD

                    let addressArray = [];
                    let usd = await bitbox.Price.current('usd');
                    usd = usd / 100;

                details.forEach(function(address){

                 // console.log(address);
                    //console.log(details);

                    var cashAddress;

                    let slpaddress = address.slpAddress.trim();

                    let bch = address.balance;
        
                   // console.log('BCH BAL (cashAddr)', bch);

                    let balanceUsd = address.balance * usd;
                  //  console.log('USD BAL', balanceUsd);

                    let totalRec = address.totalReceived;

                    let totalRecUsd = (address.totalReceived * usd).toFixed(2);

                    let unconfirmedBal = address.unconfirmedBalance;
                    let unconfirmedBalusd = numberWithCommas((address.unconfirmedBalance * usd).toFixed(2));

                    //console.log(unconfirmedBal);
                    balanceUsd = numberWithCommas(balanceUsd.toFixed(2));

                    // console.log(usersAddresses.indexOf(address.cashAddress));
                    // console.log(usersAddresses.indexOf(address.legacyAddress));
                    // console.log(usersAddresses.indexOf(address.slpAddress));

                    if(usersAddresses.indexOf(address.cashAddress) !== -1){
                      cashAddress = address.cashAddress;
                    //  console.log('cashaddress was present, using '+ cashAddress);
                    }

                    if(usersAddresses.indexOf(address.legacyAddress) !== -1){
                      cashAddress = address.legacyAddress;
                    //  console.log('legacy address was present, using '+ cashAddress);
                    }

                    if(usersAddresses.indexOf(address.slpAddress) !== -1){
                      cashAddress = address.slpAddress;
                    //  console.log('slpaddress was present, using '+ cashAddress);
                    }

                //    console.log('cashAddress', cashAddress);

                    addressArray.push({
                      'cashAddr': cashAddress,
                      'bch': bch,
                      'usd': balanceUsd,
                      'totalRec': totalRec,
                      'totalRecUsd': totalRecUsd,
                      'unconfBal': unconfirmedBal,
                      'unconfBalUsd': unconfirmedBalusd
                    })

                  })
               //     console.log(addressArray);

                    res.cookie('trackbitcoin.cash', addressArray, { expire: 2147483647, httpOnly: true });
                    res.render('index', { addressArray: addressArray, errorAddress: errorAddress, errorEmail: null});
        }catch(error){
          console.log(error);
          res.render('index', { addressArray: addressArray, errorAddress: error, errorEmail: null});
        }

      })()
    }
  
}
})





// TEST PAGE FOR FUTURE DEV
app.get('/testpay', function (req, res) {
  //startWebSocket();
  res.render('testpay', {});
})


// write to file
var fs = require('fs')


// EMAIL SIGN UP, just add to a log file. *********************
app.post('/email', async function (req, res) {

  let addressArray = req.cookies['trackbitcoin.cash'];
  let email = req.body.email;



  fs.appendFile('emails.txt', email, function (err) {
  
  if (err) {
    // append failed
  } else {
    // done
    }
  })

  // render the page, pass back in the session addressArray for user
  res.render('index', {addressArray: addressArray,  errorAddress: null, errorEmail: null });

})

// ************************* USER POST FORM ****************************
app.post('/', async function (req, res) {

  let addressArray = req.cookies['trackbitcoin.cash'];
  let usersAddresses = new Array();

  let cashAddr = req.body.address.trim();
  let errorAddress = null;

// console.log('addressArray', addressArray);

  if(addressArray){
    let x = 0;
  
    addressArray.forEach(function(value){
      x++;
  //  console.log(value.cashAddr);

    if(usersAddresses.indexOf(value.cashAddr) == -1){
      usersAddresses.push(value.cashAddr);
    }

    });

    if(usersAddresses.indexOf(cashAddr) == -1){
      usersAddresses.push(cashAddr);
    }

  //   if(x == 0){
  // //     console.log('addressArray doesnt exist, lets add the submitted address')
  //       usersAddresses.push(cashAddr);

  //     }

 //  console.log('usersAddresses', usersAddresses);
  }



if(usersAddresses.length > 0){
 (async () => {
    try{
                    // use BITBOX to get details of BCH address submitted by user
                    let details = await bitbox.Address.details(usersAddresses);
                    // use BITBOX to GET BCH PRICE IN USD

                    let addressArray = [];
                    let usd = await bitbox.Price.current('usd');
                    usd = usd / 100;

                details.forEach(function(address){

                 // console.log(address);
                    //console.log(details);

                    var cashAddress;

                    let slpaddress = address.slpAddress.trim();

                    let bch = address.balance;
        
                   // console.log('BCH BAL (cashAddr)', bch);

                    let balanceUsd = address.balance * usd;
                  //  console.log('USD BAL', balanceUsd);

                    let totalRec = address.totalReceived;

                    let totalRecUsd = (address.totalReceived * usd).toFixed(2);

                    let unconfirmedBal = address.unconfirmedBalance;
                    let unconfirmedBalusd = numberWithCommas((address.unconfirmedBalance * usd).toFixed(2));

                    //console.log(unconfirmedBal);
                    balanceUsd = numberWithCommas(balanceUsd.toFixed(2));

                    // console.log(usersAddresses.indexOf(address.cashAddress));
                    // console.log(usersAddresses.indexOf(address.legacyAddress));
                    // console.log(usersAddresses.indexOf(address.slpAddress));

                    if(usersAddresses.indexOf(address.cashAddress) !== -1){
                      cashAddress = address.cashAddress;
                    //  console.log('cashaddress was present, using '+ cashAddress);
                    }

                    if(usersAddresses.indexOf(address.legacyAddress) !== -1){
                      cashAddress = address.legacyAddress;
                    //  console.log('legacy address was present, using '+ cashAddress);
                    }

                    if(usersAddresses.indexOf(address.slpAddress) !== -1){
                      cashAddress = address.slpAddress;
                    //  console.log('slpaddress was present, using '+ cashAddress);
                    }

                //    console.log('cashAddress', cashAddress);

                    addressArray.push({
                      'cashAddr': cashAddress,
                      'bch': bch,
                      'usd': balanceUsd,
                      'totalRec': totalRec,
                      'totalRecUsd': totalRecUsd,
                      'unconfBal': unconfirmedBal,
                      'unconfBalUsd': unconfirmedBalusd
                    })

                  })
//                    console.log(addressArray);

                    res.cookie('trackbitcoin.cash', addressArray, { expire: 2147483647, httpOnly: true });
                    res.render('index', { addressArray: addressArray, errorAddress: errorAddress, errorEmail: null});
        }catch(error){
          console.log(error);
          res.render('index', { addressArray: addressArray, errorAddress: error, errorEmail: null});
        }

      })()
    }

//   }catch(error){
//     console.error(error);
//   }



 
})

app.get('/cookie', function (req, res) {
// console.log('COOKIES: ', req.cookies);
 res.send(req.cookies);
})

// app.get('/add', function (req, res) {
// // res.cookie('SOUR_Faucet', sour_cookie, { maxAge: 5000, httpOnly: true });
//  res.send('SOUR cookie added');
//  //var expiryDate = new Date(Number(new Date()) + 10000); 
// })

//REMOVE! 
app.get('/clearcookies', function (req, res) {
 res.clearCookie('trackbitcoin.cash');
 res.send('All trackbitcoin.cash cookies have been removed. Thanks for stopping by!');
})


app.listen(process.env.PORT || 80, function () {
  console.log('TrackBitcoin.Cash server listening on port 80!')
})

