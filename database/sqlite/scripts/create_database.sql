CREATE TABLE IF NOT EXISTS Usuario (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    email TEXT NOT NULL,
    fotoPerfil TEXT
);


CREATE TABLE IF NOT EXISTS Montanha (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    localizacao TEXT NOT NULL,
    altura REAL
);


CREATE TABLE IF NOT EXISTS Face (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    montanha_id INTEGER NOT NULL,
    FOREIGN KEY (montanha_id) REFERENCES Montanha (id)
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
    montanha_id INTEGER,
    face_id INTEGER,
    via_principal_id INTEGER,
    fonte_id INTEGER,
    FOREIGN KEY (montanha_id) REFERENCES Montanha (id),
    FOREIGN KEY (face_id) REFERENCES Face (id),
    FOREIGN KEY (via_principal_id) REFERENCES Via (id),
    FOREIGN KEY (fonte_id) REFERENCES Fonte (id)
);


CREATE TABLE IF NOT EXISTS Fonte (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    referencia TEXT NOT NULL
);


CREATE TABLE IF NOT EXISTS Croqui (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    imagemUrl TEXT NOT NULL,
    autor TEXT NOT NULL,
    descricao TEXT
);

CREATE TABLE IF NOT EXISTS ColecaoBase (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    descricao TEXT,
    usuario_id INTEGER,
    FOREIGN KEY (usuario_id) REFERENCES Usuario (id)
);

CREATE TABLE IF NOT EXISTS ColecaoEscaladas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    descricao TEXT,
    usuario_id INTEGER,
    via_id INTEGER NOT NULL,
    data DATE,
    observacao TEXT,
    FOREIGN KEY (usuario_id) REFERENCES Usuario (id),
    FOREIGN KEY (via_id) REFERENCES Via (id)
);


CREATE TABLE IF NOT EXISTS ColecaoFavoritos (
    colecaoBase_id INTEGER PRIMARY KEY,
    FOREIGN KEY (colecaoBase_id) REFERENCES ColecaoBase (id)
);

CREATE TABLE IF NOT EXISTS vias_croquis (
    croqui_id INTEGER,
    via_id INTEGER,
    PRIMARY KEY (croqui_id, via_id),
    FOREIGN KEY (croqui_id) REFERENCES Croqui (id),
    FOREIGN KEY (via_id) REFERENCES Via (id)
);

CREATE TABLE IF NOT EXISTS vias_colecoes (
    via_id INTEGER,
    colecaoBase_id INTEGER,
    PRIMARY KEY (via_id, colecaoBase_id),
    FOREIGN KEY (via_id) REFERENCES Via (id),
    FOREIGN KEY (colecaoBase_id) REFERENCES ColecaoBase (id)
);




