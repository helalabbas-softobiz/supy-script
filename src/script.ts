import * as fs from 'fs';
export const getEnvArg = (argName: string) => {
  const argIndex = process.argv.indexOf(`--${argName}`);

  const argValue = process.argv[argIndex + 1];

  return argValue;
};

function placedOrder(kitchenId: string, storeId: string, hostUrl: string) {
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

  console.log('Completed placed order Request');
}

const kitchenId = getEnvArg('kitchenId');
const storeId = getEnvArg('storeId');

const hostUrl = getEnvArg('hostUrl');

placedOrder(kitchenId, storeId, hostUrl);
