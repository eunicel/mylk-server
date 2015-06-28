var express = require('express');
var router = express.Router();
var request = require('request');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/venmo_oauth', function(req, res) {
  res.render('index', { access_token: req.query.access_token, user_id: "145434160922624933" });
});

router.post('/donate', function(req, res) {
  request.post(
    'https://sandbox-api.venmo.com/v1/payments',
    {
      form: {
      access_token: req.body.access_token,
      user_id: req.body.user_id,
      amount: 0.10,
      note: "donation made through mylk"
      }
    },
    function (error, response, body) {
        if (!error && response.statusCode == 200) {
          console.log(body);
          res.send("success");
        } else {
          console.log(body);
          res.send("fail");
        }
    }
  );
});

module.exports = router;
