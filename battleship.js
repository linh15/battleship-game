let view = {
  displayMessage: function(msg) {
    document.getElementById('messageArea').innerHTML = msg;
  },
  displayHit: function(location) {
    document.getElementById(location).setAttribute('class','hit');
  },
  displayMiss: function(location) {
    document.getElementById(location).setAttribute('class','miss');
  }
};

// view.displayHit("b5");
// view.displayMiss("b2");
// view.displayMessage("You hit me!");

let model = {
  boardSize: 7,
  numShips: 3,
  shipLength: 3,
  shipsSunk: 0,
  ships: [{locations: [0, 0, 0], hits: ["", "", ""], gotHit: [false, false, false]},
          {locations: [0, 0, 0], hits: ["", "", ""], gotHit: [false, false, false]},
          {locations: [0, 0, 0], hits: ["", "", ""], gotHit: [false, false, false]}],
  fire: function(guess) {
    for (let i = 0; i < this.numShips; i++) {
      let ship = this.ships[i];
      let index = ship.locations.indexOf(guess);

      if (ship.gotHit[index] == false && index >= 0) {
        ship.hits[index] = "hit";
        ship.gotHit[index] = true;
        view.displayHit(guess);
        view.displayMessage("HIT!");
        if (this.isSunk(ship)) {
          view.displayMessage("You sank my batttleship!!!");
          this.shipsSunk++;
        }
        return true;

      } else if (ship.gotHit[index] == true && index >= 0) {
        view.displayMessage("You already guessed this spot, please try again!");
        return false;
      }

    }
    view.displayMiss(guess);
    view.displayMessage("You missed!");
    return false;
  },
  isSunk: function(ship) {
    for (let i = 0; i < this.shipLength; i++) {
      if (ship.hits[i] !== "hit") {
        return false;
      }
    }
    return true;
  },
  generateShipLocations: function() {
    let newLocs;
    for (i = 0; i < this.numShips; i++) {
      do {
        newLocs = this.generateShip();
      } while (this.collision(newLocs)) {
        this.ships[i].locations = newLocs;
      }
    }
  },
  generateShip: function() {
    let direction = Math.floor(Math.random() * 2);
    let row, col;
    if (direction == 1) {
      row = Math.floor(Math.random() * this.boardSize);
      col = Math.floor(Math.random() * (this.boardSize - this.shipLength));
    } else {
      col = Math.floor(Math.random() * this.boardSize);
      row = Math.floor(Math.random() * (this.boardSize - this.shipLength));
    }
    let newShipLocations = [];
    for (let i = 0; i < this.shipLength; i++) {
      if (direction == 1) {
        newShipLocations.push(row + "" + (col + i));
      } else {
        newShipLocations.push((row + i) + "" + col);
      }
    }
    return newShipLocations;
  },
  collision: function(newLocs) {
    for (let i = 0; i < this.numShips; i++) {
      let ship = model.ships[i];
      for (var j = 0; j < newLocs.length; j++) {
        if (ship.locations.indexOf(newLocs[j]) >= 0) {
          return true;
        }
      }
    }
    return false;
  }
};

// model.fire("53");
// model.fire("06");
// model.fire("16");
// model.fire("53");
// model.fire("26");

let controller = {
  guesses: 0,
  processGuess: function(guess) {
    let location = parseGuess(guess);
    if (location) {
      this.guesses++;
      let hit = model.fire(location);
      if (hit && model.shipsSunk == model.numShips) {
        view.displayMessage("You sank all my battleships, in " + this.guesses + " guesses!")
      }
    }
  }
}

// controller.processGuess("A0");
// controller.processGuess("A6");
// controller.processGuess("B6");
// controller.processGuess("C6");
// controller.processGuess("C4");
// controller.processGuess("D4");
// controller.processGuess("E4");
// controller.processGuess("B0");
// controller.processGuess("B1");
// controller.processGuess("B2");

function parseGuess(guess) {
  let alphabet = ["A", "B", "C", "D", "E", "F", "G"];

  if (guess == null || guess.length !== 2) {
    alert("Oops, please enter a letter and a number on the board.");
  } else {
    let firstChar = guess.charAt(0);
    let row = alphabet.indexOf(firstChar);
    let column = guess.charAt(1);

    if (isNaN(row) || isNaN(column)) {
      alert("Oops, that isn't on the board.")
    } else if (row < 0 || row >= model.boardSize || column < 0 || column >= model.boardSize) {
      alert("Oops, that's off the board.")
    } else {
      return row + column;
    }
  }
  return null; // any check for valid input fails, return null
}

// console.log(parseGuess("c2")); // can't handle lowercase yet, return Oops, that's off the board.
// console.log(parseGuess("A7"));

function init() {
  let fireButton = document.getElementById("fireButton");
  fireButton.onclick = handleFireButton;
  let guessInput = document.getElementById("guessInput");
  guessInput.onkeypress = handleKeyPress;
  model.generateShipLocations();
}

function handleKeyPress(e) {
  let fireButton = document.getElementById("fireButton");
  if (e.keyCode === 13) {
    fireButton.click();
    return false;
  }
}

function handleFireButton() {
  let guessInput = document.getElementById("guessInput");
  let guess = guessInput.value;
  controller.processGuess(guess);
  guessInput.value = "";
}

window.onload = init;
