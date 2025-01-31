import AWS from 'aws-sdk';
import dotenv from 'dotenv';

dotenv.config();

// Configurar AWS SDK v2
AWS.config.update({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const s3 = new AWS.S3();

class S3Helper {
  private bucketName = process.env.AWS_S3_BUCKET_NAME!;
  private cloudfrontUrl = process.env.CLOUDFRONT_URL!;

  async uploadFileS3(fileName: string, fileBuffer: Buffer, fileMimeType: string): Promise<string> {
    try {
      const params = {
        Bucket: this.bucketName,
        Key: fileName,
        Body: fileBuffer,
        ContentType: fileMimeType,
        ACL: 'public-read',
      };

      const result = await s3.upload(params).promise();

      console.log(`✅ Arquivo enviado para S3: ${fileName}`);
      return `${this.cloudfrontUrl}/${fileName}`;
    } catch (error) {
      console.error('❌ Erro ao enviar arquivo para S3:', error);
      throw new Error('Falha ao fazer upload da imagem.');
    }
  }

  async deleteFileS3(fileName: string): Promise<void> {
    try {
      const params = {
        Bucket: this.bucketName,
        Key: fileName,
      };

      await s3.deleteObject(params).promise();
      console.log(`🗑️ Arquivo deletado do S3: ${fileName}`);
    } catch (error) {
      console.error('❌ Erro ao deletar arquivo do S3:', error);
      throw new Error('Falha ao deletar a imagem.');
    }
  }

  async getFileSignedUrl(fileName: string): Promise<string> {
    try {
      const params = {
        Bucket: this.bucketName,
        Key: fileName,
        Expires: 3600, // URL válida por 1 hora
      };

      const signedUrl = s3.getSignedUrl('getObject', params);
      console.log(`🔗 URL assinada gerada para: ${fileName}`);
      return signedUrl;
    } catch (error) {
      console.error('❌ Erro ao gerar URL assinada:', error);
      throw new Error('Falha ao gerar URL da imagem.');
    }
  }
}

export default S3Helper;
