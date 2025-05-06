import React, { useEffect, useState, useContext } from 'react';
import axios from '../api/axiosConfig';
import { useParams } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';
import AISection from '../components/AISection';
import {
    Container,
    Typography,
    Grid,
    Card,
    CardContent,
    CardMedia,
    Button,
    TextField,
    CircularProgress,
    Box,
    Divider,
    Alert,
    Avatar,
    Slider,
} from '@mui/material';

function BakeryDetails() {
    const { id } = useParams();
    const { cartItems, addToCart, clearCart } = useContext(CartContext);
    const { authData } = useContext(AuthContext);
    const [bakery, setBakery] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [quantities, setQuantities] = useState({});
    const [error, setError] = useState(null);

    const [nameFilter, setNameFilter] = useState('');
    const [priceRange, setPriceRange] = useState([0, 10000]);
    const [filteredProducts, setFilteredProducts] = useState([]);

    useEffect(() => {
        fetchBakery();
        fetchReviews();
    }, [id]);

    const fetchBakery = async () => {
        try {
            const response = await axios.get(`/api/bakeries/${id}`);
            setBakery(response.data);

            if (response.data.Products && response.data.Products.length > 0) {
                const prices = response.data.Products.map(p => p.price);
                const min = Math.min(...prices);
                const max = Math.max(...prices);
                setPriceRange([min, max]);
            }
            
            setLoading(false);
        } catch (error) {
            console.error('Ошибка при получении информации о пекарне:', error);
            setLoading(false);
        }
    };

    const fetchReviews = async () => {
        try {
            const response = await axios.get(`/api/reviews/bakery/${id}`);
            setReviews(response.data);
        } catch (error) {
            console.error('Ошибка при получении отзывов:', error);
        }
    };

    const handleQuantityChange = (productId, value) => {
        const qty = parseInt(value, 10);
        if (qty >= 1) {
            setQuantities((prev) => ({ ...prev, [productId]: qty }));
        }
    };

    const handleAddToCart = async (product) => {
        const quantity = quantities[product.id] || 1;
        try {
            await addToCart(product, quantity);
        } catch (err) {
            setError(err.message);
        }
    };

    const calculateAverageRating = () => {
        if (reviews.length === 0) return 0;
        const total = reviews.reduce((acc, review) => acc + review.rating, 0);
        return (total / reviews.length).toFixed(1);
    };

    const renderStars = (rating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            if (rating >= i) {
                stars.push(<FaStar key={i} color="#FFD700" />);
            } else if (rating >= i - 0.5) {
                stars.push(<FaStarHalfAlt key={i} color="#FFD700" />);
            } else {
                stars.push(<FaRegStar key={i} color="#ccc" />);
            }
        }
        return stars;
    };

    useEffect(() => {
        if (bakery?.Products) {
            const filtered = bakery.Products.filter((product) => {
                const matchesName = product.name.toLowerCase().includes(nameFilter.toLowerCase());
                const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
                return matchesName && matchesPrice;
            });
            setFilteredProducts(filtered);
        }
    }, [bakery, nameFilter, priceRange]);

    const isDifferentBakery = cartItems.length > 0 && cartItems[0].Product.bakeryId !== parseInt(id, 10);

    return (
        <Container sx={{ padding: '20px' }}>
            {loading ? (
                <Box sx={{ textAlign: 'center', marginTop: '50px' }}>
                    <CircularProgress />
                    <Typography variant="h6" sx={{ marginTop: '20px' }}>
                        Загрузка информации о пекарне...
                    </Typography>
                </Box>
            ) : bakery ? (
                <Box>
                    <Typography variant="h3" component="h1" gutterBottom>
                        {bakery.name}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap' }}>
                        <Typography
                            variant="h6"
                            sx={{
                            marginRight: '8px',
                            fontSize: { xs: '1rem', sm: '1.25rem' },
                            '@media (max-width:389px)': {
                                fontSize: '0.875rem'
                            }
                            }}
                        >
                            Рейтинг:
                        </Typography>

                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            {renderStars(calculateAverageRating())}
                            <Typography
                            variant="h6"
                            sx={{
                                marginLeft: '8px',
                                fontSize: { xs: '1rem', sm: '1.25rem' },
                                '@media (max-width:389px)': {
                                fontSize: '0.875rem'
                                }
                            }}
                            >
                            {calculateAverageRating()} / 5
                            </Typography>
                        </Box>

                        <Typography
                            variant="body2"
                            sx={{
                            marginLeft: '8px',
                            color: '#555',
                            fontSize: { xs: '0.875rem', sm: '1rem' },
                            '@media (max-width:389px)': {
                                fontSize: '0.75rem',
                                marginLeft: '0',
                            }
                            }}
                        >
                            ({reviews.length} отзывов)
                        </Typography>
                        </Box>
                    {bakery.photo && (
                        <CardMedia
                            component="img"
                            image={`http://localhost:5000${bakery.photo}`}
                            alt={bakery.name}
                            sx={{ width: '20vw', height: 'auto', marginBottom: '20px' }}
                        />
                    )}
                    <Typography variant="body1" paragraph>
                        {bakery.description}
                    </Typography>
                    <Typography variant="body1" paragraph>
                        Адрес: {bakery.address}
                    </Typography>
                    <Typography variant="body1" paragraph>
                        Телефон: {bakery.phone}
                    </Typography>
                    <Typography variant="body1" paragraph>
                        Контактное лицо: {bakery.contact_person_name}
                    </Typography>

                    <Typography variant="h4" component="h2" gutterBottom>
                        Товары
                    </Typography>

                        {bakery.Products && bakery.Products.length > 0 && !isDifferentBakery && (
                            <Box sx={{ marginBottom: '20px' }}>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 400 }}>
                                    <TextField
                                        label="Поиск по названию"
                                        value={nameFilter}
                                        onChange={(e) => setNameFilter(e.target.value)}
                                    />
                                    <Box>
                                        <Typography>Цена: от {priceRange[0]} ₽ до {priceRange[1]} ₽</Typography>
                                        <Slider
                                            value={priceRange}
                                            onChange={(e, newValue) => setPriceRange(newValue)}
                                            min={Math.min(...bakery.Products.map(p => p.price))}
                                            max={Math.max(...bakery.Products.map(p => p.price))}
                                            valueLabelDisplay="auto"
                                        />
                                    </Box>
                                    <Button variant="outlined" color="secondary" onClick={() => {
                                        setNameFilter('');
                                        const prices = bakery.Products.map(p => p.price);
                                        setPriceRange([Math.min(...prices), Math.max(...prices)]);
                                    }}>
                                        Сбросить фильтры
                                    </Button>
                                </Box>
                            </Box>
                        )}

                        {isDifferentBakery && (
                            <Box sx={{ marginBottom: '10px', padding: '10px', border: '1px solid #f44336', borderRadius: '4px', backgroundColor: '#ffebee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography variant="body1" color="error">
                                    В корзине уже есть товары из другой пекарни. Пожалуйста, очистите корзину перед добавлением новых товаров.
                                </Typography>
                                <Button variant="outlined" color="error" onClick={() => clearCart()}>
                                    Очистить корзину
                                </Button>
                            </Box>
                        )}

                        {filteredProducts.length > 0 ? (
                            <Grid container spacing={4}>
                                {filteredProducts.map((product) => (
                                    <Grid item xs={12} sm={6} md={4} key={product.id}>
                                        <Card>
                                            {product.photo && (
                                                <CardMedia
                                                    component="img"
                                                    height="200"
                                                    image={`http://localhost:5000${product.photo}`}
                                                    alt={product.name}
                                                />
                                            )}
                                            <CardContent>
                                                <Typography variant="h5" component="h3">{product.name}</Typography>
                                                <Typography variant="body2" color="text.secondary" paragraph>{product.description}</Typography>
                                                <Typography variant="body1" color="text.primary" paragraph>Цена: {product.price} ₽</Typography>
                                                {authData.isAuthenticated && (
                                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                        <TextField
                                                            label="Количество"
                                                            type="number"
                                                            inputProps={{ min: 1 }}
                                                            value={quantities[product.id] || 1}
                                                            onChange={(e) => handleQuantityChange(product.id, e.target.value)}
                                                            sx={{ width: '80px', marginRight: '10px' }}
                                                        />
                                                        <Button
                                                            variant="contained"
                                                            color="primary"
                                                            onClick={() => handleAddToCart(product)}
                                                            disabled={isDifferentBakery}
                                                            sx={{ backgroundColor: '#F0C422', '&:hover': { backgroundColor: '#E8BD20' } }}
                                                        >
                                                            Добавить в корзину
                                                        </Button>
                                                    </Box>
                                                )}
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        ) : (
                            <Typography variant="body1">Товары не найдены.</Typography>
                        )}
                    {/* AI-блок – только если разрешена индивидуальная генерация и пользователь имеет роль "user" */}
                    {bakery.is_individual_order_avaliable && localStorage.getItem('role') === 'user' && (                        
                        <AISection bakery={bakery}/>
                    )}

                    <Typography
                        variant="h4"
                        component="h2"
                        gutterBottom
                        sx={{ marginTop: '20px' }}
                    >
                        Отзывы
                    </Typography>
                    {reviews.length > 0 ? (
                        <Box>
                            {reviews.map((review) => (
                                <Box key={review.id} sx={{ marginBottom: '20px' }}>
                                    <Divider sx={{ marginBottom: '10px' }} />
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <Avatar
                                            src={
                                                review.User?.photo
                                                    ? `http://localhost:5000${review.User.photo}`
                                                    : ''
                                            }
                                            alt={`Фото пользователя`}
                                            sx={{ width: 55, height: 55 }}
                                        />
                                        <Typography variant="body1" fontWeight="bold">
                                            {review.User.name} {review.User.surname} оценил(а) на {review.rating} звезд
                                        </Typography>
                                    </Box>
                                    <Typography variant="body2" paragraph sx={{ mt: 1.5 }}>
                                        <em>{review.short_review}</em>
                                    </Typography>
                                    <Typography variant="body2" paragraph>
                                        {review.description}
                                    </Typography>
                                    <Typography variant="caption" display="block">
                                        {new Date(review.createdAt).toLocaleString()}
                                    </Typography>
                                </Box>
                            ))}
                        </Box>
                    ) : (
                        <Typography variant="body1">Нет отзывов.</Typography>
                    )}
                </Box>
            ) : (
                <Typography variant="body1">Пекарня не найдена.</Typography>
            )}

            {error && (
                <Alert severity="error" sx={{ marginTop: '20px' }}>
                    {error}
                </Alert>
            )}
        </Container>
    );

}

export default BakeryDetails;