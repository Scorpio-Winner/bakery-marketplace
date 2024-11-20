import React from 'react';

import AdminOrdersHeader from './AdminOrdersHeader'; 
import { Typography, Box } from '@material-ui/core';

const AdminOrdersPage = () => {
  return (
    <div>
      <AdminOrdersHeader />
      <Typography variant="h4" align="center" style={{ height: '50vh', display: 'flex', alignItems: 'center', justifyContent:'center'}}>
        Выберите тип Заказов
      </Typography>
    </div>
  );
};

export default AdminOrdersPage;

