import React, { useState, useEffect } from 'react';
import { Typography, TextField, Button, Grid } from '@material-ui/core';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Rating from '@mui/material/Rating';
import { updateOrderStatusCancelled } from '../api/orderApi';
import { getReview } from '../api/reviewApi';
import logo from "../header/logo.png";
import axios from 'axios';

const OrderModal = ({ order, onClose }) => {
  const [reviewSent, setReviewSent] = useState(false);
  const [rating, setRating] = useState(0);
  const [shortReview, setShortReview] = useState('');
  const [description, setDescription] = useState('');
  const [hasReview, setHasReview] = useState(false);

  useEffect(() => {
    const  checkReview = async () => {
      try {
        const response = await getReview(order.id);
        if (response.status === 200) {
          setHasReview(true);
        }
      } catch (error) {
        console.error('Ошибка при проверке отзыва:', error);
      }
    }

    checkReview();
  }, []);

  const handleCancel = () => {
    onClose();
  };

  const updateOrderStatus = async () => {
    await updateOrderStatusCancelled(order.id);
    window.location.reload();
  };

  const handleSendReview = async () => {

    try {
        // Подготовка данных для создания отзыва
        const reviewData = {
            rating: rating,
            short_review: shortReview,
            description: description,
            orderId: order.id,
        };
    
        const response = await axios.post('/api/create-review', reviewData);
    
        if (response.status === 201) {
          // Успешное создание заказа
          console.log('Отзыв успешно создан!');          
          
        }
      } catch (error) {
        console.error('Ошибка при создании отзыва:', error);
        // Обработка ошибок при создании заказа
      }
    
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
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px' }}>
            <img src={logo} alt="Bakery Logo" style={{ maxWidth: '25vh', marginLeft: '10px', marginRight: '10px' }} />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Typography variant="h6"style={{ marginBottom: '2.5vh' }} >Сладкий Сундук</Typography>
              {['Сформирован', 'В процессе'].includes(order.status) && (
                <Button style={{ backgroundColor: '#FED84C' }} onClick={updateOrderStatus}>Отмена</Button>
              )}
            </div>
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
              readOnly: true,
              value: order.completion_time || 'Еще не установлено',
            }}
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
        {order.status === 'Выполнен' && !hasReview && (
          <Grid item xs={12} style={{ display:'flex',  flexDirection:'column' }}>
            
            <TextField
              label="Краткий отзыв"
              variant="outlined"
              value={shortReview}
              onChange={(event) => {
                setShortReview(event.target.value);
              }}
              style={{ marginBottom: '1vh' }}
              />
            <TextField
              label="Описание"
              variant="outlined"
              value={description}
              onChange={(event) => {
                setDescription(event.target.value);
              }}
              style={{ marginBottom: '1vh' }}
              />
            <Typography>Оцените результат:</Typography>
            <Rating
                name="rating"
                value={rating}
                onChange={(event, newValue) => {
                    setRating(newValue);
                }}
                style={{ marginBottom: '1vh', marginLeft: '-5px', width: 'fit-content' }}
            />
            <Button
            onClick={handleSendReview}
            fullWidth
            disabled={!rating || !shortReview || !description}
            style={{ backgroundColor: '#FED84C', color: 'black', marginBottom: '1vh' }}
            >Отправить отзыв</Button>
          </Grid>
        )}
        {reviewSent && (
          <Grid item xs={12}>
            <Typography>Отзыв отправлен успешно!</Typography>
          </Grid>
        )}
      </Grid>
    </div>
  );
};

export default OrderModal;
