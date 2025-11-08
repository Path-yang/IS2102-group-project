import { useState } from 'react';
import { Link } from 'react-router-dom';

type TabKey = 'home' | 'track' | 'orders' | 'profile';

type Service = {
  id: string;
  name: string;
  description: string;
  priceType: 'per-kg' | 'per-item';
  price: number;
  duration: string;
  icon: string;
};

type TimeSlot = {
  id: string;
  time: string;
  available: boolean;
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
  subtotal?: number;
  deliveryFee?: number;
  discount?: number;
};

type OrderStatus = {
  label: string;
  detail: string;
  completed: boolean;
};

type OrderFormStep = 'service' | 'details' | 'payment' | 'confirmation';

const services: Service[] = [
  {
    id: 'wash-fold',
    name: 'Wash & Fold',
    description: 'Standard cleaning for everyday garments',
    priceType: 'per-kg',
    price: 2.5,
    duration: '24-48 hours',
    icon: '👕',
  },
  {
    id: 'dry-clean',
    name: 'Dry Cleaning',
    description: 'Professional dry cleaning for delicate items',
    priceType: 'per-item',
    price: 8.0,
    duration: '48-72 hours',
    icon: '🧥',
  },
  {
    id: 'premium',
    name: 'Premium Care',
    description: 'Expert handling for luxury fabrics',
    priceType: 'per-item',
    price: 15.0,
    duration: '3-5 days',
    icon: '✨',
  },
  {
    id: 'express',
    name: 'Express Service',
    description: 'Same-day turnaround available',
    priceType: 'per-kg',
    price: 5.0,
    duration: '4-8 hours',
    icon: '⚡',
  },
];

const pickupSlots: TimeSlot[] = [
  { id: 'p1', time: '09:00 AM - 11:00 AM', available: true },
  { id: 'p2', time: '11:00 AM - 01:00 PM', available: true },
  { id: 'p3', time: '02:00 PM - 04:00 PM', available: false },
  { id: 'p4', time: '04:00 PM - 06:00 PM', available: true },
  { id: 'p5', time: '06:00 PM - 08:00 PM', available: true },
];

const deliverySlots: TimeSlot[] = [
  { id: 'd1', time: '10:00 AM - 12:00 PM', available: true },
  { id: 'd2', time: '02:00 PM - 04:00 PM', available: true },
  { id: 'd3', time: '04:00 PM - 06:00 PM', available: false },
  { id: 'd4', time: '06:00 PM - 08:00 PM', available: true },
];

const activeOrderSeed: Order = {
  id: 'LD-C-8821',
  service: 'Wash & Fold + Dry Clean',
  status: 'pickup',
  pickupDate: 'Today, 2:30 PM',
  deliveryDate: 'Tomorrow, 6:00 PM',
  total: 28.5,
  subtotal: 25.0,
  deliveryFee: 5.0,
  discount: 1.5,
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
    subtotal: 15.0,
    deliveryFee: 5.0,
    discount: 1.25,
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
    subtotal: 32.0,
    deliveryFee: 5.0,
    discount: 5.0,
    items: 4,
    address: '123 Orchard Road, #05-67, 238858',
  },
];

const CustomerApp = () => {
  const [activeTab, setActiveTab] = useState<TabKey>('home');
  const [orderStep, setOrderStep] = useState<OrderFormStep>('service');
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [activeOrder] = useState<Order | null>(activeOrderSeed);
  const [orderHistory] = useState<Order[]>(orderHistorySeed);

  // Carousel state
  const [currentServiceIndex, setCurrentServiceIndex] = useState(0);

  // Collapsible states
  const [pickupSlotsOpen, setPickupSlotsOpen] = useState(false);
  const [deliverySlotsOpen, setDeliverySlotsOpen] = useState(false);

  // Order form state
  const [pickupAddress, setPickupAddress] = useState('123 Orchard Road, #05-67, 238858');
  const [itemCount, setItemCount] = useState(5);
  const [selectedPickupSlot, setSelectedPickupSlot] = useState<string>('');
  const [selectedDeliverySlot, setSelectedDeliverySlot] = useState<string>('');
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  // Price calculation
  const calculateSubtotal = () => {
    if (!selectedService) return 0;
    return selectedService.price * itemCount;
  };

  const deliveryFee = 5.0;
  const discount = promoApplied ? calculateSubtotal() * 0.1 : 0; // 10% discount
  const subtotal = calculateSubtotal();
  const total = subtotal + deliveryFee - discount;

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

  const handleNewOrder = () => {
    setOrderStep('service');
    setSelectedService(null);
    setPromoCode('');
    setPromoApplied(false);
    setPromoError('');
    setConfirmedOrder(null);
    // Auto-fill saved address (use case step 1.1)
  };

  const handleServiceSelect = (service: Service) => {
    setSelectedService(service);
    setOrderStep('details');
  };

  const handleApplyPromo = () => {
    // Use case step 4.1
    setPromoError('');
    if (promoCode.toUpperCase() === 'SAVE10') {
      setPromoApplied(true);
      setPromoError('');
    } else if (promoCode === '') {
      setPromoError('Please enter a promo code');
    } else {
      setPromoError('Invalid or expired promo code');
      setPromoApplied(false);
    }
  };

  const handleRemovePromo = () => {
    setPromoApplied(false);
    setPromoCode('');
    setPromoError('');
  };

  const handleProceedToPayment = () => {
    // Use case step 3 validation
    if (!selectedPickupSlot) {
      alert('Please select a pickup time slot');
      return;
    }
    if (!selectedDeliverySlot) {
      alert('Please select a delivery time slot');
      return;
    }
    setOrderStep('payment');
  };

  const handleProcessPayment = () => {
    // Use case step 5.1
    setPaymentProcessing(true);
    
    // Simulate payment gateway processing
    setTimeout(() => {
      // Simulate 90% success rate
      const success = Math.random() > 0.1;
      
      setPaymentProcessing(false);
      
      if (success) {
        // Use case step 5.1a - Payment succeeds
        const newOrder: Order = {
          id: `LD-C-${Math.floor(Math.random() * 10000)}`,
          service: selectedService?.name || '',
          status: 'confirmed',
          pickupDate: pickupSlots.find(s => s.id === selectedPickupSlot)?.time || '',
          deliveryDate: deliverySlots.find(s => s.id === selectedDeliverySlot)?.time || '',
          total: total,
          subtotal: subtotal,
          deliveryFee: deliveryFee,
          discount: discount,
          items: itemCount,
          address: pickupAddress,
        };
        
        setConfirmedOrder(newOrder);
        setOrderStep('confirmation');
      } else {
        // Use case step 5.1b - Payment fails
        alert('Payment failed. Please try again or use an alternative payment method.');
      }
    }, 2000);
  };

  const handleCancelOrder = () => {
    // Use case exception A1
    if (confirm('Are you sure you want to cancel this order?')) {
      setOrderStep('service');
      setSelectedService(null);
      setSelectedPickupSlot('');
      setSelectedDeliverySlot('');
      setPromoCode('');
      setPromoApplied(false);
    }
  };

  const handleReorder = (order: Order) => {
    alert(`Reordering: ${order.service}\nOrder ID: ${order.id}`);
    setActiveTab('home');
    handleNewOrder();
  };

  return (
    <main className="driver-app">
      <header className="driver-header">
        <div>
          <p className="eyebrow">LaundryDash Customer</p>
          <h1>Your Laundry Service</h1>
          <p className="subtitle">
            Order laundry services with transparent pricing and flexible scheduling.
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

      {/* HOME TAB - New Order Flow */}
      {activeTab === 'home' && (
        <section className="panel">
          {orderStep === 'service' && (
            <>
              <div className="customer-welcome">
                <h2>Place New Order</h2>
                <p>Select a laundry service to get started</p>
              </div>

              <div className="service-carousel">
                <button
                  type="button"
                  className="carousel-btn"
                  onClick={() => setCurrentServiceIndex((prev) => (prev === 0 ? services.length - 1 : prev - 1))}
                >
                  ◀
                </button>
                
                <div className="carousel-content">
                  <div
                    className="service-card carousel-card"
                    onClick={() => handleServiceSelect(services[currentServiceIndex])}
                  >
                    <div className="service-icon">{services[currentServiceIndex].icon}</div>
                    <h3>{services[currentServiceIndex].name}</h3>
                    <p className="service-desc">{services[currentServiceIndex].description}</p>
                    <div className="service-meta">
                      <span className="service-price">
                        ${services[currentServiceIndex].price.toFixed(2)}/{services[currentServiceIndex].priceType === 'per-kg' ? 'kg' : 'item'}
                      </span>
                      <span className="service-duration">{services[currentServiceIndex].duration}</span>
                    </div>
                  </div>
                  
                  <div className="carousel-dots">
                    {services.map((_, index) => (
                      <button
                        key={index}
                        type="button"
                        className={`carousel-dot ${index === currentServiceIndex ? 'active' : ''}`}
                        onClick={() => setCurrentServiceIndex(index)}
                        aria-label={`Go to service ${index + 1}`}
                      />
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  className="carousel-btn"
                  onClick={() => setCurrentServiceIndex((prev) => (prev === services.length - 1 ? 0 : prev + 1))}
                >
                  ▶
                </button>
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
          )}

          {orderStep === 'details' && selectedService && (
            <div className="schedule-form">
              <div className="form-header">
                <h2>Order Details</h2>
                <button type="button" className="ghost small" onClick={handleCancelOrder}>
                  Cancel
                </button>
              </div>

              <div className="order-summary-card">
                <p className="eyebrow">Selected Service</p>
                <div className="selected-service">
                  <span className="service-icon-small">{selectedService.icon}</span>
                  <div>
                    <h3>{selectedService.name}</h3>
                    <p>${selectedService.price.toFixed(2)}/{selectedService.priceType === 'per-kg' ? 'kg' : 'item'}</p>
                  </div>
                </div>
              </div>

              <div className="form-field">
                <label htmlFor="address">Pickup & Delivery Address</label>
                <input
                  id="address"
                  type="text"
                  value={pickupAddress}
                  onChange={(e) => setPickupAddress(e.target.value)}
                  placeholder="Enter your address"
                  className="input-field"
                />
                <p className="field-hint">Service area check: ✓ Available</p>
              </div>

              <div className="form-field">
                <label htmlFor="items">
                  Number of {selectedService.priceType === 'per-kg' ? 'Kilograms' : 'Items'}
                </label>
                <input
                  id="items"
                  type="number"
                  min="1"
                  value={itemCount}
                  onChange={(e) => setItemCount(parseInt(e.target.value) || 1)}
                  className="input-field"
                />
              </div>

              <div className="form-field">
                <div className="collapsible-section">
                  <button
                    type="button"
                    className="collapsible-header"
                    onClick={() => setPickupSlotsOpen(!pickupSlotsOpen)}
                  >
                    <div className="collapsible-header-content">
                      <div>
                        <h3 className="collapsible-title">Pickup Time Slot</h3>
                        {selectedPickupSlot && (
                          <p className="collapsible-subtitle">
                            {pickupSlots.find(s => s.id === selectedPickupSlot)?.time}
                          </p>
                        )}
                      </div>
                      <div className="collapsible-indicator">
                        {selectedPickupSlot && <span className="pill">Selected</span>}
                        <span className="chevron">{pickupSlotsOpen ? '▲' : '▼'}</span>
                      </div>
                    </div>
                  </button>
                  
                  {pickupSlotsOpen && (
                    <div className="collapsible-content">
                      <div className="time-slots">
                        {pickupSlots.map((slot) => (
                          <button
                            key={slot.id}
                            type="button"
                            className={`time-slot ${!slot.available ? 'unavailable' : ''} ${selectedPickupSlot === slot.id ? 'selected' : ''}`}
                            onClick={() => {
                              if (slot.available) {
                                setSelectedPickupSlot(slot.id);
                                setPickupSlotsOpen(false);
                              }
                            }}
                            disabled={!slot.available}
                          >
                            {slot.time}
                            {!slot.available && <span className="unavailable-badge">Full</span>}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="form-field">
                <div className="collapsible-section">
                  <button
                    type="button"
                    className="collapsible-header"
                    onClick={() => setDeliverySlotsOpen(!deliverySlotsOpen)}
                  >
                    <div className="collapsible-header-content">
                      <div>
                        <h3 className="collapsible-title">Delivery Time Slot</h3>
                        {selectedDeliverySlot && (
                          <p className="collapsible-subtitle">
                            {deliverySlots.find(s => s.id === selectedDeliverySlot)?.time}
                          </p>
                        )}
                      </div>
                      <div className="collapsible-indicator">
                        {selectedDeliverySlot && <span className="pill">Selected</span>}
                        <span className="chevron">{deliverySlotsOpen ? '▲' : '▼'}</span>
                      </div>
                    </div>
                  </button>
                  
                  {deliverySlotsOpen && (
                    <div className="collapsible-content">
                      <div className="time-slots">
                        {deliverySlots.map((slot) => (
                          <button
                            key={slot.id}
                            type="button"
                            className={`time-slot ${!slot.available ? 'unavailable' : ''} ${selectedDeliverySlot === slot.id ? 'selected' : ''}`}
                            onClick={() => {
                              if (slot.available) {
                                setSelectedDeliverySlot(slot.id);
                                setDeliverySlotsOpen(false);
                              }
                            }}
                            disabled={!slot.available}
                          >
                            {slot.time}
                            {!slot.available && <span className="unavailable-badge">Full</span>}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
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

              <div className="promo-section">
                <label htmlFor="promo">Promo Code</label>
                <div className="promo-input-group">
                  <input
                    id="promo"
                    type="text"
                    value={promoCode}
                    onChange={(e) => {
                      setPromoCode(e.target.value);
                      setPromoError('');
                    }}
                    placeholder="Enter promo code"
                    className="input-field"
                    disabled={promoApplied}
                  />
                  {promoApplied ? (
                    <button type="button" className="ghost" onClick={handleRemovePromo}>
                      Remove
                    </button>
                  ) : (
                    <button type="button" className="secondary-action" onClick={handleApplyPromo}>
                      Apply
                    </button>
                  )}
                </div>
                {promoError && <p className="error-message">{promoError}</p>}
                {promoApplied && <p className="success-message">✓ Promo code applied: 10% discount</p>}
                <p className="field-hint">Try: SAVE10 for 10% off</p>
              </div>

              <div className="price-breakdown">
                <h3>Price Summary</h3>
                <div className="price-row">
                  <span>Subtotal ({itemCount} {selectedService.priceType === 'per-kg' ? 'kg' : 'items'})</span>
                  <strong>${subtotal.toFixed(2)}</strong>
                </div>
                <div className="price-row">
                  <span>Delivery Fee</span>
                  <strong>${deliveryFee.toFixed(2)}</strong>
                </div>
                {promoApplied && (
                  <div className="price-row discount">
                    <span>Discount (10%)</span>
                    <strong>-${discount.toFixed(2)}</strong>
                  </div>
                )}
                <div className="price-row total">
                  <span>Total</span>
                  <strong>${total.toFixed(2)}</strong>
                </div>
              </div>

              <button
                type="button"
                className="primary-action full"
                onClick={handleProceedToPayment}
              >
                Review & Pay
              </button>
            </div>
          )}

          {orderStep === 'payment' && selectedService && (
            <div className="payment-form">
              <div className="form-header">
                <h2>Payment</h2>
                <button type="button" className="ghost small" onClick={() => setOrderStep('details')}>
                  Back
                </button>
              </div>

              <div className="price-breakdown">
                <h3>Order Summary</h3>
                <div className="order-summary-item">
                  <p className="eyebrow">Service</p>
                  <p>{selectedService.name}</p>
                </div>
                <div className="order-summary-item">
                  <p className="eyebrow">Pickup</p>
                  <p>{pickupSlots.find(s => s.id === selectedPickupSlot)?.time}</p>
                </div>
                <div className="order-summary-item">
                  <p className="eyebrow">Delivery</p>
                  <p>{deliverySlots.find(s => s.id === selectedDeliverySlot)?.time}</p>
                </div>
                <div className="price-row">
                  <span>Subtotal</span>
                  <strong>${subtotal.toFixed(2)}</strong>
                </div>
                <div className="price-row">
                  <span>Delivery Fee</span>
                  <strong>${deliveryFee.toFixed(2)}</strong>
                </div>
                {promoApplied && (
                  <div className="price-row discount">
                    <span>Discount</span>
                    <strong>-${discount.toFixed(2)}</strong>
                  </div>
                )}
                <div className="price-row total">
                  <span>Total Amount</span>
                  <strong>${total.toFixed(2)}</strong>
                </div>
              </div>

              <div className="payment-method-section">
                <h3>Payment Method</h3>
                <div className="payment-card">
                  <div>
                    <p className="eyebrow">Credit Card</p>
                    <p>•••• •••• •••• 4242</p>
                  </div>
                  <span className="pill">Default</span>
                </div>
              </div>

              <button
                type="button"
                className="primary-action full"
                onClick={handleProcessPayment}
                disabled={paymentProcessing}
              >
                {paymentProcessing ? 'Processing Payment...' : `Pay $${total.toFixed(2)}`}
              </button>

              <button type="button" className="ghost full" onClick={handleCancelOrder}>
                Cancel Order
              </button>
            </div>
          )}

          {orderStep === 'confirmation' && confirmedOrder && (
            <div className="confirmation-screen">
              <div className="confirmation-icon">✓</div>
              <h2>Order Confirmed!</h2>
              <p className="confirmation-subtitle">Your laundry order has been placed successfully</p>

              <div className="confirmation-details">
                <div className="confirmation-card">
                  <p className="eyebrow">Order Number</p>
                  <h3>{confirmedOrder.id}</h3>
                </div>

                <div className="confirmation-info">
                  <div className="info-row">
                    <span className="label">Service</span>
                    <span>{confirmedOrder.service}</span>
                  </div>
                  <div className="info-row">
                    <span className="label">Pickup</span>
                    <span>{confirmedOrder.pickupDate}</span>
                  </div>
                  <div className="info-row">
                    <span className="label">Delivery</span>
                    <span>{confirmedOrder.deliveryDate}</span>
                  </div>
                  <div className="info-row">
                    <span className="label">Total Paid</span>
                    <span><strong>${confirmedOrder.total.toFixed(2)}</strong></span>
                  </div>
                </div>

                <div className="confirmation-notifications">
                  <p className="eyebrow">✓ Notifications Sent</p>
                  <ul>
                    <li>Driver has been notified</li>
                    <li>Laundry partner has been notified</li>
                    <li>Confirmation email sent to you</li>
                  </ul>
                </div>
              </div>

              <div className="confirmation-actions">
                <button
                  type="button"
                  className="primary-action full"
                  onClick={() => {
                    setActiveTab('track');
                    setOrderStep('service');
                  }}
                >
                  Track Order
                </button>
                <button
                  type="button"
                  className="secondary-action full"
                  onClick={() => {
                    setOrderStep('service');
                    setSelectedService(null);
                  }}
                >
                  Place Another Order
                </button>
              </div>
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
                
                <div className="price-breakdown compact">
                  <div className="price-row">
                    <span>Subtotal</span>
                    <span>${activeOrder.subtotal?.toFixed(2)}</span>
                  </div>
                  <div className="price-row">
                    <span>Delivery Fee</span>
                    <span>${activeOrder.deliveryFee?.toFixed(2)}</span>
                  </div>
                  {activeOrder.discount && activeOrder.discount > 0 && (
                    <div className="price-row">
                      <span>Discount</span>
                      <span>-${activeOrder.discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="price-row total">
                    <span>Total</span>
                    <strong>${activeOrder.total.toFixed(2)}</strong>
                  </div>
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
              <p>Place an order to start tracking your laundry.</p>
              <button
                type="button"
                className="secondary-action"
                onClick={() => {
                  setActiveTab('home');
                  handleNewOrder();
                }}
              >
                Place New Order
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
