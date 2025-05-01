import React, { useEffect, useState } from 'react';
import axios from '../api/axiosConfig';
import {
    Container,
    Typography,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    TableContainer,
    Paper,
    Select,
    MenuItem,
    Button,
    CircularProgress,
    Alert,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    TextField,
    Box,
    CardMedia,
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';

function BakeryOrders() {
    const [orders, setOrders] = useState([]);
    const [individualOrders, setIndividualOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchDate, setSearchDate] = useState('');
    const [searchStatus, setSearchStatus] = useState('');
    const [editingOrder, setEditingOrder] = useState(null);
    const [completionTime, setCompletionTime] = useState('');
    const [totalCost, setTotalCost] = useState(null);
    const [viewType, setViewType] = useState('regular'); // 'regular' or 'individual'
    const [editingField, setEditingField] = useState(null);

    const allowedStatuses = ['на рассмотрении', 'выполняется', 'выполнен', 'отменён'];

    const [openDialog, setOpenDialog] = useState(false);
    const [orderToDelete, setOrderToDelete] = useState(null);

     useEffect(() => {
            fetchOrders();
            fetchIndividualOrders();
    }, []);

    useEffect(() => {
            filterOrders();
    }, [searchDate, searchStatus, orders, individualOrders, viewType]);

    const fetchOrders = async () => {
        try {
            const response = await axios.get('/api/bakeries/orders');
            setOrders(response.data);
            setFilteredOrders(response.data);
            setLoading(false);
        } catch (err) {
            console.error('Ошибка при получении заказов:', err);
            setError('Не удалось загрузить заказы.');
            setLoading(false);
        }
    };

    const fetchIndividualOrders = async () => {
        try {
            const response = await axios.get('/api/bakeries/individualOrders');
            setIndividualOrders(response.data);
            setFilteredOrders(response.data);
            setLoading(false);
        } catch (err) {
            console.error('Ошибка при получении заказов:', err);
            setError('Не удалось загрузить заказы.');
            setLoading(false);
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

    const handleStatusChange = async (orderId, newStatus) => {
        const endpoint =
            viewType === 'regular'
                ? `/api/orders/${orderId}/status`
                : `/api/individualOrders/${orderId}/status`;
    
        try {
            const response = await axios.put(endpoint, { status: newStatus });
    
            if (viewType === 'regular') {
                const updatedStatus = response.data.status || response.data.order?.status;
                setOrders((prevOrders) =>
                    prevOrders.map((order) =>
                        order.id === orderId ? { ...order, status: updatedStatus } : order
                    )
                );
            } else {
                const updatedStatus = response.data.status || response.data.individualOrder?.status;
                setIndividualOrders((prevOrders) =>
                    prevOrders.map((order) =>
                        order.id === orderId ? { ...order, status: updatedStatus } : order
                    )
                );
            }
    
            alert('Статус заказа успешно обновлён.');
        } catch (err) {
            console.error('Ошибка при обновлении статуса заказа:', err.response?.data || err.message);
            alert('Не удалось обновить статус заказа.');
        }
    };

    const handleTotalCostChange = async (orderId, newCost) => {
        try {
            // Отправляем запрос на сервер с новым значением стоимости
            const response = await axios.put(`/api/individualOrders/${orderId}/total-cost`, { total_cost: newCost });
            console.log(newCost);
    
            // Обновляем стоимость в состоянии для фронтенда
            const updatedTotalCost = response.data.status || response.data.individualOrder?.total_cost;
            setIndividualOrders((prevOrders) =>
                prevOrders.map((order) =>
                    order.id === orderId ? { ...order, total_cost: updatedTotalCost } : order
                )
            );
            
            alert('Стоимость заказа успешно обновлена.');
        } catch (err) {
            console.error('Ошибка при обновлении стоимости заказа:', err);
            alert('Не удалось обновить стоимость заказа.');
        } finally {
            setEditingField(null);  // Сбрасываем режим редактирования
        }
    };

    const handleOpenDialog = (orderId) => {
        setOrderToDelete(orderId);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setOrderToDelete(null);
    };

    const handleDeleteOrder = async () => {
        if (!orderToDelete) return;

        try {
            await axios.delete(`/api/orders/${orderToDelete}`);
            setOrders((prevOrders) => prevOrders.filter((order) => order.id !== orderToDelete));
            alert('Заказ успешно удалён.');
        } catch (err) {
            console.error('Ошибка при удалении заказа:', err);
            alert('Не удалось удалить заказ.');
        } finally {
            handleCloseDialog();
        }
    };

    const handleUpdateCompletionTime = async (orderId) => {
        if (!completionTime.trim()) {
            alert('Введите корректное время выполнения');
            return;
        }
    
        const endpoint = viewType === 'regular'
            ? `/api/orders/${orderId}/completion-time`
            : `/api/individualOrders/${orderId}/completion-time`;
    
        try {
            const response = await axios.put(endpoint, { completion_time: completionTime });

            const updatedOrder = viewType === 'regular'
            ? response.data.order
            : response.data.individualOrder;
    
            if (viewType === 'regular') {
                setOrders((prevOrders) =>
                    prevOrders.map((order) =>
                        order.id === orderId ? { ...order, completion_time: response.data.order.completion_time } : order
                    )
                );
            } else {
                setIndividualOrders((prevOrders) =>
                    prevOrders.map((order) =>
                        order.id === orderId ? { ...order, completion_time: response.data.individualOrder.completion_time } : order
                    )
                );
            }
    
            alert('Время выполнения успешно обновлено');
        } catch (error) {
            console.error('Ошибка при обновлении времени выполнения заказа:', error);
            alert('Не удалось обновить время выполнения заказа.');
        } finally {
            setEditingField(null);
        }
    };

    const handleEditField = (field, value) => {
        setEditingField(field); // Определяем, какое поле редактируется
        if (field === 'time') {
            setCompletionTime(value);
        } else if (field === 'cost') {
            setTotalCost(value);
        }
    };

    if (loading)
        return (
            <Container sx={{ textAlign: 'center', marginTop: '50px' }}>
                <CircularProgress />
                <Typography variant="h6" sx={{ marginTop: '20px' }}>
                    Загрузка заказов...
                </Typography>
            </Container>
        );

    if (error)
        return (
            <Container sx={{ marginTop: '50px' }}>
                <Alert severity="error">{error}</Alert>
            </Container>
        );

    return (
        <Container sx={{ padding: '20px' }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Управление данными о заказах
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, marginBottom: 4, flexDirection: { xs: 'column', sm: 'row' }, }}>
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

            <Box sx={{ display: 'flex', gap: 2, marginBottom: '20px', flexDirection: { xs: 'column', sm: 'row' } }}>
                <TextField
                    label="Поиск по дате (ГГГГ-ММ-ДД)"
                    type="date"
                    value={searchDate}
                    onChange={(e) => setSearchDate(e.target.value)}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    fullWidth
                />
                <Select
                    value={searchStatus}
                    onChange={(e) => setSearchStatus(e.target.value)}
                    displayEmpty
                    fullWidth
                >
                    <MenuItem value="">Все статусы</MenuItem>
                    {allowedStatuses.map((status) => (
                        <MenuItem key={status} value={status}>
                            {status}
                        </MenuItem>
                    ))}
                </Select>
                <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => {
                        setSearchDate('');
                        setSearchStatus('');
                    }}
                >
                    Сбросить фильтры
                </Button>
            </Box>

            {filteredOrders.length === 0 ? (
                <Alert severity="info">Нет доступных заказов.</Alert>
            ) : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>ID Заказа</TableCell>
                                <TableCell>Время выполнения</TableCell>
                                <TableCell>Имя Клиента</TableCell>
                                <TableCell>Телефон Клиента</TableCell>
                                <TableCell>Пожелания</TableCell>
                                <TableCell>Адрес Доставки</TableCell>
                                {viewType === 'regular' ? (
                                    <TableCell>Товары</TableCell>
                                ) : (
                                    <TableCell>Фото</TableCell>
                                )}
                                <TableCell>Общая Стоимость</TableCell>
                                <TableCell>Статус</TableCell>
                                <TableCell>Дата Заказа</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredOrders.map((order) => (
                                <TableRow key={order.id}>
                                    <TableCell>{order.id}</TableCell>
                                    <TableCell>
                                        {editingOrder === order.id && editingField === 'time' ? (
                                            <TextField
                                                value={completionTime}
                                                onChange={(e) => setCompletionTime(e.target.value)}
                                                onBlur={() => handleUpdateCompletionTime(order.id)}
                                                placeholder="Введите время"
                                                fullWidth
                                            />
                                        ) : (
                                            <Typography
                                                onClick={() => {
                                                    handleEditField('time'),
                                                    setEditingOrder(order.id);
                                                    setCompletionTime(order.completion_time || '');
                                                }}
                                                sx={{ cursor: 'pointer', textDecoration: 'underline' }}
                                            >
                                                {order.completion_time || 'Не указано'}
                                            </Typography>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {order.User.name} {order.User.surname}
                                    </TableCell>
                                    <TableCell>{order.User.phone}</TableCell>
                                    <TableCell>{order.description}</TableCell>
                                    <TableCell>{order.delivery_address}</TableCell>
                                    {viewType === 'regular' ? (
                                        <TableCell>
                                            {order.OrderItems && (
                                                <ul style={{ paddingLeft: '20px', margin: 0 }}>
                                                    {order.OrderItems.map((item) => (
                                                        <li key={item.id}>
                                                            {item.Product.name} x {item.quantity}
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </TableCell>
                                    ) : (
                                        <TableCell>
                                            {order.photo ? (
                                                <CardMedia
                                                    component="img"
                                                    image={`http://localhost:5000${order.photo}`}
                                                    alt="Фото индивидуального заказа"
                                                    sx={{
                                                        width: '9vw',
                                                        height: 'auto',
                                                        borderRadius: 2,
                                                        cursor: 'pointer',
                                                    }}
                                                    onClick={() => window.open(`http://localhost:5000${order.photo}`, '_blank')}
                                                />
                                            ) : (
                                                <Typography>Фото не предоставлено</Typography>
                                            )}
                                        </TableCell>
                                    )}
                                    <TableCell>
                                        {viewType === 'regular' ? (
                                            // Для обычных заказов просто выводим цену с рублем
                                            <Typography>{order.total_cost ? `${order.total_cost} ₽` : 'Не указана'}</Typography>
                                        ) : (
                                            // Для индивидуальных заказов выводим поле для редактирования цены
                                            editingOrder === order.id && editingField === 'cost' ? (
                                                <TextField
                                                    value={totalCost || ''}
                                                    onChange={(e) => setTotalCost(e.target.value)}  // Состояние для изменения цены
                                                    onBlur={() => handleTotalCostChange(order.id, totalCost)}  // Сохраняем цену при потере фокуса
                                                    placeholder="Введите цену"
                                                    fullWidth
                                                />
                                            ) : (
                                                <Typography
                                                    onClick={() => {
                                                        handleEditField('cost'),
                                                        setEditingOrder(order.id);
                                                        setTotalCost(order.total_cost || '');  // Устанавливаем текущее значение цены в поле
                                                    }}
                                                    sx={{ cursor: 'pointer', textDecoration: 'underline' }}
                                                >
                                                    {order.total_cost ? `${order.total_cost} ₽` : 'Не указана'}
                                                </Typography>
                                            )
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <Select
                                            value={order.status}
                                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                            variant="standard"
                                            fullWidth
                                        >
                                            {allowedStatuses.map((status) => (
                                                <MenuItem key={status} value={status}>
                                                    {status}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </TableCell>
                                    <TableCell>
                                        {new Date(order.date_of_ordering).toLocaleString()}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>Подтверждение Удаления</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Вы уверены, что хотите удалить этот заказ? Это действие нельзя отменить.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary">
                        Отмена
                    </Button>
                    <Button onClick={handleDeleteOrder} color="error" variant="contained">
                        Удалить
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}

export default BakeryOrders;
