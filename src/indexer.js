import Dashboard from "views/Dashboard.jsx";
import Icons from "views/Icons.jsx";

import Puller from "views/Puller";
import Processing from "views/Process";
import Result from "views/Result";
import Visual from "views/Visual";

import ProcessGuard from "utils/ProcessGuard";

const dashboardRoutes = [
  {
    path: "puller",
    name: "Puller",
    icon: "nc-icon nc-zoom-split",
    component: <Puller />
  },
  {
    path: "processing",
    name: "Pre-Process Process",
    icon: "nc-icon nc-grid-45",
    component: <Processing />,
  },
  {
    path: "visual",
    name: "Visualization",
    icon: "nc-icon nc-chart-bar-32",
    component: (<ProcessGuard><Visual /></ProcessGuard>)
  },
  {
    path: "result",
    name: "Result",
    icon: "nc-icon nc-notes",
    component: (<ProcessGuard><Result /></ProcessGuard>)
  },
  // {
  //   path: "dashboard",
  //   name: "Dashboard",
  //   icon: "nc-icon nc-chart-pie-35",
  //   component: <Dashboard />,
  // },
  // {
  //   path: "user",
  //   name: "User Profile",
  //   icon: "nc-icon nc-circle-09",
  //   component: <UserProfile />,
  // },
  // {
  //   path: "icons",
  //   name: "Icons",
  //   icon: "nc-icon nc-atom",
  //   component: <Icons />,
  // }
];

export default dashboardRoutes;
