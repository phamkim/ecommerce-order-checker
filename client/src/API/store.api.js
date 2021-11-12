import { API } from "../conf/request";

export const getStore = async (id) => {
  var result = {};
  var conf = {
    headers: {
      "Content-Type": "application/json",
      Authorization: window.sessionStorage.getItem("accessToken"),
    },
  };
  await API.get("/stores/" + id, conf)
    .then(function (response) {
      result = response.data.result;
    })
    .catch(function (error) {
      console.log(error);
    });
  return result;
};

export const getStores = async (filters) => {
  var result = {};
  var conf = {
    headers: {
      "Content-Type": "application/json",
      Authorization: window.sessionStorage.getItem("accessToken"),
    },
  };
  await API.get("/stores?" + filters, conf)
    .then(function (response) {
      result = response.data;
    })
    .catch(function (error) {
      console.log(error);
    });
  return result;
}

export const addStore = async (values) => {
  var data = JSON.stringify({
    name: values.name,
    link: values.link,
    limitDay: values.limitDay,
    listTeams: values.listTeams,
    userId: values.userId
  });
  var conf = {
    headers: {
      "Content-Type": "application/json",
      Authorization: window.sessionStorage.getItem("accessToken"),
    },
  };
  var result = "";
  await API.post("/stores", data, conf)
    .then(function (response) {
      result = response.data.result;
    })
    .catch(function (error) {
      console.log(error);
    });
  return result;
};

export const deleteStore = async (id) => {
  var result = "";
  var conf = {
    headers: {
      "Content-Type": "application/json",
      Authorization: window.sessionStorage.getItem("accessToken"),
    },
  };
  await API.delete("/stores/" + id, conf)
    .then(function (response) {
      result = response.data.result;
    })
    .catch(function (error) {
      console.log(error);
    });
  return result;
};

export const updateStore = async (values) => {
  var data = JSON.stringify({
    name: values.name,
    link: values.link,
    limitDay: values.limitDay,
    listTeams: values.listTeams,
    status: values.status,
    click: values.click
  });
  var conf = {
    headers: {
      "Content-Type": "application/json",
      Authorization: window.sessionStorage.getItem("accessToken"),
    },
  };
  var result = "";
  await API.put("/stores/" + values.id, data, conf)
    .then(function (response) {
      result = response.data.result;
    })
    .catch(function (error) {
      console.log(error);
    });
  return result;
};
