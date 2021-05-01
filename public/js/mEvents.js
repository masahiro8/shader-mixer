/**
 * Events
 * @param {Array} sliderIds
 * @param {mixerSockets} soc
 * @returns
 */
const _mixerEvents = (sliderIds, soc) => {
  let sliders = {};
  let ids = [];
  let values = [];

  const init = () => {
    ids = sliderIds;
    ids.forEach((item) => {
      sliders[item.id] = document.getElementById(item.id);
      sliders[item.id].addEventListener("change", () => {
        values = [];
        ids.forEach((item) => {
          if (item.type === "number")
            values.push({ key: item.id, value: sliders[item.id].value / 100 });
          if (item.type === "file")
            values.push({ key: item.id, value: sliders[item.id].value });
        });
        soc.update(values);
      });
    });
  };
  return {
    init,
  };
};
