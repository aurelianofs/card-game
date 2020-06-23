'use strict';

const {
  Card,
  CardCollection,
  GameManager,
  Player,
  PlayerCollection,
  Phase
} = require('./models');

class CardPlayer extends Player {
  hand = new CardCollection();
}

const players = new PlayerCollection(
  new CardPlayer(),
  new CardPlayer()
);

const mainDeck = new CardCollection(
  new Card('First'),
  new Card('Second'),
  ...new CardCollection(20).fill(new Card('Neigh'))
);

const endCondition = function(){
  console.log(this);
  return !this.deck.length;
}

const startDealAmount = 5;

const phases = [
  new Phase('BEGINNING', () => {}),
  new Phase('DRAW', (game, player) => {
    player.hand.push(game.deck.shift());
  }),
  new Phase('ACTION', () => {}),
  new Phase('END', () => {})
];

const gameManager = new GameManager(
  players,
  mainDeck,
  startDealAmount,
  endCondition,
  phases
);

gameManager.start();