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
exports.SyncController = exports.SyncPushDto = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const sync_service_1 = require("./sync.service");
class SyncPushDto {
}
exports.SyncPushDto = SyncPushDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SyncPushDto.prototype, "studentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [Object] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], SyncPushDto.prototype, "attempts", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [Object] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], SyncPushDto.prototype, "progressUpdates", void 0);
let SyncController = class SyncController {
    constructor(syncService) {
        this.syncService = syncService;
    }
    async push(body) {
        return this.syncService.processPush(body.studentId, body.attempts || [], body.progressUpdates || []);
    }
    async pull(studentId, since) {
        return this.syncService.processPull(studentId, since);
    }
};
exports.SyncController = SyncController;
__decorate([
    (0, common_1.Post)('push'),
    (0, swagger_1.ApiOperation)({ summary: 'Submit pending offline attempts and level progress' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Attempts reconciled idempotently' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [SyncPushDto]),
    __metadata("design:returntype", Promise)
], SyncController.prototype, "push", null);
__decorate([
    (0, common_1.Get)('pull'),
    (0, swagger_1.ApiOperation)({ summary: 'Pull remote updates for student since timestamp' }),
    __param(0, (0, common_1.Query)('studentId')),
    __param(1, (0, common_1.Query)('since')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], SyncController.prototype, "pull", null);
exports.SyncController = SyncController = __decorate([
    (0, swagger_1.ApiTags)('Offline Synchronization'),
    (0, common_1.Controller)('api/v1/sync'),
    __metadata("design:paramtypes", [sync_service_1.SyncService])
], SyncController);
//# sourceMappingURL=sync.controller.js.map