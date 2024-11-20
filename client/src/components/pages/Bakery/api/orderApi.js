import host from ".";

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


const getCompletedOrders = async () => {
    try {
        const response = await host.get(`/api/completed-orders`);

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

const getInProcessOrders = async () => {
    try {
        const response = await host.get(`/api/in-process-orders`);

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


const updateOrderStatusCancelled = async (id) => {
    try {
        const response = await host.put(`/api/order/update/${id}`);

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

const updateOrderStatusCompleted = async (id) => {
    try {
        const response = await host.put(`/api/order/update/complete/${id}`);

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


const updateOrderStatusInProgress = async (orderId, orderData) => {
    try {
      const response = await host.put(`/api/order/update/in-progress/${orderId}`, orderData);
  
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
  

export { getBasketItems, getCompletedOrders, getInProcessOrders, updateOrderStatusCancelled, updateOrderStatusCompleted, updateOrderStatusInProgress };