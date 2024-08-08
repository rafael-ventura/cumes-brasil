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
exports.Participante = void 0;
const typeorm_1 = require("typeorm");
const Escalada_1 = require("./Escalada");
let Participante = class Participante extends typeorm_1.BaseEntity {
};
exports.Participante = Participante;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Participante.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false }),
    __metadata("design:type", String)
], Participante.prototype, "tipo", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false }),
    __metadata("design:type", String)
], Participante.prototype, "nome", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Participante.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Escalada_1.Escalada, escalada => escalada.participantes, { onDelete: "CASCADE" }),
    __metadata("design:type", Escalada_1.Escalada)
], Participante.prototype, "escalada", void 0);
exports.Participante = Participante = __decorate([
    (0, typeorm_1.Entity)()
], Participante);
