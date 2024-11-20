import React, { useEffect, useState } from 'react';
import { Typography, Paper, Button } from '@material-ui/core';
import OrdersHeader from '../header/OrdersHeader';
import { getProfile } from "../api/userApi";
import { getCompletedOrders } from "../api/orderApi";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import OrderModal from './OrderModal';

const CompletedOrdersPage = () => {
  const [userData, setUserData] = useState({});
  const [completedOrders, setCompletedOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {

    const loadCompletedOrders = async (userId) => {
      try {
        const response = await getCompletedOrders(userId);

        if (response.status === 200) {
          setCompletedOrders(response.data); // Обновляем состояние с данными о выполненных заказах
        } else {
          console.log('Ошибка при получении выполненных заказов:', response.statusText);
        }
      } catch (error) {
        console.error('Ошибка при загрузке данных о выполненных заказах:', error);
      }
    };

    const loadData = async () => {
      try {
        const response = await getProfile();

        if (!response) {
          console.log("Сервис временно недоступен");
          return;
        }

        if (response.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("role");
          sessionStorage.removeItem("token");
          sessionStorage.removeItem("role");
          window.location.reload();
        }

        if (response.status >= 300) {
          console.log("Ошибка при загрузке профиля. Код: " + response.status);
          console.log(response);
          return;
        }

        setUserData(response.data);
        loadCompletedOrders(response.data.id); 
      } catch (error) {
        console.error("Error loading user data:", error);
      }
    };

    loadData();
  }, []);

  const handleOpenModal = (order) => {
    setSelectedOrder(order);
  };
  
  const handleCloseModal = () => {
    setSelectedOrder(null);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom:'5vh' }}>
      <OrdersHeader />
      <Typography variant="h4" align="center" style={{ height: '5vh', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>

      </Typography>

      {/* Отображаем полученные данные о выполненных заказах */}
      {completedOrders.map(order => (
      <Paper key={order.id} style={{ padding: '10px', margin: '10px', width: '40%', display: 'flex', alignItems: 'flex-start', position: 'relative', backgroundColor: order.status === 'Выполнен' ? '#EDF7ED' : '#FDEDED', color: order.status === 'Выполнен' ? '#38953D' : '#D32F2F', flexDirection: 'column', gap: '5px' }}>
        {/* Иконка галочки или крестика в зависимости от статуса */}
        {order.status === 'Выполнен' ? <CheckCircleIcon style={{ position: 'absolute', top: '5px', left: '5px', fontSize: '25px' }} /> : <HighlightOffIcon style={{ position: 'absolute', top: '5px', left: '5px', fontSize: '25px' }} />}
        {/* Имя заказа */}
        <Typography variant="h5" style={{ marginBottom: '5px', marginLeft: '30px', color: order.status === 'Выполнен' ? '#1E4620' : '#5F2120', maxWidth: '70%' }}>{order.name}</Typography>
        {/* Описание заказа */}
        <Typography style={{ marginLeft: '30px', color: order.status === 'Выполнен' ? '#1E4620' : '#5F2120', maxWidth: '70%' }}>{order.description}</Typography>
        {/* Статус заказа */}
        <Typography style={{ marginLeft: '30px', color: '#022332', maxWidth: '40%' }}>{order.status}</Typography>
        {/* Цена заказа */}
        <Typography style={{ position: 'absolute', top: '5px', right: '5px', color: order.status === 'Выполнен' ? '#1E4620' : '#5F2120', maxWidth: '70%' }}>{order.total_cost} руб.</Typography>
        {/* Кнопка "Подробнее" */}
        <Button variant="contained" style={{ position: 'absolute', bottom: '5px', right: '5px', color: 'white', backgroundColor: order.status === 'Выполнен' ? '#70C05B' : '#FF6347' }} onClick={() => handleOpenModal(order)}>Подробнее</Button>
      </Paper>
    ))}

{selectedOrder && (
        <OrderModal order={selectedOrder} onClose={handleCloseModal} />
  )}
    </div>
  );
};

export default CompletedOrdersPage;
