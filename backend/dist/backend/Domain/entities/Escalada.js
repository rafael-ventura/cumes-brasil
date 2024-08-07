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
exports.Escalada = void 0;
const typeorm_1 = require("typeorm");
const Via_1 = require("./Via");
const Usuario_1 = require("./Usuario");
const Participante_1 = require("./Participante");
let Escalada = class Escalada extends typeorm_1.BaseEntity {
};
exports.Escalada = Escalada;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Escalada.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false }),
    __metadata("design:type", String)
], Escalada.prototype, "data", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Escalada.prototype, "observacao", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Participante_1.Participante, participante => participante.escalada, { cascade: true }),
    __metadata("design:type", Array)
], Escalada.prototype, "participantes", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Usuario_1.Usuario, usuario => usuario.escaladas),
    __metadata("design:type", Number)
], Escalada.prototype, "usuarioId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Via_1.Via, via => via.escaladas),
    __metadata("design:type", Number)
], Escalada.prototype, "viaId", void 0);
exports.Escalada = Escalada = __decorate([
    (0, typeorm_1.Entity)()
], Escalada);
