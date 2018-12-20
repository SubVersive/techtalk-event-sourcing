const ShoppingCart = require('./ShoppingCart');

const events = [
  { aggregate: 1, order: 1, type: 'item-added', payload: { name: 'teapot', price: 10 } },
  { aggregate: 1, order: 2, type: 'item-added', payload: { name: 'keyboard', price: 100 } },
  { aggregate: 1, order: 3, type: 'item-removed', payload: { name: 'teapot' } },
  { aggregate: 1, order: 4, type: 'item-added', payload: { name: 'milk', price: 1 } },
  { aggregate: 1, order: 5, type: 'checkout', payload: { card: 'VISA', address: 'Munich' } },
];

const addItem = (id, item) => {
  const shoppingCart = loadCart(id);
  shoppingCart.addItem(item);
  saveCart(shoppingCart);
}

const loadCart = (id) => {
  const existing = events
    .filter(item => item.aggregate === id)
    .sort((a, b) => a.order - b.order);
  const shoppingCart = new ShoppingCart(id);
  existing.forEach(event => shoppingCart.apply(event));
  return shoppingCart;
};

const saveCart = (cart) => {
  cart.$newEvents.forEach(event => events.push({
    aggregate: cart.id,
    ...event,
  }));
}

addItem(1, { name: 'beer', price: 2 });
addItem(1, { name: 'cola', price: 2 });

console.log(JSON.stringify(events, null, 2));
