-- Créer la base de données si elle n'existe pas
CREATE DATABASE IF NOT EXISTS gestion_utilisateur
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

-- Utiliser la base de données
USE gestion_utilisateur;

-- Créer la table users
CREATE TABLE IF NOT EXISTS users (
    id INT NOT NULL AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'ROLE_USER',
    PRIMARY KEY (id)
);