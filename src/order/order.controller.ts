import {
  Controller,
  Get,
  Req,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';

import { BasicAuthGuard, JwtAuthGuard } from '../auth';
import { OrderService } from '.';
import { AppRequest, getUserIdFromRequest } from '../shared';

@Controller('api/order')
export class OrderController {
  constructor(
    private orderService: OrderService
  ) { }

  // @UseGuards(JwtAuthGuard)
  @UseGuards(BasicAuthGuard)
  @Get()
  async getOrders(@Req() req: AppRequest) {

    const orders = await this.orderService.find();

    return {
      statusCode: HttpStatus.OK,
      message: 'OK',
      data: { orders },
    };
  }

}


