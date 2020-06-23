module.exports = class CardCollection extends Array {
  shuffle() {
    const Species = this.constructor[Symbol.species];
    const result = new Species();

    while(this.length) {
      result.push(this.splice(Math.floor(Math.random() * this.length),1)[0]);
    }

    return result;
  }

}