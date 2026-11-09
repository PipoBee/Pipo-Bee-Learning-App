"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const serve_static_1 = require("@nestjs/serve-static");
const path = require("path");
const prisma_module_1 = require("./database/prisma.module");
const storage_module_1 = require("./storage/storage.module");
const auth_module_1 = require("./auth/auth.module");
const content_module_1 = require("./content/content.module");
const sync_module_1 = require("./sync/sync.module");
const speech_module_1 = require("./speech/speech.module");
const admin_module_1 = require("./admin/admin.module");
const progress_module_1 = require("./progress/progress.module");
const students_module_1 = require("./students/students.module");
const parents_module_1 = require("./parents/parents.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            prisma_module_1.PrismaModule,
            storage_module_1.StorageModule,
            auth_module_1.AuthModule,
            progress_module_1.ProgressModule,
            students_module_1.StudentsModule,
            parents_module_1.ParentsModule,
            content_module_1.ContentModule,
            sync_module_1.SyncModule,
            speech_module_1.SpeechModule,
            admin_module_1.AdminModule,
            serve_static_1.ServeStaticModule.forRoot({
                rootPath: path.resolve(process.cwd(), process.env.UPLOADS_DIR || './uploads'),
                serveRoot: '/uploads',
            }),
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map