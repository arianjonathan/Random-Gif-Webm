$('#current-video').on('ended', (e) => {
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
        .then(data => queueVideo(data));
}
function setCurrentVideo(video) {
    source.attr('src', video.link);
    nowPlaying.attr('href', video.link).text(video.fileName);
    currentVideo.trigger('load');
    postLink.attr('href', video.postLink).text(video.postLink);
}
var noShuffleIndex = 0;
function getWebm() {
    var p = new Promise((resolve, reject) => {
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
        .done((data) => {
            resolve(data);
        });
    });
    return p;
}
function queueVideo(video) {
    preloadVideo.attr('href', video.link);
    queue = video;
}
$(document).keyup((e) => {
    if (e.key === ' ') {
        playNext();
    }
});
threadFilter.keyup((e) => {
    if (e.keyCode === 13) {
        applyThreadFilter();
    }
});
$('#thread-filter-button').click((e) => {
    applyThreadFilter();
});
function applyThreadFilter() {
    noShuffleIndex = 0;
    getWebm()
        .then(data => setCurrentVideo(data));
    getWebm(true)
        .then(data => queueVideo(data));
}
getWebm()
    .then(data => setCurrentVideo(data));
getWebm()
    .then(data => queueVideo(data));

console.log('Playnext initiated.');