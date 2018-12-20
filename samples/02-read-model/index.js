const events = [
  { aggregate: 1, order: 1, type: 'item-added', payload: { name: 'teapot', price: 10 } },
  { aggregate: 1, order: 2, type: 'item-added', payload: { name: 'keyboard', price: 100 } },
  { aggregate: 1, order: 3, type: 'item-removed', payload: { name: 'teapot' } },
  { aggregate: 1, order: 4, type: 'item-added', payload: { name: 'milk', price: 1 } },
  { aggregate: 1, order: 5, type: 'checkout', payload: { card: 'VISA', address: 'Munich' } },
  { aggregate: 2, order: 1, type: 'item-added', payload: { name: 'watches', price: 1000 } },
  { aggregate: 2, order: 2, type: 'checkout', payload: { card: 'VISA', address: 'London' } },
  { aggregate: 3, order: 1, type: 'item-added', payload: { name: 'keyboard', price: 100 } },
  { aggregate: 4, order: 1, type: 'item-added', payload: { name: 'teapot', price: 1 } },
  { aggregate: 3, order: 2, type: 'item-added', payload: { name: 'auto', price: 10000 } },
  { aggregate: 4, order: 2, type: 'checkout', payload: { card: 'VISA', address: 'Munich' } },
];

const getItems = (from) => events.slice(from, from + 5);

const newTeapotsDb = () => ({
  cursor: 0,
  data: { count: 0 },
  name: 'teapots-count',
});
const teapots = (state, event) => {
  if (event.type !== 'item-added') {
    return state;
  }

  if (event.payload.name === 'teapot') {
    state.count++;
  }
  return state;
};

const processNextBatch = (state) => {
  const items = getItems(state.cursor);
  if (!items.length) {
    return state;
  }

  items.forEach(item => teapots(state.data, item));
  state.cursor += items.length;
  return processNextBatch(state);
}

const rebuildCities = () => {
  const db = newTeapotsDb();
  return processNextBatch(db);
}

console.log(rebuildCities());
