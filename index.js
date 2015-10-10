var isgd = require('isgd');
var feed = require("feed-read");
var Telegram = require('telegram-bot');
var tg = new Telegram('<telegram_token>');

function send_message(url, title, msg) { 
       isgd.shorten(url, function(res) {
         tg.sendMessage({
          text: title + " " + res,
          reply_to_message_id: msg.message_id,
          chat_id: msg.chat.id
         });
       });
};

tg.on('message', function(msg) {
  console.log(msg.date + " " + (msg.from.username || msg.from.first_name) + ": msg.text");
  if (!msg.text) return;
  msg.text = msg.text.replace('@thozharBot', '').replace('!', '');
  if (msg.text === "/tncpim") {
    feed("http://tncpim.org/feed", function(err, messages) {
      if (err) throw err;

      for (i = 0; i < 2; i++) {
       send_message(messages[i].link, messages[i].title, msg);
      };
    });
  };
  if (msg.text === "/help") {
    tg.sendMessage({
	text: "You can get latest news from www.tncpim.org through this bot. Try /tncpim for top two news.",
        reply_to_message_id: msg.message_id,
	chat_id: msg.chat.id
    });
  };
});
 
tg.start();
