import * as fs from 'fs';
import axios from 'axios';
export const getEnvArg = (argName: string) => {
  const argIndex = process.argv.indexOf(`--${argName}`);

  const argValue = process.argv[argIndex + 1];

  return argValue;
};

async function placedOrder(
  kitchenId: string,
  storeId: string,
  hostUrl: string,
) {
  const grubTechOrder1 = JSON.parse(fs.readFileSync('grubtech1.json', 'utf-8'));
  const grubTechOrder2 = JSON.parse(fs.readFileSync('grubtech2.json', 'utf-8'));
  const grubTechOrder3 = JSON.parse(fs.readFileSync('grubtech3.json', 'utf-8'));

  const totalOrders = [...grubTechOrder1, ...grubTechOrder2, ...grubTechOrder3]
    .filter((element) => element.kitchen.id === kitchenId)
    .map((order) => ({
      ...order,
      storeId: storeId,
    }));

  console.log(totalOrders.length);
  console.log(hostUrl);

  const response = await axios.get(
    'https://jsonplaceholder.typicode.com/todos/1',
  );

  console.log('Completed placed order Request', response.data);
}

const kitchenId = getEnvArg('kitchenId');
const storeId = getEnvArg('storeId');

const hostUrl = getEnvArg('hostUrl');

placedOrder(kitchenId, storeId, hostUrl);
