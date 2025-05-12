import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../api/axiosConfig';
import { AuthContext } from '../context/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import InputMask from 'react-input-mask';
import 'react-toastify/dist/ReactToastify.css';
import {
    Box, Button, CircularProgress, Grid, TextField, Typography, Avatar, IconButton,
} from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';

function Profile() {
    const { userId } = useParams();
    const { authData } = useContext(AuthContext);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        surname: '',
        email: '',
        phone: '',
        birth_date: '',
        description: '',
        photo: null,
        password: '',
    });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchUser();
    }, [userId]);

    const fetchUser = async () => {
        try {
            let response;
            if (userId) {
                response = await axios.get(`/api/users/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${authData.token}`,
                    },
                });
            } else {
                response = await axios.get('/api/users/auth', {
                    headers: {
                        Authorization: `Bearer ${authData.token}`,
                    },
                });
            }

            setUser(response.data);
            setFormData({
                name: response.data.name || '',
                surname: response.data.surname || '',
                email: response.data.email || '',
                phone: response.data.phone || '',
                birth_date: response.data.birth_date ? response.data.birth_date.substring(0, 10) : '',
                description: response.data.description || '',
                photo: null,
                password: '',
            });
        } catch (error) {
            console.error('Ошибка при получении данных пользователя:', error);
            toast.error('Не удалось загрузить данные профиля');
        } finally {
            setLoading(false);
        }
    };

    const isPhoneValid = (phone) => {
        const clean = phone.replace(/\D/g, '');
        return clean.length === 12; // +375 (xx) xxx-xx-xx = 12 цифр
    };

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'photo') {
            setFormData((prev) => ({ ...prev, photo: files[0] }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name.trim() || !formData.email.trim() || !formData.surname.trim()) {
            toast.error('Пожалуйста, заполните обязательные поля (Имя, Фамилия, Email)');
            return;
        }

        const phoneToCheck = formData.phone;
        
                if (!isPhoneValid(phoneToCheck)) {
                    toast.error('Введите корректный номер телефона');
                    return;
                }

        setSubmitting(true);
        try {
            const data = new FormData();
            data.append('name', formData.name);
            data.append('surname', formData.surname);
            data.append('email', formData.email);
            data.append('phone', formData.phone);
            data.append('birth_date', formData.birth_date);
            data.append('description', formData.description);
            if (formData.password) {
                data.append('password', formData.password);
            }
            if (formData.photo) {
                data.append('photo', formData.photo);
            }

            const response = await axios.put(`/api/users/${user.id}`, data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${authData.token}`,
                },
            });

            setUser(response.data);
            toast.success('Профиль успешно обновлён');
            setFormData((prev) => ({ ...prev, password: '', photo: null }));
        } catch (error) {
            console.error('Ошибка при обновлении профиля:', error);
            toast.error(error.response?.data?.message || 'Не удалось обновить профиль');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <Box textAlign="center" mt={5}><CircularProgress /></Box>;

    const isBakery = localStorage.getItem('role') === 'bakery';
    const isOwnProfile = !userId || Number(userId) === authData?.user?.id;
    const canEdit = isOwnProfile && !isBakery;

    return (
        <Box sx={{ maxWidth: 600, mx: 'auto', p: 3 }}>
            <Typography variant="h4" gutterBottom align="center">
                Профиль пользователя
            </Typography>
            <ToastContainer />
            <Box component="form" onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sx={{ textAlign: 'center' }}>
                        <Avatar
                            src={
                                formData.photo
                                    ? URL.createObjectURL(formData.photo)
                                    : user.photo
                                        ? `http://localhost:5000${user.photo}`
                                        : ''
                            }
                            alt="Фото профиля"
                            sx={{ width: '15vw', height: '15vw', mx: 'auto' }}
                        />
                        {canEdit && (
                            <IconButton color="primary" component="label">
                                <PhotoCamera />
                                <input
                                    type="file"
                                    name="photo"
                                    accept="image/*"
                                    hidden
                                    onChange={handleChange}
                                />
                            </IconButton>
                        )}
                    </Grid>

                    {['name', 'surname', 'email', 'phone'].map((field, idx) => (
                        <Grid item xs={12} key={idx}>
                            {field === 'phone' ? (
                            <InputMask
                                mask="+375 (99) 999-99-99"
                                maskChar={null}
                                value={formData.phone}
                                onChange={handleChange}
                                disabled={!canEdit}
                            >
                                {(inputProps) => (
                                    <TextField
                                        {...inputProps}
                                        label="Телефон"
                                        name="phone"
                                        fullWidth
                                        error={formData.phone && !isPhoneValid(formData.phone)}
                                        InputProps={{
                                            readOnly: !canEdit,
                                            style: {
                                                color: !canEdit ? 'black' : 'initial',
                                                backgroundColor: !canEdit ? '#f5f5f5' : 'transparent',
                                            },
                                        }}
                                        helperText={
                                            formData.phone && !isPhoneValid(formData.phone)
                                                ? 'Введите корректный номер телефона'
                                                : ''
                                        }
                                    />
                                )}
                            </InputMask>
                        ) : (
                            <TextField
                                label={
                                    field === 'name'
                                        ? 'Имя*'
                                        : field === 'surname'
                                            ? 'Фамилия'
                                            : 'Электронная почта*'
                                }
                                name={field}
                                type={field === 'email' ? 'email' : 'text'}
                                value={formData[field]}
                                onChange={handleChange}
                                fullWidth
                                required={field === 'name' || field === 'email'}
                                InputProps={{
                                    readOnly: !canEdit,
                                    style: {
                                        color: !canEdit ? 'black' : 'initial',
                                        backgroundColor: !canEdit ? '#f5f5f5' : 'transparent',
                                    },
                                }}
                            />
                        )}
                        </Grid>
                    ))}

                    <Grid item xs={12}>
                        <TextField
                            label="Дата рождения"
                            name="birth_date"
                            type="date"
                            value={formData.birth_date}
                            onChange={handleChange}
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                            InputProps={{
                                readOnly: !canEdit,
                                style: {
                                    color: !canEdit ? 'black' : 'initial',
                                    backgroundColor: !canEdit ? '#f5f5f5' : 'transparent',
                                },
                            }}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            label="Описание"
                            name="description"
                            multiline
                            rows={4}
                            value={formData.description}
                            onChange={handleChange}
                            fullWidth
                            InputProps={{
                                readOnly: !canEdit,
                                style: {
                                    color: !canEdit ? 'black' : 'initial',
                                    backgroundColor: !canEdit ? '#f5f5f5' : 'transparent',
                                },
                            }}
                        />
                    </Grid>

                    {canEdit && (
                        <>
                            <Grid item xs={12}>
                                <TextField
                                    label="Новый пароль"
                                    name="password"
                                    type="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    fullWidth
                                    placeholder="Оставьте пустым, если не хотите менять пароль"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    fullWidth
                                    disabled={submitting}
                                    sx={{
                                        backgroundColor: '#F0C422',
                                        transition: 'background-color 0.3s',
                                        '&:hover': {
                                            backgroundColor: '#E8BD20',
                                        },
                                    }}
                                >
                                    {submitting ? 'Обновление...' : 'Обновить профиль'}
                                </Button>
                            </Grid>
                        </>
                    )}
                </Grid>
            </Box>
        </Box>
    );
}

export default Profile;
