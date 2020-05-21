function getCommonKey(descriptorList) {
  if (descriptorList.length == 1) {
    return null;
  } else {
    let res = null;
    let counter = {};
    descriptorList.forEach(x => {
      if (x.type === 'Object') {
        x.children.forEach(y => {
          if (counter[y.keyName] === undefined) {
            counter[y.keyName] = 1;
          } else {
            counter[y.keyName] += 1;
          }
        })
      }
      else {
        if (counter[x.keyName] === undefined) {
          counter[x.keyName] = 1;
        } else {
          counter[x.keyName] += 1;
        }
    }
    });
    for (let key in counter) {
      if (counter[key] === descriptorList.length) {
        return key;
      }
    }
    return res;
  }
}

function fusion(descriptorList) {
  let isInclude = false;
  let keyName = getCommonKey(descriptorList);
  let res = {
    children: [],
    type: 'Object'
  };
  descriptorList.flatMap(x => x.type === "Object" ? x.children : [x])
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

export function getCommonKeyFromInputList(list) {
  return getCommonKey(list.map(x => x.type === 'DataSource' ? x.schema : x.response));
}

export function fusionInputList(list) {
  return fusion(list.map(x => x.type === 'DataSource' ? x.schema : x.response))
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
