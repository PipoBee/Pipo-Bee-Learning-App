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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParentsController = exports.CreateChildDto = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const roles_guard_1 = require("../auth/roles.guard");
const parents_service_1 = require("./parents.service");
class CreateChildDto {
}
exports.CreateChildDto = CreateChildDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Mia' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    __metadata("design:type", String)
], CreateChildDto.prototype, "displayName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 6, required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(3),
    (0, class_validator_1.Max)(14),
    __metadata("design:type", Number)
], CreateChildDto.prototype, "age", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'owl_01', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateChildDto.prototype, "avatarId", void 0);
let ParentsController = class ParentsController {
    constructor(parentsService) {
        this.parentsService = parentsService;
    }
    listChildren(req) {
        return this.parentsService.listChildren(req.user.id);
    }
    createChild(req, body) {
        return this.parentsService.createChild(req.user.id, body);
    }
    getChildDashboard(req, id) {
        return this.parentsService.getChildDashboard(req.user.id, id);
    }
    deleteChild(req, id) {
        return this.parentsService.deleteChild(req.user.id, id);
    }
};
exports.ParentsController = ParentsController;
__decorate([
    (0, common_1.Get)('children'),
    (0, swagger_1.ApiOperation)({ summary: 'List the parent child dashboards (max 3)' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ParentsController.prototype, "listChildren", null);
__decorate([
    (0, common_1.Post)('children'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a child dashboard (maximum of 3)' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, CreateChildDto]),
    __metadata("design:returntype", void 0)
], ParentsController.prototype, "createChild", null);
__decorate([
    (0, common_1.Get)('children/:id/dashboard'),
    (0, swagger_1.ApiOperation)({ summary: 'View one child progress, completion, and pending work' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], ParentsController.prototype, "getChildDashboard", null);
__decorate([
    (0, common_1.Delete)('children/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Remove a child dashboard and free a slot' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], ParentsController.prototype, "deleteChild", null);
exports.ParentsController = ParentsController = __decorate([
    (0, swagger_1.ApiTags)('Parent Dashboard'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.PARENT),
    (0, common_1.Controller)('api/v1/parents'),
    __metadata("design:paramtypes", [parents_service_1.ParentsService])
], ParentsController);
//# sourceMappingURL=parents.controller.js.map