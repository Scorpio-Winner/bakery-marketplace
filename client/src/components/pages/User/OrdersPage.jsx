import React from 'react';

import OrdersHeader from '../header/OrdersHeader'; 
import { Typography, Box } from '@material-ui/core';

const OrdersPage = () => {
  return (
    <div>
      <OrdersHeader />
      <Typography variant="h4" align="center" style={{ height: '50vh', display: 'flex', alignItems: 'center', justifyContent:'center'}}>
        Выберите тип Заказов
      </Typography>
    </div>
  );
};

export default OrdersPage;

