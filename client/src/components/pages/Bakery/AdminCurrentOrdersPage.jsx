import React, { useEffect, useState } from 'react';
import { Typography, Paper, Button } from '@material-ui/core';
import AdminOrdersHeader from './AdminOrdersHeader';
import { getAllUsers } from "./api/userApi";
import { getInProcessOrders } from "./api/orderApi";
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import AdminOrderModal from './AdminOrderModal';

const AdminCurrentOrdersPage = () => {
  const [userData, setUserData] = useState({});
  const [selectedUser, setSelectedUser] = useState(null);
  const [inProcessOrders, setInProcessOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const loadInProcessOrders = async () => {
      try {
        const response = await getInProcessOrders();

        if (response.status === 200) {
          setInProcessOrders(response.data);
        } else {
          console.log('Ошибка при получении текущих заказов:', response.statusText);
        }
      } catch (error) {
        console.error('Ошибка при загрузке данных о текущих заказах:', error);
      }
    };

    const loadData = async () => {
      try {
        const response = await getAllUsers();

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
        loadInProcessOrders(); 
      } catch (error) {
        console.error("Error loading user data:", error);
      }
    };

    loadData();
  }, []);

  const handleOpenModal = (order, userData) => {
    const selectedUser = userData.find(user => user.id === order.userId);
    setSelectedOrder(order);
    setSelectedUser(selectedUser);
  };
  
  const handleCloseModal = () => {
    setSelectedOrder(null);
    setSelectedUser(null);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '5vh' }}>
      <AdminOrdersHeader />
      <Typography variant="h4" align="center" style={{ height: '5vh', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>

      </Typography>
      
      {inProcessOrders.map(order => (
        <Paper key={order.id} style={{ padding: '10px', margin: '10px', width: '40%', display: 'flex', alignItems: 'flex-start', position: 'relative', backgroundColor: '#E5F6FD', color: '#0288D1', flexDirection: 'column', gap: '5px' }}>
          {<ErrorOutlineIcon style={{ position: 'absolute', top: '5px', left: '5px', fontSize: '25px' }} />}
          <Typography variant="h5" style={{ marginBottom: '5px', marginLeft: '30px', color: '#014361', maxWidth: '70%'}}>{order.name}</Typography>
          <Typography style={{ marginLeft: '30px', color: '#014361', maxWidth: '70%' }}>{order.description}</Typography>
          <Typography style={{ marginLeft: '30px', color: '#022332', maxWidth: '70%' }}>{order.status}</Typography>
          <Typography style={{ position: 'absolute', top: '5px', right: '5px', color: '#014361', maxWidth: '70%' }}>{order.total_cost} руб.</Typography>
          <Button variant="contained" style={{ position: 'absolute', bottom: '5px', right: '5px', color: 'white', backgroundColor: '#0288D1' }} onClick={() => handleOpenModal(order, userData)}>Подробнее</Button>
        </Paper>
      ))}
      
      {selectedOrder && (
        <AdminOrderModal order={selectedOrder} user={selectedUser} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default AdminCurrentOrdersPage;
