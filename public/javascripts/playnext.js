$('#current-video').on('ended', (e) => {
    console.log('Ended. Now playing: ' + $('#next-video').prop('href'));
    playNext();
});
var source = $('source'), nowPlaying = $('#now-playing'), currentVideo = $('#current-video');
var prev1 = $('#previously1'), prev2 = $('#previously2'), prev3 = $('#previously3');
function playNext() {
    prev3.attr('href', prev2.prop('href'));
    prev2.attr('href', prev1.prop('href'));
    prev1.attr('href', source.prop('src'));
    let nextVideo = $('#next-video').prop('href');
    source.attr('src', nextVideo);
    nowPlaying.attr('href', nextVideo).text(nextVideo);
    currentVideo.trigger('load');
    $.ajax({
        url: '/api',
        dataType: 'text'
    }).done((data) => {
        $('#next-video').attr('href', data);
    });
}
$(document).keyup((e) => {
    if (e.key === ' ') {
        playNext();
    }
});
console.log('Playnext initiated.');