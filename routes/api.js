var express = require('express');
var router = express.Router();
var getRandomWebm = require('../get-random-webm');

/* GET home page. */
router.get('/', function (req, res, next) {
    if (req.query.thread) {
        try {
            let b64decoded = new Buffer(req.query.thread, 'base64').toString('utf8');
            let regexMatched = /thread\/(\d+)/g.exec(b64decoded);
            let threadNumber = parseInt(regexMatched[1]);
            console.log('Thread: ' + threadNumber);
            res.send(getRandomWebm(threadNumber, req.query.index ? req.query.index : -1));
            return;
        }
        catch (ex) {}
    }
    res.send(getRandomWebm());
});

module.exports = router;