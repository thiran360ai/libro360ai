import React, { useEffect, useState } from 'react';
import { Card, Button, Container, Row, Col, Spinner, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaLock } from 'react-icons/fa'; // Import lock icon
import './ProgrammingTestPage.css'; // Ensure you include your custom CSS

const LevelIndicator = ({ level }) => {
  // Set angle based on level (0 = Low, 1 = Medium, 2 = High)
  const angle = (level * 90) - 45; // Adjust the angle for the needle

  return (
    <div className="level-indicator">
      <svg className="gauge" viewBox="0 0 100 50">
        {/* Dial background */}
        <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#e6e6e6" strokeWidth="10" />
        <path d="M 10 50 A 40 40 0 0 1 50 10" fill="none" stroke="#1e88e5" strokeWidth="10" />
        <path d="M 50 10 A 40 40 0 0 1 90 50" fill="none" stroke="#1e88e5" strokeWidth="10" />

        {/* Needle */}
        <line
          x1="50"
          y1="50"
          x2={50 + 40 * Math.cos((angle - 90) * (Math.PI / 180))}
          y2={50 + 40 * Math.sin((angle - 90) * (Math.PI / 180))}
          stroke="#333"
          strokeWidth="3"
        />
      </svg>
    </div>
  );
};

const ProgrammingTestPage = () => {
  const [questions, setQuestions] = useState([]);
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterLevel, setFilterLevel] = useState(null); // Track the selected level
  const [needleLevel, setNeedleLevel] = useState(0); // Track the needle level
  const navigate = useNavigate();
  

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get('https://5aca-59-97-51-97.ngrok-free.app/compiler/questions/', {
          headers: {
            Accept: 'application/json',
            'ngrok-skip-browser-warning': '98547',
          },
        });
        if (response.status === 200) {
          setQuestions(response.data);
          setFilteredQuestions(response.data); // Initially display all questions
        } else {
          setError('Failed to fetch questions.');
        }
      } catch (error) {
        setError('An error occurred while fetching questions.');
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  // Handle filtering based on the selected level
  const handleFilter = (level) => {
    setFilterLevel(level);
    setNeedleLevel(level); // Update the needle level based on the button clicked
    const filtered = questions.filter((question) => question.level === level.toString());
    setFilteredQuestions(filtered);
  };

  const handleStart = (question) => {
    navigate('/QuestionPage', { state: { questionId: question.id, question } });
  };

  if (loading) {
    return (
      <Container className="text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="text-center">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container>
      {/* <h2 className="text-center mb-4">Programming Test</h2> */}

      {/* Speedometer Display with Levels */}
      <div className="d-flex justify-content-around align-items-center mb-4">
        <LevelIndicator level={needleLevel} /> {/* Pass the needle level here */}
      </div>

      {/* Filter Buttons */}
      <div className="level-buttons-container">
  <button className="level-button low" onClick={() => handleFilter(0)}>Low</button>
  <button className="level-button medium" onClick={() => handleFilter(1)}>Medium</button>
  <button className="level-button high" onClick={() => handleFilter(2)}>High</button>
</div>


      <Row>
        {filteredQuestions.length > 0 ? (
          filteredQuestions.map((question, index) => (
            <Col key={question.id} md={12} className="mb-4">
              <Card className="question-card">
                <Card.Body className="d-flex justify-content-between align-items-center">
                <span
      style={{
        filter: index >= 2 ? 'blur(3.5px)' : 'none', // Blur only the text
      }}
    >
      {question.question}
    </span>

    {/* <span>
      {index >= 2 ? '' : question.question} 
    </span> */}
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleStart(question)} // Pass the question object including ID
                    disabled={index >= 2} // Lock the button if it's for questions 3 and beyond
                    className="d-flex flex-column align-items-center justify-content-center"
                    style={{
                      minWidth: '80px',
                      height: '30px',
                      backgroundColor: index >= 2 ? '#cccccc' : '#017a8c', // Change background to gray if locked, otherwise keep blue
                      borderColor: index >= 2 ? '#999999' : '#017a8c', // Optional: change border color when locked
                    }} // Consistent button size
                  >
                    {index >= 2 ? (
                      <FaLock style={{ fontSize: '1.2em', color: 'gray' }} /> // Smaller lock icon
                    ) : (
                      'Start' // Show "Start" text for unlocked questions
                    )}
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <Col md={12} className="text-center">
            <p>No questions available for this level</p>
          </Col>
        )}
      </Row>
    </Container>
  );
};

export default ProgrammingTestPage;
