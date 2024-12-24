import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIdadeEmUsuario1735017337776 implements MigrationInterface {
    name = 'AddIdadeEmUsuario1735017337776'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "usuario" ADD "idade" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "usuario" DROP COLUMN "idade"`);
    }

}
