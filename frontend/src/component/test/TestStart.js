
import React, { useState, useEffect } from 'react';
import { Button, Card, Form } from 'react-bootstrap';

// Dữ liệu câu hỏi mẫu - sau này có thể lấy từ database
const quizData = [
  {
    id: 1,
    question: "What is the meaning of the word 'Con chó'?",
    options: ["Cat", "Dog", "Cow", "Horse"],
    correctAnswer: 1
  },
  {
    id: 2,
    question: "What is the meaning of the word 'Con mèo'?",
    options: ["Dog", "Cat", "Bird", "Fish"],
    correctAnswer: 1
  },
  {
    id: 3,
    question: "What is the meaning of the word 'Con gà'?",
    options: ["Chicken", "Duck", "Goose", "Turkey"],
    correctAnswer: 0
  },
  {
    id: 4,
    question: "What is the meaning of the word 'Con cá'?",
    options: ["Bird", "Cat", "Fish", "Dog"],
    correctAnswer: 2
  },
  {
    id: 5,
    question: "What is the meaning of the word 'Con chim'?",
    options: ["Fish", "Bird", "Cat", "Dog"],
    correctAnswer: 1
  },
  {
    id: 6,
    question: "What is the meaning of the word 'Con bò'?",
    options: ["Horse", "Pig", "Cow", "Sheep"],
    correctAnswer: 2
  },
  {
    id: 7,
    question: "What is the meaning of the word 'Con lợn'?",
    options: ["Cow", "Pig", "Horse", "Sheep"],
    correctAnswer: 1
  },
  {
    id: 8,
    question: "What is the meaning of the word 'Con vịt'?",
    options: ["Duck", "Chicken", "Goose", "Turkey"],
    correctAnswer: 0
  },
  {
    id: 9,
    question: "What is the meaning of the word 'Con ngựa'?",
    options: ["Cow", "Pig", "Horse", "Sheep"],
    correctAnswer: 2
  },
  {
    id: 10,
    question: "What is the meaning of the word 'Con cừu'?",
    options: ["Horse", "Pig", "Cow", "Sheep"],
    correctAnswer: 3
  }
];

const TestStart = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(180); // 3 phút = 180 giây
  const [isFinished, setIsFinished] = useState(false);

  // Timer countdown
  useEffect(() => {
    if (timeLeft > 0 && !isFinished) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setIsFinished(true);
    }
  }, [timeLeft, isFinished]);

  // Format time MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (questionIndex, answerIndex) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionIndex]: answerIndex
    });
  };

  const goToQuestion = (questionIndex) => {
    setCurrentQuestion(questionIndex);
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion < quizData.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handleFinish = () => {
    setIsFinished(true);
    // Tính điểm 
  };

  if (isFinished) {
    let score = 0;
    Object.keys(selectedAnswers).forEach(questionIndex => {
      if (selectedAnswers[questionIndex] === quizData[questionIndex].correctAnswer) {
        score++;
      }
    });

    return (
      <div className="test-container">
        <Card className="result-card">
          <Card.Body className="text-center">
            <h2>Bài test hoàn thành!</h2>
            <h3>Điểm số: {score}/{quizData.length}</h3>
            <p>Tỷ lệ đúng: {((score / quizData.length) * 100).toFixed(1)}%</p>
            <Button variant="primary" onClick={() => window.location.reload()}>
              Làm lại
            </Button>
          </Card.Body>
        </Card>
      </div>
    );
  }

  const currentQuestionData = quizData[currentQuestion];

  return (
    <div className="test-container">
      <div className="test-layout">
        {/* Main Question Area */}
        <div className="question-area" >
          <Card>
            <Card.Header>
              <h5>Question {currentQuestion + 1}</h5>
            </Card.Header>
            <Card.Body>
              <h6 className="question-text">{currentQuestionData.question}</h6>
              <Form>
                {currentQuestionData.options.map((option, index) => (
                  <Form.Check
                    key={index}
                    type="radio"
                    id={`q${currentQuestion}-option${index}`}
                    name={`question${currentQuestion}`}
                    label={option}
                    checked={selectedAnswers[currentQuestion] === index}
                    onChange={() => handleAnswerSelect(currentQuestion, index)}
                    className="option-item"
                  />
                ))}
              </Form>
            </Card.Body>
          </Card>

          {/* Navigation Buttons */}
          <div className="navigation-buttons">
            <Button 
              variant="secondary" 
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
            >
              Previous
            </Button>
            <Button 
              variant="primary" 
              onClick={handleNext}
              disabled={currentQuestion === quizData.length - 1}
            >
              Next
            </Button>
            <Button 
              variant="warning" 
              onClick={handleFinish}
            >
              Finish
            </Button>
          </div>
        </div>

        {/* Sidebar */}
        <div className="test-sidebar">
          {/* Timer */}
          <Card className="timer-card">
            <Card.Body className="text-center">
              <h4 className="timer">{formatTime(timeLeft)}</h4>
            </Card.Body>
          </Card>

          {/* Question Navigation */}
          <Card className="question-nav-card">
            <Card.Body>
              <div className="question-grid">
                {quizData.map((_, index) => (
                  <button
                    key={index}
                    className={`question-btn ${index === currentQuestion ? 'active' : ''} ${
                      selectedAnswers[index] !== undefined ? 'answered' : ''
                    }`}
                    onClick={() => goToQuestion(index)}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TestStart;
