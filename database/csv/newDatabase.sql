DROP DATABASE IF EXISTS cumes_brasil;
CREATE DATABASE cumes_brasil;
USE cumes_brasil;

SET foreign_key_checks = 0;
-- Montanhas
DROP TABLE IF EXISTS montanha;
CREATE TABLE montanha
(
    id       INT PRIMARY KEY AUTO_INCREMENT,
    nome     VARCHAR(255) NOT NULL,
    altitude INT          NULL
);
LOAD DATA LOCAL INFILE 'C:/Dev/cume-brasil/database/csv/montanhas_ajustado.csv'
    INTO TABLE montanha
    FIELDS TERMINATED BY ','
    ENCLOSED BY '"'
    LINES TERMINATED BY '\n'
    IGNORE 1 ROWS
    (id, nome, @altitude)
    SET altitude = IF(@altitude = '', NULL, @altitude);


-- Face
DROP TABLE IF EXISTS face;
CREATE TABLE face
(
    id          INT PRIMARY KEY AUTO_INCREMENT,
    nome        VARCHAR(255) NOT NULL,
    id_montanha INT,
    FOREIGN KEY (id_montanha) REFERENCES montanha (id)
);
LOAD DATA LOCAL INFILE 'C:/Dev/cume-brasil/database/csv/faces_ajustado.csv'
    INTO TABLE face
    FIELDS TERMINATED BY ','
    ENCLOSED BY '"'
    LINES TERMINATED BY '\n'
    IGNORE 1 ROWS;

-- Fonte
DROP TABLE IF EXISTS fonte;
CREATE TABLE fonte
(
    id         INT PRIMARY KEY AUTO_INCREMENT,
    referencia VARCHAR(255) NOT NULL
);
LOAD DATA LOCAL INFILE 'C:/Dev/cume-brasil/database/csv/fontes_ajustado.csv'
    INTO TABLE fonte
    FIELDS TERMINATED BY ','
    ENCLOSED BY '"'
    LINES TERMINATED BY '\n'
    IGNORE 1 ROWS;

-- Via
DROP TABLE IF EXISTS via;
CREATE TABLE via
(
    id             INT PRIMARY KEY AUTO_INCREMENT,
    nome           VARCHAR(255) NOT NULL,
    grau           INT,
    crux           VARCHAR(50),
    artificial     VARCHAR(50),
    duracao        VARCHAR(50),
    exposicao      VARCHAR(50),
    extensao       INT,
    conquistadores VARCHAR(255),
    data           DATE,
    id_montanha    INT,
    id_face        INT,
    id_fonte       INT,
    id_variante    INT,
    id_croqui      INT,                            -- Adicione esta linha
    FOREIGN KEY (id_montanha) REFERENCES montanha (id),
    FOREIGN KEY (id_face) REFERENCES face (id),
    FOREIGN KEY (id_fonte) REFERENCES fonte (id),
    FOREIGN KEY (id_variante) REFERENCES via (id),
    FOREIGN KEY (id_croqui) REFERENCES croqui (id) -- Adicione esta linha
);

-- O script de carregamento fica assim:
LOAD DATA LOCAL INFILE 'C:/Dev/cume-brasil/database/csv/vias_ajustado.csv'
    INTO TABLE via
    FIELDS TERMINATED BY ','
    ENCLOSED BY '"'
    LINES TERMINATED BY '\n'
    IGNORE 1 ROWS
    (id, nome, @var_grau, crux, @var_artificial, @var_duracao, @var_exposicao, @var_extensao, conquistadores, data,
     id_montanha, @var_id_face, id_fonte, @var_id_variante, @var_id_croqui)
    SET grau = IF(@var_grau = '', NULL, @var_grau),
        artificial = IF(@var_artificial = '', NULL, @var_artificial),
        duracao = IF(@var_duracao = '', NULL, @var_duracao),
        exposicao = IF(@var_exposicao = '', NULL, @var_exposicao),
        extensao = IF(@var_extensao = '', NULL, @var_extensao),
        id_face = IF(@var_id_face = '', NULL, @var_id_face),
        id_variante = IF(@var_id_variante = '', NULL, @var_id_variante),
        id_croqui = IF(@var_id_croqui = '', NULL, @var_id_croqui);

-- Croqui
DROP TABLE IF EXISTS croqui;
CREATE TABLE croqui
(
    id             INT PRIMARY KEY AUTO_INCREMENT,
    caminho_imagem VARCHAR(255) NULL,
    autor          VARCHAR(255) NOT NULL,
    id_via         INT,
    FOREIGN KEY (id_via) REFERENCES via (id)
);
LOAD DATA LOCAL INFILE 'C:/Dev/cume-brasil/database/csv/croqui_ajustado.csv'
    INTO TABLE croqui
    FIELDS TERMINATED BY ','
    ENCLOSED BY '"'
    LINES TERMINATED BY '\n'
    IGNORE 1 ROWS;

SET foreign_key_checks = 1;