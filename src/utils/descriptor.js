import de from "element-ui/src/locale/lang/de";

export function getCommonKey(list) {
  if (list.length == 1) {
    return null;
  } else {
    let res = null;
    let counter = {};
    list.forEach(x => {
      x.children.forEach(y => {
        if (counter[y.keyName] === undefined) {
          counter[y.keyName] = 1;
        } else {
          counter[y.keyName] += 1;
        }
      })
    });
    console.log(counter);
    for (let key in counter) {
      if (counter[key] === list.length) {
        return key;
      }
    }
    return res;
  }
}

export function fusion(list) {
  let isInclude = false;
  let keyName = getCommonKey(list);
  let res = {
    children: [],
    type: 'Object'
  };
  list.flatMap(x => x.children)
    .forEach(x => {
      if (x.keyName === keyName) {
        if (!isInclude) {
          res.children.push(x);
          isInclude = true;
        }
      } else {
        res.children.push(x);
      }
    });
  return res;
}

export function getKeys(descriptor) {
  if (descriptor.type !== 'Object') {
    return [descriptor.keyName];
  } else if (descriptor.keyName == null) {
    return descriptor.children.flatMap(x => getKeys(x));
  } else {
    return descriptor.children.flatMap(x => getKeys(x)).map(x => descriptor.keyName + '.' + x);
  }
}

export function deepCopy(descriptor) {
  let tmp = JSON.stringify(descriptor);
  return descriptor;
}
