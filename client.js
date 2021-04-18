const io = require("socket.io-client");

const socket = io.connect("http://localhost:8023");

socket.on("connect", () => {
  socket.emit("mix", { key: "spd", value: 10 }, (msg) => {
    console.log("response", msg);
  });
  socket.on("response", (values) => {
    console.log("response", values);
  });
  socket.on("exit", (values) => {
    console.log("exit", values);
    socket.disconnect();
  });
});
