function getImgSrc(name, type, sub) {
  if (!name || !type) return '';

  let subName = name;
  if (sub && name === 'Bomb Rush') {
    subName += `_${sub}`;
  }

  // Take the item title, make it lower case, remove ( ) . ',
  // replace '&' with 'and', replace spaces with '_' to get img src
  return `img/${type}/${subName}`
          .toLowerCase()
          .replace(/[().']/g, '')
          .replace(/&/g, 'and')
          .replace(/\s/g, '_') + '.png';
}

function convertQsToObject(qs) {
  const pairs = qs.split('&');

  const result = {};

  pairs.forEach((pair) => {
    const [pair1, pair2] = pair.split('=');
    result[pair1] = decodeURIComponent(pair2 || '');
  });

  return result;
}

export default { getImgSrc, convertQsToObject };
