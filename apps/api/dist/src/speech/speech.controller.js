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
exports.SpeechController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const speech_service_1 = require("./speech.service");
let SpeechController = class SpeechController {
    constructor(speechService) {
        this.speechService = speechService;
    }
    async assess(file, referenceText, targetPhoneme) {
        return this.speechService.assessSpeech(referenceText || 's', targetPhoneme, file ? file.buffer : undefined);
    }
    async getHealth() {
        return this.speechService.getHealth();
    }
};
exports.SpeechController = SpeechController;
__decorate([
    (0, common_1.Post)('assess'),
    (0, swagger_1.ApiOperation)({ summary: 'Assess audio pronunciation (Azure proxy or local fallback)' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('audio')),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Body)('referenceText')),
    __param(2, (0, common_1.Body)('targetPhoneme')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], SpeechController.prototype, "assess", null);
__decorate([
    (0, common_1.Get)('health'),
    (0, swagger_1.ApiOperation)({ summary: 'Check cloud speech provider configuration status' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SpeechController.prototype, "getHealth", null);
exports.SpeechController = SpeechController = __decorate([
    (0, swagger_1.ApiTags)('Speech Assessment'),
    (0, common_1.Controller)('api/v1/speech'),
    __metadata("design:paramtypes", [speech_service_1.SpeechService])
], SpeechController);
//# sourceMappingURL=speech.controller.js.map