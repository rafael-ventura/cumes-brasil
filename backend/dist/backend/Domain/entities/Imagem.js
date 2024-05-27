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
exports.Imagem = void 0;
const typeorm_1 = require("typeorm");
const Colecao_1 = require("./Colecao");
const Via_1 = require("./Via");
const Montanha_1 = require("./Montanha");
const Usuario_1 = require("./Usuario");
let Imagem = class Imagem extends typeorm_1.BaseEntity {
    constructor(id, url, descricao) {
        super();
        this.id = id;
        this.url = url;
        this.descricao = descricao;
    }
};
exports.Imagem = Imagem;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Imagem.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false }),
    __metadata("design:type", String)
], Imagem.prototype, "url", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Imagem.prototype, "descricao", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Via_1.Via, via => via.imagem),
    __metadata("design:type", Array)
], Imagem.prototype, "vias", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Montanha_1.Montanha, montanha => montanha.imagem),
    __metadata("design:type", Array)
], Imagem.prototype, "montanhas", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Usuario_1.Usuario, usuario => usuario.fotoPerfil),
    __metadata("design:type", Array)
], Imagem.prototype, "usuarios", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Colecao_1.Colecao, colecao => colecao.imagem),
    __metadata("design:type", Array)
], Imagem.prototype, "colecoes", void 0);
exports.Imagem = Imagem = __decorate([
    (0, typeorm_1.Entity)(),
    __metadata("design:paramtypes", [Number, String, String])
], Imagem);
