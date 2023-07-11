import { Controller, Get, Req } from '@nestjs/common';
import { Request } from 'express';

import { AnprotecService } from '@modules/jestor-integration/anprotec.service';

@Controller('anprotec')
export class AnprotecController {
  constructor(private readonly anprotecService: AnprotecService) {}

  @Get('/address')
  async getAllAddress(@Req() req: Request): Promise<unknown> {
    return this.anprotecService.getAllAddress();
  }

  @Get('/jobRole')
  async getAllJobRole(@Req() req: Request): Promise<unknown> {
    return this.anprotecService.getAllJobRole();
  }

  @Get('/people')
  async getAllPeople(@Req() req: Request): Promise<unknown> {
    return this.anprotecService.getAllPeople();
  }
}
