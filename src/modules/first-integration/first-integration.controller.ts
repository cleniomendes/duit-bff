import { Controller, Get, Req } from '@nestjs/common';
import { Request } from 'express';

import { FirstIntegrationService } from '@modules/first-integration/first-integration.service';

@Controller('integration')
export class FirstIntegrationController {
  constructor(
    private readonly firstIntegrationService: FirstIntegrationService,
  ) {}

  @Get('')
  async getIntegration(@Req() req: Request): Promise<unknown> {
    return this.firstIntegrationService.getIntegration();
  }
}
