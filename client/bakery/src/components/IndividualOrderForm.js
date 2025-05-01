import React, { useState, useContext } from 'react';
import axios from '../api/axiosConfig';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useParams } from 'react-router-dom'; 
import { Container, Typography, TextField, Button, Box } from '@mui/material';

function IndividualOrderForm({ imageFile, bakery }) {
    const { authData } = useContext(AuthContext); 
    const [formData, setFormData] = useState({
        delivery_address: '',
        description: '',
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
    
        try {
            const formDataToSend = new FormData();
            formDataToSend.append('delivery_address', formData.delivery_address);
            formDataToSend.append('description', formData.description);
            if (imageFile) {
                formDataToSend.append('photo', imageFile, 'custom_image.png'); 
            }
            
            formDataToSend.append('bakeryId', bakery.id);
    
            const response = await axios.post('/api/individualOrders', formDataToSend,  {
                headers: {
                    'Authorization': `Bearer ${authData.token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
    
            alert('Заказ успешно оформлен!');
            navigate('/orders');
        } catch (error) {
            console.error('Ошибка при оформлении заказа:', error);
            alert('Произошла ошибка при оформлении заказа.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container sx={{ padding: '20px' }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Оформление заказа
            </Typography>
            <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: '1.5vh' }}>
                <TextField
                    label="Адрес доставки"
                    name="delivery_address"
                    required
                    value={formData.delivery_address}
                    onChange={handleChange}
                />
                <TextField
                    label="Пожелания"
                    name="description"
                    multiline
                    rows={4}
                    value={formData.description}
                    onChange={handleChange}
                />
                <Button type="submit" variant="contained" color="primary" disabled={loading} sx={{ padding: '10px 20px', fontSize: '16px', backgroundColor: '#F0C422',
                                transition: 'background-color 0.3s',
                                    '&:hover': {
                                    backgroundColor: '#E8BD20'
                            } }}>
                    {loading ? 'Оформление...' : 'Сформировать заказ'}
                </Button>
            </Box>
        </Container>
    );
}

export default IndividualOrderForm;