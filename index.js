const express = require("express");
const mongoose = require("mongoose");

const {
  findByAuthor,
  createOne,
  removeOneById,
} = require("./crud/commonCRUD.js");

const PORT = "8081";
const MONGODB_URI =
  "mongodb+srv://whoiandrew:iANDREY09042000@cluster0.psryz.mongodb.net/ssystem?retryWrites=true&w=majority";

const app = express();

app.use(express.json());

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const userSchema = new Schema(
  {
    _id: String,
    password: String,
  },
  {
    versionKey: false,
  }
);

const workSchema = new Schema(
  {
    _id: String,
    title: String,
    size: Number,
    isChecked: Boolean,
    points: Number,
    author: String,
    lesson: String,
    uploadTime: Date,
    path: String,
  },
  {
    versionKey: false,
  }
);

const noteSchema = new Schema(
  {
    title: String,
    body: String,
    status: String,
    dateCreated: Date,
    author: String,
  },
  {
    versionKey: false,
  }
);

const userModel = mongoose.model("user", userSchema);
const workModel = mongoose.model("work", workSchema);
const noteModel = mongoose.model("note", noteSchema);

app.post("/addUser", (req, res) => {
  const { username, hash } = req.body;
  if (username && hash) {
    try {
      userModel.create({ _id: username, password: hash }, (err, doc) => {
        if (err) {
          err.code === 11000 && res.sendStatus(400);
          return console.log(err);
        } else {
          console.log("Saved object: ", doc);
        }
      });
    } catch (e) {
      console.log(e);
    }
  }
});

app.post("/getWorks/:id", (req, res) => {
  const { id } = req.params;
  try {
    workModel.find({ author: id }, (err, docs) => {
      if (err) {
        err.code === 11000 && res.sendStatus(400);
        return console.log(err);
      } else {
        console.log("Got works: ", docs);
        res.json(docs);
      }
    });
  } catch (e) {
    console.log(e);
  }
});

app.post("/addWork", (req, res) => {
  console.log("works");
  if (Object.keys(req.body).length) {
    const { filename, originalname, path, size, author, lesson } = req.body;
    const currentDate = new Date().toISOString();
    try {
      workModel.create(
        {
          _id: filename,
          title: originalname,
          size,
          isChecked: false,
          points: null,
          path,
          uploadTime: currentDate,
          author,
          lesson,
        },
        (err, doc) => {
          if (err) {
            err.code === 11000 && res.sendStatus(400);
            return console.log(err);
          } else {
            console.log("Saved object: ", doc);
          }
        }
      );
    } catch (e) {
      console.log(e);
    }
  }

  res.json({ success: true });
});

app.post("/getUser/:id", (req, res) => {
  const id = req.params.id;
  try {
    userModel
      .findById(id)

      .then((data) => {
        if (data) {
          res.json({ user: data });
        } else {
          res.json({ error: true, errorMessage: `User ${id} not found` });
        }
      })
      .catch((e) => {
        res.json({ success: false, message: e });
      });
  } catch (e) {
    console.log(e);
  }
});

app.post("/getNotes/:author", (req, res) => {
  const author = req.params.author;
  findByAuthor(noteModel, author).then((data) => {
    res.json(data);
  });
});

app.post("/removeNote/:id", (req, res) => {
  console.log("req");
  const id = req.params.id;
  removeOneById(noteModel, id).then((data) => {
    res.json(data);
  });
});

app.post("/addNote", (req, res) => {
  const body = req.body;
  console.log(body);
  createOne(noteModel, body)
    .then((data) => {
      res.json(data);
    })
    .catch((e) => {
      res.json(e);
    });
});

mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB has connected");
  })
  .catch(() => {
    console.log("Error with MongoDB connection");
  });

app.listen(PORT, () => {
  console.log(`DB microservice is listening on port ${PORT}...`);
});
