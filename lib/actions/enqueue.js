function enqueue(player, values) {
    console.log('test');
    var action = values[0];
    var encodedUri = encodeURIComponent(values[1]);
    console.log(encodedUri);


    recurseBrowse(player, ["SQ:", "A:TRACKS:", "A:ALBUM", "A:ALBUMARTIST"], action, values[1], function () {
        var uri = 'x-sonos-http:' + encodedUri + '?sid=151&flags=32&sn=4';
        var nextTrackNo = player.coordinator.state.trackNo + 1;
        var metadata = null;

        console.log(uri);
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
    });
}

function recurseBrowse(player, types, action, search, fallback) {
    console.log(types[0], search);
    if (types.length > 0) {
        player.browse(types[0], null, null, function (error, result) {
            if (!error) {
                var tracks = result.items;
                var found = false;
                var metadata = '';
                tracks.forEach(function (item) {
                    if (item.title.toLowerCase() == decodeURIComponent(search).toLowerCase()
                        || item.uri.toLowerCase() == decodeURIComponent(search).toLowerCase()) {
                        console.log('found ', types[0], ': ', item.title, item.uri);
                        var uri = item.uri;
                        var nextTrackNo = player.coordinator.state.trackNo + 1;

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
                        found = true;
                    }
                });
                if (!found) {
                    types.shift();
                    recurseBrowse(player, types, action, search, fallback);
                }
            } else {
                console.log(error);
            }
        });
    } else {
        console.log('fallback');
        fallback();
    }
}

module.exports = function (api) {
    api.registerAction('enqueue', enqueue);
};