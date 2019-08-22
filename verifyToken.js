const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const token = req.header('Authorization');

    if(!token) {
        return res.json({ message: 'Access Denied' });
    }

    try {
        const verifiedUser = jwt.verify(token, 'foryoureyezonly');
        req.user = verifiedUser;
        next();
    } catch (error) {
        res.json({ message: 'Invalid token' });
    }   
};