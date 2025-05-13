import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import './update.css';

export default function EUpdate() {
  const [formData, setFormData] = useState({
    cardHolderName: '',
    cardType: '',
    cardn: '',
    expiryMonth: '',
    csv: '',
    itemname: ''
  });
  const [publishError, setPublishError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  const navigate = useNavigate();
  const { encomid } = useParams();

  useEffect(() => {
    const fetchE = async () => {
      try {
        const res = await fetch(`http://localhost:6017/api/payment/pget?upId=${encomid}`);
        const data = await res.json();

        if (!res.ok) {
          setPublishError(data.message);
          return;
        }

        const selectedE = data.find((item) => item._id === encomid);
        if (selectedE) {
          setFormData(selectedE);
        }
      } catch (error) {
        setPublishError("Error fetching data");
      }
    };

    fetchE();
  }, [encomid]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
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
      const current = new Date();
      const currentMonth = current.getMonth() + 1;
      const currentYear = current.getFullYear() % 100;

      if (
        isNaN(month) || isNaN(year) ||
        month < 1 || month > 12 ||
        year < currentYear ||
        (year === currentYear && month < currentMonth)
      ) {
        errors.expiryMonth = 'Expiry date must be in the future';
      }
    }

    if (!formData.csv) {
      errors.csv = 'CSV is required';
    } else if (!/^\d{3,4}$/.test(formData.csv)) {
      errors.csv = 'CSV must be 3 or 4 digits';
    }

    if (!formData.itemname) errors.itemname = 'Item selection is required';

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const res = await fetch(`http://localhost:6017/api/payment/pupdate/${formData._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setPublishError(data.message);
        return;
      }

      setPublishError(null);
      alert('Update successful');
      navigate('/epayment');
    } catch (error) {
      setPublishError('Something went wrong');
    }
  };

  return (
    <div className="payment-update-container">
      <div className="overlay"></div>
      <div className="form-wrapper">
        <form onSubmit={handleSubmit} className="update-form">
          <h2>Update Payment</h2>

          <Link to="/epayment" className="back-link">Back</Link>

          <label htmlFor="cardHolderName">Card Holder Name</label>
          <input type="text" id="cardHolderName" value={formData.cardHolderName} onChange={handleChange} />
          {validationErrors.cardHolderName && <p className="error">{validationErrors.cardHolderName}</p>}

          <label htmlFor="cardType">Card Type</label>
          <input type="text" id="cardType" value={formData.cardType} onChange={handleChange} />
          {validationErrors.cardType && <p className="error">{validationErrors.cardType}</p>}

          <label htmlFor="cardn">Card Number</label>
          <input type="text" id="cardn" maxLength={19} value={formData.cardn} onChange={handleChange} />
          {validationErrors.cardn && <p className="error">{validationErrors.cardn}</p>}

          <label htmlFor="expiryMonth">Expiry Month (MM/YY)</label>
          <input type="text" id="expiryMonth" maxLength={5} value={formData.expiryMonth} onChange={handleChange} />
          {validationErrors.expiryMonth && <p className="error">{validationErrors.expiryMonth}</p>}

          <label htmlFor="csv">CSV</label>
          <input type="text" id="csv" maxLength={4} value={formData.csv} onChange={handleChange} />
          {validationErrors.csv && <p className="error">{validationErrors.csv}</p>}

          <label htmlFor="itemname">Package Name</label>
          <select id="itemname" value={formData.itemname} onChange={handleChange}>
            <option value="">-- Select an Item --</option>
            <option value="Silver Package">Silver Package ($29.99)</option>
            <option value="Gold Package">Gold Package ($49.99)</option>
            <option value="Platinum Package">Platinum Package ($79.99)</option>
          </select>
          {validationErrors.itemname && <p className="error">{validationErrors.itemname}</p>}

          <button type="submit" disabled={publishError}>Submit</button>
          {publishError && <p className="error center">{publishError}</p>}
        </form>
      </div>
    </div>
  );
}
