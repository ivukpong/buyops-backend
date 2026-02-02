import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: any) {
    // Use the correct identifier from your JWT payload
    const userId = payload?.sub; // or payload?.id or payload?.email

    if (!userId) {
      throw new UnauthorizedException("Invalid token: missing user identifier");
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId }, // or { email: userId } if you use email
    });

    if (!user) {
      throw new UnauthorizedException("User not found");
    }

    return user;
  }
}