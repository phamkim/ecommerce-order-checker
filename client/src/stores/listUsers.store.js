import { makeAutoObservable } from "mobx";
import { getUsers, updateUser, deleteUser, addUser } from "../API/user.api";
class ListUsers {
  users = [];
  count = 0;
  constructor(rootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this);
  }

  setUsers = (users) => {
    this.users = users;
  };
  setCount = (count) => {
    this.count = parseInt(count);
  };
  getListUsers = (filters) => {
    getUsers(filters).then((data) => {
      this.setUsers(data.result);
      this.setCount(data.count);
    });
  };

  refreshUsers = () => {
    this.users = [];
  }
  addUsers = (user) => {
    console.log("sad")
    addUser(user)
      .then((result) => {
        console.log(result)
      })
      .catch((err) => {
        console.log(err);
      });
  };

  updateUsers = (user) => {
    updateUser(user)
      .then((result) => {
        if (result === "ok") {
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  deleteUsers = (id) => {
    deleteUser(id)
      .then((result) => {
        console.log(result)
      })
      .catch((err) => {
        console.log(err);
      });
  };
}

export default ListUsers;
