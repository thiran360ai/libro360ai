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
    const [languages, setLanguages] = useState([]);  // To store languages fetched from API
    const [selectedLanguage, setSelectedLanguage] = useState('');  // Store selected language
    const [passedCases, setPassedCases] = useState(0);
    const [totalCases, setTotalCases] = useState(0);
    const [isEditorLocked, setIsEditorLocked] = useState(false);
    const [output, setOutput] = useState('');
    const [showInputOutput, setShowInputOutput] = useState(false);
    const [showTestCases, setShowTestCases] = useState(false);
    const [isRunClicked, setIsRunClicked] = useState(false);

    // Fetch languages dynamically from API on component mount
    useEffect(() => {
        const fetchLanguages = async () => {
            try {
                const response = await axios.get('https://5aca-59-97-51-97.ngrok-free.app/compiler/languages/');
                console.log('Languages response:', response.data);
                if (response.status === 200 && Array.isArray(response.data)) {
                    setLanguages(response.data);
                } else {
                    setError('Failed to fetch languages.');
                }
            } catch (err) {
                console.error('Error fetching languages:', err);
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
        setIsRunClicked(true);  // Set run button clicked to true

        const requestData = {
            source_code: sourceCode,
            language: selectedLanguage,
            expected_output: expectedOutput,
            question_id: location.state.question.id,
        };

        console.log('Request Data:', requestData);

        try {
            const response = await axios.post(
                'https://5aca-59-97-51-97.ngrok-free.app/compiler/run-test/',
                requestData
            );

            console.log('Submission response:', response.data);

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
            console.error('Submission error:', err.response ? err.response.data : err.message);
            setError('Error submitting the answer. Please try again.');
        }
    };

    const handleCompile = async () => {
        const requestData = {
            source_code: sourceCode,
            language: selectedLanguage,
            stdin: stdin,
        };

        console.log('Request Data for Compile:', requestData);

        try {
            const compileResponse = await axios.post(
                'https://5aca-59-97-51-97.ngrok-free.app/compiler/compile/',
                requestData
            );

            console.log('Compile response:', compileResponse.data);

            if (compileResponse.data.error) {
                setOutput(compileResponse.data.error);
                return;
            }

            setOutput(compileResponse.data.output || 'Compiled successfully!');
        } catch (err) {
            console.error('Compile error:', err.response ? err.response.data : err.message);
            setError('Error compiling the code. Please try again.');
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

                {showTestCases && totalCases > 0 && (
                    <Col md={3} className="input-output-column">
                        <div className="mt-5">
                            <center><h4><b>Test Case</b></h4></center>
                            {Array.from({ length: totalCases }, (_, index) => {
                                const isPassed = index < passedCases;
                                return (
                                    <Button
                                        key={index}
                                        variant={isPassed ? 'info' : 'danger'}
                                        className="mb-2"
                                        disabled
                                        block
                                    >
                                        {isPassed ? `Test Case ${index + 1} Passed` : `Test Case ${index + 1} Failed`}
                                    </Button>
                                );
                            })}
                        </div>
                    </Col>
                )}
            </Row>
            {error && <Alert variant="danger">{error}</Alert>}
            {result && <Alert variant={result === 'Answer correct' ? 'success' : 'danger'}>{result}</Alert>}
        </Container>
    );
};

export default QuestionPage;
