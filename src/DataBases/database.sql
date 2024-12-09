
-- Créer les tables
CREATE TABLE Salle (
    id INT AUTO_INCREMENT PRIMARY KEY,
    libelle VARCHAR(255) NOT NULL
);

CREATE TABLE Professeur (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    prenom VARCHAR(255) NOT NULL
);

CREATE TABLE Annee (
    id INT AUTO_INCREMENT PRIMARY KEY,
    libelle VARCHAR(255) NOT NULL
);

CREATE TABLE Classe (
    id INT AUTO_INCREMENT PRIMARY KEY,
    libelle VARCHAR(255) NOT NULL,
    fk_prof INT NOT NULL,
    fk_salle INT NOT NULL,
    FOREIGN KEY (fk_prof) REFERENCES Professeur(id),
    FOREIGN KEY (fk_salle) REFERENCES Salle(id)
);

CREATE TABLE Eleve (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    prenom VARCHAR(255) NOT NULL,
    fk_classe INT NOT NULL,
    fk_annee INT NOT NULL,
    redouble BOOLEAN NOT NULL,
    FOREIGN KEY (fk_classe) REFERENCES Classe(id),
    FOREIGN KEY (fk_annee) REFERENCES Annee(id)
);

CREATE TABLE Archive (
    id INT AUTO_INCREMENT PRIMARY KEY, 
    nom VARCHAR(255) NOT NULL, 
    prenom VARCHAR(255) NOT NULL, 
    annee_naissance YEAR NOT NULL, 
    annee_cours VARCHAR(255) NOT NULL, 
    classe VARCHAR(255) NOT NULL, 
    professeur VARCHAR(255) NOT NULL,
    passe BOOLEAN NOT NULL 
);

-- Créer un utilisateur et lui accorder les privilèges nécessaires
CREATE USER 'admin'@'localhost' IDENTIFIED BY 'admin';
GRANT ALL PRIVILEGES ON QuaDev.* TO 'admin'@'localhost';
FLUSH PRIVILEGES;
