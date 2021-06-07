const express = require('express');
const router = express.Router();

const math = require('../math.js');

router.get('/', function (req, res, next) {
    if (req.query.fibonum && !isNaN(parseInt(req.query.fibonum))) {
        // Calculate directly in this server        
        res.render('fibonacci', {
            title: "Calculate fibonacci numbers",
            fibonum: req.query.fibonum,
            fiboval: math.fibonacci(parseInt(req.query.fibonum))
        });
    } else {
        res.render('fibonacci', {
            title: "Calculate fibonacci numbers",
            fiboval: undefined
        })
    }
})


module.exports = router;