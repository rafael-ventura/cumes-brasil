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
exports.Face = void 0;
const typeorm_1 = require("typeorm");
const Montanha_1 = require("./Montanha");
const Fonte_1 = require("./Fonte");
const Via_1 = require("./Via");
let Face = class Face extends typeorm_1.BaseEntity {
};
exports.Face = Face;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Face.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false }),
    __metadata("design:type", String)
], Face.prototype, "nome", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Montanha_1.Montanha, montanha => montanha.faces),
    __metadata("design:type", Number)
], Face.prototype, "montanha", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Fonte_1.Fonte, fonte => fonte.faces),
    __metadata("design:type", Number)
], Face.prototype, "fonte", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Via_1.Via, via => via.face),
    __metadata("design:type", Array)
], Face.prototype, "vias", void 0);
exports.Face = Face = __decorate([
    (0, typeorm_1.Entity)()
], Face);
