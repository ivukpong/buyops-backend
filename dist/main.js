/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__webpack_require__(1);
const helmet_1 = __importDefault(__webpack_require__(2));
const common_1 = __webpack_require__(3);
const core_1 = __webpack_require__(4);
const path_1 = __webpack_require__(5);
const app_module_1 = __webpack_require__(6);
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.use((0, helmet_1.default)());
    app.useStaticAssets((0, path_1.join)(__dirname, '..', 'uploads'), {
        prefix: '/uploads/',
    });
    app.useStaticAssets((0, path_1.join)(__dirname, '..', 'public'), {
        prefix: '/public/',
    });
    const frontendOrigins = process.env.FRONTEND_ORIGINS
        ? process.env.FRONTEND_ORIGINS.split(",").map((o) => o.trim())
        : ["http://localhost:5173"];
    app.enableCors({
        origin: (origin, callback) => {
            if (!origin || origin === 'null')
                return callback(null, true);
            if (process.env.NODE_ENV !== 'production') {
                return callback(null, true);
            }
            if (frontendOrigins.includes(origin)) {
                callback(null, true);
            }
            else {
                callback(null, false);
            }
        },
        credentials: true,
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
        transformOptions: {
            enableImplicitConversion: true,
        },
    }));
    const port = process.env.PORT || 8080;
    await app.listen(port);
    console.log(`Server listening on ${port}`);
}
bootstrap();


/***/ }),
/* 1 */
/***/ ((module) => {

module.exports = require("dotenv/config");

/***/ }),
/* 2 */
/***/ ((module) => {

module.exports = require("helmet");

/***/ }),
/* 3 */
/***/ ((module) => {

module.exports = require("@nestjs/common");

/***/ }),
/* 4 */
/***/ ((module) => {

module.exports = require("@nestjs/core");

/***/ }),
/* 5 */
/***/ ((module) => {

module.exports = require("path");

/***/ }),
/* 6 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppModule = void 0;
const common_1 = __webpack_require__(3);
const throttler_1 = __webpack_require__(7);
const core_1 = __webpack_require__(4);
const config_1 = __webpack_require__(8);
const jwt_1 = __webpack_require__(9);
const auth_module_1 = __webpack_require__(10);
const users_module_1 = __webpack_require__(43);
const assets_module_1 = __webpack_require__(47);
const companies_module_1 = __webpack_require__(54);
const agents_module_1 = __webpack_require__(58);
const clusters_module_1 = __webpack_require__(61);
const leads_module_1 = __webpack_require__(64);
const transactions_module_1 = __webpack_require__(68);
const installments_module_1 = __webpack_require__(71);
const notification_module_1 = __webpack_require__(38);
const sales_module_1 = __webpack_require__(74);
const investments_module_1 = __webpack_require__(77);
const dashboard_module_1 = __webpack_require__(80);
const reports_module_1 = __webpack_require__(83);
const freelancers_module_1 = __webpack_require__(87);
const prisma_module_1 = __webpack_require__(37);
const payments_module_1 = __webpack_require__(90);
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
            jwt_1.JwtModule.registerAsync({
                imports: [config_1.ConfigModule],
                useFactory: (configService) => ({
                    secret: configService.get('JWT_SECRET'),
                    signOptions: { expiresIn: configService.get('JWT_EXPIRES_IN') || '3600s' },
                }),
                inject: [config_1.ConfigService],
            }),
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            assets_module_1.AssetsModule,
            companies_module_1.CompaniesModule,
            agents_module_1.AgentsModule,
            clusters_module_1.ClustersModule,
            leads_module_1.LeadsModule,
            transactions_module_1.TransactionsModule,
            installments_module_1.InstallmentsModule,
            notification_module_1.NotificationModule,
            sales_module_1.SalesModule,
            investments_module_1.InvestmentsModule,
            dashboard_module_1.DashboardModule,
            reports_module_1.ReportsModule,
            freelancers_module_1.FreelancersModule,
            prisma_module_1.PrismaModule,
            payments_module_1.PaymentsModule,
            throttler_1.ThrottlerModule.forRoot([{ ttl: 60000, limit: 100 }]),
        ],
        providers: [{ provide: core_1.APP_GUARD, useClass: throttler_1.ThrottlerGuard }],
    })
], AppModule);


/***/ }),
/* 7 */
/***/ ((module) => {

module.exports = require("@nestjs/throttler");

/***/ }),
/* 8 */
/***/ ((module) => {

module.exports = require("@nestjs/config");

/***/ }),
/* 9 */
/***/ ((module) => {

module.exports = require("@nestjs/jwt");

/***/ }),
/* 10 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthModule = void 0;
const common_1 = __webpack_require__(3);
const jwt_1 = __webpack_require__(9);
const passport_1 = __webpack_require__(11);
const auth_controller_1 = __webpack_require__(12);
const auth_service_1 = __webpack_require__(13);
const jwt_strategy_1 = __webpack_require__(35);
const prisma_module_1 = __webpack_require__(37);
const notification_module_1 = __webpack_require__(38);
const users_service_1 = __webpack_require__(31);
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            prisma_module_1.PrismaModule,
            passport_1.PassportModule,
            notification_module_1.NotificationModule,
            jwt_1.JwtModule.register({
                secret: process.env.JWT_SECRET || 'buyops26',
                signOptions: { expiresIn: '7d' },
            }),
        ],
        controllers: [auth_controller_1.AuthController],
        providers: [auth_service_1.AuthService, users_service_1.UsersService, jwt_strategy_1.JwtStrategy],
        exports: [auth_service_1.AuthService],
    })
], AuthModule);


/***/ }),
/* 11 */
/***/ ((module) => {

module.exports = require("@nestjs/passport");

/***/ }),
/* 12 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthController = exports.RefreshTokenDto = exports.RegisterDto = exports.LoginDto = void 0;
const common_1 = __webpack_require__(3);
const auth_service_1 = __webpack_require__(13);
const users_service_1 = __webpack_require__(31);
const jwt_auth_guard_1 = __webpack_require__(32);
const class_validator_1 = __webpack_require__(33);
const class_transformer_1 = __webpack_require__(34);
const client_1 = __webpack_require__(15);
class LoginDto {
}
exports.LoginDto = LoginDto;
__decorate([
    (0, class_transformer_1.Transform)(({ value }) => String(value || '').trim().toLowerCase()),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], LoginDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(8, { message: 'Password must be at least 8 characters long' }),
    __metadata("design:type", String)
], LoginDto.prototype, "password", void 0);
class RegisterDto {
}
exports.RegisterDto = RegisterDto;
__decorate([
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], RegisterDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(8, { message: 'Password must be at least 8 characters long' }),
    __metadata("design:type", String)
], RegisterDto.prototype, "password", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RegisterDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RegisterDto.prototype, "phone", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", typeof (_a = typeof client_1.UserRole !== "undefined" && client_1.UserRole) === "function" ? _a : Object)
], RegisterDto.prototype, "role", void 0);
class RefreshTokenDto {
}
exports.RefreshTokenDto = RefreshTokenDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RefreshTokenDto.prototype, "refreshToken", void 0);
let AuthController = class AuthController {
    constructor(authService, usersService) {
        this.authService = authService;
        this.usersService = usersService;
    }
    async login(dto) {
        const user = await this.authService.validateUser(dto.email, dto.password);
        if (!user)
            throw new common_1.UnauthorizedException('Invalid credentials');
        return this.authService.login(user);
    }
    async register(dto) {
        return this.authService.register(dto);
    }
    async refreshToken(dto) {
        return this.authService.refreshToken(dto.refreshToken);
    }
    async getProfile(req) {
        return this.usersService.findById(req.user.id);
    }
    async updateProfile(req, dto) {
        return this.usersService.updateUser(req.user.id, dto);
    }
    async changePassword(req, body) {
        return this.authService.changePassword(req.user.id, body.currentPassword, body.newPassword);
    }
    async logout(req) {
        return this.authService.logout(req.user.id);
    }
    async setup2FA(req) {
        return this.authService.generate2FASecret(req.user.id);
    }
    async enable2FA(req, body) {
        return this.authService.enable2FA(req.user.id, body.token);
    }
    async disable2FA(req, body) {
        return this.authService.disable2FA(req.user.id, body.token);
    }
    async verify2FA(body) {
        return this.authService.verify2FAAndLogin(body.interimToken, body.token);
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('login'),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [LoginDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('register'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [RegisterDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('refresh'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [RefreshTokenDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refreshToken", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('me'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getProfile", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Put)('me'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "updateProfile", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('change-password'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "changePassword", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('logout'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('2fa/setup'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "setup2FA", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('2fa/enable'),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "enable2FA", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('2fa/disable'),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "disable2FA", null);
__decorate([
    (0, common_1.Post)('2fa/verify'),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verify2FA", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [typeof (_b = typeof auth_service_1.AuthService !== "undefined" && auth_service_1.AuthService) === "function" ? _b : Object, typeof (_c = typeof users_service_1.UsersService !== "undefined" && users_service_1.UsersService) === "function" ? _c : Object])
], AuthController);


/***/ }),
/* 13 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthService = void 0;
const common_1 = __webpack_require__(3);
const jwt_1 = __webpack_require__(9);
const prisma_service_1 = __webpack_require__(14);
const notification_service_1 = __webpack_require__(18);
const bcrypt = __importStar(__webpack_require__(27));
const speakeasy = __importStar(__webpack_require__(28));
const QRCode = __importStar(__webpack_require__(29));
const client_1 = __webpack_require__(15);
const serial_id_helper_1 = __webpack_require__(30);
let AuthService = class AuthService {
    constructor(prisma, jwtService, notificationService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.notificationService = notificationService;
    }
    async validateUser(email, password) {
        const normalizedEmail = email.trim().toLowerCase();
        const user = await this.prisma.user.findUnique({ where: { email: normalizedEmail } });
        if (!user)
            return null;
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid)
            return null;
        const { password: _, ...result } = user;
        return result;
    }
    async login(user) {
        const fullUser = await this.prisma.user.findUnique({
            where: { id: user.id },
            select: { twoFactorEnabled: true },
        });
        if (fullUser?.twoFactorEnabled) {
            const interimToken = this.jwtService.sign({ sub: user.id, email: user.email, requires2FA: true }, { expiresIn: '5m' });
            return { requiresTwoFactor: true, interimToken };
        }
        console.log('LOGIN USER:', user);
        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role,
        };
        const accessToken = this.jwtService.sign(payload, { expiresIn: '1h' });
        const refreshToken = this.jwtService.sign(payload, { expiresIn: '30d' });
        return {
            access_token: accessToken,
            refresh_token: refreshToken,
            user: {
                id: user.id,
                email: user.email,
                name: user.name || user.email.split('@')[0],
                phone: user.phone || null,
                role: user.role || 'USER',
            },
        };
    }
    async register(data) {
        const normalizedEmail = data.email.trim().toLowerCase();
        const existing = await this.prisma.user.findUnique({
            where: { email: normalizedEmail },
        });
        if (existing)
            throw new common_1.ConflictException('Email already in use');
        const strongPassword = /^(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;
        if (!strongPassword.test(data.password)) {
            throw new common_1.ConflictException('Password must be at least 8 characters long and include a number and a special character.');
        }
        const hashed = await bcrypt.hash(data.password, 10);
        const serialId = await (0, serial_id_helper_1.generateSerialId)(this.prisma, 'USR');
        const user = await this.prisma.user.create({
            data: {
                serialId,
                email: normalizedEmail,
                password: hashed,
                name: data.name || normalizedEmail.split('@')[0],
                phone: data.phone || null,
                role: data.role || client_1.UserRole.USER,
            },
        });
        const { password: _, ...result } = user;
        return this.login(result);
    }
    async validateToken(token) {
        try {
            const payload = this.jwtService.verify(token);
            const user = await this.prisma.user.findUnique({
                where: { id: payload.sub },
                select: { id: true, email: true, name: true, role: true },
            });
            if (!user)
                throw new common_1.UnauthorizedException('User not found');
            return user;
        }
        catch {
            throw new common_1.UnauthorizedException('Invalid or expired token');
        }
    }
    async refreshToken(refreshToken) {
        try {
            const payload = this.jwtService.verify(refreshToken);
            const user = await this.prisma.user.findUnique({
                where: { id: payload.sub },
                select: { id: true, email: true, name: true, role: true },
            });
            if (!user)
                throw new common_1.UnauthorizedException('User not found');
            return this.login(user);
        }
        catch {
            throw new common_1.UnauthorizedException('Invalid or expired refresh token');
        }
    }
    async getProfile(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        return user;
    }
    async changePassword(userId, currentPassword, newPassword) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        const valid = await bcrypt.compare(currentPassword, user.password);
        if (!valid)
            throw new common_1.UnauthorizedException('Current password is incorrect');
        const hashed = await bcrypt.hash(newPassword, 10);
        await this.prisma.user.update({
            where: { id: userId },
            data: { password: hashed },
        });
        return { message: 'Password changed successfully' };
    }
    async forgotPassword(email) {
        const normalizedEmail = email.trim().toLowerCase();
        const user = await this.prisma.user.findUnique({ where: { email: normalizedEmail } });
        if (!user) {
            return { message: 'If an account exists, a reset link has been sent.' };
        }
        const resetToken = this.jwtService.sign({ sub: user.id, email: user.email }, { expiresIn: '1h' });
        await this.notificationService.sendPasswordResetEmail(user, resetToken);
        return {
            message: 'If an account exists, a reset link has been sent.',
        };
    }
    async resetPassword(token, newPassword) {
        try {
            const payload = this.jwtService.verify(token);
            const user = await this.prisma.user.findUnique({
                where: { id: payload.sub },
            });
            if (!user)
                throw new common_1.UnauthorizedException('Invalid reset token');
            const hashed = await bcrypt.hash(newPassword, 10);
            await this.prisma.user.update({
                where: { id: user.id },
                data: { password: hashed },
            });
            return { message: 'Password reset successfully' };
        }
        catch {
            throw new common_1.UnauthorizedException('Invalid or expired reset token');
        }
    }
    async verifyEmail(token) {
        try {
            const payload = this.jwtService.verify(token);
            const user = await this.prisma.user.findUnique({
                where: { id: payload.sub },
            });
            if (!user)
                throw new common_1.UnauthorizedException('Invalid verification token');
            return { message: 'Email verified successfully' };
        }
        catch {
            throw new common_1.UnauthorizedException('Invalid or expired verification token');
        }
    }
    async resendVerificationEmail(email) {
        const normalizedEmail = email.trim().toLowerCase();
        const user = await this.prisma.user.findUnique({ where: { email: normalizedEmail } });
        if (!user) {
            return { message: 'If an account exists, a verification link has been sent.' };
        }
        const verificationToken = this.jwtService.sign({ sub: user.id, email: user.email }, { expiresIn: '24h' });
        await this.notificationService.sendEmailVerificationEmail(user, verificationToken);
        return {
            message: 'If an account exists, a verification link has been sent.',
        };
    }
    async logout(userId) {
        return { message: 'Logged out successfully' };
    }
    async generate2FASecret(userId) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        const secret = speakeasy.generateSecret({
            name: `BuyOps (${user.email})`,
            issuer: 'BuyOps',
            length: 20,
        });
        await this.prisma.user.update({
            where: { id: userId },
            data: { twoFactorSecret: secret.base32 },
        });
        const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url);
        return { secret: secret.base32, qrCode: qrCodeUrl };
    }
    async enable2FA(userId, token) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        const secret = user.twoFactorSecret;
        if (!secret)
            throw new common_1.BadRequestException('Please set up 2FA first');
        const verified = speakeasy.totp.verify({
            secret,
            encoding: 'base32',
            token,
            window: 1,
        });
        if (!verified)
            throw new common_1.BadRequestException('Invalid verification code');
        await this.prisma.user.update({
            where: { id: userId },
            data: { twoFactorEnabled: true },
        });
        return { message: '2FA enabled successfully' };
    }
    async disable2FA(userId, token) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        if (!user.twoFactorEnabled)
            throw new common_1.BadRequestException('2FA is not enabled');
        const secret = user.twoFactorSecret;
        const verified = speakeasy.totp.verify({
            secret,
            encoding: 'base32',
            token,
            window: 1,
        });
        if (!verified)
            throw new common_1.BadRequestException('Invalid verification code');
        await this.prisma.user.update({
            where: { id: userId },
            data: { twoFactorEnabled: false, twoFactorSecret: null },
        });
        return { message: '2FA disabled successfully' };
    }
    async verify2FAAndLogin(interimToken, totpToken) {
        let payload;
        try {
            payload = this.jwtService.verify(interimToken);
        }
        catch {
            throw new common_1.UnauthorizedException('Invalid or expired interim token');
        }
        if (!payload.requires2FA)
            throw new common_1.UnauthorizedException('Invalid interim token');
        const user = await this.prisma.user.findUnique({ where: { id: payload.sub } });
        if (!user)
            throw new common_1.UnauthorizedException('User not found');
        const secret = user.twoFactorSecret;
        if (!secret)
            throw new common_1.BadRequestException('2FA secret not found');
        const verified = speakeasy.totp.verify({
            secret,
            encoding: 'base32',
            token: totpToken,
            window: 1,
        });
        if (!verified)
            throw new common_1.UnauthorizedException('Invalid 2FA code');
        const { password: _, ...safeUser } = user;
        const jwtPayload = { sub: user.id, email: user.email, role: user.role };
        const accessToken = this.jwtService.sign(jwtPayload, { expiresIn: '1h' });
        const refreshToken = this.jwtService.sign(jwtPayload, { expiresIn: '30d' });
        return {
            access_token: accessToken,
            refresh_token: refreshToken,
            user: {
                id: user.id,
                email: user.email,
                name: user.name || user.email.split('@')[0],
                phone: user.phone || null,
                role: user.role,
            },
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object, typeof (_b = typeof jwt_1.JwtService !== "undefined" && jwt_1.JwtService) === "function" ? _b : Object, typeof (_c = typeof notification_service_1.NotificationService !== "undefined" && notification_service_1.NotificationService) === "function" ? _c : Object])
], AuthService);


/***/ }),
/* 14 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PrismaService = void 0;
const common_1 = __webpack_require__(3);
const client_1 = __webpack_require__(15);
const adapter_pg_1 = __webpack_require__(16);
const pg_1 = __webpack_require__(17);
let PrismaService = class PrismaService extends client_1.PrismaClient {
    constructor() {
        const pool = new pg_1.Pool({
            connectionString: process.env.DATABASE_URL,
            ssl: { rejectUnauthorized: false },
            max: 3,
            min: 1,
            idleTimeoutMillis: 10000,
            connectionTimeoutMillis: 20000,
            keepAlive: true,
            keepAliveInitialDelayMillis: 5000,
        });
        super({
            adapter: new adapter_pg_1.PrismaPg(pool),
            log: ["error", "warn"],
        });
    }
    async onModuleDestroy() {
        await this.$disconnect();
    }
};
exports.PrismaService = PrismaService;
exports.PrismaService = PrismaService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], PrismaService);


/***/ }),
/* 15 */
/***/ ((module) => {

module.exports = require("@prisma/client");

/***/ }),
/* 16 */
/***/ ((module) => {

module.exports = require("@prisma/adapter-pg");

/***/ }),
/* 17 */
/***/ ((module) => {

module.exports = require("pg");

/***/ }),
/* 18 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var NotificationService_1;
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NotificationService = void 0;
const common_1 = __webpack_require__(3);
const prisma_service_1 = __webpack_require__(14);
const sms_service_1 = __webpack_require__(19);
const email_service_1 = __webpack_require__(21);
const sms_templates_1 = __webpack_require__(24);
const in_app_templates_1 = __webpack_require__(25);
const email_templates_1 = __webpack_require__(26);
const ADMIN_AND_SALES_ROLES = ['ADMIN', 'TEAM_LEAD', 'AGENT'];
let NotificationService = NotificationService_1 = class NotificationService {
    constructor(prisma, smsService, emailService) {
        this.prisma = prisma;
        this.smsService = smsService;
        this.emailService = emailService;
        this.logger = new common_1.Logger(NotificationService_1.name);
    }
    async sendSmsNotification(options) {
        if (!options.phone) {
            return;
        }
        const message = (0, sms_templates_1.getSmsTemplate)(options.templateType, options.data);
        try {
            await this.smsService.sendSms({
                to: options.phone,
                message,
            });
        }
        catch (error) {
            this.logger.warn(`SMS notification failed for ${options.phone}: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    async notifyUsersByRoles(options) {
        const users = await this.prisma.user.findMany({
            where: { role: { in: options.roles } },
            select: { id: true },
        });
        this.logger.debug(`notifyUsersByRoles: found users: ${JSON.stringify(users)}`);
        console.log('notifyUsersByRoles: found users:', users);
        if (!users.length) {
            this.logger.warn('notifyUsersByRoles: No users found for roles', options.roles);
            return;
        }
        await this.prisma.notification.createMany({
            data: users.map((user) => {
                if (!user || !user.id) {
                    this.logger.error('notifyUsersByRoles: Invalid user object', user);
                }
                return {
                    userId: user.id,
                    title: options.title,
                    message: options.message,
                    type: options.type || 'INFO',
                };
            }),
        });
    }
    async getUsersByRolesWithContact(roles) {
        return this.prisma.user.findMany({
            where: { role: { in: roles } },
            select: { id: true, email: true, name: true },
        });
    }
    async notifyAdminAndSales(options) {
        await this.notifyUsersByRoles({
            roles: [...ADMIN_AND_SALES_ROLES],
            title: options.title,
            message: options.message,
            type: options.type,
        });
    }
    async notifyCommissionSent(transactionIds) {
        if (!transactionIds.length)
            return;
        await this.notifyAdminAndSales({
            title: 'Commissions Sent for Payment',
            message: `${transactionIds.length} deal commission(s) have been marked as SENT for payment processing.`,
            type: 'INFO',
        });
    }
    async notifyCommissionsPaid(transactionIds, fileName) {
        if (!transactionIds.length)
            return;
        await this.notifyAdminAndSales({
            title: 'Commissions Marked Paid',
            message: `${transactionIds.length} deal commission(s) have been marked as PAID${fileName ? ` via ${fileName}` : ''}.`,
            type: 'SUCCESS',
        });
    }
    async notifyInstallmentPaymentRecorded(options) {
        await this.notifyAdminAndSales({
            title: 'Installment Payment Recorded',
            message: `Payment of ₦${options.paidAmount.toLocaleString()} was recorded for ${options.buyerName || 'a buyer'} on ${options.assetName || 'an asset'} via ${options.paymentMethod}.`,
            type: 'SUCCESS',
        });
        const plan = await this.prisma.installmentPlan.findUnique({
            where: { id: options.planId },
            include: {
                asset: { select: { name: true } },
            },
        });
        if (plan?.buyerEmail) {
            await this.sendEmail({
                to: plan.buyerEmail,
                templateType: 'PAYMENT_RECEIVED',
                data: {
                    amount: options.paidAmount,
                    reference: options.installmentId,
                    assetName: plan.asset?.name,
                },
                recipient: {
                    name: plan.buyerName || 'Investor',
                    email: plan.buyerEmail,
                },
            });
        }
        if (plan && plan.status?.toUpperCase() === 'COMPLETED') {
            await this.notifyInstallmentPlanCompleted(plan.id);
        }
    }
    async notifyInstallmentDue(installmentId) {
        const installment = await this.prisma.installment.findUnique({
            where: { id: installmentId },
            include: {
                installmentPlan: {
                    include: {
                        asset: { select: { name: true } },
                        leadAgent: { include: { user: { select: { id: true } } } },
                        closerAgent: { include: { user: { select: { id: true } } } },
                    },
                },
            },
        });
        if (!installment) {
            return { message: `Installment ${installmentId} not found.` };
        }
        const dueDate = installment.dueDate.toLocaleDateString('en-US', { dateStyle: 'medium' });
        const message = `Installment of ₦${installment.amount.toLocaleString()} for "${installment.installmentPlan?.asset?.name || 'an asset'}" is due on ${dueDate}.`;
        const recipients = [];
        const leadAgent = installment.installmentPlan?.leadAgent;
        if (leadAgent && leadAgent.user && leadAgent.user.id) {
            recipients.push(leadAgent.user.id);
        }
        const closerAgent = installment.installmentPlan?.closerAgent;
        if (closerAgent && closerAgent.user && closerAgent.user.id) {
            recipients.push(closerAgent.user.id);
        }
        if (recipients.length) {
            await this.prisma.notification.createMany({
                data: recipients.map((userId) => ({
                    userId,
                    title: 'Installment Due Reminder',
                    message,
                    type: 'WARNING',
                })),
            });
        }
        await this.notifyAdminAndSales({
            title: 'Installment Due Reminder',
            message,
            type: 'WARNING',
        });
        const buyerEmail = installment.installmentPlan?.buyerEmail;
        const buyerName = installment.installmentPlan?.buyerName || 'Investor';
        if (buyerEmail) {
            await this.sendEmail({
                to: buyerEmail,
                templateType: 'INSTALLMENT_DUE',
                data: {
                    amount: installment.amount,
                    dueDate: installment.dueDate,
                },
                recipient: { name: buyerName, email: buyerEmail },
            });
            const buyerUser = await this.prisma.user.findUnique({
                where: { email: buyerEmail },
                select: { id: true },
            });
            if (buyerUser?.id) {
                await this.prisma.notification.create({
                    data: {
                        userId: buyerUser.id,
                        title: 'Installment Due Reminder',
                        message,
                        type: 'WARNING',
                    },
                });
            }
        }
        return { message: `Installment ${installmentId} is due soon.` };
    }
    async notifyInstallmentOverdue(installmentId) {
        const installment = await this.prisma.installment.findUnique({
            where: { id: installmentId },
            include: {
                installmentPlan: {
                    include: {
                        asset: { select: { name: true } },
                        leadAgent: { include: { user: { select: { id: true } } } },
                        closerAgent: { include: { user: { select: { id: true } } } },
                    },
                },
            },
        });
        if (!installment) {
            return { message: `Installment ${installmentId} not found.` };
        }
        const dueDate = installment.dueDate.toLocaleDateString('en-US', { dateStyle: 'medium' });
        const message = `Installment of ₦${installment.amount.toLocaleString()} for "${installment.installmentPlan?.asset?.name || 'an asset'}" is overdue since ${dueDate}.`;
        const recipients = [];
        const leadAgent = installment.installmentPlan?.leadAgent;
        if (leadAgent && leadAgent.user && leadAgent.user.id) {
            recipients.push(leadAgent.user.id);
        }
        const closerAgent = installment.installmentPlan?.closerAgent;
        if (closerAgent && closerAgent.user && closerAgent.user.id) {
            recipients.push(closerAgent.user.id);
        }
        if (recipients.length) {
            await this.prisma.notification.createMany({
                data: recipients.map((userId) => ({
                    userId,
                    title: 'Installment Overdue',
                    message,
                    type: 'ERROR',
                })),
            });
        }
        await this.notifyAdminAndSales({
            title: 'Installment Overdue',
            message,
            type: 'ERROR',
        });
        const buyerEmail = installment.installmentPlan?.buyerEmail;
        const buyerName = installment.installmentPlan?.buyerName || 'Investor';
        if (buyerEmail) {
            await this.sendEmail({
                to: buyerEmail,
                templateType: 'INSTALLMENT_OVERDUE',
                data: {
                    amount: installment.amount,
                    dueDate: installment.dueDate,
                },
                recipient: { name: buyerName, email: buyerEmail },
            });
            const buyerUser = await this.prisma.user.findUnique({
                where: { email: buyerEmail },
                select: { id: true },
            });
            if (buyerUser?.id) {
                await this.prisma.notification.create({
                    data: {
                        userId: buyerUser.id,
                        title: 'Installment Overdue',
                        message,
                        type: 'ERROR',
                    },
                });
            }
        }
        return { message: `Installment ${installmentId} is overdue.` };
    }
    async findByUser(userId) {
        return this.prisma.notification.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
    }
    async markAsRead(id) {
        return this.prisma.notification.update({
            where: { id },
            data: { read: true },
        });
    }
    async markAllAsRead(userId) {
        return this.prisma.notification.updateMany({
            where: { userId, read: false },
            data: { read: true },
        });
    }
    async create(data) {
        return this.prisma.notification.create({
            data: {
                userId: data.userId,
                title: data.title,
                message: data.message,
                type: data.type || 'INFO',
            },
        });
    }
    async notifyDealCreated(transactionId) {
        const transaction = await this.prisma.transaction.findUnique({
            where: { id: transactionId },
            include: {
                asset: true,
                buyer: true,
                leadAgent: { include: { user: true } },
                closerAgent: { include: { user: true } },
            },
        });
        if (!transaction)
            return;
        const assetName = transaction.asset?.name || 'an asset';
        const adminUsers = await this.getUsersByRolesWithContact(['ADMIN']);
        await this.prisma.notification.create({
            data: {
                userId: transaction.buyerId,
                title: 'New Deal Created',
                message: `Your deal for "${assetName}" worth ₦${transaction.totalAmount.toLocaleString()} has been created.`,
                type: 'SUCCESS',
            },
        });
        await this.sendSmsNotification({
            phone: transaction.buyer?.phone,
            templateType: 'deal_created',
            data: {
                assetName,
                totalAmount: transaction.totalAmount,
            },
        });
        if (transaction.leadAgent?.user) {
            await this.prisma.notification.create({
                data: {
                    userId: transaction.leadAgent.user.id,
                    title: 'Deal Created on Your Lead',
                    message: `A deal for "${assetName}" worth ₦${transaction.totalAmount.toLocaleString()} has been created.`,
                    type: 'INFO',
                },
            });
            await this.sendSmsNotification({
                phone: transaction.leadAgent.user.phone,
                templateType: 'deal_created',
                data: {
                    assetName,
                    totalAmount: transaction.totalAmount,
                },
            });
            if (transaction.leadAgent.user.email) {
                await this.sendEmail({
                    to: transaction.leadAgent.user.email,
                    templateType: 'DEAL_CREATED',
                    data: {
                        dealId: transaction.id,
                        agentName: transaction.leadAgent.user.name,
                        assetName,
                    },
                    recipient: {
                        name: transaction.leadAgent.user.name || 'Agent',
                        email: transaction.leadAgent.user.email,
                    },
                });
            }
        }
        if (transaction.closerAgent?.user) {
            await this.prisma.notification.create({
                data: {
                    userId: transaction.closerAgent.user.id,
                    title: 'New Deal Assigned',
                    message: `A deal for "${assetName}" worth ₦${transaction.totalAmount.toLocaleString()} has been assigned to you.`,
                    type: 'INFO',
                },
            });
            await this.sendSmsNotification({
                phone: transaction.closerAgent.user.phone,
                templateType: 'deal_created',
                data: {
                    assetName,
                    totalAmount: transaction.totalAmount,
                },
            });
            if (transaction.closerAgent.user.email) {
                await this.sendEmail({
                    to: transaction.closerAgent.user.email,
                    templateType: 'DEAL_CREATED',
                    data: {
                        dealId: transaction.id,
                        agentName: transaction.closerAgent.user.name,
                        assetName,
                    },
                    recipient: {
                        name: transaction.closerAgent.user.name || 'Agent',
                        email: transaction.closerAgent.user.email,
                    },
                });
            }
        }
        for (const admin of adminUsers) {
            await this.sendEmail({
                to: admin.email,
                templateType: 'DEAL_CREATED',
                data: {
                    dealId: transaction.id,
                    agentName: transaction.leadAgent?.user?.name || transaction.closerAgent?.user?.name || 'Agent',
                    assetName,
                },
                recipient: {
                    name: admin.name || 'Admin',
                    email: admin.email,
                },
            });
        }
    }
    async notifyDealPaymentReady(transactionId) {
        const transaction = await this.prisma.transaction.findUnique({
            where: { id: transactionId },
            include: { asset: true, buyer: true, installmentPlans: true },
        });
        if (!transaction)
            return;
        const plan = transaction.installmentPlans?.[0];
        const dueDate = plan?.nextDueDate
            ? plan.nextDueDate.toLocaleDateString('en-US', { dateStyle: 'medium' })
            : 'the next due date';
        const installmentAmount = plan?.installmentAmount || 0;
        await this.prisma.notification.create({
            data: {
                userId: transaction.buyerId,
                title: 'Payment Due',
                message: `Your next installment of ₦${installmentAmount.toLocaleString()} for "${transaction.asset?.name || 'an asset'}" is due on ${dueDate}.`,
                type: 'WARNING',
            },
        });
        await this.sendSmsNotification({
            phone: transaction.buyer?.phone,
            templateType: 'payment_ready',
            data: {
                installmentAmount,
                dueDate,
            },
        });
        const adminsAndAgents = await this.getUsersByRolesWithContact(['ADMIN', 'TEAM_LEAD', 'AGENT']);
        for (const recipient of adminsAndAgents) {
            await this.sendEmail({
                to: recipient.email,
                templateType: 'DEAL_PAYMENT_READY',
                data: {
                    dealId: transaction.id,
                    amount: transaction.totalAmount,
                    paymentType: transaction.paymentType || 'installment',
                },
                recipient: {
                    name: recipient.name || 'User',
                    email: recipient.email,
                },
            });
        }
    }
    async notifyDealClosed(transactionId) {
        const transaction = await this.prisma.transaction.findUnique({
            where: { id: transactionId },
            include: {
                asset: true,
                buyer: true,
                leadAgent: { include: { user: true } },
                closerAgent: { include: { user: true } },
            },
        });
        if (!transaction)
            return;
        const assetName = transaction.asset?.name || 'an asset';
        const adminsAndAgents = await this.getUsersByRolesWithContact(['ADMIN', 'TEAM_LEAD', 'AGENT']);
        await this.prisma.notification.create({
            data: {
                userId: transaction.buyerId,
                title: 'Deal Closed',
                message: `Your deal for "${assetName}" has been closed successfully.`,
                type: 'SUCCESS',
            },
        });
        await this.sendSmsNotification({
            phone: transaction.buyer?.phone,
            templateType: 'deal_closed',
            data: {
                assetName,
            },
        });
        if (transaction.leadAgent?.user) {
            await this.prisma.notification.create({
                data: {
                    userId: transaction.leadAgent.user.id,
                    title: 'Deal Closed',
                    message: `The deal for "${assetName}" has been closed. Commission status: ${transaction.commissionPaymentStatus}.`,
                    type: 'SUCCESS',
                },
            });
            await this.sendSmsNotification({
                phone: transaction.leadAgent.user.phone,
                templateType: 'deal_closed',
                data: {
                    assetName,
                },
            });
            if (transaction.leadAgent.user.email) {
                await this.sendEmail({
                    to: transaction.leadAgent.user.email,
                    templateType: 'DEAL_CLOSED',
                    data: {
                        dealId: transaction.id,
                        assetName,
                        commissionStatus: transaction.commissionPaymentStatus,
                    },
                    recipient: {
                        name: transaction.leadAgent.user.name || 'Agent',
                        email: transaction.leadAgent.user.email,
                    },
                });
            }
        }
        if (transaction.closerAgent?.user) {
            await this.prisma.notification.create({
                data: {
                    userId: transaction.closerAgent.user.id,
                    title: 'Deal Closed',
                    message: `The deal for "${assetName}" you closed has been finalised. Commission status: ${transaction.commissionPaymentStatus}.`,
                    type: 'SUCCESS',
                },
            });
            await this.sendSmsNotification({
                phone: transaction.closerAgent.user.phone,
                templateType: 'deal_closed',
                data: {
                    assetName,
                },
            });
            if (transaction.closerAgent.user.email) {
                await this.sendEmail({
                    to: transaction.closerAgent.user.email,
                    templateType: 'DEAL_CLOSED',
                    data: {
                        dealId: transaction.id,
                        assetName,
                        commissionStatus: transaction.commissionPaymentStatus,
                    },
                    recipient: {
                        name: transaction.closerAgent.user.name || 'Agent',
                        email: transaction.closerAgent.user.email,
                    },
                });
            }
        }
        for (const recipient of adminsAndAgents) {
            await this.sendEmail({
                to: recipient.email,
                templateType: 'DEAL_CLOSED',
                data: {
                    dealId: transaction.id,
                    assetName,
                    commissionStatus: transaction.commissionPaymentStatus,
                },
                recipient: {
                    name: recipient.name || 'User',
                    email: recipient.email,
                },
            });
        }
    }
    async notifyAssetPublished(assetId) {
        const asset = await this.prisma.asset.findUnique({
            where: { id: assetId },
            include: { company: { select: { name: true } } },
        });
        if (!asset)
            return;
        const message = `Asset "${asset.name}" has been published and is now live.`;
        await this.notifyAdminAndSales({
            title: 'Asset Published',
            message,
            type: 'SUCCESS',
        });
        const recipients = await this.getUsersByRolesWithContact(['ADMIN', 'TEAM_LEAD', 'AGENT']);
        for (const recipient of recipients) {
            await this.sendEmail({
                to: recipient.email,
                templateType: 'ASSET_PUBLISHED',
                data: {
                    assetName: asset.name,
                    companyName: asset.company?.name || 'BuyOps',
                },
                recipient: {
                    name: recipient.name || 'User',
                    email: recipient.email,
                },
            });
        }
    }
    async notifyAssetUpdated(assetId, updatedFields) {
        const asset = await this.prisma.asset.findUnique({
            where: { id: assetId },
            select: { id: true, name: true },
        });
        if (!asset)
            return;
        const summary = updatedFields.join(', ');
        const message = `Asset "${asset.name}" has been updated (${summary}).`;
        await this.notifyAdminAndSales({
            title: 'Asset Updated',
            message,
            type: 'INFO',
        });
        const recipients = await this.getUsersByRolesWithContact(['ADMIN', 'TEAM_LEAD', 'AGENT']);
        for (const recipient of recipients) {
            await this.sendEmail({
                to: recipient.email,
                templateType: 'ASSET_UPDATED',
                data: {
                    assetName: asset.name,
                    updatedFields: summary,
                },
                recipient: {
                    name: recipient.name || 'User',
                    email: recipient.email,
                },
            });
        }
    }
    async notifyNewLeadFromInvestor(leadId) {
        const lead = await this.prisma.lead.findUnique({
            where: { id: leadId },
            include: {
                asset: { select: { name: true } },
            },
        });
        if (!lead)
            return;
        const message = `New investor lead "${lead.name}" created for ${lead.asset?.name || 'an asset'}.`;
        await this.notifyUsersByRoles({
            roles: ['ADMIN'],
            title: 'New Investor Lead',
            message,
            type: 'INFO',
        });
        const admins = await this.getUsersByRolesWithContact(['ADMIN']);
        for (const admin of admins) {
            await this.sendEmail({
                to: admin.email,
                templateType: 'NEW_LEAD_FROM_INVESTOR',
                data: {
                    leadName: lead.name,
                    assetName: lead.asset?.name || 'N/A',
                    budget: lead.budget || 0,
                },
                recipient: {
                    name: admin.name || 'Admin',
                    email: admin.email,
                },
            });
        }
    }
    async notifyLeadAssignedToCluster(leadIds, clusterId) {
        if (!leadIds.length)
            return;
        const [cluster, leads] = await Promise.all([
            this.prisma.cluster.findUnique({
                where: { id: clusterId },
                select: { id: true, name: true },
            }),
            this.prisma.lead.findMany({
                where: { id: { in: leadIds } },
                include: { asset: { select: { name: true } } },
            }),
        ]);
        const teamLeads = await this.prisma.user.findMany({
            where: {
                role: 'TEAM_LEAD',
                managedClusters: { some: { id: clusterId } },
            },
            select: { id: true, email: true, name: true },
        });
        const recipients = teamLeads.length
            ? teamLeads
            : await this.getUsersByRolesWithContact(['TEAM_LEAD']);
        for (const lead of leads) {
            const message = `Lead "${lead.name}" has been assigned to cluster ${cluster?.name || 'N/A'}.`;
            if (recipients.length) {
                await this.prisma.notification.createMany({
                    data: recipients.map((recipient) => ({
                        userId: recipient.id,
                        title: 'Lead Assigned to Cluster',
                        message,
                        type: 'INFO',
                    })),
                });
            }
            for (const recipient of recipients) {
                await this.sendEmail({
                    to: recipient.email,
                    templateType: 'LEAD_ASSIGNED_TO_CLUSTER',
                    data: {
                        leadName: lead.name,
                        clusterName: cluster?.name || 'N/A',
                    },
                    recipient: {
                        name: recipient.name || 'Team Lead',
                        email: recipient.email,
                    },
                });
            }
        }
    }
    async notifyLeadAvailableToAll(leadIds) {
        if (!leadIds.length)
            return;
        const [leads, agents] = await Promise.all([
            this.prisma.lead.findMany({
                where: { id: { in: leadIds } },
                include: { asset: { select: { name: true } } },
            }),
            this.getUsersByRolesWithContact(['AGENT']),
        ]);
        for (const lead of leads) {
            const message = `New available lead: ${lead.name} (${lead.asset?.name || 'General interest'}).`;
            if (agents.length) {
                await this.prisma.notification.createMany({
                    data: agents.map((agent) => ({
                        userId: agent.id,
                        title: 'New Lead Available',
                        message,
                        type: 'INFO',
                    })),
                });
            }
            for (const agent of agents) {
                await this.sendEmail({
                    to: agent.email,
                    templateType: 'LEAD_AVAILABLE_TO_ALL',
                    data: {
                        leadName: lead.name,
                        assetName: lead.asset?.name || 'N/A',
                    },
                    recipient: {
                        name: agent.name || 'Agent',
                        email: agent.email,
                    },
                });
            }
        }
    }
    async notifyInstallmentPlanCompleted(planId) {
        const plan = await this.prisma.installmentPlan.findUnique({
            where: { id: planId },
            include: {
                asset: { select: { name: true } },
            },
        });
        if (!plan || !plan.buyerEmail) {
            return;
        }
        await this.sendEmail({
            to: plan.buyerEmail,
            templateType: 'INSTALLMENT_COMPLETED',
            data: {
                assetName: plan.asset?.name || 'your asset',
                totalPaid: plan.paidAmount,
            },
            recipient: {
                name: plan.buyerName || 'Investor',
                email: plan.buyerEmail,
            },
        });
        const buyerUser = await this.prisma.user.findUnique({
            where: { email: plan.buyerEmail },
            select: { id: true },
        });
        if (buyerUser?.id) {
            await this.prisma.notification.create({
                data: {
                    userId: buyerUser.id,
                    title: 'Installment Plan Completed',
                    message: `Your installment plan for "${plan.asset?.name || 'your asset'}" is fully completed.`,
                    type: 'SUCCESS',
                },
            });
        }
    }
    getEmailTemplate(type, data) {
        const subject = type.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
        return `<h2>${subject}</h2><p>${data.message || (0, sms_templates_1.getSmsTemplate)(type, data)}</p>`;
    }
    async sendEmail(options) {
        try {
            const template = email_templates_1.EmailTemplates[options.templateType];
            if (!template) {
                console.warn(`Email template not found: ${options.templateType}`);
                return { success: false, message: 'Template not found' };
            }
            const subject = typeof template.subject === 'function'
                ? template.subject(options.data)
                : template.subject;
            const html = typeof template.body === 'function'
                ? template.body(options.data, options.recipient || { name: 'User', email: options.to })
                : template.body;
            await this.emailService.sendEmail({
                to: options.to,
                subject,
                html,
            });
            console.log(`Email sent to ${options.to} for template ${options.templateType}`);
            return { success: true, message: 'Email sent' };
        }
        catch (error) {
            console.error(`Failed to send email to ${options.to}:`, error);
            return { success: false, message: 'Email sending failed' };
        }
    }
    async sendPasswordResetEmail(user, resetToken) {
        const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${resetToken}`;
        return this.sendEmail({
            to: user.email,
            templateType: 'PASSWORD_RESET',
            data: { resetLink },
            recipient: { name: user.name, email: user.email },
        });
    }
    async sendAgentInvitationEmail(user, tempPassword) {
        const loginLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/login`;
        return this.sendEmail({
            to: user.email,
            templateType: 'AGENT_INVITATION',
            data: { tempPassword, loginLink },
            recipient: { name: user.name, email: user.email },
        });
    }
    async sendEmailVerificationEmail(user, verificationToken) {
        const verificationLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/verify-email?token=${verificationToken}`;
        return this.sendEmail({
            to: user.email,
            templateType: 'EMAIL_VERIFICATION',
            data: { verificationLink },
            recipient: { name: user.name, email: user.email },
        });
    }
    getSmsTemplate(type, data) {
        return (0, sms_templates_1.getSmsTemplate)(type, data);
    }
    getInAppTemplate(type, data) {
        return (0, in_app_templates_1.getInAppTemplate)(type, data);
    }
};
exports.NotificationService = NotificationService;
exports.NotificationService = NotificationService = NotificationService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object, typeof (_b = typeof sms_service_1.SmsService !== "undefined" && sms_service_1.SmsService) === "function" ? _b : Object, typeof (_c = typeof email_service_1.EmailService !== "undefined" && email_service_1.EmailService) === "function" ? _c : Object])
], NotificationService);


/***/ }),
/* 19 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var SmsService_1;
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SmsService = void 0;
const common_1 = __webpack_require__(3);
const config_1 = __webpack_require__(8);
const twilio_1 = __importDefault(__webpack_require__(20));
let SmsService = SmsService_1 = class SmsService {
    constructor(configService) {
        this.configService = configService;
        this.logger = new common_1.Logger(SmsService_1.name);
        if (!this.configService) {
            this.twilioClient = null;
            this.fromPhone = null;
            this.isConfigured = false;
            this.logger.warn('Twilio SMS is disabled: ConfigService not available (test mode).');
            return;
        }
        const accountSid = this.configService.get('TWILIO_ACCOUNT_SID');
        const authToken = this.configService.get('TWILIO_AUTH_TOKEN');
        this.fromPhone = this.configService.get('TWILIO_PHONE_NUMBER');
        this.isConfigured = Boolean(accountSid && authToken && this.fromPhone);
        if (!this.isConfigured) {
            this.twilioClient = null;
            this.logger.warn('Twilio SMS is disabled because required environment variables are missing.');
            return;
        }
        this.twilioClient = new twilio_1.default.Twilio(accountSid, authToken);
        this.logger.log('Twilio SMS service initialized.');
    }
    async sendSms({ to, message }) {
        if (!this.isConfigured || !this.twilioClient || !this.fromPhone) {
            this.logger.warn(`SMS send skipped for ${to}: Twilio is not configured.`);
            return false;
        }
        try {
            await this.twilioClient.messages.create({
                body: message,
                from: this.fromPhone,
                to,
            });
            this.logger.log(`SMS sent to ${to}`);
            return true;
        }
        catch (error) {
            const messageText = error instanceof Error ? error.message : String(error);
            this.logger.error(`Failed to send SMS to ${to}: ${messageText}`);
            throw error;
        }
    }
};
exports.SmsService = SmsService;
exports.SmsService = SmsService = SmsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Optional)()),
    __metadata("design:paramtypes", [typeof (_a = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _a : Object])
], SmsService);


/***/ }),
/* 20 */
/***/ ((module) => {

module.exports = require("twilio");

/***/ }),
/* 21 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var EmailService_1;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EmailService = void 0;
const common_1 = __webpack_require__(3);
const resend_1 = __webpack_require__(22);
const mailtrap_1 = __webpack_require__(23);
let EmailService = EmailService_1 = class EmailService {
    constructor() {
        this.logger = new common_1.Logger(EmailService_1.name);
        this.isSandbox = process.env.MAILTRAP_USE_SANDBOX === 'true';
        this.resend = null;
        this.mailtrap = null;
        this.provider = process.env.EMAIL_PROVIDER ?? 'mailtrap';
        if (this.provider === 'resend') {
            this.resend = new resend_1.Resend(process.env.RESEND_API_KEY);
        }
        else {
            const sandboxId = this.isSandbox ? Number(process.env.MAILTRAP_INBOX_ID) : undefined;
            this.mailtrap = new mailtrap_1.MailtrapClient({
                token: process.env.MAILTRAP_API_KEY,
                sandbox: this.isSandbox,
                testInboxId: sandboxId,
            });
        }
        this.logger.log(`EmailService initialised — provider: ${this.provider}` +
            (this.provider === 'mailtrap' ? ` (${this.isSandbox ? 'sandbox' : 'sending API'})` : ''));
    }
    async sendEmail(options) {
        const from = process.env.EMAIL_FROM ?? 'BuyOps <no-reply@buyops.com>';
        const [fromName, fromEmail] = from.includes('<')
            ? [from.split('<')[0].trim(), from.split('<')[1].replace('>', '').trim()]
            : ['BuyOps', from];
        this.logger.log(`Sending email to ${options.to} — subject: "${options.subject}"`);
        try {
            if (this.provider === 'resend') {
                const { data, error } = await this.resend.emails.send({
                    from,
                    to: options.to,
                    subject: options.subject,
                    html: options.html,
                });
                if (error) {
                    this.logger.error(`Resend error: ${JSON.stringify(error)}`);
                    throw new Error(error.message);
                }
                this.logger.log(`Email delivered via Resend to ${options.to} (id: ${data?.id})`);
            }
            else {
                const senderEmail = this.isSandbox ? 'sandbox@example.com' : fromEmail;
                await this.mailtrap.send({
                    from: { name: fromName, email: senderEmail },
                    to: [{ email: options.to }],
                    subject: options.subject,
                    html: options.html,
                });
                this.logger.log(`Email sent via Mailtrap ${this.isSandbox ? '(sandbox)' : '(sending API)'} to ${options.to}`);
            }
        }
        catch (err) {
            this.logger.error(`Failed to send email to ${options.to}: ${err?.message ?? err}`);
            throw err;
        }
    }
};
exports.EmailService = EmailService;
exports.EmailService = EmailService = EmailService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], EmailService);


/***/ }),
/* 22 */
/***/ ((module) => {

module.exports = require("resend");

/***/ }),
/* 23 */
/***/ ((module) => {

module.exports = require("mailtrap");

/***/ }),
/* 24 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getSmsTemplate = getSmsTemplate;
function getSmsTemplate(type, data) {
    switch (type) {
        case 'deal_created':
            return `BuyOps: A new deal for ${data.assetName || 'an asset'} has been created. Amount: ₦${(data.totalAmount || 0).toLocaleString()}`;
        case 'payment_ready':
            return `BuyOps: Payment of ₦${(data.installmentAmount || 0).toLocaleString()} is due on ${data.dueDate || 'the next due date'}.`;
        case 'deal_closed':
            return `BuyOps: The deal for ${data.assetName || 'an asset'} has been closed successfully.`;
        default:
            return `BuyOps Notification: ${data.message || 'You have a new notification.'}`;
    }
}


/***/ }),
/* 25 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getInAppTemplate = getInAppTemplate;
function getInAppTemplate(type, data) {
    switch (type) {
        case 'deal_created':
            return {
                title: 'New Deal Created',
                message: `A new deal for "${data.assetName || 'an asset'}" worth ₦${(data.totalAmount || 0).toLocaleString()} has been created.`,
            };
        case 'payment_ready':
            return {
                title: 'Payment Due',
                message: `Your next installment of ₦${(data.installmentAmount || 0).toLocaleString()} is due on ${data.dueDate || 'the next due date'}.`,
            };
        case 'deal_closed':
            return {
                title: 'Deal Closed',
                message: `The deal for "${data.assetName || 'an asset'}" has been successfully closed.`,
            };
        default:
            return {
                title: 'Notification',
                message: data.message || 'You have a new notification.',
            };
    }
}


/***/ }),
/* 26 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EmailTemplates = void 0;
const LOGO_SRC = 'https://res.cloudinary.com/dfm3gcy5u/image/upload/w_380,h_98,f_png,q_100/v1774273368/logo';
function layout(opts) {
    const accent = opts.accentBar ?? '#4c51bf';
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1.0" />
  <meta name="color-scheme" content="light dark" />
  <meta name="supported-color-schemes" content="light dark" />
  <title>${opts.title}</title>
  <style>
    @media (prefers-color-scheme: dark) {
      .email-outer       { background-color: #0f172a !important; }
      .email-outer-td    { background-color: #0f172a !important; }
      .email-header      { background-color: #1e293b !important; }
      .email-logo        { filter: brightness(0) invert(1) !important; }
      .email-divider-line { background-color: #334155 !important; }
      .email-card        { background-color: #1e293b !important; }
      .email-title       { color: #f8fafc !important; }
      .email-text        { color: #cbd5e1 !important; }
      .email-muted       { color: #94a3b8 !important; }
      .email-info-tbl    { background-color: #0f172a !important; border-color: #334155 !important; }
      .email-info-row td { border-bottom-color: #334155 !important; }
      .email-info-label  { color: #94a3b8 !important; }
      .email-info-val    { color: #e2e8f0 !important; }
      .email-footer-text { color: #475569 !important; }
      .email-divider     { border-top-color: #334155 !important; color: #64748b !important; }
    }
  </style>
</head>
<body class="email-outer" style="margin:0;padding:0;background-color:#f3f4f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" class="email-outer" style="background-color:#f3f4f6;">
    <tr>
      <td align="center" class="email-outer-td" style="padding:40px 16px;">
        <table width="600" cellpadding="0" cellspacing="0" role="presentation" style="max-width:600px;width:100%;">

          <!-- TOP ACCENT STRIP -->
          <tr>
            <td style="background:${accent};height:5px;border-radius:12px 12px 0 0;font-size:0;line-height:0;">&nbsp;</td>
          </tr>

          <!-- HEADER -->
          <tr>
            <td class="email-header" style="background:#ffffff;padding:22px 40px;">
              <img src="${LOGO_SRC}" width="190" height="49" alt="BuyOps" class="email-logo" style="display:block;" />
            </td>
          </tr>

          <!-- HEADER / CARD DIVIDER -->
          <tr>
            <td class="email-divider-line" style="background:#e5e7eb;height:1px;font-size:0;line-height:0;">&nbsp;</td>
          </tr>

          <!-- CARD -->
          <tr>
            <td class="email-card" style="background:#ffffff;border-radius:0 0 12px 12px;">
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                <tr>
                  <td style="padding:36px 40px 44px;">

                    <!-- badge -->
                    <table cellpadding="0" cellspacing="0" role="presentation" style="margin-bottom:22px;">
                      <tr>
                        <td style="background:${opts.badgeBg};border-radius:20px;padding:5px 14px;">
                          <span style="color:${opts.badgeColor};font-size:11px;font-weight:700;letter-spacing:0.8px;text-transform:uppercase;">${opts.badgeText}</span>
                        </td>
                      </tr>
                    </table>

                    <!-- title -->
                    <h1 class="email-title" style="margin:0 0 20px;color:#1a1f36;font-size:22px;font-weight:700;line-height:1.3;">${opts.title}</h1>

                    ${opts.body}

                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="padding:28px 0 8px;text-align:center;">
              <p class="email-footer-text" style="margin:0 0 5px;color:#9ca3af;font-size:12px;">&copy; 2026 BuyOps. All rights reserved.</p>
              <p class="email-footer-text" style="margin:0;color:#b0b7c3;font-size:11px;">This is an automated message &mdash; please do not reply directly to this email.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
function para(text, color = '#374151') {
    return `<p class="email-text" style="margin:0 0 16px;color:${color};font-size:15px;line-height:1.7;">${text}</p>`;
}
function infoRow(label, value) {
    return `
    <tr class="email-info-row">
      <td class="email-info-label" style="padding:10px 0;border-bottom:1px solid #f3f4f6;color:#6b7280;font-size:13px;width:160px;vertical-align:top;">${label}</td>
      <td class="email-info-val" style="padding:10px 0;border-bottom:1px solid #f3f4f6;color:#1a1f36;font-size:13px;font-weight:600;vertical-align:top;">${value}</td>
    </tr>`;
}
function infoCard(rows) {
    return `
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" class="email-info-tbl" style="background:#f8f9fb;border:1px solid #e5e7eb;border-radius:10px;margin:20px 0 28px;">
    <tr><td style="padding:4px 20px 0;">
      <table width="100%" cellpadding="0" cellspacing="0" role="presentation">${rows}</table>
    </td></tr>
  </table>`;
}
function cta(href, label, color = '#4c51bf') {
    return `
  <table cellpadding="0" cellspacing="0" role="presentation" style="margin:8px 0 28px;">
    <tr>
      <td style="background:${color};border-radius:8px;">
        <a href="${href}" style="display:inline-block;padding:14px 36px;color:#ffffff;font-size:15px;font-weight:700;text-decoration:none;letter-spacing:0.2px;">${label}</a>
      </td>
    </tr>
  </table>`;
}
function alertBox(text, color, bg, border) {
    return `
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin:20px 0;">
    <tr>
      <td style="background:${bg};border-left:4px solid ${border};border-radius:6px;padding:14px 18px;">
        <p style="margin:0;color:${color};font-size:14px;line-height:1.6;">${text}</p>
      </td>
    </tr>
  </table>`;
}
function dividerNote(text) {
    return `<p class="email-divider email-muted" style="margin:28px 0 0;padding-top:24px;border-top:1px solid #e5e7eb;color:#9ca3af;font-size:12px;line-height:1.7;">${text}</p>`;
}
exports.EmailTemplates = {
    PASSWORD_RESET: {
        subject: () => 'Reset Your BuyOps Password',
        body: (data, recipient) => layout({
            title: 'Reset Your Password',
            badgeText: 'Security',
            badgeColor: '#b45309',
            badgeBg: '#fffbeb',
            accentBar: '#f59e0b',
            body: `
          ${para(`Hi ${recipient.name},`)}
          ${para('We received a request to reset the password for your BuyOps account. Click the button below to create a new password.')}
          ${cta(data.resetLink, 'Reset Password', '#4c51bf')}
          ${alertBox('This link will expire shortly. If you did not request a password reset, you can safely ignore this email — your password will remain unchanged.', '#92400e', '#fffbeb', '#f59e0b')}
          ${dividerNote('For your security, never share your password or this link with anyone. BuyOps will never ask for your password via email.')}
        `,
        }),
    },
    NEW_DEVICE_LOGIN: {
        subject: () => 'New Login Detected on Your BuyOps Account',
        body: (data, recipient) => layout({
            title: 'New Login Detected',
            badgeText: 'Security Alert',
            badgeColor: '#b45309',
            badgeBg: '#fffbeb',
            accentBar: '#f59e0b',
            body: `
          ${para(`Hi ${recipient.name},`)}
          ${para('We detected a successful login to your BuyOps account from a new device or location.')}
          ${infoCard(infoRow('Device', data.device || 'Unknown') +
                infoRow('Location', data.location || 'Unknown') +
                infoRow('Time', data.timestamp || new Date().toLocaleString()))}
          ${para('If this was you, no action is needed.')}
          ${alertBox('Not you? Reset your password immediately to secure your account.', '#991b1b', '#fef2f2', '#ef4444')}
          ${dividerNote('BuyOps monitors account activity to keep your investments safe. Contact support if you have concerns.')}
        `,
        }),
    },
    ASSET_PUBLISHED: {
        subject: () => 'Asset Successfully Published',
        body: (data) => layout({
            title: 'Asset Successfully Published',
            badgeText: 'Asset Management',
            badgeColor: '#3730a3',
            badgeBg: '#eef2ff',
            accentBar: '#4c51bf',
            body: `
          ${para('A new investment asset has been published on BuyOps and is now live according to its visibility and distribution settings.')}
          ${infoCard(infoRow('Asset Name', data.assetName) +
                infoRow('Company', data.companyName))}
          ${para('Agents and eligible investors can now view and interact with this asset.', '#6b7280')}
          ${dividerNote('This is an automated confirmation from the BuyOps platform.')}
        `,
        }),
    },
    ASSET_UPDATED: {
        subject: () => 'Asset Information Updated',
        body: (data) => layout({
            title: 'Asset Information Updated',
            badgeText: 'Asset Management',
            badgeColor: '#3730a3',
            badgeBg: '#eef2ff',
            accentBar: '#4c51bf',
            body: `
          ${para('An investment asset on BuyOps has been updated. Please review the changes to ensure accuracy.')}
          ${infoCard(infoRow('Asset Name', data.assetName) +
                infoRow('Updated Fields', data.updatedFields))}
          ${alertBox('Please verify that all updated information aligns with current terms and agreements.', '#1e40af', '#eff6ff', '#3b82f6')}
          ${dividerNote('This is an automated notification from the BuyOps platform.')}
        `,
        }),
    },
    NEW_LEAD_FROM_INVESTOR: {
        subject: () => 'New Lead Assigned to You',
        body: (data) => layout({
            title: 'New Lead Assigned to You',
            badgeText: 'Lead',
            badgeColor: '#0e7490',
            badgeBg: '#ecfeff',
            accentBar: '#0891b2',
            body: `
          ${para('A new investor lead has been onboarded and assigned directly to you. Please follow up promptly to progress the opportunity.')}
          ${infoCard(infoRow('Lead Name', data.leadName) +
                infoRow('Asset Interest', data.assetName) +
                infoRow('Budget', `&#8358;${(data.budget || 0).toLocaleString()}`))}
          ${alertBox('Timely follow-up significantly improves conversion rates. Aim to reach out within 24 hours.', '#065f46', '#ecfdf5', '#10b981')}
          ${dividerNote('Full lead details are available in your BuyOps dashboard.')}
        `,
        }),
    },
    LEAD_ASSIGNED_TO_CLUSTER: {
        subject: () => 'Lead Assigned to Your Cluster',
        body: (data) => layout({
            title: 'Lead Assigned to Your Cluster',
            badgeText: 'Lead',
            badgeColor: '#0e7490',
            badgeBg: '#ecfeff',
            accentBar: '#0891b2',
            body: `
          ${para('A new lead has been assigned to your cluster. Please coordinate with your team for prompt follow-up.')}
          ${infoCard(infoRow('Lead Name', data.leadName) +
                infoRow('Cluster', data.clusterName))}
          ${dividerNote('Coordinate with your cluster manager to assign the appropriate agent for follow-up.')}
        `,
        }),
    },
    LEAD_AVAILABLE_TO_ALL: {
        subject: () => 'New Lead Available',
        body: (data) => layout({
            title: 'New Lead Available',
            badgeText: 'Open Lead',
            badgeColor: '#0e7490',
            badgeBg: '#ecfeff',
            accentBar: '#0891b2',
            body: `
          ${para('A new lead has been made available to all clusters. Agents may engage based on availability and fit.')}
          ${infoCard(infoRow('Lead Name', data.leadName) +
                infoRow('Asset Interest', data.assetName))}
          ${alertBox('This lead is open to all clusters. First to engage with a qualified pitch gets priority.', '#0e7490', '#ecfeff', '#0891b2')}
          ${dividerNote('View the full lead profile in your BuyOps dashboard.')}
        `,
        }),
    },
    DEAL_CREATED: {
        subject: () => 'New Deal Created',
        body: (data) => layout({
            title: 'New Deal Created',
            badgeText: 'Deal',
            badgeColor: '#065f46',
            badgeBg: '#ecfdf5',
            accentBar: '#10b981',
            body: `
          ${para('A new deal has been created on BuyOps. This notification is for your administrative oversight.')}
          ${infoCard(infoRow('Deal ID', data.dealId) +
                infoRow('Agent', data.agentName) +
                infoRow('Asset', data.assetName))}
          ${dividerNote('Deal activity is tracked in real-time in your BuyOps admin dashboard.')}
        `,
        }),
    },
    DEAL_PAYMENT_READY: {
        subject: () => 'Deal Ready for Payment Processing',
        body: (data) => layout({
            title: 'Deal Ready for Payment',
            badgeText: 'Action Required',
            badgeColor: '#b45309',
            badgeBg: '#fffbeb',
            accentBar: '#f59e0b',
            body: `
          ${para('A deal has been marked as <strong>Payment Ready</strong>. Please proceed with payment verification and processing.')}
          ${infoCard(infoRow('Deal ID', data.dealId) +
                infoRow('Amount', `&#8358;${(data.amount || 0).toLocaleString()}`) +
                infoRow('Payment Type', data.paymentType))}
          ${alertBox('Please verify the payment details before processing. Ensure all documentation is in order.', '#92400e', '#fffbeb', '#f59e0b')}
          ${dividerNote('Process this payment through the BuyOps admin panel to maintain a full audit trail.')}
        `,
        }),
    },
    DEAL_CLOSED: {
        subject: () => 'Deal Successfully Closed',
        body: (data) => layout({
            title: 'Deal Successfully Closed',
            badgeText: 'Deal Closed',
            badgeColor: '#065f46',
            badgeBg: '#ecfdf5',
            accentBar: '#10b981',
            body: `
          ${para('A deal has been successfully closed on BuyOps. This transaction will now be reflected in reporting and commissions.')}
          ${infoCard(infoRow('Deal ID', data.dealId) +
                infoRow('Asset', data.assetName) +
                infoRow('Commission Status', data.commissionStatus))}
          ${dividerNote('Full transaction details and commission breakdown are available in the BuyOps admin dashboard.')}
        `,
        }),
    },
    INSTALLMENT_DUE: {
        subject: () => 'Upcoming Installment Payment Due',
        body: (data) => layout({
            title: 'Installment Payment Due Soon',
            badgeText: 'Payment Reminder',
            badgeColor: '#b45309',
            badgeBg: '#fffbeb',
            accentBar: '#f59e0b',
            body: `
          ${para('This is a friendly reminder that an installment payment is coming up. Please ensure payment is completed on or before the due date.')}
          ${infoCard(infoRow('Amount Due', `&#8358;${(data.amount || 0).toLocaleString()}`) +
                infoRow('Due Date', new Date(data.dueDate).toLocaleDateString('en-NG', {
                    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
                })))}
          ${alertBox('Late payments may attract penalties. Please make your payment before the due date to stay in good standing.', '#92400e', '#fffbeb', '#f59e0b')}
          ${dividerNote('Log in to your BuyOps account to make a payment or view your full installment schedule.')}
        `,
        }),
    },
    INSTALLMENT_OVERDUE: {
        subject: () => 'Overdue Installment Payment \u2014 Action Required',
        body: (data) => layout({
            title: 'Installment Payment Overdue',
            badgeText: 'Overdue',
            badgeColor: '#991b1b',
            badgeBg: '#fef2f2',
            accentBar: '#ef4444',
            body: `
          ${para('Your installment payment is now <strong>overdue</strong>. Please make payment as soon as possible to avoid further penalties or disruption to your investment.')}
          ${infoCard(infoRow('Amount Overdue', `&#8358;${(data.amount || 0).toLocaleString()}`) +
                infoRow('Original Due Date', new Date(data.dueDate).toLocaleDateString('en-NG', {
                    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
                })))}
          ${alertBox('Continued non-payment may affect the status of your investment. Please contact your agent or our support team if you need assistance.', '#991b1b', '#fef2f2', '#ef4444')}
          ${dividerNote('If you have already made this payment and received this email in error, please contact BuyOps support with your transaction reference.')}
        `,
        }),
    },
    PAYMENT_RECEIVED: {
        subject: () => 'Payment Received \u2014 Confirmation',
        body: (data) => layout({
            title: 'Payment Confirmed',
            badgeText: 'Payment Received',
            badgeColor: '#065f46',
            badgeBg: '#ecfdf5',
            accentBar: '#10b981',
            body: `
          ${para('We have successfully received your payment. Thank you for staying on track with your investment.')}
          ${infoCard(infoRow('Amount Received', `&#8358;${(data.amount || 0).toLocaleString()}`) +
                infoRow('Transaction Reference', data.reference))}
          ${alertBox('Your payment has been recorded and your installment schedule has been updated accordingly.', '#065f46', '#ecfdf5', '#10b981')}
          ${dividerNote('Please retain this email as proof of payment. View your full payment history in your BuyOps account.')}
        `,
        }),
    },
    INSTALLMENT_COMPLETED: {
        subject: () => 'Congratulations \u2014 Installment Plan Completed!',
        body: (data) => layout({
            title: 'Installment Plan Completed!',
            badgeText: 'Completed',
            badgeColor: '#065f46',
            badgeBg: '#ecfdf5',
            accentBar: '#10b981',
            body: `
          ${para('Congratulations! You have successfully completed your installment payment plan. This is a significant milestone in your investment journey with BuyOps.')}
          ${infoCard(infoRow('Asset', data.assetName) +
                infoRow('Total Paid', `&#8358;${(data.totalPaid || 0).toLocaleString()}`))}
          ${alertBox('Thank you for your commitment and trust in BuyOps. Our team will be in touch regarding next steps for your investment.', '#065f46', '#ecfdf5', '#10b981')}
          ${dividerNote('Your full investment and payment history is available in your BuyOps account.')}
        `,
        }),
    },
    AGENT_INVITATION: {
        subject: () => 'Welcome to BuyOps \u2014 Your Agent Account is Ready',
        body: (data, recipient) => layout({
            title: `Welcome to BuyOps, ${recipient.name}!`,
            badgeText: 'Invitation',
            badgeColor: '#3730a3',
            badgeBg: '#eef2ff',
            accentBar: '#4c51bf',
            body: `
          ${para(`Hi ${recipient.name},`)}
          ${para("You've been invited to join BuyOps as a <strong>Sales Agent</strong>. Your account has been set up and is ready to go. Use the credentials below to log in for the first time.")}
          ${infoCard(infoRow('Email', recipient.email) +
                infoRow('Temporary Password', `<code style="background:#f3f4f6;padding:2px 8px;border-radius:4px;font-size:13px;font-family:monospace;">${data.tempPassword}</code>`))}
          ${cta(data.loginLink, 'Log In to BuyOps', '#4c51bf')}
          ${alertBox('For your security, please change your password immediately after your first login.', '#1e40af', '#eff6ff', '#3b82f6')}
          ${dividerNote('If you were not expecting this invitation or believe it was sent in error, please contact BuyOps support immediately and disregard this email.')}
        `,
        }),
    },
    EMAIL_VERIFICATION: {
        subject: () => 'Verify Your BuyOps Email Address',
        body: (data, recipient) => layout({
            title: 'Verify Your Email Address',
            badgeText: 'Email Verification',
            badgeColor: '#3730a3',
            badgeBg: '#eef2ff',
            accentBar: '#4c51bf',
            body: `
          ${para(`Hi ${recipient.name},`)}
          ${para('Thank you for registering with BuyOps. To complete your account setup, please verify your email address by clicking the button below.')}
          ${cta(data.verificationLink, 'Verify Email Address', '#4c51bf')}
          ${alertBox('This verification link expires in 24 hours. If it expires, you can request a new one from your account settings.', '#1e40af', '#eff6ff', '#3b82f6')}
          ${dividerNote('If you did not create a BuyOps account, please ignore this email. No action is required and your email will not be added to our system.')}
        `,
        }),
    },
};


/***/ }),
/* 27 */
/***/ ((module) => {

module.exports = require("bcrypt");

/***/ }),
/* 28 */
/***/ ((module) => {

module.exports = require("speakeasy");

/***/ }),
/* 29 */
/***/ ((module) => {

module.exports = require("qrcode");

/***/ }),
/* 30 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.generateSerialId = generateSerialId;
const MODEL_MAP = {
    USR: 'user',
    CMP: 'company',
    AST: 'asset',
    LED: 'lead',
    AGT: 'agent',
    FRL: 'freelancer',
    CLT: 'cluster',
    TRN: 'transaction',
    IPL: 'installmentPlan',
    INS: 'installment',
    COM: 'commission',
};
async function generateSerialId(prisma, prefix) {
    const model = MODEL_MAP[prefix];
    const count = await prisma[model].count();
    const serial = String(count + 1).padStart(4, '0');
    return `BO-${prefix}-${serial}`;
}


/***/ }),
/* 31 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UsersService = void 0;
const common_1 = __webpack_require__(3);
const prisma_service_1 = __webpack_require__(14);
const client_1 = __webpack_require__(15);
const bcrypt = __importStar(__webpack_require__(27));
const serial_id_helper_1 = __webpack_require__(30);
let UsersService = class UsersService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll({ role, status, search } = {}) {
        let where = {};
        if (role && Object.values(client_1.UserRole).includes(role)) {
            where.role = role;
        }
        if (status) {
            where.status = status;
        }
        if (search) {
            where.name = { contains: search, mode: 'insensitive' };
        }
        return this.prisma.user.findMany({
            where,
            select: {
                id: true,
                serialId: true,
                email: true,
                name: true,
                role: true,
                status: true,
                phone: true,
                createdAt: true,
                agentProfile: {
                    select: {
                        id: true,
                        closedDeals: true,
                        totalCommission: true,
                        status: true,
                        cluster: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                    },
                },
                freelancerProfile: {
                    select: {
                        id: true,
                        activeDeals: true,
                        closedDeals: true,
                        totalCommission: true,
                        registrarName: true,
                        registrarType: true,
                        status: true,
                        cluster: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                    },
                },
                managedClusters: {
                    select: {
                        id: true,
                        name: true,
                        code: true,
                        status: true,
                        location: true,
                    },
                },
                transactions: {
                    select: {
                        id: true,
                        totalAmount: true,
                        status: true,
                        date: true,
                        asset: {
                            select: {
                                id: true,
                                name: true,
                                type: true,
                                location: true,
                            },
                        },
                    },
                    orderBy: { date: 'desc' },
                    take: 5,
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findById(id) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            include: {
                agentProfile: {
                    include: {
                        cluster: true,
                        assignedLeads: {
                            orderBy: { createdAt: 'desc' },
                            take: 50,
                        },
                        leadTransactions: {
                            orderBy: { date: 'desc' },
                            take: 20,
                        },
                        closerTransactions: {
                            orderBy: { date: 'desc' },
                            take: 20,
                        },
                    },
                },
                freelancerProfile: {
                    include: { cluster: true },
                },
                notifications: { orderBy: { createdAt: 'desc' }, take: 10 },
            },
        });
        if (!user) {
            throw new common_1.NotFoundException(`User with ID ${id} not found`);
        }
        return user;
    }
    async getUserTransactions(userId) {
        return this.prisma.transaction.findMany({
            where: { buyerId: userId },
            include: {
                asset: {
                    select: { id: true, name: true, type: true, location: true },
                },
                leadAgent: { include: { user: { select: { id: true, name: true } } } },
                closerAgent: { include: { user: { select: { id: true, name: true } } } },
                installments: true,
            },
            orderBy: { date: 'desc' },
        });
    }
    async getUserStats(userId) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        if (user.role === 'AGENT') {
            const agent = await this.prisma.agent.findUnique({ where: { userId } });
            if (!agent)
                return { closedDeals: 0, totalCommission: 0, assignedLeads: 0 };
            const [leadCount, leadTxCount, closerTxCount] = await Promise.all([
                this.prisma.lead.count({ where: { assignedToId: agent.id } }),
                this.prisma.transaction.count({ where: { leadAgentId: agent.id, status: 'COMPLETED' } }),
                this.prisma.transaction.count({ where: { closerAgentId: agent.id, status: 'COMPLETED' } }),
            ]);
            return {
                assignedLeads: leadCount,
                closedDeals: leadTxCount + closerTxCount,
                totalCommission: agent.totalCommission,
            };
        }
        if (user.role === 'INVESTOR') {
            const stats = await this.prisma.transaction.aggregate({
                where: { buyerId: userId },
                _sum: { totalAmount: true },
                _count: true,
            });
            return {
                totalInvested: stats._sum.totalAmount || 0,
                totalTransactions: stats._count,
            };
        }
        const [totalUsers, totalTransactions, revenueAgg] = await Promise.all([
            this.prisma.user.count(),
            this.prisma.transaction.count({ where: { status: 'COMPLETED' } }),
            this.prisma.transaction.aggregate({
                where: { status: 'COMPLETED' },
                _sum: { totalAmount: true },
            }),
        ]);
        return {
            totalUsers,
            totalTransactions,
            totalRevenue: revenueAgg._sum.totalAmount || 0,
        };
    }
    async updateUser(id, dto) {
        const updateData = {};
        if (dto.name !== undefined)
            updateData.name = dto.name;
        if (dto.email !== undefined)
            updateData.email = dto.email;
        if (dto.phone !== undefined)
            updateData.phone = dto.phone;
        if (dto.role !== undefined)
            updateData.role = dto.role;
        if (dto.timezone !== undefined)
            updateData.timezone = dto.timezone;
        if (dto.dateFormat !== undefined)
            updateData.dateFormat = dto.dateFormat;
        if (dto.currency !== undefined)
            updateData.currency = dto.currency;
        if (dto.emailNotifications !== undefined)
            updateData.emailNotifications = dto.emailNotifications;
        if (dto.pushNotifications !== undefined)
            updateData.pushNotifications = dto.pushNotifications;
        if (dto.transactionAlerts !== undefined)
            updateData.transactionAlerts = dto.transactionAlerts;
        if (dto.weeklyReports !== undefined)
            updateData.weeklyReports = dto.weeklyReports;
        if (dto.agentUpdates !== undefined)
            updateData.agentUpdates = dto.agentUpdates;
        if (dto.gender !== undefined)
            updateData.gender = dto.gender;
        if (dto.dateOfBirth !== undefined)
            updateData.dateOfBirth = dto.dateOfBirth ? new Date(dto.dateOfBirth) : null;
        if (dto.homeAddress !== undefined)
            updateData.homeAddress = dto.homeAddress;
        if (dto.nin !== undefined)
            updateData.nin = dto.nin;
        if (dto.stateOfOrigin !== undefined)
            updateData.stateOfOrigin = dto.stateOfOrigin;
        if (dto.dateOfRecruitment !== undefined)
            updateData.dateOfRecruitment = dto.dateOfRecruitment ? new Date(dto.dateOfRecruitment) : null;
        if (dto.kinFullName !== undefined)
            updateData.kinFullName = dto.kinFullName;
        if (dto.kinPhoneNumber !== undefined)
            updateData.kinPhoneNumber = dto.kinPhoneNumber;
        if (dto.kinRelationship !== undefined)
            updateData.kinRelationship = dto.kinRelationship;
        if (dto.kinAddress !== undefined)
            updateData.kinAddress = dto.kinAddress;
        if (dto.bankName !== undefined)
            updateData.bankName = dto.bankName;
        if (dto.accountNumber !== undefined)
            updateData.accountNumber = dto.accountNumber;
        if (dto.beneficiaryName !== undefined)
            updateData.beneficiaryName = dto.beneficiaryName;
        return this.prisma.user.update({ where: { id }, data: updateData });
    }
    async findByEmail(email) {
        return this.prisma.user.findUnique({ where: { email } });
    }
    async getUserActivity(id, limit) {
        return this.prisma.notification.findMany({ where: { userId: id }, take: limit, orderBy: { createdAt: 'desc' } });
    }
    async getUserLeads(id) {
        return this.prisma.lead.findMany({ where: { assignedToId: id } });
    }
    async createUser(dto) {
        if (!dto.status || !['ACTIVE', 'INACTIVE', 'PENDING'].includes(dto.status.toUpperCase())) {
            throw new Error('User status is required and must be one of: ACTIVE, INACTIVE, PENDING');
        }
        const existing = await this.prisma.user.findUnique({ where: { email: dto.email.trim().toLowerCase() } });
        if (existing) {
            throw new common_1.NotFoundException('A user with this email already exists');
        }
        const hashedPassword = await bcrypt.hash(dto.password, 10);
        const serialId = await (0, serial_id_helper_1.generateSerialId)(this.prisma, 'USR');
        const email = dto.email.trim().toLowerCase();
        return this.prisma.user.create({
            data: {
                serialId,
                email,
                password: hashedPassword,
                name: dto.name,
                phone: dto.phone || null,
                role: dto.role.toUpperCase(),
                status: dto.status.toUpperCase(),
            },
        });
    }
    async updateUserRole(id, role) {
        if (!Object.values(client_1.UserRole).includes(role)) {
            throw new Error('Invalid role');
        }
        return this.prisma.user.update({ where: { id }, data: { role: role } });
    }
    async updateUserPassword(id, newPassword) {
        return this.prisma.user.update({ where: { id }, data: { password: newPassword } });
    }
    async deactivateUser(id) {
        return this.prisma.user.update({ where: { id }, data: { status: client_1.UserStatus.INACTIVE } });
    }
    async reactivateUser(id) {
        return this.prisma.user.update({ where: { id }, data: { status: client_1.UserStatus.ACTIVE } });
    }
    async deleteUser(id) {
        return this.prisma.user.delete({ where: { id } });
    }
    async getUsersByRole(role) {
        if (!Object.values(client_1.UserRole).includes(role)) {
            throw new Error('Invalid role');
        }
        return this.prisma.user.findMany({ where: { role: role } });
    }
    async getUserDashboard(id) {
        return { userId: id, dashboard: 'stub' };
    }
    async getAllAgents() {
        return this.prisma.user.findMany({ where: { role: client_1.UserRole.AGENT } });
    }
    async getAllInvestors() {
        return this.prisma.user.findMany({ where: { role: client_1.UserRole.INVESTOR } });
    }
    async searchUsers(query, role) {
        let where = {
            OR: [
                { name: { contains: query, mode: 'insensitive' } },
                { email: { contains: query, mode: 'insensitive' } },
            ],
        };
        if (role && Object.values(client_1.UserRole).includes(role)) {
            where.role = role;
        }
        return this.prisma.user.findMany({ where });
    }
    async getUserCountByRole() {
        return this.prisma.user.groupBy({ by: ['role'], _count: { role: true } });
    }
    async bulkCreateUsers(users) {
        return this.prisma.user.createMany({ data: users });
    }
    async delete(id) {
        return this.prisma.user.delete({ where: { id } });
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], UsersService);


/***/ }),
/* 32 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.JwtAuthGuard = void 0;
const common_1 = __webpack_require__(3);
const passport_1 = __webpack_require__(11);
let JwtAuthGuard = class JwtAuthGuard extends (0, passport_1.AuthGuard)('jwt') {
    canActivate(context) {
        const request = context.switchToHttp().getRequest();
        if (request.method === 'OPTIONS') {
            return true;
        }
        return super.canActivate(context);
    }
};
exports.JwtAuthGuard = JwtAuthGuard;
exports.JwtAuthGuard = JwtAuthGuard = __decorate([
    (0, common_1.Injectable)()
], JwtAuthGuard);


/***/ }),
/* 33 */
/***/ ((module) => {

module.exports = require("class-validator");

/***/ }),
/* 34 */
/***/ ((module) => {

module.exports = require("class-transformer");

/***/ }),
/* 35 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.JwtStrategy = void 0;
const common_1 = __webpack_require__(3);
const passport_1 = __webpack_require__(11);
const passport_jwt_1 = __webpack_require__(36);
const prisma_service_1 = __webpack_require__(14);
let JwtStrategy = class JwtStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy) {
    constructor(prisma) {
        super({
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET,
        });
        this.prisma = prisma;
    }
    async validate(payload) {
        const userId = payload?.sub;
        if (!userId) {
            throw new common_1.UnauthorizedException("Invalid token: missing user identifier");
        }
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                serialId: true,
                email: true,
                name: true,
                role: true,
                status: true,
                agentProfileId: true,
                freelancerProfileId: true,
            },
        });
        if (!user) {
            throw new common_1.UnauthorizedException("User not found");
        }
        return user;
    }
};
exports.JwtStrategy = JwtStrategy;
exports.JwtStrategy = JwtStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], JwtStrategy);


/***/ }),
/* 36 */
/***/ ((module) => {

module.exports = require("passport-jwt");

/***/ }),
/* 37 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PrismaModule = void 0;
const common_1 = __webpack_require__(3);
const prisma_service_1 = __webpack_require__(14);
let PrismaModule = class PrismaModule {
};
exports.PrismaModule = PrismaModule;
exports.PrismaModule = PrismaModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        providers: [prisma_service_1.PrismaService],
        exports: [prisma_service_1.PrismaService],
    })
], PrismaModule);


/***/ }),
/* 38 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NotificationModule = void 0;
const common_1 = __webpack_require__(3);
const config_1 = __webpack_require__(8);
const notification_controller_1 = __webpack_require__(39);
const notification_triggers_controller_1 = __webpack_require__(40);
const notification_service_1 = __webpack_require__(18);
const sms_service_1 = __webpack_require__(19);
const email_service_1 = __webpack_require__(21);
const cron_service_1 = __webpack_require__(41);
const prisma_module_1 = __webpack_require__(37);
let NotificationModule = class NotificationModule {
};
exports.NotificationModule = NotificationModule;
exports.NotificationModule = NotificationModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule, config_1.ConfigModule],
        controllers: [notification_controller_1.NotificationController, notification_triggers_controller_1.NotificationTriggersController],
        providers: [notification_service_1.NotificationService, sms_service_1.SmsService, email_service_1.EmailService, cron_service_1.CronService],
        exports: [notification_service_1.NotificationService, sms_service_1.SmsService, email_service_1.EmailService, cron_service_1.CronService],
    })
], NotificationModule);


/***/ }),
/* 39 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NotificationController = void 0;
const common_1 = __webpack_require__(3);
const client_1 = __webpack_require__(15);
const jwt_auth_guard_1 = __webpack_require__(32);
const prisma_service_1 = __webpack_require__(14);
let NotificationController = class NotificationController {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getNotifications(req) {
        return this.prisma.notification.findMany({
            where: { userId: req.user.id },
            orderBy: { createdAt: 'desc' },
            take: 50,
        });
    }
    async getUnreadCount(req) {
        const count = await this.prisma.notification.count({
            where: { userId: req.user.id, read: false },
        });
        return { count };
    }
    async markAsRead(id) {
        return this.prisma.notification.update({
            where: { id },
            data: { read: true },
        });
    }
    async markAllAsRead(req) {
        return this.prisma.notification.updateMany({
            where: { userId: req.user.id, read: false },
            data: { read: true },
        });
    }
    async notifyAdmins(body, req) {
        const admins = await this.prisma.user.findMany({
            where: { role: client_1.UserRole.ADMIN },
            select: { id: true },
        });
        if (!admins.length)
            return { message: 'No admin users found', count: 0 };
        const validTypes = Object.values(client_1.NotificationType);
        const notifType = body.type && validTypes.includes(body.type.toUpperCase())
            ? body.type.toUpperCase()
            : client_1.NotificationType.INFO;
        await this.prisma.notification.createMany({
            data: admins.map((admin) => ({
                userId: admin.id,
                title: body.title,
                message: body.message,
                type: notifType,
            })),
        });
        return { message: 'Admin(s) notified successfully', count: admins.length };
    }
    async deleteNotification(id, req) {
        await this.prisma.notification.deleteMany({
            where: { id, userId: req.user.id },
        });
        return { message: 'Notification deleted' };
    }
    async deleteAllNotifications(req) {
        await this.prisma.notification.deleteMany({
            where: { userId: req.user.id },
        });
        return { message: 'All notifications deleted' };
    }
};
exports.NotificationController = NotificationController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "getNotifications", null);
__decorate([
    (0, common_1.Get)('unread'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "getUnreadCount", null);
__decorate([
    (0, common_1.Put)(':id/read'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "markAsRead", null);
__decorate([
    (0, common_1.Put)('read-all'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "markAllAsRead", null);
__decorate([
    (0, common_1.Post)('admin'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "notifyAdmins", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "deleteNotification", null);
__decorate([
    (0, common_1.Delete)(),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "deleteAllNotifications", null);
exports.NotificationController = NotificationController = __decorate([
    (0, common_1.Controller)('notifications'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], NotificationController);


/***/ }),
/* 40 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NotificationTriggersController = void 0;
const common_1 = __webpack_require__(3);
const jwt_auth_guard_1 = __webpack_require__(32);
const notification_service_1 = __webpack_require__(18);
let NotificationTriggersController = class NotificationTriggersController {
    constructor(notificationService) {
        this.notificationService = notificationService;
    }
    async triggerInstallmentDue(id) {
        return this.notificationService.notifyInstallmentDue(id);
    }
    async triggerInstallmentOverdue(id) {
        return this.notificationService.notifyInstallmentOverdue(id);
    }
    async triggerCommissionsSent(body) {
        return this.notificationService.notifyCommissionSent(body.transactionIds || []);
    }
    async triggerCommissionsPaid(body) {
        return this.notificationService.notifyCommissionsPaid(body.transactionIds || [], body.fileName);
    }
};
exports.NotificationTriggersController = NotificationTriggersController;
__decorate([
    (0, common_1.Post)('installment-due/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], NotificationTriggersController.prototype, "triggerInstallmentDue", null);
__decorate([
    (0, common_1.Post)('installment-overdue/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], NotificationTriggersController.prototype, "triggerInstallmentOverdue", null);
__decorate([
    (0, common_1.Post)('commissions-sent'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificationTriggersController.prototype, "triggerCommissionsSent", null);
__decorate([
    (0, common_1.Post)('commissions-paid'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificationTriggersController.prototype, "triggerCommissionsPaid", null);
exports.NotificationTriggersController = NotificationTriggersController = __decorate([
    (0, common_1.Controller)('notification'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [typeof (_a = typeof notification_service_1.NotificationService !== "undefined" && notification_service_1.NotificationService) === "function" ? _a : Object])
], NotificationTriggersController);


/***/ }),
/* 41 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CronService = void 0;
const common_1 = __webpack_require__(3);
const schedule_1 = __webpack_require__(42);
const prisma_service_1 = __webpack_require__(14);
const notification_service_1 = __webpack_require__(18);
let CronService = class CronService {
    constructor(prisma, notificationService) {
        this.prisma = prisma;
        this.notificationService = notificationService;
    }
    async sendInstallmentReminders() {
        const threeDaysFromNow = new Date();
        threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);
        const upcomingInstallments = await this.prisma.installment.findMany({
            where: {
                dueDate: {
                    gte: new Date(),
                    lte: threeDaysFromNow,
                },
                status: 'PENDING',
            },
        });
        for (const installment of upcomingInstallments) {
            await this.notificationService.notifyInstallmentDue(installment.id);
        }
    }
    async sendOverdueNotifications() {
        const overdueInstallments = await this.prisma.installment.findMany({
            where: {
                dueDate: { lt: new Date() },
                status: 'PENDING',
            },
        });
        for (const installment of overdueInstallments) {
            await this.notificationService.notifyInstallmentOverdue(installment.id);
            await this.prisma.installment.update({
                where: { id: installment.id },
                data: { status: 'OVERDUE' },
            });
        }
    }
};
exports.CronService = CronService;
__decorate([
    (0, schedule_1.Cron)('0 9 * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CronService.prototype, "sendInstallmentReminders", null);
__decorate([
    (0, schedule_1.Cron)('0 10 * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CronService.prototype, "sendOverdueNotifications", null);
exports.CronService = CronService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object, typeof (_b = typeof notification_service_1.NotificationService !== "undefined" && notification_service_1.NotificationService) === "function" ? _b : Object])
], CronService);


/***/ }),
/* 42 */
/***/ ((module) => {

module.exports = require("@nestjs/schedule");

/***/ }),
/* 43 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UsersModule = void 0;
const common_1 = __webpack_require__(3);
const users_controller_1 = __webpack_require__(44);
const users_service_1 = __webpack_require__(31);
const prisma_module_1 = __webpack_require__(37);
let UsersModule = class UsersModule {
};
exports.UsersModule = UsersModule;
exports.UsersModule = UsersModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        controllers: [users_controller_1.UsersController],
        providers: [users_service_1.UsersService],
        exports: [users_service_1.UsersService],
    })
], UsersModule);


/***/ }),
/* 44 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UsersController = exports.CreateUserDto = exports.UpdatePasswordDto = exports.UpdateUserDto = void 0;
const common_1 = __webpack_require__(3);
const jwt_auth_guard_1 = __webpack_require__(32);
const users_service_1 = __webpack_require__(31);
const roles_guard_1 = __webpack_require__(45);
const class_validator_1 = __webpack_require__(33);
class UpdateUserDto {
}
exports.UpdateUserDto = UpdateUserDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "phone", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "role", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "timezone", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "dateFormat", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "currency", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateUserDto.prototype, "emailNotifications", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateUserDto.prototype, "pushNotifications", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateUserDto.prototype, "transactionAlerts", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateUserDto.prototype, "weeklyReports", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateUserDto.prototype, "agentUpdates", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "gender", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "dateOfBirth", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "homeAddress", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "nin", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "stateOfOrigin", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "dateOfRecruitment", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "kinFullName", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "kinPhoneNumber", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "kinRelationship", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "kinAddress", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "bankName", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "accountNumber", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "beneficiaryName", void 0);
class UpdatePasswordDto {
}
exports.UpdatePasswordDto = UpdatePasswordDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(6),
    __metadata("design:type", String)
], UpdatePasswordDto.prototype, "newPassword", void 0);
class CreateUserDto {
}
exports.CreateUserDto = CreateUserDto;
__decorate([
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], CreateUserDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(8, { message: 'Password must be at least 8 characters' }),
    (0, class_validator_1.Matches)(/^(?=.*[0-9])(?=.*[!@#$%^&*])/, {
        message: 'Password must include at least one number and one special character',
    }),
    __metadata("design:type", String)
], CreateUserDto.prototype, "password", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateUserDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Matches)(/^(ADMIN|TEAM_LEAD|AGENT|FREELANCER|INVESTOR|USER)$/i, {
        message: 'Role must be one of: ADMIN, TEAM_LEAD, AGENT, FREELANCER, INVESTOR, USER',
    }),
    __metadata("design:type", String)
], CreateUserDto.prototype, "role", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Matches)(/^(ACTIVE|INACTIVE|PENDING)$/i, {
        message: 'Status must be one of: ACTIVE, INACTIVE, PENDING',
    }),
    __metadata("design:type", String)
], CreateUserDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateUserDto.prototype, "phone", void 0);
let UsersController = class UsersController {
    constructor(usersService) {
        this.usersService = usersService;
    }
    async findAll(role, status, search) {
        return this.usersService.findAll({ role, status, search });
    }
    async getProfile(req) {
        return this.usersService.findById(req.user.id);
    }
    async updateProfile(req, dto) {
        return this.usersService.updateUser(req.user.id, dto);
    }
    async findOne(id, req) {
        if (req.user.role !== "ADMIN" && req.user.id !== id) {
            throw new Error("Unauthorized to view this profile");
        }
        return this.usersService.findById(id);
    }
    async findByEmail(email) {
        return this.usersService.findByEmail(email);
    }
    async getUserStats(id, req) {
        if (req.user.role !== "ADMIN" && req.user.id !== id) {
            throw new Error("Unauthorized to view these statistics");
        }
        return this.usersService.getUserStats(id);
    }
    async getUserActivity(id, limit, req) {
        if (req.user.role !== "ADMIN" && req.user.id !== id) {
            throw new Error("Unauthorized to view this activity");
        }
        const activityLimit = limit ? parseInt(limit) : 20;
        return this.usersService.getUserActivity(id, activityLimit);
    }
    async getUserTransactions(id, req) {
        if (req.user.role !== "ADMIN" && req.user.id !== id) {
            throw new Error("Unauthorized to view these transactions");
        }
        return this.usersService.getUserTransactions(id);
    }
    async getUserLeads(id, req) {
        if (req.user.role !== "ADMIN" && req.user.id !== id) {
            throw new Error("Unauthorized to view these leads");
        }
        return this.usersService.getUserLeads(id);
    }
    async create(dto) {
        return this.usersService.createUser(dto);
    }
    async update(id, dto, req) {
        if (req.user.role !== "ADMIN") {
            if (req.user.id !== id) {
                throw new Error("Unauthorized to update this profile");
            }
            delete dto.role;
        }
        return this.usersService.updateUser(id, dto);
    }
    async updateRole(id, role) {
        return this.usersService.updateUserRole(id, role);
    }
    async updatePassword(id, dto) {
        return this.usersService.updateUserPassword(id, dto.newPassword);
    }
    async deactivate(id) {
        return this.usersService.deactivateUser(id);
    }
    async reactivate(id) {
        return this.usersService.reactivateUser(id);
    }
    async remove(id) {
        return this.usersService.deleteUser(id);
    }
    async getUsersByRole(role) {
        return this.usersService.getUsersByRole(role);
    }
    async getUserDashboard(id, req) {
        if (req.user.role !== "ADMIN" && req.user.id !== id) {
            throw new Error("Unauthorized to view this dashboard");
        }
        return this.usersService.getUserDashboard(id);
    }
    async getAllAgents() {
        return this.usersService.getAllAgents();
    }
    async getAllInvestors() {
        return this.usersService.getAllInvestors();
    }
    async searchUsers(query, role) {
        return this.usersService.searchUsers(query, role);
    }
    async getUserCountByRole() {
        return this.usersService.getUserCountByRole();
    }
    async bulkCreate(users) {
        return this.usersService.bulkCreateUsers(users);
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)("role")),
    __param(1, (0, common_1.Query)("status")),
    __param(2, (0, common_1.Query)("search")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)("me"),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getProfile", null);
__decorate([
    (0, common_1.Put)("me"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, UpdateUserDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updateProfile", null);
__decorate([
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)("email/:email"),
    __param(0, (0, common_1.Param)("email")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "findByEmail", null);
__decorate([
    (0, common_1.Get)(":id/stats"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getUserStats", null);
__decorate([
    (0, common_1.Get)(":id/activity"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Query)("limit")),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getUserActivity", null);
__decorate([
    (0, common_1.Get)(":id/transactions"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getUserTransactions", null);
__decorate([
    (0, common_1.Get)(":id/leads"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getUserLeads", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateUserDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UpdateUserDto, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "update", null);
__decorate([
    (0, common_1.Put)(":id/role"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)("role")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updateRole", null);
__decorate([
    (0, common_1.Put)(":id/password"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UpdatePasswordDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updatePassword", null);
__decorate([
    (0, common_1.Post)(":id/deactivate"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "deactivate", null);
__decorate([
    (0, common_1.Post)(":id/reactivate"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "reactivate", null);
__decorate([
    (0, common_1.Delete)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)("by-role/:role"),
    __param(0, (0, common_1.Param)("role")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getUsersByRole", null);
__decorate([
    (0, common_1.Get)(":id/dashboard"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getUserDashboard", null);
__decorate([
    (0, common_1.Get)("agents/all"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getAllAgents", null);
__decorate([
    (0, common_1.Get)("investors/all"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getAllInvestors", null);
__decorate([
    (0, common_1.Get)("search/query"),
    __param(0, (0, common_1.Query)("q")),
    __param(1, (0, common_1.Query)("role")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "searchUsers", null);
__decorate([
    (0, common_1.Get)("count/by-role"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getUserCountByRole", null);
__decorate([
    (0, common_1.Post)("bulk-create"),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)("users")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "bulkCreate", null);
exports.UsersController = UsersController = __decorate([
    (0, common_1.Controller)("users"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [typeof (_a = typeof users_service_1.UsersService !== "undefined" && users_service_1.UsersService) === "function" ? _a : Object])
], UsersController);


/***/ }),
/* 45 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RolesGuard = void 0;
const common_1 = __webpack_require__(3);
const core_1 = __webpack_require__(4);
const roles_decorator_1 = __webpack_require__(46);
let RolesGuard = class RolesGuard {
    constructor(reflector) {
        this.reflector = reflector;
    }
    canActivate(context) {
        const requiredRoles = this.reflector.getAllAndOverride(roles_decorator_1.ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (!requiredRoles || requiredRoles.length === 0) {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        if (!user)
            return false;
        return requiredRoles.includes(user.role);
    }
};
exports.RolesGuard = RolesGuard;
exports.RolesGuard = RolesGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof core_1.Reflector !== "undefined" && core_1.Reflector) === "function" ? _a : Object])
], RolesGuard);


/***/ }),
/* 46 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Roles = exports.ROLES_KEY = void 0;
const common_1 = __webpack_require__(3);
exports.ROLES_KEY = "roles";
const Roles = (...roles) => (0, common_1.SetMetadata)(exports.ROLES_KEY, roles);
exports.Roles = Roles;


/***/ }),
/* 47 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AssetsModule = void 0;
const common_1 = __webpack_require__(3);
const assets_controller_1 = __webpack_require__(48);
const assets_service_1 = __webpack_require__(51);
const prisma_module_1 = __webpack_require__(37);
const notification_module_1 = __webpack_require__(38);
const public_controller_1 = __webpack_require__(53);
let AssetsModule = class AssetsModule {
};
exports.AssetsModule = AssetsModule;
exports.AssetsModule = AssetsModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule, notification_module_1.NotificationModule],
        controllers: [assets_controller_1.AssetsController, public_controller_1.PublicController],
        providers: [assets_service_1.AssetsService],
        exports: [assets_service_1.AssetsService],
    })
], AssetsModule);


/***/ }),
/* 48 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AssetsController = void 0;
const common_1 = __webpack_require__(3);
const passport_1 = __webpack_require__(11);
const platform_express_1 = __webpack_require__(49);
const multer_1 = __webpack_require__(50);
const path_1 = __webpack_require__(5);
const assets_service_1 = __webpack_require__(51);
const upload_config_1 = __webpack_require__(52);
let AssetsController = class AssetsController {
    constructor(assetsService) {
        this.assetsService = assetsService;
    }
    async findAll(query) {
        return this.assetsService.findAll(query);
    }
    async getOverviewStats() {
        return this.assetsService.getOverviewStats();
    }
    async findOne(id) {
        return this.assetsService.findById(id);
    }
    async create(createAssetDto) {
        return this.assetsService.create(createAssetDto);
    }
    async update(id, updateAssetDto) {
        return this.assetsService.update(id, updateAssetDto);
    }
    async delete(id) {
        return this.assetsService.delete(id);
    }
    async publish(id) {
        return this.assetsService.publish(id);
    }
    async unpublish(id) {
        return this.assetsService.unpublish(id);
    }
    async uploadImages(id, files) {
        return this.assetsService.uploadImages(id, files);
    }
    async addImage(id, imageData) {
        return this.assetsService.addImage(id, imageData);
    }
    async deleteImage(id, imageId) {
        return this.assetsService.deleteImage(id, imageId);
    }
    async uploadDocuments(id, files) {
        return this.assetsService.uploadDocuments(id, files);
    }
    async addDocument(id, documentData) {
        return this.assetsService.addDocument(id, documentData);
    }
    async deleteDocument(id, documentId) {
        return this.assetsService.deleteDocument(id, documentId);
    }
};
exports.AssetsController = AssetsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AssetsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('stats/overview'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AssetsController.prototype, "getOverviewStats", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AssetsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AssetsController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AssetsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AssetsController.prototype, "delete", null);
__decorate([
    (0, common_1.Put)(':id/publish'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AssetsController.prototype, "publish", null);
__decorate([
    (0, common_1.Put)(':id/unpublish'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AssetsController.prototype, "unpublish", null);
__decorate([
    (0, common_1.Post)(':id/images/upload'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('images', 10, {
        storage: (0, multer_1.diskStorage)({
            destination: './uploads/images',
            filename: (req, file, callback) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                const ext = (0, path_1.extname)(file.originalname);
                callback(null, `image-${uniqueSuffix}${ext}`);
            },
        }),
        fileFilter: upload_config_1.imageFileFilter,
        limits: { fileSize: 10 * 1024 * 1024 },
    })),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Array]),
    __metadata("design:returntype", Promise)
], AssetsController.prototype, "uploadImages", null);
__decorate([
    (0, common_1.Post)(':id/images'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AssetsController.prototype, "addImage", null);
__decorate([
    (0, common_1.Delete)(':id/images/:imageId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('imageId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AssetsController.prototype, "deleteImage", null);
__decorate([
    (0, common_1.Post)(':id/documents/upload'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('documents', 10, {
        storage: (0, multer_1.diskStorage)({
            destination: './uploads/documents',
            filename: (req, file, callback) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                const ext = (0, path_1.extname)(file.originalname);
                callback(null, `doc-${uniqueSuffix}${ext}`);
            },
        }),
        fileFilter: upload_config_1.documentFileFilter,
        limits: { fileSize: 10 * 1024 * 1024 },
    })),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Array]),
    __metadata("design:returntype", Promise)
], AssetsController.prototype, "uploadDocuments", null);
__decorate([
    (0, common_1.Post)(':id/documents'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AssetsController.prototype, "addDocument", null);
__decorate([
    (0, common_1.Delete)(':id/documents/:documentId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('documentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AssetsController.prototype, "deleteDocument", null);
exports.AssetsController = AssetsController = __decorate([
    (0, common_1.Controller)('assets'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __metadata("design:paramtypes", [typeof (_a = typeof assets_service_1.AssetsService !== "undefined" && assets_service_1.AssetsService) === "function" ? _a : Object])
], AssetsController);


/***/ }),
/* 49 */
/***/ ((module) => {

module.exports = require("@nestjs/platform-express");

/***/ }),
/* 50 */
/***/ ((module) => {

module.exports = require("multer");

/***/ }),
/* 51 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AssetsService = void 0;
const common_1 = __webpack_require__(3);
const prisma_service_1 = __webpack_require__(14);
const notification_service_1 = __webpack_require__(18);
const serial_id_helper_1 = __webpack_require__(30);
let AssetsService = class AssetsService {
    constructor(prisma, notificationService) {
        this.prisma = prisma;
        this.notificationService = notificationService;
    }
    async publish(id) {
        await this.findById(id);
        const published = await this.prisma.asset.update({
            where: { id },
            data: { status: 'published' },
        });
        await this.notificationService.notifyAssetPublished(id);
        return published;
    }
    async unpublish(id) {
        await this.findById(id);
        return this.prisma.asset.update({
            where: { id },
            data: { status: 'draft' },
        });
    }
    async deleteImage(assetId, imageId) {
        await this.findById(assetId);
        return this.prisma.assetImage.delete({ where: { id: imageId } });
    }
    async deleteDocument(assetId, documentId) {
        await this.findById(assetId);
        return this.prisma.assetDocument.delete({ where: { id: documentId } });
    }
    async findAll(filters) {
        const where = {};
        if (filters?.status)
            where.status = filters.status;
        if (filters?.type)
            where.type = filters.type;
        if (filters?.companyId)
            where.companyId = filters.companyId;
        const assets = await this.prisma.asset.findMany({
            where,
            include: {
                company: true,
                images: { orderBy: { order: 'asc' } },
                documents: true,
                leads: { orderBy: { createdAt: 'desc' }, take: 10 },
                transactions: { orderBy: { date: 'desc' }, take: 10 },
                installmentPlans: true,
                _count: { select: { leads: true, transactions: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
        return assets.map(asset => {
            const finalPrice = asset.price
                ? parseFloat(asset.price)
                : asset.fractionCost
                    ? parseFloat(asset.fractionCost)
                    : 0;
            const rentalYield = asset.rentalYield
                ? parseFloat(asset.rentalYield)
                : asset.rentalYieldMax
                    ? asset.rentalYieldMax
                    : 0;
            const capAppreciation = asset.capitalAppreciation
                ? parseFloat(asset.capitalAppreciation)
                : asset.capitalAppreciationMax
                    ? asset.capitalAppreciationMax
                    : 0;
            const totalAnnualReturn = rentalYield + capAppreciation;
            return {
                ...asset,
                facilities: asset.facilities ?? [],
                ownershipOptions: asset.ownershipOptions ?? [],
                paymentOptions: asset.paymentOptions ?? [],
                installmentPeriods: asset.installmentPeriods ?? [],
                riskFactors: asset.riskFactors ?? [],
                finalPrice,
                totalAnnualReturn,
                projectedRentalIncome: Number(asset.projectedRentalIncome) || 0,
                virtualTours: asset.virtualTours ?? 0,
            };
        });
    }
    async getPublicStats() {
        const [publishedAssets, totalLeads] = await Promise.all([
            this.prisma.asset.findMany({
                where: { status: 'published' },
                select: { price: true, fractionCost: true, rentalYield: true, rentalYieldMax: true, capitalAppreciation: true },
            }),
            this.prisma.lead.count(),
        ]);
        let totalValue = 0;
        let yieldSum = 0;
        let yieldCount = 0;
        for (const a of publishedAssets) {
            const raw = a.price || a.fractionCost || '0';
            const n = parseFloat(raw);
            if (!isNaN(n))
                totalValue += n;
            const ry = parseFloat(a.rentalYield || '0') || a.rentalYieldMax || 0;
            const ca = a.capitalAppreciation || 0;
            if (ry + ca > 0) {
                yieldSum += ry + ca;
                yieldCount++;
            }
        }
        return {
            assetsListed: publishedAssets.length,
            totalInvestors: totalLeads,
            totalTransactionValue: totalValue,
            averageROI: yieldCount > 0 ? Math.round(yieldSum / yieldCount) : 18,
        };
    }
    async getOverviewStats() {
        const assets = await this.prisma.asset.findMany({
            select: { status: true, price: true, fractionCost: true },
        });
        const statusCounts = {};
        let totalValue = 0;
        for (const asset of assets) {
            const statusKey = (asset.status || 'unknown').toLowerCase();
            statusCounts[statusKey] = (statusCounts[statusKey] || 0) + 1;
            const rawValue = asset.price || asset.fractionCost || '0';
            const numericValue = Number.parseFloat(rawValue);
            if (!Number.isNaN(numericValue)) {
                totalValue += numericValue;
            }
        }
        return {
            totalAssets: assets.length,
            totalValue,
            statusCounts,
        };
    }
    async findById(id) {
        const asset = await this.prisma.asset.findUnique({
            where: { id },
            include: {
                company: true,
                images: { orderBy: { order: 'asc' } },
                documents: true,
                leads: { orderBy: { createdAt: 'desc' }, take: 10 },
                transactions: { orderBy: { date: 'desc' }, take: 10 },
                installmentPlans: true,
                _count: { select: { leads: true, transactions: true } },
            },
        });
        if (!asset)
            throw new common_1.NotFoundException(`Asset with ID ${id} not found`);
        const finalPrice = asset.price
            ? parseFloat(asset.price)
            : asset.fractionCost
                ? parseFloat(asset.fractionCost)
                : 0;
        const rentalYield = asset.rentalYield
            ? parseFloat(asset.rentalYield)
            : asset.rentalYieldMax
                ? asset.rentalYieldMax
                : 0;
        const capAppreciation = asset.capitalAppreciation
            ? parseFloat(asset.capitalAppreciation)
            : asset.capitalAppreciationMax
                ? asset.capitalAppreciationMax
                : 0;
        const totalAnnualReturn = rentalYield + capAppreciation;
        return {
            ...asset,
            facilities: asset.facilities ?? [],
            ownershipOptions: asset.ownershipOptions ?? [],
            paymentOptions: asset.paymentOptions ?? [],
            installmentPeriods: asset.installmentPeriods ?? [],
            riskFactors: asset.riskFactors ?? [],
            finalPrice,
            totalAnnualReturn,
            projectedRentalIncome: Number(asset.projectedRentalIncome) || 0,
            virtualTours: asset.virtualTours ?? 0,
        };
    }
    async create(data) {
        if (!data.name)
            throw new common_1.BadRequestException('Asset name is required');
        if (!data.companyId)
            throw new common_1.BadRequestException('Company ID is required');
        const company = await this.prisma.company.findUnique({ where: { id: data.companyId } });
        if (!company)
            throw new common_1.NotFoundException('Company not found');
        const serialId = await (0, serial_id_helper_1.generateSerialId)(this.prisma, 'AST');
        const newAsset = await this.prisma.asset.create({
            data: {
                serialId,
                name: data.name,
                company: { connect: { id: data.companyId } },
                title: data.title || data.name,
                referenceCode: data.referenceCode || null,
                type: data.type || null,
                status: data.status || 'draft',
                projectStatus: data.projectStatus || null,
                location: data.location || null,
                address: data.address || null,
                description: data.description || null,
                landSize: data.landSize ? parseFloat(data.landSize) : null,
                builtSize: data.builtSize ? parseFloat(data.builtSize) : null,
                constructionStart: data.constructionStart ? new Date(data.constructionStart) : null,
                constructionEnd: data.constructionEnd ? new Date(data.constructionEnd) : null,
                propertyCategory: data.propertyCategory || null,
                unitConfiguration: data.unitConfiguration || null,
                facilityManagement: data.facilityManagement ?? null,
                units: data.units ? parseInt(data.units) : null,
                totalUnits: data.totalUnits ? parseInt(data.totalUnits) : null,
                availableUnits: data.availableUnits ? parseInt(data.availableUnits) : null,
                bedrooms: data.bedrooms ? parseInt(data.bedrooms) : null,
                bathrooms: data.bathrooms ? parseInt(data.bathrooms) : null,
                area: data.area ? parseFloat(data.area) : null,
                parking: data.parking || null,
                furnished: data.furnished || null,
                facilities: data.facilities || data.sharedFacilities || [],
                ownershipOptions: data.ownershipOptions || [],
                ownershipType: data.ownershipType || null,
                fractionTotal: data.fractionTotal ? parseInt(data.fractionTotal) : null,
                landUnitType: data.landUnitType || null,
                landUnitCount: data.landUnitCount ? parseInt(data.landUnitCount) : null,
                price: data.price || null,
                priceRange: data.priceRange || null,
                markup: data.markup || null,
                fractionCost: data.fractionCost || data.costPerFraction || null,
                fundingStatus: data.fundingStatus ? parseInt(data.fundingStatus) : null,
                paymentOptions: data.paymentOptions || [],
                installmentPeriods: data.installmentPeriods || [],
                downPaymentAmount: data.downPaymentAmount || null,
                offPlanDiscount: data.offPlanDiscount ? parseFloat(data.offPlanDiscount) : null,
                stageBasedDiscount: data.stageBasedDiscount ? parseFloat(data.stageBasedDiscount) : null,
                commission: data.commission || null,
                commissionRate: data.commissionRate || null,
                leadCommission: data.leadCommission ? parseFloat(data.leadCommission) : null,
                closerCommission: data.closerCommission ? parseFloat(data.closerCommission) : null,
                projectedRentalIncome: data.projectedRentalIncome ? parseFloat(data.projectedRentalIncome) : null,
                rentalFrequency: data.rentalFrequency || null,
                operatingCost: data.operatingCost ? parseFloat(data.operatingCost) : null,
                firstPayoutDate: data.firstPayoutDate ? new Date(data.firstPayoutDate) : null,
                rentalYield: data.rentalYield || null,
                rentalYieldMin: data.rentalYieldMin ? parseFloat(data.rentalYieldMin) : null,
                rentalYieldMax: data.rentalYieldMax ? parseFloat(data.rentalYieldMax) : null,
                capitalAppreciation: data.capitalAppreciation ? parseFloat(data.capitalAppreciation) : null,
                capitalAppreciationMin: data.capitalAppreciationMin ? parseFloat(data.capitalAppreciationMin) : null,
                capitalAppreciationMax: data.capitalAppreciationMax ? parseFloat(data.capitalAppreciationMax) : null,
                totalReturns: data.totalReturns || null,
                totalReturnsMin: data.totalReturnsMin ? parseFloat(data.totalReturnsMin) : null,
                totalReturnsMax: data.totalReturnsMax ? parseFloat(data.totalReturnsMax) : null,
                riskLevel: data.riskLevel || null,
                riskFactors: data.riskFactors || [],
                constructionStage: data.constructionStage || data.constructionProgress || null,
                offPlanSecurity: data.offPlanSecurity || null,
                exitLiquidity: data.exitLiquidity || null,
                managementMode: data.managementMode || null,
                virtualTours: data.virtualTours ? parseInt(data.virtualTours) : null,
            },
        });
        return this.findById(newAsset.id);
    }
    async update(id, data) {
        const existingAsset = await this.findById(id);
        const updateData = {};
        if (data.name !== undefined)
            updateData.name = data.name;
        if (data.title !== undefined)
            updateData.title = data.title;
        if (data.referenceCode !== undefined)
            updateData.referenceCode = data.referenceCode;
        if (data.type !== undefined)
            updateData.type = data.type;
        if (data.status !== undefined)
            updateData.status = data.status;
        if (data.projectStatus !== undefined)
            updateData.projectStatus = data.projectStatus;
        if (data.location !== undefined)
            updateData.location = data.location;
        if (data.address !== undefined)
            updateData.address = data.address;
        if (data.description !== undefined)
            updateData.description = data.description;
        if (data.companyId !== undefined)
            updateData.companyId = data.companyId;
        if (data.landSize !== undefined && data.landSize !== '' && data.landSize !== null)
            updateData.landSize = parseFloat(data.landSize);
        if (data.builtSize !== undefined && data.builtSize !== '' && data.builtSize !== null)
            updateData.builtSize = parseFloat(data.builtSize);
        if (data.constructionStart !== undefined)
            updateData.constructionStart = data.constructionStart ? new Date(data.constructionStart) : null;
        if (data.constructionEnd !== undefined)
            updateData.constructionEnd = data.constructionEnd ? new Date(data.constructionEnd) : null;
        if (data.propertyCategory !== undefined)
            updateData.propertyCategory = data.propertyCategory;
        if (data.unitConfiguration !== undefined)
            updateData.unitConfiguration = data.unitConfiguration;
        if (data.facilityManagement !== undefined)
            updateData.facilityManagement = data.facilityManagement;
        if (data.units !== undefined && data.units !== '' && data.units !== null)
            updateData.units = parseInt(data.units);
        if (data.totalUnits !== undefined && data.totalUnits !== '' && data.totalUnits !== null)
            updateData.totalUnits = parseInt(data.totalUnits);
        if (data.availableUnits !== undefined && data.availableUnits !== '' && data.availableUnits !== null)
            updateData.availableUnits = parseInt(data.availableUnits);
        if (data.bedrooms !== undefined && data.bedrooms !== '' && data.bedrooms !== null)
            updateData.bedrooms = parseInt(data.bedrooms);
        if (data.bathrooms !== undefined && data.bathrooms !== '' && data.bathrooms !== null)
            updateData.bathrooms = parseInt(data.bathrooms);
        if (data.area !== undefined && data.area !== '' && data.area !== null)
            updateData.area = parseFloat(data.area);
        if (data.parking !== undefined)
            updateData.parking = data.parking;
        if (data.furnished !== undefined)
            updateData.furnished = data.furnished;
        if (data.facilities !== undefined)
            updateData.facilities = data.facilities;
        if (data.sharedFacilities !== undefined)
            updateData.facilities = data.sharedFacilities;
        if (data.ownershipOptions !== undefined)
            updateData.ownershipOptions = data.ownershipOptions;
        if (data.ownershipType !== undefined)
            updateData.ownershipType = data.ownershipType;
        if (data.fractionTotal !== undefined && data.fractionTotal !== '' && data.fractionTotal !== null)
            updateData.fractionTotal = parseInt(data.fractionTotal);
        if (data.landUnitType !== undefined)
            updateData.landUnitType = data.landUnitType;
        if (data.landUnitCount !== undefined && data.landUnitCount !== '' && data.landUnitCount !== null)
            updateData.landUnitCount = parseInt(data.landUnitCount);
        if (data.price !== undefined)
            updateData.price = data.price;
        if (data.priceRange !== undefined)
            updateData.priceRange = data.priceRange;
        if (data.markup !== undefined)
            updateData.markup = data.markup;
        if (data.fractionCost !== undefined)
            updateData.fractionCost = data.fractionCost;
        if (data.costPerFraction !== undefined)
            updateData.fractionCost = data.costPerFraction;
        if (data.fundingStatus !== undefined && data.fundingStatus !== '' && data.fundingStatus !== null)
            updateData.fundingStatus = parseInt(data.fundingStatus);
        if (data.paymentOptions !== undefined)
            updateData.paymentOptions = data.paymentOptions;
        if (data.installmentPeriods !== undefined)
            updateData.installmentPeriods = data.installmentPeriods;
        if (data.downPaymentAmount !== undefined)
            updateData.downPaymentAmount = data.downPaymentAmount;
        if (data.offPlanDiscount !== undefined && data.offPlanDiscount !== '' && data.offPlanDiscount !== null)
            updateData.offPlanDiscount = parseFloat(data.offPlanDiscount);
        if (data.stageBasedDiscount !== undefined && data.stageBasedDiscount !== '' && data.stageBasedDiscount !== null)
            updateData.stageBasedDiscount = parseFloat(data.stageBasedDiscount);
        if (data.commission !== undefined)
            updateData.commission = data.commission;
        if (data.commissionRate !== undefined)
            updateData.commissionRate = data.commissionRate;
        if (data.leadCommission !== undefined && data.leadCommission !== '' && data.leadCommission !== null)
            updateData.leadCommission = parseFloat(data.leadCommission);
        if (data.closerCommission !== undefined && data.closerCommission !== '' && data.closerCommission !== null)
            updateData.closerCommission = parseFloat(data.closerCommission);
        if (data.projectedRentalIncome !== undefined && data.projectedRentalIncome !== '' && data.projectedRentalIncome !== null)
            updateData.projectedRentalIncome = parseFloat(data.projectedRentalIncome);
        if (data.rentalFrequency !== undefined)
            updateData.rentalFrequency = data.rentalFrequency;
        if (data.operatingCost !== undefined && data.operatingCost !== '' && data.operatingCost !== null)
            updateData.operatingCost = parseFloat(data.operatingCost);
        if (data.firstPayoutDate !== undefined)
            updateData.firstPayoutDate = data.firstPayoutDate ? new Date(data.firstPayoutDate) : null;
        if (data.rentalYield !== undefined)
            updateData.rentalYield = data.rentalYield;
        if (data.rentalYieldMin !== undefined && data.rentalYieldMin !== '' && data.rentalYieldMin !== null)
            updateData.rentalYieldMin = parseFloat(data.rentalYieldMin);
        if (data.rentalYieldMax !== undefined && data.rentalYieldMax !== '' && data.rentalYieldMax !== null)
            updateData.rentalYieldMax = parseFloat(data.rentalYieldMax);
        if (data.capitalAppreciation !== undefined && data.capitalAppreciation !== '' && data.capitalAppreciation !== null)
            updateData.capitalAppreciation = parseFloat(data.capitalAppreciation);
        if (data.capitalAppreciationMin !== undefined && data.capitalAppreciationMin !== '' && data.capitalAppreciationMin !== null)
            updateData.capitalAppreciationMin = parseFloat(data.capitalAppreciationMin);
        if (data.capitalAppreciationMax !== undefined && data.capitalAppreciationMax !== '' && data.capitalAppreciationMax !== null)
            updateData.capitalAppreciationMax = parseFloat(data.capitalAppreciationMax);
        if (data.totalReturns !== undefined)
            updateData.totalReturns = data.totalReturns;
        if (data.totalReturnsMin !== undefined && data.totalReturnsMin !== '' && data.totalReturnsMin !== null)
            updateData.totalReturnsMin = parseFloat(data.totalReturnsMin);
        if (data.totalReturnsMax !== undefined && data.totalReturnsMax !== '' && data.totalReturnsMax !== null)
            updateData.totalReturnsMax = parseFloat(data.totalReturnsMax);
        if (data.riskLevel !== undefined)
            updateData.riskLevel = data.riskLevel;
        if (data.riskFactors !== undefined)
            updateData.riskFactors = data.riskFactors;
        if (data.constructionStage !== undefined)
            updateData.constructionStage = data.constructionStage;
        if (data.constructionProgress !== undefined)
            updateData.constructionStage = data.constructionProgress;
        if (data.offPlanSecurity !== undefined)
            updateData.offPlanSecurity = data.offPlanSecurity;
        if (data.exitLiquidity !== undefined)
            updateData.exitLiquidity = data.exitLiquidity;
        if (data.managementMode !== undefined)
            updateData.managementMode = data.managementMode;
        if (data.virtualTours !== undefined && data.virtualTours !== '' && data.virtualTours !== null)
            updateData.virtualTours = parseInt(data.virtualTours);
        await this.prisma.asset.update({
            where: { id },
            data: updateData,
        });
        const changedFields = Object.keys(updateData);
        if (changedFields.length) {
            await this.notificationService.notifyAssetUpdated(existingAsset.id, changedFields);
        }
        return this.findById(id);
    }
    async delete(id) {
        await this.findById(id);
        const savedByCount = await this.prisma.savedProperty.count({ where: { assetId: id } });
        if (savedByCount > 0) {
            throw new common_1.BadRequestException(`Cannot delete asset. It is saved by ${savedByCount} user(s). Please ask them to unsave it first.`);
        }
        const leadsCount = await this.prisma.lead.count({ where: { assetInterest: id } });
        if (leadsCount > 0) {
            throw new common_1.BadRequestException(`Cannot delete asset. It has ${leadsCount} associated lead(s).`);
        }
        const transactionsCount = await this.prisma.transaction.count({ where: { assetId: id } });
        if (transactionsCount > 0) {
            throw new common_1.BadRequestException(`Cannot delete asset. It has ${transactionsCount} associated transaction(s).`);
        }
        await this.prisma.asset.delete({ where: { id } });
        return { message: 'Asset deleted successfully', id };
    }
    async importFromUrbco(dto) {
        const existing = await this.prisma.asset.findFirst({
            where: { urbcoPropertyId: dto.urbcoPropertyId },
        });
        if (existing) {
            return existing;
        }
        const serialId = await (0, serial_id_helper_1.generateSerialId)(this.prisma, 'AST');
        const asset = await this.prisma.asset.create({
            data: {
                serialId,
                name: dto.name,
                title: dto.name,
                referenceCode: dto.urbcoRef || null,
                urbcoPropertyId: dto.urbcoPropertyId,
                urbcoRef: dto.urbcoRef || null,
                status: 'draft',
                description: dto.description || null,
                address: dto.address || null,
                location: dto.location || null,
                constructionStage: dto.constructionStage || null,
                totalUnits: dto.totalUnits ?? null,
                units: dto.totalUnits ?? null,
                availableUnits: dto.availableUnits ?? null,
                fractionTotal: dto.fractionTotal ?? null,
                price: dto.price || null,
                fractionCost: dto.fractionCost || null,
                rentalYieldMax: dto.rentalYieldMax ?? null,
                capitalAppreciation: dto.capitalAppreciation ?? null,
                firstPayoutDate: dto.firstPayoutDate ? new Date(dto.firstPayoutDate) : null,
                constructionStart: dto.constructionStart ? new Date(dto.constructionStart) : null,
                constructionEnd: dto.constructionEnd ? new Date(dto.constructionEnd) : null,
                bedrooms: dto.bedrooms ?? null,
                bathrooms: dto.bathrooms ?? null,
                area: dto.area ?? null,
                ...(dto.companyId ? { company: { connect: { id: dto.companyId } } } : {}),
            },
        });
        return asset;
    }
    async addImage(assetId, imageData) {
        await this.findById(assetId);
        return this.prisma.assetImage.create({
            data: {
                assetId,
                url: imageData.url,
                caption: imageData.caption || null,
                order: imageData.order || 0,
            },
        });
    }
    async removeImage(imageId) {
        return this.prisma.assetImage.delete({ where: { id: imageId } });
    }
    async addDocument(assetId, docData) {
        await this.findById(assetId);
        return this.prisma.assetDocument.create({
            data: {
                assetId,
                url: docData.url,
                title: docData.title || null,
                type: docData.type || null,
            },
        });
    }
    async removeDocument(docId) {
        return this.prisma.assetDocument.delete({ where: { id: docId } });
    }
    async uploadImages(assetId, files) {
        await this.findById(assetId);
        const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
        const images = [];
        for (const file of files) {
            const url = `${baseUrl}/uploads/images/${file.filename}`;
            const image = await this.prisma.assetImage.create({
                data: {
                    assetId,
                    url,
                    caption: file.originalname,
                    order: 0,
                },
            });
            images.push(image);
        }
        return {
            message: `${images.length} image(s) uploaded successfully`,
            images,
        };
    }
    async uploadDocuments(assetId, files) {
        await this.findById(assetId);
        const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
        const documents = [];
        for (const file of files) {
            const url = `${baseUrl}/uploads/documents/${file.filename}`;
            const document = await this.prisma.assetDocument.create({
                data: {
                    assetId,
                    url,
                    title: file.originalname,
                    type: file.mimetype,
                },
            });
            documents.push(document);
        }
        return {
            message: `${documents.length} document(s) uploaded successfully`,
            documents,
        };
    }
};
exports.AssetsService = AssetsService;
exports.AssetsService = AssetsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object, typeof (_b = typeof notification_service_1.NotificationService !== "undefined" && notification_service_1.NotificationService) === "function" ? _b : Object])
], AssetsService);


/***/ }),
/* 52 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.documentFileFilter = exports.imageFileFilter = exports.multerConfig = void 0;
const multer_1 = __webpack_require__(50);
const path_1 = __webpack_require__(5);
const common_1 = __webpack_require__(3);
exports.multerConfig = {
    storage: (0, multer_1.diskStorage)({
        destination: './uploads',
        filename: (req, file, callback) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
            const ext = (0, path_1.extname)(file.originalname);
            const filename = `${file.fieldname}-${uniqueSuffix}${ext}`;
            callback(null, filename);
        },
    }),
    fileFilter: (req, file, callback) => {
        const allowedMimes = [
            'image/jpeg',
            'image/jpg',
            'image/png',
            'image/gif',
            'image/webp',
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'text/plain',
        ];
        if (allowedMimes.includes(file.mimetype)) {
            callback(null, true);
        }
        else {
            callback(new common_1.BadRequestException(`Invalid file type. Allowed types: ${allowedMimes.join(', ')}`), false);
        }
    },
    limits: {
        fileSize: 10 * 1024 * 1024,
    },
};
const imageFileFilter = (req, file, callback) => {
    const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedMimes.includes(file.mimetype)) {
        callback(null, true);
    }
    else {
        callback(new common_1.BadRequestException('Only image files are allowed (jpg, jpeg, png, gif, webp)'), false);
    }
};
exports.imageFileFilter = imageFileFilter;
const documentFileFilter = (req, file, callback) => {
    const allowedMimes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain',
    ];
    if (allowedMimes.includes(file.mimetype)) {
        callback(null, true);
    }
    else {
        callback(new common_1.BadRequestException('Only document files are allowed (pdf, doc, docx, txt)'), false);
    }
};
exports.documentFileFilter = documentFileFilter;


/***/ }),
/* 53 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PublicController = void 0;
const common_1 = __webpack_require__(3);
const assets_service_1 = __webpack_require__(51);
const prisma_service_1 = __webpack_require__(14);
let PublicController = class PublicController {
    constructor(assetsService, prisma) {
        this.assetsService = assetsService;
        this.prisma = prisma;
    }
    async getPublishedAssets(take) {
        const all = await this.assetsService.findAll({ status: 'published' });
        const limit = take ? Math.min(parseInt(take, 10), 50) : 50;
        const items = all.slice(0, limit);
        return items.map((a) => ({
            id: a.id,
            name: a.name,
            title: a.title ?? a.name,
            location: a.location ?? '',
            address: a.address ?? '',
            type: a.type ?? '',
            constructionStage: a.constructionStage ?? a.projectStatus ?? '',
            price: a.price ?? a.fractionCost ?? null,
            finalPrice: a.finalPrice,
            fractionCost: a.fractionCost ?? null,
            fractionTotal: a.fractionTotal ?? null,
            availableUnits: a.availableUnits ?? null,
            totalUnits: a.totalUnits ?? null,
            rentalYield: a.rentalYield ?? null,
            rentalYieldMin: a.rentalYieldMin ?? null,
            rentalYieldMax: a.rentalYieldMax ?? null,
            capitalAppreciation: a.capitalAppreciation ?? null,
            totalAnnualReturn: a.totalAnnualReturn,
            images: a.images.map((img) => ({
                id: img.id,
                url: img.url,
                caption: img.caption ?? null,
            })),
        }));
    }
    async getPublicStats() {
        return this.assetsService.getPublicStats();
    }
    async joinWaitlist(body) {
        if (!body.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
            throw new common_1.BadRequestException('A valid email address is required');
        }
        const email = body.email.toLowerCase().trim();
        const existing = await this.prisma.lead.findUnique({ where: { email } });
        if (existing)
            return { success: true, message: "You're already on the list!" };
        const name = body.name?.trim() || email.split('@')[0];
        const notes = body.persona ? `Website waitlist — persona: ${body.persona}` : 'Website waitlist';
        await this.prisma.lead.create({
            data: {
                name,
                email,
                source: 'website-waitlist',
                leadSource: 'website-waitlist',
                notes,
                status: 'pending',
            },
        });
        return { success: true, message: "You're on the list!" };
    }
    async importFromUrbco(apiKey, body) {
        const expectedKey = process.env.URBCO_API_KEY;
        if (!expectedKey || apiKey !== expectedKey) {
            throw new common_1.ForbiddenException('Invalid or missing API key');
        }
        if (!body.urbcoPropertyId) {
            throw new common_1.BadRequestException('urbcoPropertyId is required');
        }
        if (!body.name) {
            throw new common_1.BadRequestException('name is required');
        }
        const asset = await this.assetsService.importFromUrbco(body);
        return { success: true, assetId: asset.id };
    }
};
exports.PublicController = PublicController;
__decorate([
    (0, common_1.Get)('assets'),
    __param(0, (0, common_1.Query)('take')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PublicController.prototype, "getPublishedAssets", null);
__decorate([
    (0, common_1.Get)('stats'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PublicController.prototype, "getPublicStats", null);
__decorate([
    (0, common_1.Post)('waitlist'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PublicController.prototype, "joinWaitlist", null);
__decorate([
    (0, common_1.Post)('import-from-urbco'),
    __param(0, (0, common_1.Headers)('x-urbco-api-key')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PublicController.prototype, "importFromUrbco", null);
exports.PublicController = PublicController = __decorate([
    (0, common_1.Controller)('public'),
    __metadata("design:paramtypes", [typeof (_a = typeof assets_service_1.AssetsService !== "undefined" && assets_service_1.AssetsService) === "function" ? _a : Object, typeof (_b = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _b : Object])
], PublicController);


/***/ }),
/* 54 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CompaniesModule = void 0;
const common_1 = __webpack_require__(3);
const companies_controller_1 = __webpack_require__(55);
const companies_service_1 = __webpack_require__(56);
const prisma_module_1 = __webpack_require__(37);
let CompaniesModule = class CompaniesModule {
};
exports.CompaniesModule = CompaniesModule;
exports.CompaniesModule = CompaniesModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        controllers: [companies_controller_1.CompaniesController],
        providers: [companies_service_1.CompaniesService],
        exports: [companies_service_1.CompaniesService],
    })
], CompaniesModule);


/***/ }),
/* 55 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CompaniesController = void 0;
const common_1 = __webpack_require__(3);
const companies_service_1 = __webpack_require__(56);
const jwt_auth_guard_1 = __webpack_require__(32);
const roles_guard_1 = __webpack_require__(45);
const create_company_dto_1 = __webpack_require__(57);
let CompaniesController = class CompaniesController {
    constructor(companiesService) {
        this.companiesService = companiesService;
    }
    async findAll() {
        return this.companiesService.findAll();
    }
    async findOne(id) {
        return this.companiesService.findById(id);
    }
    async create(dto) {
        return this.companiesService.create(dto);
    }
    async update(id, dto) {
        return this.companiesService.update(id, dto);
    }
    async remove(id) {
        return this.companiesService.delete(id);
    }
};
exports.CompaniesController = CompaniesController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CompaniesController.prototype, "findAll", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CompaniesController.prototype, "findOne", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof create_company_dto_1.CreateCompanyDto !== "undefined" && create_company_dto_1.CreateCompanyDto) === "function" ? _b : Object]),
    __metadata("design:returntype", Promise)
], CompaniesController.prototype, "create", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Put)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_c = typeof Partial !== "undefined" && Partial) === "function" ? _c : Object]),
    __metadata("design:returntype", Promise)
], CompaniesController.prototype, "update", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Delete)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CompaniesController.prototype, "remove", null);
exports.CompaniesController = CompaniesController = __decorate([
    (0, common_1.Controller)("companies"),
    __metadata("design:paramtypes", [typeof (_a = typeof companies_service_1.CompaniesService !== "undefined" && companies_service_1.CompaniesService) === "function" ? _a : Object])
], CompaniesController);


/***/ }),
/* 56 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CompaniesService = void 0;
const common_1 = __webpack_require__(3);
const prisma_service_1 = __webpack_require__(14);
const serial_id_helper_1 = __webpack_require__(30);
let CompaniesService = class CompaniesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    normalizeStatus(status) {
        const normalized = String(status || 'active').trim().toLowerCase();
        if (!['active', 'pending', 'inactive', 'suspended'].includes(normalized)) {
            throw new common_1.BadRequestException('Status must be one of: active, pending, inactive, suspended');
        }
        return normalized;
    }
    normalizeEmail(email) {
        return email.toLowerCase().trim();
    }
    async enrichCompanyData(company) {
        let activeAssets;
        if (company.assets && Array.isArray(company.assets)) {
            activeAssets = company.assets.filter((asset) => ['available', 'active', 'published'].includes(String(asset.status || '').toLowerCase())).length;
        }
        else {
            const assets = await this.prisma.asset.findMany({
                where: { companyId: company.id },
                select: { status: true }
            });
            activeAssets = assets.filter(asset => ['available', 'active', 'published'].includes(String(asset.status || '').toLowerCase())).length;
        }
        const totalTransactions = company._count?.transactions ||
            await this.prisma.transaction.count({ where: { companyId: company.id } });
        return {
            ...company,
            activeAssets,
            totalTransactions
        };
    }
    async findAll() {
        const companies = await this.prisma.company.findMany({
            include: {
                assets: { select: { id: true, name: true, type: true, status: true } },
                _count: { select: { assets: true, transactions: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
        return companies.map(company => ({
            ...company,
            activeAssets: company.assets.filter(asset => ['available', 'active', 'published'].includes(String(asset.status || '').toLowerCase())).length,
            totalTransactions: company._count.transactions,
        }));
    }
    async findById(id) {
        if (!id || id.trim() === '')
            throw new common_1.BadRequestException('Company ID is required');
        const company = await this.prisma.company.findUnique({
            where: { id },
            include: {
                assets: { select: { id: true, name: true, type: true, status: true } },
                transactions: { select: { id: true, totalAmount: true, status: true, date: true }, take: 10, orderBy: { date: 'desc' } },
                _count: { select: { assets: true, transactions: true } },
            },
        });
        if (!company)
            throw new common_1.NotFoundException(`Company with ID ${id} not found`);
        return this.enrichCompanyData(company);
    }
    async create(data) {
        try {
            if (!data.name || !data.name.trim())
                throw new common_1.BadRequestException('Company name is required');
            if (!data.email || !data.email.trim())
                throw new common_1.BadRequestException('Email is required');
            if (!data.type || !['developer', 'realtor', 'partner', 'consultant', 'investor'].includes(data.type)) {
                throw new common_1.BadRequestException('Company type is required and must be one of: developer, realtor, partner, consultant, investor');
            }
            const existingByName = await this.prisma.company.findFirst({ where: { name: { equals: data.name.trim(), mode: 'insensitive' } } });
            if (existingByName)
                throw new common_1.ConflictException('A company with this name already exists');
            const existing = await this.prisma.company.findFirst({ where: { email: this.normalizeEmail(data.email) } });
            if (existing)
                throw new common_1.ConflictException('A company with this email already exists');
            if (data.phone?.trim()) {
                const existingByPhone = await this.prisma.company.findFirst({ where: { phone: data.phone.trim() } });
                if (existingByPhone)
                    throw new common_1.ConflictException('A company with this phone number already exists');
            }
            if (data.registrationNumber?.trim()) {
                const existingByRegNo = await this.prisma.company.findFirst({ where: { registrationNumber: data.registrationNumber.trim() } });
                if (existingByRegNo)
                    throw new common_1.ConflictException('A company with this registration number already exists');
            }
            const serialId = await (0, serial_id_helper_1.generateSerialId)(this.prisma, 'CMP');
            const company = await this.prisma.company.create({
                data: {
                    serialId,
                    name: data.name.trim(),
                    type: data.type,
                    email: this.normalizeEmail(data.email),
                    phone: data.phone?.trim() || null,
                    status: this.normalizeStatus(data.status),
                    contactPerson: data.contactPerson?.trim() || null,
                    address: data.address?.trim() || null,
                    commissionRate: data.commissionRate ? parseFloat(data.commissionRate) : 0,
                    paymentTerms: data.paymentTerms?.trim() || null,
                    agreementStartDate: data.agreementStartDate ? new Date(data.agreementStartDate) : null,
                    agreementExpiryDate: data.agreementExpiryDate ? new Date(data.agreementExpiryDate) : null,
                    registrationNumber: data.registrationNumber?.trim() || null,
                    notes: data.notes?.trim() || null,
                    accountName: (data.accountName || data.bankAccountName)?.trim() || null,
                    bankName: data.bankName?.trim() || null,
                    accountNumber: data.accountNumber?.trim() || null,
                },
                include: {
                    assets: { select: { id: true, name: true, type: true, status: true } },
                    _count: { select: { assets: true, transactions: true } }
                },
            });
            return this.enrichCompanyData(company);
        }
        catch (error) {
            if (error.code === 'P2002') {
                const rawField = error.meta?.target?.[0] || '';
                const fieldLabels = {
                    name: 'company name',
                    email: 'email address',
                    phone: 'phone number',
                    registrationNumber: 'registration number',
                    serialId: 'serial ID',
                };
                const label = fieldLabels[rawField] || rawField || 'a unique field';
                throw new common_1.ConflictException(`A company with this ${label} already exists`);
            }
            if (error instanceof common_1.BadRequestException || error instanceof common_1.ConflictException)
                throw error;
            console.error('Company creation error:', error);
            throw new common_1.InternalServerErrorException('Failed to create company');
        }
    }
    async update(id, data) {
        try {
            if (!id || id.trim() === '')
                throw new common_1.BadRequestException('Company ID is required');
            const exists = await this.prisma.company.findUnique({ where: { id }, select: { id: true } });
            if (!exists)
                throw new common_1.NotFoundException(`Company with ID ${id} not found`);
            if (data.name !== undefined && data.name.trim()) {
                const dupName = await this.prisma.company.findFirst({ where: { name: { equals: data.name.trim(), mode: 'insensitive' }, NOT: { id } } });
                if (dupName)
                    throw new common_1.ConflictException('A company with this name already exists');
            }
            if (data.email !== undefined && data.email.trim()) {
                const dupEmail = await this.prisma.company.findFirst({ where: { email: this.normalizeEmail(data.email), NOT: { id } } });
                if (dupEmail)
                    throw new common_1.ConflictException('A company with this email address already exists');
            }
            if (data.phone !== undefined && data.phone.trim()) {
                const dupPhone = await this.prisma.company.findFirst({ where: { phone: data.phone.trim(), NOT: { id } } });
                if (dupPhone)
                    throw new common_1.ConflictException('A company with this phone number already exists');
            }
            if (data.registrationNumber !== undefined && data.registrationNumber.trim()) {
                const dupRegNo = await this.prisma.company.findFirst({ where: { registrationNumber: data.registrationNumber.trim(), NOT: { id } } });
                if (dupRegNo)
                    throw new common_1.ConflictException('A company with this registration number already exists');
            }
            const updateData = {};
            if (data.name !== undefined)
                updateData.name = data.name.trim();
            if (data.type !== undefined)
                updateData.type = data.type;
            if (data.email !== undefined)
                updateData.email = this.normalizeEmail(data.email);
            if (data.phone !== undefined)
                updateData.phone = data.phone?.trim();
            if (data.status !== undefined)
                updateData.status = this.normalizeStatus(data.status);
            if (data.contactPerson !== undefined)
                updateData.contactPerson = data.contactPerson?.trim();
            if (data.address !== undefined)
                updateData.address = data.address?.trim();
            if (data.commissionRate !== undefined)
                updateData.commissionRate = parseFloat(data.commissionRate);
            if (data.paymentTerms !== undefined)
                updateData.paymentTerms = data.paymentTerms?.trim();
            if (data.agreementStartDate !== undefined)
                updateData.agreementStartDate = data.agreementStartDate ? new Date(data.agreementStartDate) : null;
            if (data.agreementExpiryDate !== undefined)
                updateData.agreementExpiryDate = data.agreementExpiryDate ? new Date(data.agreementExpiryDate) : null;
            if (data.registrationNumber !== undefined)
                updateData.registrationNumber = data.registrationNumber?.trim();
            if (data.notes !== undefined)
                updateData.notes = data.notes?.trim();
            if (data.accountName !== undefined || data.bankAccountName !== undefined) {
                updateData.accountName = (data.accountName || data.bankAccountName)?.trim() || null;
            }
            if (data.bankName !== undefined)
                updateData.bankName = data.bankName?.trim();
            if (data.accountNumber !== undefined)
                updateData.accountNumber = data.accountNumber?.trim();
            const company = await this.prisma.company.update({
                where: { id },
                data: updateData,
                include: {
                    assets: { select: { id: true, name: true, type: true, status: true } },
                    _count: { select: { assets: true, transactions: true } }
                },
            });
            return this.enrichCompanyData(company);
        }
        catch (error) {
            if (error.code === 'P2002') {
                const rawField = error.meta?.target?.[0] || '';
                const fieldLabels = {
                    name: 'company name',
                    email: 'email address',
                    phone: 'phone number',
                    registrationNumber: 'registration number',
                    serialId: 'serial ID',
                };
                const label = fieldLabels[rawField] || rawField || 'a unique field';
                throw new common_1.ConflictException(`A company with this ${label} already exists`);
            }
            if (error instanceof common_1.BadRequestException || error instanceof common_1.ConflictException || error instanceof common_1.NotFoundException)
                throw error;
            console.error('Company update error:', error);
            throw new common_1.InternalServerErrorException('Failed to update company');
        }
    }
    async delete(id) {
        if (!id || id.trim() === '')
            throw new common_1.BadRequestException('Company ID is required');
        const exists = await this.prisma.company.findUnique({ where: { id }, select: { id: true } });
        if (!exists)
            throw new common_1.NotFoundException(`Company with ID ${id} not found`);
        const activeAssets = await this.prisma.asset.count({ where: { companyId: id, status: 'published' } });
        if (activeAssets > 0)
            throw new common_1.BadRequestException(`Cannot delete company with ${activeAssets} active assets.`);
        const txCount = await this.prisma.transaction.count({ where: { companyId: id } });
        if (txCount > 0)
            throw new common_1.BadRequestException(`Cannot delete company with ${txCount} transactions.`);
        await this.prisma.company.delete({ where: { id } });
        return { message: 'Company deleted successfully', id };
    }
};
exports.CompaniesService = CompaniesService;
exports.CompaniesService = CompaniesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], CompaniesService);


/***/ }),
/* 57 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FilterCompaniesDto = exports.UpdateCompanyDto = exports.CreateCompanyDto = exports.CompanyStatusEnum = exports.CompanyTypeEnum = void 0;
const class_validator_1 = __webpack_require__(33);
const class_transformer_1 = __webpack_require__(34);
var CompanyTypeEnum;
(function (CompanyTypeEnum) {
    CompanyTypeEnum["DEVELOPER"] = "developer";
    CompanyTypeEnum["REALTOR"] = "realtor";
    CompanyTypeEnum["PARTNER"] = "partner";
    CompanyTypeEnum["CONSULTANT"] = "consultant";
    CompanyTypeEnum["INVESTOR"] = "investor";
})(CompanyTypeEnum || (exports.CompanyTypeEnum = CompanyTypeEnum = {}));
var CompanyStatusEnum;
(function (CompanyStatusEnum) {
    CompanyStatusEnum["ACTIVE"] = "active";
    CompanyStatusEnum["PENDING"] = "pending";
    CompanyStatusEnum["INACTIVE"] = "inactive";
    CompanyStatusEnum["SUSPENDED"] = "suspended";
})(CompanyStatusEnum || (exports.CompanyStatusEnum = CompanyStatusEnum = {}));
class CreateCompanyDto {
}
exports.CreateCompanyDto = CreateCompanyDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Company name is required' }),
    (0, class_validator_1.MinLength)(2, { message: 'Company name must be at least 2 characters' }),
    (0, class_validator_1.MaxLength)(200, { message: 'Company name must not exceed 200 characters' }),
    __metadata("design:type", String)
], CreateCompanyDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(CompanyTypeEnum, {
        message: 'Company type must be one of: developer, realtor, partner, consultant, investor'
    }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Company type is required' }),
    __metadata("design:type", String)
], CreateCompanyDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(50, { message: 'Registration number must not exceed 50 characters' }),
    __metadata("design:type", String)
], CreateCompanyDto.prototype, "registrationNumber", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(CompanyStatusEnum, {
        message: 'Status must be one of: active, inactive, suspended'
    }),
    __metadata("design:type", String)
], CreateCompanyDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Contact person name is required' }),
    (0, class_validator_1.MinLength)(2, { message: 'Contact person name must be at least 2 characters' }),
    (0, class_validator_1.MaxLength)(100, { message: 'Contact person name must not exceed 100 characters' }),
    __metadata("design:type", String)
], CreateCompanyDto.prototype, "contactPerson", void 0);
__decorate([
    (0, class_transformer_1.Transform)(({ value }) => value?.trim().toLowerCase()),
    (0, class_validator_1.IsEmail)({}, { message: 'Please provide a valid email address' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Email is required' }),
    __metadata("design:type", String)
], CreateCompanyDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Phone number is required' }),
    (0, class_validator_1.Matches)(/^[+]?[\d\s()-]+$/, {
        message: 'Please provide a valid phone number (digits, spaces, +, -, () allowed)'
    }),
    (0, class_validator_1.MinLength)(10, { message: 'Phone number must be at least 10 characters' }),
    (0, class_validator_1.MaxLength)(20, { message: 'Phone number must not exceed 20 characters' }),
    __metadata("design:type", String)
], CreateCompanyDto.prototype, "phone", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500, { message: 'Address must not exceed 500 characters' }),
    __metadata("design:type", String)
], CreateCompanyDto.prototype, "address", void 0);
__decorate([
    (0, class_validator_1.IsDateString)({}, { message: 'Agreement start date must be a valid date (YYYY-MM-DD)' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Agreement start date is required' }),
    __metadata("design:type", String)
], CreateCompanyDto.prototype, "agreementStartDate", void 0);
__decorate([
    (0, class_validator_1.IsDateString)({}, { message: 'Agreement expiry date must be a valid date (YYYY-MM-DD)' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Agreement expiry date is required' }),
    __metadata("design:type", String)
], CreateCompanyDto.prototype, "agreementExpiryDate", void 0);
__decorate([
    (0, class_validator_1.IsNumber)({}, { message: 'Commission rate must be a number' }),
    (0, class_validator_1.Min)(0, { message: 'Commission rate cannot be negative' }),
    (0, class_validator_1.Max)(100, { message: 'Commission rate cannot exceed 100' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Commission rate is required' }),
    __metadata("design:type", Number)
], CreateCompanyDto.prototype, "commissionRate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500, { message: 'Payment terms must not exceed 500 characters' }),
    __metadata("design:type", String)
], CreateCompanyDto.prototype, "paymentTerms", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100, { message: 'Account name must not exceed 100 characters' }),
    __metadata("design:type", String)
], CreateCompanyDto.prototype, "accountName", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100, { message: 'Bank name must not exceed 100 characters' }),
    __metadata("design:type", String)
], CreateCompanyDto.prototype, "bankName", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Matches)(/^[\d]+$/, { message: 'Account number must contain only digits' }),
    (0, class_validator_1.MinLength)(10, { message: 'Account number must be at least 10 digits' }),
    (0, class_validator_1.MaxLength)(20, { message: 'Account number must not exceed 20 digits' }),
    __metadata("design:type", String)
], CreateCompanyDto.prototype, "accountNumber", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(1000, { message: 'Notes must not exceed 1000 characters' }),
    __metadata("design:type", String)
], CreateCompanyDto.prototype, "notes", void 0);
class UpdateCompanyDto {
}
exports.UpdateCompanyDto = UpdateCompanyDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    (0, class_validator_1.MaxLength)(200),
    __metadata("design:type", String)
], UpdateCompanyDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(CompanyTypeEnum, {
        message: 'Company type must be one of: developer, realtor, partner, consultant, investor'
    }),
    __metadata("design:type", String)
], UpdateCompanyDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], UpdateCompanyDto.prototype, "registrationNumber", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(CompanyStatusEnum, {
        message: 'Status must be one of: active, inactive, suspended'
    }),
    __metadata("design:type", String)
], UpdateCompanyDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], UpdateCompanyDto.prototype, "contactPerson", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => value?.trim().toLowerCase()),
    (0, class_validator_1.IsEmail)({}, { message: 'Please provide a valid email address' }),
    __metadata("design:type", String)
], UpdateCompanyDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Matches)(/^[+]?[\d\s()-]+$/, { message: 'Please provide a valid phone number' }),
    (0, class_validator_1.MinLength)(10),
    (0, class_validator_1.MaxLength)(20),
    __metadata("design:type", String)
], UpdateCompanyDto.prototype, "phone", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], UpdateCompanyDto.prototype, "address", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], UpdateCompanyDto.prototype, "agreementStartDate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], UpdateCompanyDto.prototype, "agreementExpiryDate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], UpdateCompanyDto.prototype, "commissionRate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], UpdateCompanyDto.prototype, "paymentTerms", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], UpdateCompanyDto.prototype, "accountName", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], UpdateCompanyDto.prototype, "bankName", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Matches)(/^[\d]+$/),
    (0, class_validator_1.MinLength)(10),
    (0, class_validator_1.MaxLength)(20),
    __metadata("design:type", String)
], UpdateCompanyDto.prototype, "accountNumber", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(1000),
    __metadata("design:type", String)
], UpdateCompanyDto.prototype, "notes", void 0);
class FilterCompaniesDto {
}
exports.FilterCompaniesDto = FilterCompaniesDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(CompanyTypeEnum),
    __metadata("design:type", String)
], FilterCompaniesDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(CompanyStatusEnum),
    __metadata("design:type", String)
], FilterCompaniesDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FilterCompaniesDto.prototype, "search", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FilterCompaniesDto.prototype, "sortBy", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsIn)(['asc', 'desc']),
    __metadata("design:type", String)
], FilterCompaniesDto.prototype, "sortOrder", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], FilterCompaniesDto.prototype, "page", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], FilterCompaniesDto.prototype, "limit", void 0);


/***/ }),
/* 58 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AgentsModule = void 0;
const common_1 = __webpack_require__(3);
const agents_controller_1 = __webpack_require__(59);
const agents_service_1 = __webpack_require__(60);
const prisma_module_1 = __webpack_require__(37);
let AgentsModule = class AgentsModule {
};
exports.AgentsModule = AgentsModule;
exports.AgentsModule = AgentsModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        controllers: [agents_controller_1.AgentsController],
        providers: [agents_service_1.AgentsService],
        exports: [agents_service_1.AgentsService],
    })
], AgentsModule);


/***/ }),
/* 59 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AgentsController = void 0;
const common_1 = __webpack_require__(3);
const agents_service_1 = __webpack_require__(60);
const class_validator_1 = __webpack_require__(33);
class CreateAgentDto {
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAgentDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], CreateAgentDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAgentDto.prototype, "phone", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAgentDto.prototype, "cluster", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAgentDto.prototype, "role", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAgentDto.prototype, "status", void 0);
let AgentsController = class AgentsController {
    constructor(agentsService) {
        this.agentsService = agentsService;
    }
    async findAll() {
        return this.agentsService.findAll();
    }
    async getStats() {
        return this.agentsService.getStats();
    }
    async findOne(id) {
        return this.agentsService.findById(id);
    }
    async create(dto) {
        return this.agentsService.create(dto);
    }
    async update(id, dto) {
        return this.agentsService.update(id, dto);
    }
    async remove(id) {
        return this.agentsService.delete(id);
    }
};
exports.AgentsController = AgentsController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AgentsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)("stats"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AgentsController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AgentsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AgentsController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_b = typeof Partial !== "undefined" && Partial) === "function" ? _b : Object]),
    __metadata("design:returntype", Promise)
], AgentsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AgentsController.prototype, "remove", null);
exports.AgentsController = AgentsController = __decorate([
    (0, common_1.Controller)("agents"),
    __metadata("design:paramtypes", [typeof (_a = typeof agents_service_1.AgentsService !== "undefined" && agents_service_1.AgentsService) === "function" ? _a : Object])
], AgentsController);


/***/ }),
/* 60 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AgentsService = void 0;
const common_1 = __webpack_require__(3);
const prisma_service_1 = __webpack_require__(14);
const bcrypt = __importStar(__webpack_require__(27));
const client_1 = __webpack_require__(15);
const serial_id_helper_1 = __webpack_require__(30);
let AgentsService = class AgentsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll() {
        const agents = await this.prisma.agent.findMany({
            include: {
                user: { select: { id: true, email: true, name: true, phone: true, role: true } },
                cluster: { select: { id: true, name: true } },
                _count: { select: { leadTransactions: true } },
            },
            orderBy: { status: 'asc' },
        });
        return agents.map(agent => ({
            id: agent.id,
            serialId: agent.serialId ?? "",
            name: agent.user?.name ?? "",
            email: agent.user?.email ?? "",
            phone: agent.user?.phone ?? "",
            cluster: agent.cluster?.name ?? "",
            clusterId: agent.cluster?.id ?? "",
            role: agent.user?.role ?? "AGENT",
            status: agent.status?.toLowerCase() ?? "pending",
            activeDeals: agent._count.leadTransactions,
            closedDeals: agent.closedDeals,
            totalCommission: agent.totalCommission,
            performance: agent.closedDeals > 0 ? Math.min(100, Math.round((agent.closedDeals / 10) * 100)) : 0,
        }));
    }
    async findById(id) {
        const agent = await this.prisma.agent.findUnique({
            where: { id },
            include: {
                user: { select: { id: true, email: true, name: true } },
                cluster: true,
                assignedLeads: { orderBy: { createdAt: 'desc' }, take: 10 },
                leadTransactions: { orderBy: { date: 'desc' }, take: 10 },
                closerTransactions: { orderBy: { date: 'desc' }, take: 10 },
                commissions: { orderBy: { createdAt: 'desc' }, take: 10 },
            },
        });
        if (!agent)
            throw new common_1.NotFoundException(`Agent with ID ${id} not found`);
        return agent;
    }
    async create(data) {
        if (!data.name)
            throw new common_1.BadRequestException('Name is required');
        if (!data.email)
            throw new common_1.BadRequestException('Email is required');
        let user = await this.prisma.user.findUnique({ where: { email: data.email } });
        if (user) {
            const existing = await this.prisma.agent.findUnique({ where: { userId: user.id } });
            if (existing)
                throw new common_1.ConflictException('User is already registered as an agent');
            await this.prisma.user.update({
                where: { id: user.id },
                data: {
                    name: data.name,
                    phone: data.phone,
                    role: (data.role ? client_1.UserRole[data.role.toUpperCase()] : client_1.UserRole.AGENT),
                },
            });
        }
        else {
            const hashedPassword = await bcrypt.hash('password123', 10);
            const userSerialId = await (0, serial_id_helper_1.generateSerialId)(this.prisma, 'USR');
            user = await this.prisma.user.create({
                data: {
                    serialId: userSerialId,
                    email: data.email,
                    password: hashedPassword,
                    name: data.name,
                    phone: data.phone,
                    role: (data.role ? client_1.UserRole[data.role.toUpperCase()] : client_1.UserRole.AGENT),
                },
            });
        }
        const agentSerialId = await (0, serial_id_helper_1.generateSerialId)(this.prisma, 'AGT');
        return this.prisma.agent.create({
            data: {
                serialId: agentSerialId,
                userId: user.id,
                clusterId: data.cluster || null,
                status: data.status ? data.status.toUpperCase() : 'PENDING',
                closedDeals: 0,
                totalCommission: 0,
            },
            include: {
                user: { select: { id: true, email: true, name: true, phone: true, role: true } },
                cluster: { select: { id: true, name: true } },
            },
        });
    }
    async update(id, data) {
        const agent = await this.findById(id);
        if (data.name || data.email || data.phone || data.role) {
            await this.prisma.user.update({
                where: { id: agent.userId },
                data: {
                    ...(data.name ? { name: data.name } : {}),
                    ...(data.email ? { email: data.email } : {}),
                    ...(data.phone ? { phone: data.phone } : {}),
                    ...(data.role ? { role: data.role.toUpperCase() } : {}),
                },
            });
        }
        const updateData = {};
        if (data.cluster !== undefined)
            updateData.clusterId = data.cluster;
        if (data.status !== undefined)
            updateData.status = data.status.toUpperCase();
        return this.prisma.agent.update({
            where: { id },
            data: updateData,
            include: {
                user: { select: { id: true, email: true, name: true, phone: true, role: true } },
                cluster: { select: { id: true, name: true } },
            },
        });
    }
    async delete(id) {
        await this.findById(id);
        await this.prisma.agent.delete({ where: { id } });
        return { message: 'Agent deleted successfully', id };
    }
    async getStats() {
        const [total, active, pending] = await Promise.all([
            this.prisma.agent.count(),
            this.prisma.agent.count({ where: { status: 'ACTIVE' } }),
            this.prisma.agent.count({ where: { status: 'PENDING' } }),
        ]);
        const commissionAgg = await this.prisma.agent.aggregate({ _sum: { totalCommission: true, closedDeals: true } });
        return {
            totalAgents: total,
            activeAgents: active,
            pendingAgents: pending,
            totalClosedDeals: commissionAgg._sum.closedDeals || 0,
            totalCommission: commissionAgg._sum.totalCommission || 0,
        };
    }
};
exports.AgentsService = AgentsService;
exports.AgentsService = AgentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], AgentsService);


/***/ }),
/* 61 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ClustersModule = void 0;
const common_1 = __webpack_require__(3);
const clusters_controller_1 = __webpack_require__(62);
const clusters_service_1 = __webpack_require__(63);
const prisma_module_1 = __webpack_require__(37);
let ClustersModule = class ClustersModule {
};
exports.ClustersModule = ClustersModule;
exports.ClustersModule = ClustersModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        controllers: [clusters_controller_1.ClustersController],
        providers: [clusters_service_1.ClustersService],
        exports: [clusters_service_1.ClustersService],
    })
], ClustersModule);


/***/ }),
/* 62 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ClustersController = void 0;
const common_1 = __webpack_require__(3);
const clusters_service_1 = __webpack_require__(63);
const jwt_auth_guard_1 = __webpack_require__(32);
const roles_guard_1 = __webpack_require__(45);
class CreateClusterDto {
}
let ClustersController = class ClustersController {
    constructor(clustersService) {
        this.clustersService = clustersService;
    }
    async findAll() {
        return this.clustersService.findAll();
    }
    async getStats() {
        return this.clustersService.getStats();
    }
    async findOne(id) {
        return this.clustersService.findById(id);
    }
    async create(dto) {
        return this.clustersService.create(dto);
    }
    async update(id, dto) {
        return this.clustersService.update(id, dto);
    }
    async remove(id) {
        return this.clustersService.delete(id);
    }
};
exports.ClustersController = ClustersController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ClustersController.prototype, "findAll", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Get)("stats"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ClustersController.prototype, "getStats", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ClustersController.prototype, "findOne", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ClustersController.prototype, "create", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Put)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_b = typeof Partial !== "undefined" && Partial) === "function" ? _b : Object]),
    __metadata("design:returntype", Promise)
], ClustersController.prototype, "update", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Delete)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ClustersController.prototype, "remove", null);
exports.ClustersController = ClustersController = __decorate([
    (0, common_1.Controller)("clusters"),
    __metadata("design:paramtypes", [typeof (_a = typeof clusters_service_1.ClustersService !== "undefined" && clusters_service_1.ClustersService) === "function" ? _a : Object])
], ClustersController);


/***/ }),
/* 63 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ClustersService = void 0;
const common_1 = __webpack_require__(3);
const prisma_service_1 = __webpack_require__(14);
const serial_id_helper_1 = __webpack_require__(30);
let ClustersService = class ClustersService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    normalizeClusterStatus(status) {
        const normalized = (status || 'ACTIVE').toString().trim().toUpperCase();
        if (!['ACTIVE', 'INACTIVE', 'PENDING'].includes(normalized)) {
            throw new common_1.BadRequestException('Cluster status must be one of: ACTIVE, INACTIVE, PENDING');
        }
        return normalized.toLowerCase();
    }
    async resolveManagerId(teamLead) {
        if (!teamLead)
            return null;
        const user = await this.prisma.user.findUnique({
            where: { id: teamLead },
            select: { id: true },
        });
        if (user)
            return user.id;
        const agent = await this.prisma.agent.findUnique({
            where: { id: teamLead },
            select: { userId: true },
        });
        if (agent?.userId)
            return agent.userId;
        throw new common_1.BadRequestException('Invalid teamLead: must be a valid User ID or Agent ID');
    }
    async findAll() {
        const clusters = await this.prisma.cluster.findMany({
            include: {
                manager: { select: { id: true, name: true, email: true } },
                agents: {
                    include: {
                        user: { select: { id: true, name: true } },
                    },
                },
                freelancers: {
                    include: { user: { select: { id: true, name: true } } },
                },
                _count: { select: { agents: true, freelancers: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
        return await Promise.all(clusters.map(async (cluster) => {
            const teamLead = cluster.manager?.name ?? "";
            const agents = cluster._count.agents;
            const agentIds = cluster.agents.map(a => a.id);
            const transactions = await this.prisma.transaction.findMany({
                where: {
                    OR: [
                        { leadAgentId: { in: agentIds } },
                        { closerAgentId: { in: agentIds } },
                    ],
                },
                select: { assetId: true },
                distinct: ['assetId'],
            });
            const activeAssets = transactions.length;
            const totalCommission = await this.prisma.agent.aggregate({
                where: { clusterId: cluster.id },
                _sum: { totalCommission: true },
            });
            return {
                id: cluster.id,
                serialId: cluster.serialId ?? "",
                name: cluster.name,
                teamLead,
                managerId: cluster.managerId,
                agents,
                activeAssets,
                totalCommission: totalCommission._sum.totalCommission || 0,
                status: cluster.status,
                location: cluster.location,
                code: cluster.code,
                commissionType: cluster.commissionType ?? 'AGENT',
            };
        }));
    }
    async findById(id) {
        const cluster = await this.prisma.cluster.findUnique({
            where: { id },
            include: {
                manager: { select: { id: true, name: true, email: true } },
                agents: {
                    include: {
                        user: { select: { id: true, name: true, email: true } },
                        assignedLeads: true,
                        leadTransactions: true,
                        closerTransactions: true,
                    },
                },
                freelancers: {
                    include: { user: { select: { id: true, name: true, email: true } } },
                },
            },
        });
        if (!cluster)
            throw new common_1.NotFoundException(`Cluster with ID ${id} not found`);
        return cluster;
    }
    async create(data) {
        if (!data.name)
            throw new common_1.BadRequestException('Cluster name is required');
        const existingByName = await this.prisma.cluster.findFirst({ where: { name: { equals: data.name.trim(), mode: 'insensitive' } } });
        if (existingByName)
            throw new common_1.ConflictException('A cluster with this name already exists');
        const managerId = await this.resolveManagerId(data.teamLead);
        const status = this.normalizeClusterStatus(data.status);
        const serialId = await (0, serial_id_helper_1.generateSerialId)(this.prisma, 'CLT');
        return this.prisma.cluster.create({
            data: {
                serialId,
                name: data.name,
                code: data.code || null,
                status,
                location: data.location || null,
                managerId,
                commissionType: data.commissionType || 'AGENT',
            },
            include: {
                manager: { select: { id: true, name: true } },
            },
        });
    }
    async update(id, data) {
        await this.findById(id);
        const updateData = {};
        if (data.name !== undefined)
            updateData.name = data.name;
        if (data.code !== undefined)
            updateData.code = data.code;
        if (data.status !== undefined)
            updateData.status = this.normalizeClusterStatus(data.status);
        if (data.location !== undefined)
            updateData.location = data.location;
        if (data.teamLead !== undefined)
            updateData.managerId = await this.resolveManagerId(data.teamLead);
        if (data.commissionType !== undefined)
            updateData.commissionType = data.commissionType;
        return this.prisma.cluster.update({
            where: { id },
            data: updateData,
            include: { manager: { select: { id: true, name: true } } },
        });
    }
    async delete(id) {
        await this.findById(id);
        await this.prisma.cluster.delete({ where: { id } });
        return { message: 'Cluster deleted successfully', id };
    }
    async getStats() {
        const [total, active, agents, freelancers] = await Promise.all([
            this.prisma.cluster.count(),
            this.prisma.cluster.count({ where: { status: 'active' } }),
            this.prisma.user.count({ where: { role: 'AGENT' } }),
            this.prisma.freelancer.count(),
        ]);
        return { totalClusters: total, activeClusters: active, totalAgents: agents, totalFreelancers: freelancers };
    }
};
exports.ClustersService = ClustersService;
exports.ClustersService = ClustersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], ClustersService);


/***/ }),
/* 64 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LeadsModule = void 0;
const common_1 = __webpack_require__(3);
const leads_controller_1 = __webpack_require__(65);
const leads_service_1 = __webpack_require__(66);
const prisma_module_1 = __webpack_require__(37);
const notification_module_1 = __webpack_require__(38);
let LeadsModule = class LeadsModule {
};
exports.LeadsModule = LeadsModule;
exports.LeadsModule = LeadsModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule, notification_module_1.NotificationModule],
        controllers: [leads_controller_1.LeadsController],
        providers: [leads_service_1.LeadsService],
        exports: [leads_service_1.LeadsService],
    })
], LeadsModule);


/***/ }),
/* 65 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LeadsController = void 0;
const common_1 = __webpack_require__(3);
const platform_express_1 = __webpack_require__(49);
const class_validator_1 = __webpack_require__(33);
const class_transformer_1 = __webpack_require__(34);
const leads_service_1 = __webpack_require__(66);
class CreateLeadDto {
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateLeadDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], CreateLeadDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateLeadDto.prototype, "phone", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateLeadDto.prototype, "assetInterest", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateLeadDto.prototype, "budget", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateLeadDto.prototype, "source", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateLeadDto.prototype, "leadSource", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateLeadDto.prototype, "assignedCluster", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateLeadDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateLeadDto.prototype, "assignedToId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateLeadDto.prototype, "createdBy", void 0);
class AssignLeadsDto {
}
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], AssignLeadsDto.prototype, "leadIds", void 0);
__decorate([
    (0, class_validator_1.IsIn)(['cluster', 'all']),
    __metadata("design:type", String)
], AssignLeadsDto.prototype, "assignmentType", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], AssignLeadsDto.prototype, "clusterId", void 0);
class AssignSingleLeadDto {
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AssignSingleLeadDto.prototype, "assignedToId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AssignSingleLeadDto.prototype, "clusterId", void 0);
let LeadsController = class LeadsController {
    constructor(leadsService) {
        this.leadsService = leadsService;
    }
    async findAll(source, status) {
        return this.leadsService.findAll({ source, status });
    }
    async getStats() {
        return this.leadsService.getStats();
    }
    async findOne(id) {
        return this.leadsService.findById(id);
    }
    async create(dto, req) {
        const createdById = req?.user?.id;
        return this.leadsService.create(dto, createdById);
    }
    async assignLeads(dto) {
        return this.leadsService.assignLeads(dto);
    }
    async assignSingleLead(id, dto) {
        return this.leadsService.assignSingleLead(id, dto);
    }
    async bulkImport(file, req) {
        const createdById = req?.user?.id;
        return this.leadsService.bulkImport(file, createdById);
    }
    async updateLeadStatus(id, body) {
        return this.leadsService.updateLeadStatus(id, body.status);
    }
    async update(id, dto) {
        return this.leadsService.update(id, dto);
    }
};
exports.LeadsController = LeadsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)("source")),
    __param(1, (0, common_1.Query)("status")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], LeadsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)("stats"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], LeadsController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LeadsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateLeadDto, Object]),
    __metadata("design:returntype", Promise)
], LeadsController.prototype, "create", null);
__decorate([
    (0, common_1.Post)("assign"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [AssignLeadsDto]),
    __metadata("design:returntype", Promise)
], LeadsController.prototype, "assignLeads", null);
__decorate([
    (0, common_1.Post)(":id/assign"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, AssignSingleLeadDto]),
    __metadata("design:returntype", Promise)
], LeadsController.prototype, "assignSingleLead", null);
__decorate([
    (0, common_1.Post)("bulk-import"),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)("file")),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_c = typeof Express !== "undefined" && (_b = Express.Multer) !== void 0 && _b.File) === "function" ? _c : Object, Object]),
    __metadata("design:returntype", Promise)
], LeadsController.prototype, "bulkImport", null);
__decorate([
    (0, common_1.Put)(":id/status"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], LeadsController.prototype, "updateLeadStatus", null);
__decorate([
    (0, common_1.Put)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_d = typeof Partial !== "undefined" && Partial) === "function" ? _d : Object]),
    __metadata("design:returntype", Promise)
], LeadsController.prototype, "update", null);
exports.LeadsController = LeadsController = __decorate([
    (0, common_1.Controller)("leads"),
    __metadata("design:paramtypes", [typeof (_a = typeof leads_service_1.LeadsService !== "undefined" && leads_service_1.LeadsService) === "function" ? _a : Object])
], LeadsController);


/***/ }),
/* 66 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LeadsService = void 0;
const common_1 = __webpack_require__(3);
const prisma_service_1 = __webpack_require__(14);
const notification_service_1 = __webpack_require__(18);
const serial_id_helper_1 = __webpack_require__(30);
const ExcelJS = __importStar(__webpack_require__(67));
let LeadsService = class LeadsService {
    constructor(prisma, notificationService) {
        this.prisma = prisma;
        this.notificationService = notificationService;
    }
    async assignLeads(dto) {
        if (dto.assignmentType === 'all') {
            await this.prisma.lead.updateMany({
                where: { id: { in: dto.leadIds } },
                data: { status: 'available', assignedCluster: null, assignedToId: null },
            });
            await this.notificationService.notifyLeadAvailableToAll(dto.leadIds);
        }
        else if (dto.assignmentType === 'cluster' && dto.clusterId) {
            await this.prisma.lead.updateMany({
                where: { id: { in: dto.leadIds } },
                data: { status: 'assigned', assignedCluster: dto.clusterId },
            });
            await this.notificationService.notifyLeadAssignedToCluster(dto.leadIds, dto.clusterId);
        }
        else {
            throw new common_1.BadRequestException('Invalid assignment type or missing clusterId');
        }
        return { message: 'Leads assigned', ...dto };
    }
    async findAll(filters) {
        const where = {};
        if (filters?.status)
            where.status = filters.status;
        if (filters?.assetId)
            where.assetId = filters.assetId;
        if (filters?.assignedToId)
            where.assignedToId = filters.assignedToId;
        if (filters?.source)
            where.source = filters.source;
        return this.prisma.lead.findMany({
            where,
            include: {
                asset: { select: { id: true, name: true, type: true, location: true } },
                assignedTo: { include: { user: { select: { id: true, name: true } } } },
                createdBy: { select: { id: true, name: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findById(id) {
        const lead = await this.prisma.lead.findUnique({
            where: { id },
            include: {
                asset: true,
                assignedTo: { include: { user: true, cluster: true } },
                createdBy: { select: { id: true, name: true, email: true } },
            },
        });
        if (!lead)
            throw new common_1.NotFoundException(`Lead with ID ${id} not found`);
        return lead;
    }
    async create(data, createdById) {
        if (!data.email)
            throw new common_1.BadRequestException('Email is required');
        const resolvedName = (data.name && data.name.trim()) || data.email.split('@')[0];
        const existingLead = await this.prisma.lead.findUnique({ where: { email: data.email } });
        if (existingLead) {
            await this.notificationService.notifyNewLeadFromInvestor(existingLead.id);
            return existingLead;
        }
        const serialId = await (0, serial_id_helper_1.generateSerialId)(this.prisma, 'LED');
        const createdLead = await this.prisma.lead.create({
            data: {
                serialId,
                name: resolvedName,
                email: data.email,
                phone: data.phone || null,
                assetInterest: data.assetInterest || null,
                budget: data.budget ? parseFloat(data.budget) : null,
                source: data.source || null,
                leadSource: data.leadSource || "investor-app",
                location: data.location || null,
                notes: data.notes || null,
                status: data.status || "pending",
                assignedToId: data.assignedToId || null,
                assignedCluster: data.assignedCluster || null,
                createdById,
                dateReceived: data.dateReceived ? new Date(data.dateReceived) : new Date(),
            },
            include: {
                asset: { select: { id: true, name: true } },
                assignedTo: { include: { user: { select: { id: true, name: true } } } },
                createdBy: { select: { id: true, name: true } },
            },
        });
        const source = String(createdLead.leadSource || createdLead.source || '').toLowerCase();
        if (source.includes('investor')) {
            await this.notificationService.notifyNewLeadFromInvestor(createdLead.id);
        }
        return createdLead;
    }
    async update(id, data) {
        await this.findById(id);
        const updateData = {};
        if (data.name !== undefined)
            updateData.name = data.name;
        if (data.email !== undefined)
            updateData.email = data.email;
        if (data.phone !== undefined)
            updateData.phone = data.phone;
        if (data.status !== undefined)
            updateData.status = data.status;
        if (data.budget !== undefined)
            updateData.budget = parseFloat(data.budget);
        if (data.source !== undefined)
            updateData.source = data.source;
        if (data.leadSource !== undefined)
            updateData.leadSource = data.leadSource;
        if (data.location !== undefined)
            updateData.location = data.location;
        if (data.notes !== undefined)
            updateData.notes = data.notes;
        if (data.assetInterest !== undefined)
            updateData.assetInterest = data.assetInterest;
        if (data.assignedToId !== undefined)
            updateData.assignedToId = data.assignedToId;
        if (data.assignedCluster !== undefined)
            updateData.assignedCluster = data.assignedCluster;
        return this.prisma.lead.update({
            where: { id },
            data: updateData,
            include: {
                asset: { select: { id: true, name: true } },
                assignedTo: { include: { user: { select: { id: true, name: true } } } },
            },
        });
    }
    async delete(id) {
        await this.findById(id);
        await this.prisma.lead.delete({ where: { id } });
        return { message: 'Lead deleted successfully', id };
    }
    async getStats() {
        const [total, byStatus] = await Promise.all([
            this.prisma.lead.count(),
            this.prisma.lead.groupBy({
                by: ['status'],
                _count: true,
            }),
        ]);
        return {
            total,
            byStatus: byStatus.map((s) => ({ status: s.status, count: s._count })),
        };
    }
    async assignSingleLead(leadId, dto) {
        if (!leadId)
            throw new common_1.BadRequestException('Missing leadId');
        const updateData = {};
        if (dto.assignedToId) {
            updateData.assignedToId = dto.assignedToId;
            updateData.status = 'assigned';
        }
        if (dto.clusterId) {
            updateData.assignedCluster = dto.clusterId;
            updateData.status = 'assigned';
        }
        if (!updateData.assignedToId && !updateData.assignedCluster) {
            throw new common_1.BadRequestException('Must provide assignedToId or clusterId');
        }
        const lead = await this.prisma.lead.update({
            where: { id: leadId },
            data: updateData,
        });
        if (dto.clusterId) {
            await this.notificationService.notifyLeadAssignedToCluster([leadId], dto.clusterId);
        }
        return { message: 'Lead assigned', lead };
    }
    async updateLeadStatus(id, status) {
        if (!id)
            throw new common_1.BadRequestException('Missing leadId');
        if (!status)
            throw new common_1.BadRequestException('Missing status');
        const lead = await this.prisma.lead.update({
            where: { id },
            data: { status },
        });
        return { message: 'Lead status updated', lead };
    }
    async bulkImport(file, createdById) {
        if (!file)
            throw new common_1.BadRequestException('No file uploaded');
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(file.buffer);
        const worksheet = workbook.worksheets[0];
        if (!worksheet)
            throw new common_1.BadRequestException('Excel file contains no worksheets');
        const results = { created: 0, skipped: 0, errors: [] };
        const headerRow = worksheet.getRow(1);
        const headers = {};
        headerRow.eachCell((cell, colNumber) => {
            headers[colNumber] = String(cell.value || '').trim().toLowerCase();
        });
        const getCol = (row, names) => {
            for (const [colStr, header] of Object.entries(headers)) {
                if (names.some(n => header.includes(n))) {
                    const val = row.getCell(parseInt(colStr)).value;
                    return val ? String(val).trim() : '';
                }
            }
            return '';
        };
        for (let rowNum = 2; rowNum <= worksheet.rowCount; rowNum++) {
            const row = worksheet.getRow(rowNum);
            if (row.cellCount === 0)
                continue;
            const email = getCol(row, ['email']);
            if (!email) {
                results.skipped++;
                continue;
            }
            const name = getCol(row, ['name', 'full name']) || email.split('@')[0];
            const phone = getCol(row, ['phone', 'telephone', 'mobile']);
            const budget = getCol(row, ['budget']);
            const location = getCol(row, ['location', 'city', 'address']);
            const assetInterest = getCol(row, ['asset', 'interest', 'property']);
            const source = getCol(row, ['source']);
            const notes = getCol(row, ['notes', 'comment', 'remark']);
            try {
                await this.create({ name, email, phone, budget, location, assetInterest, source, leadSource: 'bulk-import', notes }, createdById || '');
                results.created++;
            }
            catch (err) {
                results.errors.push(`Row ${rowNum}: ${err?.message || 'Unknown error'}`);
                results.skipped++;
            }
        }
        return { message: `Bulk import complete`, ...results };
    }
};
exports.LeadsService = LeadsService;
exports.LeadsService = LeadsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object, typeof (_b = typeof notification_service_1.NotificationService !== "undefined" && notification_service_1.NotificationService) === "function" ? _b : Object])
], LeadsService);


/***/ }),
/* 67 */
/***/ ((module) => {

module.exports = require("exceljs");

/***/ }),
/* 68 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TransactionsModule = void 0;
const common_1 = __webpack_require__(3);
const platform_express_1 = __webpack_require__(49);
const transactions_controller_1 = __webpack_require__(69);
const transactions_service_1 = __webpack_require__(70);
const prisma_module_1 = __webpack_require__(37);
const notification_module_1 = __webpack_require__(38);
let TransactionsModule = class TransactionsModule {
};
exports.TransactionsModule = TransactionsModule;
exports.TransactionsModule = TransactionsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            prisma_module_1.PrismaModule,
            notification_module_1.NotificationModule,
            platform_express_1.MulterModule.register({
                dest: './uploads',
            }),
        ],
        controllers: [transactions_controller_1.TransactionsController],
        providers: [transactions_service_1.TransactionsService],
        exports: [transactions_service_1.TransactionsService],
    })
], TransactionsModule);


/***/ }),
/* 69 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
var _a, _b, _c, _d, _e;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TransactionsController = void 0;
const common_1 = __webpack_require__(3);
const platform_express_1 = __webpack_require__(49);
const class_validator_1 = __webpack_require__(33);
const class_transformer_1 = __webpack_require__(34);
const transactions_service_1 = __webpack_require__(70);
const jwt_auth_guard_1 = __webpack_require__(32);
const roles_guard_1 = __webpack_require__(45);
const roles_decorator_1 = __webpack_require__(46);
class CreateTransactionDto {
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTransactionDto.prototype, "assetId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTransactionDto.prototype, "buyerId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateTransactionDto.prototype, "leadAgentId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateTransactionDto.prototype, "closerAgentId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateTransactionDto.prototype, "companyId", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateTransactionDto.prototype, "totalAmount", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateTransactionDto.prototype, "paymentType", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateTransactionDto.prototype, "leadCommission", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateTransactionDto.prototype, "closerCommission", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateTransactionDto.prototype, "totalCommission", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateTransactionDto.prototype, "status", void 0);
class SendCommissionsDto {
}
let TransactionsController = class TransactionsController {
    constructor(transactionsService) {
        this.transactionsService = transactionsService;
    }
    async findAll(month) {
        return this.transactionsService.findAll({ month });
    }
    async getStats() {
        return this.transactionsService.getStats();
    }
    async getUnpaidCommissions(month) {
        return this.transactionsService.getUnpaidCommissions({ month });
    }
    async getPaidCommissions(month) {
        return this.transactionsService.getPaidCommissions({ month });
    }
    async findOne(id) {
        return this.transactionsService.findById(id);
    }
    async create(dto) {
        return this.transactionsService.create(dto);
    }
    async sendCommissions(dto) {
        return this.transactionsService.sendCommissionsForPayment(dto.transactionIds);
    }
    async uploadPaymentProof(file) {
        return this.transactionsService.uploadPaymentProof(file);
    }
    async patch(id, dto) {
        return this.transactionsService.update(id, dto);
    }
    async update(id, dto) {
        return this.transactionsService.update(id, dto);
    }
};
exports.TransactionsController = TransactionsController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)("month")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TransactionsController.prototype, "findAll", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Get)("stats"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TransactionsController.prototype, "getStats", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Get)("commissions/unpaid"),
    __param(0, (0, common_1.Query)("month")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TransactionsController.prototype, "getUnpaidCommissions", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Get)("commissions/paid"),
    __param(0, (0, common_1.Query)("month")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TransactionsController.prototype, "getPaidCommissions", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TransactionsController.prototype, "findOne", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateTransactionDto]),
    __metadata("design:returntype", Promise)
], TransactionsController.prototype, "create", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)("ADMIN"),
    (0, common_1.Post)("commissions/send"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [SendCommissionsDto]),
    __metadata("design:returntype", Promise)
], TransactionsController.prototype, "sendCommissions", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)("ADMIN"),
    (0, common_1.Post)("commissions/payment-proof"),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)("file")),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_c = typeof Express !== "undefined" && (_b = Express.Multer) !== void 0 && _b.File) === "function" ? _c : Object]),
    __metadata("design:returntype", Promise)
], TransactionsController.prototype, "uploadPaymentProof", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)("ADMIN"),
    (0, common_1.Patch)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_d = typeof Partial !== "undefined" && Partial) === "function" ? _d : Object]),
    __metadata("design:returntype", Promise)
], TransactionsController.prototype, "patch", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_e = typeof Partial !== "undefined" && Partial) === "function" ? _e : Object]),
    __metadata("design:returntype", Promise)
], TransactionsController.prototype, "update", null);
exports.TransactionsController = TransactionsController = __decorate([
    (0, common_1.Controller)("transactions"),
    __metadata("design:paramtypes", [typeof (_a = typeof transactions_service_1.TransactionsService !== "undefined" && transactions_service_1.TransactionsService) === "function" ? _a : Object])
], TransactionsController);


/***/ }),
/* 70 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var TransactionsService_1;
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TransactionsService = void 0;
const common_1 = __webpack_require__(3);
const prisma_service_1 = __webpack_require__(14);
const client_1 = __webpack_require__(15);
const notification_service_1 = __webpack_require__(18);
const serial_id_helper_1 = __webpack_require__(30);
let TransactionsService = TransactionsService_1 = class TransactionsService {
    constructor(prisma, notificationService) {
        this.prisma = prisma;
        this.notificationService = notificationService;
        this.logger = new common_1.Logger(TransactionsService_1.name);
    }
    async getUnpaidCommissions({ month }) {
        return this.findAll({
            status: undefined,
            month,
        }).then(transactions => transactions.filter(t => t.status === 'unpaid' || t.status === 'sent'));
    }
    async getPaidCommissions({ month }) {
        return this.findAll({
            status: undefined,
            month,
        }).then(transactions => transactions.filter(t => t.status === 'paid'));
    }
    async sendCommissionsForPayment(transactionIds) {
        await this.prisma.transaction.updateMany({
            where: { id: { in: transactionIds } },
            data: { commissionPaymentStatus: 'SENT' },
        });
        await this.notificationService.notifyCommissionSent(transactionIds);
        return { message: 'Commissions marked as sent', transactionIds };
    }
    async uploadPaymentProof(file) {
        const sentTransactions = await this.prisma.transaction.findMany({
            where: { commissionPaymentStatus: 'SENT' },
            select: { id: true },
        });
        const transactionIds = sentTransactions.map((tx) => tx.id);
        await this.prisma.transaction.updateMany({
            where: { commissionPaymentStatus: 'SENT' },
            data: { commissionPaymentStatus: 'PAID' },
        });
        await this.notificationService.notifyCommissionsPaid(transactionIds, file?.originalname);
        return { message: 'Payment proof uploaded and commissions marked as paid', fileName: file?.originalname };
    }
    async findAll(filters) {
        const where = {};
        if (filters?.status)
            where.status = filters.status;
        if (filters?.agentId) {
            where.OR = [{ leadAgentId: filters.agentId }, { closerAgentId: filters.agentId }];
        }
        if (filters?.companyId)
            where.companyId = filters.companyId;
        if (filters?.month) {
            const [year, month] = filters.month.split('-');
            const start = new Date(Number(year), Number(month) - 1, 1);
            const end = new Date(Number(year), Number(month), 1);
            where.date = { gte: start, lt: end };
        }
        const transactions = await this.prisma.transaction.findMany({
            where,
            include: {
                asset: { select: { name: true } },
                buyer: { select: { name: true } },
                company: { select: { name: true } },
                leadAgent: { include: { user: { select: { name: true, accountNumber: true } } } },
                closerAgent: { include: { user: { select: { name: true } } } },
                installments: true,
            },
            orderBy: { date: 'desc' },
        });
        return transactions.map(formatDeal);
    }
    async findById(id) {
        const transaction = await this.prisma.transaction.findUnique({
            where: { id },
            include: {
                asset: true,
                buyer: { select: { id: true, name: true, email: true } },
                company: true,
                leadAgent: { include: { user: { select: { id: true, name: true } } } },
                closerAgent: { include: { user: { select: { id: true, name: true } } } },
                installments: { orderBy: { dueDate: 'asc' } },
                installmentPlans: true,
                commissions: { include: { agent: { include: { user: { select: { id: true, name: true } } } } } },
            },
        });
        if (!transaction)
            throw new common_1.NotFoundException(`Transaction with ID ${id} not found`);
        return transaction;
    }
    async create(data) {
        if (!data.assetId)
            throw new common_1.BadRequestException('Asset ID is required');
        if (!data.buyerId)
            throw new common_1.BadRequestException('Buyer ID is required');
        if (!data.totalAmount)
            throw new common_1.BadRequestException('Total amount is required');
        const asset = await this.prisma.asset.findUnique({ where: { id: data.assetId } });
        if (!asset)
            throw new common_1.NotFoundException('Asset not found');
        const buyer = await this.prisma.user.findUnique({ where: { id: data.buyerId } });
        if (!buyer)
            throw new common_1.NotFoundException('Buyer not found');
        const serialId = await (0, serial_id_helper_1.generateSerialId)(this.prisma, 'TRN');
        const transaction = await this.prisma.transaction.create({
            data: {
                serialId,
                assetId: data.assetId,
                buyerId: data.buyerId,
                totalAmount: parseFloat(data.totalAmount),
                companyId: data.companyId || asset.companyId || null,
                paymentType: data.paymentType || null,
                leadAgentId: data.leadAgentId || null,
                closerAgentId: data.closerAgentId || null,
                leadCommission: data.leadCommission ? parseFloat(data.leadCommission) : 0,
                closerCommission: data.closerCommission ? parseFloat(data.closerCommission) : 0,
                totalCommission: data.totalCommission ? parseFloat(data.totalCommission) : 0,
                commission: data.commission ? parseFloat(data.commission) : 0,
                status: data.status?.toUpperCase() || 'PENDING',
                commissionPaymentStatus: data.commissionPaymentStatus?.toUpperCase() || client_1.CommissionPaymentStatus.UNPAID,
                installmentDuration: data.installmentDuration ? parseInt(data.installmentDuration) : null,
            },
            include: {
                asset: { select: { id: true, name: true } },
                buyer: { select: { id: true, name: true } },
                company: { select: { id: true, name: true } },
            },
        });
        try {
            await this.notificationService.notifyDealCreated(transaction.id);
        }
        catch (err) {
            this.logger.error(`notifyDealCreated failed for tx ${transaction.id}: ${err?.message}`, err?.stack);
        }
        if ((transaction.paymentType || '').toLowerCase() === 'installment') {
            try {
                await this.notificationService.notifyDealPaymentReady(transaction.id);
            }
            catch (err) {
                this.logger.error(`notifyDealPaymentReady failed for tx ${transaction.id}: ${err?.message}`, err?.stack);
            }
        }
        try {
            await this.notificationService.notifyAdminAndSales({
                title: 'New Deal Created',
                message: `A new deal for "${transaction.asset?.name || 'an asset'}" worth ₦${transaction.totalAmount.toLocaleString()} has been created.`,
                type: 'INFO',
            });
        }
        catch (err) {
            this.logger.error(`notifyAdminAndSales failed for tx ${transaction.id}: ${err?.message}`, err?.stack);
        }
        return transaction;
    }
    async update(id, data) {
        await this.findById(id);
        const updateData = {};
        if (data.commissionPaymentStatus !== undefined)
            updateData.commissionPaymentStatus = data.commissionPaymentStatus;
        if (data.leadAgentId !== undefined)
            updateData.leadAgentId = data.leadAgentId;
        if (data.closerAgentId !== undefined)
            updateData.closerAgentId = data.closerAgentId;
        if (data.totalAmount !== undefined)
            updateData.totalAmount = parseFloat(data.totalAmount);
        if (data.paymentType !== undefined)
            updateData.paymentType = data.paymentType;
        if (data.companyId !== undefined)
            updateData.companyId = data.companyId;
        const validStatuses = ['PENDING', 'COMPLETED', 'CANCELLED'];
        if (data.status !== undefined) {
            const statusUpper = data.status.toUpperCase();
            if (validStatuses.includes(statusUpper)) {
                updateData.status = statusUpper;
            }
        }
        const updated = await this.prisma.transaction.update({
            where: { id },
            data: updateData,
            include: {
                asset: { select: { id: true, name: true } },
                company: { select: { id: true, name: true } },
            },
        });
        if (data.commissionPaymentStatus === 'SENT') {
            try {
                await this.notificationService.notifyCommissionSent([id]);
            }
            catch (err) {
                this.logger.error(`notifyCommissionSent failed: ${err?.message}`);
            }
        }
        if (data.commissionPaymentStatus === 'PAID') {
            try {
                await this.notificationService.notifyCommissionsPaid([id]);
            }
            catch (err) {
                this.logger.error(`notifyCommissionsPaid failed: ${err?.message}`);
            }
        }
        const statusLower = data.status?.toLowerCase();
        if (statusLower === 'ready') {
            try {
                await this.notificationService.notifyDealPaymentReady(id);
            }
            catch (err) {
                this.logger.error(`notifyDealPaymentReady failed: ${err?.message}`);
            }
        }
        else if (statusLower === 'paid') {
            try {
                await this.notificationService.notifyDealPaymentReady(id);
            }
            catch (err) {
                this.logger.error(`notifyDealPaymentReady(paid) failed: ${err?.message}`);
            }
        }
        else if (statusLower === 'closed' || statusLower === 'completed') {
            try {
                await this.notificationService.notifyDealClosed(id);
            }
            catch (err) {
                this.logger.error(`notifyDealClosed failed: ${err?.message}`);
            }
            try {
                await this.notificationService.notifyAdminAndSales({
                    title: 'Deal Completed',
                    message: `Deal "${updated.asset?.name || 'unknown asset'}" has been marked as completed.`,
                    type: 'SUCCESS',
                });
            }
            catch (err) {
                this.logger.error(`notifyAdminAndSales(completed) failed: ${err?.message}`);
            }
        }
        return updated;
    }
    async delete(id) {
        await this.findById(id);
        await this.prisma.transaction.delete({ where: { id } });
        return { message: 'Transaction deleted successfully', id };
    }
    async getStats(filters) {
        const where = { status: 'COMPLETED' };
        if (filters?.startDate)
            where.date = { ...where.date, gte: new Date(filters.startDate) };
        if (filters?.endDate)
            where.date = { ...where.date, lte: new Date(filters.endDate) };
        const [total, revenue, commissions] = await Promise.all([
            this.prisma.transaction.count({ where }),
            this.prisma.transaction.aggregate({ where, _sum: { totalAmount: true } }),
            this.prisma.transaction.aggregate({ where, _sum: { totalCommission: true } }),
        ]);
        return {
            totalTransactions: total,
            totalRevenue: revenue._sum.totalAmount || 0,
            totalCommissions: commissions._sum.totalCommission || 0,
            avgDealSize: total > 0 ? (revenue._sum.totalAmount || 0) / total : 0,
        };
    }
};
exports.TransactionsService = TransactionsService;
exports.TransactionsService = TransactionsService = TransactionsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object, typeof (_b = typeof notification_service_1.NotificationService !== "undefined" && notification_service_1.NotificationService) === "function" ? _b : Object])
], TransactionsService);
function formatDeal(tx) {
    return {
        id: tx.id,
        serialId: tx.serialId ?? "",
        leadName: tx.buyer?.name ?? tx.leadAgent?.user?.name ?? "",
        buyer: tx.buyer?.name ?? "",
        leadAgent: tx.leadAgent?.user?.name ?? "",
        closerAgent: tx.closerAgent?.user?.name ?? "",
        accountNumber: tx.leadAgent?.user?.accountNumber ?? "",
        company: tx.company?.name ?? "",
        asset: tx.asset?.name ?? "",
        propertyValue: tx.totalAmount ? `₦${tx.totalAmount.toLocaleString()}` : "",
        amount: tx.totalAmount ?? 0,
        commission: tx.commission,
        totalCommission: tx.totalCommission ? `₦${tx.totalCommission.toLocaleString()}` : "",
        leadCommission: tx.leadCommission ? `₦${tx.leadCommission.toLocaleString()}` : "",
        closerCommission: tx.closerCommission ? `₦${tx.closerCommission.toLocaleString()}` : "",
        commissionType: tx.leadAgentId && tx.closerAgentId
            ? (tx.leadAgentId === tx.closerAgentId ? "split" : "lead")
            : "lead",
        status: tx.commissionPaymentStatus?.toLowerCase() ?? "unpaid",
        eligibility: tx.commissionPaymentStatus === "PAID" ? "Eligible" : "Not Eligible",
        payoutDate: tx.updatedAt?.toISOString().split("T")[0],
        date: tx.date?.toISOString().split("T")[0] ?? tx.updatedAt?.toISOString().split("T")[0],
        paymentType: tx.paymentType === "installment" ? "installment" : "full",
        paymentPlan: tx.paymentType === "installment"
            ? {
                type: "installment",
                numberOfInstallments: tx.installments?.length ?? 0,
            }
            : null,
        commissionBreakdown: (tx.installments ?? []).map((inst, idx) => ({
            installmentId: inst.id,
            installmentNumber: inst.installmentNumber ?? idx + 1,
            leadCommission: inst.leadCommission ?? 0,
            closerCommission: inst.closerCommission ?? 0,
            totalCommission: (inst.leadCommission ?? 0) + (inst.closerCommission ?? 0),
            status: inst.status === "PAID" ? "earned" : (inst.status === "PENDING" ? "pending" : "scheduled"),
            earnedDate: inst.paidDate ?? null,
        })),
    };
}


/***/ }),
/* 71 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.InstallmentsModule = void 0;
const common_1 = __webpack_require__(3);
const installments_controller_1 = __webpack_require__(72);
const installments_service_1 = __webpack_require__(73);
const prisma_module_1 = __webpack_require__(37);
const notification_module_1 = __webpack_require__(38);
let InstallmentsModule = class InstallmentsModule {
};
exports.InstallmentsModule = InstallmentsModule;
exports.InstallmentsModule = InstallmentsModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule, notification_module_1.NotificationModule],
        controllers: [installments_controller_1.InstallmentsController],
        providers: [installments_service_1.InstallmentsService],
        exports: [installments_service_1.InstallmentsService],
    })
], InstallmentsModule);


/***/ }),
/* 72 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.InstallmentsController = void 0;
const common_1 = __webpack_require__(3);
const class_validator_1 = __webpack_require__(33);
const class_transformer_1 = __webpack_require__(34);
const installments_service_1 = __webpack_require__(73);
class CreateInstallmentPlanDto {
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateInstallmentPlanDto.prototype, "buyerName", void 0);
__decorate([
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateInstallmentPlanDto.prototype, "buyerEmail", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateInstallmentPlanDto.prototype, "buyerPhone", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateInstallmentPlanDto.prototype, "assetId", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateInstallmentPlanDto.prototype, "totalAmount", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateInstallmentPlanDto.prototype, "downPayment", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateInstallmentPlanDto.prototype, "numberOfInstallments", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateInstallmentPlanDto.prototype, "frequency", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateInstallmentPlanDto.prototype, "startDate", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateInstallmentPlanDto.prototype, "leadAgentId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateInstallmentPlanDto.prototype, "closerAgentId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateInstallmentPlanDto.prototype, "companyId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateInstallmentPlanDto.prototype, "transactionId", void 0);
class SendReminderDto {
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SendReminderDto.prototype, "installmentId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SendReminderDto.prototype, "reminderDate", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SendReminderDto.prototype, "method", void 0);
class UpdatePlanStatusDto {
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdatePlanStatusDto.prototype, "status", void 0);
let InstallmentsController = class InstallmentsController {
    constructor(installmentsService) {
        this.installmentsService = installmentsService;
    }
    async findAll(status) {
        return this.installmentsService.findAll({ status });
    }
    async getStats() {
        return this.installmentsService.getStats();
    }
    async findOne(id) {
        return this.installmentsService.findById(id);
    }
    async getSchedule(id) {
        return this.installmentsService.getInstallmentSchedule(id);
    }
    async create(dto) {
        return this.installmentsService.create(dto);
    }
    async sendReminder(dto) {
        return this.installmentsService.sendPaymentReminder(dto);
    }
    async recordPayment(id, installmentId, body) {
        return this.installmentsService.recordPayment(id, installmentId, body);
    }
    async recordPaymentShorthand(installmentId, body) {
        return this.installmentsService.recordPaymentByInstallmentId(installmentId, body);
    }
    async updatePlanStatus(id, dto) {
        return this.installmentsService.updatePlanStatus(id, dto.status);
    }
    async getUpcoming() {
        return this.installmentsService.findAll({ status: "upcoming" });
    }
    async getOverdue() {
        return this.installmentsService.findAll({ status: "overdue" });
    }
};
exports.InstallmentsController = InstallmentsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)("status")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InstallmentsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)("stats"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], InstallmentsController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InstallmentsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)(":id/schedule"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InstallmentsController.prototype, "getSchedule", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateInstallmentPlanDto]),
    __metadata("design:returntype", Promise)
], InstallmentsController.prototype, "create", null);
__decorate([
    (0, common_1.Post)("reminders/send"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [SendReminderDto]),
    __metadata("design:returntype", Promise)
], InstallmentsController.prototype, "sendReminder", null);
__decorate([
    (0, common_1.Put)(":id/installments/:installmentId/pay"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Param)("installmentId")),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], InstallmentsController.prototype, "recordPayment", null);
__decorate([
    (0, common_1.Post)(":installmentId/payments"),
    __param(0, (0, common_1.Param)("installmentId")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], InstallmentsController.prototype, "recordPaymentShorthand", null);
__decorate([
    (0, common_1.Patch)("plans/:id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UpdatePlanStatusDto]),
    __metadata("design:returntype", Promise)
], InstallmentsController.prototype, "updatePlanStatus", null);
__decorate([
    (0, common_1.Get)("upcoming"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], InstallmentsController.prototype, "getUpcoming", null);
__decorate([
    (0, common_1.Get)("overdue"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], InstallmentsController.prototype, "getOverdue", null);
exports.InstallmentsController = InstallmentsController = __decorate([
    (0, common_1.Controller)("installments"),
    __metadata("design:paramtypes", [typeof (_a = typeof installments_service_1.InstallmentsService !== "undefined" && installments_service_1.InstallmentsService) === "function" ? _a : Object])
], InstallmentsController);


/***/ }),
/* 73 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.InstallmentsService = void 0;
const common_1 = __webpack_require__(3);
const prisma_service_1 = __webpack_require__(14);
const notification_service_1 = __webpack_require__(18);
const serial_id_helper_1 = __webpack_require__(30);
let InstallmentsService = class InstallmentsService {
    constructor(prisma, notificationService) {
        this.prisma = prisma;
        this.notificationService = notificationService;
    }
    async findAll(filters) {
        const where = {};
        if (filters?.status && filters.status !== 'all') {
            where.status = filters.status.toUpperCase();
        }
        const plans = await this.prisma.installmentPlan.findMany({
            where,
            include: {
                asset: { select: { name: true } },
                company: { select: { name: true } },
                leadAgent: { include: { user: { select: { name: true } } } },
                closerAgent: { include: { user: { select: { name: true } } } },
                installments: { orderBy: { dueDate: 'asc' } },
            },
            orderBy: { createdAt: 'desc' },
        });
        return plans.map(plan => ({
            id: plan.id,
            serialId: plan.serialId ?? "",
            asset: plan.asset?.name ?? "",
            buyer: plan.buyerName ?? "",
            buyerEmail: plan.buyerEmail ?? "",
            buyerPhone: plan.buyerPhone ?? "",
            totalAmount: plan.totalAmount,
            downPayment: plan.downPayment,
            paidAmount: plan.paidAmount,
            remainingBalance: plan.remainingBalance,
            numberOfInstallments: plan.numberOfInstallments,
            completedInstallments: plan.completedInstallments,
            installmentAmount: plan.installmentAmount,
            frequency: plan.frequency,
            startDate: plan.startDate?.toISOString().split("T")[0] ?? "",
            nextDueDate: plan.nextDueDate?.toISOString().split("T")[0] ?? "",
            status: plan.status?.toLowerCase(),
            company: plan.company?.name ?? "",
            leadAgent: plan.leadAgent?.user?.name ?? "",
            closerAgent: plan.closerAgent?.user?.name ?? "",
            installments: plan.installments.map(inst => ({
                id: inst.id,
                serialId: inst.serialId ?? "",
                dueDate: inst.dueDate?.toISOString().split("T")[0] ?? "",
                amount: inst.amount,
                paidAmount: inst.paidAmount,
                status: inst.status?.toLowerCase(),
                paidDate: inst.paidDate ? inst.paidDate.toISOString().split("T")[0] : null,
                paymentMethod: inst.paymentMethod ?? "",
            })),
        }));
    }
    async create(dto) {
        const installmentAmount = dto.totalAmount / dto.numberOfInstallments;
        const serialId = await (0, serial_id_helper_1.generateSerialId)(this.prisma, 'IPL');
        const plan = await this.prisma.installmentPlan.create({
            data: {
                ...dto,
                serialId,
                companyId: dto.companyId,
                remainingBalance: dto.totalAmount - (dto.downPayment || 0),
                paidAmount: 0,
                installmentAmount,
                startDate: new Date(dto.startDate),
            },
        });
        if (dto.transactionId) {
            await this.generateInstallmentSchedule(plan.id, dto.transactionId, {
                numberOfInstallments: dto.numberOfInstallments,
                installmentAmount,
                frequency: dto.frequency,
                startDate: new Date(dto.startDate),
            });
        }
        return plan;
    }
    async findById(id) {
        const plan = await this.prisma.installmentPlan.findUnique({
            where: { id },
            include: {
                asset: true,
                leadAgent: {
                    include: {
                        user: {
                            select: {
                                name: true,
                                email: true,
                            },
                        },
                    },
                },
                closerAgent: {
                    include: {
                        user: {
                            select: {
                                name: true,
                                email: true,
                            },
                        },
                    },
                },
                installments: {
                    orderBy: {
                        dueDate: "asc",
                    },
                },
            },
        });
        if (!plan) {
            throw new common_1.NotFoundException(`Installment plan with ID ${id} not found`);
        }
        return plan;
    }
    async getInstallmentSchedule(planId) {
        const plan = await this.findById(planId);
        return plan.installments;
    }
    async recordPayment(planId, installmentId, data) {
        const plan = await this.findById(planId);
        const installment = await this.prisma.installment.findUnique({
            where: { id: installmentId },
        });
        if (!installment) {
            throw new common_1.NotFoundException(`Installment with ID ${installmentId} not found`);
        }
        const updatedInstallment = await this.prisma.installment.update({
            where: { id: installmentId },
            data: {
                paidAmount: installment.paidAmount + data.amount,
                status: installment.paidAmount + data.amount >= installment.amount ? "PAID" : "PARTIAL",
                paidDate: new Date(),
                paymentMethod: data.paymentMethod,
            },
        });
        const newPaidAmount = plan.paidAmount + data.amount;
        const completedInstallments = await this.prisma.installment.count({
            where: {
                installmentPlanId: planId,
                status: "PAID",
            },
        });
        const nextInstallment = await this.prisma.installment.findFirst({
            where: {
                installmentPlanId: planId,
                status: { in: ["PENDING", "UPCOMING", "OVERDUE"] },
            },
            orderBy: {
                dueDate: "asc",
            },
        });
        const isCompleted = newPaidAmount >= plan.remainingBalance;
        await this.prisma.installmentPlan.update({
            where: { id: planId },
            data: {
                paidAmount: newPaidAmount,
                completedInstallments,
                nextDueDate: nextInstallment?.dueDate || null,
                status: isCompleted ? "COMPLETED" : "ACTIVE",
            },
        });
        await this.notificationService.notifyInstallmentPaymentRecorded({
            planId,
            installmentId,
            paidAmount: data.amount,
            paymentMethod: data.paymentMethod,
            buyerName: plan.buyerName,
            assetName: plan.asset?.name,
        });
        return updatedInstallment;
    }
    async recordPaymentByInstallmentId(installmentId, data) {
        const installment = await this.prisma.installment.findUnique({
            where: { id: installmentId },
        });
        if (!installment) {
            throw new common_1.NotFoundException(`Installment with ID ${installmentId} not found`);
        }
        if (!installment.installmentPlanId) {
            throw new common_1.NotFoundException(`Installment ${installmentId} has no associated plan`);
        }
        return this.recordPayment(installment.installmentPlanId, installmentId, data);
    }
    async updatePlanStatus(planId, status) {
        const plan = await this.prisma.installmentPlan.findUnique({ where: { id: planId } });
        if (!plan)
            throw new common_1.NotFoundException(`Installment plan ${planId} not found`);
        const updated = await this.prisma.installmentPlan.update({
            where: { id: planId },
            data: { status: status.toUpperCase() },
        });
        if (status.toUpperCase() === 'COMPLETED') {
            await this.notificationService.notifyInstallmentPlanCompleted(planId);
        }
        return updated;
    }
    async sendPaymentReminder(data) {
        const installment = await this.prisma.installment.findUnique({
            where: { id: data.installmentId },
            include: {
                installmentPlan: {
                    include: {
                        asset: { select: { name: true } },
                        leadAgent: { include: { user: { select: { name: true, email: true } } } },
                    },
                },
            },
        });
        if (!installment) {
            throw new common_1.NotFoundException(`Installment with ID ${data.installmentId} not found`);
        }
        const agentEmail = installment.installmentPlan?.leadAgent?.user?.email || 'unknown';
        console.log(`Sending ${data.method} reminder for asset "${installment.installmentPlan?.asset?.name}" to agent ${agentEmail}`);
        return {
            message: "Reminder sent successfully",
            installmentId: data.installmentId,
            method: data.method,
            sentAt: new Date(),
        };
    }
    async getStats() {
        const [activePlans, completedPlans, totalOutstanding, totalCollected, overduePayments,] = await Promise.all([
            this.prisma.installmentPlan.count({ where: { status: "ACTIVE" } }),
            this.prisma.installmentPlan.count({ where: { status: "COMPLETED" } }),
            this.prisma.installmentPlan.aggregate({
                where: { status: "ACTIVE" },
                _sum: {
                    remainingBalance: true,
                    paidAmount: true,
                },
            }),
            this.prisma.installmentPlan.aggregate({
                _sum: {
                    paidAmount: true,
                },
            }),
            this.prisma.installment.count({
                where: { status: "OVERDUE" },
            }),
        ]);
        const outstanding = (totalOutstanding._sum.remainingBalance || 0) -
            (totalOutstanding._sum.paidAmount || 0);
        return {
            activePlans,
            completedPlans,
            totalOutstanding: outstanding,
            totalCollected: totalCollected._sum.paidAmount || 0,
            overduePayments,
        };
    }
    async updateInstallmentStatuses() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        await this.prisma.installment.updateMany({
            where: {
                dueDate: { lt: today },
                status: { in: ["PENDING", "UPCOMING"] },
            },
            data: {
                status: "OVERDUE",
            },
        });
        const weekFromNow = new Date(today);
        weekFromNow.setDate(weekFromNow.getDate() + 7);
        await this.prisma.installment.updateMany({
            where: {
                dueDate: { lte: weekFromNow, gte: today },
                status: "UPCOMING",
            },
            data: {
                status: "PENDING",
            },
        });
    }
    async generateInstallmentSchedule(planId, transactionId, data) {
        const installments = [];
        const { numberOfInstallments, installmentAmount, frequency, startDate } = data;
        for (let i = 0; i < numberOfInstallments; i++) {
            const dueDate = this.calculateDueDate(startDate, frequency, i);
            installments.push({
                installmentPlanId: planId,
                transactionId,
                dueDate,
                amount: installmentAmount,
                paidAmount: 0,
                status: i === 0 ? "PENDING" : "UPCOMING",
            });
        }
        await this.prisma.installment.createMany({
            data: installments,
        });
    }
    calculateDueDate(startDate, frequency, index) {
        const dueDate = new Date(startDate);
        switch (frequency.toLowerCase()) {
            case "weekly":
                dueDate.setDate(dueDate.getDate() + (index * 7));
                break;
            case "bi-weekly":
                dueDate.setDate(dueDate.getDate() + (index * 14));
                break;
            case "monthly":
                dueDate.setMonth(dueDate.getMonth() + index);
                break;
            case "quarterly":
                dueDate.setMonth(dueDate.getMonth() + (index * 3));
                break;
            default:
                dueDate.setMonth(dueDate.getMonth() + index);
        }
        return dueDate;
    }
};
exports.InstallmentsService = InstallmentsService;
exports.InstallmentsService = InstallmentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object, typeof (_b = typeof notification_service_1.NotificationService !== "undefined" && notification_service_1.NotificationService) === "function" ? _b : Object])
], InstallmentsService);


/***/ }),
/* 74 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SalesModule = void 0;
const common_1 = __webpack_require__(3);
const sales_controller_1 = __webpack_require__(75);
const sales_service_1 = __webpack_require__(76);
const prisma_module_1 = __webpack_require__(37);
let SalesModule = class SalesModule {
};
exports.SalesModule = SalesModule;
exports.SalesModule = SalesModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        controllers: [sales_controller_1.SalesController],
        providers: [sales_service_1.SalesService],
    })
], SalesModule);


/***/ }),
/* 75 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SalesController = void 0;
const common_1 = __webpack_require__(3);
const sales_service_1 = __webpack_require__(76);
let SalesController = class SalesController {
    constructor(svc) {
        this.svc = svc;
    }
    async mySales(req) {
        return this.svc.findByUser(req.user.id);
    }
    async all() {
        return this.svc.findAll();
    }
    async summary() {
        return this.svc.getSalesSummary();
    }
};
exports.SalesController = SalesController;
__decorate([
    (0, common_1.Get)('me'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SalesController.prototype, "mySales", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SalesController.prototype, "all", null);
__decorate([
    (0, common_1.Get)('summary'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SalesController.prototype, "summary", null);
exports.SalesController = SalesController = __decorate([
    (0, common_1.Controller)('sales'),
    __metadata("design:paramtypes", [typeof (_a = typeof sales_service_1.SalesService !== "undefined" && sales_service_1.SalesService) === "function" ? _a : Object])
], SalesController);


/***/ }),
/* 76 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SalesService = void 0;
const common_1 = __webpack_require__(3);
const prisma_service_1 = __webpack_require__(14);
let SalesService = class SalesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findByUser(userId) {
        return this.prisma.transaction.findMany({
            where: { buyerId: userId },
            include: {
                asset: { select: { id: true, name: true, type: true } },
                leadAgent: { include: { user: { select: { id: true, name: true } } } },
                closerAgent: { include: { user: { select: { id: true, name: true } } } },
                installments: true,
            },
            orderBy: { date: 'desc' },
        });
    }
    async findAll() {
        return this.prisma.transaction.findMany({
            where: { status: 'COMPLETED' },
            include: {
                asset: { select: { id: true, name: true, type: true } },
                buyer: { select: { id: true, name: true, email: true } },
                company: { select: { id: true, name: true } },
                leadAgent: { include: { user: { select: { id: true, name: true } } } },
                closerAgent: { include: { user: { select: { id: true, name: true } } } },
            },
            orderBy: { date: 'desc' },
        });
    }
    async getSalesSummary() {
        const agg = await this.prisma.transaction.aggregate({
            where: { status: 'COMPLETED' },
            _sum: { totalAmount: true, totalCommission: true },
            _count: true,
        });
        return {
            totalSales: agg._count,
            totalRevenue: agg._sum.totalAmount || 0,
            totalCommission: agg._sum.totalCommission || 0,
            avgDealSize: agg._count > 0 ? (agg._sum.totalAmount || 0) / agg._count : 0,
        };
    }
};
exports.SalesService = SalesService;
exports.SalesService = SalesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], SalesService);


/***/ }),
/* 77 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.InvestmentsModule = void 0;
const common_1 = __webpack_require__(3);
const investments_controller_1 = __webpack_require__(78);
const investments_service_1 = __webpack_require__(79);
const prisma_module_1 = __webpack_require__(37);
let InvestmentsModule = class InvestmentsModule {
};
exports.InvestmentsModule = InvestmentsModule;
exports.InvestmentsModule = InvestmentsModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        controllers: [investments_controller_1.InvestmentsController],
        providers: [investments_service_1.InvestmentsService],
    })
], InvestmentsModule);


/***/ }),
/* 78 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.InvestmentsController = void 0;
const common_1 = __webpack_require__(3);
const investments_service_1 = __webpack_require__(79);
const jwt_auth_guard_1 = __webpack_require__(32);
const roles_decorator_1 = __webpack_require__(46);
const roles_guard_1 = __webpack_require__(45);
let InvestmentsController = class InvestmentsController {
    constructor(svc) {
        this.svc = svc;
    }
    async myInvestments(req) {
        if (!req.user?.id) {
            throw new common_1.UnauthorizedException('Missing or invalid auth token.');
        }
        return this.svc.findByUser(req.user.id);
    }
    async summary(req) {
        if (!req.user?.id) {
            throw new common_1.UnauthorizedException('Missing or invalid auth token.');
        }
        return this.svc.getInvestmentSummary(req.user.id);
    }
    async createInvestment(req, body) {
        if (!req.user?.id) {
            throw new common_1.UnauthorizedException('Missing or invalid auth token.');
        }
        return this.svc.createInvestorPurchase(req.user.id, body);
    }
    async all() {
        return this.svc.findAll();
    }
};
exports.InvestmentsController = InvestmentsController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('me'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], InvestmentsController.prototype, "myInvestments", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('summary'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], InvestmentsController.prototype, "summary", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], InvestmentsController.prototype, "createInvestment", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN'),
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], InvestmentsController.prototype, "all", null);
exports.InvestmentsController = InvestmentsController = __decorate([
    (0, common_1.Controller)('investments'),
    __metadata("design:paramtypes", [typeof (_a = typeof investments_service_1.InvestmentsService !== "undefined" && investments_service_1.InvestmentsService) === "function" ? _a : Object])
], InvestmentsController);


/***/ }),
/* 79 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.InvestmentsService = void 0;
const common_1 = __webpack_require__(3);
const prisma_service_1 = __webpack_require__(14);
const serial_id_helper_1 = __webpack_require__(30);
let InvestmentsService = class InvestmentsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findByUser(userId) {
        try {
            return this.prisma.transaction.findMany({
                where: { buyerId: userId },
                include: {
                    asset: { select: { id: true, name: true, type: true, location: true, images: true } },
                    company: { select: { id: true, name: true } },
                    installments: { orderBy: { dueDate: 'asc' } },
                    installmentPlans: true,
                },
                orderBy: { date: 'desc' },
            });
        }
        catch (error) {
            return this.prisma.transaction.findMany({
                where: { buyerId: userId },
                include: {
                    asset: { select: { id: true, name: true, type: true, location: true, images: true } },
                    company: { select: { id: true, name: true } },
                },
                orderBy: { date: 'desc' },
            });
        }
    }
    async findAll() {
        return this.prisma.transaction.findMany({
            include: {
                asset: { select: { id: true, name: true, type: true } },
                buyer: { select: { id: true, name: true, email: true } },
                company: { select: { id: true, name: true } },
            },
            orderBy: { date: 'desc' },
        });
    }
    async getInvestmentSummary(userId) {
        const agg = await this.prisma.transaction.aggregate({
            where: { buyerId: userId },
            _sum: { totalAmount: true },
            _count: true,
        });
        return {
            totalInvestments: agg._count,
            totalInvested: agg._sum.totalAmount || 0,
        };
    }
    async createInvestorPurchase(userId, data) {
        if (!data.amount || data.amount <= 0) {
            throw new common_1.BadRequestException('Amount must be a positive number.');
        }
        if (!data.assetId) {
            throw new common_1.BadRequestException('assetId is required to record an investment.');
        }
        const serialId = await (0, serial_id_helper_1.generateSerialId)(this.prisma, 'TRN');
        const transaction = await this.prisma.transaction.create({
            data: {
                serialId,
                buyerId: userId,
                assetId: data.assetId,
                totalAmount: data.amount,
                paymentType: 'OUTRIGHT',
                leadCommission: 0,
                closerCommission: 0,
                totalCommission: 0,
                ownershipType: 'Full',
            },
            include: {
                asset: { select: { id: true, name: true, type: true, location: true } },
            },
        });
        const asset = await this.prisma.asset.findUnique({
            where: { id: data.assetId },
            select: { availableUnits: true },
        });
        if (asset?.availableUnits != null && asset.availableUnits > 0) {
            const newUnits = asset.availableUnits - 1;
            await this.prisma.asset.update({
                where: { id: data.assetId },
                data: {
                    availableUnits: newUnits,
                    ...(newUnits === 0 && { status: 'sold' }),
                },
            });
        }
        return transaction;
    }
};
exports.InvestmentsService = InvestmentsService;
exports.InvestmentsService = InvestmentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], InvestmentsService);


/***/ }),
/* 80 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DashboardModule = void 0;
const common_1 = __webpack_require__(3);
const dashboard_service_1 = __webpack_require__(81);
const dashboard_controller_1 = __webpack_require__(82);
const prisma_module_1 = __webpack_require__(37);
let DashboardModule = class DashboardModule {
};
exports.DashboardModule = DashboardModule;
exports.DashboardModule = DashboardModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        providers: [dashboard_service_1.DashboardService],
        controllers: [dashboard_controller_1.DashboardController],
    })
], DashboardModule);


/***/ }),
/* 81 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DashboardService = void 0;
const common_1 = __webpack_require__(3);
const prisma_service_1 = __webpack_require__(14);
let DashboardService = class DashboardService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getOverview() {
        const [totalAgents, activeClusters, totalRevenue, totalCommissions, activeAssets, assetTypeCounts, salesVolume,] = await Promise.all([
            this.prisma.user.count({ where: { role: 'AGENT' } }),
            this.prisma.cluster.count({ where: { status: 'active' } }),
            this.prisma.transaction.aggregate({
                where: { status: 'COMPLETED' },
                _sum: { totalAmount: true },
            }),
            this.prisma.transaction.aggregate({
                where: { status: 'COMPLETED' },
                _sum: { totalCommission: true },
            }),
            this.prisma.asset.count({ where: { status: 'published' } }),
            this.prisma.asset.groupBy({
                by: ['type'],
                _count: { type: true },
                where: { type: { not: null } },
            }),
            this.prisma.$queryRawUnsafe(`
        SELECT 
          TO_CHAR("createdAt", 'YYYY-MM') AS month,
          COUNT(*) AS sales,
          SUM("totalAmount") AS revenue
        FROM "Transaction"
        WHERE status = 'COMPLETED'
        GROUP BY month
        ORDER BY month
        LIMIT 12
      `),
        ]);
        function calcChange(current, previous) {
            if (previous === undefined || previous === null)
                return 'N/A';
            if (previous === 0)
                return current > 0 ? '+100.0%' : '0.0%';
            const change = ((current - previous) / previous) * 100;
            return `${change >= 0 ? '+' : ''}${change.toFixed(1)}%`;
        }
        const prevAgents = 0;
        const prevClusters = 0;
        const prevRevenue = 0;
        const prevCommissions = 0;
        const kpis = [
            {
                title: "Total Agents",
                value: totalAgents,
                icon: "building",
                trend: "up",
                change: calcChange(totalAgents, prevAgents),
            },
            {
                title: "Active Clusters",
                value: activeClusters,
                icon: "trendingUp",
                trend: "up",
                change: calcChange(activeClusters, prevClusters),
            },
            {
                title: "Total Revenue",
                value: `₦${(totalRevenue._sum.totalAmount || 0).toLocaleString()}`,
                icon: "dollarSign",
                trend: "up",
                change: calcChange(Number(totalRevenue._sum.totalAmount || 0), prevRevenue),
            },
            {
                title: "Total Commissions",
                value: `₦${(totalCommissions._sum.totalCommission || 0).toLocaleString()}`,
                icon: "receipt",
                trend: "up",
                change: calcChange(Number(totalCommissions._sum.totalCommission || 0), prevCommissions),
            },
        ];
        const colors = ["#4c51bf", "#10b981", "#f59e42", "#e53e3e", "#6b7280"];
        const assetDistribution = assetTypeCounts.map((item, idx) => ({
            name: item.type || "Other",
            value: item._count.type,
            color: colors[idx % colors.length],
        }));
        const salesVolumeData = salesVolume.map((row) => ({
            month: row.month,
            sales: Number(row.sales),
            revenue: Number(row.revenue) / 1000,
        }));
        return {
            kpis,
            assetDistribution,
            salesVolume: salesVolumeData,
        };
    }
    async getRecentTransactions() {
        return this.prisma.transaction.findMany({
            take: 10,
            orderBy: { date: 'desc' },
            include: {
                asset: { select: { id: true, name: true, type: true } },
                buyer: { select: { id: true, name: true } },
                company: { select: { id: true, name: true } },
                leadAgent: { include: { user: { select: { id: true, name: true } } } },
                closerAgent: { include: { user: { select: { id: true, name: true } } } },
            },
        });
    }
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], DashboardService);


/***/ }),
/* 82 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DashboardController = void 0;
const common_1 = __webpack_require__(3);
const dashboard_service_1 = __webpack_require__(81);
const passport_1 = __webpack_require__(11);
let DashboardController = class DashboardController {
    constructor(dashboardService) {
        this.dashboardService = dashboardService;
    }
    getOverview() {
        return this.dashboardService.getOverview();
    }
    getRecentTransactions() {
        return this.dashboardService.getRecentTransactions();
    }
};
exports.DashboardController = DashboardController;
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Get)('overview'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DashboardController.prototype, "getOverview", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Get)('recent-transactions'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DashboardController.prototype, "getRecentTransactions", null);
exports.DashboardController = DashboardController = __decorate([
    (0, common_1.Controller)('dashboard'),
    __metadata("design:paramtypes", [typeof (_a = typeof dashboard_service_1.DashboardService !== "undefined" && dashboard_service_1.DashboardService) === "function" ? _a : Object])
], DashboardController);


/***/ }),
/* 83 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ReportsModule = void 0;
const common_1 = __webpack_require__(3);
const reports_controller_1 = __webpack_require__(84);
const reports_service_1 = __webpack_require__(85);
const prisma_module_1 = __webpack_require__(37);
let ReportsModule = class ReportsModule {
};
exports.ReportsModule = ReportsModule;
exports.ReportsModule = ReportsModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        controllers: [reports_controller_1.ReportsController],
        providers: [reports_service_1.ReportsService],
        exports: [reports_service_1.ReportsService],
    })
], ReportsModule);


/***/ }),
/* 84 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ReportsController = void 0;
const common_1 = __webpack_require__(3);
const reports_service_1 = __webpack_require__(85);
const express_1 = __webpack_require__(86);
const roles_guard_1 = __webpack_require__(45);
const passport_1 = __webpack_require__(11);
let ReportsController = class ReportsController {
    constructor(reportsService) {
        this.reportsService = reportsService;
    }
    async getSalesReport(dateRange) {
        const report = await this.reportsService.getSalesReport(dateRange);
        return {
            success: true,
            salesData: report.salesByMonth,
            topSalesByAsset: report.topAssets.map(a => ({
                asset: a.name,
                sales: a.count,
                revenue: a.revenue,
                location: a.location,
            })),
            assetTypeBreakdown: report.salesByType.map(t => ({
                type: t.type,
                count: t.count,
                totalValue: t.revenue,
            })),
            summary: report.summary,
            message: 'Sales report fetched successfully'
        };
    }
    async getAssetPerformance(dateRange) {
        const data = await this.reportsService.getAssetPerformance(dateRange);
        return { success: true, ...data };
    }
    async getAgentPerformance(dateRange) {
        const report = await this.reportsService.getAgentPerformance(dateRange);
        return {
            success: true,
            data: report.data,
            summary: report.summary,
            message: 'Agent performance report fetched successfully'
        };
    }
    async getClusterPerformance(dateRange) {
        const report = await this.reportsService.getClusterPerformance(dateRange);
        return {
            success: true,
            data: report.data,
            summary: report.summary,
            message: 'Cluster performance report fetched successfully'
        };
    }
    async exportReport(type, res, dateRange) {
        const buffer = await this.reportsService.exportReport(type, dateRange);
        res.header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.header('Content-Disposition', `attachment; filename=buyops-${type}-report-${dateRange || 'recent'}.xlsx`);
        return res.send(buffer);
    }
    async getInvestmentReports(dateRange) {
        const trends = await this.reportsService.getInvestmentTrends(dateRange);
        const categories = await this.reportsService.getInvestorCategories(dateRange);
        return {
            success: true,
            investmentTrends: trends,
            investorCategories: categories,
            message: 'Investment report fetched successfully'
        };
    }
    async getCommissionReports(dateRange) {
        const report = await this.reportsService.getCommissionReports(dateRange);
        return {
            success: true,
            ...report,
            message: 'Commission report fetched successfully'
        };
    }
    async getPerformanceReports(dateRange) {
        const metrics = await this.reportsService.getConversionMetrics(dateRange);
        const clusters = await this.reportsService.getClusterPerformance(dateRange);
        return {
            success: true,
            conversionMetrics: metrics,
            clusterPerformance: clusters.data.map(c => ({
                cluster: c.name,
                target: 100,
                achieved: c.closedDeals,
                performance: ((c.closedDeals / 100) * 100).toFixed(0),
            })),
            message: 'Performance report fetched successfully'
        };
    }
};
exports.ReportsController = ReportsController;
__decorate([
    (0, common_1.Get)('sales'),
    __param(0, (0, common_1.Query)('dateRange')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getSalesReport", null);
__decorate([
    (0, common_1.Get)('assets'),
    __param(0, (0, common_1.Query)('dateRange')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getAssetPerformance", null);
__decorate([
    (0, common_1.Get)('agents'),
    __param(0, (0, common_1.Query)('dateRange')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getAgentPerformance", null);
__decorate([
    (0, common_1.Get)('clusters'),
    __param(0, (0, common_1.Query)('dateRange')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getClusterPerformance", null);
__decorate([
    (0, common_1.Get)('export'),
    __param(0, (0, common_1.Query)('type')),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Query)('dateRange')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_b = typeof express_1.Response !== "undefined" && express_1.Response) === "function" ? _b : Object, String]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "exportReport", null);
__decorate([
    (0, common_1.Get)('investments'),
    __param(0, (0, common_1.Query)('dateRange')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getInvestmentReports", null);
__decorate([
    (0, common_1.Get)('commissions'),
    __param(0, (0, common_1.Query)('dateRange')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getCommissionReports", null);
__decorate([
    (0, common_1.Get)('performance'),
    __param(0, (0, common_1.Query)('dateRange')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getPerformanceReports", null);
exports.ReportsController = ReportsController = __decorate([
    (0, common_1.Controller)('reports'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [typeof (_a = typeof reports_service_1.ReportsService !== "undefined" && reports_service_1.ReportsService) === "function" ? _a : Object])
], ReportsController);


/***/ }),
/* 85 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ReportsService = void 0;
const common_1 = __webpack_require__(3);
const prisma_service_1 = __webpack_require__(14);
const ExcelJS = __importStar(__webpack_require__(67));
const client_1 = __webpack_require__(15);
let ReportsService = class ReportsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    getDateFilter(dateRange) {
        const where = {};
        const now = new Date();
        switch (dateRange) {
            case '7d': {
                const d = new Date();
                d.setDate(d.getDate() - 7);
                where.date = { gte: d };
                break;
            }
            case '30d': {
                const d = new Date();
                d.setDate(d.getDate() - 30);
                where.date = { gte: d };
                break;
            }
            case '90d': {
                const d = new Date();
                d.setDate(d.getDate() - 90);
                where.date = { gte: d };
                break;
            }
            case 'ytd': {
                where.date = { gte: new Date(now.getFullYear(), 0, 1) };
                break;
            }
            case '6m': {
                const d = new Date();
                d.setMonth(d.getMonth() - 6);
                where.date = { gte: d };
                break;
            }
            case '1y': {
                const d = new Date();
                d.setFullYear(d.getFullYear() - 1);
                where.date = { gte: d };
                break;
            }
            case 'all': {
                break;
            }
            default: {
                const d = new Date();
                d.setDate(d.getDate() - 30);
                where.date = { gte: d };
                break;
            }
        }
        return where;
    }
    getLeadDateFilter(dateRange) {
        const where = {};
        const now = new Date();
        switch (dateRange) {
            case '7d': {
                const d = new Date();
                d.setDate(d.getDate() - 7);
                where.createdAt = { gte: d };
                break;
            }
            case '30d': {
                const d = new Date();
                d.setDate(d.getDate() - 30);
                where.createdAt = { gte: d };
                break;
            }
            case '90d': {
                const d = new Date();
                d.setDate(d.getDate() - 90);
                where.createdAt = { gte: d };
                break;
            }
            case 'ytd': {
                where.createdAt = { gte: new Date(now.getFullYear(), 0, 1) };
                break;
            }
            case '6m': {
                const d = new Date();
                d.setMonth(d.getMonth() - 6);
                where.createdAt = { gte: d };
                break;
            }
            case '1y': {
                const d = new Date();
                d.setFullYear(d.getFullYear() - 1);
                where.createdAt = { gte: d };
                break;
            }
            case 'all': {
                break;
            }
            default: {
                const d = new Date();
                d.setDate(d.getDate() - 30);
                where.createdAt = { gte: d };
                break;
            }
        }
        return where;
    }
    getLeadPreviousPeriodFilter(dateRange) {
        const now = new Date();
        switch (dateRange) {
            case '7d': {
                const s = new Date();
                s.setDate(s.getDate() - 14);
                const e = new Date();
                e.setDate(e.getDate() - 7);
                return { createdAt: { gte: s, lt: e } };
            }
            case '30d': {
                const s = new Date();
                s.setDate(s.getDate() - 60);
                const e = new Date();
                e.setDate(e.getDate() - 30);
                return { createdAt: { gte: s, lt: e } };
            }
            case '90d': {
                const s = new Date();
                s.setDate(s.getDate() - 180);
                const e = new Date();
                e.setDate(e.getDate() - 90);
                return { createdAt: { gte: s, lt: e } };
            }
            case 'ytd': {
                return { createdAt: { gte: new Date(now.getFullYear() - 1, 0, 1), lt: new Date(now.getFullYear() - 1, 11, 31) } };
            }
            default: return null;
        }
    }
    getPreviousPeriodFilter(dateRange) {
        const now = new Date();
        switch (dateRange) {
            case '7d': {
                const s = new Date();
                s.setDate(s.getDate() - 14);
                const e = new Date();
                e.setDate(e.getDate() - 7);
                return { date: { gte: s, lt: e } };
            }
            case '30d': {
                const s = new Date();
                s.setDate(s.getDate() - 60);
                const e = new Date();
                e.setDate(e.getDate() - 30);
                return { date: { gte: s, lt: e } };
            }
            case '90d': {
                const s = new Date();
                s.setDate(s.getDate() - 180);
                const e = new Date();
                e.setDate(e.getDate() - 90);
                return { date: { gte: s, lt: e } };
            }
            case 'ytd': {
                return { date: { gte: new Date(now.getFullYear() - 1, 0, 1), lt: new Date(now.getFullYear() - 1, 11, 31) } };
            }
            default: return null;
        }
    }
    async getSalesReport(dateRange) {
        const dateFilter = this.getDateFilter(dateRange);
        const prevFilter = this.getPreviousPeriodFilter(dateRange);
        const [transactions, totalRevenueAgg, totalCount, prevRevenueAgg, prevCount] = await Promise.all([
            this.prisma.transaction.findMany({
                where: { status: 'COMPLETED', ...dateFilter },
                include: { asset: { select: { name: true, type: true } } },
                orderBy: { date: 'desc' },
            }),
            this.prisma.transaction.aggregate({ where: { status: 'COMPLETED', ...dateFilter }, _sum: { totalAmount: true } }),
            this.prisma.transaction.count({ where: { status: 'COMPLETED', ...dateFilter } }),
            prevFilter
                ? this.prisma.transaction.aggregate({ where: { status: 'COMPLETED', ...prevFilter }, _sum: { totalAmount: true } })
                : { _sum: { totalAmount: 0 } },
            prevFilter ? this.prisma.transaction.count({ where: { status: 'COMPLETED', ...prevFilter } }) : 0,
        ]);
        const totalRevenue = totalRevenueAgg._sum.totalAmount || 0;
        const prevRevenue = prevRevenueAgg._sum.totalAmount || 0;
        const avgDealSize = totalCount > 0 ? totalRevenue / totalCount : 0;
        const prevAvg = prevCount > 0 ? prevRevenue / prevCount : 0;
        const leadDateFilter = this.getLeadDateFilter(dateRange);
        const leadPrevFilter = this.getLeadPreviousPeriodFilter(dateRange);
        const totalLeads = await this.prisma.lead.count({ where: leadDateFilter });
        const conversionRate = totalLeads > 0 ? ((totalCount / totalLeads) * 100).toFixed(1) : 0;
        const prevLeads = leadPrevFilter ? await this.prisma.lead.count({ where: leadPrevFilter }) : 0;
        const prevConversionRate = prevLeads > 0 ? (prevCount / prevLeads) * 100 : 0;
        const conversionChange = prevConversionRate > 0
            ? ((parseFloat(conversionRate) - prevConversionRate) / prevConversionRate) * 100
            : 0;
        return {
            summary: {
                totalRevenue,
                totalTransactions: totalCount,
                avgDealSize,
                revenueChange: prevRevenue > 0 ? ((totalRevenue - prevRevenue) / prevRevenue) * 100 : 0,
                transactionChange: prevCount > 0 ? ((totalCount - prevCount) / prevCount) * 100 : 0,
                avgDealSizeChange: prevAvg > 0 ? ((avgDealSize - prevAvg) / prevAvg) * 100 : 0,
                conversionRate,
                conversionChange,
            },
            salesByMonth: this.processSalesByMonth(transactions),
            topAssets: (await this.getTopAssetsBySales(dateFilter)).slice(0, 10),
            salesByType: this.processSalesByType(transactions),
        };
    }
    processSalesByMonth(transactions) {
        const data = {};
        transactions.forEach((tx) => {
            const d = new Date(tx.date);
            const key = d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
            if (!data[key])
                data[key] = { revenue: 0, transactions: 0, commission: 0 };
            data[key].revenue += tx.totalAmount || 0;
            data[key].transactions += 1;
            data[key].commission += tx.totalCommission || 0;
        });
        return Object.entries(data).map(([month, d]) => ({
            month, revenue: d.revenue, transactions: d.transactions,
            avgValue: d.transactions > 0 ? d.revenue / d.transactions : 0, commission: d.commission,
        }));
    }
    async getTopAssetsBySales(dateFilter) {
        const result = await this.prisma.transaction.groupBy({
            by: ['assetId'],
            where: { status: 'COMPLETED', ...dateFilter },
            _sum: { totalAmount: true, totalCommission: true },
            _count: true,
            orderBy: { _sum: { totalAmount: 'desc' } },
            take: 10,
        });
        if (!result.length)
            return [];
        const assets = await this.prisma.asset.findMany({
            where: { id: { in: result.map((r) => r.assetId) } },
            select: { id: true, name: true, type: true, location: true },
        });
        const map = new Map(assets.map((a) => [a.id, a]));
        return result.map((r) => {
            const a = map.get(r.assetId);
            return {
                name: a?.name || 'Unknown', revenue: r._sum.totalAmount || 0,
                count: r._count, commission: r._sum.totalCommission || 0,
                type: a?.type || 'Unknown', location: a?.location || 'Unknown',
            };
        });
    }
    processSalesByType(transactions) {
        const data = {};
        transactions.forEach((tx) => {
            const type = tx.paymentType || 'Standard';
            if (!data[type])
                data[type] = { revenue: 0, count: 0, commission: 0 };
            data[type].revenue += tx.totalAmount || 0;
            data[type].count += 1;
            data[type].commission += tx.totalCommission || 0;
        });
        return Object.entries(data).map(([type, d]) => ({
            type, revenue: d.revenue, count: d.count,
            avgValue: d.count > 0 ? d.revenue / d.count : 0, commission: d.commission,
        })).sort((a, b) => b.revenue - a.revenue);
    }
    async getAgentPerformance(dateRange) {
        const dateFilter = this.getDateFilter(dateRange);
        const agents = await this.prisma.agent.findMany({
            where: { status: 'ACTIVE' },
            include: {
                user: { select: { name: true, email: true } },
                leadTransactions: {
                    where: { status: 'COMPLETED', ...dateFilter },
                    select: { totalAmount: true, leadCommission: true, earnedLeadCommission: true, totalCommission: true, earnedTotalCommission: true, date: true },
                },
                closerTransactions: {
                    where: { status: 'COMPLETED', ...dateFilter },
                    select: { totalAmount: true, closerCommission: true, earnedCloserCommission: true, totalCommission: true, earnedTotalCommission: true, date: true },
                },
                cluster: { select: { name: true } },
            },
        });
        const agentPerformance = agents.map((agent) => {
            const leadTxs = agent.leadTransactions || [];
            const closerTxs = agent.closerTransactions || [];
            const all = [...leadTxs, ...closerTxs];
            const revenue = all.reduce((s, tx) => s + (tx.totalAmount || 0), 0);
            const leadComm = leadTxs.reduce((s, tx) => s + (tx.earnedLeadCommission || tx.leadCommission || 0), 0);
            const closerComm = closerTxs.reduce((s, tx) => s + (tx.earnedCloserCommission || tx.closerCommission || 0), 0);
            const totalComm = all.reduce((s, tx) => s + (tx.earnedTotalCommission || tx.totalCommission || 0), 0);
            return {
                name: agent.user?.name || 'Unknown',
                email: agent.user?.email || '',
                cluster: agent.cluster?.name || 'Unassigned',
                closedDeals: all.length,
                revenue, totalCommission: totalComm, leadCommission: leadComm, closerCommission: closerComm,
                conversionRate: '0.0',
                avgDealSize: all.length > 0 ? revenue / all.length : 0,
            };
        }).sort((a, b) => b.revenue - a.revenue);
        return {
            data: agentPerformance,
            summary: {
                totalAgents: agentPerformance.length,
                totalRevenue: agentPerformance.reduce((s, a) => s + a.revenue, 0),
                totalCommission: agentPerformance.reduce((s, a) => s + a.totalCommission, 0),
                avgConversionRate: '0.0',
            },
        };
    }
    async getClusterPerformance(dateRange) {
        const dateFilter = this.getDateFilter(dateRange);
        const clusters = await this.prisma.cluster.findMany({
            where: { status: 'active' },
            include: {
                agents: {
                    where: { status: 'ACTIVE' },
                    include: {
                        user: { select: { name: true, email: true } },
                        leadTransactions: {
                            where: { status: 'COMPLETED', ...dateFilter },
                            select: { totalAmount: true, earnedLeadCommission: true, earnedTotalCommission: true, totalCommission: true },
                        },
                        closerTransactions: {
                            where: { status: 'COMPLETED', ...dateFilter },
                            select: { totalAmount: true, earnedCloserCommission: true, earnedTotalCommission: true, totalCommission: true },
                        },
                    },
                },
            },
            orderBy: { name: 'asc' },
        });
        const clusterPerformance = clusters.map((cluster) => {
            let agentsCount = 0, closedDeals = 0, revenue = 0, totalCommission = 0;
            cluster.agents.forEach((agent) => {
                const all = [...(agent.leadTransactions || []), ...(agent.closerTransactions || [])];
                if (all.length > 0) {
                    agentsCount++;
                    closedDeals += all.length;
                    revenue += all.reduce((s, tx) => s + (tx.totalAmount || 0), 0);
                    totalCommission += all.reduce((s, tx) => s + (tx.earnedTotalCommission || tx.totalCommission || 0), 0);
                }
            });
            return {
                name: cluster.name, agents: agentsCount, closedDeals, revenue, totalCommission,
                avgRevenuePerAgent: agentsCount > 0 ? revenue / agentsCount : 0,
                avgDealsPerAgent: agentsCount > 0 ? closedDeals / agentsCount : 0,
                avgCommissionPerAgent: agentsCount > 0 ? totalCommission / agentsCount : 0,
            };
        }).sort((a, b) => b.revenue - a.revenue);
        const totals = clusterPerformance.reduce((acc, c) => ({
            agents: acc.agents + c.agents, revenue: acc.revenue + c.revenue,
            commission: acc.commission + c.totalCommission, deals: acc.deals + c.closedDeals,
        }), { agents: 0, revenue: 0, commission: 0, deals: 0 });
        return {
            data: clusterPerformance,
            summary: {
                totalClusters: clusterPerformance.length,
                totalAgents: totals.agents, totalRevenue: totals.revenue,
                totalCommission: totals.commission, totalClosedDeals: totals.deals,
                avgRevenuePerCluster: clusterPerformance.length > 0 ? totals.revenue / clusterPerformance.length : 0,
                avgAgentsPerCluster: clusterPerformance.length > 0 ? totals.agents / clusterPerformance.length : 0,
            },
        };
    }
    async exportReport(type, dateRange) {
        const workbook = new ExcelJS.Workbook();
        const ws = workbook.addWorksheet(type.charAt(0).toUpperCase() + type.slice(1));
        if (type === 'sales') {
            const data = await this.getSalesReport(dateRange);
            ws.addRow(['BuyOps - Sales Report']);
            ws.addRow([`Date Range: ${dateRange || 'Last 30 days'}`]);
            ws.addRow([`Generated: ${new Date().toLocaleDateString()}`]);
            ws.addRow([]);
            ws.addRow(['SUMMARY']);
            ws.addRow([]);
            ws.addRow(['Metric', 'Value', 'Change vs Previous Period']);
            ws.addRow(['Total Revenue', `₦${data.summary.totalRevenue.toLocaleString()}`, `${data.summary.revenueChange.toFixed(1)}%`]);
            ws.addRow(['Total Transactions', data.summary.totalTransactions, `${data.summary.transactionChange.toFixed(1)}%`]);
            ws.addRow(['Average Deal Size', `₦${data.summary.avgDealSize.toLocaleString()}`, `${data.summary.avgDealSizeChange.toFixed(1)}%`]);
            ws.addRow([]);
            ws.addRow(['SALES BY MONTH']);
            ws.addRow([]);
            ws.addRow(['Month', 'Revenue', 'Transactions', 'Average Value', 'Commission']);
            data.salesByMonth.forEach((r) => ws.addRow([r.month, `₦${r.revenue.toLocaleString()}`, r.transactions, `₦${r.avgValue.toLocaleString()}`, `₦${r.commission.toLocaleString()}`]));
            ws.addRow([]);
            ws.addRow(['TOP PERFORMING ASSETS']);
            ws.addRow([]);
            ws.addRow(['Asset Name', 'Revenue', 'Transactions', 'Commission', 'Type', 'Location']);
            data.topAssets.forEach((a) => ws.addRow([a.name, `₦${a.revenue.toLocaleString()}`, a.count, `₦${a.commission.toLocaleString()}`, a.type, a.location]));
        }
        else if (type === 'agents') {
            const data = await this.getAgentPerformance(dateRange);
            ws.addRow(['BuyOps - Agent Performance Report']);
            ws.addRow([`Date Range: ${dateRange || 'Last 30 days'}`]);
            ws.addRow([`Generated: ${new Date().toLocaleDateString()}`]);
            ws.addRow([]);
            ws.addRow(['SUMMARY']);
            ws.addRow([]);
            ws.addRow(['Total Agents', data.summary.totalAgents]);
            ws.addRow(['Total Revenue', `₦${data.summary.totalRevenue.toLocaleString()}`]);
            ws.addRow(['Total Commission', `₦${data.summary.totalCommission.toLocaleString()}`]);
            ws.addRow([]);
            ws.addRow(['AGENT PERFORMANCE']);
            ws.addRow([]);
            ws.addRow(['Name', 'Cluster', 'Closed Deals', 'Revenue', 'Total Commission', 'Lead Commission', 'Closer Commission', 'Avg Deal Size']);
            data.data.forEach((a) => ws.addRow([a.name, a.cluster, a.closedDeals, `₦${a.revenue.toLocaleString()}`, `₦${a.totalCommission.toLocaleString()}`, `₦${a.leadCommission.toLocaleString()}`, `₦${a.closerCommission.toLocaleString()}`, `₦${a.avgDealSize.toLocaleString()}`]));
        }
        else {
            const data = await this.getClusterPerformance(dateRange);
            ws.addRow(['BuyOps - Cluster Performance Report']);
            ws.addRow([`Date Range: ${dateRange || 'Last 30 days'}`]);
            ws.addRow([`Generated: ${new Date().toLocaleDateString()}`]);
            ws.addRow([]);
            ws.addRow(['SUMMARY']);
            ws.addRow([]);
            ws.addRow(['Total Clusters', data.summary.totalClusters]);
            ws.addRow(['Total Agents', data.summary.totalAgents]);
            ws.addRow(['Total Revenue', `₦${data.summary.totalRevenue.toLocaleString()}`]);
            ws.addRow([]);
            ws.addRow(['CLUSTER PERFORMANCE']);
            ws.addRow([]);
            ws.addRow(['Cluster Name', 'Agents', 'Closed Deals', 'Revenue', 'Total Commission', 'Avg Revenue/Agent', 'Avg Deals/Agent']);
            data.data.forEach((c) => ws.addRow([c.name, c.agents, c.closedDeals, `₦${c.revenue.toLocaleString()}`, `₦${c.totalCommission.toLocaleString()}`, `₦${c.avgRevenuePerAgent.toLocaleString()}`, c.avgDealsPerAgent.toFixed(1)]));
        }
        ws.getRow(1).font = { bold: true, size: 16 };
        ws.eachRow((row, i) => {
            if (i > 4) {
                const val = row.getCell(1).value;
                if (typeof val === 'string' && ['SUMMARY', 'SALES BY MONTH', 'TOP PERFORMING ASSETS', 'AGENT PERFORMANCE', 'CLUSTER PERFORMANCE'].includes(val)) {
                    row.font = { bold: true, size: 12 };
                    row.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE0E0E0' } };
                }
            }
        });
        ws.columns?.forEach((col) => {
            if (col && col.eachCell) {
                let max = 10;
                col.eachCell({ includeEmpty: true }, (cell) => { max = Math.max(max, (cell.value?.toString().length || 0) + 2); });
                col.width = Math.min(max, 40);
            }
        });
        const buffer = await workbook.xlsx.writeBuffer();
        return Buffer.from(buffer);
    }
    async getAssetPerformance(dateRange) {
        const statusAgg = await this.prisma.asset.groupBy({
            by: ['status'],
            _count: { status: true },
        });
        const colors = ["#4c51bf", "#10b981", "#f59e42", "#e53e3e", "#6b7280"];
        const assetPerformanceData = statusAgg.map((s, i) => ({
            name: s.status,
            value: s._count.status,
            color: colors[i % colors.length],
        }));
        const typeAgg = await this.prisma.asset.groupBy({
            by: ['type'],
            _count: { type: true },
        });
        const assets = await this.prisma.asset.findMany({
            select: { type: true, price: true },
        });
        const typeValueMap = {};
        assets.forEach(asset => {
            const type = asset.type || 'Unknown';
            const price = parseFloat(asset.price || '0');
            typeValueMap[type] = (typeValueMap[type] || 0) + price;
        });
        const assetTypeBreakdown = typeAgg.map(t => ({
            type: t.type,
            count: t._count.type,
            totalValue: typeValueMap[t.type || ''] || 0,
        }));
        return { assetPerformanceData, assetTypeBreakdown };
    }
    async getInvestmentTrends(dateRange) {
        const txs = await this.prisma.transaction.findMany({
            where: { status: 'COMPLETED', ...this.getDateFilter(dateRange) },
            select: { date: true, ownershipType: true, totalAmount: true }
        });
        const trends = {};
        txs.forEach(tx => {
            const d = new Date(tx.date);
            const key = d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
            if (!trends[key])
                trends[key] = { fractional: 0, full: 0 };
            if (tx.ownershipType === 'Fractional')
                trends[key].fractional += tx.totalAmount;
            else
                trends[key].full += tx.totalAmount;
        });
        return Object.entries(trends).map(([month, v]) => ({ month, ...v }));
    }
    async getInvestorCategories(dateRange) {
        const investors = await this.prisma.user.groupBy({
            by: ['role'],
            _count: { role: true },
        });
        const txs = await this.prisma.transaction.findMany({
            where: { status: 'COMPLETED', ...this.getDateFilter(dateRange) },
            select: { buyerId: true, totalAmount: true }
        });
        const invested = {};
        txs.forEach(tx => {
            invested[tx.buyerId] = (invested[tx.buyerId] || 0) + tx.totalAmount;
        });
        return investors.map(i => ({
            category: i.role,
            count: i._count.role,
            totalInvested: Object.values(invested).reduce((sum, v) => sum + v, 0),
        }));
    }
    async getCommissionTrends(dateRange) {
        const txs = await this.prisma.transaction.findMany({
            where: { status: 'COMPLETED', ...this.getDateFilter(dateRange) },
            select: { date: true, leadCommission: true, closerCommission: true }
        });
        const data = {};
        txs.forEach(tx => {
            const d = new Date(tx.date);
            const key = d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
            if (!data[key])
                data[key] = { agentComm: 0, companyComm: 0 };
            data[key].agentComm += (tx.leadCommission || 0) + (tx.closerCommission || 0);
        });
        return Object.entries(data).map(([month, v]) => ({ month, ...v }));
    }
    async getTopAgents(dateRange) {
        const agents = await this.prisma.agent.findMany({
            where: { status: 'ACTIVE' },
            include: {
                user: { select: { name: true } },
                leadTransactions: { where: { status: 'COMPLETED', ...this.getDateFilter(dateRange) } },
                closerTransactions: { where: { status: 'COMPLETED', ...this.getDateFilter(dateRange) } },
            },
        });
        return agents.map(a => ({
            name: a.user?.name ?? '',
            deals: (a.leadTransactions?.length ?? 0) + (a.closerTransactions?.length ?? 0),
            commission: (a.leadTransactions?.reduce((s, tx) => s + (tx.leadCommission || 0), 0) ?? 0) +
                (a.closerTransactions?.reduce((s, tx) => s + (tx.closerCommission || 0), 0) ?? 0),
            conversion: 'N/A',
        }));
    }
    async getConversionMetrics(dateRange) {
        const leads = await this.prisma.lead.groupBy({
            by: ['status'],
            _count: { status: true },
        });
        return leads.map(l => ({
            stage: l.status,
            count: l._count.status,
        }));
    }
    async getCommissionReports(dateRange) {
        const dateFilter = this.getDateFilter(dateRange);
        const transactions = await this.prisma.transaction.findMany({
            where: { status: 'COMPLETED', ...dateFilter },
            select: {
                date: true,
                leadCommission: true,
                closerCommission: true,
                totalCommission: true,
                commissionPaymentStatus: true,
                paymentType: true,
            },
            orderBy: { date: 'desc' },
        });
        let thisMonthTotal = 0;
        let totalEarned = 0;
        let pendingTotal = 0;
        let leadCommissionTotal = 0;
        let closerCommissionTotal = 0;
        let teamLeadBonus = 0;
        let teamTotalCommission = 0;
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();
        transactions.forEach(tx => {
            const txDate = new Date(tx.date);
            if (txDate.getMonth() === currentMonth && txDate.getFullYear() === currentYear) {
                thisMonthTotal += tx.totalCommission || 0;
            }
            totalEarned += (tx.commissionPaymentStatus === 'PAID' ? tx.totalCommission || 0 : 0);
            pendingTotal += (tx.commissionPaymentStatus === client_1.CommissionPaymentStatus.SENT ? tx.totalCommission || 0 : 0);
            leadCommissionTotal += tx.leadCommission || 0;
            closerCommissionTotal += tx.closerCommission || 0;
            if (tx.paymentType === 'installment') {
                teamLeadBonus += (tx.totalCommission || 0) * 0.05;
            }
            teamTotalCommission += tx.totalCommission || 0;
        });
        const conversionRate = transactions.length > 0
            ? Math.round((totalEarned / teamTotalCommission) * 100)
            : 0;
        const monthlyMap = {};
        transactions.forEach(tx => {
            const d = new Date(tx.date);
            const key = d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
            monthlyMap[key] = (monthlyMap[key] || 0) + (tx.totalCommission || 0);
        });
        const monthlyData = Object.entries(monthlyMap).map(([month, amount]) => ({
            month,
            amount,
        }));
        const breakdown = [
            { name: "Lead", value: leadCommissionTotal, color: "#6366f1" },
            { name: "Closer", value: closerCommissionTotal, color: "#06b6d4" },
        ];
        return {
            summary: {
                thisMonth: `₦${thisMonthTotal.toLocaleString()}`,
                totalEarned: `₦${totalEarned.toLocaleString()}`,
                pending: `₦${pendingTotal.toLocaleString()}`,
                leadCommission: `₦${leadCommissionTotal.toLocaleString()}`,
                closerCommission: `₦${closerCommissionTotal.toLocaleString()}`,
                conversionRate: `${conversionRate}%`,
                teamLeadBonus: `₦${teamLeadBonus.toLocaleString()}`,
                teamTotalCommission: `₦${teamTotalCommission.toLocaleString()}`,
            },
            monthly: monthlyData,
            breakdown,
        };
    }
};
exports.ReportsService = ReportsService;
exports.ReportsService = ReportsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], ReportsService);


/***/ }),
/* 86 */
/***/ ((module) => {

module.exports = require("express");

/***/ }),
/* 87 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FreelancersModule = void 0;
const common_1 = __webpack_require__(3);
const freelancers_controller_1 = __webpack_require__(88);
const freelancers_service_1 = __webpack_require__(89);
const prisma_module_1 = __webpack_require__(37);
let FreelancersModule = class FreelancersModule {
};
exports.FreelancersModule = FreelancersModule;
exports.FreelancersModule = FreelancersModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        controllers: [freelancers_controller_1.FreelancersController],
        providers: [freelancers_service_1.FreelancersService],
        exports: [freelancers_service_1.FreelancersService],
    })
], FreelancersModule);


/***/ }),
/* 88 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FreelancersController = void 0;
const common_1 = __webpack_require__(3);
const freelancers_service_1 = __webpack_require__(89);
const class_validator_1 = __webpack_require__(33);
class CreateFreelancerDto {
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateFreelancerDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], CreateFreelancerDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateFreelancerDto.prototype, "phone", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateFreelancerDto.prototype, "registeredBy", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateFreelancerDto.prototype, "registrarName", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateFreelancerDto.prototype, "registrarType", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateFreelancerDto.prototype, "cluster", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateFreelancerDto.prototype, "status", void 0);
let FreelancersController = class FreelancersController {
    constructor(freelancersService) {
        this.freelancersService = freelancersService;
    }
    async findAll() {
        return this.freelancersService.findAll();
    }
    async getStats() {
        return this.freelancersService.getStats();
    }
    async getByRegistrar(registrarId) {
        return this.freelancersService.getFreelancersByRegistrar(registrarId);
    }
    async findOne(id) {
        return this.freelancersService.findById(id);
    }
    async create(dto) {
        return this.freelancersService.create(dto);
    }
    async update(id, dto) {
        return this.freelancersService.update(id, dto);
    }
    async remove(id) {
        return this.freelancersService.delete(id);
    }
};
exports.FreelancersController = FreelancersController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], FreelancersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)("stats"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], FreelancersController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)("by-registrar/:registrarId"),
    __param(0, (0, common_1.Param)("registrarId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FreelancersController.prototype, "getByRegistrar", null);
__decorate([
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FreelancersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateFreelancerDto]),
    __metadata("design:returntype", Promise)
], FreelancersController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_b = typeof Partial !== "undefined" && Partial) === "function" ? _b : Object]),
    __metadata("design:returntype", Promise)
], FreelancersController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FreelancersController.prototype, "remove", null);
exports.FreelancersController = FreelancersController = __decorate([
    (0, common_1.Controller)("freelancers"),
    __metadata("design:paramtypes", [typeof (_a = typeof freelancers_service_1.FreelancersService !== "undefined" && freelancers_service_1.FreelancersService) === "function" ? _a : Object])
], FreelancersController);


/***/ }),
/* 89 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FreelancersService = void 0;
const common_1 = __webpack_require__(3);
const prisma_service_1 = __webpack_require__(14);
const bcrypt = __importStar(__webpack_require__(27));
const serial_id_helper_1 = __webpack_require__(30);
let FreelancersService = class FreelancersService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll() {
        const freelancers = await this.prisma.freelancer.findMany({
            include: {
                user: { select: { id: true, email: true, name: true } },
                cluster: { select: { id: true, name: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
        return freelancers.map(freelancer => ({
            id: freelancer.id,
            serialId: freelancer.serialId ?? "",
            name: freelancer.user?.name ?? "",
            email: freelancer.user?.email ?? "",
            registeredBy: freelancer.registeredBy ?? "",
            registrarName: freelancer.registrarName ?? "",
            registrarType: freelancer.registrarType ?? "",
            cluster: freelancer.cluster?.name ?? "",
            clusterId: freelancer.cluster?.id ?? "",
            activeDeals: freelancer.activeDeals ?? 0,
            closedDeals: freelancer.closedDeals ?? 0,
            totalCommission: freelancer.totalCommission ?? 0,
            performance: freelancer.closedDeals > 0 ? Math.min(100, Math.round((freelancer.closedDeals / 10) * 100)) : 0,
            status: freelancer.status?.toLowerCase() ?? "pending",
        }));
    }
    async findById(id) {
        const freelancer = await this.prisma.freelancer.findUnique({
            where: { id },
            include: {
                user: { select: { id: true, email: true, name: true } },
                cluster: true,
            },
        });
        if (!freelancer)
            throw new common_1.NotFoundException(`Freelancer with ID ${id} not found`);
        return freelancer;
    }
    async create(data) {
        let user = await this.prisma.user.findUnique({ where: { email: data.email } });
        if (user) {
            const existing = await this.prisma.freelancer.findUnique({ where: { userId: user.id } });
            if (existing)
                throw new common_1.ConflictException('User is already registered as a freelancer');
        }
        else {
            const hashedPassword = await bcrypt.hash('password123', 10);
            const userSerialId = await (0, serial_id_helper_1.generateSerialId)(this.prisma, 'USR');
            user = await this.prisma.user.create({
                data: { serialId: userSerialId, email: data.email, password: hashedPassword, name: data.name, role: 'FREELANCER' },
            });
        }
        const freelancerSerialId = await (0, serial_id_helper_1.generateSerialId)(this.prisma, 'FRL');
        return this.prisma.freelancer.create({
            data: {
                serialId: freelancerSerialId,
                userId: user.id,
                clusterId: data.cluster || null,
                status: data.status ? data.status.toUpperCase() : 'PENDING',
                registeredBy: data.registeredBy || null,
                registrarName: data.registrarName || null,
                registrarType: data.registrarType || null,
                activeDeals: 0,
                closedDeals: 0,
                totalCommission: 0,
            },
            include: {
                user: { select: { id: true, email: true, name: true } },
                cluster: { select: { id: true, name: true } },
            },
        });
    }
    async update(id, data) {
        const freelancer = await this.findById(id);
        if (data.name || data.email) {
            await this.prisma.user.update({
                where: { id: freelancer.userId },
                data: {
                    ...(data.name ? { name: data.name } : {}),
                    ...(data.email ? { email: data.email } : {}),
                },
            });
        }
        const updateData = {};
        if (data.cluster)
            updateData.clusterId = data.cluster;
        if (data.status)
            updateData.status = data.status.toUpperCase();
        if (data.registeredBy !== undefined)
            updateData.registeredBy = data.registeredBy;
        if (data.registrarName !== undefined)
            updateData.registrarName = data.registrarName;
        if (data.registrarType !== undefined)
            updateData.registrarType = data.registrarType;
        return this.prisma.freelancer.update({
            where: { id },
            data: updateData,
            include: {
                user: { select: { id: true, email: true, name: true } },
                cluster: { select: { id: true, name: true } },
            },
        });
    }
    async delete(id) {
        await this.findById(id);
        await this.prisma.freelancer.delete({ where: { id } });
        return { message: 'Freelancer deleted successfully', id };
    }
    async getStats() {
        const [total, active, agg] = await Promise.all([
            this.prisma.freelancer.count(),
            this.prisma.freelancer.count({ where: { status: 'ACTIVE' } }),
            this.prisma.freelancer.aggregate({
                _sum: { totalCommission: true, activeDeals: true, closedDeals: true },
            }),
        ]);
        return {
            totalFreelancers: total,
            activeFreelancers: active,
            totalActiveDeals: agg._sum.activeDeals || 0,
            totalClosedDeals: agg._sum.closedDeals || 0,
            totalCommission: agg._sum.totalCommission || 0,
        };
    }
    async getFreelancersByRegistrar(registrarId) {
        return this.prisma.freelancer.findMany({
            where: { registeredBy: registrarId },
            include: {
                user: { select: { id: true, name: true, email: true } },
                cluster: { select: { id: true, name: true } },
            },
        });
    }
};
exports.FreelancersService = FreelancersService;
exports.FreelancersService = FreelancersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], FreelancersService);


/***/ }),
/* 90 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PaymentsModule = void 0;
const common_1 = __webpack_require__(3);
const config_1 = __webpack_require__(8);
const payments_controller_1 = __webpack_require__(91);
const payments_service_1 = __webpack_require__(92);
let PaymentsModule = class PaymentsModule {
};
exports.PaymentsModule = PaymentsModule;
exports.PaymentsModule = PaymentsModule = __decorate([
    (0, common_1.Module)({
        imports: [config_1.ConfigModule],
        controllers: [payments_controller_1.PaymentsController],
        providers: [payments_service_1.PaymentsService],
        exports: [payments_service_1.PaymentsService],
    })
], PaymentsModule);


/***/ }),
/* 91 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PaymentsController = void 0;
const common_1 = __webpack_require__(3);
const class_validator_1 = __webpack_require__(33);
const jwt_auth_guard_1 = __webpack_require__(32);
const payments_service_1 = __webpack_require__(92);
class InitializePaymentDto {
}
__decorate([
    (0, class_validator_1.IsIn)(['paystack', 'flutterwave']),
    __metadata("design:type", typeof (_a = typeof payments_service_1.PaymentProvider !== "undefined" && payments_service_1.PaymentProvider) === "function" ? _a : Object)
], InitializePaymentDto.prototype, "provider", void 0);
__decorate([
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], InitializePaymentDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], InitializePaymentDto.prototype, "amount", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], InitializePaymentDto.prototype, "currency", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], InitializePaymentDto.prototype, "callbackUrl", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], InitializePaymentDto.prototype, "reference", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", typeof (_b = typeof Record !== "undefined" && Record) === "function" ? _b : Object)
], InitializePaymentDto.prototype, "metadata", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], InitializePaymentDto.prototype, "title", void 0);
let PaymentsController = class PaymentsController {
    constructor(paymentsService) {
        this.paymentsService = paymentsService;
    }
    getProviders() {
        return this.paymentsService.getProviderConfig();
    }
    initializePayment(payload) {
        return this.paymentsService.initializePayment(payload);
    }
    verifyPayment(provider, reference) {
        return this.paymentsService.verifyPayment(provider, reference);
    }
};
exports.PaymentsController = PaymentsController;
__decorate([
    (0, common_1.Get)('providers'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PaymentsController.prototype, "getProviders", null);
__decorate([
    (0, common_1.Post)('initialize'),
    __param(0, (0, common_1.Body)(new common_1.ValidationPipe({ transform: true }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [InitializePaymentDto]),
    __metadata("design:returntype", void 0)
], PaymentsController.prototype, "initializePayment", null);
__decorate([
    (0, common_1.Get)('verify'),
    __param(0, (0, common_1.Query)('provider')),
    __param(1, (0, common_1.Query)('reference')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_d = typeof payments_service_1.PaymentProvider !== "undefined" && payments_service_1.PaymentProvider) === "function" ? _d : Object, String]),
    __metadata("design:returntype", void 0)
], PaymentsController.prototype, "verifyPayment", null);
exports.PaymentsController = PaymentsController = __decorate([
    (0, common_1.Controller)('payments'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [typeof (_c = typeof payments_service_1.PaymentsService !== "undefined" && payments_service_1.PaymentsService) === "function" ? _c : Object])
], PaymentsController);


/***/ }),
/* 92 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var PaymentsService_1;
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PaymentsService = void 0;
const common_1 = __webpack_require__(3);
const config_1 = __webpack_require__(8);
let PaymentsService = PaymentsService_1 = class PaymentsService {
    constructor(configService) {
        this.configService = configService;
        this.logger = new common_1.Logger(PaymentsService_1.name);
    }
    getProviderConfig() {
        const paystackConfigured = Boolean(this.configService.get('PAYSTACK_SECRET_KEY'));
        const flutterwaveConfigured = Boolean(this.configService.get('FLUTTERWAVE_SECRET_KEY'));
        return {
            paystack: {
                configured: paystackConfigured,
                publicKey: this.configService.get('PAYSTACK_PUBLIC_KEY') || null,
            },
            flutterwave: {
                configured: flutterwaveConfigured,
                publicKey: this.configService.get('FLUTTERWAVE_PUBLIC_KEY') || null,
            },
        };
    }
    async initializePayment(payload) {
        if (payload.provider === 'paystack') {
            return this.initializePaystackPayment(payload);
        }
        return this.initializeFlutterwavePayment(payload);
    }
    async verifyPayment(provider, reference) {
        if (provider === 'paystack') {
            return this.verifyPaystackPayment(reference);
        }
        return this.verifyFlutterwavePayment(reference);
    }
    async initializePaystackPayment(payload) {
        const secretKey = this.configService.get('PAYSTACK_SECRET_KEY');
        if (!secretKey) {
            throw new common_1.InternalServerErrorException('PAYSTACK_SECRET_KEY is not configured');
        }
        const response = await this.requestJson('https://api.paystack.co/transaction/initialize', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${secretKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: payload.email,
                amount: Math.round(payload.amount * 100),
                currency: payload.currency || 'NGN',
                callback_url: payload.callbackUrl || this.configService.get('PAYMENT_CALLBACK_URL'),
                reference: payload.reference,
                metadata: payload.metadata || {},
            }),
        });
        return {
            provider: 'paystack',
            reference: response?.data?.reference,
            authorizationUrl: response?.data?.authorization_url,
            accessCode: response?.data?.access_code,
            raw: response,
        };
    }
    async initializeFlutterwavePayment(payload) {
        const secretKey = this.configService.get('FLUTTERWAVE_SECRET_KEY');
        if (!secretKey) {
            throw new common_1.InternalServerErrorException('FLUTTERWAVE_SECRET_KEY is not configured');
        }
        const txRef = payload.reference || `buyops-${Date.now()}`;
        const response = await this.requestJson('https://api.flutterwave.com/v3/payments', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${secretKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                tx_ref: txRef,
                amount: payload.amount,
                currency: payload.currency || 'NGN',
                redirect_url: payload.callbackUrl || this.configService.get('PAYMENT_CALLBACK_URL') || 'http://localhost:5173',
                customer: {
                    email: payload.email,
                },
                customizations: {
                    title: payload.title || 'BuyOps Payment',
                },
                meta: payload.metadata || {},
            }),
        });
        return {
            provider: 'flutterwave',
            reference: txRef,
            authorizationUrl: response?.data?.link,
            raw: response,
        };
    }
    async verifyPaystackPayment(reference) {
        const secretKey = this.configService.get('PAYSTACK_SECRET_KEY');
        if (!secretKey) {
            throw new common_1.InternalServerErrorException('PAYSTACK_SECRET_KEY is not configured');
        }
        const response = await this.requestJson(`https://api.paystack.co/transaction/verify/${reference}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${secretKey}`,
            },
        });
        return {
            provider: 'paystack',
            reference,
            status: response?.data?.status,
            paidAt: response?.data?.paid_at,
            amount: response?.data?.amount ? response.data.amount / 100 : undefined,
            currency: response?.data?.currency,
            customerEmail: response?.data?.customer?.email,
            raw: response,
        };
    }
    async verifyFlutterwavePayment(reference) {
        const secretKey = this.configService.get('FLUTTERWAVE_SECRET_KEY');
        if (!secretKey) {
            throw new common_1.InternalServerErrorException('FLUTTERWAVE_SECRET_KEY is not configured');
        }
        const response = await this.requestJson(`https://api.flutterwave.com/v3/transactions/verify_by_reference?tx_ref=${encodeURIComponent(reference)}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${secretKey}`,
            },
        });
        return {
            provider: 'flutterwave',
            reference,
            status: response?.data?.status,
            paidAt: response?.data?.created_at,
            amount: response?.data?.amount,
            currency: response?.data?.currency,
            customerEmail: response?.data?.customer?.email,
            raw: response,
        };
    }
    async requestJson(url, init) {
        const response = await fetch(url, init);
        const text = await response.text();
        let json;
        try {
            json = text ? JSON.parse(text) : {};
        }
        catch {
            json = { message: text };
        }
        if (!response.ok) {
            this.logger.error(`Payment provider request failed (${response.status}): ${JSON.stringify(json)}`);
            throw new common_1.InternalServerErrorException(json?.message || json?.error || 'Payment provider request failed');
        }
        return json;
    }
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = PaymentsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _a : Object])
], PaymentsService);


/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__(0);
/******/ 	
/******/ })()
;