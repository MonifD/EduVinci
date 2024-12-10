const jwt = require('jsonwebtoken');
const { User } = require('../Models/model');
require('dotenv').config();

const authentification = async (req, res, next) => {
    try {
        const authToken = req.header('Authorization').replace('Bearer ', '');

        const decodedToken = jwt.verify(authToken, process.env.JWT_SECRET);
        const user = await User.findOne({ _id: decodedToken._id, 'authTokens.authToken': authToken });

        if (!user) throw new Error();

        req.authToken = authToken;
        req.user = user;
        next();
    } catch (e) {
        res.status(401).send("merci de s'autentifier!");
    }
}

module.exports = authentification;