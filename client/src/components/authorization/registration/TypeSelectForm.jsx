import React, { useState } from "react";
import { TextField, Button, Grid, Typography, Snackbar, Alert } from "@mui/material";
import { useFormik } from "formik";
import { login } from "../../api/authApi";
import Logo from "../img/logo.png";
import LoginBackground from "../img/back.png";
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

const TypeSelectForm = ({ setAccountType }) => {
    return (
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
            <Typography variant="h5" width={"100%"} textAlign={"center"}>
                Выберите тип аккаунта
            </Typography>
            <Grid container item justifyContent={"space-between"}>
                <Grid container item xs={5.5}>
                    <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        style={{ marginTop: "20px", height: "50px", borderRadius: "15px" }}
                        onClick={() => setAccountType("bakery")}
                    >
                        Пекарня
                    </Button>
                </Grid>
                <Grid container item xs={5.5}>
                    <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        style={{ marginTop: "20px", height: "50px", borderRadius: "15px" }}
                        onClick={() => setAccountType("user")}
                    >
                        Пользователь
                    </Button>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default TypeSelectForm;
