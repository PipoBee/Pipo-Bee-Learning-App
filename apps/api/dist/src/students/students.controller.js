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
exports.StudentsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const roles_guard_1 = require("../auth/roles.guard");
const progress_service_1 = require("../progress/progress.service");
const students_service_1 = require("./students.service");
class CompleteLevelDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ example: 100 }),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], CompleteLevelDto.prototype, "score", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 4 }),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CompleteLevelDto.prototype, "correctCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 4 }),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CompleteLevelDto.prototype, "totalCount", void 0);
let StudentsController = class StudentsController {
    constructor(progressService, studentsService) {
        this.progressService = progressService;
        this.studentsService = studentsService;
    }
    async getDashboard(req) {
        return this.progressService.buildDashboard(this.requireProfile(req).id);
    }
    getFirstLevel(req) {
        return this.studentsService.getFirstLevel(this.requireProfile(req).id);
    }
    completeLevel(req, id, body) {
        return this.studentsService.completeLevel(this.requireProfile(req).id, id, body);
    }
    requireProfile(req) {
        const profile = req.user.students?.[0];
        if (!profile) {
            throw new common_1.NotFoundException('No student profile is linked to this account');
        }
        return profile;
    }
};
exports.StudentsController = StudentsController;
__decorate([
    (0, common_1.Get)('dashboard'),
    (0, swagger_1.ApiOperation)({ summary: 'Student progress, completion, and pending work' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], StudentsController.prototype, "getDashboard", null);
__decorate([
    (0, common_1.Get)('levels/first'),
    (0, swagger_1.ApiOperation)({ summary: 'Load Level 1 phonics sound lesson with tasks' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], StudentsController.prototype, "getFirstLevel", null);
__decorate([
    (0, common_1.Post)('levels/:id/complete'),
    (0, swagger_1.ApiOperation)({ summary: 'Save Level 1 results and unlock the next sound' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, CompleteLevelDto]),
    __metadata("design:returntype", void 0)
], StudentsController.prototype, "completeLevel", null);
exports.StudentsController = StudentsController = __decorate([
    (0, swagger_1.ApiTags)('Student Dashboard'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.STUDENT),
    (0, common_1.Controller)('api/v1/students'),
    __metadata("design:paramtypes", [progress_service_1.ProgressService,
        students_service_1.StudentsService])
], StudentsController);
//# sourceMappingURL=students.controller.js.map