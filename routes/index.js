var express = require('express');
var router = express.Router();
var getRandomWebm = require('../get-random-webm');

/* GET home page. */
router.get('/', function(req, res, next) {
  let args = {};
  args.threadFilter = req.query.threadFilter ? 
    new Buffer(req.query.threadFilter, 'base64').toString('utf8') :
    "";
  args.shuffle = req.query.shuffle === "true" ? true : false;
  res.render('index', args);
    // let randomWebm = getRandomWebm();
    // res.send('<video controls autoplay id="current-video" name="media"><source src="' + randomWebm + '" type="video/webm"></video><link rel="prefetch" href="' +
    //     getRandomWebm(randomWebm) + '" type="video/webm" id="next-video">');
});

module.exports = router;
