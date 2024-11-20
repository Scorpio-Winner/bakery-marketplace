import host from "./index2";

const getReview = async (orderId) => {
    try {
        const response = await host.get(`/api/review/${orderId}`);

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

export { getReview };