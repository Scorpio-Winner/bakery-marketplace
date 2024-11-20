import React, { useState, useEffect } from 'react';
import { Typography, TextField, Button, Grid } from '@material-ui/core';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Rating from '@mui/material/Rating';
import { updateOrderStatusCancelled, updateOrderStatusCompleted, updateOrderStatusInProgress } from './api/orderApi';
import { getProfile} from './api/adminApi';
import logo from "./logo.png";
import axios from 'axios';

const AdminOrderModal = ({ order, user, onClose }) => {
  const [completionTime, setCompletionTime] = useState(order.completion_time || '');
  const [adminData, setAdminData] = useState({});

  useEffect(() => {
    const loadData = async () => {
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

        setAdminData(response.data);
    };

    loadData();
}, []);


  const handleCancel = () => {
    onClose();
  };


  const handleStartExecution = async () => {
    try {
      // Подготовка данных для обновлений
      const orderData = {
          adminId: adminData.id,
          completion_time: completionTime,
      };
  
      const response = await updateOrderStatusInProgress(order.id, orderData);
  
      if (response.status === 200) {
        // Успешное создание заказа
        console.log('Данные обновлены!');          
        
      }
    } catch (error) {
      console.error('Ошибка при обновлении заказа:', error);
      // Обработка ошибок при создании заказа
    }
  
    window.location.reload();
  
  };

  const handleCompleteExecution = async () => {
    await updateOrderStatusCompleted(order.id);
    window.location.reload();
  };

  const updateOrderStatus = async () => {
    await updateOrderStatusCancelled(order.id);
    window.location.reload();
  };


  return (
    <div className="modal" style={{
        backgroundColor: '#F8F8F8',
        borderRadius: '1vh',
        textAlign: 'center',
        width: '40%',
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: '9999',
        padding: '20px',
        boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
      }}>
        <ArrowBackIcon onClick={handleCancel} style={{ cursor: 'pointer',marginRight:'80%',marginTop:'2vh' }} />
      <Grid container spacing={2} justifyContent="center">
        <Grid item xs={12}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-evenly', marginBottom: '10px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Typography variant="h6" style={{ marginBottom: '2.5vh' }}>{user.name} {user.surname}</Typography>
              <Typography style={{ marginBottom: '1vh' }}>{user.phone}</Typography>
              <Typography style={{ marginBottom: '2.5vh' }}>{user.email}</Typography>
            </div>
              {['Сформирован', 'В процессе'].includes(order.status) && (
                <Button style={{ backgroundColor: '#FED84C' }} onClick={updateOrderStatus}>Отмена</Button>
              )}
            </div>
        </Grid>
        <Grid item xs={12}>
        <TextField
            label="Название"
            variant="standard"
            InputProps={{
              style: {
                backgroundColor: '#F8F8F8',
                borderBottom: '1px solid #FED84C',
                borderTop: '1px solid #F8F8F8',
                borderLeft: '1px solid #F8F8F8',
                borderRight: '1px solid #F8F8F8',
                width: '100%',
              },
              readOnly: true,
              value: order.name,
            }}
          />
        </Grid>
        <Grid item xs={12}>

        <TextField
            label="Описание"
            variant="standard"
            InputProps={{
              style: {
                backgroundColor: '#F8F8F8',
                borderBottom: '1px solid #FED84C',
                borderTop: '1px solid #F8F8F8',
                borderLeft: '1px solid #F8F8F8',
                borderRight: '1px solid #F8F8F8',
                width: '100%',
              },
              readOnly: true,
              value: order.description,
            }}
          />
        </Grid>
        <Grid item xs={12}>
        <TextField
            label="Заказ размещен"
            variant="standard"
            InputProps={{
              style: {
                backgroundColor: '#F8F8F8',
                borderBottom: '1px solid #FED84C',
                borderTop: '1px solid #F8F8F8',
                borderLeft: '1px solid #F8F8F8',
                borderRight: '1px solid #F8F8F8',
                width: '80%',
              },
              readOnly: true,
              value: new Date(order.date_of_ordering).toLocaleDateString(),
            }}
          />


        <TextField
          label="Время на выполнение"
          variant="standard"
          InputProps={{
            style: {
              backgroundColor: '#F8F8F8',
              borderBottom: '1px solid #FED84C',
              borderTop: '1px solid #F8F8F8',
              borderLeft: '1px solid #F8F8F8',
              borderRight: '1px solid #F8F8F8',
              width: '100%',
            },
          }}
          value={order.completion_time}
          onChange={(event) => setCompletionTime(event.target.value)}
        />


          
        </Grid>
        <Grid item xs={12} style={{ marginBottom: '2vh' }} >

        <TextField
            label="Стоимость"
            variant="standard"
            InputProps={{
              style: {
                backgroundColor: '#F8F8F8',
                borderBottom: '1px solid #FED84C',
                borderTop: '1px solid #F8F8F8',
                borderLeft: '1px solid #F8F8F8',
                borderRight: '1px solid #F8F8F8',
                width: '80%',
              },
              readOnly: true,
              value: order.total_cost,
            }}
          />

        <TextField
            label="Адрес доставки"
            variant="standard"
            InputProps={{
              style: {
                backgroundColor: '#F8F8F8',
                borderBottom: '1px solid #FED84C',
                borderTop: '1px solid #F8F8F8',
                borderLeft: '1px solid #F8F8F8',
                borderRight: '1px solid #F8F8F8',
                width: '100%',
              },
              readOnly: true,
              value: order.delivery_address,
            }}
          />

            
        
        </Grid>
        {order.status === 'Сформирован' && (
            <Button
              onClick={handleStartExecution}
              style={{ backgroundColor: '#FED84C' }}
              disabled={completionTime.trim() === ''}
            >
              Начать выполнение
            </Button>
          )}
          {order.status === 'В процессе' && (
            <Button onClick={handleCompleteExecution} style={{ backgroundColor: '#FED84C' }}>Завершить</Button>
          )}
      </Grid>
    </div>
  );
};

export default AdminOrderModal;
