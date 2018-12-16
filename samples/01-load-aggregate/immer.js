const { produce } = require('immer');

const events = [
  { aggregate: 1, order: 1, type: 'item-added', payload: { name: 'teapot', price: 10 } },
  { aggregate: 1, order: 2, type: 'item-added', payload: { name: 'keyboard', price: 100 } },
  { aggregate: 1, order: 3, type: 'item-removed', payload: { name: 'teapot' } },
  { aggregate: 1, order: 4, type: 'item-added', payload: { name: 'milk', price: 1 } },
  { aggregate: 1, order: 5, type: 'checkout', payload: { card: 'VISA', address: 'Munich' } },
];

const getShoppingCart = id => (
  events
    .filter(item => item.aggregate === id)
    .sort((a, b) => a.order - b.order)
    .reduce(shoppingCartReducer, { id }));

const shoppingCartReducer = (state, action) => (
  produce(state, draft => {
    switch(action.type) {
      case 'item-added':
        draft.items = [...(draft.items || []), action.payload];
        return;
      case 'item-removed': 
        const index = draft.items.indexOf(action.payload.name);
        draft.items = draft.items.splice(index);
        return;
      case 'checkout': 
        draft.payment = action.payload.card;
        draft.shipment = action.payload.address;
        return;
    }
  }));

const shoppingCart = getShoppingCart(1);
console.log(JSON.stringify(shoppingCart, null, 2));