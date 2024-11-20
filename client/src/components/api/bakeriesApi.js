import { host } from "./index";
import updateToken from "../../utils/updateToken";

const registerBakery = async (bakeryData) => {
    try {
        const response = await host.post("/auth/register/bakery", bakeryData);

        return response;
    } catch (error) {
        if (error.response) {
            return error.response;
        } else if (error.request) {
            return { data: { error: "Сервис временно недоступен" } };
        } else {
            return { data: { error: "Ошибка при создании запроса" } };
        }
    }
};

const getCompanyProfile = async () => {
    try {
        const response = await host.get("/Companies/profile");

        return response;
    } catch (error) {
        if (error.response) {
            if (error.response.status === 401) {
                return await updateToken(getCompanyProfile);
            }

            return error.response;
        } else if (error.request) {
            return { data: { error: "Сервис временно недоступен" } };
        } else {
            return { data: { error: "Ошибка при создании запроса" } };
        }
    }
};

const getCompany = async (id) => {
    try {
        const response = await host.get("/Companies/" + id);

        return response;
    } catch (error) {
        if (error.response) {
            if (error.response.status === 401) {
                return await updateToken(getCompany, id);
            }

            return error.response;
        } else if (error.request) {
            return { data: { error: "Сервис временно недоступен" } };
        } else {
            return { data: { error: "Ошибка при создании запроса" } };
        }
    }
};

const putCompany = async (updatedCompanyData) => {
    try {
        const response = await host.put("/Companies/" + updatedCompanyData.id, updatedCompanyData);

        return response;
    } catch (error) {
        if (error.response) {
            if (error.response.status === 401) {
                return await updateToken(putCompany, updatedCompanyData);
            }

            return error.response;
        } else if (error.request) {
            return { data: { error: "Сервис временно недоступен" } };
        } else {
            return { data: { error: "Ошибка при создании запроса" } };
        }
    }
};

const getCompanyReviews = async (id) => {
    try {
        const response = await host.get(`/Companies/${id}/reviews`);

        return response;
    } catch (error) {
        if (error.response) {
            if (error.response.status === 401) {
                return await updateToken(getCompanyReviews, id);
            }

            return error.response;
        } else if (error.request) {
            return { data: { error: "Сервис временно недоступен" } };
        } else {
            return { data: { error: "Ошибка при создании запроса" } };
        }
    }
};

const checkEmailAvailability = async (email) => {
    try {
        const response = await host.post("/auth/check-email", { email });

        return response;
    } catch (error) {
        if (error.response) {
            return error.response;
        } else if (error.request) {
            return { data: { error: "Сервис временно недоступен" } };
        } else {
            return { data: { error: "Ошибка при создании запроса" } };
        }
    }
};

const updateAvatar = async (id, image) => {
    try {
        let formData = new FormData();
        formData.append("image", image);

        const response = await host.post(`/Companies/${id}/avatar`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        return response;
    } catch (error) {
        if (error.response) {
            return error.response;
        } else if (error.request) {
            console.log("Server did not respond.");
        } else {
            console.log("Error while creating request");
        }
    }
};

export { registerBakery, getCompanyProfile, getCompany, putCompany, getCompanyReviews, checkEmailAvailability, updateAvatar };
