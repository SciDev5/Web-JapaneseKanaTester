var deepFreezePath = [];

class Utils {
  static randomArr(arr) {
    return arr[Math.floor(Math.random()*arr.length)];
  }
  static removeFirstArr(arr,elt) {
    if (!arr || !(arr instanceof Array)) throw new Error("Utils.removeFirstArr: array provided was not actually an array!");
    
    var index = arr.indexOf(elt);
    if (index != -1)
      arr.splice(index,1);
    return arr;
  }
  static removeAllArr(arr,elt) {
    if (!arr || !(arr instanceof Array)) throw new Error("Utils.removeFirstArr: array provided was not actually an array!");
    
    var index = arr.indexOf(elt);
    while (index != -1) {
      arr.splice(index,1);
      index = arr.indexOf(elt);
    }
    return arr;
  }
  static popArr(arr) {
    return arr.splice(arr.length-1,1)[0];
  }
  static deepFreezeObj(object) {
    
    if (deepFreezePath.includes(object)) {
      console.warn("Attempting to deep freeze circular object refrence");
      return;
    }
    
    deepFreezePath.push(object);
    
    for (var property in object) {
      var value = object[property];
      if (value && typeof(value) == "object")
        Utils.deepFreezeObj(value);
    }
    
    
    Utils.popArr(deepFreezePath);
    
    return Object.freeze(object);
  }
}

export {Utils};