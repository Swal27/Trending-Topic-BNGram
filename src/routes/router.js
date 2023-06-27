import { createBrowserRouter } from "react-router-dom";
import dashboardRoutes from "indexer";
import Admin from "layouts/Admin";

const AppRouter = createBrowserRouter([
    {
        path: '/',
        element: <Admin />,
        children: dashboardRoutes.map((route) => ({
            path: route.path,
            element: route.component
        }))
    }
]);

export default AppRouter;