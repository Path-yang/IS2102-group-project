# Customer App - Visual Structure Overview

## 🎨 Application Flow

```
LaundryDash Platform
│
├── Landing Page (/)
│   ├── Hero Card
│   │   ├── "Choose your workspace"
│   │   ├── [Customer App] Button
│   │   └── [Driver App] Button
│   │
│   └── Experience Cards
│       ├── Customer Card ← NOW ENABLED ✓
│       │   ├── Service selection
│       │   ├── Pickup scheduling
│       │   └── Order tracking
│       │
│       └── Driver Card
│           ├── Job management
│           ├── Proof-of-service
│           └── Earnings tracking
│
├── Customer App (/customer) ← NEW! ✓
│   │
│   ├── [HOME] [TRACK] [ORDERS] [PROFILE] ← Tab Navigation
│   │
│   ├── HOME TAB
│   │   ├── Service Selection Grid
│   │   │   ├── [👕 Wash & Fold] $2.50/kg
│   │   │   ├── [🧥 Dry Clean] $8.00/item
│   │   │   ├── [✨ Premium Care] $15.00/item
│   │   │   └── [⚡ Express] +50%
│   │   │
│   │   ├── Schedule Pickup Form (when service selected)
│   │   │   ├── Address Input
│   │   │   ├── Date Picker
│   │   │   ├── Time Dropdown
│   │   │   ├── Special Instructions
│   │   │   └── [Confirm Pickup] Button
│   │   │
│   │   └── Active Order Alert
│   │       └── [Track Order] Button
│   │
│   ├── TRACK ORDER TAB
│   │   ├── Order Details Card
│   │   │   ├── Order ID: LD-C-8821
│   │   │   ├── Service Type
│   │   │   ├── Pickup/Delivery Times
│   │   │   └── Total Cost
│   │   │
│   │   ├── Driver Info Card
│   │   │   ├── Driver Avatar
│   │   │   ├── Driver Name
│   │   │   ├── ETA: 5-10 mins
│   │   │   ├── [Call Driver] Button
│   │   │   └── [Message] Button
│   │   │
│   │   ├── Progress Timeline
│   │   │   ├── ● Order Placed ✓
│   │   │   ├── ● Driver Assigned ✓
│   │   │   ├── ○ Pickup Complete
│   │   │   ├── ○ In Processing
│   │   │   ├── ○ Ready for Delivery
│   │   │   └── ○ Delivered
│   │   │
│   │   ├── Live Tracking Map
│   │   │   └── [Embedded Google Maps]
│   │   │
│   │   └── [Contact Support] Button
│   │
│   ├── ORDERS TAB
│   │   ├── Active Orders Section
│   │   │   └── Order Card
│   │   │       ├── LD-C-8821 | In Progress
│   │   │       ├── Pickup: Today, 2:30 PM
│   │   │       ├── Delivery: Tomorrow, 6:00 PM
│   │   │       ├── Total: $28.50
│   │   │       └── [Track Order] Button
│   │   │
│   │   └── Past Orders Section
│   │       ├── Order Card 1
│   │       │   ├── LD-C-8820 | Completed
│   │       │   ├── Nov 6, 6:00 PM
│   │       │   ├── Total: $18.75
│   │       │   ├── [Reorder] Button
│   │       │   └── [View Receipt] Button
│   │       │
│   │       └── Order Card 2
│   │           ├── LD-C-8819 | Completed
│   │           └── [...similar structure]
│   │
│   └── PROFILE TAB
│       ├── Profile Header
│       │   ├── 👤 Avatar
│       │   ├── Sarah Chen
│       │   └── sarah.chen@email.com
│       │
│       ├── Saved Addresses
│       │   ├── 🏠 Home Address
│       │   │   ├── 123 Orchard Road...
│       │   │   └── [Edit] Button
│       │   └── [Add New Address] Button
│       │
│       ├── Payment Methods
│       │   ├── 💳 Credit Card
│       │   │   ├── •••• •••• •••• 4242
│       │   │   └── [Edit] Button
│       │   └── [Add Payment Method] Button
│       │
│       ├── Preferences
│       │   ├── Notifications [●──]ON
│       │   └── SMS Updates  [●──]ON
│       │
│       ├── Support Links
│       │   ├── [Help Center]
│       │   ├── [Contact Support]
│       │   └── [Terms & Privacy]
│       │
│       └── [Sign Out] Button (Red)
│
└── Driver App (/driver) ← EXISTING
    └── [Already Implemented]
```

---

## 🎨 Design System Components

### Colors Used:
```
Primary Purple: #7f56d9  ████████
Secondary Blue: #6366f1  ████████
Accent Blue:    #4338ca  ████████
Success Green:  #34d399  ████████
Gray Dark:      #101828  ████████
Gray Medium:    #475467  ████████
Gray Light:     #f2f4f7  ████████
Background:     #f6f7fb  ████████
```

### UI Components:
```
┌─────────────────────────────────┐
│ Service Card (Clickable)        │
│ ┌─────────┐                     │
│ │   👕    │  Large Icon         │
│ └─────────┘                     │
│ Service Name                    │
│ Description text...             │
│ ────────────────────────────    │
│ $2.50/kg     24-48 hours       │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│ ● Active     Timeline Item      │
│ │ Order Placed                  │
│ │ Your order confirmed          │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│ Tab Navigation                   │
│ ┌──────┐┌──────┐┌──────┐┌──────┐│
│ │ HOME ││TRACK ││ORDERS││PROFILE││
│ └──────┘└──────┘└──────┘└──────┘│
└─────────────────────────────────┘

┌─────────────────────────────────┐
│ Form Input                       │
│ ┌─────────────────────────────┐ │
│ │ User Input Here...          │ │
│ └─────────────────────────────┘ │
└─────────────────────────────────┘

┌─────────────────┐
│ [Button Text]   │  Primary Action
└─────────────────┘

┌─────────────────┐
│ [Button Text]   │  Secondary Action
└─────────────────┘

┌─────────────────┐
│ [Button Text]   │  Ghost Button
└─────────────────┘

 Status Badge
┌────────────┐
│ In Progress│
└────────────┘
```

---

## 📱 Responsive Breakpoints

```
Mobile (Portrait)
┌─────────┐
│  375px  │  Primary target
│         │  Optimized for
│  to     │  iPhone SE to
│         │  iPhone 14 Pro Max
│  428px  │
└─────────┘

Tablet/Small Desktop
┌──────────────┐
│   520px+     │  Adjustments for
│              │  larger screens
└──────────────┘

Desktop
┌────────────────────┐
│      960px+         │  Max width container
│                     │  Centered layout
└────────────────────┘
```

---

## 🔄 User Journey Flow

### New Customer Journey:
```
1. Land on Home Page
   ↓
2. Click [Customer App]
   ↓
3. See 4 Service Options
   ↓
4. Click Service Card (e.g., Wash & Fold)
   ↓
5. Schedule Pickup Form Opens
   ├── Enter Address
   ├── Select Date
   ├── Choose Time
   └── Add Instructions (optional)
   ↓
6. Click [Confirm Pickup]
   ↓
7. Redirected to [Track Order] Tab
   ↓
8. See Order Progress Timeline
   ├── Order Placed ✓
   ├── Driver Assigned (waiting...)
   └── See Driver Info when assigned
   ↓
9. Track order through 6 stages
   ↓
10. Order Completed
   ↓
11. View in [Orders] Tab History
   ↓
12. Click [Reorder] for next time!
```

### Returning Customer Journey:
```
1. Land on Home Page
   ↓
2. Click [Customer App]
   ↓
3. See Active Order Alert
   ↓
4. Click [Track Order]
   ↓
5. Monitor progress
   OR
6. Go to [Orders] Tab
   ↓
7. Click [Reorder] on past order
   ↓
8. Quick re-schedule same service
```

---

## 📊 State Management Overview

```typescript
Customer App State:
├── activeTab: 'home' | 'track' | 'orders' | 'profile'
├── selectedService: string | null
├── showScheduleForm: boolean
├── activeOrder: Order | null
├── orderHistory: Order[]
│
├── Form State:
│   ├── pickupAddress: string
│   ├── pickupDate: string
│   ├── pickupTime: string
│   └── specialInstructions: string
│
└── UI State:
    └── Various display toggles
```

---

## 🎯 Key Features Summary

### HOME TAB:
✅ 4 Interactive service cards
✅ Full scheduling form
✅ Address management
✅ Date/time validation
✅ Active order quick link

### TRACK TAB:
✅ Real-time order status
✅ 6-stage progress timeline
✅ Driver information
✅ Live map tracking
✅ Contact buttons
✅ Empty state handling

### ORDERS TAB:
✅ Active orders list
✅ Complete order history
✅ Reorder functionality
✅ Receipt access
✅ Status badges

### PROFILE TAB:
✅ User profile display
✅ Address management
✅ Payment methods
✅ Notification preferences
✅ Support links
✅ Sign out

---

## 📐 Component Hierarchy

```
CustomerApp
│
├── Header
│   ├── Eyebrow Text
│   ├── Title
│   ├── Subtitle
│   └── Home Link
│
├── Tab Navigation
│   ├── Home Tab Button
│   ├── Track Tab Button
│   ├── Orders Tab Button
│   └── Profile Tab Button
│
└── Tab Content (conditional)
    │
    ├── Home Tab Content
    │   ├── Service Selection
    │   │   └── ServiceCard × 4
    │   ├── Schedule Form
    │   │   ├── Input Fields
    │   │   ├── Dropdowns
    │   │   └── Submit Button
    │   └── Active Order Alert
    │
    ├── Track Tab Content
    │   ├── OrderDetailsCard
    │   ├── DriverInfoCard
    │   ├── ProgressTimeline
    │   │   └── TimelineItem × 6
    │   ├── MapCard
    │   └── SupportButton
    │
    ├── Orders Tab Content
    │   ├── Active Orders
    │   │   └── OrderCard
    │   └── Past Orders
    │       └── OrderCard × N
    │
    └── Profile Tab Content
        ├── ProfileHeader
        ├── AddressSection
        ├── PaymentSection
        ├── PreferencesSection
        └── SupportSection
```

---

This visual overview should help you understand the complete structure and functionality of your new Customer App! 🎉
