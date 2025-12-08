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
                [0, 0, 1, 0, 0]],
               [[0, 1, 0, 0, 0],
                [1, 0, 1, 0, 1],
                [1, 0, 1, 1, 0],
                [0, 1, 1, 0, 1],
                [0, 0, 0, 0, 1]],
               [[0, 0, 0, 1, 1],
                [0, 0, 0, 1, 1],
                [0, 0, 0, 0, 0],
                [1, 0, 1, 0, 1],
                [1, 1, 1, 1, 1]]];
                
var lights = [[0, 0, 0, 0, 0],
              [0, 0, 0, 0, 0],
              [0, 0, 0, 0, 0],
              [0, 0, 0, 0, 0],
              [0, 0, 0, 0, 0]];
var indicators = [[0, 0, 0, 0, 0],
                  [0, 0, 0, 0, 0],
                  [0, 0, 0, 0, 0],
                  [0, 0, 0, 0, 0],
                  [0, 0, 0, 0, 0]];
var solution = [[0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0]];

const INDICATOR_ON = "&#128993;";
const INDICATOR_OFF = "&#160;";

var current_puzzle = 0;

const board_width = 5;

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

function triggerLights(i, j) {
	toggleSelection(i, j);
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
    for (var i = 0; i < board_width; i++) {
        const row = lights[i];
        for (var j = 0; j < board_width; j++) {
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

function toggleSelection(i, j) {
    indicators[i][j] = 1 - indicators[i][j];
	solution[i][j] = 1 - solution[i][j];
}

function markLight(i, j) {
    var light_root = document.getElementById('lights');
    var row = light_root.children[i];
    var btn = row.children[j];
    var clicked_btn = document.getElementById('clicked_btn');
	var solution_btn = document.getElementById('solution_btn');
    if (clicked_btn.checked && indicators[i][j] == 1) {
        btn.innerHTML = INDICATOR_ON;
    } else if (solution_btn.checked && solution[i][j] == 1) {
        btn.innerHTML = INDICATOR_ON;
	} else {
        btn.innerHTML = INDICATOR_OFF;
    }
}

function showMarkers(indicator_boxes) {
	var light_root = document.getElementById('lights');
    for (let i = 0; i < board_width; i++) {
        for (let j = 0; j < board_width; j++) {
            let btn = light_root.children[i].children[j];
            if (indicator_boxes[i][j] == 1) {
                btn.innerHTML = INDICATOR_ON;
            } else {
                btn.innerHTML = INDICATOR_OFF;
            }
        }
    }
}

function hideMarkers() {
	var light_root = document.getElementById('lights');
    for (let i = 0; i < board_width; i++) {
        for (let j = 0; j < board_width; j++) {
            let btn = light_root.children[i].children[j];
			btn.innerHTML = INDICATOR_OFF;
        }
    }
}

function showClicked() {
	showMarkers(indicators);
}

function showSolution() {
	showMarkers(solution);
}

function nextPuzzle() {
    current_puzzle = (current_puzzle + 1) % (puzzles.length);
    resetPuzzle();
}

function resetPuzzle() {
    var light_root = document.getElementById('lights');
    let p = puzzles[current_puzzle];
	console.log("puzzle " + current_puzzle + ":");
	console.log(p);
    for (let i = 0; i < board_width; i++) {
        for (let j = 0; j < board_width; j++) {
			lights[i][j] = p[i][j];
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
	solution = getOptimalSolution(p);
    victory = false;
	document.getElementById('no_markers_btn').checked = true;
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

function getOptimalSolution(puzzleRef) {
	// chase the lights:
	// 1) for every light in the first row, press the button below it. Repeat for the next three rows.
	var puzzle = structuredClone(puzzleRef);
    for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 5; col++) {
			solution[row+1][col] = 0;
			if (puzzle[row][col] == 1) {
				solution[row+1][col] = 1;
				puzzle[row][col] = 1 - puzzle[row][col];
				puzzle[row+1][col] = 1 - puzzle[row+1][col];
				if (row < 3) puzzle[row+2][col] = 1 - puzzle[row+2][col];
				if (col >= 1) puzzle[row+1][col-1] = 1 - puzzle[row+1][col-1];
				if (col <= 3) puzzle[row+1][col+1] = 1 - puzzle[row+1][col+1];
			}
        }
		console.log("row " + (row+1) + ": " + solution[row+1].toString());
    }
	solution[0] = [0, 0, 0, 0, 0];
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
		puzzle[1][1] = 1 - puzzle[1][1];
		puzzle[1][4] = 1 - puzzle[1][4];
	}
	if (puzzle[4][2] == 1) {
		solution[0][3] = 1 - solution[0][3];
		puzzle[0][2] = 1 - puzzle[0][2];
		puzzle[0][3] = 1 - puzzle[0][3];
		puzzle[0][4] = 1 - puzzle[0][4];
		puzzle[1][3] = 1 - puzzle[1][3];
	}
	// 3) Repeat step 1. The game will be solved
	console.log("row " + (0) + ": " + solution[0].toString());
    for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 5; col++) {
			if (puzzle[row][col] == 1) {
				solution[row+1][col] = 1 - solution[row+1][col];
				// centered at (row+1, col)
				puzzle[row][col] = 1 - puzzle[row][col];
				puzzle[row+1][col] = 1 - puzzle[row+1][col];
				if (row < 3) puzzle[row+2][col] = 1 - puzzle[row+2][col];
				if (col >= 1) puzzle[row+1][col-1] = 1 - puzzle[row+1][col-1];
				if (col <= 3) puzzle[row+1][col+1] = 1 - puzzle[row+1][col+1];
			}
        }
		console.log("row " + (row+1) + ": " + solution[row+1].toString());
    }
	// To optimize:
	// XOR the solution with each of the "quiet patterns", and return the result with the smallest sum
	var alternatives = structuredClone(quietPatterns);
	var solutionCounts = [0, 0, 0, 0];
	for (let i = 0; i < board_width; i++) {
		for (let j = 0; j < board_width; j++) {
			alternatives[0][i][j] = (quietPatterns[0][i][j] + solution[i][j]) % 2;
			alternatives[1][i][j] = (quietPatterns[1][i][j] + solution[i][j]) % 2;
			alternatives[2][i][j] = (quietPatterns[2][i][j] + solution[i][j]) % 2;
			solutionCounts[0] += alternatives[0][i][j];
			solutionCounts[1] += alternatives[1][i][j];
			solutionCounts[2] += alternatives[2][i][j];
			solutionCounts[3] += solution[i][j];
		}
	}
	console.log("solution:");
	console.log(solution);
	// find the index of the smallest result in solutionCounts
	var min = solutionCounts.indexOf(Math.min.apply(Math, solutionCounts));
	console.log("min = " + min);
	if (min == 3) return solution;
	return alternatives[min];
}