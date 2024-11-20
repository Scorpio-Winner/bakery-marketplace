import React, { useState } from "react";
import { TextField, Button, Grid, Typography, Snackbar, Alert, CircularProgress } from "@mui/material";
import { useFormik } from "formik";
import { login } from "../api/authApi";
import Logo from "./img/logo.png";
import LoginBackground from "./img/back.png";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const LogoContainer = styled.div`
    height: 15vh;
    border-radius: 10px;
    overflow: hidden;
`;

const StyledLogo = styled.img`
    width: 100%;
    height: 100%;
    object-fit: contain;
`;

const LoginPage = () => {
    const [loading, setLoading] = useState(false);

    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const navigate = useNavigate();

    const displayError = (message) => {
        setErrorMessage(message);
        setError(true);
    };

    const closeSnackbar = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }

        setError(false);
    };

    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
        },
        validate: ({ email, password }) => {
            const errors = {};

            if (!email) {
                errors.email = "Введите эл. почту";
            } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)) {
                errors.email = "Некорректный адрес";
            }

            if (!password) {
                errors.password = "Введите пароль";
            }

            return errors;
        },
        onSubmit: async ({ email, password }) => {
            setLoading(true);

            const response = await login(email, password);

            if (response.status === 200) {
                localStorage.setItem("accessToken", response.data.accessToken);
                localStorage.setItem("refreshToken", response.data.refreshToken);
                localStorage.setItem("role", response.data.role);
                localStorage.setItem("id", response.data.id);
                window.location.reload();
                return;
            }

            if (response.status === 401) {
                displayError("Неверные данные аккаунта");
                setLoading(false);
                return;
            }

            displayError(response.data.error);
            setLoading(false);
        },
    });

    return (
        <>
            <Grid
                container
                justifyContent="center"
                alignItems="center"
                style={{ height: "100vh", backgroundImage: `url(${LoginBackground})`, backgroundSize: "cover"}}
            >
                <Grid
                    container
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    xl={3}
                    gap={2}
                    maxWidth={"600px"}
                    style={{ backgroundColor: "#F6F6F6", borderRadius: "15px", padding: "25px" }}
                >
                    <Grid container item xs={12} justifyContent={"center"}>
                        <LogoContainer>
                            <StyledLogo src={Logo} alt="Logo" />
                        </LogoContainer>
                    </Grid>
                    <Typography variant="h4" width={"100%"} textAlign={"center"}>
                        Выполните вход
                    </Typography>
                    <form onSubmit={formik.handleSubmit} style={{ width: "100%" }}>
                        <TextField
                            id="email"
                            label="Эл.почта"
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            value={formik.values.email}
                            onChange={(e) => {
                                formik.setFieldTouched("email", false);
                                formik.handleChange(e);
                            }}
                            error={formik.touched.email && formik.errors.email !== undefined}
                            helperText={
                                formik.touched.email && formik.errors.email !== undefined
                                    ? formik.errors.email
                                    : ""
                            }
                        />
                        <TextField
                            id="password"
                            label="Пароль"
                            type="password"
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            value={formik.values.password}
                            onChange={(e) => {
                                formik.setFieldTouched("password", false);
                                formik.handleChange(e);
                            }}
                            error={formik.touched.password && formik.errors.password !== undefined}
                            helperText={
                                formik.touched.password && formik.errors.password !== undefined
                                    ? formik.errors.password
                                    : ""
                            }
                        />
                        {!loading ? (
                            <>
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    style={{ marginTop: "20px", height: "50px", borderRadius: "15px" }}
                                >
                                    Войти
                                </Button>
                                <Button
                                    fullWidth
                                    variant="contained"
                                    color="secondary"
                                    style={{
                                        marginTop: "20px",
                                        height: "50px",
                                        borderRadius: "15px",
                                        border: "1px solid #999999",
                                    }}
                                    onClick={() => navigate("/register")}
                                >
                                    Регистрация
                                </Button>
                            </>
                        ) : (
                            <Grid container justifyContent={"center"}>
                                <CircularProgress color="primary" style={{ marginTop: "10px" }} />
                            </Grid>
                        )}
                    </form>
                </Grid>
                <Snackbar open={error} autoHideDuration={6000} onClose={closeSnackbar}>
                    <Alert onClose={closeSnackbar} severity="error" sx={{ width: "100%" }}>
                        {errorMessage}
                    </Alert>
                </Snackbar>
            </Grid>
        </>
    );
};

export default LoginPage;
