import React from 'react';
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import './ForgotPassword.css';

function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await axios.post('http://localhost:6017/forgot-password', { email }, {
                withCredentials: true
            });
            
            if (response.data.Status === "Success") {
                setSuccess(true);
                setTimeout(() => navigate('/login'), 3000);
            } else {
                setError(response.data.Status || "Something went wrong");
            }
        } catch (err) {
            setError(err.response?.data?.message || 
                    err.response?.data?.Status || 
                    "Failed to send reset link. Please try again.");
            console.error("Forgot password error:", err);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="d-flex justify-content-center align-items-center bg-secondary vh-100">
            <div className="bg-white p-3 rounded w-25">
                <h4>Forgot Password</h4>
                {success ? (
                    <div className="alert alert-success">
                        Password reset link sent to your email! Redirecting to login...
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">
                                <strong>Email</strong>
                            </label>
                            <input
                                type="email"
                                placeholder="Enter Email"
                                autoComplete="email"
                                name="email"
                                className="form-control rounded-0"
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        
                        {error && (
                            <div className="alert alert-danger mb-3">
                                {error}
                            </div>
                        )}
                        
                        <button 
                            type="submit" 
                            className="btn btn-success w-100 rounded-0"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                    Sending...
                                </>
                            ) : (
                                "Send Reset Link"
                            )}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}

export default ForgotPassword;