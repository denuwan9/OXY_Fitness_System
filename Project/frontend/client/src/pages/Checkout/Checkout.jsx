import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Checkout.css";

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { product } = location.state || {};
  
  const [checkoutForm, setCheckoutForm] = useState({
    customerName: "",
    customerEmail: "",
    memberId: "",
    deliveryAddress: "",
    deliveryCity: "",
    postalCode: "",
    customerPhone: "",
    paymentOption: "card",
    cardNumber: "",
    expiry: "",
    cvv: ""
  });

  const [formErrors, setFormErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [showOtpPopup, setShowOtpPopup] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [currentOrderId, setCurrentOrderId] = useState(null);

  useEffect(() => {
    if (!product) {
      navigate("/");
    }
  }, [product, navigate]);

  if (!product) {
    return null;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === "customerPhone") {
      const numbersOnly = value.replace(/\D/g, '');
      setCheckoutForm({
        ...checkoutForm,
        [name]: numbersOnly
      });
    } else if (name === "cardNumber") {
      const numbersOnly = value.replace(/\D/g, '');
      let formattedValue = numbersOnly.replace(/(\d{4})/g, '$1 ').trim();
      formattedValue = formattedValue.substring(0, 19);
      setCheckoutForm({
        ...checkoutForm,
        [name]: formattedValue
      });
    } else if (name === "expiry") {
      const numbersOnly = value.replace(/\D/g, '');
      let formattedValue = numbersOnly;
      if (numbersOnly.length > 2) {
        formattedValue = `${numbersOnly.substring(0, 2)}/${numbersOnly.substring(2, 4)}`;
      }
      formattedValue = formattedValue.substring(0, 5);
      setCheckoutForm({
        ...checkoutForm,
        [name]: formattedValue
      });
    } else if (name === "cvv") {
      const numbersOnly = value.replace(/\D/g, '');
      setCheckoutForm({
        ...checkoutForm,
        [name]: numbersOnly.substring(0, 4)
      });
    } else {
      setCheckoutForm({
        ...checkoutForm,
        [name]: value
      });
    }
  };

  const validateCheckoutForm = () => {
    const newErrors = {};
    
    if (!checkoutForm.customerName.trim()) newErrors.customerName = "Name is required";
    if (!checkoutForm.customerEmail.trim()) {
      newErrors.customerEmail = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(checkoutForm.customerEmail)) {
      newErrors.customerEmail = "Email is invalid";
    }
    if (!checkoutForm.deliveryAddress.trim()) newErrors.deliveryAddress = "Address is required";
    if (!checkoutForm.deliveryCity.trim()) newErrors.deliveryCity = "City is required";
    if (!checkoutForm.postalCode.trim()) newErrors.postalCode = "Postal code is required";
    if (!checkoutForm.customerPhone.trim()) {
      newErrors.customerPhone = "Phone number is required";
    } else if (!/^\d{10}$/.test(checkoutForm.customerPhone)) {
      newErrors.customerPhone = "Phone number must be 10 digits";
    }
    
    if (checkoutForm.paymentOption === "card") {
      const cardNumberDigits = checkoutForm.cardNumber.replace(/\D/g, '');
      if (cardNumberDigits.length < 16) {
        newErrors.cardNumber = "Card number must be 16 digits";
      }
      
      if (!checkoutForm.expiry) {
        newErrors.expiry = "Expiry date is required";
      } else if (!/^\d{2}\/\d{2}$/.test(checkoutForm.expiry)) {
        newErrors.expiry = "Invalid expiry format (MM/YY)";
      }
      
      if (!checkoutForm.cvv) {
        newErrors.cvv = "CVV is required";
      } else if (!/^\d{3,4}$/.test(checkoutForm.cvv)) {
        newErrors.cvv = "CVV must be 3-4 digits";
      }
    }
    
    setFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const sendOrderToBackend = async () => {
    const deliveryFee = orderTotal > 10000 ? 0 : 500;
    const totalWithDelivery = orderTotal + deliveryFee;
    
    const response = await fetch('http://localhost:6017/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customerName: checkoutForm.customerName,
        customerEmail: checkoutForm.customerEmail,
        memberId: checkoutForm.memberId,
        deliveryAddress: checkoutForm.deliveryAddress,
        deliveryCity: checkoutForm.deliveryCity,
        postalCode: checkoutForm.postalCode,
        customerPhone: checkoutForm.customerPhone,
        paymentOption: checkoutForm.paymentOption,
        cardNumber: checkoutForm.cardNumber,
        expiry: checkoutForm.expiry,
        cvv: checkoutForm.cvv,
        product: {
          ...product,
          selectedFlavor: product.selectedFlavor,
          quantity: product.quantity
        },
        orderTotal: totalWithDelivery,
        deliveryFee: deliveryFee
      })
    });

    const data = await response.json();
    
    if (response.ok) {
      return data;
    } else {
      throw new Error(data.message || 'Failed to create order');
    }
  };

  const verifyOtpWithBackend = async (orderId, otp) => {
    const response = await fetch('http://localhost:6017/api/orders/verify-otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        orderId,
        otp
      })
    });

    const data = await response.json();
    
    if (response.ok) {
      return data;
    } else {
      throw new Error(data.message || 'Failed to verify OTP');
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    if (validateCheckoutForm()) {
      setIsProcessing(true);
      try {
        const orderData = await sendOrderToBackend();
        setIsProcessing(false);
        setShowOtpPopup(true);
        setOtpSent(true);
        setCurrentOrderId(orderData.orderId);
      } catch (error) {
        setIsProcessing(false);
        alert(error.message);
      }
    }
  };

  const verifyOtp = async () => {
    if (otp.length !== 6 || !/^\d+$/.test(otp)) {
      setOtpError("Please enter a valid 6-digit OTP");
      return;
    }
    
    try {
      const verification = await verifyOtpWithBackend(currentOrderId, otp);
      
      const deliveryFee = orderTotal > 10000 ? 0 : 500;
      const totalWithDelivery = orderTotal + deliveryFee;
      
      navigate("/order-status", {
        state: {
          orderDetails: {
            ...checkoutForm,
            product: {
              ...product,
              priceValue: productPriceValue,
              quantity: product.quantity
            },
            orderNumber: verification.orderNumber,
            orderDate: new Date().toISOString(),
            orderTotal: totalWithDelivery,
            deliveryFee: deliveryFee,
            status: "processing"
          }
        }
      });
    } catch (error) {
      setOtpError(error.message);
    }
  };

  const resendOtp = () => {
    setOtp("");
    setOtpError("");
    setOtpSent(false);
    setTimeout(() => {
      setOtpSent(true);
    }, 500);
  };

  const getNumericPrice = (priceStr) => {
    return parseFloat(priceStr.replace(/[^0-9.]/g, ''));
  };

  const productPriceValue = getNumericPrice(product.newPrice);
  const orderTotal = productPriceValue * product.quantity;
  const formattedTotal = `LKR ${orderTotal.toLocaleString('en-US')}`;

  return (
    <div className="co-page-container">
      <div className="co-page-header">
        <h1>Quick Checkout</h1>
        <p>Complete your purchase in just a few steps</p>
      </div>

      <div className="co-main-content">
        <div className="co-summary-section">
          <h2>Order Summary</h2>
          <div className="co-product-item">
            <img src={product.image} alt={product.name} className="co-product-img" />
            <div className="co-product-meta">
              <h3>{product.name}</h3>
              <p>Flavor: {product.selectedFlavor}</p>
              <p>Quantity: {product.quantity}</p>
              <p className="co-product-price">{product.newPrice}</p>
            </div>
          </div>

          <div className="co-price-breakdown">
            <div className="co-price-row">
              <span>Subtotal:</span>
              <span>{product.newPrice} × {product.quantity}</span>
            </div>
            <div className="co-price-row">
              <span>Delivery:</span>
              <span>{orderTotal > 10000 ? "FREE" : "LKR 500"}</span>
            </div>
            <div className="co-price-row co-total-price">
              <span>Total:</span>
              <span>{formattedTotal}</span>
            </div>
          </div>
        </div>

        <div className="co-form-section">
          <h2>Customer Information</h2>
          <form onSubmit={handleFormSubmit}>
            <div className="co-form-field">
              <label htmlFor="customerName">Full Name</label>
              <input
                type="text"
                id="customerName"
                name="customerName"
                value={checkoutForm.customerName}
                onChange={handleInputChange}
                className={formErrors.customerName ? "co-input-error" : ""}
              />
              {formErrors.customerName && <span className="co-error-text">{formErrors.customerName}</span>}
            </div>

            <div className="co-form-field">
              <label htmlFor="customerEmail">Email Address</label>
              <input
                type="email"
                id="customerEmail"
                name="customerEmail"
                value={checkoutForm.customerEmail}
                onChange={handleInputChange}
                className={formErrors.customerEmail ? "co-input-error" : ""}
              />
              {formErrors.customerEmail && <span className="co-error-text">{formErrors.customerEmail}</span>}
            </div>

            <div className="co-form-field">
              <label htmlFor="memberId">Member ID (Optional)</label>
              <input
                type="text"
                id="memberId"
                name="memberId"
                value={checkoutForm.memberId}
                onChange={handleInputChange}
              />
            </div>

            <div className="co-form-field">
              <label htmlFor="customerPhone">Phone Number</label>
              <input
                type="tel"
                id="customerPhone"
                name="customerPhone"
                value={checkoutForm.customerPhone}
                onChange={handleInputChange}
                className={formErrors.customerPhone ? "co-input-error" : ""}
                pattern="[0-9]*"
                inputMode="numeric"
                maxLength="10"
                placeholder="Enter 10 digit phone number"
              />
              {formErrors.customerPhone && <span className="co-error-text">{formErrors.customerPhone}</span>}
            </div>

            <div className="co-form-field">
              <label htmlFor="deliveryAddress">Delivery Address</label>
              <textarea
                id="deliveryAddress"
                name="deliveryAddress"
                value={checkoutForm.deliveryAddress}
                onChange={handleInputChange}
                className={formErrors.deliveryAddress ? "co-input-error" : ""}
                rows="3"
              />
              {formErrors.deliveryAddress && <span className="co-error-text">{formErrors.deliveryAddress}</span>}
            </div>

            <div className="co-form-row">
              <div className="co-form-field">
                <label htmlFor="deliveryCity">City</label>
                <input
                  type="text"
                  id="deliveryCity"
                  name="deliveryCity"
                  value={checkoutForm.deliveryCity}
                  onChange={handleInputChange}
                  className={formErrors.deliveryCity ? "co-input-error" : ""}
                />
                {formErrors.deliveryCity && <span className="co-error-text">{formErrors.deliveryCity}</span>}
              </div>

              <div className="co-form-field">
                <label htmlFor="postalCode">Postal Code</label>
                <input
                  type="text"
                  id="postalCode"
                  name="postalCode"
                  value={checkoutForm.postalCode}
                  onChange={handleInputChange}
                  className={formErrors.postalCode ? "co-input-error" : ""}
                />
                {formErrors.postalCode && <span className="co-error-text">{formErrors.postalCode}</span>}
              </div>
            </div>

            <div className="co-payment-section">
              <h3>Payment Method</h3>
              <div className="co-payment-options">
                <label className="co-payment-choice">
                  <input
                    type="radio"
                    name="paymentOption"
                    value="card"
                    checked={checkoutForm.paymentOption === "card"}
                    onChange={handleInputChange}
                  />
                  <span>Credit/Debit Card</span>
                  <div className="co-card-brands">
                    <span>VISA</span>
                    <span>MasterCard</span>
                    <span>AMEX</span>
                  </div>
                </label>

                <label className="co-payment-choice">
                  <input
                    type="radio"
                    name="paymentOption"
                    value="helapay"
                    checked={checkoutForm.paymentOption === "helapay"}
                    onChange={handleInputChange}
                  />
                  <span>HelaPay Sri Lanka</span>
                </label>
              </div>
            </div>

            {checkoutForm.paymentOption === "card" && (
              <div className="co-card-details">
                <div className="co-form-field">
                  <label htmlFor="cardNumber">Card Number</label>
                  <input
                    type="text"
                    id="cardNumber"
                    name="cardNumber"
                    value={checkoutForm.cardNumber}
                    onChange={handleInputChange}
                    placeholder="1234 5678 9012 3456"
                    className={formErrors.cardNumber ? "co-input-error" : ""}
                    inputMode="numeric"
                  />
                  {formErrors.cardNumber && <span className="co-error-text">{formErrors.cardNumber}</span>}
                </div>

                <div className="co-form-row">
                  <div className="co-form-field">
                    <label htmlFor="expiry">Expiry Date</label>
                    <input
                      type="text"
                      id="expiry"
                      name="expiry"
                      value={checkoutForm.expiry}
                      onChange={handleInputChange}
                      placeholder="MM/YY"
                      className={formErrors.expiry ? "co-input-error" : ""}
                      inputMode="numeric"
                    />
                    {formErrors.expiry && <span className="co-error-text">{formErrors.expiry}</span>}
                  </div>

                  <div className="co-form-field">
                    <label htmlFor="cvv">CVV</label>
                    <input
                      type="text"
                      id="cvv"
                      name="cvv"
                      value={checkoutForm.cvv}
                      onChange={handleInputChange}
                      placeholder="123"
                      className={formErrors.cvv ? "co-input-error" : ""}
                      inputMode="numeric"
                      maxLength="4"
                    />
                    {formErrors.cvv && <span className="co-error-text">{formErrors.cvv}</span>}
                  </div>
                </div>
              </div>
            )}

            <button type="submit" className="co-submit-btn" disabled={isProcessing}>
              {isProcessing ? "Processing..." : "Place Order"}
            </button>
          </form>
        </div>
      </div>

      {showOtpPopup && (
        <div className="otp-popup-overlay">
          <div className="otp-popup-container">
            <div className="otp-popup-header">
              <h3>Verify Your Order</h3>
              <p>
                {otpSent 
                  ? `We've sent a 6-digit OTP to ${checkoutForm.customerPhone}`
                  : "Sending OTP..."}
              </p>
            </div>
            
            <div className="otp-input-container">
              <label htmlFor="otp">Enter OTP</label>
              <input
                type="text"
                id="otp"
                value={otp}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '');
                  setOtp(value.slice(0, 6));
                  setOtpError("");
                }}
                maxLength={6}
                placeholder="123456"
                disabled={!otpSent}
              />
              {otpError && <span className="otp-error">{otpError}</span>}
            </div>
            
            <div className="otp-popup-footer">
              <button 
                className="otp-resend-btn"
                onClick={resendOtp}
                disabled={!otpSent}
              >
                Resend OTP
              </button>
              <div className="otp-popup-actions">
                <button 
                  className="otp-cancel-btn"
                  onClick={() => setShowOtpPopup(false)}
                >
                  Cancel
                </button>
                <button 
                  className="otp-verify-btn"
                  onClick={verifyOtp}
                  disabled={!otpSent || otp.length !== 6}
                >
                  Verify & Place Order
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;