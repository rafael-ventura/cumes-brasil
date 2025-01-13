"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddIdadeEmUsuario1735017337776 = void 0;
class AddIdadeEmUsuario1735017337776 {
    constructor() {
        this.name = 'AddIdadeEmUsuario1735017337776';
    }
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "usuario" ADD "idade" integer`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "usuario" DROP COLUMN "idade"`);
    }
}
exports.AddIdadeEmUsuario1735017337776 = AddIdadeEmUsuario1735017337776;
