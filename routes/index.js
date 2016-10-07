var express = require('express');
var router = express.Router();
var getRandomWebm = require('../get-random-webm');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
    // let randomWebm = getRandomWebm();
    // res.send('<video controls autoplay id="current-video" name="media"><source src="' + randomWebm + '" type="video/webm"></video><link rel="prefetch" href="' +
    //     getRandomWebm(randomWebm) + '" type="video/webm" id="next-video">');
});

module.exports = router;
