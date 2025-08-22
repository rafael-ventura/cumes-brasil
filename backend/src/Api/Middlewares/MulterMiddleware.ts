import multer from 'multer';
import path from 'path';
import crypto from 'crypto';
import { NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv';

dotenv.config();

const isProduction = Boolean(process.env.CLOUDFRONT_URL) || process.env.NODE_ENV === 'production';

export class MulterMiddleware {
  private static storage = isProduction
    ? multer.memoryStorage() // Salva na memória (para enviar ao S3)
    : multer.diskStorage({
      destination: (req, file, cb) => {
        const uploadPath = path.resolve(__dirname, '..', '..', '..', 'assets');
        console.log('📂 Salvando imagem localmente em:', uploadPath); //TODO: ADD LOGGER
        cb(null, uploadPath);
      },
      filename: (req: any, file, cb) => {
        crypto.randomBytes(16, (err, hash) => {
          if (err) return cb(err, '');
          const usuarioId = req.user?.usuarioId || 'unknown';
          const fileName = `foto_perfil-userId-${usuarioId}-${Date.now()}${path.extname(file.originalname)}`;
          cb(null, fileName);
        });
      }
    });

  public static upload = multer({
    storage: MulterMiddleware.storage,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB
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
