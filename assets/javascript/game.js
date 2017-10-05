/***********************************************
 * GENERAL DESCRIPTION
 * - A word is randomly selected.
 * - This game is over when # of wins is 3.
 ***********************************************/

var wordBank = {
	wordList: {
		wd1: ["advertise", "assets/images/wd1_img.jpg"],
		wd2: ["zombie", "assets/images/wd2_img.jpg"],
		wd3: ["vodka", "assets/images/wd3_img.jpg"],
		wd4: ["galaxy", "assets/images/wd4_img.jpg"],
		wd5: ["cobweb", "assets/images/wd5_img.jpg"],
	},
	wordPos: 0,
	wordMax: 5,

	// set new question randomly
	getWordQuestion: function() {
		this.wordPos = Math.floor(Math.random() * this.wordMax) + 1;
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

	// initialize userData except score
	// return false when to meet game-over condition
	setNewWord: function(str) {
		this.answerWord.length = 0;
		this.userWord.length = 0;
		this.remained = 10;
		this.guessed = [];

		if(this.score.numWin < 3) {
			this.answerWord = str.split("");
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

	// check if input is a new guessed letter
	isNewGuessed: function(x) {
		if(this.guessed.indexOf(x) === -1) {
			this.guessed.push(x);
			return true;
		}
		else {
			return false;
		}
	},

	// check if a letter is one of answerWord letters
	setUserWord: function(x) {
		var idx = this.answerWord.indexOf(x);

		if(idx !== -1) {
			// can have one or more same letters in a word
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

	// make HTML to display score
	scoreHTML: function() {
		var text1 = "<ul><li># OF WINS: " + this.score.numWin + "</li>";
		var text2 = "<li># OF LOSES: " + this.score.numLose + "</li></ul>";

		return (text1 + text2);
	},

	// check if the current question is done
	isDone: function(oksnd, nosnd) {
		var rtBool = false;

		if(this.answerWord.toString() === this.userWord.toString()) {
			oksnd.play();
			this.score.numWin++;
			rtBool = true;
		}
		else if(this.remained <= 0) {
			nosnd.play();
			this.score.numLose++;
			rtBool = true;
		}

		return rtBool;
	}
}

// make new question
function renderQuestion() {
	var curQuestion = wordBank.getWordQuestion();

	return userData.setNewWord(curQuestion[0]);
}

// update HTML
function showUserStatus() {
	document.querySelector("#userWord").innerHTML = userData.userWord.toString().replace(/,/g, " ");
	document.querySelector("#userRemained").innerHTML = userData.remained;
	document.querySelector("#userGuessed").innerHTML = userData.guessed;
	document.querySelector("#userScore").innerHTML = userData.scoreHTML();
}

// declare global variables
var gGameRun = true;

gGameRun = renderQuestion();
showUserStatus();

var audBgm = document.createElement("audio");
audBgm.setAttribute("src", "assets/sound/Fur-elise-music-box.mp3");
audBgm.setAttribute("loop", "true");
audBgm.play();

var audCorrect = document.createElement("audio");
audCorrect.setAttribute("src", "assets/sound/correct-answer-effect.mp3");

var audWrong = document.createElement("audio");
audWrong.setAttribute("src", "assets/sound/wrong-answer-effect.mp3");

// keyup event
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

			if(userData.isDone(audCorrect, audWrong)) {
				document.querySelector("#ansWord").innerHTML = wordBank.wordList["wd" + wordBank.wordPos][0];
				document.getElementById("wordImage").src = wordBank.wordList["wd" + wordBank.wordPos][1];

				gGameRun = renderQuestion();
				if(gGameRun !== true) {
					audBgm.pause();			
				}
			}

		    showUserStatus();
		}
	}
}

