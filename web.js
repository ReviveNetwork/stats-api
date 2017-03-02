const express = require('express');
const bodyParser = require('body-parser');
const stats = require(`revive-stats.js`)
let app = express();

app.use(bodyParser.json())
app.use(function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    return next();
});
app.get('/:game/:type/:param', function (req, res) {
    let game = stats.bf2142;
    if (req.params.game.toString().includes('bf2'))
        game = stats.bf2;
    if (req.params.type.toString().toLowerCase() === "getplayer")
        game.getPlayer(req.params.param).then(JSON.stringify).then(res.send).then(ig => res.end()).catch(err => {
            console.log(err + "\n" + err.stack);
            res.send("{\"error\":\"" + err + "\"}");
            res.end();
        })
    else if (req.params.type.toString().toLowerCase() === "getplayers" || req.params.type.toString().toLowerCase() === "search")
        game.getPlayers(req.params.param).then(JSON.stringify).then(res.send).then(ig => res.end()).catch(err => {
            console.log(err + "\n" + err.stack);
            res.send("{\"error\":\"" + err + "\"}");
            res.end();
        })
    else {
        res.send("{\"error\":\"Invalid Method\"}")
        res.end();
    }

});

var listener = app.listen((process.env.PORT || 80), function () {
    console.log('API now running on port: ' + listener.address().port);
});
process.on('uncaughtException', (err) => {
    console.log('Uncaught Exception:' + err);
    console.log(err.stack);
});
module.exports = app;
