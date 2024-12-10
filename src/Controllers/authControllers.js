const { User } = require('../Models/model');
// Importez le modèle utilisateur
const bcrypt = require('bcrypt');

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Vérifiez si l'utilisateur existe
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    }

    // Comparez les mots de passe
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Mot de passe incorrect.' });
    }

    // Générez un token JWT
    const token = await user.generateJWT();

    return res.status(200).json({
      message: 'Connexion réussie.',
      token,
    });
  } catch (error) {
    console.error('Erreur lors de la connexion :', error);
    res.status(500).json({ message: 'Une erreur est survenue.' });
  }
};

exports.register = async (req, res) => {
  try {
      const { nom, prenom, email, password, role } = req.body;

      // Validation des données
      if (!nom || !prenom || !email || !password || !role) {
          return res.status(400).json({ message: 'Tous les champs sont obligatoires.' });
      }

      // Vérifiez si l'utilisateur existe déjà
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
          return res.status(409).json({ message: 'Un utilisateur avec cet email existe déjà.' });
      }

      // Hachage du mot de passe
      const hashedPassword = await bcrypt.hash(password, 10);

      // Création de l'utilisateur
      const newUser = await User.create({
          nom,
          prenom,
          email,
          password: hashedPassword,
          role,
      });

      return res.status(201).json({
          message: 'Inscription réussie.',
          user: {
              id: newUser.id,
              nom: newUser.nom,
              prenom: newUser.prenom,
              email: newUser.email,
              role: newUser.role,
          },
      });
  } catch (error) {
      console.error('Erreur lors de l\'inscription :', error);
      res.status(500).json({ message: 'Une erreur est survenue.' });
  }
};