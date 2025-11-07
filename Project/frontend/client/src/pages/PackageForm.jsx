import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import axios from 'axios';
import './PackageForm.css';
import { useSelector, useDispatch } from "react-redux";


const PackageForm = () => {
  const user = useSelector((state) => state.Auth.user);
  const { packageName } = useParams();
  const navigate = useNavigate();
  const formRef = useRef();
  
  const [formData, setFormData] = useState({
    userId: '',
    userName: '',
    email: '',
    package: packageName || 'silver',
    price: getPackagePrice(packageName || 'silver')
  });
  
  const [memberships, setMemberships] = useState([]);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const API_URL = 'http://localhost:6017/api/memberships';

  useEffect(() => {
    const fetchMemberships = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(API_URL);
        if (response.data && response.data.data && response.data.data.memberships) {
          setMemberships(response.data.data.memberships);
        } else {
          setError('Invalid data format received');
        }
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.response?.data?.message || 'Failed to load memberships');
      } finally {
        setIsLoading(false);
      }
    };
    fetchMemberships();
  }, []);

  function getPackagePrice(pkgName) {
    const packages = {
      'silver': '$29.99',
      'gold': '$49.99',
      'platinum': '$79.99'
    };
    return packages[pkgName?.toLowerCase()] || '$29.99';
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePackageChange = (e) => {
    const newPackage = e.target.value;
    setFormData(prev => ({
      ...prev,
      package: newPackage,
      price: getPackagePrice(newPackage)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!formData.userId || !formData.userName || !formData.email) {
      setError('Please fill all required fields');
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    
    try {
      if (editId) {
        await axios.patch(`${API_URL}/${editId}`, formData);
        setMemberships(memberships.map(item => 
          item._id === editId ? { ...item, ...formData } : item
        ));
      } else {
        const response = await axios.post(API_URL, formData);
        setMemberships([...memberships, response.data.data.membership]);
      }
      
      setFormData({
        userId: '',
        userName: '',
        email: '',
        package: packageName || 'silver',
        price: getPackagePrice(packageName || 'silver')
      });
      setEditId(null);
    } catch (err) {
      console.error('Submission error:', err);
      setError(err.response?.data?.message || 'An error occurred while saving the membership');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (id) => {
    const membership = memberships.find(item => item._id === id);
    if (membership) {
      setFormData({
        userId: membership.userId,
        userName: membership.userName,
        email: membership.email || '',
        package: membership.package,
        price: membership.price
      });
      setEditId(id);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this membership?')) {
      return;
    }
    
    setIsLoading(true);
    try {
      await axios.delete(`${API_URL}/${id}`);
      setMemberships(memberships.filter(item => item._id !== id));
    } catch (err) {
      console.error('Delete error:', err);
      setError(err.response?.data?.message || 'Failed to delete membership');
    } finally {
      setIsLoading(false);
    }
  };

  const generatePDF = (membership) => {
    const doc = new jsPDF();
    
    doc.setFontSize(20);
    doc.setTextColor(40, 53, 147);
    doc.text('OXY FITNESS', 105, 20, null, null, 'center');
    
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text('Membership Details', 105, 30, null, null, 'center');
    
    doc.setFontSize(12);
    doc.text(`User ID: ${membership.userId}`, 20, 50);
    doc.text(`User Name: ${membership.userName}`, 20, 60);
    doc.text(`Package: ${membership.package} Package`, 20, 70);
    doc.text(`Price: ${membership.price}`, 20, 80);
    
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text('Thank you for choosing OXY FITNESS!', 105, 140, null, null, 'center');
    doc.text('Generated on: ' + new Date().toLocaleDateString(), 105, 150, null, null, 'center');
    
    doc.save(`OXY_Fitness_Membership_${membership.userId}.pdf`);
  };

  const sendEmail = async (membership) => {
    if (!membership.email) {
      setError('Please enter an email address');
      return;
    }
    
    setIsLoading(true);
    setEmailSent(false);
    
    try {
      await axios.post(`${API_URL}/send-email`, {
        email: membership.email,
        membershipDetails: membership
      });
      setEmailSent(true);
      setTimeout(() => setEmailSent(false), 3000);
    } catch (err) {
      console.error('Email error:', err);
      setError(err.response?.data?.message || 'Failed to send email');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="form-container" ref={formRef}>
      <h2>Membership Registration Form</h2>
      {error && <div className="error-message">{error}</div>}
      {emailSent && <div className="success-message">Email sent successfully!</div>}
      
      <form onSubmit={handleSubmit} className="package-form">
        <div className="form-group">
          <label>User ID:</label>
          <input
            type="text"
            name="userId"
            value={formData.userId}
            onChange={handleChange}
            required
            disabled={isLoading}
          />
        </div>
        
        <div className="form-group">
          <label>User Name:</label>
          <input
            type="text"
            name="userName"
            value={formData.userName}
            onChange={handleChange}
            required
            disabled={isLoading}
          />
        </div>
        
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={isLoading}
          />
        </div>
        
        <div className="form-group">
          <label>Package:</label>
          <select
            name="package"
            value={formData.package}
            onChange={handlePackageChange}
            required
            disabled={isLoading}
          >
            <option value="silver">Silver Package ($29.99)</option>
            <option value="gold">Gold Package ($49.99)</option>
            <option value="platinum">Platinum Package ($79.99)</option>
          </select>
        </div>
        
        <div className="form-group">
          <label>Price:</label>
          <input
            type="text"
            name="price"
            value={formData.price}
            readOnly
          />
        </div>
        
        <div className="form-actions" style={{ gridColumn: 'span 2', display: 'flex', gap: '1rem' }}>
          {/* Only show submit button if user is a manager */}
  {user && user.role === 'manager' && (
          <button 
            type="submit" 
            className="submit-btn"
            disabled={isLoading}
            style={{ flex: 1 }}
          >
            {isLoading ? 'Processing...' : editId ? 'Update Membership' : 'Add Membership'}
          </button>
        
      )}

          <button 
            type="button" 
            className="buy-now-btn"
            onClick={() => {
              if (formData.userId && formData.userName && formData.email) {
                handleSubmit({ preventDefault: () => {} });
                alert('Payment gateway would open here in a real implementation');
                navigate('/eadd');
              } else {
                setError('Please fill all required fields before buying');
              }
            }}
            disabled={isLoading}
            style={{ flex: 1 }}
          >
            Buy Now
          </button>
        </div>
      </form>
{/* Only show memberships table if user is a manager */}
{user && user.role === 'manager' && (
        <>
      {isLoading && memberships.length === 0 ? (
        <div className="loading-message">Loading memberships...</div>
      ) : memberships.length > 0 ? (
        <div className="submissions-table">
          <h3>Registered Memberships</h3>
          <table>
            <thead>
              <tr>
                <th>User ID</th>
                <th>User Name</th>
                <th>Package</th>
                <th>Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {memberships.map((membership) => (
                <tr key={membership._id}>
                  <td>{membership.userId}</td>
                  <td>{membership.userName}</td>
                  <td>{membership.package}</td>
                  <td>{membership.price}</td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        onClick={() => handleEdit(membership._id)}
                        className="action-btn edit-btn"
                        disabled={isLoading}
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(membership._id)}
                        className="action-btn delete-btn"
                        disabled={isLoading}
                      >
                        Delete
                      </button>
                      <button 
                        onClick={() => generatePDF(membership)}
                        className="action-btn pdf-btn"
                        disabled={isLoading}
                      >
                        Download PDF
                      </button>
                      <button 
                        onClick={() => sendEmail(membership)}
                        className="action-btn email-btn"
                        disabled={isLoading}
                      >
                        Send Email
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="no-memberships">No memberships found</div>
      )}
            </>
      )}

      <button 
        onClick={() => navigate('/membership')}
        className="back-btn"
        disabled={isLoading}
      >
        ← Back to Packages
      </button>
    </div>
  );
};

export default PackageForm;