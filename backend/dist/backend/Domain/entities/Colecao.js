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
exports.Colecao = void 0;
const typeorm_1 = require("typeorm");
const Via_1 = require("./Via");
const Imagem_1 = require("./Imagem");
const Usuario_1 = require("./Usuario");
let Colecao = class Colecao extends typeorm_1.BaseEntity {
};
exports.Colecao = Colecao;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Colecao.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false }),
    __metadata("design:type", String)
], Colecao.prototype, "nome", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Colecao.prototype, "descricao", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Usuario_1.Usuario, usuario => usuario.colecoes),
    __metadata("design:type", Number)
], Colecao.prototype, "usuario", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Imagem_1.Imagem, imagem => imagem.colecoes),
    __metadata("design:type", Number)
], Colecao.prototype, "imagem", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => Via_1.Via, via => via.colecoes),
    (0, typeorm_1.JoinTable)({
        name: "via_colecao",
        joinColumn: {
            name: "colecao_id",
            referencedColumnName: "id"
        },
        inverseJoinColumn: {
            name: "via_id",
            referencedColumnName: "id"
        }
    }),
    __metadata("design:type", Array)
], Colecao.prototype, "vias", void 0);
exports.Colecao = Colecao = __decorate([
    (0, typeorm_1.Entity)()
], Colecao);
