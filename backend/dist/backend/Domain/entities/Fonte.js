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
exports.Fonte = void 0;
const typeorm_1 = require("typeorm");
const Via_1 = require("./Via");
const Croqui_1 = require("./Croqui");
let Fonte = class Fonte extends typeorm_1.BaseEntity {
};
exports.Fonte = Fonte;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Fonte.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false }),
    __metadata("design:type", String)
], Fonte.prototype, "autor", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false }),
    __metadata("design:type", String)
], Fonte.prototype, "referencia", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Via_1.Via, via => via.fonte),
    __metadata("design:type", Array)
], Fonte.prototype, "vias", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Croqui_1.Croqui, croqui => croqui.fonte),
    __metadata("design:type", Array)
], Fonte.prototype, "croquis", void 0);
exports.Fonte = Fonte = __decorate([
    (0, typeorm_1.Entity)()
], Fonte);
