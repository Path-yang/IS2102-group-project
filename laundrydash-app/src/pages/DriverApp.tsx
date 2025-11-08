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
};

type TabKey = 'active' | 'requests' | 'jobs' | 'dashboard';

const statusFlow: Array<{ key: StatusKey; label: string; detail: string }> = [
  { key: 'accepted', label: 'Accepted', detail: 'Job locked in, prep to move' },
  { key: 'enRoutePickup', label: 'En Route to Pickup', detail: 'Navigating to customer' },
  { key: 'pickedUp', label: 'Picked Up', detail: 'Laundry secured with photo proof' },
  { key: 'atPartner', label: 'Delivered to Partner', detail: 'Drop-off to FreshFoam Laundry' },
  { key: 'returning', label: 'En Route to Customer', detail: 'Clean garments onboard' },
  { key: 'delivered', label: 'Delivered', detail: 'Customer confirmed receipt' },
  { key: 'completed', label: 'Completed', detail: 'Job auto-submitted to earnings' },
];

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
};

const seededActiveJobs: Job[] = [initialActiveJob, secondaryActiveJob];

const buildRouteStops = (job: Job) => [
  {
    label: 'Pickup',
    detail: job.pickup,
    eta: 'ETA 4 mins',
  },
  {
    label: 'Drop at partner',
    detail: job.partner,
    eta: 'ETA 18 mins',
  },
  {
    label: 'Return to customer',
    detail: job.dropoff,
    eta: 'ETA 40 mins',
  },
];

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
  },
];

const DriverApp = () => {
  const [isOnline, setIsOnline] = useState(true);
  const [activeTab, setActiveTab] = useState<TabKey>('active');
  const [activeJobs, setActiveJobs] = useState<Job[]>(seededActiveJobs);
  const [activeIndex, setActiveIndex] = useState(0);
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
    },
  ]);
  const [completedJobs, setCompletedJobs] = useState<Job[]>(completedSeed);
  const [requestTimer, setRequestTimer] = useState(30);

  const activeJob = activeJobs[activeIndex] ?? null;
  const activeJobStageIndex = activeJob ? jobStatusMap[activeJob.id] ?? 0 : 0;
  const activeJobStatus = statusFlow[activeJobStageIndex];
  const isAdvanceDisabled = !activeJob || activeJobStageIndex >= statusFlow.length - 1;
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

  const handleAdvanceStatus = () => {
    if (!activeJob) return;
    setJobStatusMap((prev) => {
      const currentStage = prev[activeJob.id] ?? 0;
      if (currentStage >= statusFlow.length - 1) {
        return prev;
      }
      const nextIndex = currentStage + 1;
      const updated = { ...prev, [activeJob.id]: nextIndex };
      const nextStatus = statusFlow[nextIndex];

      if (nextStatus.key === 'completed') {
        setCompletedJobs((prevCompleted) => [
          {
            ...activeJob,
            status: 'Completed',
            eta: 'Completed just now',
          },
          ...prevCompleted,
        ]);
        setActiveJobs((prevJobs) => {
          const filtered = prevJobs.filter((job) => job.id !== activeJob.id);
          setActiveIndex((current) => {
            if (filtered.length === 0) {
              return 0;
            }
            return Math.min(current, filtered.length - 1);
          });
          return filtered;
        });
        const { [activeJob.id]: _removed, ...rest } = updated;
        return rest;
      }

      return updated;
    });
  };

  const handleAcceptRequest = () => {
    if (!incomingRequest) return;
    setActiveJobs((prev) => {
      const nextJobs = [...prev, { ...incomingRequest, status: 'In Progress' }];
      setActiveIndex(nextJobs.length - 1);
      return nextJobs;
    });
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
      const index = jobStatusMap[job.id] ?? 0;
      return {
        ...job,
        status: statusFlow[index].label,
        eta: statusFlow[index].detail,
      };
    });
    return [...activeEntries, ...upcomingJobs];
  }, [activeJobs, jobStatusMap, upcomingJobs]);

  return (
    <main className="driver-app">
      <header className="driver-header">
        <div>
          <p className="eyebrow">LaundryDash Driver</p>
          <h1>Shift cockpit</h1>
          <p className="subtitle">
            Accept jobs, navigate between customer and partner stops, update proof-of-service, and
            track earnings in one screen built for mobile portrait mode.
          </p>
        </div>
        <Link to="/" className="home-pill secondary small-pill">
          Home
        </Link>
      </header>

      <section className="status-bar">
        <div>
          <p className="eyebrow">Availability</p>
          <h2>{isOnline ? 'Online & discoverable' : 'Offline'}</h2>
          <p>{isOnline ? 'You can receive new LaundryDash requests.' : 'You will not get jobs.'}</p>
        </div>
        <label className="switch">
          <input
            type="checkbox"
            checked={isOnline}
            onChange={() => setIsOnline((prev) => !prev)}
          />
          <span className="slider" />
        </label>
      </section>

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
          {activeJob ? (
            <>
              {activeJobs.length > 1 && (
                <div className="job-carousel">
                  <button
                    type="button"
                    className="carousel-btn"
                    onClick={() => setActiveIndex((prev) => Math.max(prev - 1, 0))}
                    disabled={activeIndex === 0}
                    aria-label="Previous active job"
                  >
                    ‹
                  </button>
                  <p>
                    Job {activeIndex + 1} of {activeJobs.length}
                  </p>
                  <button
                    type="button"
                    className="carousel-btn"
                    onClick={() =>
                      setActiveIndex((prev) => Math.min(prev + 1, activeJobs.length - 1))
                    }
                    disabled={activeIndex === activeJobs.length - 1}
                    aria-label="Next active job"
                  >
                    ›
                  </button>
                </div>
              )}
              <div className="job-card">
                <div className="job-top">
                  <div>
                    <p className="eyebrow">Active job</p>
                    <h3>{activeJob.id}</h3>
                  </div>
                  <span className="pill">{activeJobStatus.label}</span>
                </div>
                <p className="customer-line">
                  {activeJob.customer} · {activeJob.bags} bags
                </p>
                <p className="label">Pickup</p>
                <p>{activeJob.pickup}</p>
                <p className="label">Laundry Partner</p>
                <p>{activeJob.partner}</p>
                <p className="label">Drop-off</p>
                <p>{activeJob.dropoff}</p>
                <div className="badge-row compact">
                  <span>{activeJob.service}</span>
                  <span>{activeJob.eta}</span>
                  <span>${activeJob.payout.toFixed(2)}</span>
                </div>
                {activeJob.notes && <p className="note">Note: {activeJob.notes}</p>}
              </div>

              <div className="timeline">
                {statusFlow.map((status, index) => (
                  <div key={status.key} className="timeline-item">
                    <div className={index <= activeJobStageIndex ? 'dot active' : 'dot'} />
                    <div>
                      <p className="timeline-title">{status.label}</p>
                      <p className="timeline-detail">{status.detail}</p>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  className="primary-action full"
                  onClick={handleAdvanceStatus}
                  disabled={isAdvanceDisabled}
                >
                  {isAdvanceDisabled ? 'Job completed' : 'Advance to next step'}
                </button>
              </div>

              <div className="route-card">
                <p className="eyebrow">Route overview</p>
                <div className="route-stops">
                  {buildRouteStops(activeJob).map((stop) => (
                    <div key={stop.label} className="route-stop">
                      <p className="label">{stop.label}</p>
                      <p>{stop.detail}</p>
                      <p className="route-eta">{stop.eta}</p>
                    </div>
                  ))}
                </div>
                <div className="map-card">
                  <iframe
                    title="Singapore driver route"
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

              <div className="actions-grid">
                <button type="button" className="ghost">
                  Confirm pickup
                </button>
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
    </main>
  );
};

export default DriverApp;
