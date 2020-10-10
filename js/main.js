'use strict'

const url = 'https://opentdb.com/api.php?amount=10&type=multiple';

let questionIndex = -1;
let questionNum = 0;
let correctCount = 0;
let incorrectCount = 0;

const body = document.querySelector('body');
const script = document.querySelector('script');
const h1 = document.createElement('h1');

let answers = [];

body.insertBefore(h1, script);

body.insertBefore(document.createElement('hr'), script);

const mainText = document.createElement('p');
body.insertBefore(mainText, script);
mainText.setAttribute('id', 'main-text');

body.insertBefore(document.createElement('hr'), script);

function initialPage() {
	h1.textContent = 'ようこそ';
	mainText.textContent = '以下のボタンをクリック';
	
	const startBtn = document.createElement('button');
	startBtn.textContent = '開始';
	startBtn.setAttribute('id', 'start-btn');
	body.insertBefore(startBtn, script);
	
	document.getElementById('start-btn').addEventListener('click', e => {
		questionIndex++;
		questionNum++;
		e.target.parentNode.removeChild(e.target);
		startQuestion();
	});
}

function startQuestion() {
	h1.textContent = '取得中';
	mainText.textContent = '少々お待ちください';
	
	fetch(url)
	.then(res => {
		return res.json();
	})
	.then(data => {
		function continueQuestion() {
			answers.push(data.results[questionIndex].correct_answer);
			answers = answers.concat(data.results[questionIndex].incorrect_answers);
			
			for(let i = answers.length - 1; i > 0; i--) {
				const j = Math.floor(Math.random() * (i + 1));
				const tmp = answers[i];
				answers[i] = answers[j];
				answers[j] = tmp;
			}
			
			h1.textContent = `問題${questionNum}`;
			mainText.textContent = data.results[questionIndex].question;
			
			const questioDetail = document.createElement('div');
			body.insertBefore(questioDetail, document.querySelector('hr'));
			
			const category = document.createElement('p');
			questioDetail.appendChild(category);
			category.textContent = `[ジャンル] ${data.results[questionIndex].category}`;
			
			const difficulty = document.createElement('p');
			questioDetail.appendChild(difficulty);
			difficulty.textContent = `[難易度] ${data.results[questionIndex].difficulty}`;
			
			const ul = document.createElement('ul');
			body.insertBefore(ul, script);
			
			for(let i = 0; i < answers.length; i++) {
				const li = document.createElement('li');
				const button = document.createElement('button');
				ul.appendChild(li);
				li.appendChild(button);
				button.textContent = answers[i];
				button.className = 'answer-btn';
			}
			
			const answerBtn = document.getElementsByClassName('answer-btn');
			
			for(let i = 0; i < answerBtn.length; i++) {
				answerBtn[i].addEventListener('click', () => {
					if (answerBtn[i].textContent === data.results[questionIndex].correct_answer) {
						correctCount++;
					} else {
						incorrectCount++;
					}
			
					questioDetail.parentNode.removeChild(questioDetail);
					ul.parentNode.removeChild(ul);
			
					answers = [];
			
					if (questionIndex === 9) {
						h1.textContent = `あなたの正解数は${correctCount}です！！`;
						mainText.textContent = '再度チャンレンジしたい場合は以下をクリック！！';
						const homeBtn = document.createElement('button');
						homeBtn.textContent = 'ホームに戻る';
						homeBtn.setAttribute('id', 'home-btn');
						body.insertBefore(homeBtn, script);
			
						questionIndex = -1;
						questionNum = 0;
						correctCount = 0;
						incorrectCount = 0;
			
						document.getElementById('home-btn').addEventListener('click', e => {
							e.target.parentNode.removeChild(e.target);
							initialPage();
						});
			
					} else {
						h1.textContent = '';
						mainText.textContent = '';
			
						questionIndex++;
						questionNum++;
			
						continueQuestion();
					}
				});
			}
		}

		continueQuestion();
	});
}

initialPage();