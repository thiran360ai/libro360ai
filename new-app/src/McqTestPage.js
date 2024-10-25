import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Form, Button, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faStopwatch } from '@fortawesome/free-solid-svg-icons';
import './McqTestPage.css';
import axios from 'axios';

const McqTestPage = () => {
  const [questions, setQuestions] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timer, setTimer] = useState(1500); // 25 minutes in seconds
  const [showResultModal, setShowResultModal] = useState(false);
  const [confirmSubmitModal, setConfirmSubmitModal] = useState(false);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  const questionRefs = useRef([]);
  const totalAnswered = Object.keys(selectedAnswers).length;

  const fetchUserIdByUsername = async (username) => {
    try {
      const response = await axios.get(
        'https://9823-59-97-51-97.ngrok-free.app/api/quiz/users/create/user/',
        {
          headers: {
            Accept: 'application/json',
            'ngrok-skip-browser-warning': '98547',
          },
        }
      );
      const userData = response.data.find((user) => user.username === username);
      if (userData) {
        setUserId(userData.id);
      }
    } catch (err) {
      console.error('Error fetching user data.');
    }
  };

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch('https://9823-59-97-51-97.ngrok-free.app/api/quiz/test/mcq/', {
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

    const username = localStorage.getItem('username');
    if (username) {
      fetchUserIdByUsername(username);
    }

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
    setConfirmSubmitModal(false);
    if (userId === null) {
      console.error('User ID is not set.');
      return;
    }

    try {
      const response = await fetch('https://9823-59-97-51-97.ngrok-free.app/api/quiz/check_answer/', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'ngrok-skip-browser-warning': '98547',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          answers: selectedAnswers,
        }),
      });

      const result = await response.json();
      setShowResultModal(true);
    } catch (error) {
      console.error('Error submitting answers:', error);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      questionRefs.current[currentQuestionIndex + 1]?.scrollIntoView({ behavior: 'smooth' });
    } else {
      setConfirmSubmitModal(true);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
      questionRefs.current[currentQuestionIndex - 1]?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleNavClick = (index) => {
    setCurrentQuestionIndex(index);
    questionRefs.current[index]?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <Container className="mcq-container">
      <Row>
        <Col md={9} className="mcq-test-column">
          <div className="timer">
            <FontAwesomeIcon icon={faStopwatch} className="icon" />
            <span className="time">{formatTime(timer)}</span>
          </div>

          {questions.length > 0 && (
            <div className="question-card" ref={(el) => (questionRefs.current[currentQuestionIndex] = el)}>
              <div className="question-text">
                {currentQuestionIndex + 1}: {questions[currentQuestionIndex].question.text}
              </div>

              <Form>
                {questions[currentQuestionIndex].options.map((option) => (
                  <div
                    key={option.id}
                    className={`option-card ${
                      selectedAnswers[questions[currentQuestionIndex].question.id] === option.id
                        ? 'selected-option'
                        : ''
                    }`}
                    onClick={() => handleOptionChange(questions[currentQuestionIndex].question.id, option.id)}
                  >
                    <Form.Check
                      type="radio"
                      id={`${questions[currentQuestionIndex].question.id}-${option.id}`}
                      name={`question-${questions[currentQuestionIndex].question.id}`}
                      value={option.id}
                      checked={selectedAnswers[questions[currentQuestionIndex].question.id] === option.id}
                      onChange={() => handleOptionChange(questions[currentQuestionIndex].question.id, option.id)}
                      inline
                    />
                    <label htmlFor={`${questions[currentQuestionIndex].question.id}-${option.id}`}>
                      {option.value}
                    </label>
                  </div>
                ))}
              </Form>
            </div>
          )}

          <div className="navigation-buttons">
            {currentQuestionIndex > 0 && (
              <Button className="prev-btn" onClick={handlePrev}>
                <FontAwesomeIcon icon={faChevronLeft} /> Previous
              </Button>
            )}
            <Button className="next-btn" onClick={handleNext}>
              {currentQuestionIndex < questions.length - 1 ? (
                <>
                  Next <FontAwesomeIcon icon={faChevronRight} />
                </>
              ) : (
                'Submit'
              )}
            </Button>
          </div>
        </Col>

        <Col md={3} className="question-nav-column">
          <div className="question-nav">
            {questions.map((_, index) => (
              <div
                key={index}
                className={`question-nav-item ${
                  selectedAnswers[questions[index].question.id] ? 'answered' : 'unanswered'
                } ${currentQuestionIndex === index ? 'current' : ''}`}
                onClick={() => handleNavClick(index)}
              >
                {index + 1}
              </div>
            ))}
          </div>
        </Col>
      </Row>

      {/* Confirm Submit Modal */}
      <Modal show={confirmSubmitModal} onHide={() => setConfirmSubmitModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Submission</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          You have attended {totalAnswered} out of {totalQuestions} questions. Are you sure you want to submit?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setConfirmSubmitModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Sure
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Show Results Modal */}
      <Modal show={showResultModal} onHide={() => navigate('/libro360/Test')}>
        <Modal.Header closeButton>
          <Modal.Title>Quiz Results</Modal.Title>
        </Modal.Header>
        <Modal.Body>Your results have been submitted successfully.</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => navigate('/libro360/Test')}>
            Go to Test
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default McqTestPage;
