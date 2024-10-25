import React, { useState, useEffect } from 'react';
import { Button, Form, Container, Row, Col, Dropdown, Alert } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import MonacoEditor from "@monaco-editor/react";
import './QuestionPage.css';

const QuestionPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [sourceCode, setSourceCode] = useState('');
    const [stdin, setStdin] = useState('');
    const [expectedOutput, setExpectedOutput] = useState('');
    const [result, setResult] = useState('');
    const [error, setError] = useState(null);
    const [languages, setLanguages] = useState([]);
    const [selectedLanguage, setSelectedLanguage] = useState('');
    const [passedCases, setPassedCases] = useState(0);
    const [totalCases, setTotalCases] = useState(0);
    const [isEditorLocked, setIsEditorLocked] = useState(false);
    const [output, setOutput] = useState('');
    const [showInputOutput, setShowInputOutput] = useState(false);
    const [showTestCases, setShowTestCases] = useState(false);
    const [isRunClicked, setIsRunClicked] = useState(false);
    const [isSubmitDisabled, setIsSubmitDisabled] = useState(true); 

    // Fetch user ID from localStorage
    const userId = localStorage.getItem('user_id');

    useEffect(() => {
        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen();
        }
    }, []);

    useEffect(() => {
        const fetchLanguages = async () => {
            try {
                const response = await axios.get('https://9823-59-97-51-97.ngrok-free.app/compiler/languages/', {
                    headers: {
                      Accept: 'application/json',
                      'ngrok-skip-browser-warning': '98547',
                    },
                  });
                
                if (response.status === 200) {
                    if (Array.isArray(response.data)) {
                        setLanguages(response.data);
                    } else {
                        setError('Unexpected data format.');
                    }
                } else {
                    setError('Failed to fetch languages.');
                }
            } catch (err) {
                setError('Error fetching languages.');
            }
        };
    
        fetchLanguages();
    }, []);   

    const handleLanguageChange = (lang) => {
        setSelectedLanguage(lang);
        switch (lang) {
            case 'Java':
                setSourceCode(`import java.io.*;
import java.util.*;

public class Solution {

    public static void main(String[] args) {
        /* Enter your code here. */
    }
}`);
                break;
            case 'Python':
                setSourceCode('# Write your Python code here');
                break;
            case 'C++':
                setSourceCode(`#include <iostream>

int main() {
    // Write C++ code here
    std::cout << "Hello, World!";
    return 0;
}`);
                break;
            default:
                setSourceCode('');
                break;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsRunClicked(true);

        const requestData = {
            source_code: sourceCode,
            language: selectedLanguage,
            expected_output: expectedOutput,
            question_id: location.state.question.id,
            user_id: 1,  // Add user ID here
        };

        try {
            const response = await axios.post(
                'https://9823-59-97-51-97.ngrok-free.app/compiler/run-test/',
                requestData
            );

            if (response.data.passed_cases !== undefined && response.data.total_cases !== undefined) {
                setPassedCases(response.data.passed_cases);
                setTotalCases(response.data.total_cases);
                setIsEditorLocked(true);
                setShowTestCases(true);
                setShowInputOutput(false);
            } else {
                setError('Unexpected response format.');
            }

            if (response.data.output === expectedOutput) {
                setResult('Answer correct');
            } else {
                setResult('Answer wrong');
            }
        } catch (err) {
            setError('Error submitting the answer. Please try again.');
        }
    };

    const handleCompile = async () => {
        const requestData = {
            source_code: sourceCode,
            language: selectedLanguage,
            stdin: stdin,
        };

        try {
            const compileResponse = await axios.post(
                'https://9823-59-97-51-97.ngrok-free.app/compiler/compile/',
                requestData
            );

            if (compileResponse.data.error) {
                setOutput(compileResponse.data.error);
                setIsSubmitDisabled(true); // Disable submit if there's an error
                return;
            }

            setOutput(compileResponse.data.output || 'Compiled successfully!');
            setIsSubmitDisabled(false); // Enable submit if output is generated
        } catch (err) {
            setError('Error compiling the code. Please try again.');
            setIsSubmitDisabled(true); // Disable submit in case of compile error
        }
    };

    const toggleInputOutput = () => {
        setShowInputOutput((prev) => !prev);
        setShowTestCases(false);
    };

    return (
        <Container fluid className="question-page">
            <Row className="d-flex" style={{ height: '100%' }}>
                <Col md={3} className="description-column d-flex flex-column">
                    <h4><b>Description :</b></h4>
                    <p>{location.state.question.question}</p>
                </Col>

                <Col
                    md={showInputOutput || showTestCases ? 6 : 9}
                    className="code-column d-flex flex-column"
                >
                    <div className="code-header d-flex justify-content-between align-items-center">
                        <Dropdown>
                            <Dropdown.Toggle variant="secondary" id="dropdown-basic" name="lan">
                                {selectedLanguage || 'Select Language'}
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                {languages.length > 0 ? (
                                    languages.map((langObj) => (
                                        <Dropdown.Item
                                            key={langObj.id}
                                            onClick={() => handleLanguageChange(langObj.language)}
                                        >
                                            {langObj.language}
                                        </Dropdown.Item>
                                    ))
                                ) : (
                                    <Dropdown.Item disabled>Loading languages...</Dropdown.Item>
                                )}
                            </Dropdown.Menu>
                        </Dropdown>

                        <Button variant="success" onClick={handleSubmit}>
                            Run
                        </Button>
                        <Button variant="success" onClick={toggleInputOutput}>
                            Custom Input/Output
                        </Button>
                    </div>

                    <MonacoEditor
                        height="600px"
                        language={selectedLanguage ? selectedLanguage.toLowerCase() : 'plaintext'}
                        value={sourceCode}
                        onChange={(value) => setSourceCode(value)}
                        options={{
                            selectOnLineNumbers: true,
                            theme: 'vs-dark',
                            automaticLayout: true,
                            minimap: { enabled: false },
                            scrollbar: { verticalScrollbarSize: 0, horizontalScrollbarSize: 0 },
                            padding: { top: 0, bottom: 0 },
                        }}
                    />

                    {/* Display Results */}
                    {totalCases > 0 && (
                        <div className="result mt-4">
                            {Array.from({ length: totalCases }, (_, index) => {
                                const isPassed = index < passedCases;
                                return (
                                    <Button
                                        key={index}
                                        variant={isPassed ? 'success' : 'danger'}
                                        className="m-1"
                                    >
                                        {isPassed ? 'Passed' : 'Failed'}
                                    </Button>
                                );
                            })}
                        </div>
                    )}

                    {/* Only display the result message if there are no passed cases */}
                    {totalCases === 0 && result && result !== 'Answer correct' && (
                        <div className="result mt-4">
                            <strong>{result}</strong>
                        </div>
                    )}

                    {/* Display the error message only if there are test cases run */}
                    {totalCases > 0 && error && (
                        <Alert variant="danger" className="mt-4">
                            <strong>{error}</strong>
                        </Alert>
                    )}
                </Col>

                {showInputOutput && (
                    <Col md={3} className="input-output-column">
                        <Form.Group controlId="stdinInput" className="custom-input-box">
                            <Form.Label>Input</Form.Label>
                            <div className="input-with-button" style={{ position: 'relative' }}>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    value={stdin}
                                    onChange={(e) => setStdin(e.target.value)}
                                    className="custom-textarea"
                                    style={{
                                        backgroundColor: 'black',
                                        color: 'white',
                                        border: '1px solid gray',
                                        borderRadius: '5px',
                                        resize: 'none',
                                        paddingRight: '70px',
                                    }}
                                />
                                <Button
                                    variant="success"
                                    onClick={handleCompile}
                                    style={{
                                        position: 'absolute',
                                        top: '10px',
                                        right: '10px',
                                        padding: '5px 10px',
                                        fontSize: '0.85rem',
                                        height: '30px',
                                        lineHeight: '1rem',
                                    }}
                                >
                                    Compile
                                </Button>
                            </div>
                        </Form.Group>

                        <Form.Group controlId="outputInput">
                            <Form.Label>Output</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={output}
                                readOnly
                                className="custom-textarea"
                                style={{
                                    backgroundColor: 'black',
                                    color: 'white',
                                    border: '1px solid gray',
                                    borderRadius: '5px',
                                    resize: 'none',
                                }}
                            />
                        </Form.Group>
                    </Col>
                )}
            </Row>
        </Container>
    );
};

export default QuestionPage;
