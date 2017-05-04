const express = require('express');

const router = express.Router();

/* GET home page. */
// removed "next" because of unused
router.get('/', (req, res) => {
  res.render('index', { title: 'Express' });
});

module.exports = router;
