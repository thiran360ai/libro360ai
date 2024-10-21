import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Form, Button, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faStopwatch } from '@fortawesome/free-solid-svg-icons';
import './McqTestPage.css';

const McqTestPage = () => {
  const [questions, setQuestions] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timer, setTimer] = useState(300); // 5 minutes in seconds
  const [showResult, setShowResult] = useState(false);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [selectedCorrectAnswersCount, setSelectedCorrectAnswersCount] = useState(0);
  const [resultDetails, setResultDetails] = useState([]);
  const navigate = useNavigate();

  const questionRefs = useRef([]);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch('https://5aca-59-97-51-97.ngrok-free.app/api/quiz/test/mcq/', {
          headers: {
            Accept: 'application/json',
            'ngrok-skip-browser-warning': '98547',
          },
        });
        const data = await response.json();
        if (Array.isArray(data)) {
          const orderedQuestions = data.sort((a, b) => a.question.id - b.question.id);
          setQuestions(orderedQuestions);
          setTotalQuestions(orderedQuestions.length);
        } else {
          console.error('Unexpected data format:', data);
        }
      } catch (error) {
        console.error('Error fetching MCQ data:', error);
      }
    };

    fetchQuestions();

    const countdown = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(countdown);
          handleSubmit();
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(countdown);
  }, []);

  const handleOptionChange = (questionId, optionId) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch('http://192.168.1.36/api/quiz/check_answer/', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'ngrok-skip-browser-warning': '98547',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          answers: selectedAnswers,
        }),
      });
      const result = await response.json();

      const correctCount = result.correctCount || 0;
      setCorrectAnswersCount(correctCount);

      const selectedCorrectCount = questions.reduce((count, question) => {
        const selectedOption = question.options.find(
          (option) => option.id === selectedAnswers[question.question.id]
        );
        const correctOption = question.options.find((option) => option.is_correct);

        if (selectedOption && correctOption && selectedOption.id === correctOption.id) {
          return count + 1;
        }
        return count;
      }, 0);
      setSelectedCorrectAnswersCount(selectedCorrectCount);

      setResultDetails(result.details || []);
      setShowResult(true);
    } catch (error) {
      console.error('Error verifying answers:', error);
    }
  };

  const handleClose = () => {
    setShowResult(false);
    navigate('/Test');
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      questionRefs.current[currentQuestionIndex + 1]?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
      questionRefs.current[currentQuestionIndex - 1]?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleNavClick = (index) => {
    setCurrentQuestionIndex(index);
    questionRefs.current[index]?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <Container className="mcq-container glass-morphism-container">
      <div className="timer-nav">
        <div className="timer">
          <FontAwesomeIcon icon={faStopwatch} className="icon" />
          <span className="time">{formatTime(timer)}</span>
        </div>
        <div className="question-nav-container">
          {questions.map((_, index) => (
            <div
              key={index}
              className={`question-nav-item ${selectedAnswers[questions[index].question.id] ? 'answered' : 'unanswered'} ${currentQuestionIndex === index ? 'current' : ''}`}
              onClick={() => handleNavClick(index)}
            >
              {index + 1}
            </div>
          ))}
        </div>
      </div>

      <Row className="justify-content-center">
        <Col md={8}>
          <div className="question-card sticky-card">
            {questions.length > 0 && (
              questions.map((question, index) => (
                <div
                  key={question.question.id}
                  className="question-card-content"
                  ref={(el) => (questionRefs.current[index] = el)}
                  style={{ display: index === currentQuestionIndex ? 'block' : 'none' }}
                >
                  <div className="question-text">
                    <Form.Label className="questions-font">
                      {index + 1} : {question.question.text}
                    </Form.Label>
                  </div>

                  <Form>
                    {question.options.map((option) => (
                      <div
                        key={option.id}
                        className={`option-card ${selectedAnswers[question.question.id] === option.id ? 'selected-option' : ''}`}
                        onClick={() => handleOptionChange(question.question.id, option.id)}
                      >
                        <Form.Check
                          type="radio"
                          id={`${question.question.id}-${option.id}`}
                          name={`question-${question.question.id}`}
                          value={option.id}
                          checked={selectedAnswers[question.question.id] === option.id}
                          onChange={() => handleOptionChange(question.question.id, option.id)}
                          inline
                        />
                        <label htmlFor={`${question.question.id}-${option.id}`} className="option-label">
                          {option.value}
                        </label>
                      </div>
                    ))}
                  </Form>
                </div>
              ))
            )}

            <div className="navigation-buttons">
              {currentQuestionIndex > 0 && (
                <div className="nav-text nav-prev" onClick={handlePrev}>
                  <FontAwesomeIcon icon={faChevronLeft} /> Previous
                </div>
              )}
              {currentQuestionIndex < questions.length - 1 ? (
                <div className="nav-text nav-next" onClick={handleNext}>
                  Next <FontAwesomeIcon icon={faChevronRight} />
                </div>
              ) : (
                <div className="nav-text nav-submit" onClick={handleSubmit}>
                  Submit
                </div>
              )}
            </div>
          </div>
        </Col>
      </Row>

      <Modal show={showResult} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Test Results</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>You scored {selectedCorrectAnswersCount} out of {totalQuestions}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default McqTestPage;
