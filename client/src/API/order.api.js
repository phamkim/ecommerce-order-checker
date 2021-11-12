import { API } from "../conf/request";

export const getOrder = async (filters) => {
  var result = {};
  var conf = {
    headers: {
      "Content-Type": "application/json",
      Authorization: window.sessionStorage.getItem("accessToken"),
    },
  };
  await API.get("/orders?" + filters, conf)
    .then(function (response) {
      result = response.data;
    })
    .catch(function (error) {
      console.log(error);
    });

  return result;
};

export const addOrder = async (values) => {
  var data = JSON.stringify({
    zipCode: values.zipCode,
    trackingUSP: values.trackingUSP,
    dateOrder: values.dateOrder,
    dateDeli: values.dateDeli,
    orderZipCode: values.orderZipCode,
    amount: values.amount,
    price: values.price,
    store: values.store,
    buyer: window.sessionStorage.getItem("id"),
    team: values.team
  });
  var conf = {
    headers: {
      "Content-Type": "application/json",
      Authorization: window.sessionStorage.getItem("accessToken"),
    },
  };
  var results = "";
  await API.post("/orders", data, conf)
    .then(function (response) {
      results = response.data;
    })
    .catch(function (error) {
      console.log(error);
    });
  return results;
};

export const updateOrder = async (values) => {
  var data = JSON.stringify({
    zipCode: values.zipCode,
    trackingUSP: values.trackingUSP,
    dateOrder: values.dateOrder,
    dateDeli: values.dateDeli,
    orderZipCode: values.orderZipCode,
    amount: values.amount,
    price: values.price,
    note: values.note,
    realPrice: values.realPrice,
    state: values.state || 0
  });
  var conf = {
    headers: {
      "Content-Type": "application/json",
      Authorization: window.sessionStorage.getItem("accessToken"),
    },
  };
  var result = "";
  await API.put("/orders/" + values._id, data, conf)
    .then(function (response) {
      result = response.data.result;
    })
    .catch(function (error) {
      console.log(error);
    });

  return result;
};

export const deleteOrder = async (id) => {
  var result = "";
  var conf = {
    headers: {
      "Content-Type": "application/json",
      Authorization: window.sessionStorage.getItem("accessToken"),
    },
  };
  await API.delete("/orders/" + id, conf)
    .then(function (response) {
      result = response.data.result;
    })
    .catch(function (error) {
      console.log(error);
    });
  return result;
};
