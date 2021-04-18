/**
 * Socket
 *
 */
const _mixerSockets = () => {
  const socket = io();
  let callbacks = [];
  let values = {};

  const init = () => {
    socket.on("response", (_values) => {
      if (JSON.stringify(values) !== JSON.stringify(_values)) {
        values = _values;
        notify();
      }
    });
  };
  const destroy = () => {
    socket.on("exit", (values) => {
      socket.disconnect();
    });
  };
  const update = (value) => {
    socket.emit("mixs", value, (_values) => {
      console.log("emit", _values);
    });
  };
  const attach = (func) => {
    callbacks.push(func);
  };
  const notify = () => {
    callbacks.forEach((callback) => {
      callback(values);
    });
  };

  return {
    init,
    attach,
    update,
    destroy,
  };
};
