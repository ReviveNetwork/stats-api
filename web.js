const express = require('express');
const bodyParser = require('body-parser');
const stats = require(`revive-stats.js`)
let app = express();

app.use(bodyParser.json())
app.use(function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    return next();
});
app.get('/:game/:function/:param', function (req, res) {
    let game = stats.bf2142;
    if (req.params.game.toString().includes('bf2'))
        game = stats.bf2;
    if (req.params.function.toString() === "getPlayer")
        game.getPlayer(req.params.param).then(res.send).then(res.end).catch(err => {
            res.send("{\"error\":\"" + err + "\"}");
            res.end();
        })
    else if (req.params.function.toString() === "getPlayers" || req.params.function.toString() === "search")
        game.getPlayers(req.params.param).then(res.send).then(res.end).catch(err => {
            res.send("{\"error\":\"" + err + "\"}");
            res.end();
        })
    else {
        res.send("{\"error\":\"Invalid Method\"}")
    }
    res.end();
});

var listener = app.listen((process.env.PORT || 80), function () {
    console.log('API now running on port: ' + listener.address().port);
});
process.on('uncaughtException', (err) => {
    console.log('Uncaught Exception:' + err);
    console.log(err.stack);
});
module.exports = app;
