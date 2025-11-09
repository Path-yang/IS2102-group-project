import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

type StatusKey =
  | 'accepted'
  | 'enRoutePickup'
  | 'pickedUp'
  | 'atPartner'
  | 'returning'
  | 'delivered'
  | 'completed';

type Direction = 'toPartner' | 'toCustomer';
type Job = {
  id: string;
  customer: string;
  pickup: string;
  dropoff: string;
  partner: string;
  service: string;
  payout: number;
  distance: number;
  eta: string;
  bags: number;
  notes?: string;
  status: string;
  direction: Direction;
};

type TabKey = 'active' | 'requests' | 'jobs' | 'dashboard';

const statusFlows: Record<Direction, Array<{ key: StatusKey; label: string; detail: string }>> = {
  toPartner: [
    { key: 'accepted', label: 'Accepted', detail: 'Job locked in, prep to move' },
    { key: 'enRoutePickup', label: 'En Route to Customer', detail: 'Navigating to pickup location' },
    { key: 'pickedUp', label: 'Picked Up', detail: 'Laundry secured with photo proof' },
    { key: 'atPartner', label: 'Delivered to Partner', detail: 'Drop-off at laundry partner' },
    { key: 'completed', label: 'Completed', detail: 'Job auto-submitted to earnings' },
  ],
  toCustomer: [
    { key: 'accepted', label: 'Accepted', detail: 'Job locked in, prep to move' },
    { key: 'enRoutePickup', label: 'En Route to Partner', detail: 'Heading to collect clean load' },
    { key: 'atPartner', label: 'Arrived at Partner', detail: 'Ready to collect garments' },
    { key: 'pickedUp', label: 'Collected Laundry', detail: 'Clean garments onboard' },
    { key: 'returning', label: 'Return to Customer', detail: 'Navigating to customer drop-off' },
    { key: 'delivered', label: 'Delivered', detail: 'Customer confirmed receipt' },
    { key: 'completed', label: 'Completed', detail: 'Job auto-submitted to earnings' },
  ],
};

const nextActionCopy: Record<StatusKey, string> = {
  accepted: 'Start route',
  enRoutePickup: 'Arrived at pickup',
  pickedUp: 'Confirm pickup',
  atPartner: 'Handle handoff',
  returning: 'Return to customer',
  delivered: 'Confirm delivery',
  completed: 'Complete job',
};

const initialActiveJob: Job = {
  id: 'LD-2381',
  customer: 'Clara Tan',
  pickup: '6 Battery Rd, #15-02, 049909',
  dropoff: '22 River Valley Cl, #08-01, 238435',
  partner: 'FreshFoam Laundry (Bukit Merah)',
  service: 'Wash & Fold + Premium Dry Clean',
  payout: 18.9,
  distance: 9.4,
  eta: '45 mins total',
  bags: 2,
  notes: 'Silk blouse in garment bag. Fragile.',
  status: 'In Progress',
  direction: 'toPartner',
};

const secondaryActiveJob: Job = {
  id: 'LD-2382',
  customer: 'Muthu Kumar',
  pickup: '730 Clementi West St 2, #12-118',
  dropoff: '15 Science Park Dr, 11800',
  partner: 'SparkWash Labs (Clementi)',
  service: 'Dry clean + bedding',
  payout: 24.5,
  distance: 12.1,
  eta: '60 mins total',
  bags: 3,
  notes: 'King duvet strapped separately.',
  status: 'In Progress',
  direction: 'toCustomer',
};

const seededActiveJobs: Job[] = [initialActiveJob, secondaryActiveJob];

const buildRouteStops = (job: Job) => {
  if (job.direction === 'toPartner') {
    return [
      {
        label: 'Pickup customer',
        detail: job.pickup,
        eta: 'ETA 4 mins',
      },
      {
        label: 'Drop at partner',
        detail: job.partner,
        eta: 'ETA 18 mins',
      },
    ];
  }
  return [
    {
      label: 'Pickup at partner',
      detail: job.partner,
      eta: 'ETA 4 mins',
    },
    {
      label: 'Return to customer',
      detail: job.dropoff,
      eta: 'ETA 18 mins',
    },
  ];
};

const randomDirection = (): Direction => (Math.random() < 0.5 ? 'toPartner' : 'toCustomer');

const pendingRequests: Job[] = [
  {
    id: 'LD-2390',
    customer: 'Marcus Chen',
    pickup: '8 Boon Lay Wy, #09-11, 609964',
    dropoff: 'LaundryLab HQ, 7030 Ang Mo Kio Ave 5',
    partner: 'LaundryLab HQ (Ang Mo Kio)',
    service: 'Wash & Fold subscription bag',
    payout: 12.4,
    distance: 5.1,
    eta: '30 mins',
    bags: 1,
    status: 'Awaiting',
    direction: 'toPartner',
  },
  {
    id: 'LD-2391',
    customer: 'Nurul Hana',
    pickup: '987B Buangkok Cres, #13-118',
    dropoff: 'BubbleWorks @ Hougang',
    partner: 'BubbleWorks',
    service: 'Dry clean (4 items)',
    payout: 16.2,
    distance: 7.8,
    eta: '40 mins',
    bags: 1,
    status: 'Awaiting',
    direction: 'toCustomer',
  },
];

const completedSeed: Job[] = [
  {
    id: 'LD-2379',
    customer: 'Brandon Goh',
    pickup: '78 Tiong Bahru Rd',
    dropoff: 'GreenBubble Lab',
    partner: 'GreenBubble Lab',
    service: 'Express wash & fold',
    payout: 15.2,
    distance: 6.1,
    eta: 'Completed 09:45',
    bags: 1,
    status: 'Completed',
    direction: 'toPartner',
  },
  {
    id: 'LD-2380',
    customer: 'University Hall',
    pickup: '12 Kent Ridge Dr',
    dropoff: 'Soak Society (Clementi)',
    partner: 'Soak Society',
    service: 'Bulk linens',
    payout: 28.8,
    distance: 11.2,
    eta: 'Completed 10:20',
    bags: 3,
    status: 'Completed',
    direction: 'toCustomer',
  },
];

const DriverApp = () => {
  const [isOnline, setIsOnline] = useState(true);
  const [activeTab, setActiveTab] = useState<TabKey>('active');
  const [activeJobs, setActiveJobs] = useState<Job[]>(seededActiveJobs);
  const [jobStatusMap, setJobStatusMap] = useState<Record<string, number>>(() =>
    seededActiveJobs.reduce((acc, job) => ({ ...acc, [job.id]: 1 }), {})
  );
  const [isMapExpanded, setIsMapExpanded] = useState(false);
  const [incomingRequest, setIncomingRequest] = useState<Job | null>(pendingRequests[0]);
  const [requestQueue, setRequestQueue] = useState<Job[]>(pendingRequests.slice(1));
  const [upcomingJobs] = useState<Job[]>([
    {
      id: 'LD-2386',
      customer: 'Nadia Salleh',
      pickup: '1 Northshore Dr (Piermont Grande)',
      dropoff: 'SparkWash (Punggol)',
      partner: 'SparkWash',
      service: 'Wash & Fold + Shoes',
      payout: 21.6,
      distance: 10.2,
      eta: 'Pickup 14:00',
      bags: 2,
      status: 'Queued',
      direction: 'toPartner',
    },
  ]);
  const [completedJobs, setCompletedJobs] = useState<Job[]>(completedSeed);
  const [requestTimer, setRequestTimer] = useState(30);
  const [expandedJobIds, setExpandedJobIds] = useState<string[]>([]);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const tabs: Array<{ key: TabKey; label: string }> = [
    { key: 'active', label: 'Active jobs' },
    { key: 'requests', label: 'New requests' },
    { key: 'jobs', label: 'Job board' },
    { key: 'dashboard', label: 'Dashboard' },
  ];

  useEffect(() => {
    if (!incomingRequest || requestTimer === 0) return;

    const interval = setInterval(() => {
      setRequestTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [incomingRequest, requestTimer]);

  // Toast notification helper
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  };

  // Simulate location validation (Step 2.1)
  const simulateLocationValidation = async (jobId: string): Promise<boolean> => {
    return new Promise((resolve) => {
      const mockLat = (1.3521 + Math.random() * 0.1).toFixed(6);
      const mockLng = (103.8198 + Math.random() * 0.1).toFixed(6);
      
      console.log(`📍 Step 2.1: Location validation for ${jobId}`);
      console.log(`   Current GPS: ${mockLat}, ${mockLng}`);
      console.log(`   Accuracy: ${(10 + Math.random() * 20).toFixed(1)}m`);
      console.log(`   ✅ Within required radius`);
      
      setTimeout(() => {
        showToast('📍 Location verified', 'info');
        resolve(true);
      }, 800);
    });
  };

  // Simulate notifications (Step 3.2)
  const simulateNotifications = (jobId: string, statusKey: StatusKey) => {
    const job = activeJobs.find(j => j.id === jobId);
    if (!job) return;
    
    const notifications: Record<string, string[]> = {
      'enRoutePickup': [
        `📱 SMS to ${job.customer}: "Your driver is on the way!"`,
        `📱 Alert to ${job.partner}: "Driver en route to pickup"`
      ],
      'pickedUp': [
        `📱 SMS to ${job.customer}: "Your laundry has been picked up"`,
        `📱 Alert to ${job.partner}: "Incoming delivery - ${job.bags} bags"`
      ],
      'atPartner': [
        `📱 SMS to ${job.customer}: "Your laundry is being processed at ${job.partner}"`,
      ],
      'returning': [
        `📱 SMS to ${job.customer}: "Your clean laundry is on the way back!"`,
      ],
      'delivered': [
        `📱 SMS to ${job.customer}: "Delivered! Please confirm receipt."`,
        `📱 Alert to ${job.partner}: "Delivery confirmed for ${jobId}"`
      ],
    };
    
    const messages = notifications[statusKey] || [];
    
    if (messages.length > 0) {
      console.log('📤 Step 3.2: Notifications sent:');
      messages.forEach(msg => console.log(`   ${msg}`));
      showToast(`📤 ${messages.length} notification${messages.length > 1 ? 's' : ''} sent`, 'info');
    }
  };

  // Simulate navigation (Step 4)
  const simulateNavigation = (jobId: string, statusKey: StatusKey) => {
    const job = activeJobs.find(j => j.id === jobId);
    if (!job) return;
    
    let destination = '';
    let destinationName = '';
    
    switch (statusKey) {
      case 'enRoutePickup':
      case 'accepted':
        destination = job.pickup;
        destinationName = 'Customer Pickup';
        break;
      case 'pickedUp':
        destination = job.partner;
        destinationName = 'Laundry Partner';
        break;
      case 'returning':
      case 'atPartner':
        destination = job.dropoff;
        destinationName = 'Customer Drop-off';
        break;
      default:
        destination = job.pickup;
        destinationName = 'Pickup Location';
    }
    
    console.log(`🗺️ Step 4: Navigation started`);
    console.log(`   Destination: ${destinationName}`);
    console.log(`   Address: ${destination}`);
    
    const encodedDestination = encodeURIComponent(destination);
    const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodedDestination}`;
    window.open(mapsUrl, '_blank');
    
    showToast(`🗺️ Navigating to ${destinationName}`, 'success');
  };

  // Simulate photo capture
  const simulatePhotoCapture = (jobId: string, photoType: 'pickup' | 'delivery') => {
    console.log(`📸 Photo captured:`);
    console.log(`   Job: ${jobId}`);
    console.log(`   Type: ${photoType}`);
    console.log(`   Timestamp: ${new Date().toISOString()}`);
    console.log(`   Photo URL: simulated-${jobId}-${photoType}.jpg`);
    
    showToast(`📸 ${photoType === 'pickup' ? 'Pickup' : 'Delivery'} photo captured`, 'success');
  };

  const toggleJobExpansion = (jobId: string) => {
    setExpandedJobIds((prev) => {
      if (prev.includes(jobId)) {
        return prev.filter((id) => id !== jobId);
      }
      return [...prev, jobId];
    });
  };

  const handleAdvanceStatusForJob = async (jobId: string) => {
    const job = activeJobs.find((j) => j.id === jobId);
    if (!job) return;
    const flow = statusFlows[job.direction];
    const currentStage = jobStatusMap[jobId] ?? 0;
    const nextStatus = flow[currentStage + 1];
    
    if (!nextStatus) return;

    setIsUpdating(true);

    try {
      console.log('\n🔄 ========== STATUS UPDATE FLOW ==========');
      console.log(`Job ID: ${jobId}`);
      console.log(`Current Status: ${flow[currentStage].label}`);
      console.log(`Next Status: ${nextStatus.label}`);
      
      // Step 2.1: Validate location
      showToast('⏳ Validating location...', 'info');
      const isLocationValid = await simulateLocationValidation(jobId);
      
      if (!isLocationValid) {
        showToast('❌ Location validation failed', 'error');
        return;
      }
      
      // Step 2.2: Capture timestamp and GPS
      const timestamp = new Date();
      const updateData = {
        jobId,
        status: nextStatus.key,
        timestamp: timestamp.toISOString(),
        timestampReadable: timestamp.toLocaleString('en-SG', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        }),
        gpsCoords: {
          lat: (1.3521 + Math.random() * 0.1).toFixed(6),
          lng: (103.8198 + Math.random() * 0.1).toFixed(6)
        }
      };
      
      console.log('\n📝 Step 2.2: Timestamp & GPS captured');
      console.log('💾 Step 3.1: Database update (simulated):');
      console.log(JSON.stringify(updateData, null, 2));
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Step 3.3: Update state
      setJobStatusMap((prev) => {
        const updated = { ...prev, [jobId]: currentStage + 1 };
        
        // Step 3.2: Send notifications
        setTimeout(() => {
          simulateNotifications(jobId, nextStatus.key);
        }, 300);
        
        // Handle completion
        if (nextStatus.key === 'completed') {
          setCompletedJobs((prevCompleted) => [
            {
              ...job,
              status: 'Completed',
              eta: `Completed ${timestamp.toLocaleTimeString('en-SG', { hour: '2-digit', minute: '2-digit' })}`,
            },
            ...prevCompleted,
          ]);
          setActiveJobs((prevJobs) => prevJobs.filter((j) => j.id !== jobId));
          const { [jobId]: _removed, ...rest } = updated;
          showToast(`✅ Job ${jobId} completed! +$${job.payout.toFixed(2)}`, 'success');
          console.log('✅ ========== FLOW COMPLETE ==========\n');
          return rest;
        }
        
        return updated;
      });
      
      // Step 4.1: Show success
      showToast(`✅ Status updated to: ${nextStatus.label}`, 'success');
      
      // Step 4: Auto-navigate prompt
      if (nextStatus.key === 'pickedUp' || nextStatus.key === 'returning') {
        setTimeout(() => {
          const dest = nextStatus.key === 'pickedUp' ? 'laundry partner' : 'customer';
          const shouldNavigate = window.confirm(`🗺️ Ready to navigate to ${dest}?`);
          if (shouldNavigate) {
            simulateNavigation(jobId, nextStatus.key);
          }
        }, 1500);
      }
      
      console.log('✅ ========== FLOW COMPLETE ==========\n');
      
    } catch (error) {
      console.error('❌ Status update failed:', error);
      showToast('❌ Failed to update status. Please try again.', 'error');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAcceptRequest = () => {
    if (!incomingRequest) return;
    const direction = randomDirection();
    const newJob = { ...incomingRequest, status: 'In Progress', direction };
    setActiveJobs((prev) => [...prev, newJob]);
    setJobStatusMap((prev) => ({ ...prev, [incomingRequest.id]: 0 }));
    const [next, ...rest] = requestQueue;
    setIncomingRequest(next ?? null);
    setRequestQueue(rest);
    setRequestTimer(30);
  };

  const handleRejectRequest = () => {
    const [next, ...rest] = requestQueue;
    setIncomingRequest(next ?? null);
    setRequestQueue(rest);
    setRequestTimer(30);
  };

  const jobList = useMemo(() => {
    const activeEntries = activeJobs.map((job) => {
      const flow = statusFlows[job.direction];
      const index = Math.min(jobStatusMap[job.id] ?? 0, flow.length - 1);
      return {
        ...job,
        status: flow[index].label,
        eta: flow[index].detail,
      };
    });
    return [...activeEntries, ...upcomingJobs];
  }, [activeJobs, jobStatusMap, upcomingJobs]);

  return (
    <main className="driver-app">
      <header className="driver-header">
        <Link to="/" className="home-pill secondary small-pill">
          Home
        </Link>
        <div className="status-toggle">
          <span className={`status-dot ${isOnline ? 'online' : 'offline'}`}>
            {isOnline ? 'Online' : 'Offline'}
          </span>
          <label className="switch">
            <input
              type="checkbox"
              checked={isOnline}
              onChange={() => setIsOnline((prev) => !prev)}
            />
            <span className="slider" />
          </label>
        </div>
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

      {activeTab === 'requests' && (
        <section className="panel">
          {incomingRequest ? (
            <div className="incoming-card">
              <div className="incoming-top">
                <p className="eyebrow">New request • {requestTimer}s left</p>
                <strong>{incomingRequest.id}</strong>
              </div>
              <h3>
                {incomingRequest.customer} · {incomingRequest.service}
              </h3>
              <div className="route-row">
                <div>
                  <p className="label">Pickup</p>
                  <p>{incomingRequest.pickup}</p>
                </div>
                <div>
                  <p className="label">Drop-off</p>
                  <p>{incomingRequest.dropoff}</p>
                </div>
              </div>
              <div className="badge-row">
                <span>{incomingRequest.distance} km</span>
                <span>${incomingRequest.payout.toFixed(2)}</span>
                <span>{incomingRequest.eta}</span>
              </div>
              <div className="incoming-actions">
                <button type="button" className="ghost" onClick={handleRejectRequest}>
                  Reject
                </button>
                <button type="button" className="primary-action" onClick={handleAcceptRequest}>
                  Accept job
                </button>
              </div>
            </div>
          ) : (
            <div className="empty-state">
              <p className="eyebrow">Live feed</p>
              <h3>No requests at the moment</h3>
              <p>We will auto-ping you once a new pickup is within range.</p>
            </div>
          )}

          <div className="request-queue">
            <div className="request-queue-header">
              <h3>Queued pings</h3>
              <p>{requestQueue.length} waiting</p>
            </div>
            {requestQueue.length ? (
              requestQueue.map((job) => (
                <article key={job.id} className="request-row">
                  <div>
                    <p className="eyebrow">{job.id}</p>
                    <h4>{job.customer}</h4>
                    <p className="label">Pickup</p>
                    <p>{job.pickup}</p>
                  </div>
                  <div className="request-meta">
                    <p>${job.payout.toFixed(2)}</p>
                    <p>{job.distance} km</p>
                  </div>
                </article>
              ))
            ) : (
              <p className="label">No queued jobs. Enjoy the breather!</p>
            )}
          </div>
        </section>
      )}

      {activeTab === 'active' && (
        <section className="panel">
          {activeJobs.length > 0 ? (
            <>
              {/* Individual Collapsible Cards for Each Active Job */}
              {activeJobs.map((job) => {
                const flow = statusFlows[job.direction];
                const jobStageIndex = Math.min(jobStatusMap[job.id] ?? 0, flow.length - 1);
                const jobStatus = flow[jobStageIndex];
                const isExpanded = expandedJobIds.includes(job.id);
                const isCurrentAdvanceDisabled = jobStageIndex >= flow.length - 1;
                const nextStageKey = isCurrentAdvanceDisabled
                  ? 'completed'
                  : flow[jobStageIndex + 1].key;
                const nextStepLabel = isCurrentAdvanceDisabled
                  ? 'All steps done'
                  : nextActionCopy[nextStageKey] ?? 'Advance job';

                return (
                  <div key={job.id} className="collapsible-section">
                    <button
                      type="button"
                      className="collapsible-header"
                      onClick={() => toggleJobExpansion(job.id)}
                      aria-expanded={isExpanded}
                    >
                      <div className="collapsible-header-content">
                        <div>
                          <h3 className="collapsible-title">
                            {job.id} · {job.customer}
                          </h3>
                          <p className="collapsible-subtitle">
                            {job.bags} bags · ${job.payout.toFixed(2)} · {job.distance} km
                          </p>
                        </div>
                        <div className="collapsible-indicator">
                          <span className="pill">{jobStatus.label}</span>
                          <span className="chevron">{isExpanded ? '▼' : '▶'}</span>
                        </div>
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="collapsible-content">
                        <div className="job-card">
                          <div className="job-top">
                            <div>
                              <p className="eyebrow">Active job</p>
                              <h3>{job.id}</h3>
                            </div>
                            <span className="pill">{jobStatus.label}</span>
                          </div>
                          <p className="customer-line">
                            {job.customer} · {job.bags} bags
                          </p>
                          <p className="label">Pickup</p>
                          <p>{job.pickup}</p>
                          <p className="label">Laundry Partner</p>
                          <p>{job.partner}</p>
                          <p className="label">Drop-off</p>
                          <p>{job.dropoff}</p>
                          <div className="badge-row compact">
                            <span>{job.service}</span>
                            <span>{job.eta}</span>
                            <span>${job.payout.toFixed(2)}</span>
                          </div>
                          {job.notes && <p className="note">Note: {job.notes}</p>}
                        </div>

                        <div className="timeline compact">
                          {flow.map((status, statusIndex) => {
                            // Show only current and next step
                            const isCurrent = statusIndex === jobStageIndex;
                            const isNext = statusIndex === jobStageIndex + 1;
                            const shouldShow = isCurrent || isNext;
                            
                            if (!shouldShow) return null;
                            
                            return (
                              <div key={status.key} className="timeline-item compact">
                                <div className={statusIndex <= jobStageIndex ? 'dot active' : 'dot'} />
                                <div>
                                  <p className="timeline-title">{status.label}</p>
                                  <p className="timeline-detail">{status.detail}</p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                        <div className="next-action">
                          <button
                            type="button"
                            className="primary-action"
                            onClick={() => handleAdvanceStatusForJob(job.id)}
                            disabled={isCurrentAdvanceDisabled || isUpdating}
                          >
                            {isUpdating ? '⏳ Updating...' : nextStepLabel}
                          </button>
                          
                          {/* Photo capture buttons */}
                          {(jobStatus.key === 'enRoutePickup' || jobStatus.key === 'pickedUp') && (
                            <button 
                              type="button" 
                              className="secondary-action"
                              onClick={() => simulatePhotoCapture(job.id, 'pickup')}
                            >
                              📸 Pickup proof
                            </button>
                          )}
                          
                          {(jobStatus.key === 'returning' || jobStatus.key === 'delivered') && (
                            <button 
                              type="button" 
                              className="secondary-action"
                              onClick={() => simulatePhotoCapture(job.id, 'delivery')}
                            >
                              📸 Delivery proof
                            </button>
                          )}
                          
                          <button 
                            type="button" 
                            className="ghost"
                            onClick={() => simulateNavigation(job.id, jobStatus.key)}
                          >
                            🗺️ Navigate now
                          </button>
                          
                          <p>Drivers see the next required step here.</p>
                        </div>

                        <div className="route-card tight">
                          <p className="eyebrow">Route overview</p>
                          <div className="route-stops">
                            {buildRouteStops(job).map((stop) => (
                              <div key={stop.label} className="route-stop">
                                <p className="label">{stop.label}</p>
                                <p>{stop.detail}</p>
                                <p className="route-eta">{stop.eta}</p>
                              </div>
                            ))}
                          </div>
                          <div className="map-card">
                            <iframe
                              title={`Singapore driver route for ${job.id}`}
                              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d127654.62967623472!2d103.68375801280434!3d1.344377213089884!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31da11241b5398ab%3A0x500f7acaedaa150!2sSingapore!5e0!3m2!1sen!2ssg!4v1731000000000!5m2!1sen!2ssg"
                              loading="lazy"
                              referrerPolicy="no-referrer-when-downgrade"
                            />
                          </div>
                          <div className="map-actions">
                            <button type="button" className="secondary-action" onClick={() => setIsMapExpanded(true)}>
                              Expand map
                            </button>
                            <button type="button" className="ghost">
                              Launch navigation
                            </button>
                          </div>
                        </div>

                        <div className="contact-actions">
                          <button type="button" className="ghost">
                            Contact customer
                          </button>
                          <button type="button" className="ghost">
                            Contact partner
                          </button>
                          <button type="button" className="ghost">
                            Report issue
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </>
          ) : (
            <div className="empty-state">
              <p className="eyebrow">Active job</p>
              <h3>No job in progress</h3>
              <p>Accept a pending request to see the workflow here.</p>
            </div>
          )}
        </section>
      )}

      {activeTab === 'jobs' && (
        <section className="panel">
          <div className="job-list">
            {jobList.map((job) => (
              <article key={job.id} className="job-row">
                <div>
                  <p className="eyebrow">{job.id}</p>
                  <h3>{job.customer}</h3>
                  <p className="label">Pickup</p>
                  <p>{job.pickup}</p>
                  <p className="label">Drop-off</p>
                  <p>{job.dropoff}</p>
                </div>
                <div className="job-meta">
                  <span className="pill">{job.status}</span>
                  <p>${job.payout.toFixed(2)}</p>
                  <p>{job.eta}</p>
                </div>
              </article>
            ))}
          </div>

          <div className="job-list completed">
            <h3>Completed jobs</h3>
            {completedJobs.map((job) => (
              <article key={job.id} className="job-row small">
                <div>
                  <p className="eyebrow">{job.id}</p>
                  <p>{job.customer}</p>
                </div>
                <div>
                  <p>${job.payout.toFixed(2)}</p>
                  <p className="label">{job.eta}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {activeTab === 'dashboard' && (
        <section className="panel dashboard">
          <div className="metrics">
            <div className="metric-card">
              <p className="label">Total earnings (today)</p>
              <h2>$62.90</h2>
              <p className="pill subtle">+12% vs yesterday</p>
            </div>
            <div className="metric-card">
              <p className="label">Jobs completed</p>
              <h2>6</h2>
              <p className="pill subtle">2 queued</p>
            </div>
            <div className="metric-card">
              <p className="label">Acceptance rate</p>
              <h2>94%</h2>
              <p className="pill subtle">Target ≥ 85%</p>
            </div>
          </div>

          <div className="alert-card">
            <p className="eyebrow">Surge intel</p>
            <h3>Punggol · 1.3x payouts</h3>
            <p>Spikes from 17:00 – 21:00. Suggested staging: Waterway Point taxi stand.</p>
            <button type="button" className="secondary-action">
              Navigate there
            </button>
          </div>

          <div className="history">
            <h3>Today&apos;s log</h3>
            <ul>
              <li>
                12:40 · LD-2380 · Delivered garments · +$28.80
              </li>
              <li>11:05 · Surge alert triggered for Bukit Timah</li>
              <li>09:15 · LD-2379 · Picked up from River Valley</li>
            </ul>
          </div>
        </section>
      )}
      {isMapExpanded && (
        <div className="map-modal" role="dialog" aria-modal="true">
          <div className="map-modal-content">
            <div className="map-modal-header">
              <h3>Singapore route overview</h3>
              <button type="button" className="ghost small" onClick={() => setIsMapExpanded(false)}>
                Close
              </button>
            </div>
            <iframe
              title="Singapore driver enlarged map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d127654.62967623472!2d103.68375801280434!3d1.344377213089884!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31da11241b5398ab%3A0x500f7acaedaa150!2sSingapore!5e0!3m2!1sen!2ssg!4v1731000000000!5m2!1sen!2ssg"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      )}
      
      {/* Toast notification */}
      {toast && (
        <div className={`toast ${toast.type}`}>
          {toast.message}
        </div>
      )}
    </main>
  );
};

export default DriverApp;
