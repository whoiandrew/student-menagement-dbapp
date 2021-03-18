const findByAuthor = (collectionModel, author) => {
  return new Promise((res, rej) => {
    collectionModel
      .find({ author })

      .then((data) => {
        if (data) {
          console.log(data);
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
  console.log(newDocument);
  return new Promise((res, rej) => {
    collectionModel.create(newDocument, (err, doc) => {
      console.log(doc);
      err ? rej(err) : res({ success: true, doc });
    });
  });
};

const removeOneById = (collectionModel, id) => {
  return new Promise((res, rej) => {
    collectionModel.findByIdAndRemove(id, (err, doc) => {
      if (err) {
        rej({ err });
      } else {
        console.log(`removed: ${doc}`);
        res(doc);
      }
    });
  });
};

module.exports = { findByAuthor, createOne, removeOneById };
