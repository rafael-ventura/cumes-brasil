import multer from 'multer';
import path from 'path';
import crypto from 'crypto';
import { Request, Response, NextFunction } from 'express';

export class MulterMiddleware {
  private static storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.resolve(__dirname, '..', '..', '..', 'assets'));
    },
    filename: (req: any, file, cb) => {
      crypto.randomBytes(16, (err, hash) => {
        if (err) {
          cb(err, '');
        } else {
          const usuarioId = req.user?.usuarioId || 'unknown';
          const fileName = `foto_perfil-userId-${usuarioId}-${Date.now()}${path.extname(file.originalname)}`;
          cb(null, fileName);
        }
      });
    }
  });

  public static upload = multer({
    storage: MulterMiddleware.storage
  }).single('foto_perfil');

  public static handleErrors(err: any, req: Request, res: Response, next: NextFunction) {
    if (err) {
      return res.status(400).json({
        message: 'Erro ao fazer upload da imagem.'
      });
    }
    next();
  }
}
