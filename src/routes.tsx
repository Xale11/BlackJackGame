import TestGame from "./components/TestGame";
import Hub from "./pages/Hub";
import OneVsThree from "./pages/OneVsThree";

export const routes = [
  {
    path: "/",
    element: <Hub/>
  },
  {
    path: "/test",
    element: <TestGame/>
  },
  {
    path: "onevsthree",
    element: <OneVsThree/>
  }
]