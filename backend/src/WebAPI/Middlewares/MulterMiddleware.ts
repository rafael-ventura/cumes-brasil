import multer, { MulterError } from 'multer';
import path from 'path';
import crypto from 'crypto';
import { Request, Response, NextFunction } from 'express';

export class MulterMiddleware {
  private static readonly MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
  private static readonly ALLOWED_MIMES = [
    'image/jpeg',
    'image/pjpeg',
    'image/png',
    'image/gif'
  ];

  private static storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.resolve(__dirname, '..', '..', '..', 'assets'));
    },
    filename: (req: any, file, cb) => {
      crypto.randomBytes(16, (err, hash) => {
        if (err) {
          cb(err, '');
        } else {
          const usuarioId = req.user?.userId || 'unknown'; // Certifique-se de que req.user existe
          const fileName = `foto_perfil-userId-${usuarioId}-${Date.now()}${path.extname(file.originalname)}`;
          cb(null, fileName);
        }
      });
    }
  });

  private static fileFilter(req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) {
    if (MulterMiddleware.ALLOWED_MIMES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Formato inválido. Aceitamos apenas imagens nos formatos JPG, PNG ou GIF.'));
    }
  }

  public static upload = multer({
    storage: MulterMiddleware.storage,
    limits: {
      fileSize: MulterMiddleware.MAX_FILE_SIZE
    },
    fileFilter: MulterMiddleware.fileFilter
  }).single('foto_perfil'); // Certifique-se de que o campo do formulário tem este nome

  public static handleErrors(err: any, req: Request, res: Response, next: NextFunction) {
    if (err instanceof MulterError) {
      // Se o erro for relacionado ao limite de tamanho, informa o usuário
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          message: 'O tamanho do arquivo excede o limite permitido de 2MB.'
        });
      }
    } else if (err) {
      // Em caso de outros erros, exibe a mensagem fornecida
      return res.status(400).json({
        message: err.message || 'Erro ao fazer upload do arquivo.'
      });
    }

    next(); // Se não houver erro, prossegue
  }
}