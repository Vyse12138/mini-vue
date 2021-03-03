
// 为每一个响应式对象保存其对应 dependencies 的 WeakMap 
const targetMap = new WeakMap();

function track(target, key) {
  // 取得目标对象的 depsMap，即保存其 dependencies 的 Map
  let depsMap = targetMap.get(target);
  // 若目标对象的 depsMap 不存在，新建一个空 Map
  if (!depsMap) {
    targetMap.set(target, depsMap = new Map());
  }
  // 通过 key 取得 depsMap 中的一个 dep，即目标对象的 dependency
  let dep = depsMap.get(key);
  // 若 depsMap 中不包含该 dep，新建一个表示 dep 的 Set
  if (!dep) {
    depsMap.set(key, dep = new Set());
  }
  // 在该 dep Set 中添加 effect，因为是 Set，重复添加没有用
  dep.add(effect);
}

function trigger(target, key) {
  // 取得目标对象的 depsMap，即保存其 dependencies 的 Map
  let depsMap = targetMap.get(target);
  // 若目标对象的 depsMap 不存在，便直接返回
  if (!depsMap) {
    return;
  }
  // 通过 key 取得 depsMap 中的一个 dep，即目标对象的 dependency
  let dep = depsMap.get(key);
  // 若 depsMap 中包含该 dep，执行 dep 中的每一个 effect
  if (dep) {
    dep.forEach(effect => {
      effect();
    });
  }
}


// test code
let product = {
  price: 5,
  quantity: 2
}
let total = 0;
let effect = () => {
  total = product.price * product.quantity;
}
effect()
track(product,'quantity')

console.log(total)

product.quantity = 22
trigger(product,'quantity')
console.log(total)