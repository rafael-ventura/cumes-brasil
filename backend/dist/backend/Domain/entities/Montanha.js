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
exports.Montanha = void 0;
const typeorm_1 = require("typeorm");
const Fonte_1 = require("./Fonte");
const Imagem_1 = require("./Imagem");
const Face_1 = require("./Face");
const Via_1 = require("./Via");
let Montanha = class Montanha extends typeorm_1.BaseEntity {
};
exports.Montanha = Montanha;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Montanha.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false }),
    __metadata("design:type", String)
], Montanha.prototype, "nome", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Montanha.prototype, "bairro", void 0);
__decorate([
    (0, typeorm_1.Column)("int", { nullable: true }),
    __metadata("design:type", Number)
], Montanha.prototype, "altura", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Fonte_1.Fonte),
    __metadata("design:type", Number)
], Montanha.prototype, "fonte", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Imagem_1.Imagem),
    __metadata("design:type", Number)
], Montanha.prototype, "imagem", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Face_1.Face, face => face.montanha),
    __metadata("design:type", Array)
], Montanha.prototype, "faces", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Via_1.Via, via => via.montanha),
    __metadata("design:type", Array)
], Montanha.prototype, "vias", void 0);
exports.Montanha = Montanha = __decorate([
    (0, typeorm_1.Entity)()
], Montanha);
