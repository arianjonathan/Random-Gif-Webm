var express = require('express');
var router = express.Router();
var getRandomWebm = require('../get-random-webm');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send('<video controls autoplay name="media"><source src="' + getRandomWebm() + '" type="video/webm"></video>');
});

module.exports = router;
