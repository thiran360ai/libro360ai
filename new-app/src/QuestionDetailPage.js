import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Container } from 'react-bootstrap';
import './QuestionPage.css';
const QuestionPage = () => {
  const { id } = useParams();
  const [question, setQuestion] = useState(null);

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const response = await axios.get('http://192.168.1.52:8080/api/get/program/${id}', {
          headers: {
            Accept: 'application/json',
            'ngrok-skip-browser-warning': '98547',
          },
        });
        setQuestion(response.data);
      } catch (error) {
        console.error('Error fetching question:', error);
      }
    };

    fetchQuestion();
  }, [id]);

  return (
    <Container>
      {question ? (
        <>
          <h2>{question.title}</h2>
          <p>{question.description}</p>
          {/* Add more details about the question as needed */}
        </>
      ) : (
        <p>Loading...</p>
      )}
    </Container>
  );
};

export default QuestionPage;