import React, { useState } from 'react';
import axios from '../api/axiosConfig';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, TextField, Button, Box, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import InputMask from 'react-input-mask';
import 'react-toastify/dist/ReactToastify.css';

function Registration() {
    const [role, setRole] = useState('user'); 
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        name: '',
        surname: '',
        phone: '',
        birth_date: '',
        description: '',
        bakeryName: '',
        contactPersonName: '',
        registrationNumber: '',
        bakeryPhone: '',
        bakeryDescription: '',
        address: '',
        is_individual_order_avaliable: false,
    });
    const [photo, setPhoto] = useState(null); 
    const [photoUploaded, setPhotoUploaded] = useState(false); 

    const navigate = useNavigate(); 

    const handleRoleChange = (e) => {
        setRole(e.target.value);
    };

    const isPhoneValid = (phone) => {
        const clean = phone.replace(/\D/g, '');
        return clean.length === 12; // +375 (xx) xxx-xx-xx = 12 цифр
    };

    const handleIndividualOrderChange = (e) => {
        setFormData((prev) => ({
          ...prev,
          is_individual_order_avaliable: e.target.value === 'true',
        }));
      };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        setPhoto(file);
        setPhotoUploaded(!!file); 
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            toast.error('Пароли не совпадают');
            return;
        }

        const phoneToCheck = role === 'user' ? formData.phone : formData.bakeryPhone;

        if (!isPhoneValid(phoneToCheck)) {
            toast.error('Введите корректный номер телефона');
            return;
        }
    
        if (formData.password !== formData.confirmPassword) {
            toast.error('Пароли не совпадают');
            return;
        }

        const data = new FormData();
        if (role === 'user') {
            data.append('name', formData.name);
            data.append('surname', formData.surname);
            data.append('phone', formData.phone);
            data.append('birth_date', formData.birth_date);
            data.append('description', formData.description);
        } else {
            data.append('name', formData.bakeryName);
            data.append('contact_person_name', formData.contactPersonName);
            data.append('registration_number', formData.registrationNumber);
            data.append('phone', formData.bakeryPhone);
            data.append('description', formData.bakeryDescription);
            data.append('address', formData.address);
            data.append('is_individual_order_avaliable', formData.is_individual_order_avaliable ? 'true' : 'false');
        }

        data.append('email', formData.email);
        data.append('password', formData.password);

        if (photo) {
            data.append('photo', photo);
        }

        try {
            const url = role === 'user' ? '/api/users/registration' : '/api/bakeries/registration';
            await axios.post(url, data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            toast.success('Регистрация прошла успешно!');
            setTimeout(() => navigate('/login'), 2000); 
        } catch (error) {
            console.error('Ошибка при регистрации:', error);
            toast.error('Ошибка при регистрации');
        }
    };

    return (
        <Container sx={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
            <Typography variant="h4" gutterBottom>
                Регистрация
            </Typography>
            <ToastContainer />
            <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <FormControl fullWidth>
                    <InputLabel>Я хочу зарегистрироваться как</InputLabel>
                    <Select value={role} label="Я хочу зарегистрироваться как" onChange={handleRoleChange}>
                        <MenuItem value="user">Покупатель</MenuItem>
                        <MenuItem value="bakery">Пекарня</MenuItem>
                    </Select>
                </FormControl>
                <TextField
                    label="Email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                />
                <TextField
                    label="Пароль"
                    name="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                />
                <TextField
                    label="Подтвердите пароль"
                    name="confirmPassword"
                    type="password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                />
                {role === 'user' && (
                    <>
                        <TextField
                            label="Имя"
                            name="name"
                            required
                            value={formData.name}
                            onChange={handleChange}
                        />
                        <TextField
                            label="Фамилия"
                            name="surname"
                            required
                            value={formData.surname}
                            onChange={handleChange}
                        />
                        <InputMask
                        mask="+375 (99) 999-99-99"
                        maskChar={null}
                        value={formData.phone}
                        onChange={handleChange}
                    >
                        {(inputProps) => (
                            <TextField
                                {...inputProps}
                                label="Телефон"
                                name="phone"
                                required
                                fullWidth
                                error={formData.phone && !isPhoneValid(formData.phone)}
                                helperText={
                                    formData.phone && !isPhoneValid(formData.phone)
                                        ? 'Введите корректный номер телефона'
                                        : ''
                                }
                            />
                        )}
                    </InputMask>
                        <TextField
                            label="Дата рождения"
                            name="birth_date"
                            type="date"
                            value={formData.birth_date}
                            onChange={handleChange}
                            InputLabelProps={{ shrink: true }}
                        />
                        <TextField
                            label="Описание"
                            name="description"
                            multiline
                            rows={4}
                            value={formData.description}
                            onChange={handleChange}
                        />
                        <Button
                            variant="contained"
                            component="label"
                            disabled={photoUploaded} 
                        >
                            {photoUploaded ? 'Фотография загружена' : 'Загрузить фото'}
                            <input type="file" accept="image/*" hidden onChange={handlePhotoChange} />
                        </Button>
                    </>
                )}
                {role === 'bakery' && (
                    <>
                        <TextField
                            label="Название пекарни"
                            name="bakeryName"
                            required
                            value={formData.bakeryName}
                            onChange={handleChange}
                        />
                        <TextField
                            label="Контактное лицо"
                            name="contactPersonName"
                            required
                            value={formData.contactPersonName}
                            onChange={handleChange}
                        />
                        <TextField
                            label="Регистрационный номер"
                            name="registrationNumber"
                            required
                            value={formData.registrationNumber}
                            onChange={handleChange}
                        />
                        <InputMask
                        mask="+375 (99) 999-99-99"
                        maskChar={null}
                        value={formData.bakeryPhone}
                        onChange={handleChange}
                    >
                        {(inputProps) => (
                            <TextField
                                {...inputProps}
                                label="Телефон"
                                name="bakeryPhone"
                                required
                                fullWidth
                                error={formData.bakeryPhone && !isPhoneValid(formData.bakeryPhone)}
                                helperText={
                                    formData.bakeryPhone && !isPhoneValid(formData.bakeryPhone)
                                        ? 'Введите корректный номер телефона'
                                        : ''
                                }
                            />
                        )}
                    </InputMask>
                        <TextField
                            label="Адрес"
                            name="address"
                            required
                            value={formData.address}
                            onChange={handleChange}
                        />
                        <FormControl fullWidth>
                        <InputLabel>Будут ли выполняться индивидуальные заказы?</InputLabel>
                        <Select
                            value={formData.is_individual_order_avaliable ? 'true' : 'false'}
                            label="Будут ли выполняться индивидуальные заказы?"
                            onChange={handleIndividualOrderChange}
                        >
                            <MenuItem value="true">Да</MenuItem>
                            <MenuItem value="false">Нет</MenuItem>
                        </Select>
                        </FormControl>
                        <TextField
                            label="Описание"
                            name="bakeryDescription"
                            multiline
                            rows={4}
                            value={formData.bakeryDescription}
                            onChange={handleChange}
                        />
                        <Button
                            variant="contained"
                            component="label"
                            disabled={photoUploaded} 
                        >
                            {photoUploaded ? 'Фотография загружена' : 'Загрузить фото'}
                            <input type="file" accept="image/*" hidden onChange={handlePhotoChange} />
                        </Button>
                    </>
                )}
                <Button type="submit" variant="contained" color="primary" sx={{
                            backgroundColor: '#F0C422',
                                transition: 'background-color 0.3s',
                                    '&:hover': {
                                    backgroundColor: '#E8BD20'
                            }
                        }}>
                    Зарегистрироваться
                </Button>
            </Box>
        </Container>
    );
}

export default Registration;
