var express = require('express');
var router = express.Router();
var request = require('request');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* Redirect from Venmo */
router.get('/venmo_oauth', function(req, res) {
  res.render('index', { title: "Venmo Redirect", access_token: req.query.access_token, user_id: "145434160922624933" });
});

/* response with charity recommendation from JustGiving */
router.get('/get-charity-recommendation', function(req, res) {
  var appId = 'dc91d19d';
  var category = req.query.category;

  request.get({
    url: 'https://api.justgiving.com/'+appId+'/v1/charity/search?q='+category,
    headers: {
      'Accept': 'application/json'
    }
  }, function(error, response, body) {
    var queryResult = JSON.parse(body);
    var firstMatch = queryResult.charitySearchResults[0];
    request.get({
      url: 'https://api.justgiving.com/'+appId+'/v1/charity/'+firstMatch.charityId,
      headers: {
        'Accept': 'application/json'
      }
    }, function(error, response, body) {
      res.json({
        name: firstMatch.name,
        description: firstMatch.description,
        url: JSON.parse(body).profilePageUrl
      });
    });
  });
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
          res.render('success', { title: "Success" });
        } else {
          console.log(body);
          res.render('fail', { title: "Fail", error: JSON.parse(body).error.message });
        }
    }
  );
});

module.exports = router;
