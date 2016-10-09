var request = require('request');

module.exports = function(threadNumber, index) {
    if (flattenedWebmMap.length === 0) {
        return {fileName: "Something happened!", link: "/videos/timetostop.webm", threadLink: "#"};
    }
    "use strict";
    let x, y;
    if (threadNumber) {
        for (let i = 0; i < webmList.length; i++) {
            if (webmList[i].threadNumber === threadNumber) {
                x = i;
                y = (index !== -1) ?
                    index % webmList[i].webms.length :
                    Math.floor(Math.random() * webmList[i].webms.length);
            }
        }
    }
    else {
        let randomNum = Math.floor(Math.random() * flattenedWebmMap.length);
        let random = flattenedWebmMap[randomNum];
        x = random.x;
        y = random.y;
    }
    let ret = webmList[x].webms[y];
    ret.threadLink = webmList[x].threadLink;
    console.log('Serving no ' + x + ':' + y + ' which is ' + ret.link);
    return ret;
};

module.exports.runRandomWebmService = function() {
    populateWebmList();
    setInterval(populateWebmList, 1000*60);
};

var flattenedWebmMap = [];
var webmList = [[]];

function populateWebmList () {
    request('https://a.4cdn.org/gif/catalog.json', (error, response, body) => {
        if (!error && response.statusCode === 200) {
            let parsed = JSON.parse(body);
            let promises = [];
            for (let i = 0; i < parsed.length; i++) {
                for (let j = 0; j < parsed[i].threads.length; j++) {
                    let p = searchThreadForWebms(parsed[i].threads[j].no);
                    promises.push(p);
                }
            }
            Promise.all(promises).then((result) => {
                for (let i = 0; i < result.length; i++) {
                    if (result[i].webms.length === 0) {
                        result.splice(i, 1);
                        i--;
                    }
                }
                webmList = result;
                flattenedWebmMap = [];
                for (let i = 0; i < webmList.length; i++) {
                    for (let j = 0; j < webmList[i].webms.length; j++)  {
                        flattenedWebmMap.push({x: i, y: j});
                    }
                }
                console.log('Webm List finished updating.');
            });
        }
    });
}

function searchThreadForWebms (threadNumber, callback) {
    var promise = new Promise((resolve, reject) => {
        let thread = 'https://a.4cdn.org/gif/thread/' + threadNumber + '.json';
        request(thread, (error, response, body) => {
            let ret = [];
            if (!error && response.statusCode === 200) {
                let parsedThread = JSON.parse(body);
                for (let i = 0; i < parsedThread.posts.length; i++) {
                    if (parsedThread.posts[i].ext === '.webm') {
                        ret.push({postLink: "http://boards.4chan.org/gif/thread/" + threadNumber + "#p" + parsedThread.posts[i].no, fileName: parsedThread.posts[i].filename, link: 'https://i.4cdn.org/gif/' + parsedThread.posts[i].tim + '.webm'});
                    }
                }
            }
            resolve({threadNumber: threadNumber, webms: ret});
        });
    });
    return promise;
}
