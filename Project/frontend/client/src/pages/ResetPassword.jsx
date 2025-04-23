import React from 'react'
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from 'axios'

function ResetPassword() {
    const [password, setPassword] = useState('')
    const [errors, setErrors] = useState({})
    const navigate = useNavigate()
    const {id, token} = useParams()

    // Strong password validation regex
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    const validatePassword = () => {
        const newErrors = {};
        
        if (!password) {
            newErrors.password = "Password is required.";
        } else if (password.length < 8) {
            newErrors.password = "Password must be at least 8 characters long.";
        } else if (!password.match(passwordRegex)) {
            newErrors.password = "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.";
        } else if (password.length > 128) {
            newErrors.password = "Password cannot exceed 128 characters.";
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    axios.defaults.withCredentials = true;
    const handleSubmit = (e) => {
        e.preventDefault()
        
        // Validate before submitting
        const isValid = validatePassword();
        if (!isValid) return;
        
        axios.post(`http://localhost:6017/reset-password/${id}/${token}`, {password})
        .then(res => {
            if(res.data.Status === "Success") {
                navigate('/login')
            }
        }).catch(err => console.log(err))
    }

    return(
        <div className="d-flex justify-content-center align-items-center bg-secondary vh-100">
            <div className="bg-white p-3 rounded w-25">
                <h4>Reset Password</h4>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="password">
                            <strong>New Password</strong>
                        </label>
                        <input
                            type="password"
                            placeholder="Enter Password"
                            autoComplete="off"
                            name="password"
                            className={`form-control rounded-0 ${errors.password ? 'is-invalid' : ''}`}
                            onChange={(e) => setPassword(e.target.value)}
                            onBlur={validatePassword}
                        />
                        {errors.password && (
                            <div className="invalid-feedback">{errors.password}</div>
                        )}
                        <small className="form-text text-muted">
                            
                        </small>
                    </div>
                    <button type="submit" className="btn btn-success w-100 rounded-0">
                        Update
                    </button>
                </form>
            </div>
        </div>
    )
}

export default ResetPassword;