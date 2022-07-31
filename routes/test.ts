var express = require('express');
var router = express.Router();

import { Request, Response, NextFunction } from "express";
router.get('/', function(req:Request, res: Response, next: NextFunction) { 
    res.end('Welcome to You in Test Page');
});
module.exports = router;