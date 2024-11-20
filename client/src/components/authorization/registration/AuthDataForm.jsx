import React, { useState } from "react";
import { TextField, Button, Grid, Typography, Snackbar, Alert, CircularProgress } from "@mui/material";
import { useFormik } from "formik";
import { checkEmailAvailability } from "../../api/bakeriesApi";
import Logo from "../img/logo.png";
import styled from "styled-components";

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

const AuthDataForm = ({ setAuthData }) => {
    const [loading, setLoading] = useState(false);

    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

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
            passwordDuplicate: "",
        },
        validate: ({ email, password, passwordDuplicate }) => {
            const errors = {};

            if (!email) {
                errors.email = "Введите эл. почту";
            } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)) {
                errors.email = "Некорректный адрес";
            } else if (email.length > 100) {
                errors.email = "Почта не должна превышать 100 символов";
            }

            if (!password) {
                errors.password = "Введите пароль";
            } else if (password.length < 8) {
                errors.password = "Пароль короче 8 символов";
            }

            if (password && passwordDuplicate !== password) {
                errors.passwordDuplicate = "Пароли не совпадают";
            }

            return errors;
        },
        onSubmit: async ({ email, password }) => {
            setLoading(true);

            const response = await checkEmailAvailability(email);

            if (!response.status || response.status >= 300) {
                setLoading(false);
                displayError(response.data.error);
                return;
            }

            if (!response.data.available) {
                setLoading(false);
                displayError("Почта уже используется");
                return;
            }

            setAuthData({ email, password });
        },
    });

    return (
        <>
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
                    Регистрация
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
                            formik.touched.email && formik.errors.email !== undefined ? formik.errors.email : ""
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
                    <TextField
                        id="passwordDuplicate"
                        label="Повторите пароль"
                        type="password"
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        value={formik.values.passwordDuplicate}
                        onChange={(e) => {
                            formik.setFieldTouched("passwordDuplicate", false);
                            formik.handleChange(e);
                        }}
                        error={formik.touched.passwordDuplicate && formik.errors.passwordDuplicate !== undefined}
                        helperText={
                            formik.touched.passwordDuplicate && formik.errors.passwordDuplicate !== undefined
                                ? formik.errors.passwordDuplicate
                                : ""
                        }
                    />
                    {!loading ? (
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            style={{ marginTop: "20px", height: "50px", borderRadius: "15px" }}
                        >
                            Далее
                        </Button>
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
        </>
    );
};

export default AuthDataForm;
