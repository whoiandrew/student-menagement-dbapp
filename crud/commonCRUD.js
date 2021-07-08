const findByParam = (collectionModel, param) => {
  return new Promise((res, rej) => {
    collectionModel
      .find(param)
      .then((data) => {
        if (data) {
          res(data);
        } else {
          throw new Error("nothing has found");
        }
      })
      .catch((e) => {
        rej(e);
      });
  });
};

const createOne = (collectionModel, newDocument) => {
  return new Promise((res, rej) => {
    collectionModel.create(newDocument, (err, doc) => {
      err ? rej(err) : res({ success: true, doc });
    });
  });
};

const updateOneById = (collectionModel, id, newData) => {
  return new Promise((res, rej) => {
    collectionModel
      .updateOne({ _id: id }, { $set: newData })
      .then(res({ success: true }))
      .catch((err) => rej(err));
  });
};

const removeOneById = (collectionModel, id) => {
  return new Promise((res, rej) => {
    collectionModel.findByIdAndRemove(id, (err, doc) => {
      err ? rej(err) : res({ success: true, doc });
    });
  });
};

module.exports = { findByParam, createOne, removeOneById, updateOneById };
