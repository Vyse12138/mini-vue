
// 为每一个响应式对象保存其对应 dependencies 的 WeakMap 
const targetMap = new WeakMap();

// 用于将某一对象上的一个属性加入保存响应式对象的 targetMap 中
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

// 用于触发 targetMap 中指定对象上指定属性的更新
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
    })
  }
}

// 将对象封装成响应式 Proxy 的函数
function reactive(target) {
  // Proxy 的 handler 对象
  const handler = {
    // 拦截 get 方法
    get(target, key, receiver) {
      let result = Reflect.get(target, key, receiver);
      // 在 get 时调用 track
      track(target, key);
      return result;
    },
    set(target, key, value, receiver) {
      let result = Reflect.set(target, key, value, receiver);
      let oldValue = target[key];
      // 在 set 时，若值改变了，调用 trigger 方法
      if (oldValue != result) {
        trigger(target, key);
      }
      return result;
    }
  }
  // 返回封装后的 Proxy
  return new Proxy(target, handler);
}


// test code
let product = reactive({
  price: 5,
  quantity: 2
});
let total = 0;
let effect = () => {
  total = product.price * product.quantity;
}
effect()
console.log(total)

product.quantity = 22
console.log(total)
