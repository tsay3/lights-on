var puzzles = [[[0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0],
                [0, 0, 1, 0, 0],
                [0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0]],
               [[0, 1, 0, 1, 0],
                [1, 0, 1, 0, 1],
                [1, 0, 0, 0, 1],
                [0, 1, 0, 1, 0],
                [0, 0, 1, 0, 0]],
               [[1, 0, 0, 0, 1],
                [0, 1, 0, 1, 0],
                [0, 0, 1, 0, 0],
                [0, 0, 1, 0, 0],
                [0, 0, 0, 0, 0]],
               [[0, 1, 0, 0, 0],
                [1, 0, 1, 0, 1],
                [1, 0, 1, 1, 0],
                [0, 1, 1, 0, 1],
                [0, 0, 1, 0, 1]],
               [[0, 0, 0, 0, 1],
                [0, 1, 0, 1, 1],
                [1, 1, 0, 0, 0],
                [0, 0, 0, 1, 0],
                [0, 0, 1, 1, 0]]];
                
var indicators = [[0, 0, 0, 0, 0],
                  [0, 0, 0, 0, 0],
                  [0, 0, 0, 0, 0],
                  [0, 0, 0, 0, 0],
                  [0, 0, 0, 0, 0]];
const INDICATOR_ON = "&#128993;";
const INDICATOR_OFF = "&#160;";

var lights = [];
var current_puzzle = 0;
const board_width = puzzles[0].length;

function triggerLights(i, j) {
    toggleLight(i, j);
    markLight(i, j);
    if (i > 0) {
        toggleLight(i-1, j);
    }
    if (i < board_width-1) {
        toggleLight(i+1, j);
    }
    if (j > 0) {
        toggleLight(i, j-1);
    }
    if (j < board_width-1) {
        toggleLight(i, j+1);
    }
    if (victoryIsMet()) {
        victory = true;
        alert('Congratulations!');
    }
}

var victory = false;

function victoryIsMet() {
    if (victory) {
        return false;
    }
    for (var i = 0; i < lights.length; i++) {
        const row = lights[i];
        for (var j = 0; j < row.length; j++) {
            const elem = row[j];
            if (elem == 1) return false;
        }
    }
    return true;
}

function toggleLight(i, j) {
    lights[i][j] = 1 - lights[i][j];
    var light_root = document.getElementById('lights');
    var row = light_root.children[i];
    var btn = row.children[j];
    if (btn.classList.contains("lit")) {
        btn.classList.remove("lit");
        btn.classList.add("unlit");
    } else {
        btn.classList.add("lit");
        btn.classList.remove("unlit");
    }
}

function markLight(i, j) {
    var light_root = document.getElementById('lights');
    var row = light_root.children[i];
    var btn = row.children[j];
    indicators[i][j] = 1 - indicators[i][j];
    var indicator_box = document.getElementById('indicator_check');
    if (indicator_box.checked && indicators[i][j] == 1) {
        btn.innerHTML = INDICATOR_ON;
    } else {
        btn.innerHTML = INDICATOR_OFF;
    }
}

function runGame() {
    var light_root = document.getElementById('lights');
    for (let i = 0; i < light_root.childElementCount; i++) {
        const row = light_root.children[i];
        for (let j = 0; j < row.childElementCount; j++) {
            const btn = row.children[j];
            btn.addEventListener("click", () => triggerLights(i, j));
        }
    }
    current_puzzle = 0;
    resetPuzzle();
}

function toggleIndicators() {
    var light_root = document.getElementById('lights');
    var indicator_box = document.getElementById('indicator_check');
    for (let i = 0; i < indicators.length; i++) {
        for (let j = 0; j < indicators.length; j++) {
            let btn = light_root.children[i].children[j];
            if (indicator_box.checked && indicators[i][j] == 1) {
                btn.innerHTML = INDICATOR_ON;
            } else {
                btn.innerHTML = INDICATOR_OFF;
            }
        }
    }
}

function nextPuzzle() {
    current_puzzle = (current_puzzle + 1) % (puzzles.length);
    resetPuzzle();
}

function resetPuzzle() {
    var light_root = document.getElementById('lights');
    let p = puzzles[current_puzzle];
    lights = [];
    for (let i = 0; i < p.length; i++) {
        lights[i] = ([...p[i]]);
        for (let j = 0; j < p[i].length; j++) {
            let btn = light_root.children[i].children[j];
            if (lights[i][j]) {
                btn.classList.remove("unlit");
                btn.classList.add("lit");
            } else {
                btn.classList.remove("lit");
                btn.classList.add("unlit");
            }
            indicators[i][j] = 0;
            btn.innerHTML = INDICATOR_OFF;
        }
    }
    victory = false;
}

// Info taken from https://www.jaapsch.net/puzzles/lights.htm

const quietPatterns = [
               [[1, 0, 1, 0, 1],
                [1, 0, 1, 0, 1],
                [0, 0, 0, 0, 0],
                [1, 0, 1, 0, 1],
                [1, 0, 1, 0, 1]],
               [[1, 1, 0, 1, 1],
                [0, 0, 0, 0, 0],
                [1, 1, 0, 1, 1],
                [0, 0, 0, 0, 0],
                [1, 1, 0, 1, 1]],
               [[0, 1, 1, 1, 0],
                [1, 0, 1, 0, 1],
                [1, 1, 0, 1, 1],
                [1, 0, 1, 0, 1],
                [0, 1, 1, 1, 0]]];

function getOptimalSolution(puzzle) {
    var solution = [[0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0]];
	// chase the lights:
	// 1) for every light in the first row, press the button below it. Repeat for the next three rows.
    for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 5; col++) {
			if (puzzle[row][col] == 1) {
				solution[row][col+1] = 1;
				puzzle[row][col] = 1 - puzzle[row][col];
				puzzle[row][col+1] = 1 - puzzle[row][col+1];
				if (col < 3) puzzle[row][col+2] = 1 - puzzle[row][col+2];
				if (row >= 1) puzzle[row-1][col+1] = 1 - puzzle[row-1][col+1];
				if (row <= 3) puzzle[row+1][col+1] = 1 - puzzle[row+1][col+1];
			}
        }
    }
	// 2) for the last row, check the bottom left lights
	//    If the light at A5 is on, press D1 and E1.
	//    If the light at B5 is on, press B1 and E1.
	//    If the light at C5 is on, press D1.
	if (puzzle[4][0] == 1) {
		solution[0][3] = 1; // since all lights above bottom are off, 1 for simplicity
		solution[0][4] = 1;
		puzzle[0][2] = 1;
		puzzle[1][3] = 1;
		puzzle[1][4] = 1;
	}
	if (puzzle[4][1] == 1) {
		solution[0][1] = 1;
		solution[0][4] = 1 - solution[0][4];
		puzzle[0][0] = 1 - puzzle[0][0];
		puzzle[0][1] = 1 - puzzle[0][1];
		puzzle[0][2] = 1 - puzzle[0][2];
		puzzle[0][3] = 1 - puzzle[0][3];
		puzzle[0][4] = 1 - puzzle[0][4];
		puzzle[1][1] = 1 - puzzle[0][1];
		puzzle[1][4] = 1 - puzzle[0][4];
	}
	if (puzzle[4][2] == 1) {
		solution[0][3] = 1 - solution[0][3];
		puzzle[0][2] = 1 - puzzle[0][2];
		puzzle[0][3] = 1 - puzzle[0][3];
		puzzle[0][4] = 1 - puzzle[0][4];
		puzzle[1][3] = 1 - puzzle[1][3];
	}
	// 3) Repeat step 1. The game will be solved
    for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 5; col++) {
			if (puzzle[row][col] == 1) {
				solution[row][col+1] = 1;
				puzzle[row][col] = 1 - puzzle[row][col];
				puzzle[row][col+1] = 1 - puzzle[row][col+1];
				if (col < 3) puzzle[row][col+2] = 1 - puzzle[row][col+2];
				if (row >= 1) puzzle[row-1][col+1] = 1 - puzzle[row-1][col+1];
				if (row <= 3) puzzle[row+1][col+1] = 1 - puzzle[row+1][col+1];
			}
        }
    }
	// To optimize:
	// XOR the solution with each of the "quiet patterns", and return the result with the smallest sum
	var alternatives = structuredClone(quietPatterns);
	var solutionCounts = [0, 0, 0, 0];
	for (let i = 0; i < 4; i++) {
		for (let j = 0; j < 4; j++) {
			alternatives[0][i][j] = (quietPatterns[0][i][j] + solution[i][j]) % 2;
			alternatives[1][i][j] = (quietPatterns[1][i][j] + solution[i][j]) % 2;
			alternatives[2][i][j] = (quietPatterns[2][i][j] + solution[i][j]) % 2;
			solutionCounts[0] += alternatives[0][i][j];
			solutionCounts[1] += alternatives[1][i][j];
			solutionCounts[2] += alternatives[2][i][j];
			solutionCounts[3] += solution[i][j];
		}
	}
	// find the index of the smallest result in solutionCounts
	var min = solutionCounts.indexOf(Math.min.apply(Math, solutionCounts));
	if (min == 3) return solution;
	return alternatives[min];
}