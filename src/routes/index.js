let router = require('express').Router();

router.use('/books',require('./books/index'));
router.use('/users',require('./users/index'));

module.exports=router;