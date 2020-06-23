module.exports = class Phase {
  name;

  constructor(name, run) {
    this.name = name;
    this.run = run;
  }

  run(game){}
}