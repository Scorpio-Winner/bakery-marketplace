import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import SupportModal from './SupportModal';
import {
    AppBar,
    Toolbar,
    Button,
    Container,
    IconButton,
    Menu,
    MenuItem,
    useMediaQuery
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useTheme } from '@mui/material/styles';

const NavigationBar = () => {
    const { authData, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [supportOpen, setSupportOpen] = useState(false);

    const [anchorEl, setAnchorEl] = useState(null);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const commonButtonStyle = {
        marginRight: 2,
        backgroundColor: '#F0C422',
        transition: 'background-color 0.3s',
        '&:hover': {
            backgroundColor: '#E8BD20',
        }
    };

    const renderButtons = () => {
        const buttons = [];

        if (authData.role === 'user') {
            buttons.push(
                <Button key="orders" component={Link} to="/orders" color="inherit" sx={commonButtonStyle}>Мои заказы</Button>,
                <Button key="home" component={Link} to="/" color="inherit" sx={commonButtonStyle}>Главная</Button>,
                <Button key="cart" component={Link} to="/cart" color="inherit" sx={commonButtonStyle}>Корзина</Button>,
                <Button key="profile" component={Link} to="/profile" color="inherit" sx={commonButtonStyle}>Профиль</Button>
            );
        }

        if (authData.role === 'bakery') {
            buttons.push(
                <Button key="bakery-admin" component={Link} to="/bakery-admin" color="inherit" sx={commonButtonStyle}>
                    Управление пекарней
                </Button>
            );
        }

        if (!authData.isAuthenticated) {
            buttons.push(
                <Button key="register" component={Link} to="/register" color="inherit" sx={commonButtonStyle}>Регистрация</Button>,
                <Button key="login" component={Link} to="/login" color="inherit" sx={commonButtonStyle}>Вход</Button>
            );
        }

        if (authData.isAuthenticated) {
            buttons.push(
                <Button key="support" color="inherit" onClick={() => setSupportOpen(true)} sx={commonButtonStyle}>
                    Тех Поддержка
                </Button>,
                <Button key="logout" color="inherit" onClick={handleLogout} sx={commonButtonStyle}>Выход</Button>
            );
        }

        return buttons;
    };

    return (
        <>
            <AppBar position="static" style={{ backgroundColor: '#F0C422' }}>
                <Container maxWidth="lg">
                    <Toolbar disableGutters sx={{ justifyContent: 'flex-start' }}>
                        {isMobile ? (
                            <>
                                <IconButton
                                    size="large"
                                    edge="start"
                                    color="inherit"
                                    aria-label="menu"
                                    onClick={handleMenuOpen}
                                    sx={{ marginLeft: 1 }}
                                >
                                    <MenuIcon />
                                </IconButton>
                                <Menu
                                    anchorEl={anchorEl}
                                    open={Boolean(anchorEl)}
                                    onClose={handleMenuClose}
                                    PaperProps={{
                                        sx: {
                                            backgroundColor: '#F0C422',
                                            color: 'white',
                                        },
                                    }}
                                >
                                    {renderButtons().map((button, index) => (
                                        <MenuItem
                                            key={index}
                                            onClick={handleMenuClose}
                                            sx={{
                                                color: 'white',
                                                '&:hover': {
                                                    backgroundColor: '#e0b920',
                                                }
                                            }}
                                        >
                                            {button}
                                        </MenuItem>
                                    ))}
                                </Menu>
                            </>
                        ) : (
                            renderButtons()
                        )}
                    </Toolbar>
                </Container>
            </AppBar>
            <SupportModal
                open={supportOpen}
                onClose={() => setSupportOpen(false)}
                userRole={authData.role}
                userId={authData?.user?.id}
            />
        </>
    );
}

export default NavigationBar;
