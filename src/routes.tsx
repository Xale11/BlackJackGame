import Hub from "./pages/Hub";
import BlackjackStandard from "./pages/BlackjackStandard";

export const routes = [
  {
    path: "/",
    element: <Hub/>
  },
  {
    path: "/blackjack",
    element: <BlackjackStandard/>
  },

]