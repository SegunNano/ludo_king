const buttonDiv = document.querySelector('.buttons');
const selectDiv = document.querySelector('.select');
const inputDiv = document.createElement('div');

const ludoBoard = document.querySelector('.playGround');
const isGameOver = false;
const isPaused = false


let playerNo = 4;
const colorList = ['red', 'green', 'yellow', 'blue'];
const ludoSections = [
    {
        color: 'red',
        normal: [126, 125, 124, 123, 122, 121, 106, 91, 92, 93, 94, 95, 96],
        finishing: [107, 108, 109, 110, 111, 112],
    },
    {
        color: 'green',
        normal: [82, 67, 52, 37, 22, 7, 8, 9, 24, 39, 54, 69, 84],
        finishing: [23, 38, 53, 68, 83, 98],
    },
    {
        color: 'yellow',
        normal: [100, 101, 102, 103, 104, 105, 120, 135, 134, 133, 132, 131, 130],
        finishing: [119, 118, 117, 116, 115, 114],
    },
    {
        color: 'blue',
        normal: [144, 159, 174, 189, 204, 219, 218, 217, 202, 187, 172, 157, 142],
        finishing: [203, 188, 173, 158, 143, 128],
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
            runWay[this.seedRelativePosition[0] - 1],
            runWay[this.seedRelativePosition[1] - 1],
            runWay[this.seedRelativePosition[2] - 1],
            runWay[this.seedRelativePosition[3] - 1]
        ]
    }
}
const ludoBoxes = {};
for (let i = 0; i <= 3; i++) {
    ludoBoxes[colorList[i]] = {
        ...ludoSections[i],
        seedRelativePosition: [0, 0, 0, 0],
        sectionBoxes,
        runPathWay
    }
}
const playersList = {};
for (let i = 1; i <= playerNo; i++) {
    const playerButton = document.createElement('button');
    playerButton.append(`Player ${i}`)
    playerButton.classList.add(`player_${i}`, 'button', 'is-responsive', 'is-large')
    buttonDiv.append(playerButton)
    playersList[`player_${i}`] = createPlayerInfo(colorList, playerNo, i)
}


function createPlayerInfo(colorList, playerNo, num) {
    const colorInfo = [];
    if (playerNo === 4) {
        colorInfo.push(ludoBoxes[colorList[num - 1]])
    } else {
        colorInfo.push(ludoBoxes[colorList[num - 1]], ludoBoxes[colorList[num + 1]])
    }
    return {
        button: document.querySelector(`.player_${num}`),
        score: 0,
        colorInfo
    }
}



const wayBoxes = [...ludoBoxes.red.sectionBoxes(), ...ludoBoxes.green.sectionBoxes(), ...ludoBoxes.yellow.sectionBoxes(), ...ludoBoxes.blue.sectionBoxes(),]
for (let i = 1; i <= 225; i++) {
    const ludoBox = document.createElement('div');
    if (wayBoxes.some(waybox => { return i === waybox })) {
        const ludoBoxInnerText = document.createElement('p');
        ludoBoxInnerText.append(i)
        ludoBox.append(ludoBoxInnerText)
        ludoBox.classList.add(`square_${i}`)
    }
    ludoBoard.append(ludoBox);
}


function playGame(player, opponent) {
    count = 0;
    if (!isGameOver) {
        // dieOutCome = rolldie()
        dieOutCome = [6, 6]
        console.log(dieOutCome)
        jointArrays1 = jointArrays(player)
        if (dieOutCome.every(die => { return die === 6 }) && jointArrays1.every(p => { return p === 0 })) {
            newSeedOut(player, count)
        } else { }
    }
}



function getRandomNumber(e) {
    return Math.floor(Math.random() * e + 1);
}
function rolldie() {
    return [getRandomNumber(6), getRandomNumber(6)]
}


function newSeedOut(player, count) {
    if (player.colorInfo.length > 1) {
        inputDiv.classList.add('input_div', 'select', 'is-rounded', 'is-normal');
        selectOption = `<select name="" id=""><option>Select an Option1</option>`
        for (c of player.colorInfo) {
            selectOption += `<option value="${c.color}">${c.color}</option>`
        }
        selectOption += ` </select >`
        inputDiv.innerHTML = selectOption
        selectDiv.children[0].append(inputDiv);
        inputDiv.addEventListener('input', function () {
            for (c of player.colorInfo) {
                if (c.color === this.children[0].value) {
                    c.seedRelativePosition[c.seedRelativePosition.indexOf(0)] = 1;
                    inputDiv.remove();
                    count += 1;
                    count <= 1 && makeChoices(player, jointArrays, count);
                }
            }
        }, { once: true })
    } else {
        player.colorInfo[0].seedRelativePosition[c.seedRelativePosition.indexOf(0)] = 1;
        count += 1;
        count <= 1 && makeChoices(player, count);
    }
}

function moveSeeds(player) {
    jointArrays = []
    for (c of player.colorInfo) {
        jointArrays = [...jointArrays, ...c.seedRelativePosition]
        console.log(jointArrays)
    }
    for (j = 0; j <= jointArrays.length; j++) {
        console.log(j)
        console.log(player.colorInfo[0].runPathWay().seedsRealPosition[j])
        if (player.colorInfo[0].runPathWay().seedsRealPosition[j]) {
            document.querySelector(`.square_${player.colorInfo[0].runPathWay().seedsRealPosition[j]}`).addEventListener('click', function () {
                player.colorInfo[0].seedRelativePosition[player.colorInfo[0].runPathWay().seedsRealPosition.indexOf(parseInt(this.classList[0].slice(-2)))] += 6
                console.log(player.colorInfo[0].seedRelativePosition)
                for (let i = 0; i < 225; i++) {
                    j = 0;
                    ludoBoard.children[j].remove()
                }
                console.log('done')
                for (let i = 1; i <= 225; i++) {
                    const ludoBox = document.createElement('div');
                    if (wayBoxes.some(waybox => { return i === waybox })) {
                        const ludoBoxInnerText = document.createElement('p');
                        ludoBoxInnerText.append(i)
                        ludoBox.append(ludoBoxInnerText)
                        ludoBox.classList.add(`square_${i}`)
                    }
                    ludoBoard.append(ludoBox);
                }
            })
        }
    }
}

function makeChoices(player, count) {
    console.log('short circuit(i)', count)
    if (count <= 1) {
        console.log('short circuit(ii)')
        inputDiv.classList.add('input_div', 'select', 'is-rounded', 'is-normal');
        inputDiv.innerHTML = `<select name="" id="">
                            <option>Select an Option2</option>
                            <option value="newSeedOut">Bring Out Another Seed</option>
                            <option value="moveSeeds">Continue Moving Existing Seed</option>
                          </select>`
        selectDiv.children[1].append(inputDiv);
        inputDiv.addEventListener('input', function () {
            console.log('it got here3')
            console.log(this.children[0].value)
            inputDiv.remove();
            if (this.children[0].value === 'newSeedOut') {
                inputDiv.remove();
                console.log('IT GOT HERE 4')
                newSeedOut(player, jointArrays, count)
            } else {
                console.log('IT GOT HERE 5 ')
                moveSeeds(player)
            }
        }, { once: true })
    }
}
function jointArrays(player) {
    jointArrays = []
    for (c of player.colorInfo) {
        return jointArrays = [...jointArrays, ...c.seedRelativePosition]
    }
}

// playGame(playersList.player_1)
//nksnjkdjdkjhihieuhiuhefiuhefui=>

