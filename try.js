var MediaPress = require('./index');

var mp = new MediaPress({
    "apiLink": "http://localhost:8090/api"
});

mp.upload('assets/1.psd', function(err, data) {
    console.log(arguments);
    mp.convert(data._id, {
        format: 'jpg'
    }, function(err, data) {
        mp.download(data.link, 'assets/new.jpg', function(err) {
            console.log(arguments);
            console.log(data);
        });
    });
});
