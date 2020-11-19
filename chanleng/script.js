
var myHeaders = new Headers();
myHeaders.append("Cookie", "PHPSESSID=0e8f99234e788e6b3a34726f85e94a71");

var requestOptions = {
	method: 'GET',
	headers: myHeaders,
	redirect: 'follow'
};

fetch("https://opentdb.com/api.php?amount=5&category=21&difficulty=easy&type=multiple", requestOptions)
	.then(response => response.text())
	.then(result => {
		appQuiz(result)
	})
	.catch(error => console.log('error', error));

const appQuiz = (res) => {
	const quizData = JSON.parse(res).results
	const quiz = quizData.map((quiz,index) => {
		const {question,correct_answer,incorrect_answers} = quiz

		return {
			...quiz,
			id : index + 1,
			question : question,
			options: [...incorrect_answers,correct_answer],
			answer : correct_answer,
			score : 0,
			status : "",
		}
	})

	const quizApp = function () {
		this.score = 0;
		this.qno = 1;
		this.currentque = 0;
		const totalque = quiz.length;


		this.displayQuiz = function (cque) {
			this.currentque = cque;
			if (this.currentque < totalque) {
				$("#tque").html(totalque);
				$("#previous").attr("disabled", false);
				$("#next").attr("disabled", false);
				$("#qid").html(quiz[this.currentque].id + '.');


				$("#question").html(quiz[this.currentque].question);
				$("#question-options").html("");
				const char = ["a","b","c","d","e","f"]
				quiz[this.currentque].options.forEach((item,index) => {
					$("#question-options").append(
						"<div class='form-check option-block'>" +
						"<label class='form-check-label'>" +
						"<input type='radio' class='form-check-input' name='option'   id='q" + char[index] + "' value='" + item + "'><span id='optionval'>" +
						item +
						"</span></label>"
					);
				})
			}
			if (this.currentque <= 0) {
				$("#previous").attr("disabled", true);
			}
			if (this.currentque >= totalque) {
				$('#next').attr('disabled', true);
				for (let i = 0; i < totalque; i++) {
					this.score = this.score + quiz[i].score;
				}
				return this.showResult(this.score);
			}
		}

		this.showResult = function (scr) {
			$("#result").addClass('result');
			$("#result").html("<h1 class='res-header'>Total Score: &nbsp;" + scr + '/' + totalque + "</h1>");
			for (let j = 0; j < totalque; j++) {
				let res;
				if (quiz[j].score == 0) {
					res = '<span class="wrong">' + quiz[j].score + '</span><i class="fa fa-remove c-wrong"></i>';
				} else {
					res = '<span class="correct">' + quiz[j].score + '</span><i class="fa fa-check c-correct"></i>';
				}
				$("#result").append(
					'<div class="result-question"><span>Q ' + quiz[j].id + '</span> &nbsp;' + quiz[j].question + '</div>' +
					'<div><b>Correct answer:</b> &nbsp;' + quiz[j].answer + '</div>' +
					'<div class="last-row"><b>Score:</b> &nbsp;' + res +

					'</div>'

				);

			}
		}

		this.checkAnswer = function (option) {
			const answer = quiz[this.currentque].answer;
			option = option.replace(/\</g, "&lt;") 
			option = option.replace(/\>/g, "&gt;") 
			option = option.replace(/"/g, "&quot;")

			if (option == quiz[this.currentque].answer) {
				if (quiz[this.currentque].score == "") {
					quiz[this.currentque].score = 1;
					quiz[this.currentque].status = "correct";
				}
			} else {
				quiz[this.currentque].status = "wrong";
			}

		}

		this.changeQuestion = function (cque) {
			this.currentque = this.currentque + cque;
			this.displayQuiz(this.currentque);

		}

	}


	const jsq = new quizApp();

	let selectedopt;
	$(document).ready(function () {
		jsq.displayQuiz(0);

		$('#question-options').on('change', 'input[type=radio][name=option]', function (e) {

			//const radio = $(this).find('input:radio');
			$(this).prop("checked", true);
			selectedopt = $(this).val();
		});



	});




	$('#next').click(function (e) {
		e.preventDefault();
		if (selectedopt) {
			jsq.checkAnswer(selectedopt);
		}
		jsq.changeQuestion(1);
	});

	$('#previous').click(function (e) {
		e.preventDefault();
		if (selectedopt) {
			jsq.checkAnswer(selectedopt);
		}
		jsq.changeQuestion(-1);
	});
}