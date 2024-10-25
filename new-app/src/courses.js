import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './courses.css'; // Assuming you have custom CSS for better styling

const Courses = () => {
  return (
    <Container className="courses-section">
      <h1 className="text-center my-4">Courses Offered</h1>
      <Row className="justify-content-center">
        {/* Java Programming Card */}
        <Col xs={12} md={6} lg={4} className="d-flex align-items-stretch">
          <Card className="glass-card">
            <Card.Img variant="top" src="https://static.vecteezy.com/system/resources/previews/022/100/210/original/java-logo-transparent-free-png.png" alt="Java Programming Logo" />
            <Card.Body className="d-flex flex-column">
              <Card.Title className="text-center">Java Programming: Mastering the art of Programming</Card.Title>
              <Card.Text className="text-center">Duration: 3 Months</Card.Text>
              <Card.Text className="text-center">Topics: 10 Chapters</Card.Text>
              <Link to="/libro360/CourseJava" className="mt-auto">
                <Button className="enroll w-100">View</Button>
              </Link>
            </Card.Body>
          </Card>
        </Col>

        {/* Python Programming Card */}
        <Col xs={12} md={6} lg={4} className="d-flex align-items-stretch">
          <Card className="glass-card">
            <Card.Img variant="top" src="https://media.licdn.com/dms/image/D5612AQHkSUwQVW4UAQ/article-cover_image-shrink_600_2000/0/1707907782041?e=2147483647&v=beta&t=bFvrpLM5SHU8v0vPcutHfUGccdtJayQSyMcmMlurwws" alt="Python Programming Logo" />
            <Card.Body className="d-flex flex-column">
              <Card.Title className="text-center">Python Essentials: Mastering the art of Programming</Card.Title>
              <Card.Text className="text-center">Duration: 3 Months</Card.Text>
              <Card.Text className="text-center">Topics: 10 Chapters</Card.Text>
              <Link to="/libro360/CoursePython" className="mt-auto">
                <Button className="enroll w-100">View</Button>
              </Link>
            </Card.Body>
          </Card>
        </Col>

        {/* Data Structures and Algorithms Card */}
        <Col xs={12} md={6} lg={4} className="d-flex align-items-stretch">
          <Card className="glass-card">
            <Card.Img variant="top" src="https://play-lh.googleusercontent.com/a4Xrc-8oQLu05mOrNPuvA_o2nZEIEnOoTH4wB91Slw_hCvuIu_Qgi440bK9mC8ml-KA=w600-h300-pc0xffffff-pd" alt="Data Structures and Algorithms Logo" />
            <Card.Body className="d-flex flex-column">
              <Card.Title className="text-center">Data Structures & Algorithms: Mastering the Basics</Card.Title>
              <Card.Text className="text-center">Duration: 3 Months</Card.Text>
              <Card.Text className="text-center">Topics: 10 Chapters</Card.Text>
              <Link to="/libro360/CourseC" className="mt-auto">
                <Button className="enroll w-100">View</Button>
              </Link>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Courses;
