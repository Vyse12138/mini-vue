import { watchEffect, track, trigger, reactive, ref, computed } from './reactive.js'
import { h, mount, patch} from './render.js'


function createApp(component, container) {

}


// render
const vdom = h("div", { id: "asd" }, [h("span", { class: "aa" }, "hello")]);

mount(vdom, document.getElementById("app"));

const vdom2 = h("div", { id: "qqq" }, [h("h1", { class: "acca" }, "changed")]);

patch(vdom, vdom2);


// reactive

let a = ref([1, 2, 3]);
console.log(a);
// test code
let product = reactive({ price: 5, quantity: 2 });
let salePrice = computed(() => {
  return product.price * 0.9;
});
let total = computed(() => {
  return salePrice.value * product.quantity;
});

watchEffect(() => console.log('total:', total.value))
product.price = 10;

product.quantity = 3;


let m = new Map()

m.set(1,24)
m.set(12,24)
m.set(13,24)


let p =  new Proxy(m,{

  get(target, property, receiver) {
    console.log(target);
    return 20;
  },
  set(target, property, value, receiver) {
    console.log(value);
  }
})

console.log(p)
console.log(m)
