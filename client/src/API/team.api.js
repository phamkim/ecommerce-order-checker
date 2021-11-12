
import { API } from "../conf/request";

export const getTeam = async (id) => {
  var result = {};
  var conf = {
    headers: {
      "Content-Type": "application/json",
      Authorization: window.sessionStorage.getItem("accessToken"),
    },
  };
  await API.get("/teams/" + id, conf)
    .then(function (response) {
      result = response.data.result;
    })
    .catch(function (error) {
      console.log(error);
    });
  return result;
};

export const addTeam = async (values) => {
  var data = JSON.stringify({
    name: values.name,
  });
  var result = "";
  var conf = {
    headers: {
      "Content-Type": "application/json",
      Authorization: window.sessionStorage.getItem("accessToken"),
    },
  };
  await API.post("/teams", data, conf)
    .then(function (response) {
      result = response.data.result;
    })
    .catch(function (error) {
      console.log(error);
    });
  return result;
};

export const updateTeam = async (values) => {
  var data = JSON.stringify({
    name: values.name,
  });
  var result = "";
  var conf = {
    headers: {
      Authorization: window.sessionStorage.getItem("accessToken"),
      "Content-Type": "application/json",
    },
  };
  await API.put("/teams/" + values.id, data, conf)
    .then(function (response) {
      result = response.data.result;
    })
    .catch(function (error) {
      console.log(error);
    });
  return result;
};

export const deleteTeam = async (id) => {
  var result = "";
  var conf = {
    headers: {
      "Content-Type": "application/json",
      Authorization: window.sessionStorage.getItem("accessToken"),
    },
  };
  await API.delete("/teams/" + id, conf)
    .then(function (response) {
      result = response.data.result;
    })
    .catch(function (error) {
      console.log(error);
    });
  return result;
};
