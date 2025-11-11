import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ErrorCustomer = () => {
  const navigate = useNavigate();
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showNetworkModal, setShowNetworkModal] = useState(false);
  const [showFundsModal, setShowFundsModal] = useState(false);
  const [showCapacityModal, setShowCapacityModal] = useState(false);

  const handleShowDiscountError = () => {
    setShowErrorModal(true);
  };

  const handleShowNetworkError = () => {
    setShowNetworkModal(true);
  };

  const handleShowFundsError = () => {
    setShowFundsModal(true);
  };

  const handleShowCapacityError = () => {
    setShowCapacityModal(true);
  };

  const handleGoHome = () => {
    navigate('/customer');
  };

  return (
    <main className="driver-app">
      <header className="driver-header">
        <div>
          <p className="eyebrow">Error Handling</p>
          <h1>Customer Error Exception</h1>
          <p className="subtitle">
            Test error scenarios and exceptions
          </p>
        </div>
      </header>

      <section className="panel">
        <div className="error-customer-content">
          <h2>Error Exception Testing</h2>
          <p>Use the buttons below to test different error scenarios:</p>

          <div className="error-actions">
            <button
              type="button"
              className="primary-action full"
              onClick={handleGoHome}
            >
              Home
            </button>

            <button
              type="button"
              className="secondary-action full error-trigger"
              onClick={handleShowDiscountError}
            >
              Invalid/Expired Discount Code
            </button>

            <button
              type="button"
              className="secondary-action full error-trigger"
              onClick={handleShowNetworkError}
            >
              Network Connection
            </button>

            <button
              type="button"
              className="secondary-action full error-trigger"
              onClick={handleShowFundsError}
            >
              Insufficient Funds
            </button>

            <button
              type="button"
              className="secondary-action full error-trigger"
              onClick={handleShowCapacityError}
            >
              Capacity Full
            </button>
          </div>
        </div>
      </section>

      {/* Discount Error Modal */}
      {showErrorModal && (
        <div className="modal-overlay" onClick={() => setShowErrorModal(false)}>
          <div className="modal-content error-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header error-header">
              <span className="error-icon">⚠️</span>
              <h2>Error</h2>
            </div>
            <div className="modal-body">
              <p>Invalid/Expired Discount Code</p>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="primary-action full"
                onClick={() => setShowErrorModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Network Error Modal */}
      {showNetworkModal && (
        <div className="modal-overlay" onClick={() => setShowNetworkModal(false)}>
          <div className="modal-content error-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header error-header">
              <span className="error-icon">📡</span>
              <h2>Network Connection Lost</h2>
            </div>
            <div className="modal-body">
              <p>Order draft saved locally</p>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="primary-action full"
                onClick={() => setShowNetworkModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Insufficient Funds Modal */}
      {showFundsModal && (
        <div className="modal-overlay" onClick={() => setShowFundsModal(false)}>
          <div className="modal-content error-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header error-header">
              <span className="error-icon">💳</span>
              <h2>Insufficient Funds</h2>
            </div>
            <div className="modal-body">
              <p>Please top-up wallet or use an alternative payment method</p>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="primary-action full"
                onClick={() => setShowFundsModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Capacity Full Modal */}
      {showCapacityModal && (
        <div className="modal-overlay" onClick={() => setShowCapacityModal(false)}>
          <div className="modal-content error-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header error-header">
              <span className="error-icon">📦</span>
              <h2>Capacity Full at Laundry Partner</h2>
            </div>
            <div className="modal-body">
              <p>We're currently at full capacity. Please try placing your order at a different time or select another laundry partner.</p>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="primary-action full"
                onClick={() => setShowCapacityModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default ErrorCustomer;
