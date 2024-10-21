import React, { useEffect, useState } from 'react';
import './CourseJava.css';
import { useNavigate, useLocation } from 'react-router-dom'; // Import useLocation to check the current route

const CourseJava = () => {
  const [topics, setTopics] = useState([]);
  const [languages, setLanguages] = useState([]); // State to store languages
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0); // State to track the current topic index
  const navigate = useNavigate(); // Initialize navigate
  const location = useLocation(); // Get current route path

  // Fetch topics from the new API
  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const response = await fetch('https://5aca-59-97-51-97.ngrok-free.app/compiler/content/');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
  
        // Filter content where language is 1
        const filteredTopics = data.filter(topic => topic.language === 1);
  
        // Sort the topics based on the "position" field in ascending order
        const sortedTopics = filteredTopics.sort((a, b) => a.position - b.position);
  
        setTopics(sortedTopics);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching topics:", error);
        setLoading(false);
      }
    };
  
    const fetchLanguages = async () => {
      try {
        const response = await fetch('https://5aca-59-97-51-97.ngrok-free.app/compiler/languages/');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setLanguages(data); // Save fetched languages to the state
      } catch (error) {
        console.error("Error fetching languages:", error);
      }
    };
  
    fetchTopics();
    fetchLanguages(); // Fetch languages
  }, []);
  

  // Handle topic click
  const handleTopicClick = (index) => {
    setCurrentIndex(index); // Update the current index based on the clicked topic
  };

  // Handle next button click
  const handleNext = () => {
    if (currentIndex < topics.length - 1) {
      setCurrentIndex(currentIndex + 1); // Move to the next topic
    }
  };

  // Handle previous button click
  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1); // Move to the previous topic
    }
  };

  // Helper function to convert content into a list
  const renderContentAsList = (content) => {
    // Split content by lines or specific separators, adjust this depending on your content format
    const points = content.split('\n').filter(line => line.trim() !== ''); // Remove empty lines

    return (
      <ul>
        {points.map((point, index) => (
          <li key={index}>{point}</li>
        ))}
      </ul>
    );
  };

  // Handle language navigation dynamically
  const handleLanguageNavigation = (language) => {
    const currentPath = location.pathname; // Get current path

    if (language.toLowerCase() === 'java' && currentPath === '/java') {
      // Stay on the same page if already on the Java course
      return;
    }
    if (language.toLowerCase() === 'python') {
      navigate('/python'); // Navigate to Python course
    } else if (language.toLowerCase() === 'c') {
      navigate('/c'); // Navigate to C course
    } else if (language.toLowerCase() === 'java') {
      navigate('/java'); // Navigate to Java course if not on the same page
    }
  };

  return (
    <div className="course-container">
      {/* Header Navigation */}
      <div className="header">
        <button className="nav-button" onClick={() => navigate('/')}>Home</button>

        {/* Dynamically render language buttons */}
        {languages.length > 0 ? (
          languages.map((lang, index) => (
            <button
              key={index}
              className="nav-button"
              onClick={() => handleLanguageNavigation(lang.language)} // Navigate dynamically
            >
              {lang.language}
            </button>
          ))
        ) : (
          <p>Loading languages...</p>
        )}
      </div>

      <div className="main-content">
        {/* Sidebar */}
        <div className="sidebar">
          <ul>
            {loading ? (
              <li>Loading topics...</li>
            ) : topics.length > 0 ? (
              topics.map((topic, index) => (
                <li
                  key={index}
                  onClick={() => handleTopicClick(index)} // Update index on click
                  className={index === currentIndex ? "active" : ""}
                >
                  {topic.title} {/* Display title */}
                </li>
              ))
            ) : (
              <li>No topics available</li>
            )}
          </ul>
        </div>

        {/* Main area */}
        <div className="content">
          {/* Top buttons */}
          <div className="top-buttons">
            <button className="prev-next" onClick={handlePrevious} disabled={currentIndex === 0}>Previous</button>
            <button className="prev-next" onClick={handleNext} disabled={currentIndex === topics.length - 1}>Next</button>
          </div>

          {/* Content Body */}
          <div className="content-body">
            {/* Render the selected content as bullet points */}
            {topics.length > 0 ? (
              <div>
                {renderContentAsList(topics[currentIndex].content || 'No content available.')}
              </div>
            ) : (
              <p>Select a topic to see its content.</p>
            )}
          </div>

          {/* Bottom buttons */}
          <div className="bottom-buttons">
            <button className="prev-next" onClick={handlePrevious} disabled={currentIndex === 0}>Previous</button>
            <button className="prev-next" onClick={handleNext} disabled={currentIndex === topics.length - 1}>Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseJava;
