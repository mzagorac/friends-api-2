const removeDuplicates = (arr) => Array.from(new Set(arr));
const keepDuplicates = (arr) => removeDuplicates(keep(arr));

const keep = (arr, a = []) => {
  if (arr.length <= 0) return a;
  const [first, ...rest] = arr;
  if (rest.indexOf(first) > -1) a.push(first);
  return keep(rest, a);
};

module.exports = {
  removeDuplicates,
  keepDuplicates,
};
