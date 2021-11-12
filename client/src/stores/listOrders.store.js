import { makeAutoObservable } from "mobx";
import { getOrder, deleteOrder, updateOrder, addOrder } from "../API/order.api";
class ListOrders {
  orders = [];
  count = 0;
  totalPrice = 0.0;
  realPrice = 0.0;
  constructor(rootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this);
  }

  setOrders = (orders) => {
    if (Array.isArray(orders)) {
      this.orders = orders;
    }
  };
  setCount = (count) => {
    this.count = parseInt(count);
  };
  setTotalPrice = (totalPrice) => {
    this.totalPrice = parseFloat(totalPrice)
  }
  setRealPrice = (realPrice) => {
    this.realPrice = parseFloat(realPrice)
  }
  getOrders = (filters) => {
    getOrder(filters).then((data) => {
      console.log(data)
      this.setOrders(data.result);
      this.setCount(data.count);
      this.setTotalPrice(data.totalPrice);
      this.setRealPrice(data.realPrice)
    });
  };

  refreshOrders = () => {
    this.orders = [];
    this.totalPrice = 0.0;
    this.count = 0;
    this.realPrice = 0.0;
  }

  addOrders = async (order) => {
    var result = "has"
    await addOrder(order)
      .then((data) => {
        console.log(data)
        if (data.result === "ok")
          result = "ok";
      })
      .catch((err) => {
        console.log(err);
      });
    console.log(result)
    return result;
  };

  updateOrders = async (order) => {
    var result = 'fail'
    await updateOrder(order)
      .then((data) => {
        result = data
      })
      .catch((err) => {
        console.log(err);
      });
    return result
  };

  deleteOrders = async (id) => {
    await deleteOrder(id)
      .then((result) => {
        console.log(result)
      })
      .catch((err) => {
        console.log(err);
      });
  };
}

export default ListOrders;
