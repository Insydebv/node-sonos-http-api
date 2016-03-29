function enqueue(player, values) {
    var action = values[0];
    var encodedUri = encodeURIComponent(values[1]);

    console.log(encodedUri);

    var uri = 'x-sonos-http:' + encodedUri + '?sid=151&flags=32&sn=4';
    var nextTrackNo = player.coordinator.state.trackNo + 1;
    var metadata = null;

    if (action == 'last') {
        player.coordinator.addURIToQueue(uri, metadata);
    } else if(action == 'now') {

        player.coordinator.addURIToQueue(uri, metadata, true, nextTrackNo, function (error, res) {
            if (!error) {
                player.coordinator.nextTrack(function (error) {
                    if (!error) {
                        player.coordinator.play();
                    }
                });
            }
        });
    } else if (action == 'next') {
        player.coordinator.addURIToQueue(uri, metadata, true, nextTrackNo);
    }
}

module.exports = function (api) {
    api.registerAction('enqueue', enqueue);
};