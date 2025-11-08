import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <main className="home-screen">
      <div className="hero-card">
        <p className="eyebrow">LaundryDash Platform</p>
        <h1>Choose your workspace</h1>
        <p className="subtitle">
          Mobile-friendly tools for customers and drivers. Select the experience you want to work
          on.
        </p>
        <div className="home-actions">
          <Link to="/customer" className="home-pill secondary">
            Customer App (coming soon)
          </Link>
          <Link to="/driver" className="home-pill primary">
            Driver App Prototype
          </Link>
        </div>
      </div>
      <section className="experience-grid">
        <Link to="/customer" className="experience-card disabled">
          <p className="eyebrow">Customer</p>
          <h2>On-demand laundry ordering</h2>
          <p>Placeholder screen for now. Design work pending future sprint.</p>
        </Link>
        <Link to="/driver" className="experience-card">
          <p className="eyebrow">Driver</p>
          <h2>Mobile workflow</h2>
          <ul>
            <li>Accept and manage jobs</li>
            <li>Update proof-of-pickup & delivery</li>
            <li>Track earnings & surge alerts</li>
          </ul>
        </Link>
      </section>
    </main>
  );
};

export default Home;
