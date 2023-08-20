-- Criação banco de dados com MySQL.
DROP DATABASE IF EXISTS cumes_brasil;
CREATE DATABASE cumes_brasil;

use cumes_brasil;

-- Verificando e criando a tabela montanhas
DROP TABLE IF EXISTS montanhas;
CREATE TABLE montanhas (
  mount_id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
  montanhas VARCHAR(100),
  altitude INT
);

LOAD DATA INFILE 'C:\\ProgramData\\MySQL\\MySQL Server 8.0\\Uploads\\montanhas.csv'
INTO TABLE montanhas
FIELDS TERMINATED BY ','
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS;
-- Verificando e criando a tabela faces
DROP TABLE IF EXISTS faces;
CREATE TABLE faces (
  face_id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
  faces VARCHAR(100),
  mount_id INT NOT NULL,
  FOREIGN KEY (mount_id) REFERENCES montanhas(mount_id)
);

LOAD DATA INFILE 'C:\\ProgramData\\MySQL\\MySQL Server 8.0\\Uploads\\faces.csv'
INTO TABLE faces
FIELDS TERMINATED BY ','
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS;

CREATE TABLE fontes (
  source_id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
  fontes VARCHAR(200)
);

-- Importar os dados da planilha csv apropriada
LOAD DATA INFILE 'C:\\ProgramData\\MySQL\\MySQL Server 8.0\\Uploads\\fontes.csv'
INTO TABLE fontes
FIELDS TERMINATED BY ','
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS;

-- Verificando e criando a tabela principal
DROP TABLE IF EXISTS vias_main;
CREATE TABLE vias_main (
  id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
  vias VARCHAR(100),
  grau INT,
  crux VARCHAR(20),
  aid VARCHAR(30),
  duracao VARCHAR(10),
  exposicao VARCHAR(5),
  extensao INT,
  conquistadores VARCHAR(200),
  data VARCHAR(15),
  mount_id INT,
  face_id INT NOT NULL,
  source_id INT,
  FOREIGN KEY (face_id) REFERENCES faces(face_id),
  FOREIGN KEY (mount_id) REFERENCES montanhas(mount_id),
  FOREIGN KEY (source_id) REFERENCES fontes(source_id)
);

-- Importando dados para a tabela vias_main
LOAD DATA INFILE 'C:\\ProgramData\\MySQL\\MySQL Server 8.0\\Uploads\\vias_principal.csv'
INTO TABLE vias_main
FIELDS TERMINATED BY ','
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS;
