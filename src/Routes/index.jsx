import DefaultLayout from "../layouts/DefaultLayout/DefaultLayout";
import Homepage from "../components/Homepage/Homepage";
import Explore from "../components/Explore/Explore";
import Following from "../components/Following/Following";
import Live from "../components/Live/Live";
import Profile from "../components/Profile/Profile";

export const Routes = [
  {
    path: "/",
    element: <DefaultLayout />,
    children: [
      {
        path: "/",
        element: <Homepage />,
      },
      {
        path: "/explore",
        element: <Explore />,
      },
      {
        path: "/following",
        element: <Following />,
      },
      {
        path: "/live",
        element: <Live />,
      },
      {
        path: "/profile",
        element: <Profile />,
      },
    ],
  },
];
