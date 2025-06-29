const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = function(req, res, next) {
    const authHeader = req.header('Authorization');

    if (!authHeader) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ msg: 'Token format is invalid, authorization denied' });
    }

    try {
        //verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        //add user
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};