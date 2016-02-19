//Please set the following
var CheckInterval = 30 * 60 * 1000, //30 minutes * 60 seconds/minute * 1000 millisecons/second
domain = 'xxx.com',
login = 'yyyyyyy:zzzzzzz',//in the form: login:passowrd
userclient = 'Update Client Javascript/v1.0',
email = 'xxxx.yyyyy@zzzz.com';

//modules needed
var request = require('request');//to send basic internet protocol request
var base64 = require('base-64');//for encryption as requested by noip
var utf8 = require('utf8');

//functions
function callback(error, response, body) {
  if (!error && response.statusCode == 200) {
    var d = new Date();
    console.log(body + '\n'+ 'Timestamp:' + d.toUTCString()); //has to be logged when constantly run on RPi
  }
}

function encodebase(info){
  return base64.encode(utf8.encode(info));
}

function getheader(host, ip, b64id, userclient, email) {
  var uri = 'http://dynupdate.no-ip.com/nic/update?hostname=' + host + '&myip=' + ip;
      head = {
        'Authorization': 'Basic ' + b64id,
        'User-Agent': userclient + ' ' + email
      };
  request({
    url: uri,
    headers: head
  }, callback);
}

function getIp(callback){
  var url = "http://icanhazip.com"; // "http://ifconfig.me/ip"
  request(url, function (error, response, body) {
      if (!error && response.statusCode == 200) {
          var ip = body.match(/[\d.]+/)[0];
          console.log("Current IP: " + ip); //has to be logged when constantly run on RPi
          callback(null, ip);
      } else {
          callback(true, body);
      }
  });
}

function updateIp(){
  getIp(function(err,ip){
    if (err === null)
      getheader(domain, ip, encodebase(login), userclient, email);
    else
      console.log('No IP-address pulled! Check getIP-Function for problems.'); //has to be logged when constantly run on RPi
  });
}

setInterval(updateIp, CheckInterval);

/* Explaination:
1. Check current external IP address (--> getIp function) and give it back
2. Push the IP address with identification info to NOIP (-->getheader function)
3. When this is successful, log a timestamp in the console
*/
