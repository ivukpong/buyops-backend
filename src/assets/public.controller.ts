import { Controller, Get, Post, Body, Query, Headers, ForbiddenException, BadRequestException } from '@nestjs/common';
import { AssetsService } from './assets.service';
import { PrismaService } from '../prisma/prisma.service';

// ══════════════════════════════════════════════════════════════════════════
// PUBLIC ASSETS CONTROLLER
// Unauthenticated read-only endpoints for the marketing website.
// Only returns published assets with a safe, minimal field set.
// ══════════════════════════════════════════════════════════════════════════

@Controller('public')
export class PublicController {
  constructor(
    private readonly assetsService: AssetsService,
    private readonly prisma: PrismaService,
  ) { }

  /**
   * GET /public/assets
   * Returns all published assets with the fields needed by the website gallery.
   * No authentication required.
   */
  @Get('assets')
  async getPublishedAssets(@Query('take') take?: string) {
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
      // Price / fractions
      price: a.price ?? a.fractionCost ?? null,
      finalPrice: a.finalPrice,
      fractionCost: a.fractionCost ?? null,
      fractionTotal: a.fractionTotal ?? null,
      availableUnits: a.availableUnits ?? null,
      totalUnits: a.totalUnits ?? null,
      // Returns
      rentalYield: a.rentalYield ?? null,
      rentalYieldMin: a.rentalYieldMin ?? null,
      rentalYieldMax: a.rentalYieldMax ?? null,
      capitalAppreciation: a.capitalAppreciation ?? null,
      totalAnnualReturn: a.totalAnnualReturn,
      // Media — return image URLs only
      images: (a.images as any[]).map((img: any) => ({
        id: img.id,
        url: img.url,
        caption: img.caption ?? null,
      })),
    }));
  }

  /**
   * GET /public/stats
   * High-level platform stats for the website's statistics section.
   * No authentication required.
   */
  @Get('stats')
  async getPublicStats() {
    return this.assetsService.getPublicStats();
  }

  /**
   * POST /public/waitlist
   * Captures a website visitor's waitlist signup as a lead.
   * No authentication required. Idempotent on email.
   */
  @Post('waitlist')
  async joinWaitlist(
    @Body() body: { name?: string; email: string; persona?: string },
  ) {
    if (!body.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
      throw new BadRequestException('A valid email address is required');
    }

    const email = body.email.toLowerCase().trim();
    const existing = await this.prisma.lead.findUnique({ where: { email } });
    if (existing) return { success: true, message: "You're already on the list!" };

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

  /**
   * POST /public/import-from-urbco
   * Server-to-server endpoint called by the Urbco API to push a property into
   * Buyops as a draft asset. Secured with the shared URBCO_API_KEY secret; no
   * user JWT is required or accepted here.
   */
  @Post('import-from-urbco')
  async importFromUrbco(
    @Headers('x-urbco-api-key') apiKey: string,
    @Body() body: any,
  ) {
    const expectedKey = process.env.URBCO_API_KEY;
    if (!expectedKey || apiKey !== expectedKey) {
      throw new ForbiddenException('Invalid or missing API key');
    }

    if (!body.urbcoPropertyId) {
      throw new BadRequestException('urbcoPropertyId is required');
    }
    if (!body.name) {
      throw new BadRequestException('name is required');
    }

    const asset = await this.assetsService.importFromUrbco(body);
    return { success: true, assetId: asset.id };
  }
}
