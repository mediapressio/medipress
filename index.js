var http = require('http');
var fs = require('fs');
var request = require('request');

function MediaPress(settings) {
    this.settings = settings || {};
    this.settingsLoaded = false;
    //Required settings
    this.settings.apiLink = settings.apiLink || "http://mediapress.io/api/";
    this.settings.key = settings.key || "demo";
}

MediaPress.prototype.loadSettings = function(callback) {
    var self = this;
    request.get({
        url: this.settings.apiLink
    }, function(err, httpResponse, body) {
        self.settingsLoaded = true;
        if (err) {
            callback(err);
            return;
        }
        var settings = JSON.parse(body);
        //Add remote settings;
        for (var setting in settings) {
            if (settings.hasOwnProperty(setting)) {
                self.settings[setting] = self.settings[setting] || settings[setting];
            }
        }
        callback(null);
    });
};

MediaPress.prototype.getSetting = function(setting, callback) {
    var self = this;
    if (!self.settingsLoaded) {
        self.loadSettings(function(err) {
            if (err) {
                callback(err);
                return;
            }
            self.getSetting(setting, callback);
        });
    } else {
        callback(null, self.settings[setting]);
    }
};

MediaPress.prototype.upload = function(filename, callback) {
    var self = this;
    this.getSetting("uploadLink", function(err, link) {
        request.post({
            url: link,
            formData: {
                key: self.settings.key,
                file: fs.createReadStream(filename),
            }
        }, function(err, httpResponse, body) {
            if (err) {
                callback(err);
            }
            callback(null, JSON.parse(body));
        });

    });
};

MediaPress.prototype.convert = function(mediaId, settings, callback) {
    var self = this;
    this.getSetting("convertLink", function(err, link) {
		console.log(link.replace(":id", mediaId));
        request.post({
            url: link.replace(":id", mediaId),
            formData: {
                key: self.settings.key,
                settings: JSON.stringify(settings),
            }
        }, function(err, httpResponse, body) {
            if (err) {
                callback(err);
                return;
            }
            console.log(body);
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
    this.getSetting("infoLink", function(err, link) {
        request.get({
            url: link.replace(":id", mediaId),
            formData: {
                key: self.settings.key
            }
        }, function optionalCallback(err, httpResponse, body) {
            if (err) {
                callback(err);
            }
            callback(null, JSON.parse(body));
        });
    });
};

MediaPress.prototype.delete = function(mediaId, callback) {
    this.getSetting("deleteLink", function(err, link) {
        request.delete({
            url: link.replace(":id", mediaId),
            formData: {
                key: self.settings.key
            }
        }, function optionalCallback(err, httpResponse, body) {
            if (err) {
                callback(err);
            }
            callback(null, JSON.parse(body));
        });
    });
};

module.exports = MediaPress;
