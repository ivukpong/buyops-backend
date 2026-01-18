/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
const common_1 = __webpack_require__(1);
const core_1 = __webpack_require__(2);
const app_module_1 = __webpack_require__(3);
const dotenv = __importStar(__webpack_require__(60));
async function bootstrap() {
    dotenv.config();
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const frontendOrigins = process.env.FRONTEND_ORIGINS
        ? process.env.FRONTEND_ORIGINS.split(",").map((o) => o.trim())
        : ["http://localhost:5173"];
    app.enableCors({
        origin: frontendOrigins,
        credentials: true,
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
    });
    app.useGlobalPipes(new common_1.ValidationPipe({ whitelist: true }));
    const port = process.env.PORT || 4000;
    await app.listen(port);
    console.log(`Server listening on ${port}`);
}
bootstrap();


/***/ }),
/* 1 */
/***/ ((module) => {

module.exports = require("@nestjs/common");

/***/ }),
/* 2 */
/***/ ((module) => {

module.exports = require("@nestjs/core");

/***/ }),
/* 3 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppModule = void 0;
const common_1 = __webpack_require__(1);
const prisma_module_1 = __webpack_require__(4);
const auth_module_1 = __webpack_require__(7);
const users_module_1 = __webpack_require__(16);
const investments_module_1 = __webpack_require__(21);
const sales_module_1 = __webpack_require__(24);
const assets_controller_1 = __webpack_require__(27);
const companies_controller_1 = __webpack_require__(29);
const agents_controller_1 = __webpack_require__(31);
const clusters_controller_1 = __webpack_require__(33);
const leads_controller_1 = __webpack_require__(35);
const transactions_controller_1 = __webpack_require__(37);
const installments_controller_1 = __webpack_require__(40);
const reports_controller_1 = __webpack_require__(42);
const assets_module_1 = __webpack_require__(46);
const companies_module_1 = __webpack_require__(47);
const agents_module_1 = __webpack_require__(48);
const clusters_module_1 = __webpack_require__(49);
const leads_module_1 = __webpack_require__(50);
const transactions_module_1 = __webpack_require__(51);
const installments_module_1 = __webpack_require__(52);
const reports_module_1 = __webpack_require__(53);
const freelancers_service_1 = __webpack_require__(54);
const freelancers_module_1 = __webpack_require__(55);
const dashboard_module_1 = __webpack_require__(57);
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            prisma_module_1.PrismaModule,
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            investments_module_1.InvestmentsModule,
            sales_module_1.SalesModule,
            assets_module_1.AssetsModule,
            companies_module_1.CompaniesModule,
            agents_module_1.AgentsModule,
            clusters_module_1.ClustersModule,
            leads_module_1.LeadsModule,
            transactions_module_1.TransactionsModule,
            installments_module_1.InstallmentsModule,
            reports_module_1.ReportsModule,
            freelancers_module_1.FreelancersModule,
            dashboard_module_1.DashboardModule,
        ],
        controllers: [assets_controller_1.AssetsController, companies_controller_1.CompaniesController, agents_controller_1.AgentsController, clusters_controller_1.ClustersController, leads_controller_1.LeadsController, transactions_controller_1.TransactionsController, installments_controller_1.InstallmentsController, reports_controller_1.ReportsController],
        providers: [freelancers_service_1.FreelancersService],
    })
], AppModule);


/***/ }),
/* 4 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PrismaModule = void 0;
const common_1 = __webpack_require__(1);
const prisma_service_1 = __webpack_require__(5);
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
/* 5 */
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
const common_1 = __webpack_require__(1);
const client_1 = __webpack_require__(6);
let PrismaService = class PrismaService extends client_1.PrismaClient {
    constructor() {
        super({});
    }
    async onModuleInit() {
        await this.$connect();
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
/* 6 */
/***/ ((module) => {

module.exports = require("@prisma/client");

/***/ }),
/* 7 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthModule = void 0;
const common_1 = __webpack_require__(1);
const jwt_1 = __webpack_require__(8);
const passport_1 = __webpack_require__(9);
const auth_controller_1 = __webpack_require__(10);
const auth_service_1 = __webpack_require__(11);
const jwt_strategy_1 = __webpack_require__(14);
const prisma_module_1 = __webpack_require__(4);
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            prisma_module_1.PrismaModule,
            passport_1.PassportModule,
            jwt_1.JwtModule.register({
                secret: process.env.JWT_SECRET || 'buyops26',
                signOptions: { expiresIn: '7d' },
            }),
        ],
        controllers: [auth_controller_1.AuthController],
        providers: [auth_service_1.AuthService, jwt_strategy_1.JwtStrategy],
        exports: [auth_service_1.AuthService],
    })
], AuthModule);


/***/ }),
/* 8 */
/***/ ((module) => {

module.exports = require("@nestjs/jwt");

/***/ }),
/* 9 */
/***/ ((module) => {

module.exports = require("@nestjs/passport");

/***/ }),
/* 10 */
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
exports.AuthController = exports.ResetPasswordDto = exports.ForgotPasswordDto = exports.ChangePasswordDto = exports.RefreshTokenDto = exports.RegisterDto = exports.LoginDto = void 0;
const common_1 = __webpack_require__(1);
const passport_1 = __webpack_require__(9);
const auth_service_1 = __webpack_require__(11);
const class_validator_1 = __webpack_require__(13);
class LoginDto {
}
exports.LoginDto = LoginDto;
__decorate([
    (0, class_validator_1.IsEmail)({}, { message: 'Please provide a valid email address' }),
    __metadata("design:type", String)
], LoginDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Password is required' }),
    __metadata("design:type", String)
], LoginDto.prototype, "password", void 0);
class RegisterDto {
}
exports.RegisterDto = RegisterDto;
__decorate([
    (0, class_validator_1.IsEmail)({}, { message: 'Please provide a valid email address' }),
    __metadata("design:type", String)
], RegisterDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Password is required' }),
    (0, class_validator_1.MinLength)(6, { message: 'Password must be at least 6 characters long' }),
    __metadata("design:type", String)
], RegisterDto.prototype, "password", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], RegisterDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], RegisterDto.prototype, "role", void 0);
class RefreshTokenDto {
}
exports.RefreshTokenDto = RefreshTokenDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Refresh token is required' }),
    __metadata("design:type", String)
], RefreshTokenDto.prototype, "refreshToken", void 0);
class ChangePasswordDto {
}
exports.ChangePasswordDto = ChangePasswordDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Current password is required' }),
    __metadata("design:type", String)
], ChangePasswordDto.prototype, "currentPassword", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'New password is required' }),
    (0, class_validator_1.MinLength)(6, { message: 'New password must be at least 6 characters long' }),
    __metadata("design:type", String)
], ChangePasswordDto.prototype, "newPassword", void 0);
class ForgotPasswordDto {
}
exports.ForgotPasswordDto = ForgotPasswordDto;
__decorate([
    (0, class_validator_1.IsEmail)({}, { message: 'Please provide a valid email address' }),
    __metadata("design:type", String)
], ForgotPasswordDto.prototype, "email", void 0);
class ResetPasswordDto {
}
exports.ResetPasswordDto = ResetPasswordDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Reset token is required' }),
    __metadata("design:type", String)
], ResetPasswordDto.prototype, "token", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'New password is required' }),
    (0, class_validator_1.MinLength)(6, { message: 'Password must be at least 6 characters long' }),
    __metadata("design:type", String)
], ResetPasswordDto.prototype, "newPassword", void 0);
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    async register(dto) {
        return this.authService.register(dto);
    }
    async login(dto) {
        const user = await this.authService.validateUser(dto.email, dto.password);
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid email or password');
        }
        return this.authService.login(user);
    }
    async getProfile(req) {
        return this.authService.getProfile(req.user.id);
    }
    async logout(req) {
        return { message: 'Logged out successfully' };
    }
    async refreshToken(dto) {
        return this.authService.refreshToken(dto.refreshToken);
    }
    async changePassword(req, dto) {
        return this.authService.changePassword(req.user.id, dto.currentPassword, dto.newPassword);
    }
    async forgotPassword(dto) {
        return this.authService.forgotPassword(dto.email);
    }
    async resetPassword(dto) {
        return this.authService.resetPassword(dto.token, dto.newPassword);
    }
    async verifyEmail(token) {
        return this.authService.verifyEmail(token);
    }
    async resendVerification(email) {
        return this.authService.resendVerificationEmail(email);
    }
    async validateToken(token) {
        try {
            const user = await this.authService.validateToken(token);
            return { valid: true, user };
        }
        catch {
            return { valid: false, message: 'Invalid or expired token' };
        }
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('register'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [RegisterDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('login'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [LoginDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Get)('me'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getProfile", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Post)('logout'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
__decorate([
    (0, common_1.Post)('refresh'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [RefreshTokenDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refreshToken", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Post)('change-password'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, ChangePasswordDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "changePassword", null);
__decorate([
    (0, common_1.Post)('forgot-password'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ForgotPasswordDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "forgotPassword", null);
__decorate([
    (0, common_1.Post)('reset-password'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ResetPasswordDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "resetPassword", null);
__decorate([
    (0, common_1.Post)('verify-email'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)('token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verifyEmail", null);
__decorate([
    (0, common_1.Post)('resend-verification'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "resendVerification", null);
__decorate([
    (0, common_1.Post)('validate-token'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)('token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "validateToken", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [typeof (_a = typeof auth_service_1.AuthService !== "undefined" && auth_service_1.AuthService) === "function" ? _a : Object])
], AuthController);


/***/ }),
/* 11 */
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
exports.AuthService = void 0;
const common_1 = __webpack_require__(1);
const jwt_1 = __webpack_require__(8);
const prisma_service_1 = __webpack_require__(5);
const bcrypt = __importStar(__webpack_require__(12));
let AuthService = class AuthService {
    constructor(prisma, jwtService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
    }
    async validateUser(email, password) {
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user)
            return null;
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid)
            return null;
        const { password: _, ...result } = user;
        return result;
    }
    async login(user) {
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
                role: user.role || 'USER',
            },
        };
    }
    async register(data) {
        const existing = await this.prisma.user.findUnique({
            where: { email: data.email },
        });
        if (existing)
            throw new common_1.ConflictException('Email already in use');
        const hashed = await bcrypt.hash(data.password, 10);
        const user = await this.prisma.user.create({
            data: {
                email: data.email,
                password: hashed,
                name: data.name || data.email.split('@')[0],
                role: data.role || 'USER',
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
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user) {
            return { message: 'If an account exists, a reset link has been sent.' };
        }
        const resetToken = this.jwtService.sign({ sub: user.id, email: user.email }, { expiresIn: '1h' });
        console.log(`Reset password token for ${email}: ${resetToken}`);
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
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user) {
            return { message: 'If an account exists, a verification link has been sent.' };
        }
        const verificationToken = this.jwtService.sign({ sub: user.id, email: user.email }, { expiresIn: '24h' });
        console.log(`Verification token for ${email}: ${verificationToken}`);
        return {
            message: 'If an account exists, a verification link has been sent.',
        };
    }
    async logout(userId) {
        return { message: 'Logged out successfully' };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object, typeof (_b = typeof jwt_1.JwtService !== "undefined" && jwt_1.JwtService) === "function" ? _b : Object])
], AuthService);


/***/ }),
/* 12 */
/***/ ((module) => {

module.exports = require("bcrypt");

/***/ }),
/* 13 */
/***/ ((module) => {

module.exports = require("class-validator");

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
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.JwtStrategy = void 0;
const common_1 = __webpack_require__(1);
const passport_1 = __webpack_require__(9);
const passport_jwt_1 = __webpack_require__(15);
const prisma_service_1 = __webpack_require__(5);
let JwtStrategy = class JwtStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy) {
    constructor(prisma) {
        super({
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET || 'your-secret-key-should-be-very-long-and-random',
        });
        this.prisma = prisma;
    }
    async validate(payload) {
        const user = await this.prisma.user.findUnique({
            where: { id: payload.sub },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('User not found');
        }
        return {
            id: user.id,
            email: user.email,
            role: user.role,
        };
    }
};
exports.JwtStrategy = JwtStrategy;
exports.JwtStrategy = JwtStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], JwtStrategy);


/***/ }),
/* 15 */
/***/ ((module) => {

module.exports = require("passport-jwt");

/***/ }),
/* 16 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UsersModule = void 0;
const common_1 = __webpack_require__(1);
const users_controller_1 = __webpack_require__(17);
const users_service_1 = __webpack_require__(18);
const prisma_module_1 = __webpack_require__(4);
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
/* 17 */
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
const common_1 = __webpack_require__(1);
const passport_1 = __webpack_require__(9);
const users_service_1 = __webpack_require__(18);
const roles_guard_1 = __webpack_require__(19);
const roles_decorator_1 = __webpack_require__(20);
const class_validator_1 = __webpack_require__(13);
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
    (0, class_validator_1.MinLength)(6),
    __metadata("design:type", String)
], CreateUserDto.prototype, "password", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateUserDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateUserDto.prototype, "role", void 0);
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
    (0, roles_decorator_1.Roles)("ADMIN"),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)("role")),
    __param(1, (0, common_1.Query)("status")),
    __param(2, (0, common_1.Query)("search")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "findOne", null);
__decorate([
    (0, roles_decorator_1.Roles)("ADMIN"),
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
    (0, roles_decorator_1.Roles)("ADMIN"),
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
    (0, roles_decorator_1.Roles)("ADMIN"),
    (0, common_1.Put)(":id/role"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)("role")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updateRole", null);
__decorate([
    (0, roles_decorator_1.Roles)("ADMIN"),
    (0, common_1.Put)(":id/password"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UpdatePasswordDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updatePassword", null);
__decorate([
    (0, roles_decorator_1.Roles)("ADMIN"),
    (0, common_1.Post)(":id/deactivate"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "deactivate", null);
__decorate([
    (0, roles_decorator_1.Roles)("ADMIN"),
    (0, common_1.Post)(":id/reactivate"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "reactivate", null);
__decorate([
    (0, roles_decorator_1.Roles)("ADMIN"),
    (0, common_1.Delete)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "remove", null);
__decorate([
    (0, roles_decorator_1.Roles)("ADMIN"),
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
    (0, roles_decorator_1.Roles)("ADMIN"),
    (0, common_1.Get)("agents/all"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getAllAgents", null);
__decorate([
    (0, roles_decorator_1.Roles)("ADMIN"),
    (0, common_1.Get)("investors/all"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getAllInvestors", null);
__decorate([
    (0, roles_decorator_1.Roles)("ADMIN"),
    (0, common_1.Get)("search/query"),
    __param(0, (0, common_1.Query)("q")),
    __param(1, (0, common_1.Query)("role")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "searchUsers", null);
__decorate([
    (0, roles_decorator_1.Roles)("ADMIN"),
    (0, common_1.Get)("count/by-role"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getUserCountByRole", null);
__decorate([
    (0, roles_decorator_1.Roles)("ADMIN"),
    (0, common_1.Post)("bulk-create"),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)("users")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "bulkCreate", null);
exports.UsersController = UsersController = __decorate([
    (0, common_1.Controller)("users"),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt"), roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [typeof (_a = typeof users_service_1.UsersService !== "undefined" && users_service_1.UsersService) === "function" ? _a : Object])
], UsersController);


/***/ }),
/* 18 */
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
const common_1 = __webpack_require__(1);
const prisma_service_1 = __webpack_require__(5);
const bcrypt = __importStar(__webpack_require__(12));
let UsersService = class UsersService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(filters) {
        const where = {};
        if (filters?.role) {
            where.role = filters.role;
        }
        if (filters?.search) {
            where.OR = [
                { name: { contains: filters.search, mode: "insensitive" } },
                { email: { contains: filters.search, mode: "insensitive" } },
            ];
        }
        const users = await this.prisma.user.findMany({
            where,
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                createdAt: true,
                updatedAt: true,
                agentProfile: {
                    select: {
                        id: true,
                        status: true,
                        totalCommission: true,
                        activeDeals: true,
                        closedDeals: true,
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
                        status: true,
                        totalCommission: true,
                        activeDeals: true,
                        closedDeals: true,
                        cluster: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        if (filters?.status) {
            return users.filter((user) => {
                if (user.agentProfile) {
                    return user.agentProfile.status === filters.status;
                }
                if (user.freelancerProfile) {
                    return user.freelancerProfile.status === filters.status;
                }
                return filters.status === "active";
            });
        }
        return users;
    }
    async findById(id) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                createdAt: true,
                updatedAt: true,
                agentProfile: {
                    include: {
                        cluster: true,
                        leadsAsLead: {
                            take: 10,
                            orderBy: { date: "desc" },
                            include: {
                                asset: {
                                    select: {
                                        name: true,
                                    },
                                },
                            },
                        },
                        leadsAsCloser: {
                            take: 10,
                            orderBy: { date: "desc" },
                            include: {
                                asset: {
                                    select: {
                                        name: true,
                                    },
                                },
                            },
                        },
                    },
                },
                freelancerProfile: {
                    include: {
                        cluster: true,
                    },
                },
                leadsCreated: {
                    take: 10,
                    orderBy: {
                        dateReceived: "desc",
                    },
                },
                transactions: {
                    take: 10,
                    orderBy: {
                        date: "desc",
                    },
                    include: {
                        asset: {
                            select: {
                                name: true,
                            },
                        },
                    },
                },
            },
        });
        if (!user) {
            throw new common_1.NotFoundException(`User with ID ${id} not found`);
        }
        return user;
    }
    async findByEmail(email) {
        const user = await this.prisma.user.findUnique({
            where: { email },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                agentProfile: {
                    select: {
                        id: true,
                        status: true,
                    },
                },
                freelancerProfile: {
                    select: {
                        id: true,
                        status: true,
                    },
                },
            },
        });
        if (!user) {
            throw new common_1.NotFoundException(`User with email ${email} not found`);
        }
        return user;
    }
    async getUserStats(userId) {
        const user = await this.findById(userId);
        if (user.agentProfile) {
            const [activeDeals, closedDeals, totalCommission] = await Promise.all([
                this.prisma.transaction.count({
                    where: {
                        OR: [
                            { leadAgentId: user.agentProfile.id },
                            { closerAgentId: user.agentProfile.id },
                        ],
                        status: "pending",
                    },
                }),
                this.prisma.transaction.count({
                    where: {
                        OR: [
                            { leadAgentId: user.agentProfile.id },
                            { closerAgentId: user.agentProfile.id },
                        ],
                        status: "completed",
                    },
                }),
                this.prisma.transaction.aggregate({
                    where: {
                        OR: [
                            { leadAgentId: user.agentProfile.id },
                            { closerAgentId: user.agentProfile.id },
                        ],
                        status: "completed",
                    },
                    _sum: {
                        leadCommission: true,
                        closerCommission: true,
                    },
                }),
            ]);
            return {
                userType: "agent",
                activeDeals,
                closedDeals,
                totalCommission: (totalCommission._sum.leadCommission || 0) +
                    (totalCommission._sum.closerCommission || 0),
                cluster: user.agentProfile.cluster,
            };
        }
        if (user.freelancerProfile) {
            return {
                userType: "freelancer",
                totalCommission: user.freelancerProfile.totalCommission,
                cluster: user.freelancerProfile.cluster,
                activeDeals: user.freelancerProfile.activeDeals,
                closedDeals: user.freelancerProfile.closedDeals,
            };
        }
        if (user.role === "INVESTOR") {
            const [totalInvested, activeInvestments] = await Promise.all([
                this.prisma.transaction.aggregate({
                    where: {
                        buyerId: userId,
                        status: "completed",
                    },
                    _sum: { amount: true },
                }),
                this.prisma.transaction.count({
                    where: {
                        buyerId: userId,
                        status: { in: ["pending", "completed"] },
                    },
                }),
            ]);
            return {
                userType: "investor",
                totalInvested: totalInvested._sum.amount || 0,
                activeInvestments,
            };
        }
        return {
            userType: user.role.toLowerCase(),
        };
    }
    async getUserActivity(userId, limit = 20) {
        const user = await this.findById(userId);
        const activities = [];
        if (user.transactions.length > 0) {
            activities.push(...user.transactions.map((t) => ({
                type: "transaction",
                date: t.date,
                description: `Transaction for ₦${t.amount.toLocaleString()}`,
                data: t,
            })));
        }
        if (user.leadsCreated.length > 0) {
            activities.push(...user.leadsCreated.map((l) => ({
                type: "lead",
                date: l.dateReceived,
                description: `Created lead for ${l.name}`,
                data: l,
            })));
        }
        return activities
            .sort((a, b) => b.date.getTime() - a.date.getTime())
            .slice(0, limit);
    }
    async getUserTransactions(userId) {
        return this.prisma.transaction.findMany({
            where: {
                OR: [
                    { buyerId: userId },
                    {
                        leadAgent: {
                            userId,
                        },
                    },
                    {
                        closerAgent: {
                            userId,
                        },
                    },
                ],
            },
            include: {
                asset: {
                    select: {
                        name: true,
                        referenceCode: true,
                    },
                },
            },
            orderBy: {
                date: "desc",
            },
        });
    }
    async getUserLeads(userId) {
        return this.prisma.lead.findMany({
            where: {
                createdBy: userId,
            },
            include: {
                asset: {
                    select: {
                        name: true,
                    },
                },
            },
            orderBy: {
                dateReceived: "desc",
            },
        });
    }
    async createUser(data) {
        const existingUser = await this.prisma.user.findUnique({
            where: { email: data.email },
        });
        if (existingUser) {
            throw new common_1.ConflictException("User with this email already exists");
        }
        const hashedPassword = await bcrypt.hash(data.password, 10);
        return this.prisma.user.create({
            data: {
                email: data.email,
                password: hashedPassword,
                name: data.name,
                role: data.role || "USER",
            },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                createdAt: true,
            },
        });
    }
    async updateUser(userId, data) {
        await this.findById(userId);
        return this.prisma.user.update({
            where: { id: userId },
            data,
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                updatedAt: true,
            },
        });
    }
    async updateUserRole(userId, newRole) {
        await this.findById(userId);
        return this.prisma.user.update({
            where: { id: userId },
            data: { role: newRole },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
            },
        });
    }
    async updateUserPassword(userId, newPassword) {
        await this.findById(userId);
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await this.prisma.user.update({
            where: { id: userId },
            data: { password: hashedPassword },
        });
        return {
            message: "Password updated successfully",
        };
    }
    async deactivateUser(userId) {
        const user = await this.findById(userId);
        if (user.agentProfile) {
            await this.prisma.agent.update({
                where: { id: user.agentProfile.id },
                data: { status: "inactive" },
            });
        }
        if (user.freelancerProfile) {
            await this.prisma.freelancer.update({
                where: { id: user.freelancerProfile.id },
                data: { status: "inactive" },
            });
        }
        return { message: "User deactivated successfully" };
    }
    async reactivateUser(userId) {
        const user = await this.findById(userId);
        if (user.agentProfile) {
            await this.prisma.agent.update({
                where: { id: user.agentProfile.id },
                data: { status: "active" },
            });
        }
        if (user.freelancerProfile) {
            await this.prisma.freelancer.update({
                where: { id: user.freelancerProfile.id },
                data: { status: "active" },
            });
        }
        return { message: "User reactivated successfully" };
    }
    async deleteUser(userId) {
        await this.findById(userId);
        const transactionCount = await this.prisma.transaction.count({
            where: { buyerId: userId },
        });
        if (transactionCount > 0) {
            throw new Error("Cannot delete user with existing transactions. Please deactivate instead.");
        }
        await this.prisma.user.delete({
            where: { id: userId },
        });
        return { message: "User deleted successfully" };
    }
    async getUsersByRole(role) {
        return this.prisma.user.findMany({
            where: { role },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                createdAt: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    }
    async getUserDashboard(userId) {
        const stats = await this.getUserStats(userId);
        const recentActivity = await this.getUserActivity(userId, 10);
        return {
            stats,
            recentActivity,
        };
    }
    async getAllAgents() {
        return this.prisma.user.findMany({
            where: {
                agentProfile: {
                    isNot: null,
                },
            },
            include: {
                agentProfile: {
                    include: {
                        cluster: true,
                    },
                },
            },
        });
    }
    async getAllInvestors() {
        return this.prisma.user.findMany({
            where: { role: "INVESTOR" },
            select: {
                id: true,
                email: true,
                name: true,
                createdAt: true,
            },
        });
    }
    async searchUsers(query, role) {
        const where = {
            OR: [
                { name: { contains: query, mode: "insensitive" } },
                { email: { contains: query, mode: "insensitive" } },
            ],
        };
        if (role) {
            where.role = role;
        }
        return this.prisma.user.findMany({
            where,
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
            },
            take: 20,
        });
    }
    async getUserCountByRole() {
        const counts = await this.prisma.user.groupBy({
            by: ["role"],
            _count: true,
        });
        return counts.map((item) => ({
            role: item.role,
            count: item._count,
        }));
    }
    async bulkCreateUsers(users) {
        const hashedUsers = await Promise.all(users.map(async (user) => ({
            ...user,
            password: await bcrypt.hash(user.password, 10),
            role: user.role || "USER",
        })));
        const result = await this.prisma.user.createMany({
            data: hashedUsers,
            skipDuplicates: true,
        });
        return {
            message: `${result.count} users created successfully`,
            count: result.count,
        };
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], UsersService);


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
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RolesGuard = void 0;
const common_1 = __webpack_require__(1);
const core_1 = __webpack_require__(2);
const roles_decorator_1 = __webpack_require__(20);
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
/* 20 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Roles = exports.ROLES_KEY = void 0;
const common_1 = __webpack_require__(1);
exports.ROLES_KEY = "roles";
const Roles = (...roles) => (0, common_1.SetMetadata)(exports.ROLES_KEY, roles);
exports.Roles = Roles;


/***/ }),
/* 21 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.InvestmentsModule = void 0;
const common_1 = __webpack_require__(1);
const investments_controller_1 = __webpack_require__(22);
const investments_service_1 = __webpack_require__(23);
const prisma_module_1 = __webpack_require__(4);
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
/* 22 */
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
const common_1 = __webpack_require__(1);
const investments_service_1 = __webpack_require__(23);
const passport_1 = __webpack_require__(9);
const roles_decorator_1 = __webpack_require__(20);
const roles_guard_1 = __webpack_require__(19);
class CreateInvestmentDto {
}
let InvestmentsController = class InvestmentsController {
    constructor(svc) {
        this.svc = svc;
    }
    async create(req, body) {
        const userId = req.user.id;
        return this.svc.create(userId, body);
    }
    async myInvestments(req) {
        return this.svc.findByUser(req.user.id);
    }
    async all() {
        return this.svc.findAll();
    }
};
exports.InvestmentsController = InvestmentsController;
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt"), roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)("INVESTOR"),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, CreateInvestmentDto]),
    __metadata("design:returntype", Promise)
], InvestmentsController.prototype, "create", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt"), roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)("INVESTOR"),
    (0, common_1.Get)("me"),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], InvestmentsController.prototype, "myInvestments", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt"), roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)("ADMIN"),
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], InvestmentsController.prototype, "all", null);
exports.InvestmentsController = InvestmentsController = __decorate([
    (0, common_1.Controller)("investments"),
    __metadata("design:paramtypes", [typeof (_a = typeof investments_service_1.InvestmentsService !== "undefined" && investments_service_1.InvestmentsService) === "function" ? _a : Object])
], InvestmentsController);


/***/ }),
/* 23 */
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
const common_1 = __webpack_require__(1);
const prisma_service_1 = __webpack_require__(5);
let InvestmentsService = class InvestmentsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(userId, data) {
        return this.prisma.investment.create({
            data: {
                amount: data.amount,
                note: data.note,
                userId,
            },
        });
    }
    async findByUser(userId) {
        return this.prisma.investment.findMany({ where: { userId } });
    }
    async findAll() {
        return this.prisma.investment.findMany();
    }
};
exports.InvestmentsService = InvestmentsService;
exports.InvestmentsService = InvestmentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], InvestmentsService);


/***/ }),
/* 24 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SalesModule = void 0;
const common_1 = __webpack_require__(1);
const sales_controller_1 = __webpack_require__(25);
const sales_service_1 = __webpack_require__(26);
const prisma_module_1 = __webpack_require__(4);
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
/* 25 */
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
const common_1 = __webpack_require__(1);
const sales_service_1 = __webpack_require__(26);
const passport_1 = __webpack_require__(9);
const roles_decorator_1 = __webpack_require__(20);
const roles_guard_1 = __webpack_require__(19);
class CreateSaleDto {
}
let SalesController = class SalesController {
    constructor(svc) {
        this.svc = svc;
    }
    async create(req, body) {
        const userId = req.user.id;
        return this.svc.create(userId, body);
    }
    async mySales(req) {
        return this.svc.findByUser(req.user.id);
    }
    async all() {
        return this.svc.findAll();
    }
};
exports.SalesController = SalesController;
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt"), roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)("SALES"),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, CreateSaleDto]),
    __metadata("design:returntype", Promise)
], SalesController.prototype, "create", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt"), roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)("SALES"),
    (0, common_1.Get)("me"),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SalesController.prototype, "mySales", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt"), roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)("ADMIN"),
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SalesController.prototype, "all", null);
exports.SalesController = SalesController = __decorate([
    (0, common_1.Controller)("sales"),
    __metadata("design:paramtypes", [typeof (_a = typeof sales_service_1.SalesService !== "undefined" && sales_service_1.SalesService) === "function" ? _a : Object])
], SalesController);


/***/ }),
/* 26 */
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
const common_1 = __webpack_require__(1);
const prisma_service_1 = __webpack_require__(5);
let SalesService = class SalesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(userId, data) {
        return this.prisma.sale.create({
            data: {
                productId: data.productId,
                quantity: data.quantity,
                total: data.total,
                userId,
            },
        });
    }
    async findByUser(userId) {
        return this.prisma.sale.findMany({
            where: { userId },
            include: { product: true },
        });
    }
    async findAll() {
        return this.prisma.sale.findMany({
            include: {
                product: true,
                user: { select: { id: true, email: true, name: true } },
            },
        });
    }
};
exports.SalesService = SalesService;
exports.SalesService = SalesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], SalesService);


/***/ }),
/* 27 */
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
exports.AssetsController = exports.CreateAssetDto = void 0;
const common_1 = __webpack_require__(1);
const assets_service_1 = __webpack_require__(28);
const passport_1 = __webpack_require__(9);
const roles_guard_1 = __webpack_require__(19);
const roles_decorator_1 = __webpack_require__(20);
class CreateAssetDto {
}
exports.CreateAssetDto = CreateAssetDto;
let AssetsController = class AssetsController {
    constructor(assetsService) {
        this.assetsService = assetsService;
    }
    async findAll(type, status, location) {
        return this.assetsService.findAll({ type, status, location });
    }
    async findOne(id) {
        return this.assetsService.findById(id);
    }
    async create(dto) {
        return this.assetsService.create(dto);
    }
    async update(id, dto) {
        return this.assetsService.update(id, dto);
    }
    async remove(id) {
        return this.assetsService.delete(id);
    }
    async getStats() {
        return this.assetsService.getStats();
    }
};
exports.AssetsController = AssetsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)("type")),
    __param(1, (0, common_1.Query)("status")),
    __param(2, (0, common_1.Query)("location")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], AssetsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AssetsController.prototype, "findOne", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt"), roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)("ADMIN"),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateAssetDto]),
    __metadata("design:returntype", Promise)
], AssetsController.prototype, "create", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt"), roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)("ADMIN"),
    (0, common_1.Put)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_b = typeof Partial !== "undefined" && Partial) === "function" ? _b : Object]),
    __metadata("design:returntype", Promise)
], AssetsController.prototype, "update", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt"), roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)("ADMIN"),
    (0, common_1.Delete)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AssetsController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)("stats/overview"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AssetsController.prototype, "getStats", null);
exports.AssetsController = AssetsController = __decorate([
    (0, common_1.Controller)("assets"),
    __metadata("design:paramtypes", [typeof (_a = typeof assets_service_1.AssetsService !== "undefined" && assets_service_1.AssetsService) === "function" ? _a : Object])
], AssetsController);


/***/ }),
/* 28 */
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
exports.AssetsService = void 0;
const common_1 = __webpack_require__(1);
const prisma_service_1 = __webpack_require__(5);
let AssetsService = class AssetsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(filters) {
        const where = {};
        if (filters?.type && filters.type !== 'all') {
            where.type = filters.type;
        }
        if (filters?.status && filters.status !== 'all') {
            where.status = filters.status;
        }
        if (filters?.location && filters.location !== 'all') {
            where.location = { contains: filters.location, mode: 'insensitive' };
        }
        return this.prisma.asset.findMany({
            where,
            include: {
                company: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }
    async findById(id) {
        const asset = await this.prisma.asset.findUnique({
            where: { id },
            include: {
                company: {
                    select: {
                        id: true,
                        name: true,
                        commissionRate: true,
                    },
                },
                leads: true,
                transactions: {
                    select: {
                        id: true,
                        amount: true,
                        status: true,
                        date: true,
                    },
                },
            },
        });
        if (!asset) {
            throw new common_1.NotFoundException(`Asset with ID ${id} not found`);
        }
        return asset;
    }
    async create(dto) {
        if (dto.referenceCode) {
            const existing = await this.prisma.asset.findUnique({
                where: { referenceCode: dto.referenceCode },
            });
            if (existing) {
                throw new common_1.ConflictException('Reference code already exists');
            }
        }
        const { company, ...assetData } = dto;
        return this.prisma.asset.create({
            data: {
                ...assetData,
                companyId: dto.companyId || company?.id,
                availableUnits: dto.totalUnits,
                finalPrice: dto.basePrice * (1 + dto.markup / 100),
            },
        });
    }
    async update(id, dto) {
        await this.findById(id);
        const updateData = { ...dto };
        if (dto.basePrice || dto.markup) {
            const current = await this.prisma.asset.findUnique({ where: { id } });
            const base = dto.basePrice ?? current.basePrice;
            const markup = dto.markup ?? current.markup;
            updateData.finalPrice = base * (1 + markup / 100);
        }
        if (dto.company) {
            updateData.companyId = dto.company;
            delete updateData.company;
        }
        return this.prisma.asset.update({
            where: { id },
            data: updateData,
        });
    }
    async delete(id) {
        const asset = await this.findById(id);
        if (asset.transactions?.length > 0) {
            throw new common_1.ConflictException('Cannot delete asset with active transactions');
        }
        return this.prisma.asset.delete({ where: { id } });
    }
    async getStats() {
        const [totalAssets, activeAssets, soldOutAssets, totalRevenue, avgPrice,] = await Promise.all([
            this.prisma.asset.count(),
            this.prisma.asset.count({ where: { status: 'published' } }),
            this.prisma.asset.count({ where: { status: 'sold-out' } }),
            this.prisma.transaction.aggregate({
                where: { status: 'completed' },
                _sum: { amount: true },
            }),
            this.prisma.asset.aggregate({
                _avg: { finalPrice: true },
            }),
        ]);
        return {
            totalAssets,
            activeAssets,
            soldOutAssets,
            totalRevenue: totalRevenue._sum.amount || 0,
            averagePrice: avgPrice._avg.finalPrice || 0,
        };
    }
};
exports.AssetsService = AssetsService;
exports.AssetsService = AssetsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], AssetsService);


/***/ }),
/* 29 */
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
exports.CompaniesController = void 0;
const common_1 = __webpack_require__(1);
const companies_service_1 = __webpack_require__(30);
const passport_1 = __webpack_require__(9);
const roles_guard_1 = __webpack_require__(19);
const roles_decorator_1 = __webpack_require__(20);
class CreateCompanyDto {
}
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
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt"), roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)("ADMIN"),
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CompaniesController.prototype, "findAll", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt"), roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)("ADMIN"),
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CompaniesController.prototype, "findOne", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt"), roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)("ADMIN"),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateCompanyDto]),
    __metadata("design:returntype", Promise)
], CompaniesController.prototype, "create", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt"), roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)("ADMIN"),
    (0, common_1.Put)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_b = typeof Partial !== "undefined" && Partial) === "function" ? _b : Object]),
    __metadata("design:returntype", Promise)
], CompaniesController.prototype, "update", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt"), roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)("ADMIN"),
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
/* 30 */
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
const common_1 = __webpack_require__(1);
const prisma_service_1 = __webpack_require__(5);
let CompaniesService = class CompaniesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll() {
        return this.prisma.company.findMany({
            include: {
                assets: {
                    select: {
                        id: true,
                        name: true,
                        status: true,
                    },
                },
                _count: {
                    select: {
                        assets: true,
                        transactions: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    }
    async findById(id) {
        const company = await this.prisma.company.findUnique({
            where: { id },
            include: {
                assets: {
                    select: {
                        id: true,
                        name: true,
                        type: true,
                        status: true,
                        finalPrice: true,
                    },
                },
                transactions: {
                    select: {
                        id: true,
                        amount: true,
                        status: true,
                        date: true,
                    },
                    take: 10,
                    orderBy: {
                        date: "desc",
                    },
                },
                _count: {
                    select: {
                        assets: true,
                        transactions: true,
                    },
                },
            },
        });
        if (!company) {
            throw new common_1.NotFoundException(`Company with ID ${id} not found`);
        }
        return company;
    }
    async create(data) {
        const companyData = {
            ...data,
            agreementStartDate: new Date(data.agreementStartDate),
            agreementExpiryDate: new Date(data.agreementExpiryDate),
            status: data.status || "active",
            activeAssets: 0,
            totalTransactions: 0,
        };
        return this.prisma.company.create({
            data: companyData,
            include: {
                _count: {
                    select: {
                        assets: true,
                        transactions: true,
                    },
                },
            },
        });
    }
    async update(id, data) {
        await this.findById(id);
        const updateData = { ...data };
        if (data.agreementStartDate) {
            updateData.agreementStartDate = new Date(data.agreementStartDate);
        }
        if (data.agreementExpiryDate) {
            updateData.agreementExpiryDate = new Date(data.agreementExpiryDate);
        }
        return this.prisma.company.update({
            where: { id },
            data: updateData,
            include: {
                _count: {
                    select: {
                        assets: true,
                        transactions: true,
                    },
                },
            },
        });
    }
    async delete(id) {
        await this.findById(id);
        const activeAssetsCount = await this.prisma.asset.count({
            where: {
                companyId: id,
                status: "published",
            },
        });
        if (activeAssetsCount > 0) {
            throw new Error(`Cannot delete company with ${activeAssetsCount} active assets. Please archive or delete assets first.`);
        }
        return this.prisma.company.delete({
            where: { id },
        });
    }
    async updateStats(companyId) {
        const [activeAssets, totalTransactions] = await Promise.all([
            this.prisma.asset.count({
                where: {
                    companyId,
                    status: "published",
                },
            }),
            this.prisma.transaction.count({
                where: { companyId },
            }),
        ]);
        return this.prisma.company.update({
            where: { id: companyId },
            data: {
                activeAssets,
                totalTransactions,
            },
        });
    }
};
exports.CompaniesService = CompaniesService;
exports.CompaniesService = CompaniesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], CompaniesService);


/***/ }),
/* 31 */
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
const common_1 = __webpack_require__(1);
const agents_service_1 = __webpack_require__(32);
const passport_1 = __webpack_require__(9);
const roles_guard_1 = __webpack_require__(19);
const roles_decorator_1 = __webpack_require__(20);
class CreateAgentDto {
}
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
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt"), roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)("ADMIN"),
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AgentsController.prototype, "findAll", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt"), roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)("ADMIN"),
    (0, common_1.Get)("stats"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AgentsController.prototype, "getStats", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt"), roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)("ADMIN"),
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AgentsController.prototype, "findOne", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt"), roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)("ADMIN"),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateAgentDto]),
    __metadata("design:returntype", Promise)
], AgentsController.prototype, "create", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt"), roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)("ADMIN"),
    (0, common_1.Put)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_b = typeof Partial !== "undefined" && Partial) === "function" ? _b : Object]),
    __metadata("design:returntype", Promise)
], AgentsController.prototype, "update", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt"), roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)("ADMIN"),
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
/* 32 */
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
const common_1 = __webpack_require__(1);
const prisma_service_1 = __webpack_require__(5);
const bcrypt = __importStar(__webpack_require__(12));
let AgentsService = class AgentsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll() {
        return this.prisma.agent.findMany({
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        name: true,
                    },
                },
                cluster: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                _count: {
                    select: {
                        leadsAsLead: true,
                        leadsAsCloser: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    }
    async findById(id) {
        const agent = await this.prisma.agent.findUnique({
            where: { id },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        name: true,
                    },
                },
                cluster: true,
                leadsAsLead: {
                    take: 10,
                    orderBy: { date: "desc" },
                    include: {
                        asset: {
                            select: {
                                name: true,
                            },
                        },
                    },
                },
                leadsAsCloser: {
                    take: 10,
                    orderBy: { date: "desc" },
                    include: {
                        asset: {
                            select: {
                                name: true,
                            },
                        },
                    },
                },
            },
        });
        if (!agent) {
            throw new common_1.NotFoundException(`Agent with ID ${id} not found`);
        }
        return agent;
    }
    async create(data) {
        const existingUser = await this.prisma.user.findUnique({
            where: { email: data.email },
        });
        if (existingUser) {
            const existingAgent = await this.prisma.agent.findUnique({
                where: { userId: existingUser.id },
            });
            if (existingAgent) {
                throw new common_1.ConflictException("User is already registered as an agent");
            }
        }
        let user;
        if (existingUser) {
            user = existingUser;
        }
        else {
            const hashedPassword = await bcrypt.hash("password123", 10);
            user = await this.prisma.user.create({
                data: {
                    email: data.email,
                    password: hashedPassword,
                    name: data.name,
                    role: "SALES",
                },
            });
        }
        const agent = await this.prisma.agent.create({
            data: {
                userId: user.id,
                clusterId: data.cluster,
                role: data.role,
                status: data.status || "active",
                activeDeals: 0,
                closedDeals: 0,
                totalCommission: 0,
                performance: 0,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        name: true,
                    },
                },
                cluster: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });
        return agent;
    }
    async update(id, data) {
        const agent = await this.findById(id);
        if (data.name || data.email) {
            await this.prisma.user.update({
                where: { id: agent.userId },
                data: {
                    name: data.name,
                    email: data.email,
                },
            });
        }
        const updateData = {};
        if (data.cluster)
            updateData.clusterId = data.cluster;
        if (data.role)
            updateData.role = data.role;
        if (data.status)
            updateData.status = data.status;
        return this.prisma.agent.update({
            where: { id },
            data: updateData,
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        name: true,
                    },
                },
                cluster: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });
    }
    async delete(id) {
        const agent = await this.findById(id);
        const activeDealsCount = await this.prisma.transaction.count({
            where: {
                OR: [
                    { leadAgentId: id },
                    { closerAgentId: id },
                ],
                status: "pending",
            },
        });
        if (activeDealsCount > 0) {
            throw new Error(`Cannot delete agent with ${activeDealsCount} active deals. Please reassign or complete deals first.`);
        }
        return this.prisma.agent.delete({
            where: { id },
        });
    }
    async getStats() {
        const [totalAgents, activeAgents, totalDeals, totalCommission,] = await Promise.all([
            this.prisma.agent.count(),
            this.prisma.agent.count({ where: { status: "active" } }),
            this.prisma.agent.aggregate({
                _sum: {
                    activeDeals: true,
                    closedDeals: true,
                },
            }),
            this.prisma.agent.aggregate({
                _sum: {
                    totalCommission: true,
                },
            }),
        ]);
        return {
            totalAgents,
            activeAgents,
            totalActiveDeals: totalDeals._sum.activeDeals || 0,
            totalClosedDeals: totalDeals._sum.closedDeals || 0,
            totalCommission: totalCommission._sum.totalCommission || 0,
        };
    }
    async updateAgentStats(agentId) {
        const [activeDeals, closedDeals, totalCommission] = await Promise.all([
            this.prisma.transaction.count({
                where: {
                    OR: [
                        { leadAgentId: agentId },
                        { closerAgentId: agentId },
                    ],
                    status: "pending",
                },
            }),
            this.prisma.transaction.count({
                where: {
                    OR: [
                        { leadAgentId: agentId },
                        { closerAgentId: agentId },
                    ],
                    status: "completed",
                },
            }),
            this.prisma.transaction.aggregate({
                where: {
                    OR: [
                        { leadAgentId: agentId },
                        { closerAgentId: agentId },
                    ],
                    status: "completed",
                },
                _sum: {
                    leadCommission: true,
                    closerCommission: true,
                },
            }),
        ]);
        const commission = (totalCommission._sum.leadCommission || 0) +
            (totalCommission._sum.closerCommission || 0);
        return this.prisma.agent.update({
            where: { id: agentId },
            data: {
                activeDeals,
                closedDeals,
                totalCommission: commission,
            },
        });
    }
};
exports.AgentsService = AgentsService;
exports.AgentsService = AgentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], AgentsService);


/***/ }),
/* 33 */
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
const common_1 = __webpack_require__(1);
const clusters_service_1 = __webpack_require__(34);
const passport_1 = __webpack_require__(9);
const roles_guard_1 = __webpack_require__(19);
const roles_decorator_1 = __webpack_require__(20);
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
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt"), roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)("ADMIN"),
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ClustersController.prototype, "findAll", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt"), roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)("ADMIN"),
    (0, common_1.Get)("stats"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ClustersController.prototype, "getStats", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt"), roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)("ADMIN"),
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ClustersController.prototype, "findOne", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt"), roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)("ADMIN"),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateClusterDto]),
    __metadata("design:returntype", Promise)
], ClustersController.prototype, "create", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt"), roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)("ADMIN"),
    (0, common_1.Put)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_b = typeof Partial !== "undefined" && Partial) === "function" ? _b : Object]),
    __metadata("design:returntype", Promise)
], ClustersController.prototype, "update", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt"), roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)("ADMIN"),
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
/* 34 */
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
const common_1 = __webpack_require__(1);
const prisma_service_1 = __webpack_require__(5);
let ClustersService = class ClustersService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll() {
        return this.prisma.cluster.findMany({
            include: {
                agents: {
                    select: {
                        id: true,
                        user: {
                            select: {
                                name: true,
                                email: true,
                            },
                        },
                        role: true,
                        status: true,
                    },
                },
                freelancers: {
                    select: {
                        id: true,
                        user: {
                            select: {
                                name: true,
                                email: true,
                            },
                        },
                    },
                },
                _count: {
                    select: {
                        agents: true,
                        freelancers: true,
                        leads: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    }
    async findById(id) {
        const cluster = await this.prisma.cluster.findUnique({
            where: { id },
            include: {
                agents: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                            },
                        },
                    },
                },
                freelancers: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                            },
                        },
                    },
                },
                leads: {
                    take: 20,
                    orderBy: {
                        dateReceived: "desc",
                    },
                },
                _count: {
                    select: {
                        agents: true,
                        freelancers: true,
                        leads: true,
                    },
                },
            },
        });
        if (!cluster) {
            throw new common_1.NotFoundException(`Cluster with ID ${id} not found`);
        }
        return cluster;
    }
    async create(data) {
        const existingCluster = await this.prisma.cluster.findUnique({
            where: { code: data.code },
        });
        if (existingCluster) {
            throw new common_1.ConflictException(`Cluster with code ${data.code} already exists`);
        }
        return this.prisma.cluster.create({
            data: {
                name: data.name,
                code: data.code,
                teamLead: data.teamLead,
                location: data.location,
                status: data.status || "active",
                activeAssets: 0,
                totalCommission: 0,
            },
            include: {
                _count: {
                    select: {
                        agents: true,
                        freelancers: true,
                        leads: true,
                    },
                },
            },
        });
    }
    async update(id, data) {
        await this.findById(id);
        if (data.code) {
            const existingCluster = await this.prisma.cluster.findUnique({
                where: { code: data.code },
            });
            if (existingCluster && existingCluster.id !== id) {
                throw new common_1.ConflictException(`Cluster with code ${data.code} already exists`);
            }
        }
        return this.prisma.cluster.update({
            where: { id },
            data,
            include: {
                _count: {
                    select: {
                        agents: true,
                        freelancers: true,
                        leads: true,
                    },
                },
            },
        });
    }
    async delete(id) {
        await this.findById(id);
        const activeAgentsCount = await this.prisma.agent.count({
            where: {
                clusterId: id,
                status: "active",
            },
        });
        if (activeAgentsCount > 0) {
            throw new Error(`Cannot delete cluster with ${activeAgentsCount} active agents. Please reassign agents first.`);
        }
        const pendingLeadsCount = await this.prisma.lead.count({
            where: {
                assignedCluster: id,
                status: "pending",
            },
        });
        if (pendingLeadsCount > 0) {
            throw new Error(`Cannot delete cluster with ${pendingLeadsCount} pending leads. Please reassign leads first.`);
        }
        return this.prisma.cluster.delete({
            where: { id },
        });
    }
    async getStats() {
        const [totalClusters, activeClusters, totalAgents, totalCommission,] = await Promise.all([
            this.prisma.cluster.count(),
            this.prisma.cluster.count({ where: { status: "active" } }),
            this.prisma.cluster.aggregate({
                _count: true,
            }).then(async () => {
                return this.prisma.agent.count();
            }),
            this.prisma.cluster.aggregate({
                _sum: {
                    totalCommission: true,
                },
            }),
        ]);
        return {
            totalClusters,
            activeClusters,
            totalAgents,
            totalCommission: totalCommission._sum.totalCommission || 0,
        };
    }
    async updateClusterStats(clusterId) {
        const agents = await this.prisma.agent.findMany({
            where: { clusterId },
            select: { totalCommission: true },
        });
        const totalCommission = agents.reduce((sum, agent) => sum + (agent.totalCommission || 0), 0);
        const activeAssets = await this.prisma.lead.count({
            where: {
                assignedCluster: clusterId,
                status: "assigned",
            },
        });
        return this.prisma.cluster.update({
            where: { id: clusterId },
            data: {
                totalCommission,
                activeAssets,
            },
        });
    }
    async getPerformanceMetrics(clusterId) {
        const cluster = await this.findById(clusterId);
        const transactions = await this.prisma.transaction.findMany({
            where: {
                OR: [
                    {
                        leadAgent: {
                            clusterId,
                        },
                    },
                    {
                        closerAgent: {
                            clusterId,
                        },
                    },
                ],
            },
            include: {
                asset: {
                    select: {
                        name: true,
                    },
                },
            },
        });
        const completedTransactions = transactions.filter((t) => t.status === "completed");
        const totalRevenue = completedTransactions.reduce((sum, t) => sum + (t.amount || 0), 0);
        const totalCommission = completedTransactions.reduce((sum, t) => sum + (t.totalCommission || 0), 0);
        return {
            cluster,
            metrics: {
                totalTransactions: transactions.length,
                completedTransactions: completedTransactions.length,
                totalRevenue,
                totalCommission,
                averageTransactionValue: completedTransactions.length > 0
                    ? totalRevenue / completedTransactions.length
                    : 0,
                conversionRate: transactions.length > 0
                    ? (completedTransactions.length / transactions.length) * 100
                    : 0,
            },
        };
    }
};
exports.ClustersService = ClustersService;
exports.ClustersService = ClustersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], ClustersService);


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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LeadsController = void 0;
const common_1 = __webpack_require__(1);
const leads_service_1 = __webpack_require__(36);
const passport_1 = __webpack_require__(9);
const roles_guard_1 = __webpack_require__(19);
const roles_decorator_1 = __webpack_require__(20);
class CreateLeadDto {
}
class AssignLeadsDto {
}
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
    async create(dto) {
        return this.leadsService.create(dto);
    }
    async assignLeads(dto) {
        return this.leadsService.assignLeads(dto);
    }
    async update(id, dto) {
        return this.leadsService.update(id, dto);
    }
};
exports.LeadsController = LeadsController;
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt"), roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)("ADMIN", "SALES"),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)("source")),
    __param(1, (0, common_1.Query)("status")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], LeadsController.prototype, "findAll", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt"), roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)("ADMIN"),
    (0, common_1.Get)("stats"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], LeadsController.prototype, "getStats", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt"), roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)("ADMIN", "SALES"),
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LeadsController.prototype, "findOne", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt"), roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)("ADMIN", "SALES"),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateLeadDto]),
    __metadata("design:returntype", Promise)
], LeadsController.prototype, "create", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt"), roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)("ADMIN"),
    (0, common_1.Post)("assign"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [AssignLeadsDto]),
    __metadata("design:returntype", Promise)
], LeadsController.prototype, "assignLeads", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt"), roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)("ADMIN", "SALES"),
    (0, common_1.Put)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_b = typeof Partial !== "undefined" && Partial) === "function" ? _b : Object]),
    __metadata("design:returntype", Promise)
], LeadsController.prototype, "update", null);
exports.LeadsController = LeadsController = __decorate([
    (0, common_1.Controller)("leads"),
    __metadata("design:paramtypes", [typeof (_a = typeof leads_service_1.LeadsService !== "undefined" && leads_service_1.LeadsService) === "function" ? _a : Object])
], LeadsController);


/***/ }),
/* 36 */
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
exports.LeadsService = void 0;
const common_1 = __webpack_require__(1);
const prisma_service_1 = __webpack_require__(5);
let LeadsService = class LeadsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(filters) {
        const where = {};
        if (filters?.source && filters.source !== "all") {
            where.leadSource = filters.source;
        }
        if (filters?.status && filters.status !== "all") {
            where.status = filters.status;
        }
        return this.prisma.lead.findMany({
            where,
            include: {
                asset: {
                    select: {
                        id: true,
                        name: true,
                        location: true,
                    },
                },
                creator: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                cluster: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
            orderBy: {
                dateReceived: "desc",
            },
        });
    }
    async findById(id) {
        const lead = await this.prisma.lead.findUnique({
            where: { id },
            include: {
                asset: true,
                creator: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                cluster: true,
            },
        });
        if (!lead) {
            throw new common_1.NotFoundException(`Lead with ID ${id} not found`);
        }
        return lead;
    }
    async create(data) {
        return this.prisma.lead.create({
            data: {
                name: data.name,
                email: data.email,
                phone: data.phone,
                assetInterest: data.assetInterest,
                budget: data.budget,
                source: data.source,
                leadSource: data.leadSource,
                createdBy: data.createdBy,
                status: "pending",
                dateReceived: new Date(),
            },
            include: {
                creator: {
                    select: {
                        name: true,
                        email: true,
                    },
                },
            },
        });
    }
    async update(id, data) {
        await this.findById(id);
        return this.prisma.lead.update({
            where: { id },
            data,
            include: {
                asset: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                cluster: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });
    }
    async assignLeads(data) {
        const { leadIds, assignmentType, clusterId } = data;
        const leads = await this.prisma.lead.findMany({
            where: {
                id: { in: leadIds },
            },
        });
        if (leads.length !== leadIds.length) {
            throw new common_1.NotFoundException("One or more leads not found");
        }
        if (assignmentType === "cluster" && clusterId) {
            const cluster = await this.prisma.cluster.findUnique({
                where: { id: clusterId },
            });
            if (!cluster) {
                throw new common_1.NotFoundException(`Cluster with ID ${clusterId} not found`);
            }
        }
        if (assignmentType === "all") {
            return this.prisma.lead.updateMany({
                where: {
                    id: { in: leadIds },
                },
                data: {
                    status: "available",
                    assignedTo: "All Clusters",
                    assignedCluster: null,
                },
            });
        }
        else {
            const cluster = await this.prisma.cluster.findUnique({
                where: { id: clusterId },
            });
            return this.prisma.lead.updateMany({
                where: {
                    id: { in: leadIds },
                },
                data: {
                    status: "assigned",
                    assignedTo: cluster?.name || null,
                    assignedCluster: clusterId,
                },
            });
        }
    }
    async getStats() {
        const [totalLeads, pendingLeads, assignedLeads, availableLeads, convertedLeads, leadsBySource,] = await Promise.all([
            this.prisma.lead.count(),
            this.prisma.lead.count({ where: { status: "pending" } }),
            this.prisma.lead.count({ where: { status: "assigned" } }),
            this.prisma.lead.count({ where: { status: "available" } }),
            this.prisma.lead.count({ where: { status: "converted" } }),
            this.prisma.lead.groupBy({
                by: ["leadSource"],
                _count: true,
            }),
        ]);
        const conversionRate = totalLeads > 0
            ? (convertedLeads / totalLeads) * 100
            : 0;
        return {
            totalLeads,
            pendingLeads,
            assignedLeads,
            availableLeads,
            convertedLeads,
            conversionRate: conversionRate.toFixed(2),
            leadsBySource,
        };
    }
    async getLeadsByCluster(clusterId) {
        return this.prisma.lead.findMany({
            where: {
                assignedCluster: clusterId,
            },
            include: {
                asset: {
                    select: {
                        name: true,
                        location: true,
                    },
                },
            },
            orderBy: {
                dateReceived: "desc",
            },
        });
    }
    async convertLead(leadId, transactionData) {
        const lead = await this.prisma.lead.update({
            where: { id: leadId },
            data: {
                status: "converted",
            },
        });
        return lead;
    }
    async bulkImportLeads(leads) {
        return this.prisma.lead.createMany({
            data: leads.map(lead => ({
                ...lead,
                status: "pending",
                dateReceived: new Date(),
            })),
            skipDuplicates: true,
        });
    }
    async getLeadHistory(leadId) {
        return this.findById(leadId);
    }
};
exports.LeadsService = LeadsService;
exports.LeadsService = LeadsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], LeadsService);


/***/ }),
/* 37 */
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
exports.TransactionsController = void 0;
const common_1 = __webpack_require__(1);
const platform_express_1 = __webpack_require__(38);
const transactions_service_1 = __webpack_require__(39);
const passport_1 = __webpack_require__(9);
const roles_guard_1 = __webpack_require__(19);
const roles_decorator_1 = __webpack_require__(20);
class CreateTransactionDto {
}
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
    async update(id, dto) {
        return this.transactionsService.update(id, dto);
    }
};
exports.TransactionsController = TransactionsController;
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt"), roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)("ADMIN"),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)("month")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TransactionsController.prototype, "findAll", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt"), roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)("ADMIN"),
    (0, common_1.Get)("stats"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TransactionsController.prototype, "getStats", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt"), roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)("ADMIN"),
    (0, common_1.Get)("commissions/unpaid"),
    __param(0, (0, common_1.Query)("month")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TransactionsController.prototype, "getUnpaidCommissions", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt"), roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)("ADMIN"),
    (0, common_1.Get)("commissions/paid"),
    __param(0, (0, common_1.Query)("month")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TransactionsController.prototype, "getPaidCommissions", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt"), roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)("ADMIN"),
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TransactionsController.prototype, "findOne", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt"), roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)("ADMIN"),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateTransactionDto]),
    __metadata("design:returntype", Promise)
], TransactionsController.prototype, "create", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt"), roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)("ADMIN"),
    (0, common_1.Post)("commissions/send"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [SendCommissionsDto]),
    __metadata("design:returntype", Promise)
], TransactionsController.prototype, "sendCommissions", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt"), roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)("ADMIN"),
    (0, common_1.Post)("commissions/payment-proof"),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)("file")),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_c = typeof Express !== "undefined" && (_b = Express.Multer) !== void 0 && _b.File) === "function" ? _c : Object]),
    __metadata("design:returntype", Promise)
], TransactionsController.prototype, "uploadPaymentProof", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt"), roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)("ADMIN"),
    (0, common_1.Put)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_d = typeof Partial !== "undefined" && Partial) === "function" ? _d : Object]),
    __metadata("design:returntype", Promise)
], TransactionsController.prototype, "update", null);
exports.TransactionsController = TransactionsController = __decorate([
    (0, common_1.Controller)("transactions"),
    __metadata("design:paramtypes", [typeof (_a = typeof transactions_service_1.TransactionsService !== "undefined" && transactions_service_1.TransactionsService) === "function" ? _a : Object])
], TransactionsController);


/***/ }),
/* 38 */
/***/ ((module) => {

module.exports = require("@nestjs/platform-express");

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
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TransactionsService = void 0;
const common_1 = __webpack_require__(1);
const prisma_service_1 = __webpack_require__(5);
let TransactionsService = class TransactionsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(filters) {
        const where = {};
        if (filters?.month) {
            const [year, month] = filters.month.split("-");
            const startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
            const endDate = new Date(parseInt(year), parseInt(month), 0);
            where.date = {
                gte: startDate,
                lte: endDate,
            };
        }
        return this.prisma.transaction.findMany({
            where,
            include: {
                asset: {
                    select: {
                        id: true,
                        name: true,
                        referenceCode: true,
                    },
                },
                buyer: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                leadAgent: {
                    select: {
                        id: true,
                        user: {
                            select: {
                                name: true,
                                email: true,
                            },
                        },
                    },
                },
                closerAgent: {
                    select: {
                        id: true,
                        user: {
                            select: {
                                name: true,
                                email: true,
                            },
                        },
                    },
                },
                company: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
            orderBy: {
                date: "desc",
            },
        });
    }
    async findById(id) {
        const transaction = await this.prisma.transaction.findUnique({
            where: { id },
            include: {
                asset: true,
                buyer: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
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
                company: true,
            },
        });
        if (!transaction) {
            throw new common_1.NotFoundException(`Transaction with ID ${id} not found`);
        }
        return transaction;
    }
    async create(data) {
        await Promise.all([
            this.prisma.asset.findUniqueOrThrow({ where: { id: data.assetId } }),
            this.prisma.user.findUniqueOrThrow({ where: { id: data.buyerId } }),
            this.prisma.agent.findUniqueOrThrow({ where: { id: data.leadAgentId } }),
            this.prisma.agent.findUniqueOrThrow({ where: { id: data.closerAgentId } }),
            this.prisma.company.findUniqueOrThrow({ where: { id: data.companyId } }),
        ]);
        const transaction = await this.prisma.transaction.create({
            data: {
                assetId: data.assetId,
                buyerId: data.buyerId,
                leadAgentId: data.leadAgentId,
                closerAgentId: data.closerAgentId,
                companyId: data.companyId,
                amount: data.amount,
                paymentType: data.paymentType,
                leadCommission: data.leadCommission,
                closerCommission: data.closerCommission,
                totalCommission: data.totalCommission,
                status: data.status,
                commissionPaymentStatus: "unpaid",
                date: new Date(),
            },
            include: {
                asset: true,
                buyer: {
                    select: {
                        name: true,
                        email: true,
                    },
                },
                leadAgent: {
                    include: {
                        user: {
                            select: {
                                name: true,
                            },
                        },
                    },
                },
                closerAgent: {
                    include: {
                        user: {
                            select: {
                                name: true,
                            },
                        },
                    },
                },
                company: true,
            },
        });
        if (data.status === "completed") {
            await this.updateAgentStatsAfterTransaction(data.leadAgentId, data.closerAgentId);
        }
        return transaction;
    }
    async update(id, data) {
        const transaction = await this.findById(id);
        const updated = await this.prisma.transaction.update({
            where: { id },
            data,
            include: {
                asset: true,
                buyer: {
                    select: {
                        name: true,
                        email: true,
                    },
                },
                leadAgent: {
                    include: {
                        user: {
                            select: {
                                name: true,
                            },
                        },
                    },
                },
                closerAgent: {
                    include: {
                        user: {
                            select: {
                                name: true,
                            },
                        },
                    },
                },
                company: true,
            },
        });
        if (data.status === "completed" && transaction.status !== "completed") {
            await this.updateAgentStatsAfterTransaction(transaction.leadAgentId, transaction.closerAgentId || "");
        }
        return updated;
    }
    async getStats() {
        const [totalTransactions, completedTransactions, pendingTransactions, totalRevenue, totalCommission, earnedCommission,] = await Promise.all([
            this.prisma.transaction.count(),
            this.prisma.transaction.count({ where: { status: "completed" } }),
            this.prisma.transaction.count({ where: { status: "pending" } }),
            this.prisma.transaction.aggregate({
                where: { status: "completed" },
                _sum: { amount: true },
            }),
            this.prisma.transaction.aggregate({
                where: { status: "completed" },
                _sum: { totalCommission: true },
            }),
            this.prisma.transaction.aggregate({
                where: { status: "completed" },
                _sum: { earnedTotalCommission: true },
            }),
        ]);
        return {
            totalTransactions,
            completedTransactions,
            pendingTransactions,
            totalRevenue: totalRevenue._sum.amount || 0,
            totalCommission: totalCommission._sum.totalCommission || 0,
            earnedCommission: earnedCommission._sum.earnedTotalCommission || 0,
            averageTransactionValue: completedTransactions > 0
                ? (totalRevenue._sum.amount || 0) / completedTransactions
                : 0,
        };
    }
    async getUnpaidCommissions(filters) {
        const where = {
            OR: [
                { commissionPaymentStatus: "unpaid" },
                { commissionPaymentStatus: "sent" },
            ],
        };
        if (filters?.month) {
            const [year, month] = filters.month.split("-");
            const startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
            const endDate = new Date(parseInt(year), parseInt(month), 0);
            where.date = {
                gte: startDate,
                lte: endDate,
            };
        }
        return this.prisma.transaction.findMany({
            where,
            include: {
                asset: {
                    select: {
                        name: true,
                    },
                },
                leadAgent: {
                    include: {
                        user: {
                            select: {
                                name: true,
                            },
                        },
                    },
                },
                closerAgent: {
                    include: {
                        user: {
                            select: {
                                name: true,
                            },
                        },
                    },
                },
            },
            orderBy: {
                date: "desc",
            },
        });
    }
    async getPaidCommissions(filters) {
        const where = {
            commissionPaymentStatus: "paid",
        };
        if (filters?.month) {
            const [year, month] = filters.month.split("-");
            const startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
            const endDate = new Date(parseInt(year), parseInt(month), 0);
            where.date = {
                gte: startDate,
                lte: endDate,
            };
        }
        return this.prisma.transaction.findMany({
            where,
            include: {
                asset: {
                    select: {
                        name: true,
                    },
                },
                leadAgent: {
                    include: {
                        user: {
                            select: {
                                name: true,
                            },
                        },
                    },
                },
                closerAgent: {
                    include: {
                        user: {
                            select: {
                                name: true,
                            },
                        },
                    },
                },
            },
            orderBy: {
                date: "desc",
            },
        });
    }
    async sendCommissionsForPayment(transactionIds) {
        return this.prisma.transaction.updateMany({
            where: {
                id: { in: transactionIds },
                commissionPaymentStatus: "unpaid",
            },
            data: {
                commissionPaymentStatus: "sent",
            },
        });
    }
    async uploadPaymentProof(file) {
        const sentCommissions = await this.prisma.transaction.findMany({
            where: {
                commissionPaymentStatus: "sent",
            },
        });
        if (sentCommissions.length === 0) {
            throw new common_1.NotFoundException("No commissions marked as sent");
        }
        await this.prisma.transaction.updateMany({
            where: {
                commissionPaymentStatus: "sent",
            },
            data: {
                commissionPaymentStatus: "paid",
            },
        });
        return {
            message: `${sentCommissions.length} commissions marked as paid`,
            count: sentCommissions.length,
        };
    }
    async updateAgentStatsAfterTransaction(leadAgentId, closerAgentId) {
        const leadAgentStats = await this.prisma.transaction.aggregate({
            where: {
                leadAgentId,
                status: "completed",
            },
            _count: true,
            _sum: {
                leadCommission: true,
            },
        });
        await this.prisma.agent.update({
            where: { id: leadAgentId },
            data: {
                closedDeals: leadAgentStats._count,
                totalCommission: leadAgentStats._sum.leadCommission || 0,
            },
        });
        const closerAgentStats = await this.prisma.transaction.aggregate({
            where: {
                closerAgentId,
                status: "completed",
            },
            _count: true,
            _sum: {
                closerCommission: true,
            },
        });
        await this.prisma.agent.update({
            where: { id: closerAgentId },
            data: {
                closedDeals: closerAgentStats._count,
                totalCommission: closerAgentStats._sum.closerCommission || 0,
            },
        });
    }
};
exports.TransactionsService = TransactionsService;
exports.TransactionsService = TransactionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], TransactionsService);


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
exports.InstallmentsController = void 0;
const common_1 = __webpack_require__(1);
const installments_service_1 = __webpack_require__(41);
const passport_1 = __webpack_require__(9);
const roles_guard_1 = __webpack_require__(19);
const roles_decorator_1 = __webpack_require__(20);
class CreateInstallmentPlanDto {
}
class SendReminderDto {
}
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
};
exports.InstallmentsController = InstallmentsController;
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt"), roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)("ADMIN"),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)("status")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InstallmentsController.prototype, "findAll", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt"), roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)("ADMIN"),
    (0, common_1.Get)("stats"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], InstallmentsController.prototype, "getStats", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt"), roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)("ADMIN"),
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InstallmentsController.prototype, "findOne", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt"), roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)("ADMIN"),
    (0, common_1.Get)(":id/schedule"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InstallmentsController.prototype, "getSchedule", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt"), roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)("ADMIN"),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateInstallmentPlanDto]),
    __metadata("design:returntype", Promise)
], InstallmentsController.prototype, "create", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt"), roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)("ADMIN"),
    (0, common_1.Post)("reminders/send"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [SendReminderDto]),
    __metadata("design:returntype", Promise)
], InstallmentsController.prototype, "sendReminder", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt"), roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)("ADMIN"),
    (0, common_1.Put)(":id/installments/:installmentId/pay"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Param)("installmentId")),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], InstallmentsController.prototype, "recordPayment", null);
exports.InstallmentsController = InstallmentsController = __decorate([
    (0, common_1.Controller)("installments"),
    __metadata("design:paramtypes", [typeof (_a = typeof installments_service_1.InstallmentsService !== "undefined" && installments_service_1.InstallmentsService) === "function" ? _a : Object])
], InstallmentsController);


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
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.InstallmentsService = void 0;
const common_1 = __webpack_require__(1);
const prisma_service_1 = __webpack_require__(5);
let InstallmentsService = class InstallmentsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(filters) {
        const where = {};
        if (filters?.status && filters.status !== 'all') {
            where.status = filters.status;
        }
        return this.prisma.installmentPlan.findMany({
            where,
            include: {
                asset: {
                    select: {
                        id: true,
                        name: true,
                        referenceCode: true,
                    },
                },
                leadAgent: {
                    include: {
                        user: {
                            select: {
                                id: true,
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
                                id: true,
                                name: true,
                                email: true,
                            },
                        },
                    },
                },
                installments: true,
                company: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }
    async create(dto) {
        return this.prisma.installmentPlan.create({
            data: {
                ...dto,
                companyId: dto.companyId,
                remainingBalance: dto.totalAmount - (dto.downPayment || 0),
                paidAmount: 0,
                installmentAmount: dto.totalAmount / dto.numberOfInstallments,
            },
        });
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
                status: installment.paidAmount + data.amount >= installment.amount ? "paid" : "partial",
                paidDate: new Date(),
                paymentMethod: data.paymentMethod,
            },
        });
        const newPaidAmount = plan.paidAmount + data.amount;
        const completedInstallments = await this.prisma.installment.count({
            where: {
                installmentPlanId: planId,
                status: "paid",
            },
        });
        const nextInstallment = await this.prisma.installment.findFirst({
            where: {
                installmentPlanId: planId,
                status: { in: ["pending", "upcoming", "overdue"] },
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
                status: isCompleted ? "completed" : "active",
            },
        });
        return updatedInstallment;
    }
    async sendPaymentReminder(data) {
        const installment = await this.prisma.installment.findUnique({
            where: { id: data.installmentId },
            include: {
                plan: true,
            },
        });
        if (!installment) {
            throw new common_1.NotFoundException(`Installment with ID ${data.installmentId} not found`);
        }
        console.log(`Sending ${data.method} reminder to ${installment.plan.buyerEmail}`);
        return {
            message: "Reminder sent successfully",
            installmentId: data.installmentId,
            method: data.method,
            sentAt: new Date(),
        };
    }
    async getStats() {
        const [activePlans, completedPlans, totalOutstanding, totalCollected, overduePayments,] = await Promise.all([
            this.prisma.installmentPlan.count({ where: { status: "active" } }),
            this.prisma.installmentPlan.count({ where: { status: "completed" } }),
            this.prisma.installmentPlan.aggregate({
                where: { status: "active" },
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
                where: { status: "overdue" },
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
                status: { in: ["pending", "upcoming"] },
            },
            data: {
                status: "overdue",
            },
        });
        const weekFromNow = new Date(today);
        weekFromNow.setDate(weekFromNow.getDate() + 7);
        await this.prisma.installment.updateMany({
            where: {
                dueDate: { lte: weekFromNow, gte: today },
                status: "upcoming",
            },
            data: {
                status: "pending",
            },
        });
    }
    async generateInstallmentSchedule(planId, data) {
        const installments = [];
        const { numberOfInstallments, installmentAmount, frequency, startDate } = data;
        for (let i = 0; i < numberOfInstallments; i++) {
            const dueDate = this.calculateDueDate(startDate, frequency, i);
            installments.push({
                installmentPlanId: planId,
                dueDate,
                amount: installmentAmount,
                paidAmount: 0,
                status: i === 0 ? "pending" : "upcoming",
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
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], InstallmentsService);


/***/ }),
/* 42 */
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
const common_1 = __webpack_require__(1);
const reports_service_1 = __webpack_require__(43);
const express_1 = __webpack_require__(45);
const roles_guard_1 = __webpack_require__(19);
const roles_decorator_1 = __webpack_require__(20);
const passport_1 = __webpack_require__(9);
let ReportsController = class ReportsController {
    constructor(reportsService) {
        this.reportsService = reportsService;
    }
    async getSalesReport(dateRange) {
        const report = await this.reportsService.getSalesReport(dateRange);
        return {
            success: true,
            data: report,
            message: 'Sales report fetched successfully'
        };
    }
    async getAgentPerformance(dateRange) {
        const report = await this.reportsService.getAgentPerformance(dateRange);
        return {
            success: true,
            data: report,
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
};
exports.ReportsController = ReportsController;
__decorate([
    (0, common_1.Get)('sales'),
    (0, roles_decorator_1.Roles)('ADMIN', 'MANAGER'),
    __param(0, (0, common_1.Query)('dateRange')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getSalesReport", null);
__decorate([
    (0, common_1.Get)('agents'),
    (0, roles_decorator_1.Roles)('ADMIN', 'MANAGER'),
    __param(0, (0, common_1.Query)('dateRange')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getAgentPerformance", null);
__decorate([
    (0, common_1.Get)('clusters'),
    (0, roles_decorator_1.Roles)('ADMIN', 'MANAGER'),
    __param(0, (0, common_1.Query)('dateRange')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getClusterPerformance", null);
__decorate([
    (0, common_1.Get)('export'),
    (0, roles_decorator_1.Roles)('ADMIN', 'MANAGER'),
    __param(0, (0, common_1.Query)('type')),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Query)('dateRange')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_b = typeof express_1.Response !== "undefined" && express_1.Response) === "function" ? _b : Object, String]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "exportReport", null);
exports.ReportsController = ReportsController = __decorate([
    (0, common_1.Controller)('reports'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [typeof (_a = typeof reports_service_1.ReportsService !== "undefined" && reports_service_1.ReportsService) === "function" ? _a : Object])
], ReportsController);


/***/ }),
/* 43 */
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
const common_1 = __webpack_require__(1);
const prisma_service_1 = __webpack_require__(5);
const ExcelJS = __importStar(__webpack_require__(44));
let ReportsService = class ReportsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    getDateFilter(dateRange) {
        const where = {};
        const now = new Date();
        switch (dateRange) {
            case '7d':
                const weekAgo = new Date();
                weekAgo.setDate(weekAgo.getDate() - 7);
                where.date = { gte: weekAgo };
                break;
            case '30d':
                const monthAgo = new Date();
                monthAgo.setDate(monthAgo.getDate() - 30);
                where.date = { gte: monthAgo };
                break;
            case '90d':
                const quarterAgo = new Date();
                quarterAgo.setDate(quarterAgo.getDate() - 90);
                where.date = { gte: quarterAgo };
                break;
            case 'ytd':
                const yearStart = new Date(now.getFullYear(), 0, 1);
                where.date = { gte: yearStart };
                break;
            default:
                const defaultAgo = new Date();
                defaultAgo.setDate(defaultAgo.getDate() - 30);
                where.date = { gte: defaultAgo };
                break;
        }
        return where;
    }
    getPreviousPeriodFilter(dateRange) {
        const where = {};
        const now = new Date();
        switch (dateRange) {
            case '7d':
                const weekAgoStart = new Date();
                weekAgoStart.setDate(weekAgoStart.getDate() - 14);
                const weekAgoEnd = new Date();
                weekAgoEnd.setDate(weekAgoEnd.getDate() - 7);
                where.date = { gte: weekAgoStart, lt: weekAgoEnd };
                break;
            case '30d':
                const monthAgoStart = new Date();
                monthAgoStart.setDate(monthAgoStart.getDate() - 60);
                const monthAgoEnd = new Date();
                monthAgoEnd.setDate(monthAgoEnd.getDate() - 30);
                where.date = { gte: monthAgoStart, lt: monthAgoEnd };
                break;
            case '90d':
                const quarterAgoStart = new Date();
                quarterAgoStart.setDate(quarterAgoStart.getDate() - 180);
                const quarterAgoEnd = new Date();
                quarterAgoEnd.setDate(quarterAgoEnd.getDate() - 90);
                where.date = { gte: quarterAgoStart, lt: quarterAgoEnd };
                break;
            case 'ytd':
                const lastYearStart = new Date(now.getFullYear() - 1, 0, 1);
                const lastYearEnd = new Date(now.getFullYear() - 1, 11, 31);
                where.date = { gte: lastYearStart, lt: lastYearEnd };
                break;
            default:
                return null;
        }
        return where;
    }
    async getSalesReport(dateRange) {
        const dateFilter = this.getDateFilter(dateRange);
        const previousPeriodFilter = this.getPreviousPeriodFilter(dateRange);
        const [transactions, previousTransactions, totalRevenueAgg, totalTransactionsCount, previousRevenueAgg, previousTransactionsCount,] = await Promise.all([
            this.prisma.transaction.findMany({
                where: {
                    status: 'completed',
                    ...dateFilter,
                },
                include: {
                    asset: {
                        select: {
                            name: true,
                            type: true,
                        }
                    }
                },
                orderBy: {
                    date: 'desc'
                }
            }),
            previousPeriodFilter ? this.prisma.transaction.findMany({
                where: {
                    status: 'completed',
                    ...previousPeriodFilter,
                },
            }) : [],
            this.prisma.transaction.aggregate({
                where: {
                    status: 'completed',
                    ...dateFilter,
                },
                _sum: { amount: true },
            }),
            this.prisma.transaction.count({
                where: {
                    status: 'completed',
                    ...dateFilter,
                },
            }),
            previousPeriodFilter ? this.prisma.transaction.aggregate({
                where: {
                    status: 'completed',
                    ...previousPeriodFilter,
                },
                _sum: { amount: true },
            }) : { _sum: { amount: 0 } },
            previousPeriodFilter ? this.prisma.transaction.count({
                where: {
                    status: 'completed',
                    ...previousPeriodFilter,
                },
            }) : 0,
        ]);
        const totalRevenue = totalRevenueAgg._sum.amount || 0;
        const totalTransactions = totalTransactionsCount;
        const avgDealSize = totalTransactions > 0 ? totalRevenue / totalTransactions : 0;
        const previousRevenue = previousRevenueAgg._sum.amount || 0;
        const previousTransactionsCountVal = previousTransactionsCount;
        const previousAvgDealSize = previousTransactionsCountVal > 0 ? previousRevenue / previousTransactionsCountVal : 0;
        const revenueChange = previousRevenue > 0
            ? ((totalRevenue - previousRevenue) / previousRevenue) * 100
            : 0;
        const transactionChange = previousTransactionsCountVal > 0
            ? ((totalTransactions - previousTransactionsCountVal) / previousTransactionsCountVal) * 100
            : 0;
        const avgDealSizeChange = previousAvgDealSize > 0
            ? ((avgDealSize - previousAvgDealSize) / previousAvgDealSize) * 100
            : 0;
        const salesByMonth = this.processSalesByMonth(transactions);
        const topAssets = await this.getTopAssetsBySales(dateFilter);
        const salesByType = this.processSalesByType(transactions);
        return {
            summary: {
                totalRevenue,
                totalTransactions,
                avgDealSize,
                revenueChange,
                transactionChange,
                avgDealSizeChange,
            },
            salesByMonth,
            topAssets: topAssets.slice(0, 10),
            salesByType,
        };
    }
    processSalesByMonth(transactions) {
        const monthlyData = {};
        transactions.forEach(tx => {
            const date = new Date(tx.date);
            const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            const monthName = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
            if (!monthlyData[monthName]) {
                monthlyData[monthName] = { revenue: 0, transactions: 0, commission: 0 };
            }
            monthlyData[monthName].revenue += tx.amount;
            monthlyData[monthName].transactions += 1;
            monthlyData[monthName].commission += tx.totalCommission || 0;
        });
        return Object.entries(monthlyData).map(([month, data]) => ({
            month,
            revenue: data.revenue,
            transactions: data.transactions,
            avgValue: data.transactions > 0 ? data.revenue / data.transactions : 0,
            commission: data.commission,
        })).sort((a, b) => {
            const [aMonth, aYear] = a.month.split(' ');
            const [bMonth, bYear] = b.month.split(' ');
            return new Date(`${aMonth} 1, ${aYear}`).getTime() - new Date(`${bMonth} 1, ${bYear}`).getTime();
        });
    }
    async getTopAssetsBySales(dateFilter) {
        const result = await this.prisma.transaction.groupBy({
            by: ['assetId'],
            where: {
                status: 'completed',
                ...dateFilter,
            },
            _sum: {
                amount: true,
                totalCommission: true
            },
            _count: true,
            orderBy: { _sum: { amount: 'desc' } },
            take: 10,
        });
        if (result.length === 0) {
            return [];
        }
        const assetIds = result.map(r => r.assetId);
        const assets = await this.prisma.asset.findMany({
            where: { id: { in: assetIds } },
            select: {
                id: true,
                name: true,
                type: true,
                location: true,
            },
        });
        const assetsMap = new Map(assets.map(a => [a.id, a]));
        return result.map(r => {
            const asset = assetsMap.get(r.assetId);
            return {
                name: asset?.name || 'Unknown Asset',
                revenue: r._sum.amount || 0,
                count: r._count,
                commission: r._sum.totalCommission || 0,
                type: asset?.type || 'Unknown',
                location: asset?.location || 'Unknown',
            };
        });
    }
    processSalesByType(transactions) {
        const typeData = {};
        transactions.forEach(tx => {
            const type = tx.paymentType || 'Unknown';
            if (!typeData[type]) {
                typeData[type] = { revenue: 0, count: 0, commission: 0 };
            }
            typeData[type].revenue += tx.amount;
            typeData[type].count += 1;
            typeData[type].commission += tx.totalCommission || 0;
        });
        return Object.entries(typeData).map(([type, data]) => ({
            type,
            revenue: data.revenue,
            count: data.count,
            avgValue: data.count > 0 ? data.revenue / data.count : 0,
            commission: data.commission,
        })).sort((a, b) => b.revenue - a.revenue);
    }
    async getAgentPerformance(dateRange) {
        const dateFilter = this.getDateFilter(dateRange);
        const agents = await this.prisma.agent.findMany({
            where: { status: 'active' },
            include: {
                user: {
                    select: {
                        name: true,
                        email: true,
                    }
                },
                leadsAsLead: {
                    where: {
                        status: 'completed',
                        ...dateFilter,
                    },
                    select: {
                        amount: true,
                        leadCommission: true,
                        closerCommission: true,
                        totalCommission: true,
                        date: true,
                        earnedLeadCommission: true,
                        earnedTotalCommission: true,
                    }
                },
                leadsAsCloser: {
                    where: {
                        status: 'completed',
                        ...dateFilter,
                    },
                    select: {
                        amount: true,
                        leadCommission: true,
                        closerCommission: true,
                        totalCommission: true,
                        date: true,
                        earnedCloserCommission: true,
                        earnedTotalCommission: true,
                    }
                },
                cluster: {
                    select: {
                        name: true,
                    }
                }
            }
        });
        const agentPerformance = agents.map(agent => {
            const leadTransactions = agent.leadsAsLead || [];
            const closerTransactions = agent.leadsAsCloser || [];
            const allTransactions = [...leadTransactions, ...closerTransactions];
            const closedDeals = allTransactions.length;
            const revenue = allTransactions.reduce((sum, tx) => sum + (tx.amount || 0), 0);
            const leadCommissionEarned = leadTransactions.reduce((sum, tx) => sum + (tx.earnedLeadCommission || tx.leadCommission || 0), 0);
            const closerCommissionEarned = closerTransactions.reduce((sum, tx) => sum + (tx.earnedCloserCommission || tx.closerCommission || 0), 0);
            const totalCommissionEarned = allTransactions.reduce((sum, tx) => sum + (tx.earnedTotalCommission || tx.totalCommission || 0), 0);
            return {
                name: agent.user?.name || 'Unknown Agent',
                email: agent.user?.email || '',
                cluster: agent.cluster?.name || 'Unassigned',
                closedDeals,
                revenue,
                totalCommission: totalCommissionEarned,
                leadCommission: leadCommissionEarned,
                closerCommission: closerCommissionEarned,
                conversionRate: '0.0',
                avgDealSize: closedDeals > 0 ? revenue / closedDeals : 0,
            };
        }).sort((a, b) => b.revenue - a.revenue);
        return {
            data: agentPerformance,
            summary: {
                totalAgents: agentPerformance.length,
                totalRevenue: agentPerformance.reduce((sum, agent) => sum + agent.revenue, 0),
                totalCommission: agentPerformance.reduce((sum, agent) => sum + agent.totalCommission, 0),
                avgConversionRate: '0.0',
            }
        };
    }
    async getClusterPerformance(dateRange) {
        const dateFilter = this.getDateFilter(dateRange);
        const clusters = await this.prisma.cluster.findMany({
            where: { status: 'active' },
            include: {
                agents: {
                    where: { status: 'active' },
                    include: {
                        user: {
                            select: {
                                name: true,
                                email: true,
                            }
                        },
                        leadsAsLead: {
                            where: {
                                status: 'completed',
                                ...dateFilter,
                            },
                            select: {
                                amount: true,
                                leadCommission: true,
                                closerCommission: true,
                                totalCommission: true,
                                date: true,
                                earnedLeadCommission: true,
                                earnedTotalCommission: true,
                            }
                        },
                        leadsAsCloser: {
                            where: {
                                status: 'completed',
                                ...dateFilter,
                            },
                            select: {
                                amount: true,
                                leadCommission: true,
                                closerCommission: true,
                                totalCommission: true,
                                date: true,
                                earnedCloserCommission: true,
                                earnedTotalCommission: true,
                            }
                        }
                    }
                }
            },
            orderBy: { name: 'asc' }
        });
        const clusterPerformance = clusters.map(cluster => {
            let agentsCount = 0;
            let closedDeals = 0;
            let revenue = 0;
            let totalCommission = 0;
            cluster.agents.forEach((agent) => {
                const leadTransactions = agent.leadsAsLead || [];
                const closerTransactions = agent.leadsAsCloser || [];
                const allTransactions = [...leadTransactions, ...closerTransactions];
                const agentClosedDeals = allTransactions.length;
                if (agentClosedDeals > 0) {
                    agentsCount++;
                    closedDeals += agentClosedDeals;
                    revenue += allTransactions.reduce((sum, tx) => sum + (tx.amount || 0), 0);
                    totalCommission += allTransactions.reduce((sum, tx) => sum + (tx.earnedTotalCommission || tx.totalCommission || 0), 0);
                }
            });
            return {
                name: cluster.name,
                agents: agentsCount,
                closedDeals,
                revenue,
                totalCommission,
                avgRevenuePerAgent: agentsCount > 0 ? revenue / agentsCount : 0,
                avgDealsPerAgent: agentsCount > 0 ? closedDeals / agentsCount : 0,
                avgCommissionPerAgent: agentsCount > 0 ? totalCommission / agentsCount : 0,
            };
        }).sort((a, b) => b.revenue - a.revenue);
        const totalClusters = clusterPerformance.length;
        const totalAgentsOverall = clusterPerformance.reduce((sum, cluster) => sum + cluster.agents, 0);
        const totalRevenueOverall = clusterPerformance.reduce((sum, cluster) => sum + cluster.revenue, 0);
        const totalCommissionOverall = clusterPerformance.reduce((sum, cluster) => sum + cluster.totalCommission, 0);
        const totalClosedDealsOverall = clusterPerformance.reduce((sum, cluster) => sum + cluster.closedDeals, 0);
        return {
            data: clusterPerformance,
            summary: {
                totalClusters,
                totalAgents: totalAgentsOverall,
                totalRevenue: totalRevenueOverall,
                totalCommission: totalCommissionOverall,
                totalClosedDeals: totalClosedDealsOverall,
                avgRevenuePerCluster: totalClusters > 0 ? totalRevenueOverall / totalClusters : 0,
                avgAgentsPerCluster: totalClusters > 0 ? totalAgentsOverall / totalClusters : 0,
            }
        };
    }
    async exportReport(type, dateRange) {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet(type.charAt(0).toUpperCase() + type.slice(1));
        if (type === 'sales') {
            const data = await this.getSalesReport(dateRange);
            worksheet.addRow(['BuyOps - Sales Report']);
            worksheet.addRow([`Date Range: ${dateRange || 'Last 30 days'}`]);
            worksheet.addRow([`Generated: ${new Date().toLocaleDateString()}`]);
            worksheet.addRow([]);
            worksheet.addRow(['SUMMARY']);
            worksheet.addRow([]);
            worksheet.addRow(['Metric', 'Value', 'Change vs Previous Period']);
            worksheet.addRow(['Total Revenue', `₦${data.summary.totalRevenue.toLocaleString()}`, `${data.summary.revenueChange.toFixed(1)}%`]);
            worksheet.addRow(['Total Transactions', data.summary.totalTransactions, `${data.summary.transactionChange.toFixed(1)}%`]);
            worksheet.addRow(['Average Deal Size', `₦${data.summary.avgDealSize.toLocaleString()}`, `${data.summary.avgDealSizeChange.toFixed(1)}%`]);
            worksheet.addRow([]);
            worksheet.addRow(['SALES BY MONTH']);
            worksheet.addRow([]);
            worksheet.addRow(['Month', 'Revenue', 'Transactions', 'Average Value', 'Commission']);
            data.salesByMonth.forEach(row => {
                worksheet.addRow([
                    row.month,
                    `₦${row.revenue.toLocaleString()}`,
                    row.transactions,
                    `₦${row.avgValue.toLocaleString()}`,
                    `₦${row.commission.toLocaleString()}`
                ]);
            });
            worksheet.addRow([]);
            worksheet.addRow(['TOP PERFORMING ASSETS']);
            worksheet.addRow([]);
            worksheet.addRow(['Asset Name', 'Revenue', 'Transactions', 'Commission', 'Type', 'Location']);
            data.topAssets.forEach(asset => {
                worksheet.addRow([
                    asset.name,
                    `₦${asset.revenue.toLocaleString()}`,
                    asset.count,
                    `₦${asset.commission.toLocaleString()}`,
                    asset.type,
                    asset.location
                ]);
            });
        }
        else if (type === 'agents') {
            const data = await this.getAgentPerformance(dateRange);
            worksheet.addRow(['BuyOps - Agent Performance Report']);
            worksheet.addRow([`Date Range: ${dateRange || 'Last 30 days'}`]);
            worksheet.addRow([`Generated: ${new Date().toLocaleDateString()}`]);
            worksheet.addRow([]);
            worksheet.addRow(['SUMMARY']);
            worksheet.addRow([]);
            worksheet.addRow(['Total Agents', data.summary.totalAgents]);
            worksheet.addRow(['Total Revenue', `₦${data.summary.totalRevenue.toLocaleString()}`]);
            worksheet.addRow(['Total Commission', `₦${data.summary.totalCommission.toLocaleString()}`]);
            worksheet.addRow(['Average Conversion Rate', `${data.summary.avgConversionRate}%`]);
            worksheet.addRow([]);
            worksheet.addRow(['AGENT PERFORMANCE']);
            worksheet.addRow([]);
            worksheet.addRow(['Name', 'Cluster', 'Closed Deals', 'Revenue', 'Total Commission', 'Lead Commission', 'Closer Commission', 'Conversion Rate', 'Avg Deal Size']);
            data.data.forEach(agent => {
                worksheet.addRow([
                    agent.name,
                    agent.cluster,
                    agent.closedDeals,
                    `₦${agent.revenue.toLocaleString()}`,
                    `₦${agent.totalCommission.toLocaleString()}`,
                    `₦${agent.leadCommission.toLocaleString()}`,
                    `₦${agent.closerCommission.toLocaleString()}`,
                    `${agent.conversionRate}%`,
                    `₦${agent.avgDealSize.toLocaleString()}`
                ]);
            });
        }
        else if (type === 'clusters') {
            const data = await this.getClusterPerformance(dateRange);
            worksheet.addRow(['BuyOps - Cluster Performance Report']);
            worksheet.addRow([`Date Range: ${dateRange || 'Last 30 days'}`]);
            worksheet.addRow([`Generated: ${new Date().toLocaleDateString()}`]);
            worksheet.addRow([]);
            worksheet.addRow(['SUMMARY']);
            worksheet.addRow([]);
            worksheet.addRow(['Total Clusters', data.summary.totalClusters]);
            worksheet.addRow(['Total Agents', data.summary.totalAgents]);
            worksheet.addRow(['Total Revenue', `₦${data.summary.totalRevenue.toLocaleString()}`]);
            worksheet.addRow(['Total Commission', `₦${data.summary.totalCommission.toLocaleString()}`]);
            worksheet.addRow(['Total Closed Deals', data.summary.totalClosedDeals]);
            worksheet.addRow(['Avg Revenue per Cluster', `₦${data.summary.avgRevenuePerCluster.toLocaleString()}`]);
            worksheet.addRow(['Avg Agents per Cluster', data.summary.avgAgentsPerCluster.toFixed(1)]);
            worksheet.addRow([]);
            worksheet.addRow(['CLUSTER PERFORMANCE']);
            worksheet.addRow([]);
            worksheet.addRow(['Cluster Name', 'Agents', 'Closed Deals', 'Revenue', 'Total Commission', 'Avg Revenue/Agent', 'Avg Deals/Agent']);
            data.data.forEach(cluster => {
                worksheet.addRow([
                    cluster.name,
                    cluster.agents,
                    cluster.closedDeals,
                    `₦${cluster.revenue.toLocaleString()}`,
                    `₦${cluster.totalCommission.toLocaleString()}`,
                    `₦${cluster.avgRevenuePerAgent.toLocaleString()}`,
                    cluster.avgDealsPerAgent.toFixed(1),
                ]);
            });
        }
        worksheet.eachRow((row, rowNumber) => {
            if (rowNumber === 1) {
                row.font = { bold: true, size: 16 };
                row.alignment = { horizontal: 'center' };
            }
            else if (rowNumber <= 4) {
                row.font = { italic: true };
            }
            else if (row.getCell(1).value &&
                typeof row.getCell(1).value === 'string' &&
                ['SUMMARY', 'SALES BY MONTH', 'TOP PERFORMING ASSETS',
                    'AGENT PERFORMANCE', 'CLUSTER PERFORMANCE'].includes(row.getCell(1).value)) {
                row.font = { bold: true, size: 12 };
                row.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FFE0E0E0' }
                };
            }
            else if (rowNumber > 5 && row.getCell(1).value &&
                typeof row.getCell(1).value === 'string' &&
                !['Metric', 'Month', 'Name', 'Cluster Name'].includes(row.getCell(1).value)) {
                row.font = { bold: true };
                row.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FFF0F0F0' }
                };
            }
        });
        worksheet.columns?.forEach(column => {
            if (column && column.eachCell) {
                let maxLength = 0;
                column.eachCell({ includeEmpty: true }, cell => {
                    const cellLength = cell.value ? cell.value.toString().length : 0;
                    maxLength = Math.max(maxLength, cellLength);
                });
                column.width = Math.min(maxLength + 2, 40);
            }
        });
        const buffer = await workbook.xlsx.writeBuffer();
        return Buffer.from(buffer);
    }
};
exports.ReportsService = ReportsService;
exports.ReportsService = ReportsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], ReportsService);


/***/ }),
/* 44 */
/***/ ((module) => {

module.exports = require("exceljs");

/***/ }),
/* 45 */
/***/ ((module) => {

module.exports = require("express");

/***/ }),
/* 46 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AssetsModule = void 0;
const common_1 = __webpack_require__(1);
const assets_controller_1 = __webpack_require__(27);
const assets_service_1 = __webpack_require__(28);
const prisma_module_1 = __webpack_require__(4);
let AssetsModule = class AssetsModule {
};
exports.AssetsModule = AssetsModule;
exports.AssetsModule = AssetsModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        controllers: [assets_controller_1.AssetsController],
        providers: [assets_service_1.AssetsService],
        exports: [assets_service_1.AssetsService],
    })
], AssetsModule);


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
exports.CompaniesModule = void 0;
const common_1 = __webpack_require__(1);
const companies_controller_1 = __webpack_require__(29);
const companies_service_1 = __webpack_require__(30);
const prisma_module_1 = __webpack_require__(4);
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
/* 48 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AgentsModule = void 0;
const common_1 = __webpack_require__(1);
const agents_controller_1 = __webpack_require__(31);
const agents_service_1 = __webpack_require__(32);
const prisma_module_1 = __webpack_require__(4);
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
/* 49 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ClustersModule = void 0;
const common_1 = __webpack_require__(1);
const clusters_controller_1 = __webpack_require__(33);
const clusters_service_1 = __webpack_require__(34);
const prisma_module_1 = __webpack_require__(4);
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
/* 50 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LeadsModule = void 0;
const common_1 = __webpack_require__(1);
const leads_controller_1 = __webpack_require__(35);
const leads_service_1 = __webpack_require__(36);
const prisma_module_1 = __webpack_require__(4);
let LeadsModule = class LeadsModule {
};
exports.LeadsModule = LeadsModule;
exports.LeadsModule = LeadsModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        controllers: [leads_controller_1.LeadsController],
        providers: [leads_service_1.LeadsService],
        exports: [leads_service_1.LeadsService],
    })
], LeadsModule);


/***/ }),
/* 51 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TransactionsModule = void 0;
const common_1 = __webpack_require__(1);
const platform_express_1 = __webpack_require__(38);
const transactions_controller_1 = __webpack_require__(37);
const transactions_service_1 = __webpack_require__(39);
const prisma_module_1 = __webpack_require__(4);
let TransactionsModule = class TransactionsModule {
};
exports.TransactionsModule = TransactionsModule;
exports.TransactionsModule = TransactionsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            prisma_module_1.PrismaModule,
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
/* 52 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.InstallmentsModule = void 0;
const common_1 = __webpack_require__(1);
const installments_controller_1 = __webpack_require__(40);
const installments_service_1 = __webpack_require__(41);
const prisma_module_1 = __webpack_require__(4);
let InstallmentsModule = class InstallmentsModule {
};
exports.InstallmentsModule = InstallmentsModule;
exports.InstallmentsModule = InstallmentsModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        controllers: [installments_controller_1.InstallmentsController],
        providers: [installments_service_1.InstallmentsService],
        exports: [installments_service_1.InstallmentsService],
    })
], InstallmentsModule);


/***/ }),
/* 53 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ReportsModule = void 0;
const common_1 = __webpack_require__(1);
const reports_controller_1 = __webpack_require__(42);
const reports_service_1 = __webpack_require__(43);
const prisma_module_1 = __webpack_require__(4);
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
/* 54 */
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
const common_1 = __webpack_require__(1);
const prisma_service_1 = __webpack_require__(5);
const bcrypt = __importStar(__webpack_require__(12));
let FreelancersService = class FreelancersService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll() {
        return this.prisma.freelancer.findMany({
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        name: true,
                    },
                },
                cluster: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    }
    async findById(id) {
        const freelancer = await this.prisma.freelancer.findUnique({
            where: { id },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        name: true,
                    },
                },
                cluster: true,
            },
        });
        if (!freelancer) {
            throw new common_1.NotFoundException(`Freelancer with ID ${id} not found`);
        }
        return freelancer;
    }
    async create(data) {
        const existingUser = await this.prisma.user.findUnique({
            where: { email: data.email },
        });
        if (existingUser) {
            const existingFreelancer = await this.prisma.freelancer.findUnique({
                where: { userId: existingUser.id },
            });
            if (existingFreelancer) {
                throw new common_1.ConflictException("User is already registered as a freelancer");
            }
        }
        let user;
        if (existingUser) {
            user = existingUser;
        }
        else {
            const hashedPassword = await bcrypt.hash("password123", 10);
            user = await this.prisma.user.create({
                data: {
                    email: data.email,
                    password: hashedPassword,
                    name: data.name,
                    role: "SALES",
                },
            });
        }
        const freelancer = await this.prisma.freelancer.create({
            data: {
                userId: user.id,
                registeredBy: data.registeredBy,
                registrarName: data.registrarName,
                registrarType: data.registrarType,
                clusterId: data.cluster,
                status: data.status || "active",
                activeDeals: 0,
                closedDeals: 0,
                totalCommission: 0,
                performance: 0,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        name: true,
                    },
                },
                cluster: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });
        return freelancer;
    }
    async update(id, data) {
        const freelancer = await this.findById(id);
        if (data.name || data.email) {
            await this.prisma.user.update({
                where: { id: freelancer.userId },
                data: {
                    name: data.name,
                    email: data.email,
                },
            });
        }
        const updateData = {};
        if (data.cluster)
            updateData.clusterId = data.cluster;
        if (data.status)
            updateData.status = data.status;
        if (data.registeredBy)
            updateData.registeredBy = data.registeredBy;
        if (data.registrarName)
            updateData.registrarName = data.registrarName;
        if (data.registrarType)
            updateData.registrarType = data.registrarType;
        return this.prisma.freelancer.update({
            where: { id },
            data: updateData,
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        name: true,
                    },
                },
                cluster: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });
    }
    async delete(id) {
        const freelancer = await this.findById(id);
        return this.prisma.freelancer.delete({
            where: { id },
        });
    }
    async getStats() {
        const [totalFreelancers, activeFreelancers, totalCommission,] = await Promise.all([
            this.prisma.freelancer.count(),
            this.prisma.freelancer.count({ where: { status: "active" } }),
            this.prisma.freelancer.aggregate({
                _sum: {
                    totalCommission: true,
                    activeDeals: true,
                    closedDeals: true,
                },
            }),
        ]);
        return {
            totalFreelancers,
            activeFreelancers,
            totalActiveDeals: totalCommission._sum.activeDeals || 0,
            totalClosedDeals: totalCommission._sum.closedDeals || 0,
            totalCommission: totalCommission._sum.totalCommission || 0,
        };
    }
    async getFreelancersByRegistrar(registrarId) {
        return this.prisma.freelancer.findMany({
            where: {
                registeredBy: registrarId,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                cluster: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });
    }
    async updateFreelancerStats(freelancerId) {
        return this.findById(freelancerId);
    }
};
exports.FreelancersService = FreelancersService;
exports.FreelancersService = FreelancersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], FreelancersService);


/***/ }),
/* 55 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FreelancersModule = void 0;
const common_1 = __webpack_require__(1);
const freelancers_controller_1 = __webpack_require__(56);
const freelancers_service_1 = __webpack_require__(54);
const prisma_module_1 = __webpack_require__(4);
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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FreelancersController = void 0;
const common_1 = __webpack_require__(1);
const freelancers_service_1 = __webpack_require__(54);
const passport_1 = __webpack_require__(9);
const roles_guard_1 = __webpack_require__(19);
const roles_decorator_1 = __webpack_require__(20);
class CreateFreelancerDto {
}
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
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt"), roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)("ADMIN"),
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], FreelancersController.prototype, "findAll", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt"), roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)("ADMIN"),
    (0, common_1.Get)("stats"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], FreelancersController.prototype, "getStats", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt"), roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)("ADMIN"),
    (0, common_1.Get)("by-registrar/:registrarId"),
    __param(0, (0, common_1.Param)("registrarId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FreelancersController.prototype, "getByRegistrar", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt"), roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)("ADMIN"),
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FreelancersController.prototype, "findOne", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt"), roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)("ADMIN"),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateFreelancerDto]),
    __metadata("design:returntype", Promise)
], FreelancersController.prototype, "create", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt"), roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)("ADMIN"),
    (0, common_1.Put)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_b = typeof Partial !== "undefined" && Partial) === "function" ? _b : Object]),
    __metadata("design:returntype", Promise)
], FreelancersController.prototype, "update", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt"), roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)("ADMIN"),
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
/* 57 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DashboardModule = void 0;
const common_1 = __webpack_require__(1);
const dashboard_service_1 = __webpack_require__(58);
const dashboard_controller_1 = __webpack_require__(59);
let DashboardModule = class DashboardModule {
};
exports.DashboardModule = DashboardModule;
exports.DashboardModule = DashboardModule = __decorate([
    (0, common_1.Module)({
        providers: [dashboard_service_1.DashboardService],
        controllers: [dashboard_controller_1.DashboardController]
    })
], DashboardModule);


/***/ }),
/* 58 */
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
const common_1 = __webpack_require__(1);
const prisma_service_1 = __webpack_require__(5);
let DashboardService = class DashboardService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getOverview() {
        const [totalAgents, activeClusters, totalRevenue, totalCommissions, activeAssets,] = await Promise.all([
            this.prisma.agent.count(),
            this.prisma.cluster.count({ where: { status: 'active' } }),
            this.prisma.transaction.aggregate({
                where: { status: 'completed' },
                _sum: { amount: true },
            }),
            this.prisma.transaction.aggregate({
                where: { status: 'completed' },
                _sum: { totalCommission: true },
            }),
            this.prisma.asset.count({ where: { status: 'published' } }),
        ]);
        return {
            totalAgents,
            activeClusters,
            totalRevenue: totalRevenue._sum.amount || 0,
            totalCommissions: totalCommissions._sum.totalCommission || 0,
            activeAssets,
        };
    }
    async getRecentTransactions() {
        return this.prisma.transaction.findMany({
            take: 10,
            orderBy: { date: 'desc' },
            include: {
                asset: { select: { name: true } },
                buyer: { select: { name: true } },
                leadAgent: { include: { user: { select: { name: true } } } },
                closerAgent: { include: { user: { select: { name: true } } } },
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
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DashboardController = void 0;
const common_1 = __webpack_require__(1);
const dashboard_service_1 = __webpack_require__(58);
const passport_1 = __webpack_require__(9);
const roles_guard_1 = __webpack_require__(19);
const roles_decorator_1 = __webpack_require__(20);
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
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN'),
    (0, common_1.Get)('overview'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DashboardController.prototype, "getOverview", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN'),
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
/* 60 */
/***/ ((module) => {

module.exports = require("dotenv");

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