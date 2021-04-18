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
    ids.forEach((id) => {
      sliders[id] = document.getElementById(id);
      sliders[id].addEventListener("change", () => {
        values = [];
        ids.forEach((id) => {
          values.push({ key: id, value: sliders[id].value / 100 });
        });
        soc.update(values);
      });
    });
  };
  return {
    init,
  };
};
