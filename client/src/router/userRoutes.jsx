import BakeryPage from "../components/pages/BakeryPage";
import ProfilePage from "../components/pages/ProfilePage";
import Basket from "../components/pages/Basket";
import OrdersPage from "../components/pages/OrdersPage";
import CompletedOrdersPage from "../components/pages/CompletedOrdersPage";
import CurrentOrdersPage from "../components/pages/CurrentOrdersPage";

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