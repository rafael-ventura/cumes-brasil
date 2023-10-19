DROP DATABASE IF EXISTS cumes_brasil;

CREATE DATABASE cumes_brasil;

USE cumes_brasil;


DROP TABLE IF EXISTS Usuarios;
CREATE TABLE Usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL
);

DROP TABLE IF EXISTS ColecoesDosUsuarios;
CREATE TABLE ColecoesDosUsuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    tipo_colecao VARCHAR(255) NOT NULL,
    usuario_id INT NOT NULL,
    FOREIGN KEY (usuario_id) REFERENCES Usuarios(id)
);
DROP DATABASE IF EXISTS cumes_brasil;

CREATE DATABASE cumes_brasil;

USE cumes_brasil;

-- Fontes
DROP TABLE IF EXISTS fontes;

LOAD DATA LOCAL INFILE 'C:/Dev/cume-brasil/assets/fontes.csv' 
INTO TABLE fontes 
FIELDS TERMINATED BY ',' 
ENCLOSED BY '\''
LINES TERMINATED BY '\n'
IGNORE 1 ROWS;

-- Montanhas
DROP TABLE IF EXISTS montanhas;

LOAD DATA LOCAL INFILE 'C:/Dev/cume-brasil/assets/montanhas.csv' 
INTO TABLE montanhas 
FIELDS TERMINATED BY ',' 
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS;

-- Faces
DROP TABLE IF EXISTS faces;

LOAD DATA LOCAL INFILE 'C:/Dev/cume-brasil/assets/faces.csv' 
INTO TABLE faces 
FIELDS TERMINATED BY ',' 
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS;

-- Variantes
DROP TABLE IF EXISTS variantes;
CREATE TABLE variantes (
    variante_id INT PRIMARY KEY,
    vias VARCHAR(255),
    grau FLOAT,
    crux VARCHAR(50),
    aid VARCHAR(50),
    duracao VARCHAR(50),
    exposicao VARCHAR(50),
    extensao INT,
    conquistadores TEXT,
    data DATE,
    source_id INT
);
LOAD DATA LOCAL INFILE 'C:/Dev/cume-brasil/assets/variante.csv' 
INTO TABLE variantes 
FIELDS TERMINATED BY ',' 
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS;

-- Vias Principal
DROP TABLE IF EXISTS vias_main;
CREATE TABLE vias_main (
    id INT PRIMARY KEY,
    vias VARCHAR(255),
    grau FLOAT,
    crux VARCHAR(50),
    aid VARCHAR(50),
    duracao VARCHAR(50),
    exposicao VARCHAR(50),
    extensao INT,
    conquistadores TEXT,
    data DATE,
    mount_id INT,
    face_id INT,
    source_id INT,
    variante_id INT
);
LOAD DATA LOCAL INFILE 'C:/Dev/cume-brasil/assets/vias_principal.csv' 
INTO TABLE vias_main 
FIELDS TERMINATED BY ',' 
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS;

-- Vias Variantes
DROP TABLE IF EXISTS vias_variantes;
CREATE TABLE vias_variantes (
    id INT,
    variante_id INT,
    PRIMARY KEY (id, variante_id),
    FOREIGN KEY (id) REFERENCES vias_main(id),
    FOREIGN KEY (variante_id) REFERENCES variantes(variante_id)
);
LOAD DATA LOCAL INFILE 'C:/Dev/cume-brasil/assets/vias_variantes.csv' 
INTO TABLE vias_variantes 
FIELDS TERMINATED BY ',' 
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS;
