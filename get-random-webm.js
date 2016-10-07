var request = require('request');

module.exports = function() {
    let random = Math.floor(Math.random() * webmList.length);
    if (webmList[random].length === 0) {
        return {fileName: "Something happened!", link: "/videos/timetostop.webm", threadLink: "#"};
    }
    let random2 = Math.floor(Math.random() * webmList[random].webms.length);
    let ret = webmList[random].webms[random2];
    ret.threadLink = webmList[random].threadLink;
    console.log('Serving no ' + random + ':' + random2 + ' which is ' + ret.link);
    return ret;
};

module.exports.runRandomWebmService = function() {
    populateWebmList();
    setInterval(populateWebmList, 1000*60);
};

var webmList = [[]];

function populateWebmList () {
    request('https://a.4cdn.org/wsg/catalog.json', (error, response, body) => {
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
                console.log('Webm List finished updating.');
            });
        }
    });
}

function searchThreadForWebms (threadNumber, callback) {
    var promise = new Promise((resolve, reject) => {
        let thread = 'https://a.4cdn.org/wsg/thread/' + threadNumber + '.json';
        request(thread, (error, response, body) => {
            let ret = [];
            if (!error && response.statusCode === 200) {
                let parsedThread = JSON.parse(body);
                for (let i = 0; i < parsedThread.posts.length; i++) {
                    if (parsedThread.posts[i].ext === '.webm') {
                        ret.push({postLink: "http://boards.4chan.org/wsg/thread/" + threadNumber + "#p" + parsedThread.posts[i].no, fileName: parsedThread.posts[i].filename, link: 'https://i.4cdn.org/wsg/' + parsedThread.posts[i].tim + '.webm'});
                    }
                }
            }
            resolve({threadLink: "http://boards.4chan.org/wsg/thread/" + threadNumber, webms: ret});
        });
    });
    return promise;
}