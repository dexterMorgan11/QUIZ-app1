function loadQuiz() {
    const fileInput = document.getElementById('csvFileInput');
    const file = fileInput.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const csvData = e.target.result;
            const quizData = parseCSV(csvData);
            renderQuiz(quizData);
        };
        reader.readAsText(file);
    }
}

function parseCSV(csvData) {
    const lines = csvData.split('\n');
    const quizData = [];
    for (let i = 1; i < lines.length; i++) {
        const cells = lines[i].split(',');
        if (cells.length === 5) {
            quizData.push({
                question: cells[0],
                options: [cells[1], cells[2], cells[3]],
                correctAnswer: cells[4].trim()
            });
        }
    }
    return quizData;
}

function renderQuiz(quizData) {
    const quizContainer = document.getElementById('quizContainer');
    quizContainer.innerHTML = '';
    quizData.forEach((questionData, index) => {
        const questionDiv = document.createElement('div');
        questionDiv.className = 'question';
        questionDiv.innerHTML = `
            <p>${index + 1}. ${questionData.question}</p>
            <input type="radio" name="q${index}" value="${questionData.options[0]}"> ${questionData.options[0]}<br>
            <input type="radio" name="q${index}" value="${questionData.options[1]}"> ${questionData.options[1]}<br>
            <input type="radio" name="q${index}" value="${questionData.options[2]}"> ${questionData.options[2]}<br>
        `;
        quizContainer.appendChild(questionDiv);
    });
    const submitButton = document.createElement('button');
    submitButton.innerHTML = 'Submit';
    submitButton.onclick = function() {
        gradeQuiz(quizData);
    };
    quizContainer.appendChild(submitButton);
}

function gradeQuiz(quizData) {
    let score = 0;
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = '';
    quizData.forEach((questionData, index) => {
        const selectedOption = document.querySelector(`input[name="q${index}"]:checked`);
        const isCorrect = selectedOption && selectedOption.value === questionData.correctAnswer;
        if (isCorrect) {
            score++;
        }
        const resultItem = document.createElement('div');
        resultItem.innerHTML = `
            <p>${index + 1}. ${questionData.question}</p>
            <p>Your answer: ${selectedOption ? selectedOption.value : 'No answer'}</p>
            <p>Correct answer: ${questionData.correctAnswer}</p>
            <p>${isCorrect ? 'Correct' : 'Wrong'}</p>
        `;
        resultDiv.appendChild(resultItem);
    });
    const finalScore = document.createElement('div');
    finalScore.innerHTML = `<p>Final Score: ${score}/${quizData.length}</p>`;
    resultDiv.appendChild(finalScore);
}