import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { Navbar, Nav, Button, NavDropdown, Container, Row, Col, Card, Form, Dropdown, Image } from 'react-bootstrap';
import logo from './images/T-360-Logo.png';
import './index.css';
import Info from '../src/images/infosys-logo-jpeg.png';
import Capgemini from '../src/images/Capgemini-Logo.png';
import Tcs from '../src/images/tcs_logo_1200_020621101143.png';
import Google from '../src/images/google2.0.0.1441125613.png';
import HP from '../src/images/1200px-HP_logo_2012.svg.png';
import IBM from '../src/images/416_ibm.png';
import Microsoft from '../src/images/Microsoft logo.png';
import Amazon from '../src/images/amazon logo.png';
import { FaInstagram, FaFacebook, FaLinkedin, FaYoutube } from 'react-icons/fa';
import SignUp from './SignUp.js';
import LoginPage from './LoginPage.js';
import Test from './Test.js';
import McqTestPage from './McqTestPage.js';
import QuestionPage from './QuestionPage'; 
import ProgrammingTestPage from './ProgrammingTestPage.js';
import CourseJava from './CourseJava.js';
import CoursePython from './CoursePython.js';
import CourseC from './CourseC.js';
import Dashboard from './Dashboard.js';
import Courses from './courses.js';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    // Check if user is logged in from localStorage
    const storedUser = localStorage.getItem('username');
    
    if (storedUser) {
      setIsLoggedIn(true);
      setUsername(storedUser);
      
      // Fetch user role from the API
      fetch(`https://9823-59-97-51-97.ngrok-free.app/api/quiz/users/create/user/`)
        .then(response => response.json())
        .then(data => {
          const user = data.find(user => user.username === storedUser); // Assuming username is unique
          if (user) {
            setUserRole(user.role);  // Set the user role from API response
          }
        })
        .catch(error => console.error('Error fetching user data:', error));
    }
  }, []);

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
    setUserRole('');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
  };

  return (
    <Router>
      <div className="navigation-container">
        <img src={logo} alt="Logo" className="logo" />
        <Navbar expand="lg" className="custom-navbar">
          <Navbar.Brand href="/" className="brand-name"><b>Libro360</b></Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mx-auto">
              {/* <NavDropdown title="Courses" id="basic-nav-dropdown">
                <NavDropdown.Item href="#">JAVA Programming (full course)</NavDropdown.Item>
                <NavDropdown.Item href="#">PYTHON Programming (full course)</NavDropdown.Item>
                <NavDropdown.Item href="#">Data Structures & Algo (JAVA/PYTHON)</NavDropdown.Item>
              </NavDropdown>
              <Nav.Link href="/Libro360/LoginPage">Login</Nav.Link>
              <Nav.Link href="/Libro360/SignUp">Signup</Nav.Link> */}
            </Nav>

            {isLoggedIn && (
              <Nav>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                <b>{username}</b>
                <b style={{ fontSize: '12px', color: 'gray' }}>{userRole}</b> {/* Smaller text for userRole */}
              </div>
            </Nav>
            
            )}
            <Nav className="ml-auto acc-creation">
              {isLoggedIn ? (
                <Dropdown align="end">
                  <Dropdown.Toggle variant="link" className="profile-dropdown">
                    <Image
                      src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4wTQySWL01Oo0Clt2jBav69Hxl5QjpNLbsQ&s"
                      roundedCircle
                      className="profile-icon"
                    />
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item href="/libro360/Dashboard"><b>Dashboard</b></Dropdown.Item>
                    <Dropdown.Item  href="/" onClick={handleLogout}><b>Logout</b></Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              ) : (
                <Dropdown align="end">
                    
                    <Button href="/libro360/LoginPage" variant="warning" className="get-started-btn me-3"><b>Login</b></Button>
                    <Button href="/libro360/SignUp" variant="warning" className="get-started-btn"><b>Sign Up</b></Button>
                 
                </Dropdown>
              )}
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </div>


      <Routes>

        
        
        <Route path="/libro360/LoginPage" element={<LoginPage setIsLoggedIn={setIsLoggedIn} setUsername={setUsername} setUserRole={setUserRole} />} />
        <Route path="/libro360/SignUp" element={<SignUp setIsLoggedIn={setIsLoggedIn} setUsername={setUsername} setUserRole={setUserRole} />} />
        <Route path="/libro360/Test" element={<Test />} />
        <Route path="/libro360/McqTestPage" element={<McqTestPage />} />
        <Route path="/libro360/QuestionPage" element={<QuestionPage />} />
        <Route path="/libro360/ProgrammingTestPage" element={<ProgrammingTestPage />} />
        <Route path="/libro360/CourseJava" element={<CourseJava />} />
        <Route path="/libro360/CoursePython" element={<CoursePython />} />
        <Route path="/libro360/CourseC" element={<CourseC />} />
        <Route path="/libro360/java" element={<CourseJava />} /> 
        <Route path="/libro360/python" element={<CoursePython />} /> 
        <Route path="/libro360/c" element={<CourseC />} /> 
        <Route path="/libro360/Dashboard" element={<Dashboard />}/>
        <Route path="/libro360/courses" element={<Courses />}/>


        <Route path="/" element={
            <>
             
 
             <Container fluid className="banner">
            <Row className="align-items-center">
                <Col md={6} className="banner-text">
                    <h1>
                        Welcome to <span className="highlight">Libro360</span> 
                    </h1>
                    <p>
                      <span className="highlight"><b>Libro360</b></span> is your go-to platform for mastering skills through MCQ and Programming Tests. Whether you're preparing for exams or sharpening your coding expertise, we offer tests that challenge and help you grow. Get started today and level up your skills with Libro360!
                    </p>
                    <Link to="libro360/Test">
              <Button variant="warning" className='create-test-btn'><b>Start Challenges</b></Button>
            </Link>
                    <div className="banner-icons">
                    <span>Just Click to Start your journey</span>
                    </div>
                </Col>
                <Col md={3} className="banner-image">
                    <img src="https://www.testportal.net/img/1276x1684/958802f17f/cta-v1-en-business-excel.png/m/828x0/filters:quality(75):format(webp)" alt="Excel Test" />
                </Col>
                <Col md={3} className="banner-image">
                    <img src="https://www.testportal.net/img/1276x1684/16690f87d8/cta-v1-en-business-scrum.png/m/828x0/filters:quality(75):format(webp)" alt="Scrum Test" />
                </Col>
            </Row>
        </Container>

<br/>
<br/>
<div class="logos-container">
  <div class="logos">
    <img src={Info} alt="Infosys" />
    <img src={Capgemini} alt="Capgemini" />
    <img src={Tcs} alt="TCS" />
    <img src={Google} alt="Google" />
    <img src={HP} alt="HP" />
    <img src={IBM} alt="IBM" />
    <img src={Microsoft} alt="Microsoft" />
    <img src={Amazon} alt="Amazon" />
  </div>
</div>
      <br/>
      


<Container className="resources-container my-5">
  <Row className="mb-4">
    <Col>
      <h2 className="resources-heading text-center">
        <b>Resources for our learners,</b> <span className="attract"><b>Get inspired</b></span>
      </h2>
      <p className="resources-subheading text-center">
      <b>👇 Real experiences from our community 👇</b>
      </p>
    </Col>
  </Row>
  <Row>
    {/* First Card */}
    <Col xs={12} md={4} className="d-flex align-items-stretch mb-4">
      <Card className="glass-view text-center">
        <Card.Img
          variant="top"
          src="https://d2ndap9rlps54r.cloudfront.net/DefaultUploadImages/balu.jpg"
          className="user-profile mx-auto mt-3 rounded-circle"
          alt="user1"
          style={{ width: '100px', height: '100px', objectFit: 'cover' }}
        />
        <Card.Body>
          <Card.Title>Balasuppiramaniyan V</Card.Title>
          <Card.Text>
            <p className="text-warning">⭐⭐⭐⭐⭐</p>
            <p style={{ color: '#ffffff' }}>
              “Free, fun way to learn a lot of different important coding concepts. The challenges appeal to people of all skill levels, the lessons help beginners and the forums are a great place to learn more.”
            </p>
          </Card.Text>
        </Card.Body>
      </Card>
    </Col>
    
    {/* Second Card */}
    <Col xs={12} md={4} className="d-flex align-items-stretch mb-4">
      <Card className="glass-view text-center">
        <Card.Img
          variant="top"
          src="https://d2ndap9rlps54r.cloudfront.net/DefaultUploadImages/arun.jpg"
          className="user-profile mx-auto mt-3 rounded-circle"
          alt="user2"
          style={{ width: '100px', height: '100px', objectFit: 'cover' }}
        />
        <Card.Body>
          <Card.Title>Arun Kumar R</Card.Title>
          <Card.Text>
            <p className="text-warning">⭐⭐⭐⭐⭐</p>
            <p style={{ color: '#ffffff' }}>
              “Online code processing is fast, allows for own user input. The design is quite good. A lot of how a “challenge” goes is dependent on how the author writes it, but I find a lot of them to be designed well.”
            </p>
          </Card.Text>
        </Card.Body>
      </Card>
    </Col>
    
    {/* Third Card */}
    <Col xs={12} md={4} className="d-flex align-items-stretch mb-4">
      <Card className="glass-view text-center">
        <Card.Img
          variant="top"
          src="https://d2ndap9rlps54r.cloudfront.net/DefaultUploadImages/ramanan.jpg"
          className="user-profile mx-auto mt-3 rounded-circle"
          alt="user3"
          style={{ width: '100px', height: '100px', objectFit: 'cover' }}
        />
        <Card.Body>
          <Card.Title>Ramanan Subramanian</Card.Title>
          <Card.Text>
            <p className="text-warning">⭐⭐⭐⭐⭐</p>
            <p style={{ color: '#ffffff' }}>
              “As someone new to the tech industry, Thiran 360 provides an avenue to learn new concepts without too much cost or effort.”
            </p>
          </Card.Text>
        </Card.Body>
      </Card>
    </Col>
  </Row>
</Container>
    <br/>
<br/>


<Row className="align-items-center call-to-action-row">
      <Col md={6} className="text-left">
        <Card className="call-to-action-card h-100">
          <Card.Body>
            <h1><b>Get Started</b></h1>
            <h2>Ready to become the next success story?</h2>
            <ul className="cta-list">
              <li>Discover new courses & preparatory materials</li>
              <li>Practice with our company specific mock tests</li>
              <li>Improve your performance using our Advanced Analytics</li>
              <li>Ace the interviews and launch a career</li>
              <li>Get access to special courses and programs</li>
            </ul>
          </Card.Body>
        </Card>
      </Col>
      <Col md={6} className="text-center">
        <Card>
          <Card.Body>
            <h1><b>Let's talk!</b></h1>
            <Form>
              <Form.Group controlId="formName">
                <Form.Control type="text" placeholder="Your name" />
              </Form.Group><br/>
              <Form.Group controlId="formContact">
                <Form.Control type="text" placeholder="Contact number" />
              </Form.Group><br/>
              <Form.Group controlId="formEmail">
                <Form.Control type="email" placeholder="Email" />
              </Form.Group><br/>
              <Button variant="primary" type="submit">
                Book a call
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Col>
    </Row>

    <br/>
    <br/>
    <footer className="footer">
      <Container>
        <Row>
        <Col md={4} className="footer-left">
    <div className="footer-links">
        <a href="#">Contact</a>
        <a href="#">About</a>
        <a href="#">Privacy Policy</a>
    </div>
</Col>

          <Col md={4} className="footer-center">
            {/* <p>&copy; 2023 Thiran 360 AI. All rights reserved.</p> */}
            <p>2023 Thiran 360 AI</p>
          </Col>
          <Col md={4} className="footer-right">
            <div className="social-icons">
              <a href="https://www.instagram.com/thiran360ai"><FaInstagram /></a>
              <a href="https://www.facebook.com/thiran360ai"><FaFacebook /></a>
              <a href="https://www.linkedin.com/company/thiran-360"><FaLinkedin /></a>
              <a href="https://www.youtube.com/@thiran360ai"><FaYoutube /></a>
            </div>
          </Col>
        </Row>
        <Row> 
        <Col md={12} className="text-left-content">
    <p>&copy; 2023 Thiran 360 AI. All rights reserved.</p>
</Col>



</Row>
        {/* <Row>
          <Col>
            <h5>IMPORTANT LINKS</h5>
          </Col>
        </Row>
        <Row>
          <Col md={3}>
            <h6>Course subjects</h6>
            <ul className="list-unstyled">
              <li>Web development</li>
              <li>Data science</li>
              <li>C language</li>
              <li>Web design</li>
              <li>Coding courses</li>
              <li>Aptitude courses</li>
            </ul>
          </Col>
          <Col md={3}>
            <h6>Free resources</h6>
            <ul className="list-unstyled">
              <li>Free courses</li>
              <li>Free question banks</li>
              <li>Free practice packages</li>
              <li>Free assessments</li>
            </ul>
          </Col>
          <Col md={3}>
            <h6>Prepare resources</h6>
            <ul className="list-unstyled">
              <li>TCS question paper</li>
              <li>Infosys question bank</li>
              <li>CTS latest question banks</li>
              <li>TCS coding ninja pack</li>
            </ul>
          </Col>
        </Row> */}
      </Container>
    </footer>
            </>
          } />
        </Routes>
    </Router>
  );
}

export default App;

