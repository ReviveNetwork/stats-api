const express = require('express');
const bodyParser = require('body-parser');
const stats = require(`revive-stats.js`)
let app = express();

app.use(bodyParser.json())
app.all('*', function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    return next();
});
app.get('/:game/:type/:param', function (req, res) {
    console.log(req.params)
    let game = stats.bf2142;
    if (req.params.game.toString().includes('bf2'))
        game = stats.bf2;
    if (req.params.type.toString().toLowerCase() === "getplayer") {
        console.log("Executing getplayer");
        game.getPlayer(req.params.param).then(JSON.stringify).then(js => res.end(js, () => {
            console.log("Done");
            return;
        })).catch(err => {
            console.log(err + "\n" + err.stack);
            res.end("{\"error\":\"" + err + "\"}");
        })
    }
    else if (req.params.type.toString().toLowerCase() === "getplayers" || req.params.type.toString().toLowerCase() === "search") {
        console.log("Executing getplayers");
        game.getPlayers(req.params.param).then(JSON.stringify).then(p => {
            console.log(p);
            return p;
        }).then(js => res.end(js, () => {
            console.log("Done");
            return;
        })).catch(err => {
            console.log(err + "\n" + err.stack);
            res.end("{\"error\":\"" + err + "\"}");
        })
    }
    else {
        res.end("{\"error\":\"Invalid Method\"}")
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
