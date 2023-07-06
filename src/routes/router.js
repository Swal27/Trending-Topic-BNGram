import { Navigate, createBrowserRouter } from "react-router-dom";
import dashboardRoutes from "indexer";
import Admin from "layouts/Admin";
import PageNotFound from "views/PageNotFound";

const AppRouter = createBrowserRouter([
    {
        path: '/',
        element:<Navigate to={'/puller'} replace/>
    },
    {
        path: '/',
        element: <Admin />,
        children: dashboardRoutes.map((route) => ({
            path: route.path,
            element: route.component
        }))
    },
    {
        path: '*',
        element: <PageNotFound />,
    },
]);

export default AppRouter;