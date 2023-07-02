import Dashboard from "views/Dashboard.jsx";

import Puller from "views/Puller";
import Processing from "views/Process";
import Results from "views/Result";
import Visual from "views/Visual";
import Preprocessing from "views/Preprocess";

import ProcessGuard from "utils/ProcessGuard";
import PullerGuard from "utils/PullerGuard";
import PreprocessGuard from "utils/PreprocessGuard";
import VisualGuard from "utils/VisualGuard";

const dashboardRoutes = [
  {
    path: "puller",
    name: "Puller",
    icon: "nc-icon nc-zoom-split",
    component: <Puller />
  },
  {
    path: "pre-process",
    name: "Pre Process",
    icon: "nc-icon nc-grid-45",
    component: (<PullerGuard><Preprocessing /></PullerGuard>),
  },
  {
    path: "processing",
    name: "Process",
    icon: "nc-icon nc-app",
    component: (<PreprocessGuard><Processing /></PreprocessGuard>),
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
    component: (<VisualGuard><Results /></VisualGuard>)
  },
  // {
  //   path: "dashboard",
  //   name: "Dashboard",
  //   icon: "nc-icon nc-chart-pie-35",
  //   component: <Dashboard />,
  // },
];

export default dashboardRoutes;
