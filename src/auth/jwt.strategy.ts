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

    // Minimal select — only fields needed for guards + request context.
    // Avoids heavy joins on every authenticated request.
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
      throw new UnauthorizedException("User not found");
    }

    return user;
  }
}