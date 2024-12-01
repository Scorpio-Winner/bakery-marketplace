import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { AppBar, Toolbar, Button, Container } from '@mui/material';

const NavigationBar = () => {
    const { authData, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    console.log('NavigationBar: authData.role is', authData.role, 'isAuthenticated:', authData.isAuthenticated);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <AppBar position="static" style={{ backgroundColor: '#F0C422' }}>
            <Container maxWidth="lg">
                <Toolbar>
                    {authData.role === 'user' && (
                        <>
                            <Button component={Link} to="/orders" color="inherit" sx={{
                            marginRight: 2,    
                            backgroundColor: '#F0C422',
                            transition: 'background-color 0.3s',
                            '&:hover': {
                                backgroundColor: '#E8BD20'
                            }
                        }}>
                                Мои заказы
                            </Button>
                            <Button component={Link} to="/" color="inherit" sx={{
                            marginRight: 2,    
                            backgroundColor: '#F0C422',
                            transition: 'background-color 0.3s',
                            '&:hover': {
                                backgroundColor: '#E8BD20'
                            }
                        }}>
                                Главная
                            </Button>
                            <Button component={Link} to="/cart" color="inherit" sx={{
                            marginRight: 2,    
                            backgroundColor: '#F0C422',
                            transition: 'background-color 0.3s',
                            '&:hover': {
                                backgroundColor: '#E8BD20'
                            }
                        }}>
                                Корзина
                            </Button>
                        </>
                    )}
                    {authData.role === 'bakery' && (
                        <Button component={Link} to="/bakery-admin" color="inherit" sx={{
                            marginRight: 2,    
                            backgroundColor: '#F0C422',
                            transition: 'background-color 0.3s',
                            '&:hover': {
                                backgroundColor: '#E8BD20'
                            }
                        }}>
                            Управление пекарней
                        </Button>
                    )}
                    {authData.role === 'user' && (
                        <Button component={Link} to="/profile" color="inherit" sx={{
                            marginRight: 2,    
                            backgroundColor: '#F0C422',
                            transition: 'background-color 0.3s',
                            '&:hover': {
                                backgroundColor: '#E8BD20'
                            }
                        }}>
                            Профиль
                        </Button>
                    )}
                    {!authData.isAuthenticated && (
                        <>
                            <Button component={Link} to="/register" color="inherit" sx={{
                            marginRight: 2,    
                            backgroundColor: '#F0C422',
                            transition: 'background-color 0.3s',
                            '&:hover': {
                                backgroundColor: '#E8BD20'
                            }
                        }}>
                                Регистрация
                            </Button>
                            <Button component={Link} to="/login" color="inherit" sx={{
                            marginRight: 2,    
                            backgroundColor: '#F0C422',
                            transition: 'background-color 0.3s',
                            '&:hover': {
                                backgroundColor: '#E8BD20'
                            }
                        }}>
                                Вход
                            </Button>
                        </>
                    )}
                    {authData.isAuthenticated && (
                        <Button
                        color="inherit"
                        onClick={handleLogout}
                        sx={{
                            backgroundColor: '#F0C422',
                            transition: 'background-color 0.3s',
                            '&:hover': {
                                backgroundColor: '#E8BD20'
                            }
                        }}
                    >
                        Выход
                    </Button>
                    )}
                </Toolbar>
            </Container>
        </AppBar>
    );
};

export default NavigationBar;