function browse(player, values) {
    // var search = decodeURIComponent(values.shift());
    // command: /browse/artist/album
    // optie 1: /browse/artist/Devin Townsend Project
    // optie 1: /browse/album/Z²                            -> probleem: 2 albums met zelfde naam, verschillende artiesten

    // optie 2: /browse/Devin Townsend Project              -> alle albums van DTP
    // optie 2: /browse/Devin Townsend Project/Z²           -> alle nummers van Z²

    // optie 3: /browse/artist
    // optie 3: /browse/artist/Devin Townsend Project              -> alle albums van DTP
    // optie 3: /browse/artist/Devin Townsend Project/Z²           -> alle nummers van Z²
    // optie 3: /browse/album/Z²
    // optie 3: /browse/album/Z²/Deathray

    // optie 4: /browse/artist
    // optie 4: /browse/Devin Townsend Project              -> alle albums van DTP
    // optie 4: /browse/Devin Townsend Project/Z²           -> alle nummers van Z²
    // optie 4: /browse/album


    var browseThrough = decodeURIComponent(values.shift());
    var searcharray = '';
    values.forEach(function (item) {
        if (item) {
            searcharray += '/' + decodeURIComponent(item);
        }
    });

    if (browseThrough == 'albums' || browseThrough == 'album') {
        browseLibrary(player, 'A:ALBUM'+searcharray);
    } else {
        browseLibrary(player, 'A:ARTIST'+'/'+browseThrough+searcharray);
    }
}

function browseLibrary(player, type) {
    console.log(type);
    player.browse(type, null, null, function (error, result) {
        if (error) {
            console.error(error);
            return;
        }

        results = result.items;
        results.forEach(function (item) {
            console.log(item);
        });
        console.log('end');
    });
}


module.exports = function (api) {
    api.registerAction('browse', browse);
};