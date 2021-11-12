import { makeAutoObservable } from "mobx";
import { BASE_URI, API } from "../conf/request";
import { getUser } from "../API/user.api";
import axios from "axios";
class UserStore {
  id = window.sessionStorage.getItem("id");
  userName = "";
  passWord = "";
  nameBuyer = "";
  fullName = "";
  role = "";
  team = "";
  rate = 0;

  accessToken = window.sessionStorage.getItem("accessToken");
  constructor(rootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this);
  }

  getUserName = () => {
    return this.userName;
  };

  refreshId = () => {
    this.id = window.sessionStorage.getItem("id");
  };
  refreshAccessToken = () => {
    this.accessToken = window.sessionStorage.getItem("accessToken");
    console.log(this.accessToken);
  };

  setProfile = (profile) => {
    this.nameBuyer = profile.nameBuyer;
    this.userName = profile.userName;
    this.id = profile._id;
    this.fullName = profile.fullName;
    this.role = profile.role;
    this.team = profile.team;
    this.rate = profile.rate;
    this.passWord = profile.passWord;
  };

  updateUser = async () => {
    var data = JSON.stringify({
      userName: this.userName,
      passWord: this.passWord,
      nameBuyer: this.nameBuyer,
      fullName: this.fullName,
      role: this.role,
      team: this.team,
      rate: this.rate,
    });
    var result = "";
    var conf = {
      headers: {
        "Content-Type": "application/json",
        Authorization: window.sessionStorage.getItem("accessToken"),
      },
    };
    await API.put("/users/" + this.id, data, conf)
      .then(function (response) {
        result = response.data.result;
      })
      .catch(function (error) {
        console.log(error);
      });
    return result;
  };

  getMyProfile = () => {
    getUser(window.sessionStorage.getItem("id")).then((user) => {
      this.setProfile(user);
    });
  };

  login = async (userName, passWord) => {
    var data = JSON.stringify({
      userName: userName,
      passWord: passWord,
    });
    var config = {
      method: "post",
      url: BASE_URI + "/auth/login",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };
    await axios(config)
      .then(function (response) {
        if (response.status === 200) {
          window.sessionStorage.setItem(
            "accessToken",
            response.data.accessToken
          );
          window.sessionStorage.setItem("id", response.data._id);
        } else if (response.status === 401) {
          alert("sai tài khoản hoặc mật khẩu");
        } else {
          alert("đăng nhập thất bại");
        }
      })
      .catch(function (error) {
        console.log(error);
        alert("đăng nhập thất bại");
      });
  };
  logout = () => {
    window.sessionStorage.removeItem("accessToken");
    this.accessToken = null;
  };
}

export default UserStore;
