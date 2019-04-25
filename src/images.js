function importAll(r) {
  let images = {};
  r.keys().forEach((item, index) => {
    images[item.replace("./", "")] = r(item);
  });
  return images;
}

export const images = importAll(
  require.context("./images/cards", false, /\.(png|jpe?g|svg)$/)
);
