"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv = __importStar(require("dotenv"));
dotenv.config();
var express = require('express');
//import * as express from 'express';
var bodyParser = __importStar(require("body-parser"));
var app = express();
var NETWORK = 'mainnet';
//import BigNumber from 'bignumber.js';
//var session = require('express-session')
//app.use(session({secret:'trackBitcoinCash__BCH420'}));
var request = require('request');
//parser for our cookies
var cookieParser = require('cookie-parser');
//var csrfProtection = csrf({ cookie: true })
//const cookieSession = require('cookie-session');
app.use(cookieParser());
// configure Express
app.set('views', __dirname + '/views');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
// const bitbox_url = 'https://api.fullstack.cash/v3'
//BITBOX out this bitch
// let BITBOX = require('bitbox-sdk').BITBOX;
// let bitbox = new BITBOX({ bitbox_url });
// FULLSTACK.CASH in this bitch now
var MAINNET_API = 'https://api.fullstack.cash/v3/';
var TESTNET_API = 'https://tapi.fullstack.cash/v3/';
var BCHJS = require('@chris.troutner/bch-js');
// let bchjs = new BCHJS();
// if (NETWORK === 'mainnet') bchjs = new BCHJS({ restURL: MAINNET_API });
// else bchjs = new BCHJS({ restURL: TESTNET_API }); 
var bchjs = new BCHJS({
    restURL: 'https://api.fullstack.cash/v3/',
    apiToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVlYjBhZWJjYjA4MjMyMDAxMjViOWZmOCIsImVtYWlsIjoiQml0Y29pbkNhc2hAa2VlcGJpdGNvaW5mcmVlLm9yZyIsImFwaUxldmVsIjowLCJyYXRlTGltaXQiOjMsImlhdCI6MTU5NTEzMDkzOSwiZXhwIjoxNTk3NzIyOTM5fQ.WEVGS19fPQrQW_NSCLZB7souCQcnEI70_Gyc1_QrpiA' // Your JWT token here.
});
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
//csurf cookie thangs
//var csrf = require('csurf')
//app.use(csrfMiddleware);
// ************ initial GET REQ from USER. *************
app.get('/', function (req, res) {
    // var cashAddr = 'qqs74sypnfjzkxeq0ltqnt76v5za02amfgg7frk99g';
    var _this = this;
    // initialize the session from the request. 
    // let session = req.session;
    //console.log(req.cookies);
    //console.log(req.cookies['trackbitcoin.cash']);
    var addressArray = req.cookies['trackbitcoin.cash'];
    if (!addressArray) {
        console.log('address array doesnt exist in cookies');
        addressArray = new Array();
        res.cookie('trackbitcoin.cash', addressArray, { expire: 2147483647, httpOnly: true });
        res.render('index', { addressArray: addressArray, errorAddress: null, errorEmail: null });
    }
    else {
        // let addressArray = req.cookies['trackbitcoin.cash'];
        console.log('addressArray exists in cookies, processing address array');
        var usersAddresses_1 = new Array();
        // let cashAddr = req.body.address.trim();
        var errorAddress_1 = null;
        // console.log('addressArray', addressArray);
        var x_1 = 0;
        addressArray.forEach(function (value) {
            x_1++;
            //  console.log(value.cashAddr);
            if (usersAddresses_1.indexOf(value.cashAddr) == -1) {
                usersAddresses_1.push(value.cashAddr);
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
        if (usersAddresses_1.length > 0) {
            (function () { return __awaiter(_this, void 0, void 0, function () {
                var details, addressArray_1, usd_1, error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            return [4 /*yield*/, bchjs.Blockbook.balance(usersAddresses_1)];
                        case 1:
                            details = _a.sent();
                            addressArray_1 = [];
                            return [4 /*yield*/, bchjs.Price.current('usd')];
                        case 2:
                            usd_1 = _a.sent();
                            usd_1 = usd_1 / 100;
                            details.forEach(function (address) {
                                // console.log(address);
                                //console.log(details);
                                var cashAddress = address.address;
                                //  let slpaddress = address.slpAddress.trim();
                                var bch = address.balance / 100000000;
                                // console.log('BCH BAL (cashAddr)', bch);
                                var balanceUsd = bch * usd_1;
                                //  console.log('USD BAL', balanceUsd);
                                var totalRec = address.totalReceived / 100000000;
                                var totalRecUsd = numberWithCommas((totalRec * usd_1).toFixed(2));
                                var unconfirmedBal = address.unconfirmedBalance / 100000000;
                                var unconfirmedBalusd = numberWithCommas((unconfirmedBal * usd_1).toFixed(2));
                                //console.log(unconfirmedBal);
                                balanceUsd = numberWithCommas(balanceUsd.toFixed(2));
                                // console.log(usersAddresses.indexOf(address.cashAddress));
                                // console.log(usersAddresses.indexOf(address.legacyAddress));
                                // console.log(usersAddresses.indexOf(address.slpAddress));
                                // check to see what type of address this is. 
                                // if(usersAddresses.indexOf(address.cashAddress) !== -1){
                                //   cashAddress = address.cashAddress;
                                // //  console.log('cashaddress was present, using '+ cashAddress);
                                // }
                                // if(usersAddresses.indexOf(address.legacyAddress) !== -1){
                                //   cashAddress = address.legacyAddress;
                                // //  console.log('legacy address was present, using '+ cashAddress);
                                // }
                                // if(usersAddresses.indexOf(address.slpAddress) !== -1){
                                //   cashAddress = address.slpAddress;
                                // //  console.log('slpaddress was present, using '+ cashAddress);
                                // }
                                //    console.log('cashAddress', cashAddress);
                                addressArray_1.push({
                                    'cashAddr': cashAddress,
                                    'bch': bch,
                                    'usd': balanceUsd,
                                    'totalRec': totalRec,
                                    'totalRecUsd': totalRecUsd,
                                    'unconfBal': unconfirmedBal,
                                    'unconfBalUsd': unconfirmedBalusd
                                });
                            });
                            //     console.log(addressArray);
                            res.cookie('trackbitcoin.cash', addressArray_1, { expire: 2147483647, httpOnly: true });
                            res.render('index', { addressArray: addressArray_1, errorAddress: errorAddress_1, errorEmail: null });
                            return [3 /*break*/, 4];
                        case 3:
                            error_1 = _a.sent();
                            console.log(error_1);
                            res.render('index', { addressArray: addressArray, errorAddress: error_1, errorEmail: null });
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            }); })();
        }
    }
});
// TEST PAGE FOR FUTURE DEV
app.get('/testpay', function (req, res) {
    //startWebSocket();
    res.render('testpay', {});
});
// write to file
var fs = require('fs');
// EMAIL SIGN UP, just add to a log file. *********************
app.post('/email', function (req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var addressArray, email;
        return __generator(this, function (_a) {
            addressArray = req.cookies['trackbitcoin.cash'];
            email = req.body.email;
            fs.appendFile('emails.txt', email, function (err) {
                if (err) {
                    // append failed
                }
                else {
                    // done
                }
            });
            // render the page, pass back in the session addressArray for user
            res.render('index', { addressArray: addressArray, errorAddress: null, errorEmail: null });
            return [2 /*return*/];
        });
    });
});
// ************************* USER POST FORM ****************************
app.post('/', function (req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var addressArray, usersAddresses, cashAddr, errorAddress, x_2;
        var _this = this;
        return __generator(this, function (_a) {
            addressArray = req.cookies['trackbitcoin.cash'];
            usersAddresses = new Array();
            cashAddr = req.body.address.trim();
            errorAddress = null;
            // console.log('addressArray', addressArray);
            if (addressArray) {
                x_2 = 0;
                addressArray.forEach(function (value) {
                    x_2++;
                    //  console.log(value.cashAddr);
                    if (usersAddresses.indexOf(value.cashAddr) == -1) {
                        usersAddresses.push(value.cashAddr);
                    }
                });
                if (usersAddresses.indexOf(cashAddr) == -1) {
                    usersAddresses.push(cashAddr);
                }
                //   if(x == 0){
                // //     console.log('addressArray doesnt exist, lets add the submitted address')
                //       usersAddresses.push(cashAddr);
                //     }
                //  console.log('usersAddresses', usersAddresses);
            }
            if (usersAddresses.length > 0) {
                (function () { return __awaiter(_this, void 0, void 0, function () {
                    var details, addressArray_2, usd_2, error_2;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                _a.trys.push([0, 3, , 4]);
                                return [4 /*yield*/, bchjs.Blockbook.balance(usersAddresses)];
                            case 1:
                                details = _a.sent();
                                addressArray_2 = [];
                                return [4 /*yield*/, bchjs.Price.current('usd')];
                            case 2:
                                usd_2 = _a.sent();
                                usd_2 = usd_2 / 100;
                                details.forEach(function (address) {
                                    // console.log(address);
                                    //console.log(details);
                                    var cashAddress = address.address;
                                    //  let slpaddress = address.slpAddress.trim();
                                    var bch = address.balance / 100000000;
                                    // console.log('BCH BAL (cashAddr)', bch);
                                    var balanceUsd = bch * usd_2;
                                    //  console.log('USD BAL', balanceUsd);
                                    var totalRec = address.totalReceived / 100000000;
                                    var totalRecUsd = numberWithCommas((totalRec * usd_2).toFixed(2));
                                    var unconfirmedBal = address.unconfirmedBalance / 100000000;
                                    var unconfirmedBalusd = numberWithCommas((unconfirmedBal * usd_2).toFixed(2));
                                    //console.log(unconfirmedBal);
                                    balanceUsd = numberWithCommas(balanceUsd.toFixed(2));
                                    // console.log(usersAddresses.indexOf(address.cashAddress));
                                    // console.log(usersAddresses.indexOf(address.legacyAddress));
                                    // console.log(usersAddresses.indexOf(address.slpAddress));
                                    // check to see what type of address this is. 
                                    // if(usersAddresses.indexOf(address.cashAddress) !== -1){
                                    //   cashAddress = address.cashAddress;
                                    // //  console.log('cashaddress was present, using '+ cashAddress);
                                    // }
                                    // if(usersAddresses.indexOf(address.legacyAddress) !== -1){
                                    //   cashAddress = address.legacyAddress;
                                    // //  console.log('legacy address was present, using '+ cashAddress);
                                    // }
                                    // if(usersAddresses.indexOf(address.slpAddress) !== -1){
                                    //   cashAddress = address.slpAddress;
                                    // //  console.log('slpaddress was present, using '+ cashAddress);
                                    // }
                                    //    console.log('cashAddress', cashAddress);
                                    addressArray_2.push({
                                        'cashAddr': cashAddress,
                                        'bch': bch,
                                        'usd': balanceUsd,
                                        'totalRec': totalRec,
                                        'totalRecUsd': totalRecUsd,
                                        'unconfBal': unconfirmedBal,
                                        'unconfBalUsd': unconfirmedBalusd
                                    });
                                });
                                //     console.log(addressArray);
                                res.cookie('trackbitcoin.cash', addressArray_2, { expire: 2147483647, httpOnly: true });
                                res.render('index', { addressArray: addressArray_2, errorAddress: errorAddress, errorEmail: null });
                                return [3 /*break*/, 4];
                            case 3:
                                error_2 = _a.sent();
                                console.log(error_2);
                                res.render('index', { addressArray: addressArray, errorAddress: error_2, errorEmail: null });
                                return [3 /*break*/, 4];
                            case 4: return [2 /*return*/];
                        }
                    });
                }); })();
            }
            return [2 /*return*/];
        });
    });
});
app.get('/cookie', function (req, res) {
    // console.log('COOKIES: ', req.cookies);
    //  (async () => {
    //     try{
    //                     // use BITBOX to get details of BCH address submitted by user
    //                     let details = await bitbox.Address.details('bitcoincash:qrw5zc6vmffjal4gh0pclpwve438j6kfqcgyp7cl4p');
    //                     // use BITBOX to GET BCH PRICE IN USD
    //                     console.log(details);
    // }catch(error){
    //   console.error(error)
    // }
    //                 })()
    res.send(req.cookies);
});
// app.get('/add', function (req, res) {
// // res.cookie('SOUR_Faucet', sour_cookie, { maxAge: 5000, httpOnly: true });
//  res.send('SOUR cookie added');
//  //var expiryDate = new Date(Number(new Date()) + 10000); 
// })
//REMOVE! 
app.get('/clearcookies', function (req, res) {
    res.clearCookie('trackbitcoin.cash');
    // let addressArray = new Array ();
    //  res.render('index', { addressArray: addressArray, errorAddress: 'All trackbitcoin.cash cookies have been removed.', errorEmail: null });
    res.redirect('/');
    // res.render('index', { addressArray: addressArray, errorAddress: 'All trackbitcoin.cash cookies have been removed.', errorEmail: null });
    //res.send('All trackbitcoin.cash cookies have been removed. Go back to http://TrackBitcoin.Cash to start over, do not use the back button.');
});
app.listen(process.env.PORT || 80, function () {
    console.log('TrackBitcoin.Cash server listening on port 80!');
});
//# sourceMappingURL=server.js.map