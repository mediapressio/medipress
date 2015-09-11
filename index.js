var http = require('http');
var fs = require('fs');
var request = require('request');

// var mp = new MediaPress();
// mp.upload('assets/1.psd', function(err, result) {
//     mp.convert(result._id, {
//             format: "jpg"
//         },
//         function(err, result) {
//             mp.download(result.link, 'assets/1.jpg', function(err) {
//                 console.log("DONE");
//                 mp.info(result._id, function(err, media) {
//                     console.log("INFO");
//                     console.log(arguments);
//                 });
//             });
//         });
// });

function MediaPress(options) {
    this.options = options || {};
    this.mediaPressLink = this.options.mediaPressLink || "http://localhost:8080/api/";
    this.key = this.options.key || "demo";
}

MediaPress.prototype.getUploadLink = function(callback) {
    callback(null, this.mediaPressLink + "upload");
};

MediaPress.prototype.getConvertLink = function(mediaId, callback) {
    callback(null, this.mediaPressLink + "convert/" + mediaId);
};

MediaPress.prototype.getInfoLink = function(mediaId, callback) {
    callback(null, this.mediaPressLink + "info/" + mediaId);
};

MediaPress.prototype.upload = function(filename, callback) {
    var self = this;
    this.getUploadLink(function(err, link) {
        var formData = {
            key: self.key,
            file: fs.createReadStream(filename),
        };

        request.post({
            url: link,
            formData: formData
        }, function optionalCallback(err, httpResponse, body) {
            if (err) {
                callback(err);
            }
            callback(null, JSON.parse(body));
        });

    });
};

MediaPress.prototype.convert = function(mediaId, options, callback) {
    var self = this;
    this.getConvertLink(mediaId, function(err, link) {
        var formData = {
            key: self.key,
            options: JSON.stringify(options),
        };

        request.post({
            url: link,
            formData: formData
        }, function optionalCallback(err, httpResponse, body) {
            if (err) {
                callback(err);
            }
            callback(null, JSON.parse(body));
        });

    });
};

MediaPress.prototype.download = function(url, saveto, callback) {
    request({
            uri: url
        })
        .pipe(fs.createWriteStream(saveto))
        .on('close', function() {
            callback();
        });
};

MediaPress.prototype.info = function(mediaId, callback) {
    this.getInfoLink(mediaId, function(err, link) {
        request.get({
            url: link
        }, function optionalCallback(err, httpResponse, body) {
            if (err) {
                callback(err);
            }
            callback(null, JSON.parse(body));
        });
    });
};

module.exports = MediaPress;
