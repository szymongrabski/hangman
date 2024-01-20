const jwt = require('jsonwebtoken');


const generateAuthToken = (userId, username, role) => {
    const token = jwt.sign({ userId, role }, username, { expiresIn: '1h' });
    return token;
};

module.exports = generateAuthToken;