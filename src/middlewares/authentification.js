const jwt = require('jsonwebtoken');
const { User } = require('../Models/model'); // Pas besoin de sequelize ici si nous n'utilisons plus authTokens
require('dotenv').config();

const authentification = async (req, res, next) => {
    try {
        const authToken = req.header('Authorization')?.replace('Bearer ', ''); // Récupérer le token du header
        if (!authToken) {
            return res.status(401).json({ message: "Merci de vous authentifier !" });
        }

        // Vérification du jeton JWT
        const decodedToken = jwt.verify(authToken, process.env.JWT_SECRET);
        
        // Recherche de l'utilisateur à partir du token (sans vérifier authTokens en BDD)
        const user = await User.findOne({
            where: { id: decodedToken.id }, // Juste vérification par ID
        });

        if (!user) {
            return res.status(401).json({ message: "Utilisateur non autorisé." });
        }

        // Ajout de l'utilisateur et du token dans la requête pour les middlewares suivants
        req.authToken = authToken;
        req.user = user;

        next(); // Passer au middleware suivant
    } catch (error) {
        console.error("Erreur d'authentification :", error);
        return res.status(401).json({ message: "Merci de vous authentifier !" });
    }
};

module.exports = authentification;
