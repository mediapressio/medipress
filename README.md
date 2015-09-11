# MediaPress for node.js
Convert your media files without installing any soft on your server

#Installation
```
npm install mediapress
```

#Usage
```javascript
var mp = new MediaPress();

mp.upload('assets/test.png', function(err, result) {
    mp.convert(result._id, {
            format: "jpg"
        },
        function(err, result) {
            mp.download(result.link, 'assets/test.jpg', function(err) {
                console.log("File assets/test.png converted to assets/test.jpg");
            });
        });
});
```