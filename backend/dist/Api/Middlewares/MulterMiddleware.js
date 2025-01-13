"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MulterMiddleware = void 0;
const multer_1 = __importStar(require("multer"));
const path_1 = __importDefault(require("path"));
const crypto_1 = __importDefault(require("crypto"));
class MulterMiddleware {
    static fileFilter(req, file, cb) {
        if (MulterMiddleware.ALLOWED_MIMES.includes(file.mimetype)) {
            cb(null, true);
        }
        else {
            cb(new Error('Formato inválido. Aceitamos apenas imagens nos formatos JPG, PNG ou GIF.'));
        }
    }
    static handleErrors(err, req, res, next) {
        if (err instanceof multer_1.MulterError) {
            // Se o erro for relacionado ao limite de tamanho, informa o usuário
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({
                    message: 'O tamanho do arquivo excede o limite permitido de 2MB.'
                });
            }
        }
        else if (err) {
            // Em caso de outros erros, exibe a mensagem fornecida
            return res.status(400).json({
                message: err.message || 'Erro ao fazer upload do arquivo.'
            });
        }
        next(); // Se não houver erro, prossegue
    }
}
exports.MulterMiddleware = MulterMiddleware;
MulterMiddleware.MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
MulterMiddleware.ALLOWED_MIMES = [
    'image/jpeg',
    'image/pjpeg',
    'image/png',
    'image/gif'
];
MulterMiddleware.storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path_1.default.resolve(__dirname, '..', '..', '..', 'assets'));
    },
    filename: (req, file, cb) => {
        crypto_1.default.randomBytes(16, (err, hash) => {
            if (err) {
                cb(err, '');
            }
            else {
                const usuarioId = req.user?.userId || 'unknown'; // Certifique-se de que req.user existe
                const fileName = `foto_perfil-userId-${usuarioId}-${Date.now()}${path_1.default.extname(file.originalname)}`;
                cb(null, fileName);
            }
        });
    }
});
MulterMiddleware.upload = (0, multer_1.default)({
    storage: MulterMiddleware.storage,
    limits: {
        fileSize: MulterMiddleware.MAX_FILE_SIZE
    },
    fileFilter: MulterMiddleware.fileFilter
}).single('foto_perfil'); // Certifique-se de que o campo do formulário tem este nome
