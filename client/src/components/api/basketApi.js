import host from "./index2";

const getBasketItems = async (basketId) => {
    try {
        const response = await host.get(`/api/basket-to-order/${basketId}`);

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

export { getBasketItems };