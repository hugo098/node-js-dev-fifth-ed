const express = require('express');
const router = express.Router();

const math = require('../math.js');

router.get('/', function (req, res, next) {
    if (req.query.fibonum && !isNaN(parseInt(req.query.fibonum))) {
        // Calculate using async-aware function, in this server
        math.fibonacciAsync(parseInt(req.query.fibonum), (err, fiboval) => {
            if (err) next(err);
            else {
                res.render('fibonacci', {
                    title: "Calculate Fibonacci numbers",
                    fibonum: req.query.fibonum,
                    fiboval: fiboval
                });
            }
        });
    } else {
        res.render('fibonacci', {
            title: "Calculate fibonacci numbers",
            fiboval: undefined
        })
    }
})


module.exports = router;