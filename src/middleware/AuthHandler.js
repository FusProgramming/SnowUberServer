const jwt = require('jsonwebtoken');
jwtSecret = 'string';

module.exports = function(request, response, next) {
    const jwtToken = request.header("token");
    if(!jwtToken) {
        return response.sendStatus(403).json({ msg: "Denied"});
    }
    try {
        const payload = jwt.verify(jwtToken, jwtSecret);
        request.users = payload.users;
        next();
    } catch(error) {
       return response.sendStatus(401).json({ msg:"invalid token"})
    }
};