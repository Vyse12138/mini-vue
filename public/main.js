import{ effect, track, trigger, reactive, ref, computed } from './reactive.js'



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


console.log(total.value);

product.price = 10;
console.log(total.value);

product.quantity = 3;
console.log(total.value);
