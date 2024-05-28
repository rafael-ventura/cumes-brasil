"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Usuario = void 0;
const typeorm_1 = require("typeorm");
const Colecao_1 = require("./Colecao");
const Imagem_1 = require("./Imagem");
const Escalada_1 = require("./Escalada");
let Usuario = class Usuario extends typeorm_1.BaseEntity {
};
exports.Usuario = Usuario;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Usuario.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false }),
    __metadata("design:type", String)
], Usuario.prototype, "nome", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false }),
    __metadata("design:type", String)
], Usuario.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false }),
    __metadata("design:type", String)
], Usuario.prototype, "password_hash", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Imagem_1.Imagem, imagem => imagem.usuarios),
    __metadata("design:type", Number)
], Usuario.prototype, "foto_perfil", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Colecao_1.Colecao, colecao => colecao.usuario),
    __metadata("design:type", Array)
], Usuario.prototype, "colecoes", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Escalada_1.Escalada, escalada => escalada.usuario),
    __metadata("design:type", Array)
], Usuario.prototype, "escaladas", void 0);
exports.Usuario = Usuario = __decorate([
    (0, typeorm_1.Entity)()
], Usuario);
