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
  fk_eleve INT NOT NULL, -- Référence vers l'élève
  fk_classe INT NOT NULL, -- Référence vers la classe
  fk_annee INT NOT NULL, -- Référence vers l'année scolaire
  FOREIGN KEY (fk_eleve) REFERENCES Eleve(id),
  FOREIGN KEY (fk_classe) REFERENCES Classe(id),
  FOREIGN KEY (fk_annee) REFERENCES Annee(id)
);

CREATE USER 'admin'@'localhost' IDENTIFIED BY 'admin';
GRANT ALL PRIVILEGES ON QuaDav.* TO 'admin'@'localhost';
FLUSH PRIVILEGES;
