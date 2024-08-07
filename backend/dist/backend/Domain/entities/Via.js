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
exports.Via = void 0;
const typeorm_1 = require("typeorm");
const Croqui_1 = require("./Croqui");
const Montanha_1 = require("./Montanha");
const Fonte_1 = require("./Fonte");
const Face_1 = require("./Face");
const Imagem_1 = require("./Imagem");
const Escalada_1 = require("./Escalada");
const Colecao_1 = require("./Colecao");
let Via = class Via extends typeorm_1.BaseEntity {
};
exports.Via = Via;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Via.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Via.prototype, "nome", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Via.prototype, "grau", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Via.prototype, "crux", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Via.prototype, "artificial", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Via.prototype, "duracao", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Via.prototype, "exposicao", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "decimal",
        precision: 5,
        scale: 2,
        nullable: true
    }),
    __metadata("design:type", Number)
], Via.prototype, "extensao", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "varchar",
        nullable: true
    }),
    __metadata("design:type", String)
], Via.prototype, "conquistadores", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Via.prototype, "detalhes", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Via.prototype, "data", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Montanha_1.Montanha, montanha => montanha.vias),
    __metadata("design:type", Number)
], Via.prototype, "montanha", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Via, via => via.variantes),
    __metadata("design:type", Number)
], Via.prototype, "viaPrincipal", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Via, via => via.viaPrincipal),
    __metadata("design:type", Array)
], Via.prototype, "variantes", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Fonte_1.Fonte, fonte => fonte.vias),
    __metadata("design:type", Number)
], Via.prototype, "fonte", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Face_1.Face, face => face.vias),
    __metadata("design:type", Number)
], Via.prototype, "face", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Imagem_1.Imagem, imagem => imagem.vias),
    __metadata("design:type", Number)
], Via.prototype, "imagem", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => Croqui_1.Croqui, croqui => croqui.vias),
    (0, typeorm_1.JoinTable)({
        name: "via_croqui",
        joinColumn: {
            name: "via_id",
            referencedColumnName: "id"
        },
        inverseJoinColumn: {
            name: "croqui_id",
            referencedColumnName: "id"
        }
    }),
    __metadata("design:type", Array)
], Via.prototype, "croquis", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => Colecao_1.Colecao, colecao => colecao.vias),
    __metadata("design:type", Array)
], Via.prototype, "colecoes", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Escalada_1.Escalada, escalada => escalada.viaId),
    __metadata("design:type", Array)
], Via.prototype, "escaladas", void 0);
exports.Via = Via = __decorate([
    (0, typeorm_1.Entity)()
], Via);
