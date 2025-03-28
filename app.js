const buttonDiv = document.querySelector(".buttons");
const playerProgress = document.querySelector(".playerProgress");
const selectDiv = document.querySelector(".select");
const formDiv = document.querySelector(".formDiv");
const dieDiv = document.querySelector(".dieDiv");
const dice1 = document.getElementById("dice-1");
const dice2 = document.getElementById("dice-2");

const dieFaceArr = [
  '<rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><path d="M12 12h.01"/>',
  '<rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><path d="M15 9h.01"/><path d="M9 15h.01"/>',
  '<rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><path d="M16 8h.01"/><path d="M12 12h.01"/><path d="M8 16h.01"/>',
  '<rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><path d="M16 8h.01"/><path d="M8 8h.01"/><path d="M8 16h.01"/><path d="M16 16h.01"/>',
  '<rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><path d="M16 8h.01"/><path d="M8 8h.01"/><path d="M8 16h.01"/><path d="M16 16h.01"/><path d="M12 12h.01"/>',
  '<rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><path d="M16 8h.01"/><path d="M16 12h.01"/><path d="M16 16h.01"/><path d="M8 8h.01"/><path d="M8 12h.01"/><path d="M8 16h.01"/>',
];
const ludoBoard = document.querySelector(".playGround");
let isGameOver = false;
const winners = [];
formDiv.classList.add("input_div", "select", "is-rounded", "is-normal");
formDiv.innerHTML = `<form action="/playNo" class="playNoForm">
<select name = "" id = "" >
<option value="two_2">Two</option>
<option value="four_4">Four</option>
</select>
<button type="submit"> SUBMIT</button>
</form>`;
const PlayNoForm = document.querySelector(`.formDiv form`);

PlayNoForm.addEventListener("submit", (e) => {
  gameInitiator(e);
});
function gameInitiator(e) {
  e.preventDefault();
  while (ludoBoard.children[0]) {
    ludoBoard.children[0].remove();
  }
  playerNo = parseInt(document.querySelector("select").value.slice(-1));
  const colorList = ["red", "green", "yellow", "blue"];
  const ludoSections = [
    {
      color: "red",
      normal: [126, 125, 124, 123, 122, 121, 106, 91, 92, 93, 94, 95, 96],
      finishing: [107, 108, 109, 110, 111, 112],
      startings: [49, 33, 48, 34],
    },
    {
      color: "green",
      normal: [82, 67, 52, 37, 22, 7, 8, 9, 24, 39, 54, 69, 84],
      finishing: [23, 38, 53, 68, 83, 98],
      startings: [57, 43, 42, 58],
    },
    {
      color: "yellow",
      normal: [100, 101, 102, 103, 104, 105, 120, 135, 134, 133, 132, 131, 130],
      finishing: [119, 118, 117, 116, 115, 114],
      startings: [177, 193, 178, 192],
    },
    {
      color: "blue",
      normal: [144, 159, 174, 189, 204, 219, 218, 217, 202, 187, 172, 157, 142],
      finishing: [203, 188, 173, 158, 143, 128],
      startings: [169, 183, 184, 168],
    },
  ];
  sectionBoxes = function () {
    return [...this.normal, ...this.finishing];
  };
  runPathWay = function () {
    idx = colorList.indexOf(this.color);
    runWay = [...this.normal.slice(8)];
    for (i = idx + 1; i <= idx + 3; i++) {
      innerIdx = i % 4;
      iPath = ludoBoxes[colorList[innerIdx]].normal;
      runWay = [...runWay, ...iPath];
    }
    runWay = [...runWay, ...this.normal.slice(0, 7), ...this.finishing];
    return {
      runWay,
      seedsRealPosition: [
        [this.startings[0], ...runWay][this.seedRelativePosition[0]],
        [this.startings[1], ...runWay][this.seedRelativePosition[1]],
        [this.startings[2], ...runWay][this.seedRelativePosition[2]],
        [this.startings[3], ...runWay][this.seedRelativePosition[3]],
      ],
    };
  };

  ludoBoxes = {};
  for (let i = 0; i <= 3; i++) {
    ludoBoxes[colorList[i]] = {
      ...ludoSections[i],
      // seedRelativePosition: [0, 0, 0, 0],
      seedRelativePosition: [1, 0, 0, 25],
      sectionBoxes,
      runPathWay,
    };
  }
  playersList = {};
  for (let i = 1; i <= playerNo; i++) {
    playersList[`player_${i}`] = createPlayerInfo(colorList, playerNo, i);
  }
  playerButton = document.createElement("button");
  playerButton.append(`Player 1`);
  playerButton.classList.add(
    `player_1_button`,
    "button",
    "is-responsive",
    "is-large"
  );
  buttonDiv.append(playerButton);
  for (let i = 1; i <= playerNo; i++) {
    playerDiv = document.createElement("div");
    playerText = document.createElement("p");
    playerDivColor = document.createElement("div");
    playerText.innerText = `Player ${i}`;
    playerDiv.append(playerText);
    for (c of playersList[`player_${i}`].colorInfo) {
      playerDivvColor = document.createElement("div");
      playerDivvColor.classList.add(`${c.color}-out`);
      playerDivColorOut = document.createElement("div");
      pText = document.createElement("p");
      pText.innerText = `${c.color}`.toUpperCase();
      playerDivvColor.append(pText);
      for (let j = 0; j < 4; j++) {
        playerDivColorOutSeed = document.createElement("div");
        playerDivColorOutSeed.classList.add(`${c.color}_seedOut_${j + 1}`);
        playerDivColorOut.append(playerDivColorOutSeed);
      }
      playerDivvColor.append(playerDivColorOut);
      playerDivColor.append(playerDivvColor);
    }
    playerDiv.append(playerDivColor);
    playerProgress.append(playerDiv);
  }
  seedsAndPositions = [];
  for (let i = 0; i < 4; i++) {
    seedsAndPositions.push([
      ludoBoxes[colorList[i]].color,
      ludoBoxes[colorList[i]].runPathWay().seedsRealPosition,
    ]);
  }
  wayBoxes = [
    ...ludoBoxes.red.sectionBoxes(),
    ...ludoBoxes.green.sectionBoxes(),
    ...ludoBoxes.yellow.sectionBoxes(),
    ...ludoBoxes.blue.sectionBoxes(),
  ];
  for (c of colorList) {
    wayBoxes = [
      ...wayBoxes,
      ...ludoBoxes[c].sectionBoxes(),
      ...ludoBoxes[c].startings,
    ];
  }
  for (let i = 1; i <= 225; i++) {
    const ludoBox = document.createElement("div");
    const ludoSeed = document.createElement("div");
    if (
      wayBoxes.some((wayBox) => {
        return i === wayBox;
      })
    ) {
      for (seedAndPositions of seedsAndPositions) {
        for (let j = 0; j <= seedAndPositions[1].length; j++) {
          if (seedAndPositions[1][j] === i) {
            ludoSeed.classList.add(
              `${seedAndPositions[0]}`,
              `${seedAndPositions[0]}_${j + 1}`
            );
            ludoBox.classList.add(`square_${i}`);
            ludoBox.append(ludoSeed);
          } else {
            ludoBox.classList.add(`square_${i}`);
          }
        }
      }
    }
    ludoBoard.append(ludoBox);
  }
  playerButton.addEventListener("click", playGame);
  document.querySelector(".playNoForm").remove();
  isGameOver = false;
}
function createPlayerInfo(colorList, playerNo, num) {
  const colorInfo = [];
  if (playerNo === 4) {
    colorInfo.push(ludoBoxes[colorList[num - 1]]);
  } else {
    colorInfo.push(
      ludoBoxes[colorList[num - 1]],
      ludoBoxes[colorList[num + 1]]
    );
  }
  return {
    player: `player_${num}`,
    button: document.querySelector(`.player_${num}`),
    score: 0,
    colorInfo,
  };
}
function playGame() {
  player = playersList[playerButton.classList[0].slice(0, 8)];
  playerButton.remove();
  if (!isGameOver) {
    dieOutCome = rolldie();
    // dieOutCome = [5,5]

    rollDice(dieOutCome, player);
  }
}
function decisionFilter(player, count, lowNumDie, highNumDie) {
  //   console.log({ count });
  if (count > 1) return nextPlayer(player, lowNumDie);
  let die = count === 0 ? highNumDie : lowNumDie;
  let inSeedArray = player.colorInfo
    .flatMap((c) => c.seedRelativePosition)
    .filter((s) => s === 0);
  let outSeedArray = player.colorInfo
    .flatMap((c) => c.seedRelativePosition)
    .filter((s) => s !== 0 && s < 57);

  if (die === 6) {
    inSeedArray.length && outSeedArray.length
      ? makeChoices(player, count, lowNumDie, highNumDie, die)
      : inSeedArray.length
      ? newSeedOut(player, count, lowNumDie, highNumDie)
      : outSeedArray.length
      ? moveSeeds(player, count, lowNumDie, highNumDie, die)
      : nextPlayer(player, lowNumDie);
  } else {
    outSeedArray.length
      ? moveSeeds(player, count, lowNumDie, highNumDie, die)
      : nextPlayer(player, lowNumDie);
  }
}
// function newSeedOut(player, count, lowNumDie, highNumDie) {
//     let selectableSeeds = [];

//     // Find all seeds that are still inside and can be moved out
//     for (let c of player.colorInfo) {
//         let seedIdx = c.seedRelativePosition.indexOf(0);
//         if (seedIdx !== -1) {
//             selectableSeeds.push({ color: c.color, index: seedIdx });
//         }
//     }

//     if (selectableSeeds.length === 1) {
//         // If only one seed can be moved, move it immediately
//         moveSeedOut(player, selectableSeeds[0].color, selectableSeeds[0].index);
//         count += 1;
//         decisionFilter(player, count, lowNumDie, highNumDie);
//     } else if (selectableSeeds.length > 1) {
//         // If multiple seeds are available, allow the player to click one
//         selectableSeeds.forEach(seed => {
//             const seedElement = document.querySelector(`.${seed.color}_${seed.index + 1}`);
//             seedElement.classList.add("selectable"); // Optional: highlight selectable seeds

//             seedElement.addEventListener("click", function handleClick() {
//                 moveSeedOut(player, seed.color, seed.index);
//                 seedElement.classList.remove("selectable"); // Remove highlight
//                 seedElement.removeEventListener("click", handleClick);

//                 count += 1;
//                 decisionFilter(player, count, lowNumDie, highNumDie);
//             }, { once: true });
//         });
//     } else {
//         nextPlayer(player, lowNumDie);
//     }
// }

// // Moves a seed from the base to the starting position
// function moveSeedOut(player, color, seedIdx) {
// document.querySelector(`.${color}_${seedIdx + 1}`).remove();
// let c = player.colorInfo.find(ci => ci.color === color);
// c.seedRelativePosition[seedIdx] = 1;

// let newLudoSeed = document.createElement("div");
// newLudoSeed.classList.add(`${color}`, `${color}_${seedIdx + 1}`, `${player.player}`);
// document.querySelector(`.square_${c.runPathWay().seedsRealPosition[seedIdx]}`).append(newLudoSeed);
// }

function newSeedOut(player, count, lowNumDie, highNumDie) {
  if (player.colorInfo.length > 1) {
    if (
      player.colorInfo[0].seedRelativePosition.some((p) => p === 0) &&
      player.colorInfo[1].seedRelativePosition.some((p) => p === 0)
    ) {
      inputDiv = document.createElement("div");
      inputDiv.classList.add("input_div", "select", "is-rounded", "is-normal");
      selectOption = `<select name="" id=""><option>Select an Option</option>`;
      for (c of player.colorInfo) {
        selectOption += `<option value="${c.color}">${c.color}</option>`;
      }
      selectOption += ` </select >`;
      inputDiv.innerHTML = selectOption;
      selectDiv.append(inputDiv);
      inputDiv.addEventListener(
        "input",
        function () {
          inputDiv.remove();
          for (c of player.colorInfo) {
            if (c.color === this.children[0].value) {
              seedIdx = c.seedRelativePosition.indexOf(0);
              document.querySelector(`.${c.color}_${seedIdx + 1}`).remove();
              c.seedRelativePosition[seedIdx] = 1;
              newLudoSeed = document.createElement("div");
              newLudoSeed.classList.add(
                `${c.color}`,
                `${c.color}_${seedIdx + 1}`,
                `${player.player}`
              );
              document
                .querySelector(
                  `.square_${c.runPathWay().seedsRealPosition[seedIdx]}`
                )
                .append(newLudoSeed);
            }
          }
          count += 1;
          decisionFilter(player, count, lowNumDie, highNumDie);
        },
        { once: true }
      );
    } else {
      if (player.colorInfo[0].seedRelativePosition.some((p) => p === 0)) {
        c = player.colorInfo[0];
      } else {
        c = player.colorInfo[1];
      }
      seedIdx = c.seedRelativePosition.indexOf(0);
      document.querySelector(`.${c.color}_${seedIdx + 1}`).remove();
      c.seedRelativePosition[seedIdx] = 1;
      newLudoSeed = document.createElement("div");
      newLudoSeed.classList.add(
        `${c.color}`,
        `${c.color}_${seedIdx + 1}`,
        `${player.player}`
      );
      document
        .querySelector(`.square_${c.runPathWay().seedsRealPosition[seedIdx]}`)
        .append(newLudoSeed);
      count += 1;
      decisionFilter(player, count, lowNumDie, highNumDie);
    }
  } else {
    c = player.colorInfo[0];
    seedIdx = c.seedRelativePosition.indexOf(0);
    document.querySelector(`.${c.color}_${seedIdx + 1}`).remove();
    c.seedRelativePosition[seedIdx] = 1;
    newLudoSeed = document.createElement("div");
    newLudoSeed.classList.add(
      `${c.color}`,
      `${c.color}_${seedIdx + 1}`,
      `${player.player}`
    );
    document
      .querySelector(`.square_${c.runPathWay().seedsRealPosition[seedIdx]}`)
      .append(newLudoSeed);
    count += 1;
    decisionFilter(player, count, lowNumDie, highNumDie);
  }
}
function moveSeeds(player, count, lowNumDie, highNumDie, die) {
  if (count > 1) return decisionFilter(player, count, lowNumDie, highNumDie);
  playerOutSeedArray = document.querySelectorAll(`.${player.player}`);
  seedRelativePositionArray = [];
  for (let i = 0; i < playerOutSeedArray.length; i++) {
    seedRelativePositionArray = [
      ...seedRelativePositionArray,
      [
        playerOutSeedArray[i].classList[0],
        parseInt(playerOutSeedArray[i].classList[1].slice(-1)),
        playerOutSeedArray[i].parentElement,
        ludoBoxes[playerOutSeedArray[i].classList[0]].seedRelativePosition[
          parseInt(playerOutSeedArray[i].classList[1].slice(-1)) - 1
        ],
      ],
    ];
  }
  movebleSeedArray = seedRelativePositionArray.filter((p) => p[3] + die < 58);
  if (movebleSeedArray.length) {
    for (let i = 0; i < movebleSeedArray.length; i++) {
      document
        .querySelector(`.${movebleSeedArray[i][0]}_${movebleSeedArray[i][1]}`)
        .addEventListener(
          "click",
          () => {
            p = movebleSeedArray[i];
            ludoBoxes[p[0]].seedRelativePosition[p[1] - 1] += die;
            for (let j = 0; j < movebleSeedArray.length; j++) {
              document
                .querySelector(
                  `.${movebleSeedArray[j][0]}_${movebleSeedArray[j][1]}`
                )
                .remove();
              newLudoSeed = document.createElement("div");
              newLudoSeed.classList.add(
                `${movebleSeedArray[j][0]}`,
                `${movebleSeedArray[j][0]}_${movebleSeedArray[j][1]}`,
                `${player.player}`
              );
              if (
                p[0] === movebleSeedArray[j][0] &&
                p[1] === movebleSeedArray[j][1]
              ) {
                document
                  .querySelector(
                    `.square_${
                      ludoBoxes[p[0]].runPathWay().seedsRealPosition[p[1] - 1]
                    }`
                  )
                  .append(newLudoSeed);
              } else {
                movebleSeedArray[j][2].append(newLudoSeed);
              }
            }
            count += 1;
            decisionFilter(player, count, lowNumDie, highNumDie);
          },
          { once: true }
        );
    }
  } else {
    count += 1;
    decisionFilter(player, count, lowNumDie, highNumDie);
  }
}
function makeChoices(player, count, lowNumDie, highNumDie, die) {
  if (count > 1) return decisionFilter(player, count, lowNumDie, highNumDie);

  inputDiv = document.createElement("div");
  inputDiv.classList.add("input_div", "select", "is-rounded", "is-normal");
  inputDiv.innerHTML = `<select name="" id="">
                            <option>Select an Option</option>
                            <option value="newSeedOut">Bring Out A Seed</option>
                            <option value="moveSeeds">Continue Moving Existing Seed</option>
                          </select>`;
  selectDiv.append(inputDiv);
  inputDiv.addEventListener("input", () => {
    if (this.children[0].value === "newSeedOut") {
      inputDiv.remove();
      newSeedOut(player, count, lowNumDie, highNumDie);
    } else {
      inputDiv.remove();
      moveSeeds(player, count, lowNumDie, highNumDie, die);
    }
  });
}
function getRandomNumber(e) {
  return Math.floor(Math.random() * e + 1);
}
function rolldie() {
  return [getRandomNumber(6), getRandomNumber(6)];
}
function rollDice(dieOutcome, player) {
  const lowNumDie = Math.min(...dieOutCome);
  const highNumDie = Math.max(...dieOutCome);
  let count = 0;
  dice1.classList.add("rolling");
  dice2.classList.add("rolling");
  let rolls = 10;
  let counter = 0;
  let interval = setInterval(() => {
    dice1.innerHTML = getDiceFace(getRandomNumber(6));
    dice2.innerHTML = getDiceFace(getRandomNumber(6));
    counter++;

    if (counter >= rolls) {
      clearInterval(interval);
      dice1.innerHTML = getDiceFace(dieOutcome[0]);
      dice2.innerHTML = getDiceFace(dieOutcome[1]);
      dice1.classList.remove("rolling");
      dice2.classList.remove("rolling");
      decisionFilter(player, count, lowNumDie, highNumDie);
    }
  }, 100);
}

function getDiceFace(value) {
  return dieFaceArr[value - 1];
}
function nextPlayer(player, lowNumDie) {
  for (pSeeds of document.querySelectorAll(`.${player.player}`)) {
    delArr = [];
    if (pSeeds.parentElement.children.length > 1) {
      for (p of pSeeds.parentElement.children) {
        if (p.classList[2] !== player.player) {
          delArr = [...delArr, p.classList];
        }
      }
    }
    if (delArr.length) {
      ludoBoxes[delArr[0][0]].seedRelativePosition[
        parseInt(delArr[0][1].slice(-1)) - 1
      ] = 0;
      ludoBoxes[pSeeds.classList[0]].seedRelativePosition[
        parseInt(pSeeds.classList[1].slice(-1)) - 1
      ] = 57;
      pSeeds.remove();
      document.querySelector(`.${delArr[0][1]}`).remove();
      newLudoSeed1 = document.createElement("div");
      newLudoSeed2 = document.createElement("div");
      newLudoSeed1.classList.add(
        `${pSeeds.classList[0]}`,
        `${pSeeds.classList[1]}`,
        `${pSeeds.classList[2]}`
      );
      newLudoSeed2.classList.add(`${delArr[0][0]}`, `${delArr[0][1]}`);
      document
        .querySelector(
          `.square_${
            ludoBoxes[pSeeds.classList[0]].runPathWay().seedsRealPosition[
              parseInt(pSeeds.classList[1].slice(-1)) - 1
            ]
          }`
        )
        .append(newLudoSeed1);
      document
        .querySelector(
          `.square_${
            ludoBoxes[delArr[0][0]].runPathWay().seedsRealPosition[
              parseInt(delArr[0][1].slice(-1)) - 1
            ]
          }`
        )
        .append(newLudoSeed2);
    }
  }
  finishLine = ["square_112", "square_98", "square_114", "square_128"];
  for (let i = 0; i < 4; i++) {
    if (document.querySelector(`.${finishLine[i]}`).children.length) {
      for (fChild of document.querySelector(`.${finishLine[i]}`).children) {
        document
          .querySelector(
            `.${fChild.classList[0]}_seedOut_${fChild.classList[1].slice(-1)}`
          )
          .classList.add(`${fChild.classList[0]}_out`);
        fChild.remove();
      }
    }
  }
  jArrays = [];
  for (c of player.colorInfo) {
    jArrays = [...jArrays, ...c.seedRelativePosition];
  }
  if (jArrays.every((j) => j === 57)) {
    winners.push(playersList[player.player]);
    delete playersList[player.player];
  }
  if (lowNumDie === 6 && playersList[player.player]) {
    nxtId = parseInt(playerButton.classList[0].slice(0, 8).slice(-1));
  } else {
    nxtId = parseInt(playerButton.classList[0].slice(0, 8).slice(-1)) + 1;
  }
  nxtId %= playerNo + 1;
  while (!playersList[`player_${nxtId}`]) {
    nxtId++;
  }
  if (Object.entries(playersList).length > 1) {
    playerButton = document.createElement("button");
    playerButton.append(`Player ${nxtId}`);
    playerButton.classList.add(
      `player_${nxtId}_button`,
      "button",
      "is-responsive",
      "is-large"
    );
    buttonDiv.append(playerButton);
    playerButton.addEventListener("click", playGame);
  } else {
    winners.push(playersList[`player_${nxtId}`]);
    position = ["First", "Second", "Third", "Fourth"];
    isGameOver = true;
    for (i = 0; i < winners.length; i++) {
      console.log(winners[i].player, "-", position[i]);
    }
    while (playerProgress.children[0]) {
      playerProgress.children[0].remove();
    }
    formDiv.classList.add("input_div", "select", "is-rounded", "is-normal");
    formDiv.innerHTML = `<form action="/playNo" class="playNoForm">
        <select name = "" id = "" >
        <option value="two_2">Two</option>
        <option value="four_4">Four</option>
        </select>
        <button type="submit"> SUBMIT</button>
        </form>`;
    document.querySelector(`.playNoForm`).addEventListener("submit", (e) => {
      gameInitiator(e);
    });
  }
}
