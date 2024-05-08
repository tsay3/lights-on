var puzzles = [[[0, 1, 0, 1, 0],
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

var lights = [];
var current_puzzle = 0;
const board_width = puzzles[0].length;

function triggerLights(i, j) {
	console.log("clicked " + i + ", " + j);
	toggleLight(i, j);
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
		var row = light_root.children[i];
		for (let j = 0; j < p[i].length; j++) {
			var btn = row.children[j];
			if (lights[i][j]) {
				btn.classList.remove("unlit");
				btn.classList.add("lit");
			} else {
				btn.classList.remove("lit");
				btn.classList.add("unlit");
			}
		}
	}
	victory = false;
}