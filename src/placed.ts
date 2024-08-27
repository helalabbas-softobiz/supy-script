import * as fs from 'fs';
import axios from 'axios';
import { getEnvArg } from './read.env';

async function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function placedOrder(
  kitchenId: string,
  storeId: string,
  hostUrl: string,
  key: string,
) {
  const grubTechOrder1 = JSON.parse(fs.readFileSync('grubtech.json', 'utf-8'));

  const totalOrders = [...grubTechOrder1]
    .filter((element) => element.kitchen.id === kitchenId)
    .map((order) => ({
      ...order,
      storeId: storeId,
    }));

  console.log(totalOrders.length);
  console.log(hostUrl);

  let count = 1;
  for (const order of totalOrders) {
    await axios.post(hostUrl, order, {
      headers: {
        'X-Api-Key': key,
      },
    });

    count++;
    const time = count % 5 === 0 ? 5000 : 2000;
    console.log(count);
    await delay(time);
  }

  console.log('Completed placed order Request');
}

const kitchenId = getEnvArg('kitchenId');
const storeId = getEnvArg('storeId');

const hostUrl = getEnvArg('hostUrl');
const key = getEnvArg('key');

placedOrder(kitchenId, storeId, hostUrl, key);
