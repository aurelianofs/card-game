'use strict';

module.exports = class GameManager {
  players;
  deck;
  startingHandCount;
  endCondition;
  phases;

  filters = {};
  actions = {};

  constructor(players, deck, startingHandCount, endCondition, phases) {
    this.players = players;
    this.deck = deck;
    this.startingHandCount = startingHandCount;
    this.endCondition = endCondition;
    this.phases = phases;
  }

  start() {
    this.deck = this.deck.shuffle();

    this.deal();

    this.runPhase({
      phase: this.phases[0],
      player: this.players[0]
    });
  }

  deal(){
    for(let i = 0; i < this.startingHandCount; i ++){
      this.players.forEach(p => {
        p.hand.push(this.deck.shift());
      });
    }
  }

  runPhase({phase, player}){
    this.action('begin_phase', {phase, player})

    phase.run(this, player);

    this.action('end_phase', {phase, player})

    if(!this.endCondition()){
      const currPhaseIdx = this.phases.indexOf(phase);
      const nextPhaseIdx = currPhaseIdx + 1 !== this.phases.length ?
        currPhaseIdx + 1 : 0;

      const currPlayerIdx = this.players.indexOf(player);
      const nextPlayerIdx = nextPhaseIdx ? currPlayerIdx :
        currPlayerIdx + 1 !== this.players.length ?
        currPlayerIdx + 1 : 0;

      this.runPhase(
        this.filter('phase', {
          phase: this.phases[nextPhaseIdx],
          player: this.players[nextPlayerIdx]
        })
      );
    }
  }

  // FILTERS
  filter(name, params){
    if(this.filters[name]){
      this.filters[name].forEach(f => {
        params = f.transform(params, this);
      })
    }

    return params;
  }

  addFilter(name, filter) {
    if(!this.filters[name])
      this.filters[name] = [];

    this.filters[name].push(filter);
    this.filters[name].sort((a, b) => {
      return a.priority - b.priority;
    });
  }

  removeFilter(name, filter) {
    const idx = this.filters[name].indexOf(filter);
    if(idx !== -1) this.filters[name].splice(idx, 1);
  }

  // ACTIONS
  action(name, params) {
    if(this.actions[name]){
      this.actions[name].forEach(a => {
        a.run(params, this);
      })
    }
  }

  addAction(name, action) {
    if(!this.actions[name])
      this.actions[name] = [];

    this.actions[name].push(action);
    this.actions[name].sort((a, b) => {
      return a.priority - b.priority;
    });
  }

  removeFilter(name, action) {
    const idx = this.actions[name].indexOf(action);
    if(idx !== -1) this.actions[name].splice(idx, 1);
  }

}
