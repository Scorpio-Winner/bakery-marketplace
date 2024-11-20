import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Paper, TextField, Button } from '@material-ui/core';
import logo from '../header/logo.png';
import Header from '../header/Header';
import { getProfile } from "../api/userApi";
import { getBasketItems } from "../api/basketApi";
import axios from 'axios';

const useStyles = makeStyles((theme) => ({
  root: {
    textAlign: 'center',
  },
  formContainer: {
    backgroundColor: '#F8F8F8',
    padding: theme.spacing(4),
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    alignItems:'center',
    width:'40%',
    margin: '0 auto',
  },
  logo: {
    width: '150px',
    height: 'auto',
    marginBottom: theme.spacing(2),
  },
  title: {
    fontSize: '28px',
    marginBottom: theme.spacing(2),
  },
  subtitle: {
    fontSize: '24px',
    marginBottom: theme.spacing(2),
  },
  input: {
    marginBottom: theme.spacing(2),
    marginTop: theme.spacing(2),
    width: '100%',
  },
  button: {
    width: '100%',
    marginTop: theme.spacing(2),
    backgroundColor: '#FED84C',
    color: 'black',
    transition: 'background-color 0.3s', // Добавлено свойство transition для плавного перехода
    '&:hover': {
      backgroundColor: '#FFA88B', // Изменение цвета при наведении
    },
  },
}));

const currentDate = new Date().toLocaleDateString();

const Basket = () => {
  const classes = useStyles();
  const [userData, setUserData] = useState({});
  const [basketItems, setBasketItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');


  useEffect(() => {
    const loadBasketItems = async (basketId) => {
      try {
        const basketItemsResponse = await getBasketItems(basketId);
  
        if (basketItemsResponse.status === 200) {
          setBasketItems(basketItemsResponse.data);
        }
      } catch (error) {
        console.error('Error loading basket items:', error);
        // Обработка ошибки при загрузке товаров из корзины
      }
  
      // Получаем продукты
      try {
        const productsResponse = await axios.get('/products');
  
        if (!productsResponse) {
          console.log("Ошибка при загрузке продуктов");
          return;
        }
  
        setProducts(productsResponse.data);
      } catch (error) {
        console.error('Error loading products:', error);
        // Обработка ошибки при загрузке продуктов
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
        loadBasketItems(response.data.basketId); 
      } catch (error) {
        console.error("Error loading user data:", error);
      }
    };
  
    loadData();
  }, []);
  


const getTotalPrice = () => {
  let totalPrice = 0;

  basketItems.forEach((item) => {
    const product = products.find((prod) => prod.id === item.productId);
    if (product) {
      totalPrice += product.price * item.quantity;
    }
  });

  return totalPrice;
};


const buildProductString = () => {
  const productStrings = basketItems.map((item) => {
    const product = products.find((prod) => prod.id === item.productId);
    if (product) {
      return `${item.quantity} x ${product.name}`;
    }
    return "";
  });

  return productStrings.filter((str) => str !== "").join(", ");
};

const handleOrderSubmit = async () => {
  try {
    // Подготовка данных для создания заказа
    const orderData = {
      userId: userData.id,
      name: buildProductString(),
      total_cost: getTotalPrice(),
      delivery_address: deliveryAddress,
      description: additionalNotes,
      date_of_ordering: currentDate,
    };

    // Вызов функции для создания заказа
    const response = await axios.post('/api/create-order', orderData);

    if (response.status === 201) {
      // Успешное создание заказа
      console.log('Заказ успешно создан!');

      // Вызываем удаление элементов корзины
      const deleteResponse = await axios.delete(`/api/delete-items/${userData.basketId}`);
      
      if (deleteResponse.status === 200) {
        // Успешное удаление элементов корзины
        console.log('Элементы корзины успешно удалены после оформления заказа');
      } else {
        // Обработка ошибки при удалении элементов корзины
        console.error('Ошибка при удалении элементов корзины:', deleteResponse.statusText);
      }
    }
  } catch (error) {
    console.error('Ошибка при создании заказа:', error);
    // Обработка ошибок при создании заказа
  }

  window.location.reload();
};

const handleClearBasket = async () => {
  try {
      const deleteResponse = await axios.delete(`/api/delete-items/${userData.basketId}`);
      
      if (deleteResponse.status === 200) {
        // Успешное удаление элементов корзины
        console.log('Элементы корзины успешно удалены после оформления заказа');
      } else {
        // Обработка ошибки при удалении элементов корзины
        console.error('Ошибка при удалении элементов корзины:', deleteResponse.statusText);
      }
    }
  catch (error) {
    console.error('Ошибка при создании заказа:', error);
    // Обработка ошибок при создании заказа
  }

  window.location.reload();
};


  return (
    <div >
      <Header />

      {/* Form */}
      <Paper className={classes.formContainer}>
        <Typography variant="h3" className={classes.title}>
          Оформить заказ
        </Typography>

        <img src={logo} alt="Logo" className={classes.logo} />

        <Typography variant="h4" className={classes.subtitle}>
          Детали заказа
        </Typography>

        <Typography variant="subtitle1">Корзина: {buildProductString()}</Typography>

        <TextField
          className={classes.input}
          label="Какие-то пожелания?"
          variant="outlined"
          value={additionalNotes}
          onChange={(e) => setAdditionalNotes(e.target.value)}
        />

        <Typography variant="subtitle1">
          Заказ размещен: {currentDate}
        </Typography>

        <TextField
          className={classes.input}
          label="Адрес доставки"
          variant="outlined"
          value={deliveryAddress}
          onChange={(e) => setDeliveryAddress(e.target.value)}
        />

        <Typography variant="subtitle1">Стоимость: {getTotalPrice()} руб</Typography>

        <Button
        variant="contained"
        color="primary"
        className={classes.button}
        disabled={!deliveryAddress || getTotalPrice()===0}
        onClick={handleOrderSubmit}
      >
        Оформить
      </Button>
      <Button
        variant="contained"
        color="primary"
        className={classes.button}
        disabled={getTotalPrice()===0}
        onClick={handleClearBasket}
      >
        Очистить корзину
      </Button>
      </Paper>
    </div>
  );
};

export default Basket;
