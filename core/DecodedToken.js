const jwt = require('jsonwebtoken');

const decodedToken = (req) => {
    let token = req.headers.authorization.split(' ')[1];
    return jwt.verify(token, process.env.TOKEN_SECRET);
} 

module.exports = decodedToken;