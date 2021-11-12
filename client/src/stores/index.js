
import UserStore from "./user.store";
import ListUsers from "./listUsers.store";
import ListOrders from "./listOrders.store";
import ListTeams from "./listTeams.store";
import ListStores from "./listStores.store";
import React from "react";
class RootStore {
  constructor() {
    this.userStore = new UserStore(this);
    this.listUsers=new ListUsers(this);
    this.listOrders =new ListOrders(this);
    this.listStores = new ListStores(this);
    this.listTeams= new ListTeams(this);
  }
}

const StoresContext = React.createContext(new RootStore());

// this will be the function available for the app to connect to the stores
export const useStores = () => React.useContext(StoresContext);