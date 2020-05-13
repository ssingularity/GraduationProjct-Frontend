export function findInstanceByName(array, name) {
  return array.filter(x => x.name === name)[0];
}
