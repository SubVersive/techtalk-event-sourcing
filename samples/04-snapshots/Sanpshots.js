class ShoppingCart {
  constructor(id) {
    this.map = {

    };
  }

  get(id) {
    return this.map[id];
  }

  set(id, cursor, value) {

  }
};

module.exports = ShoppingCart;