import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Dropdown, Form } from 'react-bootstrap';
import { FaCheckCircle, FaQuestionCircle, FaClipboardList } from 'react-icons/fa';
import { Radar } from 'react-chartjs-2';
import { Chart, LineElement, CategoryScale, LinearScale, PointElement, LineController, Title, Tooltip, Legend, RadialLinearScale } from 'chart.js'; 
import './Dashboard.css'; 

// Registering chart.js components
Chart.register(LineElement, CategoryScale, LinearScale, PointElement, LineController, Title, Tooltip, Legend, RadialLinearScale);

const Dashboard = ({ username }) => {
  // Radar chart data and options (only for "Coding")
  const radarData = {
    labels: ['Series Completion', 'Hash Tables', 'Partnership', 'Clocks & Calendar', 'Alligation & Mixture', 'Ratio & Proportion'],
    datasets: [
      {
        label: 'Coding',  // Static label for "Coding"
        data: [3, 4, 2, 5, 4, 3],  // Static data for "Coding"
        backgroundColor: 'rgba(101, 92, 242, 0.2)',
        borderColor: '#655cf2',
        pointBackgroundColor: '#655cf2',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#655cf2',
        borderWidth: 2,
      },
    ],
  };

  const radarOptions = {
    scales: {
      r: {
        beginAtZero: true,
      },
    },
  };

  useEffect(() => {
    // Initialize the chart for Questions Solved
    const ctx = document.getElementById('questionsSolvedChart').getContext('2d');
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
          label: 'Questions Solved',
          data: [12, 19, 3, 5, 2, 3, 7],  // Example data
          fill: true,
          backgroundColor: 'rgba(101, 92, 242, 0.2)',
          borderColor: '#655cf2',
          tension: 0.1,
          borderWidth: 2,
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }, []);

  return (
    <Container fluid className="dashboard-container">
      {/* Header Section */}
      <Row className="header-section">
        <Col>
          <Card className="header-card">
            <Card.Body>
              <div className="welcome-section">
                <h2>Hi <span className="highlight-text">{username}</span>, Welcome</h2>
                <p>Let's Prepare, Practice, and Perform!</p>
              </div>
              <img src="path-to-image.jpg" alt="Welcome Image" className="header-image" />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Stats Section */}
      <Row className="stats-section">
        <Col md={3}>
          <Card className="stat-card">
            <Card.Body>
              <FaQuestionCircle size={40} />
              <Card.Title>0</Card.Title>
              <Card.Text>Questions Solved</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="stat-card">
            <Card.Body>
              <FaCheckCircle size={40} />
              <Card.Title>3</Card.Title>
              <Card.Text>Practice Package Enrolled</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="stat-card">
            <Card.Body>
              <FaClipboardList size={40} />
              <Card.Title>0</Card.Title>
              <Card.Text>Assessment Pending</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="stat-card">
            <Card.Body>
              <FaClipboardList size={40} />
              <Card.Title>39.33%</Card.Title>
              <Card.Text>Avg Assessment Marks</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Topics Section */}
      <Row className="topics-section">
        <Col md={6}>
          <Card className="topic-card">
            <Card.Body>
              <Card.Title>Topics</Card.Title>

              {/* Dropdown for selecting time period */}
              <Dropdown className="time-dropdown">
                <Dropdown.Toggle variant="outline-secondary" id="dropdown-basic">
                  Past Week
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item href="#">Past Week</Dropdown.Item>
                  <Dropdown.Item href="#">Past Month</Dropdown.Item>
                  <Dropdown.Item href="#">Past Year</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>

              {/* Radar chart for "Coding" */}
              <Radar data={radarData} options={radarOptions} />
            </Card.Body>
          </Card>
        </Col>

        {/* Questions Solved Section */}
        <Col md={6}>
          <Card className="topic-card">
            <Card.Body>
              <Card.Title>Questions Solved</Card.Title>
              <canvas id="questionsSolvedChart"></canvas> {/* Chart */}
              <p>Questions solved over the week</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

    </Container>
  );
};

export default Dashboard;
