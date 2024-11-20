import React from "react";
import { TextField, Button, Grid, Typography } from "@mui/material";
import InputMask from "react-input-mask";
import { useFormik } from "formik";

const BakeryPersonalDataForm = ({ finishRegistration }) => {
    const formik = useFormik({
        initialValues: {
            name: "",
            registration_number: "",
            contact_person_name: "",
            phone: "",
        },
        validate: ({ name, registration_number, contact_person_name, phone}) => {
            const errors = {};

            if (!name) {
                errors.name = "Заполните поле";
            } else if (name.length > 255) {
                errors.name = "Имя не должно превышать 255 символов";
            }

            if (!registration_number) {
                errors.registration_number = "Заполните поле";
            } else if (!/^[A-Za-z0-9]+$/i.test(registration_number)) {
                errors.registration_number = "Недопустимые символы в номере (A-Za-z0-9)";
            } else if (registration_number.length > 50) {
                errors.registration_number = "Номер не должен превышать 50 символов";
            }

            if (!contact_person_name) {
                errors.contact_person_name = "Заполните поле";
            } else if (!/^[A-Za-zА-Яа-я]+$/i.test(contact_person_name)) {
                errors.contact_person_name = "Имя должно включать только буквы";
            } else if (contact_person_name.length > 50) {
                errors.contact_person_name = "Имя не должно превышать 50 символов";
            }

            if (!phone) {
                errors.phone = "Заполните поле";
            } else if (phone.includes("_")) {
                errors.phone = "Некорректное значение";
            }

            return errors;
        },
        onSubmit: async (bakeryPersonalData) => {

            finishRegistration(bakeryPersonalData);
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
                <Typography variant="h5" width={"100%"} textAlign={"center"}>
                    Укажите данные компании
                </Typography>
                <form onSubmit={formik.handleSubmit} style={{ width: "100%" }}>
                    <TextField
                        id="name"
                        label="Название"
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
                            formik.touched.name && formik.errors.name !== undefined ? formik.errors.name : ""
                        }
                    />
                    <TextField
                        id="registration_number"
                        label="Регистрационный номер"
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        value={formik.values.registration_number}
                        onChange={(e) => {
                            formik.setFieldTouched("registration_number", false);
                            formik.handleChange(e);
                        }}
                        error={
                            formik.touched.registration_number && formik.errors.registration_number !== undefined
                        }
                        helperText={
                            formik.touched.registration_number && formik.errors.registration_number !== undefined
                                ? formik.errors.registration_number
                                : ""
                        }
                    />
                    <Typography variant="h6">Контактное лицо</Typography>                    
                    <TextField
                        id="contact_person_name"
                        label="Имя"
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        value={formik.values.contact_person_name}
                        onChange={(e) => {
                            formik.setFieldTouched("contact_person_name", false);
                            formik.handleChange(e);
                        }}
                        error={formik.touched.contact_person_name && formik.errors.contact_person_name !== undefined}
                        helperText={
                            formik.touched.contact_person_name && formik.errors.contact_person_name !== undefined
                                ? formik.errors.contact_person_name
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

export default BakeryPersonalDataForm;
