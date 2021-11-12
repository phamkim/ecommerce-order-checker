const Store = require("../models/store.model");

// them moi store
exports.addStore = async (req, res) => {
  if (req.role !== "1") {
    const { name, link, limitDay, listTeams, userId } = req.body;
    const newStoreData = {
      name,
      link,
      limitDay,
      listTeams,
      status: 'active',
      click: 0,
      userId
    };
    const newStore = new Store(newStoreData);
    newStore.storeId = newStore._id;
    await newStore.save();
    res.send({ result: "ok" });
  } else {
    res.send({ result: "you not admin" });
  }
};

// lay danh sach store
exports.listStore = async (req, res) => {
  const { status } = req.query;
  const result = await Store.find({ status: status }).sort({ _id: -1 }).lean();
  res.send({ result: result });
};

// tim Store theo id
exports.findStore = async (req, res) => {
  const result = await Store.findOne({ _id: req.params.id }).lean();
  res.send({ result: result });
};

// tim Store theo id va update
exports.updateStore = async (req, res) => {
  const { name, link, limitDay, listTeams, status, click } = req.body;
  const newStoreData = {
    name,
    link,
    limitDay,
    listTeams,
    status,
    storeId: status === 'active' ? req.params.id : '',
    click
  };
  console.log(newStoreData)
  await Store.findOneAndUpdate({ _id: req.params.id }, newStoreData);
  res.send({ result: "ok" });
};

// xoa Store
exports.deleteStore = async (req, res) => {
  if (req.role !== "1") {
    await Store.findOneAndRemove({ _id: req.params.id }).lean();
    res.send({ result: "ok" });
  } else {
    res.send({ result: "you not admin" });
  }
};

const myloop = async (i, listStores) => {
  try {
    const store = listStores[i];
    let listTeams = store.listTeams;
    let newListTeams = store.listTeams;
    try {
      if (listTeams) {
        newListTeams = listTeams.map((e) => e ? {
          team: e.team,
          teamLimit: e.teamLimit,
          done: 0
        } : null);
      }
    } catch (error) {
      console.log(error);
    }
    await Store.findOneAndUpdate({ _id: store._id }, {
      listTeams: newListTeams,
      click: 0
    });
  } catch (error) {
    console.log(error);
  }
  i++
  if (i < listStores.length) {
    myloop(i, listStores)
  }
}

exports.resetStore = async () => {
  const listStores = await Store.find().lean();
  console.log('resetStore');
  var i = 0;
  try {
    myloop(i, listStores);
  } catch (error) {
    console.log(error)
  }
}