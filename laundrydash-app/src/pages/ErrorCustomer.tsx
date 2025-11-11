import { useNavigate } from 'react-router-dom';

const ErrorCustomer = () => {
  const navigate = useNavigate();

  const handleShowDiscountError = () => {
    alert('Invalid/Expired Discount Code');
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
          </div>
        </div>
      </section>
    </main>
  );
};

export default ErrorCustomer;
