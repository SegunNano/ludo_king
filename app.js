const buttonDiv = document.querySelector('.buttons');
const playerProgress = document.querySelector('.playerProgress');
const selectDiv = document.querySelector('.select');
const formDiv = document.querySelector('.formDiv');
const dieDiv = document.querySelector('.dieDiv');


const ludoBoard = document.querySelector('.playGround');
const isGameOver = false;
const winners = []


formDiv.classList.add('input_div', 'select', 'is-rounded', 'is-normal');
formDiv.innerHTML = `<form action="/playNo" class="playNoForm">
<select name = "" id = "" >
<option value="two_2">Two</option>
<option value="four_4">Four</option>
</select>
<button type="submit"> SUBMIT</button>
</form>`
const PlayNoForm = document.querySelector(`.formDiv form`);

PlayNoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    playerNo = parseInt(document.querySelector('select').value.slice(-1));


    const colorList = ['red', 'green', 'yellow', 'blue'];
    const ludoSections = [
        {
            color: 'red',
            normal: [126, 125, 124, 123, 122, 121, 106, 91, 92, 93, 94, 95, 96],
            finishing: [107, 108, 109, 110, 111, 112],
            startings: [49, 33, 48, 34]
        },
        {
            color: 'green',
            normal: [82, 67, 52, 37, 22, 7, 8, 9, 24, 39, 54, 69, 84],
            finishing: [23, 38, 53, 68, 83, 98],
            startings: [57, 43, 42, 58]
        },
        {
            color: 'yellow',
            normal: [100, 101, 102, 103, 104, 105, 120, 135, 134, 133, 132, 131, 130],
            finishing: [119, 118, 117, 116, 115, 114],
            startings: [177, 193, 178, 192]
        },
        {
            color: 'blue',
            normal: [144, 159, 174, 189, 204, 219, 218, 217, 202, 187, 172, 157, 142],
            finishing: [203, 188, 173, 158, 143, 128],
            startings: [169, 183, 184, 168]
        }
    ]
    sectionBoxes = function () {
        return [...this.normal, ...this.finishing]
    }
    runPathWay = function () {
        idx = colorList.indexOf(this.color)
        runWay = [...this.normal.slice(8)];
        for (i = idx + 1; i <= idx + 3; i++) {
            innerIdx = i
            if (innerIdx > 3) {
                innerIdx %= 4;
            }
            iPath = ludoBoxes[colorList[innerIdx]].normal;
            runWay = [...runWay, ...iPath];
        }
        runWay = [...runWay, ...this.normal.slice(0, 7), ...this.finishing]
        return {
            runWay,
            seedsRealPosition: [
                [this.startings[0], ...runWay][this.seedRelativePosition[0]],
                [this.startings[1], ...runWay][this.seedRelativePosition[1]],
                [this.startings[2], ...runWay][this.seedRelativePosition[2]],
                [this.startings[3], ...runWay][this.seedRelativePosition[3]],
            ]
        }
    }


    ludoBoxes = {};
    for (let i = 0; i <= 3; i++) {
        ludoBoxes[colorList[i]] = {
            ...ludoSections[i],
            seedRelativePosition: [0, 0, 0, 0],
            // seedRelativePosition: [1, 0, 0, 25],
            sectionBoxes,
            runPathWay
        }
    }

    playersList = {};
    for (let i = 1; i <= playerNo; i++) {
        playersList[`player_${i}`] = createPlayerInfo(colorList, playerNo, i)
        // console.log(playersList)
    }

    playerButton = document.createElement('button');
    playerButton.append(`Player 1`)
    playerButton.classList.add(`player_1`, 'button', 'is-responsive', 'is-large');
    buttonDiv.append(playerButton)

    for (let i = 1; i <= playerNo; i++) {
        playerDiv = document.createElement('div');
        playerText = document.createElement('p')
        playerDivColor = document.createElement('div');
        playerText.innerText = `Player ${i}`
        playerDiv.append(playerText)
        console.log(i, playerDiv)
        for (c of playersList[`player_${i}`].colorInfo) {
            playerDivvColor = document.createElement('div');
            playerDivvColor.classList.add(`${c.color}-out`)
            playerDivColorOut = document.createElement('div');
            pText = document.createElement('p');
            pText.innerText = `${c.color}`.toUpperCase()
            playerDivvColor.append(pText)
            for (let j = 0; j < 4; j++) {
                playerDivColorOutSeed = document.createElement('div');
                playerDivColorOutSeed.classList.add(`${c.color}_out`, `seed_${j}`)
                playerDivColorOut.append(playerDivColorOutSeed)
                console.log(i, c.color, j, playerDivColorOutSeed)
            }
            playerDivvColor.append(playerDivColorOut)
            playerDivColor.append(playerDivvColor)
        }
        playerDiv.append(playerDivColor)
        playerProgress.append(playerDiv)
    }
    seedsAndPositions = []
    for (let i = 0; i < 4; i++) {
        // console.log([ludoBoxes[colorList[i]]])
        seedsAndPositions.push([ludoBoxes[colorList[i]].color, ludoBoxes[colorList[i]].runPathWay().seedsRealPosition])
    }
    wayBoxes = [...ludoBoxes.red.sectionBoxes(), ...ludoBoxes.green.sectionBoxes(), ...ludoBoxes.yellow.sectionBoxes(), ...ludoBoxes.blue.sectionBoxes()]
    for (c of colorList) {
        wayBoxes = [...wayBoxes, ...ludoBoxes[c].sectionBoxes(), ...ludoBoxes[c].startings]
    }
    for (let i = 1; i <= 225; i++) {
        const ludoBox = document.createElement('div');
        const ludoSeed = document.createElement('div');
        if (wayBoxes.some(wayBox => { return i === wayBox })) {
            for (seedAndPositions of seedsAndPositions) {
                for (let j = 0; j <= seedAndPositions[1].length; j++) {
                    if (seedAndPositions[1][j] === i) {
                        ludoSeed.classList.add(`${seedAndPositions[0]}`, `${seedAndPositions[0]}_${j + 1}`);
                        ludoBox.classList.add(`square_${i}`);
                        ludoBox.append(ludoSeed)
                    } else {
                        ludoBox.classList.add(`square_${i}`)
                    }
                }
            }
        }
        ludoBoard.append(ludoBox);
    }



    playerButton.addEventListener('click', playGame)
    PlayNoForm.remove();
});



function createPlayerInfo(colorList, playerNo, num) {
    const colorInfo = [];
    if (playerNo === 4) {
        colorInfo.push(ludoBoxes[colorList[num - 1]])
    } else {
        colorInfo.push(ludoBoxes[colorList[num - 1]], ludoBoxes[colorList[num + 1]])
    }
    return {
        player: `player_${num}`,
        button: document.querySelector(`.player_${num}`),
        score: 0,
        colorInfo
    }
}
function playGame() {
    player = playersList[playerButton.classList[0]]
    playerButton.remove()
    if (!isGameOver) {
        dieOutCome = rolldie();
        // dieOutCome = [6, 5]
        for (dieDivv of dieDiv.children) {
            if (dieDivv !== document.querySelector('.title-is-3')) {
                if (dieDivv.children.length) {
                    dieDivv.children[0].remove()
                }
            }
        }
        diceResult1 = document.createElement('p');
        diceResult1.classList.add('title-is-5')
        diceResult1.innerText = dieOutCome[0]
        diceResult2 = document.createElement('p');
        diceResult2.classList.add('title-is-5')
        diceResult2.innerText = dieOutCome[1]
        dieDiv.children[1].append(diceResult1)
        dieDiv.children[2].append(diceResult2)
        console.log(dieOutCome)
        jointArrays = [];
        allJointArrays = []
        for (c of player.colorInfo) {
            jointArrays = [...jointArrays, ...c.seedRelativePosition]
        }
        for (d of jointArrays) {
            r = d;
            if (r === 57) {
                r = 0
            }
            allJointArrays = [...allJointArrays, r]
        }
        inSeedCountArray = jointArrays.filter(s => s === 0);
        lowNumDie = dieOutCome.reduce((die1, die2) => {
            if (die2 < die1) {
                return die2
            }
            return die1
        })
        if (dieOutCome[0] === dieOutCome[1]) {
            highNumDie = lowNumDie
        } else {
            highNumDie = dieOutCome.filter(die => die !== lowNumDie)[0]
        }
        count = 0;
        decisionFilter(player, count, lowNumDie, highNumDie)
    }
}
function decisionFilter(player, count, lowNumDie, highNumDie) {
    if (count <= 1) {
        if (count === 0) {
            die = highNumDie
        } else {
            die = lowNumDie
        }
        for (dieDivv of dieDiv.children) {
            dieDivv.classList.remove('red_die', 'blue_die', 'yellow_die', 'green_die')
        }
        for (dieDivv of dieDiv.children) {
            if (die == dieDivv.innerText) {
                if (player.colorInfo.length > 1) {
                    dieDivv.classList.add(`${player.colorInfo[count].color}_die`)
                } else {
                    dieDivv.classList.add(`${player.colorInfo[0].color}_die`)
                }
            }
        }
        console.log(die)
        jointArrays = [];
        allJointArrays = []
        for (c of player.colorInfo) {
            jointArrays = [...jointArrays, ...c.seedRelativePosition]
        }
        inSeedArray = jointArrays.filter(s => s === 0);
        outSeedArray = jointArrays.filter(s => s !== 0 && s < 57);
        if (die === 6) {
            if (inSeedArray.length && outSeedArray.length) {
                makeChoices(player, count, lowNumDie, highNumDie, die)
            } else {
                if (inSeedArray.length) {
                    newSeedOut(player, count, lowNumDie, highNumDie)
                } else if (outSeedArray.length) {
                    moveSeeds(player, count, lowNumDie, inSeedCountArray, highNumDie, die);
                } else {
                    nextPlayer(player, lowNumDie)
                }
            }
        } else {
            if (outSeedArray.length) {
                moveSeeds(player, count, lowNumDie, inSeedCountArray, highNumDie, die);
            } else {
                nextPlayer(player, lowNumDie)
            }
        }

    } else {
        nextPlayer(player, lowNumDie)
    }
}
function newSeedOut(player, count, lowNumDie, highNumDie) {
    if (player.colorInfo.length > 1) {
        if (player.colorInfo[0].seedRelativePosition.some(p => p === 0) && player.colorInfo[1].seedRelativePosition.some(p => p === 0)) {
            inputDiv = document.createElement('div');
            inputDiv.classList.add('input_div', 'select', 'is-rounded', 'is-normal');
            selectOption = `<select name="" id=""><option>Select an Option</option>`
            for (c of player.colorInfo) {
                selectOption += `<option value="${c.color}">${c.color}</option>`
            }
            selectOption += ` </select >`
            inputDiv.innerHTML = selectOption
            selectDiv.append(inputDiv);
            inputDiv.addEventListener('input', function () {
                inputDiv.remove()
                for (c of player.colorInfo) {
                    if (c.color === this.children[0].value) {
                        seedIdx = c.seedRelativePosition.indexOf(0);
                        document.querySelector(`.${c.color}_${seedIdx + 1}`).remove();
                        c.seedRelativePosition[seedIdx] = 1;
                        newLudoSeed = document.createElement('div');
                        newLudoSeed.classList.add(`${c.color}`, `${c.color}_${seedIdx + 1}`, `${player.player}`);
                        document.querySelector(`.square_${c.runPathWay().seedsRealPosition[seedIdx]}`).append(newLudoSeed);
                    }
                }
                count += 1;
                decisionFilter(player, count, lowNumDie, highNumDie);
            }, { once: true })
        } else {
            if (player.colorInfo[0].seedRelativePosition.some(p => p === 0)) {
                c = player.colorInfo[0];
            } else {
                c = player.colorInfo[1];
            }
            seedIdx = c.seedRelativePosition.indexOf(0);
            document.querySelector(`.${c.color}_${seedIdx + 1}`).remove();
            c.seedRelativePosition[seedIdx] = 1;
            newLudoSeed = document.createElement('div');
            newLudoSeed.classList.add(`${c.color}`, `${c.color}_${seedIdx + 1}`, `${player.player}`);
            document.querySelector(`.square_${c.runPathWay().seedsRealPosition[seedIdx]}`).append(newLudoSeed);
            count += 1;
            decisionFilter(player, count, lowNumDie, highNumDie);
        }
    } else {
        c = player.colorInfo[0];
        seedIdx = c.seedRelativePosition.indexOf(0);
        document.querySelector(`.${c.color}_${seedIdx + 1}`).remove();
        c.seedRelativePosition[seedIdx] = 1;
        newLudoSeed = document.createElement('div');
        newLudoSeed.classList.add(`${c.color}`, `${c.color}_${seedIdx + 1}`, `${player.player}`);
        document.querySelector(`.square_${c.runPathWay().seedsRealPosition[seedIdx]}`).append(newLudoSeed);
        count += 1;
        decisionFilter(player, count, lowNumDie, highNumDie);
    }
}
function moveSeeds(player, count, lowNumDie, highNumDie, die) {
    if (count <= 1) {
        playerOutSeedArray = document.querySelectorAll(`.${player.player}`)
        seedRelativePositionArray = [];
        for (let i = 0; i < playerOutSeedArray.length; i++) {
            seedRelativePositionArray = [...seedRelativePositionArray, ludoBoxes[playerOutSeedArray[i].classList[0]].seedRelativePosition[parseInt(playerOutSeedArray[i].classList[1].slice(-1)) - 1]]
        }
        if (seedRelativePositionArray.every(p => p + die > 57)) {
            count += 1;
            decisionFilter(player, count, lowNumDie, highNumDie);
        } else {
            for (let p of playerOutSeedArray) {
                if (ludoBoxes[p.classList[0]].seedRelativePosition[parseInt(p.classList[1].slice(-1)) - 1] + die < 58) {
                    p.addEventListener('click', () => {
                        ludoBoxes[p.classList[0]].seedRelativePosition[parseInt(p.classList[1].slice(-1)) - 1] += die;
                        playerSeeds = [[p.classList[0], p.classList[1], document.querySelector(`.square_${ludoBoxes[p.classList[0]].runPathWay().seedsRealPosition[parseInt(p.classList[1].slice(-1)) - 1]}`)]]
                        p.remove();
                        for (let i = 0; i < playerOutSeedArray.length; i++) {
                            oldPlayer = playerOutSeedArray[i]
                            if (oldPlayer.classList[1] !== p.classList[1]) {
                                playerSeeds = [...playerSeeds, [oldPlayer.classList[0], oldPlayer.classList[1], oldPlayer.parentElement]]
                                console.log(playerSeeds)
                                oldPlayer.remove()
                            }
                        }
                        for (i = 0; i < playerSeeds.length; i++) {
                            newLudoSeed = document.createElement('div');
                            newPlayer = playerSeeds[i];
                            newLudoSeed.classList.add(`${newPlayer[0]}`, `${newPlayer[1]}`, `${player.player}`);
                            console.log(newLudoSeed)
                            newPlayer[2].append(newLudoSeed)
                        }
                        count += 1;
                        decisionFilter(player, count, lowNumDie, highNumDie);
                    }, { once: true })
                }
            }
        }
    } else {
        decisionFilter(player, count, lowNumDie, highNumDie);
    }
}
function makeChoices(player, count, lowNumDie, highNumDie, die) {
    if (count <= 1) {
        inputDiv = document.createElement('div');
        inputDiv.classList.add('input_div', 'select', 'is-rounded', 'is-normal');
        inputDiv.innerHTML = `<select name="" id="">
                            <option>Select an Option</option>
                            <option value="newSeedOut">Bring Out A Seed</option>
                            <option value="moveSeeds">Continue Moving Existing Seed</option>
                          </select>`
        selectDiv.append(inputDiv);
        inputDiv.addEventListener('input', function () {
            if (this.children[0].value === 'newSeedOut') {
                inputDiv.remove();
                newSeedOut(player, count, lowNumDie, highNumDie)
            } else {
                inputDiv.remove();
                moveSeeds(player, count, lowNumDie, highNumDie, die);
            }
        })
    } else {
        decisionFilter(player, count, lowNumDie, highNumDie);
    }
}

function getRandomNumber(e) {
    return Math.floor(Math.random() * e + 1);
}
function rolldie() {
    return [getRandomNumber(6), getRandomNumber(6)]
}


function nextPlayer(player, lowNumDie) {
    for (pSeeds of document.querySelectorAll(`.${player.player}`)) {
        delArr = []
        if (pSeeds.parentElement.children.length > 1) {
            for (p of pSeeds.parentElement.children) {
                if (p.classList[2] !== player.player) {
                    delArr = [...delArr, p.classList];
                }
            }
        }
        if (delArr.length) {
            ludoBoxes[delArr[0][0]].seedRelativePosition[parseInt(delArr[0][1].slice(-1)) - 1] = 0;
            ludoBoxes[pSeeds.classList[0]].seedRelativePosition[parseInt(pSeeds.classList[1].slice(-1)) - 1] = 57;
            pSeeds.remove()
            document.querySelector(`.${delArr[0][1]}`).remove()
            newLudoSeed1 = document.createElement('div');
            newLudoSeed2 = document.createElement('div');
            newLudoSeed1.classList.add(`${pSeeds.classList[0]}`, `${pSeeds.classList[1]}`, `${pSeeds.classList[2]}`);
            newLudoSeed2.classList.add(`${delArr[0][0]}`, `${delArr[0][1]}`);
            document.querySelector(`.square_${ludoBoxes[pSeeds.classList[0]].runPathWay().seedsRealPosition[parseInt(pSeeds.classList[1].slice(-1)) - 1]}`).append(newLudoSeed1);
            document.querySelector(`.square_${ludoBoxes[delArr[0][0]].runPathWay().seedsRealPosition[parseInt(delArr[0][1].slice(-1)) - 1]}`).append(newLudoSeed2);
        }
    }
    finishLine = ['square_112', 'square_98', 'square_114', 'square_128']
    for (let i = 0; i < 4; i++) {
        if (document.querySelector(`.${finishLine[i]}`).children.length) {
            for (fChild of document.querySelector(`.${finishLine[i]}`).children) {
                fChild.remove()
            }
        }
    }
    jArrays = []
    for (c of player.colorInfo) {
        jArrays = [...jArrays, ...c.seedRelativePosition]
    }
    if (jArrays.every(j => j === 57)) {
        winners = [...winners, playersList[player.player]]
        delete playersList[player.player]
    }
    if (lowNumDie === 6) {
        nxtId = parseInt(playerButton.classList[0].slice(-1));
    } else {
        nxtId = parseInt(playerButton.classList[0].slice(-1)) + 1;
    }
    nxtId %= (Object.entries(playersList).length + 1);
    while (!playersList[`player_${nxtId}`]) {
        nxtId++
    }
    if (Object.entries(playersList).length > 1) {
        playerButton = document.createElement('button');
        playerButton.append(`Player ${nxtId}`)
        playerButton.classList.add(`player_${nxtId}`, 'button', 'is-responsive', 'is-large');
        buttonDiv.append(playerButton)
        playerButton.addEventListener('click', playGame)
    } else {
        winners = [...winners, playersList[`player_${nxtId}`]]
        position = [First, Second, Third, Fourth];
        isGameOver = true;

    }
}

