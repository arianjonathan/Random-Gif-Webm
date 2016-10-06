$('#current-video').on('ended', (e) => {
    console.log('Ended. Now playing: ' + $('#next-video').prop('href'));
    playNext();
});
function playNext() {
    let nextVideo = $('#next-video').prop('href');
    $('source').attr('src', nextVideo);
    $('#now-playing').attr('href', nextVideo).text(nextVideo);
    $('#current-video').trigger('load');
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