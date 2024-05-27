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
exports.ColecaoVia = void 0;
const typeorm_1 = require("typeorm");
const Colecao_1 = require("./Colecao");
const Via_1 = require("./Via");
let ColecaoVia = class ColecaoVia {
};
exports.ColecaoVia = ColecaoVia;
__decorate([
    (0, typeorm_1.PrimaryColumn)(),
    __metadata("design:type", Number)
], ColecaoVia.prototype, "colecao_id", void 0);
__decorate([
    (0, typeorm_1.PrimaryColumn)(),
    __metadata("design:type", Number)
], ColecaoVia.prototype, "via_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Colecao_1.Colecao, colecao => colecao.viasColecoes),
    (0, typeorm_1.JoinColumn)({ name: "colecao_id" }),
    __metadata("design:type", Colecao_1.Colecao)
], ColecaoVia.prototype, "colecao", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Via_1.Via, via => via.viasColecoes),
    (0, typeorm_1.JoinColumn)({ name: "via_id" }),
    __metadata("design:type", Via_1.Via)
], ColecaoVia.prototype, "via", void 0);
exports.ColecaoVia = ColecaoVia = __decorate([
    (0, typeorm_1.Entity)("colecao_via"),
    (0, typeorm_1.Unique)(["colecao", "via"])
], ColecaoVia);
