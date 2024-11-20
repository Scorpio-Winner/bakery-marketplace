import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';
import { Card, CardContent, CardActions, Button, Typography } from '@material-ui/core';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { getProfile } from "../../api/userApi";
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: theme.spacing(4),
  },
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    width: '70%',
    gap: '1vh'
  },
  card: {
    width: '300px',
    margin: theme.spacing(2),
    textAlign: 'center',
  },
  imageContainer: {
    width: '100%',
    height: '200px',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    marginBottom: theme.spacing(2),
  },
  button: {
    backgroundColor: '#f5c518',
    color: '#fff',
    transition: 'background-color 0.3s',
    '&:hover': {
      backgroundColor: '#70C05B',
    },
  },
  quantityContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: theme.spacing(2),
  },
  quantityButton: {
    minWidth: '30px',
    borderRadius: '50%',
    padding: 0,
  },
}));

const ProductSection = () => {
  const classes = useStyles();
  const [products, setProducts] = useState([]);
  const [userData, setUserData] = useState({});
  const [avatars, setAvatars] = useState({});
  const [selectedQuantities, setSelectedQuantities] = useState({});
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertOpenError, setAlertOpenError] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const userDataResponse = await getProfile();
  
        if (!userDataResponse) {
          console.log("Сервис временно недоступен");
          return;
        }
  
        if (userDataResponse.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("role");
          sessionStorage.removeItem("token");
          sessionStorage.removeItem("role");
          window.location.reload();
          return;
        }
  
        if (userDataResponse.status >= 300) {
          console.log("Ошибка при загрузке профиля. Код: " + userDataResponse.status);
          console.log(userDataResponse);
          return;
        }
  
        setUserData(userDataResponse.data);
  
        // Получаем продукты
        const productsResponse = await axios.get('/products');
  
        if (!productsResponse) {
          console.log("Ошибка при загрузке продуктов");
          return;
        }
  
        setProducts(productsResponse.data);
  
        // После получения продуктов, запрашиваем фотографии для каждого продукта
        productsResponse.data.forEach(product => {
          axios.get(`/products/avatar/${product.id}`, { responseType: 'blob' })
            .then(res => {
              const avatarUrl = URL.createObjectURL(res.data);
              setAvatars(prevState => ({ ...prevState, [product.id]: avatarUrl }));
            })
            .catch(error => {
              console.error(`Error fetching avatar for product ID ${product.id}:`, error);
              // Можно установить заглушку в случае ошибки получения фотографии
              setAvatars(prevState => ({ ...prevState, [product.id]: 'здесь__заглушка_для_фото' }));
            });
        });
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };
  
    loadData();
  }, []);

  const handleOrderClick = (productId) => {
    const quantity = selectedQuantities[productId] || 0;

    if (quantity > 0) {
        const basketItem = {
            basketId: userData.basketId,
            productId: productId,
            quantity: quantity,
        };

        // Отправляем basketItem на сервер
        axios.post('/api/product-to-basket', basketItem)
            .then(response => {
                console.log('Item added to basket:', response.data);
                setSelectedQuantities({ ...selectedQuantities, [productId]: 0 });
                setAlertOpen(true);
                // здесь можно обновить состояние или выполнить другие действия
            })
            .catch(error => {
                if (error.response && error.response.status === 400) {
                    console.log('Данный продукт был уже добавлен в корзину');
                    // выводим сообщение об ошибке на фронтенд, например, через уведомление
                    setAlertOpenError(true);
                } else {
                    console.error('Error adding item to basket:', error);
                    // обработка других ошибок при добавлении в корзину
                    setAlertOpenError(true);
                }
            });
    }
  };

  const handleCloseAlert = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setAlertOpen(false);
  };

  const handleCloseAlertError = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setAlertOpenError(false);
  };

  const handleDecreaseQuantity = (productId) => {
    const quantity = selectedQuantities[productId] || 0;
    if (quantity > 0) {
      const updatedQuantities = { ...selectedQuantities, [productId]: quantity - 1 };
      setSelectedQuantities(updatedQuantities);
    }
  };

  const handleIncreaseQuantity = (productId) => {
    const quantity = selectedQuantities[productId] || 0;
    const updatedQuantities = { ...selectedQuantities, [productId]: quantity + 1 };
    setSelectedQuantities(updatedQuantities);
  };


  return (
    <div className={classes.root}>
      <Typography variant="h4" align="center" style={{ marginBottom: '5vh' }}>
        Для любых событий и дорогих вам людей
      </Typography>
      <div className={classes.container}>
        {products.map((product) => (
          <Card key={product.id} className={classes.card}>
            <img src={avatars[product.id]} alt={product.name} />
            <CardContent>
              <Typography variant="h6" component="h2" gutterBottom>
                {product.name}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {product.description}
              </Typography>
              <div className={classes.quantityContainer}>
                <Typography variant="h6">{product.price} р/шт</Typography>
                <div>
                  <Button
                    className={classes.quantityButton}
                    onClick={() => handleDecreaseQuantity(product.id)}
                  >
                    <RemoveIcon />
                  </Button>
                  <Typography variant="h6">{selectedQuantities[product.id] || 0}</Typography>
                  <Button
                    className={classes.quantityButton}
                    onClick={() => handleIncreaseQuantity(product.id)}
                  >
                    <AddIcon />
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardActions>
              <Button
                className={classes.button}
                onClick={() => handleOrderClick(product.id)}
                fullWidth
              >
                Заказать
              </Button>
            </CardActions>
          </Card>
        ))}
      </div>
      <Snackbar
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={alertOpen}
        autoHideDuration={5000}
        onClose={handleCloseAlert}
      >
        <Alert onClose={handleCloseAlert} severity="success" sx={{ width: '100%' }}>
          Продукт успешно добавлен в корзину!
        </Alert>
      </Snackbar>
      <Snackbar
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={alertOpenError}
      autoHideDuration={4000}
      onClose={handleCloseAlertError}
    >
      <Alert onClose={handleCloseAlertError} severity="error" sx={{ width: '100%' }}>
        Данный продукт уже был добавлен в корзину!
      </Alert>
    </Snackbar>
    </div>
  );
};

export default ProductSection;
