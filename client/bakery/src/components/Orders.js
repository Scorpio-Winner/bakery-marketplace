import React, { useEffect, useState, useContext } from 'react';
import axios from '../api/axiosConfig';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import {
    Container,
    Typography,
    Box,
    Button,
    List,
    ListItem,
    ListItemText,
    Divider,
    CircularProgress,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    CardMedia,
} from '@mui/material';
import { FaStar } from 'react-icons/fa';

function Orders() {
    const { authData } = useContext(AuthContext);
    const [orders, setOrders] = useState([]);
    const [individualOrders, setIndividualOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [reviewData, setReviewData] = useState({
        rating: 5,
        short_review: '',
        description: '',
    });
    const [submitting, setSubmitting] = useState(false);
    const [searchDate, setSearchDate] = useState('');
    const [searchStatus, setSearchStatus] = useState('');
    const [openDialog, setOpenDialog] = useState(false);
    const [orderToCancel, setOrderToCancel] = useState(null);
    const [viewType, setViewType] = useState('regular'); // 'regular' or 'individual'

    const allowedStatuses = ['на рассмотрении', 'выполняется', 'выполнен', 'отменён'];

    const [bakeries, setBakeries] = useState([]);

    const fetchBakeries = async () => {
        try {
            const response = await axios.get('/api/bakeries', {
                headers: {
                    Authorization: `Bearer ${authData.token}`,
                },
            });
            setBakeries(response.data.bakeries);
            console.log('Bakeries response:', response.data);
        } catch (error) {
            console.error('Ошибка при получении списка пекарен:', error);
        }
    };

    useEffect(() => {
        fetchOrders();
        fetchIndividualOrders();
        fetchBakeries();
    }, []);

    useEffect(() => {
        filterOrders();
    }, [searchDate, searchStatus, orders, individualOrders, viewType]);

    const fetchOrders = async () => {
        try {
            const response = await axios.get('/api/orders', {
                headers: {
                    Authorization: `Bearer ${authData.token}`,
                },
            });
            setOrders(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Ошибка при получении заказов пользователя:', error);
            setLoading(false);
        }
    };

    const fetchIndividualOrders = async () => {
        try {
            const response = await axios.get('/api/individualOrders', {
                headers: {
                    Authorization: `Bearer ${authData.token}`,
                },
            });
            setIndividualOrders(response.data);
            console.log('Individual orders:', response.data);
        } catch (error) {
            console.error('Ошибка при получении индивидуальных заказов:', error);
        }        
    };

    const filterOrders = () => {
        let selected = viewType === 'regular' ? orders : individualOrders;
        let filtered = [...selected];

        if (searchDate) {
            filtered = filtered.filter((order) =>
                new Date(order.date_of_ordering).toISOString().startsWith(searchDate)
            );
        }

        if (searchStatus) {
            filtered = filtered.filter((order) => order.status === searchStatus);
        }

        setFilteredOrders(filtered);
    };

    const handleCancelOrder = async () => {
        if (!orderToCancel) return;
    
        try {
            let cancelUrl = '';  // URL для отмены зависит от типа заказа
            const cancelData = { status: 'отменён' };
    
            // Определим, с каким типом заказа работаем
            if (viewType === 'regular') {
                cancelUrl = `/api/orders/${orderToCancel}/status`;
            } else if (viewType === 'individual') {
                cancelUrl = `/api/individualOrders/${orderToCancel}/status`;
            }
    
            // Отправка запроса на отмену
            await axios.put(cancelUrl, cancelData, {
                headers: {
                    Authorization: `Bearer ${authData.token}`,
                },
            });
    
            // Обновим состояние заказов
            if (viewType === 'regular') {
                setOrders((prevOrders) =>
                    prevOrders.map((order) =>
                        order.id === orderToCancel ? { ...order, status: 'отменён' } : order
                    )
                );
            } else if (viewType === 'individual') {
                setIndividualOrders((prevOrders) =>
                    prevOrders.map((order) =>
                        order.id === orderToCancel ? { ...order, status: 'отменён' } : order
                    )
                );
            }
    
            alert('Заказ успешно отменён.');
        } catch (error) {
            console.error('Ошибка при отмене заказа:', error);
            alert('Не удалось отменить заказ.');
        } finally {
            setOrderToCancel(null);
            setOpenDialog(false);
        }
    };

    const handleReviewChange = (e) => {
        const { name, value } = e.target;
        setReviewData((prev) => ({ ...prev, [name]: value }));
    };

    const handleStarClick = (rating) => {
        setReviewData((prev) => ({ ...prev, rating }));
    };

    const getBakeryName = (bakeryId) => {
        const bakery = bakeries.find((b) => b.id === bakeryId);
        return bakery ? bakery.name : 'Неизвестная пекарня';
    };

    const handleSubmitReview = async (e) => {
        e.preventDefault();
    
        if (!reviewData.short_review.trim() || !reviewData.description.trim()) {
            alert('Пожалуйста, заполните все поля');
            return;
        }
    
        if (!selectedOrder) {
            alert('Пожалуйста, выберите заказ');
            return;
        }
    
        // Определяем, какой тип заказа (обычный или индивидуальный)
        const isRegular = viewType === 'regular';
        const isIndividual = viewType === 'individual';
    
        const payload = {
            ...reviewData,
            orderId: isRegular ? selectedOrder.id : null,  // Используем ID обычного заказа
            individualOrderId: isIndividual ? selectedOrder.id : null,  // Используем ID индивидуального заказа
        };
    
        if (!payload.orderId && !payload.individualOrderId) {
            alert('Не удалось определить тип заказа');
            return;
        }
    
        setSubmitting(true);
        try {
            await axios.post('/api/reviews', payload, {
                headers: {
                    Authorization: `Bearer ${authData.token}`,
                },
            });
    
            alert('Отзыв успешно создан!');
            setSubmitting(false);
            setSelectedOrder(null);
            setReviewData({ rating: 5, short_review: '', description: '' });
            fetchOrders();
            fetchIndividualOrders();
        } catch (error) {
            console.error('Ошибка при создании отзыва:', error);
            alert(error.response?.data?.message || 'Не удалось создать отзыв');
            setSubmitting(false);
        }
    };

    return (
        <Container sx={{ padding: '20px' }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Мои заказы
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, marginBottom: 2, flexDirection: { xs: 'column', sm: 'row' }, }}>
                <Button
                    variant="contained"
                    onClick={() => setViewType('regular')}
                    sx={{
                        backgroundColor: viewType === 'regular' ? '#F0C422' : 'transparent',
                        color: viewType === 'regular' ? '#fff' : '#000',
                        border: '1px solid #F0C422',
                        transition: 'background-color 0.3s, color 0.3s',
                        '&:hover': {
                            backgroundColor: '#E8BD20',
                        },
                    }}
                >
                    Обычные заказы
                </Button>
                <Button
                    variant="contained"
                    onClick={() => setViewType('individual')}
                    sx={{
                        backgroundColor: viewType === 'individual' ? '#F0C422' : 'transparent',
                        color: viewType === 'individual' ? '#fff' : '#000',
                        border: '1px solid #F0C422',
                        transition: 'background-color 0.3s, color 0.3s',
                        '&:hover': {
                            backgroundColor: '#E8BD20',
                        },
                    }}
                >
                    Индивидуальные заказы
                </Button>
            </Box>


            {loading ? (
                <CircularProgress />
            ) : filteredOrders.length === 0 ? (
                <Typography>Нет заказов для отображения.</Typography>
            ) : (
                <List>
                    {filteredOrders.map((order) => (
                        <React.Fragment key={order.id}>
                            <ListItem
                                alignItems="flex-start"
                                sx={{
                                    border: '1px solid #ccc',
                                    borderRadius: '4px',
                                    marginBottom: '10px',
                                    padding: '10px',
                                }}
                            >
                                <Box sx={{ width: '100%' }}>
                                    <Typography variant="h6">Заказ №{order.id}</Typography>
                                    <ListItemText
                                        primary={
                                            <>
                                            Пекарня:{' '}
                                            <Link
                                                to={`/bakeries/${order.bakeryId}`}
                                                style={{
                                                backgroundColor: '#F0C422',
                                                color: '#fff',
                                                textDecoration: 'none',
                                                padding: '2px 6px',
                                                borderRadius: '4px',
                                                display: 'inline-block',
                                                }}
                                            >
                                                {getBakeryName(order.bakeryId)}
                                            </Link>
                                            </>
                                        }
                                        />
                                    <ListItemText primary={`Адрес доставки: ${order.delivery_address}`} />
                                    <ListItemText
                                        primary={`Дата заказа: ${new Date(order.date_of_ordering).toLocaleString()}`}
                                    />
                                    <ListItemText
                                        primary={`Время готовности: ${
                                            order.completion_time ? order.completion_time : 'Ещё не выставлено'
                                        }`}
                                    />
                                    <ListItemText primary={`Статус: ${order.status}`} />
                                    <ListItemText
                                        primary={`Итоговая сумма: ${
                                            order.total_cost != null && !isNaN(order.total_cost)
                                                ? `${order.total_cost} ₽`
                                                : 'Ещё не выставлена'
                                        }`}
                                    />
                                    <Typography variant="subtitle1" gutterBottom>
                                                Описание: {order.description || 'Не указано'}
                                            </Typography>

                                    {viewType === 'regular' ? (
                                        <>
                                            <Typography variant="subtitle1" gutterBottom>
                                                Товары:
                                            </Typography>
                                            <List sx={{ listStyleType: 'disc', paddingLeft: '20px' }}>
                                                {order.OrderItems?.map((item) => (
                                                    <ListItem key={item.id} sx={{ display: 'list-item' }}>
                                                        {item?.Product?.name} x {item.quantity} ={' '}
                                                        {item?.Product?.price * item.quantity} ₽
                                                    </ListItem>
                                                ))}
                                            </List>
                                        </>
                                    ) : (
                                        <>                                           
                                            {order.photo && (
                                                <CardMedia
                                                    component="img"
                                                    image={`http://localhost:5000${order.photo}`}
                                                    alt="Фото индивидуального заказа"
                                                    sx={{
                                                        width: '30%',
                                                        height: 'auto',
                                                        borderRadius: 2,
                                                        marginTop: 2,
                                                        marginBottom: 2,
                                                        cursor: 'pointer',
                                                    }}
                                                    onClick={() => window.open(`http://localhost:5000${order.photo}`, '_blank')} // Открытие изображения в новом окне
                                                />
                                            )}
                                        </>
                                    )}

                                    {order.status === 'выполнен' && !order.Review && (
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={() => setSelectedOrder(order)}
                                            sx={{
                                                marginTop: '10px',
                                                backgroundColor: '#F0C422',
                                                transition: 'background-color 0.3s',
                                                '&:hover': {
                                                    backgroundColor: '#E8BD20',
                                                },
                                            }}
                                        >
                                            Написать отзыв
                                        </Button>
                                    )}
                                    {order.status === 'на рассмотрении' && (
                                        <Button
                                            variant="outlined"
                                            color="error"
                                            onClick={() => {
                                                setOrderToCancel(order.id);
                                                setOpenDialog(true);
                                            }}
                                            sx={{ marginTop: '10px' }}
                                        >
                                            Отменить заказ
                                        </Button>
                                    )}
                                </Box>
                            </ListItem>
                            <Divider component="li" />
                        </React.Fragment>
                    ))}
                </List>
            )}

            {/* Модалка для отзыва */}
            {selectedOrder && (
                <Dialog open={Boolean(selectedOrder)} onClose={() => setSelectedOrder(null)}>
                    <DialogTitle>Написать отзыв</DialogTitle>
                    <DialogContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                            {[1, 2, 3, 4, 5].map((star) => (
                                <FaStar
                                    key={star}
                                    size={24}
                                    color={reviewData.rating >= star ? '#FFD700' : '#ccc'}
                                    onClick={() => handleStarClick(star)}
                                    style={{ cursor: 'pointer', marginRight: '8px' }}
                                />
                            ))}
                        </Box>
                        <TextField
                            label="Короткий отзыв"
                            name="short_review"
                            value={reviewData.short_review}
                            onChange={handleReviewChange}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            label="Описание"
                            name="description"
                            value={reviewData.description}
                            onChange={handleReviewChange}
                            fullWidth
                            multiline
                            rows={4}
                            margin="normal"
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setSelectedOrder(null)} color="primary">
                            Отмена
                        </Button>
                        <Button
                            onClick={handleSubmitReview}
                            color="primary"
                            variant="contained"
                            disabled={submitting}
                            sx={{
                                backgroundColor: '#F0C422',
                                transition: 'background-color 0.3s',
                                '&:hover': {
                                    backgroundColor: '#E8BD20',
                                },
                            }}
                        >
                            {submitting ? 'Отправка...' : 'Отправить'}
                        </Button>
                    </DialogActions>
                </Dialog>
            )}

            {/* Модалка для отмены */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>Подтверждение отмены</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Вы уверены, что хотите отменить этот заказ? Это действие нельзя отменить.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)} color="primary">
                        Отмена
                    </Button>
                    <Button onClick={handleCancelOrder} color="error" variant="contained">
                        Отменить
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}

export default Orders;
