$('#current-video').on('ended', (e) => {
    console.log('Ended. Now playing: ' + $('#next-video').prop('href'));
    playNext();
});
function playNext() {
    $('source').attr('src', $('#next-video').prop('href'));
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