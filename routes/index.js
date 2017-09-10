var express = require('express');
var router = express.Router();

var natural = require('natural');
var tokenizer = new natural.WordTokenizer();

/* GET home page. */
router.get('/', function(req, res, next) {
  let words = ['accept', 'arrange', 'balance', 'encourage', 'huge', 'purpose', 'release'];

  res.io.on('connection', function(socket) {
    console.log('Client connected...');
    socket.on('speaker_input', function(data) {
      socket.emit('compare_return', natural.JaroWinklerDistance(data.origin_word, data.speaker_word));
    });
  });

  res.render('index', {
    title: 'Speak checker',
    words: words
  });
});
// Speak bot
var apiai = require('apiai');
var uuidv1 = require('uuid/v1');
router.get('/chat', function(req, res, next) {
  let mod = apiai("dc302ae701c7483fb791796011393aec");
  let session = uuidv1();

  res.io.on('connection', function(socket) {
    console.log('Client connected...');
    socket.on('user_speak', function(data) {
      // console.log(data.user_text);
      let request = mod.textRequest('How are you?', {
        sessionId: session
      });

      request.on('response', (response) => {
        let aiText = response.result.fulfillment.speech;
        console.log('Bot reply: ' + aiText);
        socket.emit('bot_speak', aiText);
      });

      request.on('error', (error) => {
        console.log(error);
      });

      request.end();
    });
  });

  res.render('chat', {
    title: 'Chat bot'
  });
});
var request = require('http');
router.get('/vision', function(req, res, next) {
  // let options = {
  //   host: "http://api.flickr.com/services/rest",
  //   path: '/?method=flickr.photos.search&api_key=125bbfd25e96d2b4a032a80641321207&format=json&tags=people',
  //   method: 'GET'
  // };
  // request.get('http://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=125bbfd25e96d2b4a032a80641321207&format=json&tags=people', function (error, response, body) {
  //   if (!error && response.statusCode == 200) {
  //     console.log(body)
  //   }
  // })
  res.render('vision', {
    title: 'Vision'
  });
});

module.exports = router;
