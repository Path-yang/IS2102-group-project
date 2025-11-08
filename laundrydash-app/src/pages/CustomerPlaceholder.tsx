import { Link } from 'react-router-dom';

const CustomerPlaceholder = () => {
  return (
    <main className="placeholder-screen">
      <div className="placeholder-card">
        <p className="eyebrow">Customer App</p>
        <h1>Coming Soon</h1>
        <p>
          The LaundryDash customer experience will live here. We will wire up the order flow, bag
          subscriptions, and payment steps in a later milestone.
        </p>
        <Link to="/" className="home-pill primary">
          Back to home
        </Link>
      </div>
    </main>
  );
};

export default CustomerPlaceholder;
