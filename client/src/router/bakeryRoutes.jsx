import BakeryPage from "../components/pages/Bakery/BakeryPage";
import BakeryOrdersPage from "../components/pages/Bakery/BakeryOrdersPage";
import BakeryCompletedOrdersPage from "../components/pages/Bakery/BakeryCompletedOrdersPage";
import BakeryCurrentOrdersPage from "../components/pages/Bakery/BakeryCurrentOrdersPage";

export const bakeryRoutes = [
    {
        path: "/bakery-main",
        Component: BakeryPage,
    },
    {
        path: "/bakery-orders",
        Component: BakeryOrdersPage,
    },
    {
        path: "/bakery-completed-orders",
        Component: BakeryCompletedOrdersPage,
    },
    {
        path: "/bakery-current-orders",
        Component: BakeryCurrentOrdersPage,
    },
];