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
exports.Croqui = void 0;
const typeorm_1 = require("typeorm");
const Via_1 = require("./Via");
const Fonte_1 = require("./Fonte");
const Imagem_1 = require("./Imagem");
let Croqui = class Croqui extends typeorm_1.BaseEntity {
};
exports.Croqui = Croqui;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Croqui.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false }),
    __metadata("design:type", String)
], Croqui.prototype, "nome", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Fonte_1.Fonte, fonte => fonte.croquis),
    __metadata("design:type", Number)
], Croqui.prototype, "fonte", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Imagem_1.Imagem, imagem => imagem.croquis),
    __metadata("design:type", Number)
], Croqui.prototype, "imagem", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => Via_1.Via, via => via.croquis),
    (0, typeorm_1.JoinTable)({
        name: "via_croqui",
        joinColumn: {
            name: "croqui_id",
            referencedColumnName: "id"
        },
        inverseJoinColumn: {
            name: "via_id",
            referencedColumnName: "id"
        }
    }),
    __metadata("design:type", Array)
], Croqui.prototype, "vias", void 0);
exports.Croqui = Croqui = __decorate([
    (0, typeorm_1.Entity)()
], Croqui);
