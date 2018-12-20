class ShoppingCart {
  constructor(id) {
    this.id = id;
    this.items = [];
    // techinceal
    this.checkpoint = 0;
    this.$newEvents = [];
  }

  apply(event) {
    this.checkpoint = event.order;
    switch(event.type) {
      case 'item-added':
        this.items.push(event.payload);
        break;
      case 'item-removed':
        const index = this.items.indexOf(event.payload.name);
        this.items = this.items.splice(index);
        break;
      case 'checkout': 
        this.payment = event.payload.card;
        this.shipment = event.payload.address;
        break;
    }
  }

  // some getters
  getTotal() {
    return this.items.reduce((prev, cur) => prev + cur.price, 0);
  }

  // some setters
  addItem(item) {
    const newEvent = {
      type: 'item-added',
      payload: { name: item.name, price: item.price },
    };
    this.record(newEvent);
  }

  record(event) {
    this.checkpoint++;
    event.order = this.checkpoint;
    this.apply(event);
    this.$newEvents.push(event);
  }
};

module.exports = ShoppingCart;