const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const io = require("socket.io")(server);

const _store = () => {
  let values = {};
  let callbacks = [];

  const setValue = ({ key, value }) => {
    values[key] = value;
    callbacks.forEach((callback) => {
      console.log("callback = ", values);
      callback(values);
    });
  };

  const setValues = (_values) => {
    values = _values;
    callbacks.forEach((callback) => {
      console.log("callback = ", values);
      callback(values);
    });
  };

  const setCallback = (callback) => {
    callbacks.push(callback);
  };

  return {
    setValue,
    setValues,
    setCallback,
  };
};

const store = _store();

// Routing
app.use("/", express.static("public"));
app.get("/ctr", (req, res) => {
  res.sendFile(__dirname + "/public/ctr.html");
});
app.get("/view", (req, res) => {
  res.sendFile(__dirname + "/public/view.html");
});

// Socket
io.on("connection", (socket) => {
  store.setCallback((values) => {
    io.sockets.emit("response", values);
  });
  socket.on("mixs", (values) => {
    store.setValues(values);
  });
});

server.listen(3000, () => {
  console.log("listening on *:3000");
});
