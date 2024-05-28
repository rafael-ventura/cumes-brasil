CREATE TABLE IF NOT EXISTS Fonte (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    autor TEXT NOT NULL,
    referencia TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS montanha (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    localizacao TEXT NOT NULL,
    altura REAL,
    fonte INTEGER NOT NULL,
    FOREIGN KEY (fonte) REFERENCES Fonte (id)
);

CREATE TABLE IF NOT EXISTS Face (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    montanha_id INTEGER NOT NULL,
    fonte INTEGER NOT NULL,
    FOREIGN KEY (montanha_id) REFERENCES montanha (id),
    FOREIGN KEY (fonte) REFERENCES Fonte (id)
);

CREATE TABLE IF NOT EXISTS Via (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    grau TEXT,
    crux TEXT,
    artificial TEXT,
    duracao TEXT,
    exposicao TEXT,
    extensao INTEGER,
    conquistadores TEXT,
    detalhes TEXT,
    data DATE,
    montanha_id INTEGER NOT NULL,
    face_id INTEGER NOT NULL,
    via_principal_id INTEGER,
    fonte INTEGER NOT NULL,
    FOREIGN KEY (montanha_id) REFERENCES montanha (id),
    FOREIGN KEY (face_id) REFERENCES Face (id),
    FOREIGN KEY (via_principal_id) REFERENCES Via (id),
    FOREIGN KEY (fonte) REFERENCES Fonte (id)
);

CREATE TABLE IF NOT EXISTS Croqui (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    imagemUrl TEXT NOT NULL,
    autor TEXT NOT NULL,
    descricao TEXT,
    fonte INTEGER NOT NULL,
    FOREIGN KEY (fonte) REFERENCES Fonte (id)
);

CREATE TABLE IF NOT EXISTS Usuario (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    fotoPerfil TEXT,
    password_hash TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS Colecao (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    descricao TEXT,
    usuario_id INTEGER NOT NULL,
    FOREIGN KEY (usuario_id) REFERENCES Usuario (id)
);

CREATE TABLE IF NOT EXISTS Escalada (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    data DATE,
    observacao TEXT,
    usuario_id INTEGER NOT NULL,
    via_id INTEGER NOT NULL,
    FOREIGN KEY (usuario_id) REFERENCES Usuario (id),
    FOREIGN KEY (via_id) REFERENCES Via (id)
);


CREATE TABLE IF NOT EXISTS ViasCroquis (
    croqui_id INTEGER,
    via_id INTEGER,
    PRIMARY KEY (croqui_id, via_id),
    FOREIGN KEY (croqui_id) REFERENCES Croqui (id),
    FOREIGN KEY (via_id) REFERENCES Via (id)
);

CREATE TABLE IF NOT EXISTS ViasColecoes (
    via_id INTEGER,
    colecao_id INTEGER,
    PRIMARY KEY (via_id, colecao_id),
    FOREIGN KEY (via_id) REFERENCES Via (id),
    FOREIGN KEY (colecao_id) REFERENCES Colecao (id)
);
