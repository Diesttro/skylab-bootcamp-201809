var card = [];
var numbers = [];
var matches = [0, 0, 0];

bingo();

function bingo() {
  fillCard(3, 5);

  numbers = [];

  console.log(card);

  newTurn(card, matches);

  console.log("Has cantado bingo en " + numbers.length + " turnos");
}

function fillCard(rows, columns) {
  for(var i = 0; i < rows; i++) {
    var row = [];

    for(var j = 0; j < columns; j++) {
      row.push(getUniqueNumber());
    }

    card.push(row);
  }
}

function getNumber() {
  return Math.floor(Math.random() * (91 - 1) + 1);
}

function getUniqueNumber() {
  var number = getNumber();

  while(numbers.indexOf(number) > -1) {
    number = getNumber();
  }

  numbers.push(number);

  return number;
}

function newTurn(card) {
  var play = confirm("¿Quieres seguir jugando?");

  if(play) {
    var newCard = JSON.parse(JSON.stringify(card));
    var number = getUniqueNumber();

    console.log("Ha salido el numero " + number);

    var allMatches = checkNumber(newCard, number);

    console.log(newCard);

    if(allMatches == 15) {
      console.log("¡Bingo!");
      return;
    }

    newTurn(newCard);
  } else {
    return;
  }
}

function checkNumber(card, number) {
  var allMatches = 0;

  for(var i = 0; i < card.length; i++) {
    for(var j = 0; j < card[i].length; j++) {
      if(card[i][j] == number) {
        card[i][j] = "x";
        matches[i]++;

        if(matches[i] == 5) {
          console.log("¡Linea!");
        }
      }
    }

    allMatches += matches[i];
  }

  return allMatches;
}