const express = require('express');
const Routes = require('./routes/');
const router = express();
router.use('/auth', Routes.auth);
router.use('/application', Routes.application);
module.exports = router;