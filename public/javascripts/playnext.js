'use strict';

$('#current-video').on('ended', function(e) {
    console.log('Ended. Now playing: ' + $('#next-video').prop('href'));
    playNext();
});
var source = $('source'), nowPlaying = $('#now-playing'), currentVideo = $('#current-video');
var preloadVideo = $('#next-video'), queue, postLink = $('#post-link');
var threadFilter = $('#thread-filter'), shuffle = $('#thread-filter-shuffle');
var prev1 = $('#previously1'), prev2 = $('#previously2'), prev3 = $('#previously3');
function playNext() {
    prev3.attr('href', prev2.prop('href'));
    prev2.attr('href', prev1.prop('href'));
    prev1.attr('href', source.prop('src'));
    setCurrentVideo(queue);
    getWebm()
        .then(function(data) {queueVideo(data);});
}
function setCurrentVideo(video) {
    source.attr('src', video.link);
    nowPlaying.attr('href', video.link).text(video.fileName);
    currentVideo.trigger('load');
    postLink.attr('href', video.postLink).text(video.postLink);
}
var noShuffleIndex = 0;
function getWebm() {
    var p = new Promise(function(resolve, reject) {
        let ajaxRequest = {
            url: '/api',
            dataType: 'json',
            data: {}
        };
        if (threadFilter.val() !== "") {
            try {
                ajaxRequest.data.thread = window.btoa(threadFilter.val());
                if (!shuffle.prop('checked')) {
                    ajaxRequest.data.index = noShuffleIndex;
                    noShuffleIndex++;
                }
                else {
                    ajaxRequest.data.index = -1;
                }
            }
            catch (ex) {}
        }
        $.ajax(ajaxRequest)
        .done(function(data) {
            resolve(data);
        });
    });
    return p;
}
function queueVideo(video) {
    preloadVideo.attr('href', video.link);
    queue = video;
}
$(document).keyup(function(e) {
    if (e.key === ' ') {
        playNext();
    }
});
threadFilter.keyup(function(e) {
    if (e.keyCode === 13) {
        applyThreadFilter();
    }
});
$('#thread-filter-button').click(function(e) {
    applyThreadFilter();
});
var hammertime = new Hammer(document);
hammertime.on('swipeleft', function(e) {
    playNext();
});
function applyThreadFilter() {
    let jqparam = {};
    if (threadFilter.prop('value') !== "") {
        jqparam.threadFilter = window.btoa(threadFilter.prop('value'));
        jqparam.shuffle = shuffle.prop('checked');
    }
    document.location.search = $.param(jqparam);
    return;
}
getWebm()
    .then(function(data) {setCurrentVideo(data);});
getWebm()
    .then(function(data) {queueVideo(data);});

console.log('Playnext initiated.');