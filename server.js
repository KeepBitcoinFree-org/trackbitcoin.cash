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
//import BigNumber from 'bignumber.js';
var session = require('express-session');
app.use(session({ secret: 'trackBitcoinCash__BCH420' }));
var request = require('request');
//BITBOX in this bitch
var BITBOX = require('bitbox-sdk').BITBOX;
var bitbox = new BITBOX();
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
var cookieParser = require('cookie-parser');
//var csrfProtection = csrf({ cookie: true })
app.use(cookieParser());
//app.use(csrfMiddleware);
// initial GET REQ from USER.
app.get('/', function (req, res) {
    // var cashAddr = 'qqs74sypnfjzkxeq0ltqnt76v5za02amfgg7frk99g';
    // initialize the session from the request.
    var session = req.session;
    // console.log(session);
    // if session addressArray doesn't exist, create a new one to store addresses
    if (!session.addressArray) {
        session.addressArray = new Array();
    }
    // return index page
    res.render('index', { addressArray: session.addressArray, errorAddress: null, errorEmail: null });
});
// TEST PAGE FOR FUTURE DEV
app.get('/testpay', function (req, res) {
    //startWebSocket();
    res.render('testpay', {});
});
// write to file
var fs = require('fs');
// EMAIL SIGN UP, just add to a log file.
app.post('/email', function (req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var session, email;
        return __generator(this, function (_a) {
            session = req.session;
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
            res.render('index', { addressArray: session.addressArray, errorAddress: null, errorEmail: null });
            return [2 /*return*/];
        });
    });
});
app.post('/', function (req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var session, addressArray, cashAddr;
        var _this = this;
        return __generator(this, function (_a) {
            session = req.session;
            addressArray = session.addressArray;
            if (!session.addressArray) {
                session.addressArray = new Array();
            }
            cashAddr = req.body.address;
            (function () { return __awaiter(_this, void 0, void 0, function () {
                var details, usd, slpaddress, bch, balanceUsd, totalRec, unconfirmedBalusd, error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            return [4 /*yield*/, bitbox.Address.details(cashAddr)];
                        case 1:
                            details = _a.sent();
                            return [4 /*yield*/, bitbox.Price.current('usd')];
                        case 2:
                            usd = _a.sent();
                            usd = usd / 100;
                            slpaddress = details.slpAddress.trim();
                            bch = details.balance;
                            balanceUsd = details.balance * usd;
                            totalRec = (details.totalReceived * usd).toFixed(2);
                            unconfirmedBalusd = (details.unconfirmedBalance * usd).toFixed(2);
                            balanceUsd = numberWithCommas(balanceUsd.toFixed(2));
                            session.addressArray.push({
                                'cashAddr': cashAddr,
                                'bch': bch,
                                'usd': balanceUsd,
                                'totalRec': totalRec,
                                'unconfBal': details.unconfirmedBalance,
                                'unconfBalUsd': unconfirmedBalusd
                            });
                            res.render('index', { addressArray: addressArray, errorAddress: null, errorEmail: null });
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
            return [2 /*return*/];
        });
    });
});
var port = 80;
app.listen(process.env.PORT || port, function () {
    console.log('TrackBitcoin.Cash server is listening on port ' + port + '!');
});
//# sourceMappingURL=server.js.map