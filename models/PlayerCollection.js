module.exports = class PlayerCollection extends Array {
  send(action, data){
    this.forEach(p => {
      p.send(action, typeof data === "function" ? data(p) : data);
    })
  }
}