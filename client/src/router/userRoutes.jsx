import BakeryPage from "../components/pages/Bakery/BakeryPage";
import ProfilePage from "../components/pages/User/ProfilePage";
import Basket from "../components/pages/User/Basket";
import OrdersPage from "../components/pages/User/OrdersPage";
import CompletedOrdersPage from "../components/pages/User/CompletedOrdersPage";
import CurrentOrdersPage from "../components/pages/User/CurrentOrdersPage";

export const userRoutes = [
    {
        path: "/main",
        Component: BakeryPage,
    },
    {
        path: "/profile",
        Component: ProfilePage,
    },
    {
        path: "/basket",
        Component: Basket,
    },
    {
        path: "/orders",
        Component: OrdersPage,
    },
    {
        path: "/completed-orders",
        Component: CompletedOrdersPage,
    },
    {
        path: "/current-orders",
        Component: CurrentOrdersPage,
    },
];