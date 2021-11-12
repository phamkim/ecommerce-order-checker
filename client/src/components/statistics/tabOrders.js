import React, { useEffect } from "react";
import { useStores } from "../../stores";
import { observer } from "mobx-react";
import {
  Statistic,
  Card,
  Table,
  Tooltip
} from "antd";
import moment from "moment";
import { convertUTCDateToLocalDate1 } from "../../conf";
const dateFormat = "DD-MM-YYYY";

export const TabOrders = observer(({ rate }) => {
  const { listUsers, listOrders } = useStores();
  const getTotalPrice = () => {
    var sum = 0.0;
    try {
      if (listOrders.orders.length > 0) {
        listOrders.orders.forEach(e => {
          sum += e.price * e.amount;
        });
      }
    } catch (error) {
      console.log(error)
    }
    return parseFloat(sum).toFixed(2);
  };
  const getRealPrice = () => {
    var sum = 0.0;
    try {
      if (listOrders.orders.length > 0) {
        listOrders.orders.forEach(e => {
          console.log(e)
          sum += parseFloat(e.realPrice || 0);
        });
      }
    } catch (error) {
      console.log(error)
    }
    console.log(sum)
    return parseFloat(sum).toFixed(2);
  };
  const getPriceForUser = () => {
    var sum = 0;
    try {
      if (listOrders.orders.length > 0) {
        listOrders.orders.forEach(e => {
          sum += parseFloat(e.realPrice || 0);
        });
      }
    } catch (error) {
      console.log(error)
    }
    return parseFloat(sum * rate).toFixed(2);
  };

  useEffect(() => {
    listUsers.getListUsers('')
    return () => {
      listOrders.refreshOrders()
    }

  }, [listOrders])

  const columns = [
    {
      title: 'ZipCode',
      dataIndex: 'zipCode',
      key: 'zipCode'
    },
    {
      title: 'trackingUPS',
      dataIndex: 'trackingUSP',
      key: 'trackingUSP',
    },
    {
      title: 'dateOrder',
      dataIndex: 'dateOrder',
      key: 'dateOrder',
      render: dateOrder => convertUTCDateToLocalDate1(dateOrder)
    },
    {
      title: 'dateDeli',
      dataIndex: 'dateDeli',
      key: 'dateDeli',
      render: dateDeli => convertUTCDateToLocalDate1(dateDeli)
    },
    {
      title: 'buyer',
      dataIndex: 'buyer',
      key: 'buyer',
      render: buyer => listUsers.users.map(e => e._id == buyer ? e.nameBuyer : null),
    },
    {
      title: 'orderZipCode',
      dataIndex: 'orderZipCode',
      key: 'orderZipCode'
    },
    {
      title: 'số lượng',
      dataIndex: 'amount',
      key: 'amount'
    },
    {
      title: 'giá tiền',
      dataIndex: 'price',
      key: 'price'
    },
    {
      title: 'đơn giá',
      key: 'totalPrice',
      render: (record) => record.price * record.amount
    },
    {
      title: 'thực thu',
      key: 'realPrice',
      dataIndex: 'realPrice',
    },
    {
      title: 'note',
      dataIndex: 'note',
      key: 'note',
      ellipsis: {
        showTitle: false,
      },
      render: note => (
        <Tooltip placement="topLeft" title={note}>
          {note}
        </Tooltip>
      ),
    },
  ];
  let data = [];
  var i = 0;
  listOrders.orders.forEach(element => {
    data.push({ ...element, key: i, })
    i++;
  });
  return (
    <div>
      <div className="base-list1">
        <Card>
          <Statistic title="Tổng số đơn" value={listOrders.count || 0} />
        </Card>
        <Card>
          <Statistic title="Tổng tiền đơn" value={getTotalPrice() || 0} />
        </Card>
        <Card>
          <Statistic title="Tổng tiền thực thu" value={getRealPrice() || 0} />
        </Card>
        {rate ? (
          <Card>
            <Statistic title="Tổng tiền lương" value={getPriceForUser() || 0} />
          </Card>
        ) : null}
      </div>
      <Table
        columns={columns}
        dataSource={data}
        scroll={{ x: 1500, y: 300 }}
      />
    </div>
  );
});
