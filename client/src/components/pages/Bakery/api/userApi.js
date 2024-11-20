import host from ".";

const getAllUsers = async () => {
    try {
        const response = await host.get("/api/all-users");

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

const updateUserInfo = async (id, userData) => {
    try {
        const response = await host.put(`/api/user/update/${id}`, userData);

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


export { getAllUsers, updateUserInfo };