import * as fs from 'fs';
import axios from 'axios';
export const getEnvArg = (argName: string) => {
  const argIndex = process.argv.indexOf(`--${argName}`);

  const argValue = process.argv[argIndex + 1];

  return argValue;
};

async function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function completeOrder(
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
    if (order['status'] === 'Completed' || order['status'] === 'Cancelled') {
      const endpoint =
        order['status'] === 'Completed'
          ? `${hostUrl}/${order.id}/completed`
          : `${hostUrl}/${order.id}/cancelled`;

      await axios.post(endpoint, null, {
        headers: {
          'X-Api-Key': key,
        },
      });
    }
    count++;
    const time = count % 5 === 0 ? 5000 : 2000;
    console.log(count);
    await delay(time);
  }

  console.log('Completed order Request');
}

const kitchenId = getEnvArg('kitchenId');
const storeId = getEnvArg('storeId');

const hostUrl = getEnvArg('hostUrl');
const key = getEnvArg('key');

completeOrder(kitchenId, storeId, hostUrl, key);
