import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

const OTPVerification = () => {
    const [otp, setOtp] = useState(new Array(6).fill(""));
    const [error, setError] = useState("");
    const history = useHistory();

    const handleChange = (element, index) => {
        if (isNaN(element.value)) return;

        setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

        // Clear error message once user starts typing
        setError("");

        // Focus on the next input field
        if (element.nextSibling) {
            element.nextSibling.focus();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const enteredOtp = otp.join('');

        if (enteredOtp.length === 6) {
            console.log("Entered OTP is:", enteredOtp);
            const response = await fetch('http://localhost:8080/register/verify-otp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    enteredOtp: enteredOtp,
                    generatedOtp: localStorage.getItem('Otp'),
                }),
            });
            const result = await response.json();
            
            if (response.status === 400) {
                alert("Invalid OTP");
            } else if (response.status === 200) {
                alert('OTP verified successfully');
                history.push('/login');
            }
        } else {
            setError("Please enter a 6-digit OTP.");
        }
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.heading}>OTP Verification</h2>
            <form onSubmit={handleSubmit} style={styles.form}>
                <div style={styles.otpContainer}>
                    {otp.map((data, index) => (
                        <input
                            key={index}
                            type="text"
                            style={styles.input}
                            maxLength="1"
                            value={otp[index]}
                            onChange={(e) => handleChange(e.target, index)}
                            onFocus={(e) => e.target.select()}
                            required
                        />
                    ))}
                </div>
                {error && <p style={styles.error}>{error}</p>}
                <button type="submit" style={styles.button}>
                    Verify OTP
                </button>
            </form>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f7f7f7',
    },
    heading: {
        fontSize: '24px',
        fontWeight: '600',
        marginBottom: '24px',
        color: '#333',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    otpContainer: {
        display: 'flex',
        gap: '8px',
        marginBottom: '16px',
    },
    input: {
        width: '48px',
        height: '56px',
        fontSize: '24px',
        textAlign: 'center',
        border: '1px solid #ccc',
        borderRadius: '4px',
        outline: 'none',
        transition: 'border-color 0.2s, transform 0.2s',
    },
    error: {
        color: '#f44336',
        marginBottom: '16px',
    },
    button: {
        padding: '10px 24px',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        transition: 'background-color 0.2s, transform 0.2s',
    },
};

export default OTPVerification;
