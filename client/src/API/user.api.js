import { API } from "../conf/request";
export const getUser = async (id) => {
  var result = {};
  var conf = {
    headers: {
      "Content-Type": "application/json",
      Authorization: window.sessionStorage.getItem("accessToken"),
    },
  };

  await API.get("/users/" + id, conf)
    .then(function (response) {
      result = response.data.result;
    })
    .catch(function (error) {
      console.log(error);
    });
  return result;
};

export const getUsers = async (filters) => {
  var result = {};
  var conf = {
    headers: {
      "Content-Type": "application/json",
      Authorization: window.sessionStorage.getItem("accessToken"),
    },
  };

  await API.get("/users?" + filters, conf)
    .then(function (response) {
      result = response.data;
    })
    .catch(function (error) {
      console.log(error);
    });
  return result;
};

export const addUser = async (values) => {
  var data = JSON.stringify({
    userName: values.userName,
    passWord: values.passWord,
    nameBuyer: values.nameBuyer,
    fullName: values.fullName,
    role: values.role,
    team: values.team1,
    rate: values.rate,
  });
  var result = "";
  var conf = {
    headers: {
      "Content-Type": "application/json",
      Authorization: window.sessionStorage.getItem("accessToken"),
    },
  };
  await API.post("/users", data, conf)
    .then(function (response) {
      result = response.data.result;
    })
    .catch(function (error) {
      console.log(error);
    });
  return result;
};

export const updateUser = async (values) => {
  var data = JSON.stringify({
    userName: values.userName,
    passWord: values.passWord,
    nameBuyer: values.nameBuyer,
    fullName: values.fullName,
    role: values.role,
    team: values.team,
    rate: values.rate,
  });
  var result = "";
  var conf = {
    headers: {
      "Content-Type": "application/json",
      Authorization: window.sessionStorage.getItem("accessToken"),
    },
  };
  await API.put("/users/" + values.id, data, conf)
    .then(function (response) {
      result = response.data.result;
    })
    .catch(function (error) {
      console.log(error);
    });
  return result;
};

export const deleteUser = async (id) => {
  var result = "";
  var conf = {
    headers: {
      "Content-Type": "application/json",
      Authorization: window.sessionStorage.getItem("accessToken"),
    },
  };
  await API.delete("/users/" + id, conf)
    .then(function (response) {
      result = response.data.result;
    })
    .catch(function (error) {
      console.log(error);
    });
  return result;
};

export const updateUserOrders = async (orders) => {
  var data = JSON.stringify({
    orders: orders,
  });
  var conf = {
    headers: {
      "Content-Type": "application/json",
      Authorization: window.sessionStorage.getItem("accessToken"),
    },
    data: data,
  };
  var result = "";
  await API.put("/users/" + window.sessionStorage.getItem("id"), conf)
    .then(function (response) {
      result = response.data.result;
    })
    .catch(function (error) {
      console.log(error);
    });
  return result;
};
