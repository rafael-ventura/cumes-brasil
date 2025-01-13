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
exports.ViaColecao = void 0;
const typeorm_1 = require("typeorm");
const Via_1 = require("./Via");
const Colecao_1 = require("./Colecao");
let ViaColecao = class ViaColecao extends typeorm_1.BaseEntity {
};
exports.ViaColecao = ViaColecao;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], ViaColecao.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Via_1.Via, via => via.viaColecoes),
    (0, typeorm_1.JoinColumn)({ name: 'viaId' }),
    __metadata("design:type", Via_1.Via)
], ViaColecao.prototype, "via", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Colecao_1.Colecao, colecao => colecao.viaColecoes),
    (0, typeorm_1.JoinColumn)({ name: 'colecaoId' }),
    __metadata("design:type", Colecao_1.Colecao)
], ViaColecao.prototype, "colecao", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], ViaColecao.prototype, "data_adicao", void 0);
exports.ViaColecao = ViaColecao = __decorate([
    (0, typeorm_1.Entity)()
], ViaColecao);
