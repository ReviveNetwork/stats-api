const express = require('express');
const bodyParser = require('body-parser');
const stats = require(`revive-stats.js`)
let app = express();

app.use(bodyParser.json())
app.all('*', function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    return next();
});
app.get('/:game/getplayer', function (req, res) {
    let game;
    if (req.params.game.toString().trim() === 'bf2')
        game = stats.bf2;
    else if (req.params.game.toString().trim() === 'bf2142')
        game = stats.bf2142;
    if (!game) {
        res.end("{\"error\":\"" + "INVALID GAME" + "\"}", () => console.log("An Invalid Game was provided by " + (req.headers['x-forwarded-for'] || req.connection.remoteAddress)));
        return;
    }
    //console.log("Executing getplayer " + req.param('pid'));
    if (!req.query['pid']) {
        res.end("{\"error\":\"" + "INVALID PID" + "\"}", () => console.log("An Invalid PID was provided by " + (req.headers['x-forwarded-for'] || req.connection.remoteAddress)));
    }
    game.getPlayer(req.query['pid']).then(JSON.stringify).then(js => res.end(js, () => {
        console.log("Done");
        return;
    })).catch(err => {
        console.log(err + "\n" + err.stack);
        res.end("{\"error\":\"" + err + "\"}");
    })
});
app.get('/:game/getplayers', function (req, res) {
    console.log("Executing getplayers");
    let game;
    if (req.params.game.toString().trim() === 'bf2')
        game = stats.bf2;
    else if (req.params.game.toString().trim() === 'bf2142')
        game = stats.bf2142;
    if (!game) {
        res.end("{\"error\":\"" + "INVALID GAME" + "\"}", () => console.log("An Invalid Game was provided by " + (req.headers['x-forwarded-for'] || req.connection.remoteAddress)));
        return;
    }
    //console.log(req.param('nick'));
    if (!req.query['nick']) {
        res.end("{\"error\":\"" + "INVALID NICK" + "\"}", () => console.log("An Invalid NICK was provided by " + (req.headers['x-forwarded-for'] || req.connection.remoteAddress)));
    }
    game.getPlayers(req.query['nick']).then(JSON.stringify).then(p => {
        console.log(p);
        return p;
    }).then(js => res.end(js, () => {
        console.log("Done");
        return;
    })).catch(err => {
        console.log(err + "\n" + err.stack);
        res.end("{\"error\":\"" + err + "\"}");
    })
});
app.get('/:game/getleaderboard', function (req, res) {
    console.log("Executing getleaderboard");
    let game;
    if (req.params.game.toString().trim() === 'bf2')
        game = stats.bf2;
    else if (req.params.game.toString().trim() === 'bf2142')
        game = stats.bf2142;
    if (!game) {
        res.end("{\"error\":\"" + "INVALID GAME" + "\"}", () => console.log("An Invalid Game was provided by " + (req.headers['x-forwarded-for'] || req.connection.remoteAddress)));
        return;
    }
    if (!req.query['type']) {
        res.end("{\"error\":\"" + "INVALID TYPE" + "\"}", () => console.log("An Invalid TYPE was provided by " + (req.headers['x-forwarded-for'] || req.connection.remoteAddress)));
    }
    game.getLeaderBoard(req.query['type'], req.query['id'], req.query['n']).then(JSON.stringify).then(p => {
        console.log(p);
        return p;
    }).then(js => res.end(js, () => {
        console.log("Done");
        return;
    })).catch(err => {
        console.log(err + "\n" + err.stack);
        res.end("{\"error\":\"" + err + "\"}");
    })
});

var listener = app.listen((process.env.PORT || 80), function () {
    console.log('API now running on port: ' + listener.address().port);
});
process.on('uncaughtException', (err) => {
    console.log('Uncaught Exception:' + err);
    console.log(err.stack);
});
module.exports = app;
