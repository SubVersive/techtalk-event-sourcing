const ShoppingCart = require('./ShoppingCart');

const snapshots = [
  // { aggregate: 1, version:  }
]

const events = [
  { aggregate: 1, order: 1, type: 'item-added', payload: { name: 'teapot', price: 10 } },
  { aggregate: 1, order: 2, type: 'item-added', payload: { name: 'keyboard', price: 100 } },
  { aggregate: 1, order: 3, type: 'item-removed', payload: { name: 'teapot' } },
  { aggregate: 1, order: 4, type: 'item-added', payload: { name: 'milk', price: 1 } },
];

const serialize = cart => {
  const copy = { ...cart };
  delete copy.$newEvents;
  return copy;
}

const createSnapshot = (cart) => {
  const exisiting = snapshots.find(s => s.aggregate === cart.id);
  if (!exisiting) {
    snapshots.push({ aggregate: cart.id, version: cart.checkpoint, payload: serialize(cart) })
  } else {
    exisiting.payload = serialize(cart);
    exisiting.version = cart.checkpoint;
  }
}

const addItem = (id, item) => {
  const shoppingCart = loadCart(id);
  shoppingCart.addItem(item);
  saveCart(shoppingCart);
}

const loadCart = (id) => {
  const snapshot = snapshots.find(s => s.aggregate === id);
  console.log({
    snapshot
  })
  if (!snapshot) {
    const shoppingCart = new ShoppingCart(id);
    const existing = events
      .filter(item => item.aggregate === id)
      .sort((a, b) => a.order - b.order);
    existing.forEach(event => shoppingCart.apply(event));
    return shoppingCart;
  }

  const shoppingCart = ShoppingCart.fromSnapshot(snapshot);

  console.log({
    from: shoppingCart
  })

  const existing = events
    .filter(item => item.aggregate === id)
    .filter(item => item.order > shoppingCart.shanpshot)
    .sort((a, b) => a.order - b.order);
  existing.forEach(event => shoppingCart.apply(event));
  return shoppingCart;
};

const saveCart = (cart) => {
  cart.$newEvents.forEach(event => events.push({
    aggregate: cart.id,
    ...event,
  }));

  if(cart.checkpoint - cart.snapshot >= 5) {
    createSnapshot(cart);
  }
}

console.log({
  cart: loadCart(1),
})

addItem(1, { name: 'beer', price: 2 });
addItem(1, { name: 'beer', price: 2 });

console.log({
  cart: loadCart(1),
})

// addItem(1, { name: 'cola', price: 2 });

// console.log(JSON.stringify(events, null, 2));
