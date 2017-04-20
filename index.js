var express = require('express');
var db = require('./models');
var app = express();

var Hashids = require('hashids');
// this salts the hash to get a new random hash
var hash = new Hashids('lkjlkjlkljl');

var path = require('path');
var bodyParser = require('body-parser');
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.set('view engine', 'ejs');

app.use(require('morgan')('dev'));

app.post('/links', function(req, res) {
    db.link.findOrCreate({
        where: {
            url: req.body.url
        }

    }).spread(function(item) {
        var shortPath = hash.encode(item.id);
        console.log('SHORTPATH: ', shortPath, item.id);
        res.redirect('/links/' + shortPath);

    });
    // res.send('success');
});


app.get('/links/:id', function(req, res) {
    res.send(req.params.id);
});

app.get('/:hash', function(req, res) {
    var linkId = hash.decode(req.params.hash)[0];
    db.link.findById(linkId).then(function(link) {
        res.redirect(link.url);
    }).catch(function() {
        res.status(404).render('error');
    });
});
//     // res.send('Hello Backend!');
//     var linkToShorten = 'http://xkcd.com';
//     db.link.findOrCreate({
//         where: {
//             url: linkToShorten
//         }
//     }).then(function(link) {
//         res.send(link.id);
//     })
// });

var server = app.listen(process.env.PORT || 3000);

module.exports = server;
