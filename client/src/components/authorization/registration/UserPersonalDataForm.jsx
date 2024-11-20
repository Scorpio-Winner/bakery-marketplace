import React from "react";
import { TextField, Button, Grid, Typography } from "@mui/material";
import InputMask from "react-input-mask";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import moment from "moment";
import { useFormik } from "formik";
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

const UserPersonalDataForm = ({ finishRegistration }) => {
    const formik = useFormik({
        initialValues: {
            name: "",
            surname: "",
            phone: "",
            birth_date: "",
        },
        validate: ({ name, surname, phone, birth_date }) => {
            const errors = {};

            if (!name) {
                errors.name = "Заполните поле";
            } else if (!/^[A-Za-zА-Яа-я]+$/i.test(name)) {
                errors.name = "Имя должно включать только буквы";
            } else if (name.length > 50) {
                errors.name = "Имя не должно превышать 50 символов";
            }

            if (!surname) {
                errors.surname = "Заполните поле";
            } else if (!/^[A-Za-zА-Яа-я]+$/i.test(surname)) {
                errors.surname = "Фамилия должна включать только буквы";
            } else if (surname.length > 50) {
                errors.surname = "Фамилия не должна превышать 50 символов";
            }

            if (!phone) {
                errors.phone = "Заполните поле";
            } else if (phone.includes("_")) {
                errors.phone = "Некорректное значение";
            }

            return errors;
        },
        onSubmit: async (userPersonalData) => {
            if (userPersonalData.birth_date === "Invalid date" || userPersonalData.birth_date === "") {
                userPersonalData.birth_date = null;
            }

            finishRegistration(userPersonalData);
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
                <Typography variant="h5" width={"100%"} textAlign={"center"}>
                    Укажите личные данные
                </Typography>
                <form onSubmit={formik.handleSubmit} style={{ width: "100%" }}>
                    <TextField
                        id="surname"
                        label="Фамилия"
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        value={formik.values.surname}
                        onChange={(e) => {
                            formik.setFieldTouched("surname", false);
                            formik.handleChange(e);
                        }}
                        error={formik.touched.surname && formik.errors.surname !== undefined}
                        helperText={
                            formik.touched.surname && formik.errors.surname !== undefined
                                ? formik.errors.surname
                                : ""
                        }
                    />
                    <TextField
                        id="name"
                        label="Имя"
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        value={formik.values.name}
                        onChange={(e) => {
                            formik.setFieldTouched("name", false);
                            formik.handleChange(e);
                        }}
                        error={formik.touched.name && formik.errors.name !== undefined}
                        helperText={
                            formik.touched.name && formik.errors.name !== undefined
                                ? formik.errors.name
                                : ""
                        }
                    />
                    <InputMask
                        mask="+375(99)999-99-99"
                        value={formik.values.phone}
                        onChange={(e) => {
                            formik.setFieldTouched("phone", false);
                            formik.handleChange(e);
                        }}
                    >
                        {() => (
                            <TextField
                                id="phone"
                                name="phone"
                                variant="outlined"
                                margin="normal"
                                fullWidth
                                label="Номер телефона"
                                value={formik.values.phone}
                                error={formik.touched.phone && formik.errors.phone !== undefined}
                                helperText={
                                    formik.touched.phone && formik.errors.phone !== undefined
                                        ? formik.errors.phone
                                        : ""
                                }
                            ></TextField>
                        )}
                    </InputMask>
                    <DatePicker
                        sx={{ width: "100%", marginTop: "16px" }}
                        label="Дата рождения"
                        disableFuture
                        maxDate={moment(new Date(new Date().setFullYear(new Date().getFullYear() - 14)))}
                        value={formik.values.dateOfBirth ? moment(formik.values.dateOfBirth) : null}
                        onChange={(newDate) => {
                            formik.setFieldValue("birth_date", moment(newDate).format("YYYY-MM-DD"));
                            formik.setFieldTouched("birth_date", false);
                        }}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        style={{ marginTop: "20px", height: "50px", borderRadius: "15px" }}
                    >
                        Готово
                    </Button>
                </form>
            </Grid>
        </>
    );
};

export default UserPersonalDataForm;
