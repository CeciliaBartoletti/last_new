// import dayjs from 'dayjs';

function Game(id_game, id_user, score ) {
  this.id_game  = id_game;
  this.id_user = id_user;
  this.score = score;
  this.date = new Date();
}

function Round(id_round, id_game, id_meme, text, score) {
  this.id_round= id_round;
  this.id_game = id_game;
  this.id_meme = id_meme;
  this.text = text;
  this.score = score;
  this.date = new Date();
}

export { Game, Round };