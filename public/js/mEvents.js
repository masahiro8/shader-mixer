/**
 * イベント
 */
const _mixerEvents = (sliderIds, soc) => {
  let sliders = {};
  let ids = [];
  let values = [];
  let callbacks = [];
  let socks = [];

  const init = () => {
    ids = sliderIds;
    ids.forEach((id) => {
      sliders[id] = document.getElementById(id);
      sliders[id].addEventListener("change", () => {
        // 登録
        values = [];
        ids.forEach((id) => {
          values.push({ key: id, value: sliders[id].value / 100 });
        });
        // socket emit
        soc.update(values);
      });
    });
  };
  return {
    init,
  };
};
