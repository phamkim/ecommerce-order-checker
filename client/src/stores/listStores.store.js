import { makeAutoObservable } from "mobx";
import { getStore, getStores, updateStore, deleteStore, addStore } from "../API/store.api";
class ListStores {
  stores = [];

  constructor(rootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this);
  }
  setStores = (stores) => {
    this.stores = stores;
  };

  getStore = (id) => {
    getStore(id).then((stores) => {
      this.setStores(stores);
    });
  };

  getStores = (filters) => {
    getStores(filters).then((data) => {
      this.setStores(data.result);
    })
  }

  updateLimitDay = async (idStore, team, totalPrice, oldTotalPrice) => {
    console.log(idStore);
    await getStore(idStore)
      .then((store) => {
        let listTeams = store.listTeams;
        let newListTeams = store.listTeams;
        try {
          if (listTeams) {
            newListTeams = listTeams.map((e) =>
              e.team === team
                ? {
                  team: e.team,
                  teamLimit: e.teamLimit,
                  done: parseInt(e.done || 0) + totalPrice - oldTotalPrice
                }
                : { team: e.team, teamLimit: e.teamLimit, done: e.done }
            );
          }
        } catch (error) {
          console.log(error);
        }
        const newStore = {
          id: store._id,
          name: store.name,
          link: store.link,
          limitDay: store.limitDay,
          status: store.status,
          listTeams: newListTeams,
          click: store.click
        };
        console.log(newStore);
        this.updateStores(newStore);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  addStores = (store) => {
    addStore(store)
      .then((result) => {
        if (result === "ok") {
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  deleteStores = (id) => {
    deleteStore(id)
      .then((result) => {
        if (result === "ok") {
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  updateStores = (store) => {
    updateStore(store)
      .then((result) => {
        if (result === "ok") {
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
}

export default ListStores;
