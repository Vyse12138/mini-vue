const targetMap = new WeakMap(); // 为每一个响应式对象保存其对应 dependencies 的 WeakMap 
let activeEffect = null; // 当前运行的 effect

// 用于将某一对象上的一个属性加入保存响应式对象的 targetMap 中
function track(target, key) {
  if (activeEffect) {
    let depsMap = targetMap.get(target); // 取得目标对象的 depsMap，即保存其 dependencies 的 Map
    if (!depsMap) { // 若目标对象的 depsMap 不存在，新建一个空 Map
      targetMap.set(target, depsMap = new Map());
    }
    let dep = depsMap.get(key); // 通过 key 取得 depsMap 中的一个 dep，即目标对象的 dependency
    if (!dep) { // 若 depsMap 中不包含该 dep，新建一个表示 dep 的 Set
      depsMap.set(key, dep = new Set());
    }
    dep.add(activeEffect); // 在该 dep Set 中添加当前 activeEffect，因为是 Set，重复添加没有用
  }
}

// 用于触发 targetMap 中指定对象上指定属性的更新
function trigger(target, key) {
  let depsMap = targetMap.get(target); // 取得目标对象的 depsMap，即保存其 dependencies 的 Map
  if (!depsMap) { // 若目标对象的 depsMap 不存在，便直接返回
    return;
  }
  let dep = depsMap.get(key); // 通过 key 取得 depsMap 中的一个 dep，即目标对象的 dependency
  if (dep) { // 若 depsMap 中包含该 dep，执行 dep 中的每一个 effect
    dep.forEach(effect => {
      effect();
    })
  }
}

// 将对象封装成响应式 Proxy 的函数
function reactive(target) {
  const handler = { // Proxy 的 handler 对象
    get(target, key, receiver) { // 拦截 get 方法
      let result = Reflect.get(target, key, receiver);
      track(target, key); // 在 get 时调用 track
      return result;
    },
    set(target, key, value, receiver) {
      let result = Reflect.set(target, key, value, receiver);
      let oldValue = target[key];
      if (oldValue != result) { // 在 set 时，若值改变了，调用 trigger 方法
        trigger(target, key);
      }
      return result;
    }
  }
  return new Proxy(target, handler); // 返回封装后的 Proxy
}

// ref 函数，将基本值转换为响应式对象
function ref(raw) {
  const r = {
    get value() {
      track(r, 'value');
      return raw;
    },
    set value(newVal) {
      raw = newVal;
      trigger(r, 'value');
    }
  }
  return r;
}

// 使只有在调用 effect 时，才会触发 track 
function effect(eff) {
  activeEffect = eff;
  activeEffect();
  activeEffect = null;
}

// test code
let product = reactive({ price: 5, quantity: 2 })
let salePrice = ref(0)
let total = 0

effect(() => {
  salePrice.value = product.price * 0.9
})

effect(() => {
  total = salePrice.value * product.quantity
})
console.log(targetMap)

console.log(total)

product.price = 10
console.log(total)

product.quantity = 3
console.log(total)
