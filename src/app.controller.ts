import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AppService } from './app.service';
import * as fs from 'fs';

import axios from 'axios';

interface Payload {
  readonly storeId: string;
  readonly kitchenId: string;
  readonly hostUrl: string;
}

interface idType {
  id: string;
}
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  async delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post(':id/placed')
  async placedOrder(@Body() payload: Payload, @Param() id: idType) {
    const grubTechOrder1 = JSON.parse(
      fs.readFileSync('grubtech1.json', 'utf-8'),
    );
    const grubTechOrder2 = JSON.parse(
      fs.readFileSync('grubtech2.json', 'utf-8'),
    );
    const grubTechOrder3 = JSON.parse(
      fs.readFileSync('grubtech3.json', 'utf-8'),
    );

    const { hostUrl } = payload;

    const totalOrders = [
      ...grubTechOrder1,
      ...grubTechOrder2,
      ...grubTechOrder3,
    ]
      .filter((element) => element.kitchen.id === payload.kitchenId)
      .map((order) => ({
        ...order,
        storeId: payload.storeId,
      }));

    console.log(totalOrders.length);
    console.log(payload);

    let count = 1;
    for (const order of totalOrders) {
      await axios.post(hostUrl, order, {
        headers: {
          'X-Api-Key': id.id,
        },
      });

      count++;
      const time = count % 5 === 0 ? 5000 : 2000;
      console.log(count);
      await this.delay(time);
    }

    console.log('Completed placed order Request');
  }

  @Post(':id/complete')
  async completeOrder(@Body() payload: Payload, @Param() id: idType) {
    const grubTechOrder1 = JSON.parse(
      fs.readFileSync('grubtech1.json', 'utf-8'),
    );
    const grubTechOrder2 = JSON.parse(
      fs.readFileSync('grubtech2.json', 'utf-8'),
    );
    const grubTechOrder3 = JSON.parse(
      fs.readFileSync('grubtech3.json', 'utf-8'),
    );

    const { hostUrl } = payload;

    const totalOrders = [
      ...grubTechOrder1,
      ...grubTechOrder2,
      ...grubTechOrder3,
    ]
      .filter((element) => element.kitchen.id === payload.kitchenId)
      .map((order) => ({
        ...order,
        storeId: payload.storeId,
      }));

    console.log(totalOrders.length);

    let count = 1;
    for (const order of totalOrders) {
      if (order['status'] === 'Completed' || order['status'] === 'Cancelled') {
        const endpoint =
          order['status'] === 'Completed'
            ? `${hostUrl}/${order.id}/completed`
            : `${hostUrl}/${order.id}/cancelled`;

        await axios.post(endpoint, null, {
          headers: {
            'X-Api-Key': id.id,
          },
        });
      }
      count++;
      const time = count % 5 === 0 ? 10000 : 3000;
      await this.delay(time);
    }

    console.log('Completed Request');
  }
}
