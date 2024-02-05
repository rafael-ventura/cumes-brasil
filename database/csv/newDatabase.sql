DROP DATABASE IF EXISTS cumes_brasil;
CREATE DATABASE cumes_brasil;
USE cumes_brasil;

SET foreign_key_checks = 0;

-- Usuarios
DROP TABLE IF EXISTS Usuarios;
CREATE TABLE Usuarios (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL
);
LOAD DATA LOCAL INFILE '/mnt/data/usuarios.csv'
    INTO TABLE Usuarios
    FIELDS TERMINATED BY ','
    ENCLOSED BY '"'
    LINES TERMINATED BY '\\n'
    IGNORE 1 ROWS;

-- ColecoesDosUsuarios
DROP TABLE IF EXISTS ColecoesDosUsuarios;
CREATE TABLE ColecoesDosUsuarios (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(255) NOT NULL,
    tipo_colecao VARCHAR(255) NOT NULL,
    usuario_id INT NOT NULL,
    FOREIGN KEY (usuario_id) REFERENCES Usuarios(id)
);
LOAD DATA LOCAL INFILE '/mnt/data/colecoes.csv'
    INTO TABLE ColecoesDosUsuarios
    FIELDS TERMINATED BY ','
    ENCLOSED BY '"'
    LINES TERMINATED BY '\\n'
    IGNORE 1 ROWS;

-- Montanhas
DROP TABLE IF EXISTS Montanhas;
CREATE TABLE Montanhas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(255) NOT NULL,
    altitude FLOAT NOT NULL
);
LOAD DATA LOCAL INFILE '/mnt/data/montanhas.csv'
    INTO TABLE Montanhas
    FIELDS TERMINATED BY ','
    ENCLOSED BY '"'
    LINES TERMINATED BY '\\n'
    IGNORE 1 ROWS;

-- Faces
DROP TABLE IF EXISTS Faces;
CREATE TABLE Faces (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(255) NOT NULL
);
LOAD DATA LOCAL INFILE '/mnt/data/faces.csv'
    INTO TABLE Faces
    FIELDS TERMINATED BY ','
    ENCLOSED BY '"'
    LINES TERMINATED BY '\\n'
    IGNORE 1 ROWS;

-- Fontes
DROP TABLE IF EXISTS Fontes;
CREATE TABLE Fontes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    referencia VARCHAR(255) NOT NULL
);
LOAD DATA LOCAL INFILE '/mnt/data/fontes.csv'
    INTO TABLE Fontes
    FIELDS TERMINATED BY ','
    ENCLOSED BY '"'
    LINES TERMINATED BY '\\n'
    IGNORE 1 ROWS;

-- Vias
DROP TABLE IF EXISTS Vias;
CREATE TABLE Vias (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(255) NOT NULL,
    grau INT,
    crux VARCHAR(255) NOT NULL,
    artificial VARCHAR(50),
    duracao VARCHAR(50),
    exposicao VARCHAR(50),
    conquistadores VARCHAR(255),
    detalhes VARCHAR(255),
    variante INT,
    montanha INT,
    face INT,
    data DATE,
    FOREIGN KEY (variante) REFERENCES Vias(id),
    FOREIGN KEY (montanha) REFERENCES Montanhas(id),
    FOREIGN KEY (face) REFERENCES Faces(id)
);
LOAD DATA LOCAL INFILE '/mnt/data/vias.csv'
    INTO TABLE Vias
    FIELDS TERMINATED BY ','
    ENCLOSED BY '"'
    LINES TERMINATED BY '\\n'
    IGNORE 1 ROWS;

-- Croquis
DROP TABLE IF EXISTS Croquis;
CREATE TABLE Croquis (
    id INT PRIMARY KEY AUTO_INCREMENT,
    caminho_imagem VARCHAR(255) NULL,
    autor VARCHAR(255) NOT NULL
);
LOAD DATA LOCAL INFILE '/mnt/data/croqui.csv'
    INTO TABLE Croquis
    FIELDS TERMINATED BY ','
    ENCLOSED BY '"'
    LINES TERMINATED BY '\\n'
    IGNORE 1 ROWS;

-- ViasCroquis
DROP TABLE IF EXISTS ViasCroquis;
CREATE TABLE ViasCroquis (
    id_via INT,
    id_croqui INT,
    PRIMARY KEY (id_via, id_croqui),
    FOREIGN KEY (id_via) REFERENCES Vias(id),
    FOREIGN KEY (id_croqui) REFERENCES Croquis(id)
);
LOAD DATA LOCAL INFILE '/mnt/data/vias_croquis.csv'
    INTO TABLE ViasCroquis
    FIELDS TERMINATED BY ','
    ENCLOSED BY '"'
    LINES TERMINATED BY '\\n'
    IGNORE 1 ROWS;

-- ViasColecaos
DROP TABLE IF EXISTS ViasColecaos;
CREATE TABLE ViasColecaos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    colecao_id INT NOT NULL,
    via_id INT NOT NULL,
    FOREIGN KEY (colecao_id) REFERENCES ColecoesDosUsuarios(id),
    FOREIGN KEY (via_id) REFERENCES Vias(id)
);
LOAD DATA LOCAL INFILE '/mnt/data/vias_colecoes.csv'
    INTO TABLE ViasColecaos
    FIELDS TERMINATED BY ','
    ENCLOSED BY '"'
    LINES TERMINATED BY '\\n'
    IGNORE 1 ROWS;

SET foreign_key_checks = 1;