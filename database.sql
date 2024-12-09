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
    annee_naissance YEAR NOT NULL,
    fk_classe INT NOT NULL,
    fk_annee INT NOT NULL,
    redouble BOOLEAN NOT NULL,
    FOREIGN KEY (fk_classe) REFERENCES Classe(id),
    FOREIGN KEY (fk_annee) REFERENCES Annee(id)
);

CREATE TABLE Archive (
    id INT AUTO_INCREMENT PRIMARY KEY, -- Identifiant unique de l'archive
    nom VARCHAR(255) NOT NULL, -- Nom de l'élève
    prenom VARCHAR(255) NOT NULL, -- Prénom de l'élève
    annee_naissance YEAR NOT NULL, -- Année de naissance de l'élève
    annee_cours VARCHAR(255) NOT NULL, -- Année en cours (libellé)
    classe VARCHAR(255) NOT NULL, -- Classe de l'élève
    professeur VARCHAR(255) NOT NULL, -- Professeur responsable
    passe BOOLEAN NOT NULL -- Indique si l'élève a passé l'année
);


CREATE USER 'admin'@'localhost' IDENTIFIED BY 'admin';
GRANT ALL PRIVILEGES ON QuaDav.* TO 'admin'@'localhost';
FLUSH PRIVILEGES;
