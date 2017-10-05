var wordBank = {
	wordList: {
		wd1: ["advertise", "assets/images/wd1_img.jpg"],
		wd2: ["", ""]	// End of question
	},
	wordPos: 0,

	getWordQuestion: function() {
		this.wordPos++;
		return this.wordList["wd" + this.wordPos];
	}
}

var userData = {
	answerWord: [],
	userWord: [],
	remained: 0,
	guessed: [],
	score: {
		numWin: 0,
		numLose: 0
	},

	setNewWord: function(str) {
		this.answerWord.length = 0;
		this.answerWord = str.split("");

		this.userWord.length = 0;

		this.remained = 10;
		this.guessed = [];

		if(str !== "") {
			for(var i = 0; i < str.length; i++) {
				this.userWord.push("_");
			}
			return true;
		}
		else {
			this.userWord = "GAME-OVER!".split("");
			return false;
		}
	},

	isNewGuessed: function(x) {
		if(this.guessed.indexOf(x) === -1) {
			this.guessed.push(x);
			return true;
		}
		else {
			return false;
		}
	},

	setUserWord: function(x) {
		var idx = this.answerWord.indexOf(x);

		if(idx !== -1) {
			for(var i = 0; i < this.answerWord.length; i++) {
				if(this.answerWord[i] === x) {
					this.userWord[i] = x;
				}
			}
		}
		else {
			this.remained--;
		}
	},

	addGuessed: function(x) {
		this.guessed.push(x);
	},

	scoreHTML: function() {
		var text1 = "<ul><li># OF WIN: " + this.score.numWin + "</li>";
		var text2 = "<li># OF LOSE: " + this.score.numLose + "</li></ul>";

		return (text1 + text2);
	},

	isDone: function() {
		var rtBool = false;
		if(this.answerWord.toString() === this.userWord.toString()) {
			this.score.numWin++;
			rtBool = true;
		}
		else if(this.remained <= 0) {
			this.score.numLose++;
			rtBool = true;
		}
		return rtBool;
	}
}

function renderQuestion() {
	// get new question
	var curQuestion = wordBank.getWordQuestion();

	// initialize userData except score
	return userData.setNewWord(curQuestion[0]);
}

function showUserStatus() {
	document.querySelector("#userWord").innerHTML = userData.userWord.toString().replace(/,/g, " ");
	document.querySelector("#userRemained").innerHTML = userData.remained;
	document.querySelector("#userGuessed").innerHTML = userData.guessed;
	document.querySelector("#userScore").innerHTML = userData.scoreHTML();
}

var gGameRun = true;

gGameRun = renderQuestion();
showUserStatus();

document.onkeyup = function(event) {
	if(gGameRun) {
		var letter = event.key.toLowerCase();	

		// To check alphabet and to avoid input like tab, alt, ...
		if (letter.match(/[a-z]/i) && (letter.length === 1)) {
			if(userData.isNewGuessed(letter)) {
				userData.setUserWord(letter);
			}
			else {
				alert(letter + " is the letter you've already guessed!");
			}

			if(userData.isDone()) {
				document.querySelector("#ansWord").innerHTML = wordBank.wordList["wd" + wordBank.wordPos][0];
				document.getElementById("wordImage").src = wordBank.wordList["wd" + wordBank.wordPos][1];

				gGameRun = renderQuestion();
			}

		    showUserStatus();
		}
	}
}

