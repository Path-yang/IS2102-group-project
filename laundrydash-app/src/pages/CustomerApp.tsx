import { useState } from 'react';
import { Link } from 'react-router-dom';

type TabKey = 'home' | 'track' | 'orders' | 'profile';

type Service = {
  id: string;
  name: string;
  description: string;
  price: string;
  duration: string;
  icon: string;
};

type Order = {
  id: string;
  service: string;
  status: string;
  pickupDate: string;
  deliveryDate: string;
  total: number;
  items: number;
  driver?: string;
  address: string;
};

type OrderStatus = {
  label: string;
  detail: string;
  completed: boolean;
};

const services: Service[] = [
  {
    id: 'wash-fold',
    name: 'Wash & Fold',
    description: 'Standard cleaning for everyday garments',
    price: '$2.50/kg',
    duration: '24-48 hours',
    icon: '👕',
  },
  {
    id: 'dry-clean',
    name: 'Dry Clean',
    description: 'Professional dry cleaning for delicate items',
    price: '$8.00/item',
    duration: '48-72 hours',
    icon: '🧥',
  },
  {
    id: 'premium',
    name: 'Premium Care',
    description: 'Expert handling for luxury fabrics',
    price: '$15.00/item',
    duration: '3-5 days',
    icon: '✨',
  },
  {
    id: 'express',
    name: 'Express Service',
    description: 'Same-day turnaround available',
    price: '+50% surcharge',
    duration: '4-8 hours',
    icon: '⚡',
  },
];

const activeOrderSeed: Order = {
  id: 'LD-C-8821',
  service: 'Wash & Fold + Dry Clean',
  status: 'pickup',
  pickupDate: 'Today, 2:30 PM',
  deliveryDate: 'Tomorrow, 6:00 PM',
  total: 28.5,
  items: 12,
  driver: 'Ahmad Tan',
  address: '123 Orchard Road, #05-67, 238858',
};

const orderHistorySeed: Order[] = [
  {
    id: 'LD-C-8820',
    service: 'Wash & Fold',
    status: 'Completed',
    pickupDate: 'Nov 5, 10:00 AM',
    deliveryDate: 'Nov 6, 6:00 PM',
    total: 18.75,
    items: 8,
    address: '123 Orchard Road, #05-67, 238858',
  },
  {
    id: 'LD-C-8819',
    service: 'Dry Clean',
    status: 'Completed',
    pickupDate: 'Nov 1, 2:00 PM',
    deliveryDate: 'Nov 3, 5:00 PM',
    total: 32.0,
    items: 4,
    address: '123 Orchard Road, #05-67, 238858',
  },
];

const CustomerApp = () => {
  const [activeTab, setActiveTab] = useState<TabKey>('home');
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [activeOrder] = useState<Order | null>(activeOrderSeed);
  const [orderHistory] = useState<Order[]>(orderHistorySeed);

  // Form state
  const [pickupAddress, setPickupAddress] = useState('123 Orchard Road, #05-67, 238858');
  const [pickupDate, setPickupDate] = useState('');
  const [pickupTime, setPickupTime] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');

  const tabs: Array<{ key: TabKey; label: string }> = [
    { key: 'home', label: 'Home' },
    { key: 'track', label: 'Track Order' },
    { key: 'orders', label: 'Orders' },
    { key: 'profile', label: 'Profile' },
  ];

  const orderStatusSteps: OrderStatus[] = [
    {
      label: 'Order Placed',
      detail: 'Your order has been confirmed',
      completed: true,
    },
    {
      label: 'Driver Assigned',
      detail: activeOrder?.driver ? `${activeOrder.driver} is on the way` : 'Finding a driver nearby',
      completed: !!activeOrder?.driver,
    },
    {
      label: 'Pickup Complete',
      detail: 'Your items have been collected',
      completed: activeOrder?.status === 'processing' || activeOrder?.status === 'ready' || activeOrder?.status === 'delivery',
    },
    {
      label: 'In Processing',
      detail: 'Your laundry is being cleaned',
      completed: activeOrder?.status === 'ready' || activeOrder?.status === 'delivery',
    },
    {
      label: 'Ready for Delivery',
      detail: 'Clean laundry ready to return',
      completed: activeOrder?.status === 'delivery',
    },
    {
      label: 'Delivered',
      detail: 'Enjoy your fresh laundry!',
      completed: activeOrder?.status === 'completed',
    },
  ];

  const handleSchedulePickup = () => {
    if (selectedService && pickupDate && pickupTime) {
      // This would normally make an API call
      alert(`Pickup scheduled!\nService: ${selectedService}\nDate: ${pickupDate}\nTime: ${pickupTime}\nAddress: ${pickupAddress}`);
      setShowScheduleForm(false);
      setSelectedService(null);
      setActiveTab('track');
    } else {
      alert('Please fill in all required fields');
    }
  };

  const handleServiceSelect = (serviceId: string) => {
    setSelectedService(serviceId);
    setShowScheduleForm(true);
  };

  const handleReorder = (order: Order) => {
    alert(`Reordering: ${order.service}\nOrder ID: ${order.id}`);
    setActiveTab('home');
  };

  return (
    <main className="driver-app">
      <header className="driver-header">
        <div>
          <p className="eyebrow">LaundryDash Customer</p>
          <h1>Your Laundry Service</h1>
          <p className="subtitle">
            Schedule pickups, track orders, and enjoy fresh laundry delivered to your door.
          </p>
        </div>
        <Link to="/" className="home-pill secondary small-pill">
          Home
        </Link>
      </header>

      <nav className="driver-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            className={activeTab === tab.key ? 'tab active' : 'tab'}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {/* HOME TAB - Service Selection */}
      {activeTab === 'home' && (
        <section className="panel">
          {!showScheduleForm ? (
            <>
              <div className="customer-welcome">
                <h2>Choose Your Service</h2>
                <p>Select a laundry service to get started</p>
              </div>

              <div className="services-grid">
                {services.map((service) => (
                  <div
                    key={service.id}
                    className="service-card"
                    onClick={() => handleServiceSelect(service.id)}
                  >
                    <div className="service-icon">{service.icon}</div>
                    <h3>{service.name}</h3>
                    <p className="service-desc">{service.description}</p>
                    <div className="service-meta">
                      <span className="service-price">{service.price}</span>
                      <span className="service-duration">{service.duration}</span>
                    </div>
                  </div>
                ))}
              </div>

              {activeOrder && (
                <div className="alert-card">
                  <p className="eyebrow">Active Order</p>
                  <h3>{activeOrder.id}</h3>
                  <p>
                    {activeOrder.service} · {activeOrder.items} items
                  </p>
                  <button
                    type="button"
                    className="secondary-action"
                    onClick={() => setActiveTab('track')}
                  >
                    Track Order
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="schedule-form">
              <div className="form-header">
                <h2>Schedule Pickup</h2>
                <button
                  type="button"
                  className="ghost small"
                  onClick={() => {
                    setShowScheduleForm(false);
                    setSelectedService(null);
                  }}
                >
                  Cancel
                </button>
              </div>

              <div className="form-field">
                <label htmlFor="service">Selected Service</label>
                <input
                  id="service"
                  type="text"
                  value={services.find((s) => s.id === selectedService)?.name || ''}
                  disabled
                  className="input-field"
                />
              </div>

              <div className="form-field">
                <label htmlFor="address">Pickup Address</label>
                <input
                  id="address"
                  type="text"
                  value={pickupAddress}
                  onChange={(e) => setPickupAddress(e.target.value)}
                  placeholder="Enter your address"
                  className="input-field"
                />
              </div>

              <div className="form-row">
                <div className="form-field">
                  <label htmlFor="date">Pickup Date</label>
                  <input
                    id="date"
                    type="date"
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                    className="input-field"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="time">Pickup Time</label>
                  <select
                    id="time"
                    value={pickupTime}
                    onChange={(e) => setPickupTime(e.target.value)}
                    className="input-field"
                  >
                    <option value="">Select time</option>
                    <option value="09:00">09:00 AM</option>
                    <option value="10:00">10:00 AM</option>
                    <option value="11:00">11:00 AM</option>
                    <option value="12:00">12:00 PM</option>
                    <option value="14:00">02:00 PM</option>
                    <option value="15:00">03:00 PM</option>
                    <option value="16:00">04:00 PM</option>
                    <option value="17:00">05:00 PM</option>
                    <option value="18:00">06:00 PM</option>
                  </select>
                </div>
              </div>

              <div className="form-field">
                <label htmlFor="instructions">Special Instructions (Optional)</label>
                <textarea
                  id="instructions"
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  placeholder="E.g., Ring doorbell, fragile items, specific stains..."
                  className="input-field textarea"
                  rows={3}
                />
              </div>

              <div className="form-summary">
                <div className="summary-row">
                  <span>Estimated Pickup</span>
                  <strong>{pickupDate && pickupTime ? `${pickupDate} at ${pickupTime}` : 'Not set'}</strong>
                </div>
                <div className="summary-row">
                  <span>Estimated Delivery</span>
                  <strong>24-48 hours after pickup</strong>
                </div>
              </div>

              <button
                type="button"
                className="primary-action full"
                onClick={handleSchedulePickup}
              >
                Confirm Pickup
              </button>
            </div>
          )}
        </section>
      )}

      {/* TRACK ORDER TAB */}
      {activeTab === 'track' && (
        <section className="panel">
          {activeOrder ? (
            <>
              <div className="job-card">
                <div className="job-top">
                  <div>
                    <p className="eyebrow">Active Order</p>
                    <h3>{activeOrder.id}</h3>
                  </div>
                  <span className="pill">In Progress</span>
                </div>
                <p className="customer-line">
                  {activeOrder.service} · {activeOrder.items} items
                </p>
                <p className="label">Pickup Address</p>
                <p>{activeOrder.address}</p>
                <p className="label">Pickup Scheduled</p>
                <p>{activeOrder.pickupDate}</p>
                <p className="label">Expected Delivery</p>
                <p>{activeOrder.deliveryDate}</p>
                <div className="badge-row compact">
                  <span>${activeOrder.total.toFixed(2)}</span>
                  <span>{activeOrder.items} items</span>
                </div>
              </div>

              {activeOrder.driver && (
                <div className="driver-info-card">
                  <p className="eyebrow">Your Driver</p>
                  <div className="driver-info">
                    <div className="driver-avatar">👤</div>
                    <div>
                      <h3>{activeOrder.driver}</h3>
                      <p>Arriving in 5-10 minutes</p>
                    </div>
                  </div>
                  <div className="actions-grid">
                    <button type="button" className="secondary-action">
                      Call Driver
                    </button>
                    <button type="button" className="secondary-action">
                      Message
                    </button>
                  </div>
                </div>
              )}

              <div className="timeline">
                <h3>Order Progress</h3>
                {orderStatusSteps.map((step, index) => (
                  <div key={index} className="timeline-item">
                    <div className={step.completed ? 'dot active' : 'dot'} />
                    <div>
                      <p className="timeline-title">{step.label}</p>
                      <p className="timeline-detail">{step.detail}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="route-card">
                <p className="eyebrow">Live Tracking</p>
                <div className="map-card">
                  <iframe
                    title="Singapore order tracking"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d127654.62967623472!2d103.68375801280434!3d1.344377213089884!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31da11241b5398ab%3A0x500f7acaedaa150!2sSingapore!5e0!3m2!1sen!2ssg!4v1731000000000!5m2!1sen!2ssg"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </div>

              <button type="button" className="ghost full">
                Need Help? Contact Support
              </button>
            </>
          ) : (
            <div className="empty-state">
              <p className="eyebrow">Track Order</p>
              <h3>No active orders</h3>
              <p>Schedule a pickup to start tracking your laundry.</p>
              <button
                type="button"
                className="secondary-action"
                onClick={() => setActiveTab('home')}
              >
                Schedule Pickup
              </button>
            </div>
          )}
        </section>
      )}

      {/* ORDERS TAB - History */}
      {activeTab === 'orders' && (
        <section className="panel">
          <div className="orders-header">
            <h2>Order History</h2>
            <p>{orderHistory.length} completed orders</p>
          </div>

          {activeOrder && (
            <div className="order-section">
              <h3>Active Order</h3>
              <article className="order-card">
                <div className="order-header">
                  <div>
                    <p className="eyebrow">{activeOrder.id}</p>
                    <h4>{activeOrder.service}</h4>
                  </div>
                  <span className="pill">In Progress</span>
                </div>
                <div className="order-details">
                  <div className="order-detail-row">
                    <span className="label">Pickup</span>
                    <span>{activeOrder.pickupDate}</span>
                  </div>
                  <div className="order-detail-row">
                    <span className="label">Delivery</span>
                    <span>{activeOrder.deliveryDate}</span>
                  </div>
                  <div className="order-detail-row">
                    <span className="label">Items</span>
                    <span>{activeOrder.items} items</span>
                  </div>
                  <div className="order-detail-row">
                    <span className="label">Total</span>
                    <strong>${activeOrder.total.toFixed(2)}</strong>
                  </div>
                </div>
                <button
                  type="button"
                  className="secondary-action"
                  onClick={() => setActiveTab('track')}
                >
                  Track Order
                </button>
              </article>
            </div>
          )}

          <div className="order-section">
            <h3>Past Orders</h3>
            {orderHistory.map((order) => (
              <article key={order.id} className="order-card">
                <div className="order-header">
                  <div>
                    <p className="eyebrow">{order.id}</p>
                    <h4>{order.service}</h4>
                  </div>
                  <span className="pill subtle">{order.status}</span>
                </div>
                <div className="order-details">
                  <div className="order-detail-row">
                    <span className="label">Completed</span>
                    <span>{order.deliveryDate}</span>
                  </div>
                  <div className="order-detail-row">
                    <span className="label">Items</span>
                    <span>{order.items} items</span>
                  </div>
                  <div className="order-detail-row">
                    <span className="label">Total</span>
                    <strong>${order.total.toFixed(2)}</strong>
                  </div>
                </div>
                <div className="order-actions">
                  <button type="button" className="ghost" onClick={() => handleReorder(order)}>
                    Reorder
                  </button>
                  <button type="button" className="ghost">
                    View Receipt
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* PROFILE TAB */}
      {activeTab === 'profile' && (
        <section className="panel">
          <div className="profile-section">
            <div className="profile-header">
              <div className="profile-avatar">👤</div>
              <div>
                <h2>Sarah Chen</h2>
                <p>sarah.chen@email.com</p>
              </div>
            </div>
          </div>

          <div className="profile-section">
            <h3>Saved Addresses</h3>
            <div className="address-card">
              <div>
                <p className="eyebrow">Home</p>
                <p>123 Orchard Road, #05-67, 238858</p>
              </div>
              <button type="button" className="ghost small">
                Edit
              </button>
            </div>
            <button type="button" className="secondary-action">
              Add New Address
            </button>
          </div>

          <div className="profile-section">
            <h3>Payment Methods</h3>
            <div className="payment-card">
              <div>
                <p className="eyebrow">Credit Card</p>
                <p>•••• •••• •••• 4242</p>
              </div>
              <button type="button" className="ghost small">
                Edit
              </button>
            </div>
            <button type="button" className="secondary-action">
              Add Payment Method
            </button>
          </div>

          <div className="profile-section">
            <h3>Preferences</h3>
            <div className="preference-item">
              <div>
                <p className="preference-label">Notifications</p>
                <p className="preference-desc">Receive updates about your orders</p>
              </div>
              <label className="switch">
                <input type="checkbox" defaultChecked />
                <span className="slider" />
              </label>
            </div>
            <div className="preference-item">
              <div>
                <p className="preference-label">SMS Updates</p>
                <p className="preference-desc">Get text messages for order status</p>
              </div>
              <label className="switch">
                <input type="checkbox" defaultChecked />
                <span className="slider" />
              </label>
            </div>
          </div>

          <div className="profile-section">
            <h3>Support</h3>
            <button type="button" className="ghost full">
              Help Center
            </button>
            <button type="button" className="ghost full">
              Contact Support
            </button>
            <button type="button" className="ghost full">
              Terms & Privacy
            </button>
          </div>

          <button type="button" className="ghost full logout-btn">
            Sign Out
          </button>
        </section>
      )}
    </main>
  );
};

export default CustomerApp;
