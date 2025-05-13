import React, { useState } from 'react';
import './Logout.css';
import { FaSignOutAlt, FaTrashAlt, FaShieldAlt, FaSpinner, FaQuestionCircle, FaPhone, FaEnvelope } from 'react-icons/fa';
import { MdOutlineSecurity, MdHelpOutline } from 'react-icons/md';
import { post } from '../../services/ApiEndpoint';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from "react-router-dom";
import { Logout } from "../../redux/AuthSlice";
const LogoutPage = () => {
  const user = useSelector((state) => state.Auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [deleteStep, setDeleteStep] = useState(1);
  const [showHelpCenter, setShowHelpCenter] = useState(false);

 // Logout button function
   const handleLogout = async () => {
     try {
       const response = await post("/api/auth/logout");
       if (response.status === 200) {
         dispatch(Logout());
         navigate("/login");
       } else {
         console.error("Logout failed:", response.statusText);
       }
     } catch (error) {
       console.error("An error occurred during logout:", error);
     }
   };

  const handleDeleteAccount = () => {
    setShowDeleteConfirmation(true);
  };

  const proceedWithDeletion = () => {
    if (deleteStep === 1) {
      setDeleteStep(2);
    } else {
      console.log("Account deletion completed");
    }
  };

  const cancelDeletion = () => {
    setShowDeleteConfirmation(false);
    setDeleteStep(1);
  };

  const toggleHelpCenter = () => {
    setShowHelpCenter(!showHelpCenter);
  };

  return (
    <div className="logout-container__admin">
      {!showDeleteConfirmation && !showHelpCenter ? (
        <div className="logout-content__admin">
          <div className="logout-icon-container__admin">
            <FaSignOutAlt className="logout-main-icon__admin" />
          </div>
          <h2 className="logout-title__admin">Ready to Leave?</h2>
          <p className="logout-message__admin">
            You're about to sign out of your admin account. Make sure you've saved all your work.
          </p>
          
          <button 
            onClick={handleLogout}
            className="logout-button__admin"
            disabled={isLoggingOut}
          >
            {isLoggingOut ? (
              <>
                <FaSpinner className="logout-spinner__admin" /> Signing Out...
              </>
            ) : (
              <>
                <FaSignOutAlt /> Sign Out
              </>
            )}
          </button>
          
          <div className="logout-divider__admin">
            <span className="logout-divider-text__admin">OR</span>
          </div>
          
          <div className="logout-delete-option__admin">
            <h4 className="logout-delete-title__admin">
              <FaTrashAlt className="logout-delete-icon__admin" /> Permanent Action
            </h4>
            <p className="logout-delete-warning__admin">
              Deleting your account will remove all your data and cannot be undone.
            </p>
            <button 
              onClick={handleDeleteAccount}
              className="logout-delete-button__admin"
            >
              Delete My Account
            </button>
          </div>

          <div className="logout-help-section__admin">
            <button 
              onClick={toggleHelpCenter}
              className="logout-help-button__admin"
            >
              <FaQuestionCircle /> Need Help?
            </button>
          </div>
        </div>
      ) : showHelpCenter ? (
        <div className="logout-help-center__admin">
          <div className="logout-help-header__admin">
            <MdHelpOutline className="logout-help-icon__admin" />
            <h3>Help Center</h3>
            <button 
              onClick={toggleHelpCenter}
              className="logout-help-close__admin"
            >
              ×
            </button>
          </div>
          
          <div className="logout-help-content__admin">
            <div className="logout-help-item__admin">
              <FaQuestionCircle className="logout-help-item-icon__admin" />
              <h4>Frequently Asked Questions</h4>
              <p>Find answers to common questions about account management and security.</p>
            </div>
            
            <div className="logout-help-item__admin">
              <FaPhone className="logout-help-item-icon__admin" />
              <h4>Contact Support</h4>
              <p>Phone: +94 123 456 789</p>
              <p>Available 24/7 for urgent assistance</p>
            </div>
            
            <div className="logout-help-item__admin">
              <FaEnvelope className="logout-help-item-icon__admin" />
              <h4>Email Support</h4>
              <p>support@oxyfitness.com</p>
              <p>Response within 24 hours</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="logout-delete-confirm__admin">
          <div className="logout-delete-header__admin">
            <MdOutlineSecurity className="logout-delete-security-icon__admin" />
            <h3 className="logout-delete-confirm-title__admin">
              {deleteStep === 1 ? 'Confirm Account Deletion' : 'Final Verification'}
            </h3>
          </div>
          
          {deleteStep === 1 ? (
            <>
              <div className="logout-delete-alert__admin">
                <FaShieldAlt className="logout-delete-alert-icon__admin" />
                <p className="logout-delete-alert-text__admin">
                  This action cannot be undone. All your data will be permanently erased.
                </p>
              </div>
              <div className="logout-delete-details__admin">
                <p><strong>What will be deleted:</strong></p>
                <ul className="logout-delete-list__admin">
                  <li>Your admin profile information</li>
                  <li>All created content and configurations</li>
                  <li>Access history and logs</li>
                  <li>Any associated data with this account</li>
                </ul>
              </div>
            </>
          ) : (
            <>
              <div className="logout-delete-final-warning__admin">
                <FaShieldAlt className="logout-delete-warning-icon__admin" />
                <p className="logout-delete-final-text__admin">
                  <strong>Final Warning:</strong> Are you absolutely sure you want to delete your account?
                </p>
              </div>
              <div className="logout-delete-help__admin">
                <MdHelpOutline className="logout-delete-help-icon__admin" />
                <p className="logout-delete-help-text__admin">
                  If you're having issues, consider contacting support instead.
                </p>
              </div>
            </>
          )}
          
          <div className="logout-delete-buttons__admin">
            <button 
              onClick={proceedWithDeletion}
              className="logout-delete-proceed__admin"
            >
              {deleteStep === 1 ? 'I Understand, Continue' : 'Yes, Delete Permanently'}
            </button>
            <button 
              onClick={cancelDeletion}
              className="logout-delete-cancel__admin"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LogoutPage; 