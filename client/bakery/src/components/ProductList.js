import React, { useEffect, useState, useContext } from 'react';
import axios from '../api/axiosConfig';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Container, Typography, Box, Button, List, ListItem, ListItemText, IconButton, Divider, Card, CardContent, CardMedia } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddCircleIcon from '@mui/icons-material/AddCircle';

function ProductList() {
    const { authData } = useContext(AuthContext);
    const [products, setProducts] = useState([]);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await axios.get(`/api/products/bakery/${authData.user.id}`);
            setProducts(response.data);
        } catch (error) {
            console.error('Ошибка при получении списка товаров:', error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Вы уверены, что хотите удалить этот товар?')) {
            try {
                await axios.delete(`/api/products/${id}`);
                setProducts(products.filter((product) => product.id !== id));
            } catch (error) {
                console.error('Ошибка при удалении товара:', error);
            }
        }
    };

    return (
        <Container sx={{ padding: '20px' }}>
            <Box
                display="flex"
                flexDirection={{ xs: 'column', sm: 'row' }}
                justifyContent="space-between"
                alignItems={{ xs: 'flex-start', sm: 'center' }}
                mb={3}
                gap={2} // отступ между заголовком и кнопкой
            >
                <Typography variant="h4" sx={{ fontSize: { xs: '1.5rem', sm: '2rem' } }}>
                Управление данными о товарах
                </Typography>
                <Button
                component={Link}
                to="/bakery-admin/products/add"
                variant="contained"
                color="primary"
                startIcon={<AddCircleIcon />}
                sx={{
                    backgroundColor: '#F0C422',
                    transition: 'background-color 0.3s',
                    '&:hover': {
                    backgroundColor: '#E8BD20'
                    }
                }}
                >
                Добавить новый товар
                </Button>
            </Box>

            <List>
                {products.map((product) => (
                <React.Fragment key={product.id}>
                    <ListItem
                    alignItems="flex-start"
                    sx={{
                        padding: '20px',
                        borderRadius: '8px',
                        border: '1px solid #ddd',
                        marginBottom: '10px'
                    }}
                    >
                    <Card
                        sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', sm: 'row' },
                        width: '100%'
                        }}
                    >
                        {product.photo && (
                        <CardMedia
                            component="img"
                            image={`http://localhost:5000${product.photo}`}
                            alt={product.name}
                            sx={{
                            width: { xs: '100%', sm: 150 },
                            height: { xs: 200, sm: 'auto' },
                            objectFit: 'cover'
                            }}
                        />
                        )}
                        <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                        <CardContent>
                            <Typography component="div" variant="h6" sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                            {product.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                            {product.description}
                            </Typography>
                            <Typography variant="body2" color="text.primary" mt={1} sx={{ fontWeight: 500 }}>
                            Цена: {product.price} ₽
                            </Typography>
                        </CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', padding: 1, gap: 1 }}>
                            <IconButton
                            component={Link}
                            to={`/bakery-admin/products/edit/${product.id}`}
                            color="primary"
                            size="small"
                            >
                            <EditIcon />
                            </IconButton>
                            <IconButton onClick={() => handleDelete(product.id)} color="secondary" size="small">
                            <DeleteIcon />
                            </IconButton>
                        </Box>
                        </Box>
                    </Card>
                    </ListItem>
                    <Divider component="li" />
                </React.Fragment>
                ))}
            </List>
            </Container>
    );
}

export default ProductList;