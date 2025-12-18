// Các biến DOM
const startScreen = document.getElementById('start-screen');
const quizScreen = document.getElementById('quiz-screen');
const fileUpload = document.getElementById('file-upload');
const fileNameDisplay = document.getElementById('file-name');
const startBtn = document.getElementById('start-btn');

const quizContainer = document.getElementById('quiz-screen'); // Dùng container trong quiz-screen
const answerEls = document.querySelectorAll('.answer');
const questionEl = document.getElementById('question');
const a_text = document.getElementById('a_text');
const b_text = document.getElementById('b_text');
const c_text = document.getElementById('c_text');
const d_text = document.getElementById('d_text');
const submitBtn = document.getElementById('submit');

const currentCountSpan = document.getElementById('current-count');
const totalCountSpan = document.getElementById('total-count');
const progressBar = document.getElementById('progress-bar');

let quizData = [];
let currentQuiz = 0;
let score = 0;

// --- PHẦN 1: XỬ LÝ FILE UPLOAD ---

fileUpload.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) return;

    fileNameDisplay.innerText = `Đã chọn: ${file.name}`;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const content = e.target.result;
            quizData = JSON.parse(content);
            
            // Kiểm tra dữ liệu có hợp lệ không
            if (Array.isArray(quizData) && quizData.length > 0 && quizData[0].question) {
                startBtn.style.display = 'block';
                startBtn.innerText = `Bắt đầu (${quizData.length} câu)`;
            } else {
                alert("File không đúng định dạng! Vui lòng kiểm tra lại.");
                fileNameDisplay.innerText = "Lỗi file!";
            }
        } catch (error) {
            alert("Lỗi đọc file JSON: " + error.message);
        }
    };
    reader.readAsText(file);
});

startBtn.addEventListener('click', () => {
    if (quizData.length > 0) {
        startScreen.classList.add('hidden');
        quizScreen.classList.remove('hidden');
        loadQuiz();
    }
});

// --- PHẦN 2: LOGIC TRẮC NGHIỆM (Giống bài cũ) ---

function loadQuiz() {
    deselectAnswers();
    const currentQuizData = quizData[currentQuiz];

    totalCountSpan.innerText = quizData.length;
    currentCountSpan.innerText = currentQuiz + 1;
    
    // Cập nhật thanh %
    const progressPercent = ((currentQuiz) / quizData.length) * 100;
    progressBar.style.width = `${progressPercent}%`;

    questionEl.innerText = currentQuizData.question;
    a_text.innerText = currentQuizData.a;
    b_text.innerText = currentQuizData.b;
    c_text.innerText = currentQuizData.c;
    d_text.innerText = currentQuizData.d;
}

function deselectAnswers() {
    answerEls.forEach(answerEl => answerEl.checked = false);
}

function getSelected() {
    let answer;
    answerEls.forEach(answerEl => {
        if(answerEl.checked) {
            answer = answerEl.id;
        }
    });
    return answer;
}

submitBtn.addEventListener('click', () => {
    const answer = getSelected();
    
    if(answer) {
        if(answer === quizData[currentQuiz].correct) {
            score++;
        }

        currentQuiz++;

        if(currentQuiz < quizData.length) {
            loadQuiz();
        } else {
            // Hoàn thành
            progressBar.style.width = `100%`;
            quizScreen.innerHTML = `
                <div class="result-container">
                    <h2>Bạn đã hoàn thành!</h2>
                    <p>Số câu trả lời đúng:</p>
                    <div class="result-score">${score}/${quizData.length}</div>
                    <p style="margin-top: 10px; color: #666;">
                        (${(score/quizData.length*100).toFixed(1)}%)
                    </p>
                    <button onclick="location.reload()">Chọn đề thi khác</button>
                </div>
            `;
        }
    } else {
        alert("Vui lòng chọn một đáp án!");
    }
});
