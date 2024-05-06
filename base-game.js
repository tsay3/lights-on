board_width = 3;

var lights = [[0, 0, 0], [0, 1, 0], [0, 0, 0]];

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
	for (let i = 0; i < board_width; i++) {
		const row = light_root.children[i];
		for (let j = 0; j < board_width; j++) {
			const btn = row.children[j];
			btn.addEventListener("click", () => triggerLights(i, j));
			if (lights[i][j]) {
				console.log("Lighting " + i + ", " + j);
				btn.classList.add("lit");
			} else {
				console.log("Not lighting " + i + ", " + j);
				btn.classList.add("unlit");
			}
		}
	}
}