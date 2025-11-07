import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from "react-redux";
import './add.css'; // Import your custom stylesheet

export default function EAdd() {
  const [formData, setFormData] = useState({
    cardHolderName: '',
    cardType: '',
    cardn: '',
    expiryMonth: '',
    csv: '',
    itemname: ''
  });

  const user = useSelector((state) => state.Auth.user);
  const [publishError, setPublishError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.cardHolderName) errors.cardHolderName = 'Card holder name is required';
    if (!formData.cardType) errors.cardType = 'Card type is required';
    if (!formData.cardn) {
      errors.cardn = 'Card number is required';
    } else if (!/^\d{13,19}$/.test(formData.cardn)) {
      errors.cardn = 'Card number must be 13 to 19 digits';
    }

    if (!formData.expiryMonth) {
      errors.expiryMonth = 'Expiry month is required';
    } else {
      const [month, year] = formData.expiryMonth.split('/').map(Number);
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth() + 1;
      const currentYear = currentDate.getFullYear() % 100;
      if (
        isNaN(month) || isNaN(year) ||
        month < 1 || month > 12 ||
        year < currentYear ||
        (year === currentYear && month < currentMonth)
      ) {
        errors.expiryMonth = 'Card is expired or date is invalid';
      }
    }

    if (!formData.csv) {
      errors.csv = 'CSV is required';
    } else if (!/^\d{3,4}$/.test(formData.csv)) {
      errors.csv = 'CSV must be 3 or 4 digits';
    }

    if (!formData.itemname) {
      errors.itemname = 'Item name is required';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const res = await fetch("http://localhost:6017/api/payment/pcreate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        setPublishError(data.message);
        return;
      }

      setPublishError(null);
      alert("Payment submitted successfully!");
      navigate('/membership');
    } catch (error) {
      setPublishError("Something went wrong");
    }
  };

  return (
    <div className="payment-container">
      <div className="overlay"></div>
      <div className="form-wrapper">
        <form onSubmit={handleSubmit} className="payment-form">
          <h2>Payment</h2>

          <input type="text" id="cardHolderName" value={formData.cardHolderName} onChange={handleChange} placeholder="Card Holder Name" />
          {validationErrors.cardHolderName && <p className="error">{validationErrors.cardHolderName}</p>}

          <input type="text" id="cardType" value={formData.cardType} onChange={handleChange} placeholder="Card Type (e.g., Visa, MasterCard)" />
          {validationErrors.cardType && <p className="error">{validationErrors.cardType}</p>}

          <input type="text" id="cardn" maxLength={19} value={formData.cardn} onChange={handleChange} placeholder="Card Number" />
          {validationErrors.cardn && <p className="error">{validationErrors.cardn}</p>}

          <input type="text" id="expiryMonth" maxLength={5} value={formData.expiryMonth} onChange={handleChange} placeholder="Expiry (MM/YY)" />
          {validationErrors.expiryMonth && <p className="error">{validationErrors.expiryMonth}</p>}

          <input type="text" id="csv" maxLength={4} value={formData.csv} onChange={handleChange} placeholder="CSV" />
          {validationErrors.csv && <p className="error">{validationErrors.csv}</p>}

          <label htmlFor="itemname">Item Name / Package</label>
          <select id="itemname" value={formData.itemname} onChange={handleChange}>
            <option value="">-- Select an Item --</option>
            <option value="Silver Package">Silver Package ($29.99)</option>
            <option value="Gold Package">Gold Package ($49.99)</option>
            <option value="Platinum Package">Platinum Package ($79.99)</option>
          </select>
          {validationErrors.itemname && <p className="error">{validationErrors.itemname}</p>}
          
          {user?.role === "manager" && (
          <Link to="/epayment" className="back-link">Back</Link>
          )}
          {user?.role !== "manager" && (
          <Link to="/membership" className="back-link">Back</Link>
          )}

          <button type="submit" disabled={publishError}>Submit</button>

          {publishError && <p className="error">{publishError}</p>}
        </form>
      </div>
    </div>
  );
}
