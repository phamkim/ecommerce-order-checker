import { UserPage } from "../pages/user.page";
import { OrderPage } from "../pages/order.page";
import { TeamPage } from "../pages/team.page";
import { StorePage } from "../pages/store.page";
import { HomePage } from "../pages/home.page";
import { Login } from "../auth/login";
import { TabUsers } from '../components/statistics/users.statistc'
import { TabTeams } from "../components/statistics/teams.statistic"
import { TabStores } from "../components/statistics/stores.statistic"

export const MyRoute = [
  {
    path: "/",
    component: HomePage,
  },
  {
    path: "/login",
    component: Login,
  },
  {
    path: "/users",
    component: UserPage,
  },
  {
    path: "/orders",
    component: OrderPage,
  },
  {
    path: "/teams",
    component: TeamPage,
  },
  {
    path: "/stores",
    component: StorePage,
  },
  {
    path: "/statistic-teams",
    component: TabTeams,
  },
  {
    path: "/statistic-users",
    component: TabUsers,
  },
  {
    path: "/statistic-stores",
    component: TabStores,
  },
];
