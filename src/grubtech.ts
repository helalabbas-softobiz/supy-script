import axios from 'axios';
import * as fs from 'fs';
import { getEnvArg } from './read.env';

async function grubTechSalesData(date: string, key: string) {
  const dateFrom = `${date}T00:00:00.000Z`;
  const dateTo = `${date}T23:59:00.999Z`;
  const orderItem = [];
  let keepFetching = false;
  let page = 0;

  do {
    const response = await axios.get(
      `https://api.grubtech.io/order-api/orders?fromDate=${dateFrom}&toDate=${dateTo}&page=${page}&size=1000`,

      {
        headers: {
          'x-api-key': key,
        },
      },
    );

    const data = response.data;

    const currentPage = data.page.number;

    const totalPage = data.page.totalPages;
    console.log({ totalPage });
    console.log({ page });
    keepFetching = currentPage + 1 < totalPage;
    page++;

    if (data?._embedded.orders) {
      orderItem.push(...data?._embedded.orders);
    }
  } while (keepFetching);

  fs.writeFileSync('grubtech.json', JSON.stringify(orderItem, null, 2));

  console.log('Order Fetched from Grubtech');
}

const date = getEnvArg('date');
const key = getEnvArg('key');

grubTechSalesData(date, key);
