var http = require('http');
var fs = require('fs');
var request = require('request');

function MediaPress(options) {
    this.options = options || {};
    this.mediaPressLink = this.options.mediaPressLink || "http://mediapress.io/api/";
    this.key = this.options.key || "demo";
    this.uploadLink = null;
    this.convertLink = null;
    this.infoLink = null;
    this.deleteLink = null;
}

MediaPress.prototype.getLinks = function(callback) {
    var self = this;
    request.get({
        url: this.mediaPressLink
    }, function optionalCallback(err, httpResponse, body) {
        if (err) {
            callback(err);
        }
        var links = JSON.parse(body);
        self.uploadLink = links.uploadLink;
        self.convertLink = links.convertLink;
        self.infoLink = links.infoLink;
        self.deleteLink = links.deleteLink;
        callback(null);
    });
};

MediaPress.prototype.getUploadLink = function(callback) {
    var self = this;
    if (self.uploadLink === null) {
        this.getLinks(function() {
            callback(null, self.uploadLink);
        });
    } else {
        callback(null, self.uploadLink);
    }
};

MediaPress.prototype.getConvertLink = function(mediaId, callback) {
    var self = this;
    if (self.convertLink === null) {
        this.getLinks(function() {
            callback(null, self.convertLink.replace(":id", mediaId));
        });
    } else {
        callback(null, self.convertLink.replace(":id", mediaId));
    }
};

MediaPress.prototype.getInfoLink = function(mediaId, callback) {
    var self = this;
    if (self.infoLink === null) {
        this.getLinks(function() {
            callback(null, self.infoLink.replace(":id", mediaId));
        });
    } else {
        callback(null, self.infoLink.replace(":id", mediaId));
    }
};

MediaPress.prototype.getDeleteLink = function(mediaId, callback) {
    var self = this;
    if (self.deleteLink === null) {
        this.getLinks(function() {
            callback(null, self.deleteLink.replace(":id", mediaId));
        });
    } else {
        callback(null, self.deleteLink.replace(":id", mediaId));
    }
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
