import React, { createContext, useContext, useState, useEffect } from 'react';

const ComplaintContext = createContext(null);

const INITIAL_COMPLAINTS = [
  {
    id: 'MCT-SAMPLE-001',
    title: 'Dangerous pothole cluster on 4th Main',
    category: 'Roads & Potholes',
    location: 'Ward 14, Main Arterial Road near Market Crossing',
    priority: 'Medium',
    description: 'Multiple deep potholes near market intersection causing traffic slowdowns and two-wheeler skid hazards.',
    reportedAt: 'Yesterday, 10:30 AM',
    status: 'In Progress',
    statusVariant: 'in-progress',
    assignedTo: 'Junior Engineer (Civil - Ward 14)',
    escalationTier: 'Tier 1',
    escalationLevelName: 'Ward Field Officer Level',
    slaTotalHours: 48,
    slaElapsedHours: 18,
    slaRemainingHours: 30,
    slaStatusText: 'On Schedule (Sample SLA: 48h)',
    slaVariant: 'on-schedule',
    notes: 'Material dispatch scheduled for patch work. Site survey completed.',
    citizenName: 'Demo Resident',
    history: [
      { timestamp: 'Yesterday, 10:30 AM', text: 'Complaint registered by citizen with geolocation tag.' },
      { timestamp: 'Yesterday, 11:15 AM', text: 'System mapped category to Roads & Civil Infrastructure Wing.' },
      { timestamp: 'Yesterday, 02:00 PM', text: 'Field inspection completed by JE Ward 14. Work order issued.' }
    ]
  },
  {
    id: 'MCT-SAMPLE-002',
    title: 'Main distribution valve leak',
    category: 'Water Supply & Leakages',
    location: 'Ward 08, Cross Road 3, Pipeline Valve 4B',
    priority: 'High',
    description: 'Subterranean water leak creating roadway sinking and severe potable water pressure drop.',
    reportedAt: '2 days ago, 04:15 PM',
    status: 'Approaching SLA Deadline',
    statusVariant: 'warning',
    assignedTo: 'Assistant Engineer (Water Supply & Drainage)',
    escalationTier: 'Tier 1',
    escalationLevelName: 'Ward Field Officer Level (Threshold Warning)',
    slaTotalHours: 24,
    slaElapsedHours: 21,
    slaRemainingHours: 3,
    slaStatusText: 'Approaching Breach Threshold (Sample SLA: 24h)',
    slaVariant: 'warning',
    notes: 'Excavation team required for subterranean pipe rupture. Auto-escalation trigger in 3 hours.',
    citizenName: 'Demo Resident',
    history: [
      { timestamp: '2 days ago, 04:15 PM', text: 'Grievance registered under Water Supply.' },
      { timestamp: '2 days ago, 05:00 PM', text: 'Assigned to Ward 08 Water Engineer.' },
      { timestamp: 'Today, 01:00 PM', text: 'SLA countdown at 87%. Threshold warning alert triggered.' }
    ]
  },
  {
    id: 'MCT-SAMPLE-003',
    title: 'Overflowing community dumpster',
    category: 'Solid Waste & Garbage',
    location: 'Ward 22, Community Sanitation Point B',
    priority: 'Urgent',
    description: 'Community dumpster has not been emptied for 3 days. Trash spilling across footpath and roadway.',
    reportedAt: '3 days ago, 08:00 AM',
    status: 'Escalated to Tier 2',
    statusVariant: 'escalated',
    assignedTo: 'Sub-Divisional Executive Officer (Sanitation)',
    escalationTier: 'Tier 2',
    escalationLevelName: 'Sub-Divisional Oversight Level',
    slaTotalHours: 12,
    slaElapsedHours: 36,
    slaRemainingHours: 0,
    slaStatusText: 'SLA Elapsed • Escalated automatically by system rule',
    slaVariant: 'escalated',
    notes: 'Initial 12-hour resolution window lapsed without ward sign-off. Escalated to Tier 2 officer for supervisory action.',
    citizenName: 'Demo Resident',
    history: [
      { timestamp: '3 days ago, 08:00 AM', text: 'Sanitation grievance logged.' },
      { timestamp: '3 days ago, 08:00 PM', text: 'Tier 1 SLA (12h) lapsed without closure.' },
      { timestamp: '2 days ago, 09:00 AM', text: 'System automatically escalated complaint to Sub-Divisional Officer (Tier 2).' }
    ]
  },
  {
    id: 'MCT-SAMPLE-004',
    title: 'Four dead streetlight fixtures',
    category: 'Streetlights & Electrical',
    location: 'Ward 11, Outer Ring Road Service Lane',
    priority: 'Medium',
    description: 'Four consecutive LED streetlights are completely non-functional creating safety concerns.',
    reportedAt: '4 days ago, 07:00 PM',
    status: 'Resolved',
    statusVariant: 'on-schedule',
    assignedTo: 'Junior Engineer (Electrical - Ward 11)',
    escalationTier: 'Tier 1',
    escalationLevelName: 'Ward Field Officer Level',
    slaTotalHours: 36,
    slaElapsedHours: 22,
    slaRemainingHours: 14,
    slaStatusText: 'Resolved within SLA (22h of 36h)',
    slaVariant: 'on-schedule',
    notes: 'Ballasts and wiring connections replaced. All 4 fixtures verified operational.',
    citizenName: 'Demo Resident',
    history: [
      { timestamp: '4 days ago, 07:00 PM', text: 'Logged by resident.' },
      { timestamp: '3 days ago, 10:00 AM', text: 'Electrical line crew dispatched with bucket truck.' },
      { timestamp: '3 days ago, 05:00 PM', text: 'Repairs completed and ticket marked resolved.' }
    ]
  },
  {
    id: 'MCT-SAMPLE-005',
    title: 'Flooded railway underpass drainage choke',
    category: 'Drainage & Sewage',
    location: 'Ward 03, Railway Underpass Choke Point',
    priority: 'Emergency',
    description: 'Severe stormwater drain silt accumulation causing 3-foot waterlogging and vehicle stranding.',
    reportedAt: '5 days ago, 02:00 PM',
    status: 'Escalated to Tier 3',
    statusVariant: 'escalated',
    assignedTo: 'Zonal Municipal Commissioner',
    escalationTier: 'Tier 3',
    escalationLevelName: 'Zonal & Municipal Administration',
    slaTotalHours: 24,
    slaElapsedHours: 72,
    slaRemainingHours: 0,
    slaStatusText: 'Critical Breach • Escalated to Commissioner Executive Queue',
    slaVariant: 'escalated',
    notes: 'Lapsed past Tier 1 and Tier 2 grace periods. Central commissioner intervention invoked for emergency heavy pumping machinery.',
    citizenName: 'Demo Resident',
    history: [
      { timestamp: '5 days ago, 02:00 PM', text: 'Emergency drainage failure logged.' },
      { timestamp: '4 days ago, 02:00 PM', text: 'Tier 1 SLA expired. Escalated to Sub-Divisional Officer.' },
      { timestamp: '3 days ago, 02:00 PM', text: 'Tier 2 SLA expired without resolution. Escalated to Commissioner Desk (Tier 3).' }
    ]
  }
];

export function ComplaintProvider({ children }) {
  const [complaints, setComplaints] = useState(() => {
    try {
      const stored = localStorage.getItem('mct_demo_complaints');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Could not read from localStorage, using initial dataset');
    }
    return INITIAL_COMPLAINTS;
  });

  const [currentRole, setCurrentRole] = useState(() => {
    return localStorage.getItem('mct_demo_role') || 'citizen';
  });

  // Sync state to localStorage for persistence across reloads
  useEffect(() => {
    try {
      localStorage.setItem('mct_demo_complaints', JSON.stringify(complaints));
    } catch (e) {
      console.warn('Could not write to localStorage');
    }
  }, [complaints]);

  useEffect(() => {
    try {
      localStorage.setItem('mct_demo_role', currentRole);
    } catch (e) {
      console.warn('Could not write role to localStorage');
    }
  }, [currentRole]);

  // Add a newly submitted complaint
  const addComplaint = ({ title, category, location, priority, description, citizenName = 'Demo Resident' }) => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const newId = `MCT-2026-${randomNum}`;
    
    // SLA estimation based on category
    let slaHours = 48;
    if (category.includes('Garbage')) slaHours = 12;
    else if (category.includes('Water') || category.includes('Drainage')) slaHours = 24;
    else if (category.includes('Streetlight')) slaHours = 36;

    const newRecord = {
      id: newId,
      title,
      category,
      location,
      priority,
      description,
      reportedAt: 'Just now',
      status: 'Submitted',
      statusVariant: 'in-progress',
      assignedTo: `Ward Field Officer (${location.split(',')[0] || 'Ward Central'})`,
      escalationTier: 'Tier 1',
      escalationLevelName: 'Ward Field Officer Level',
      slaTotalHours: slaHours,
      slaElapsedHours: 0,
      slaRemainingHours: slaHours,
      slaStatusText: `On Schedule (Sample SLA: ${slaHours}h)`,
      slaVariant: 'on-schedule',
      notes: 'Complaint logged into civic dispatch queue. Awaiting field crew assignment.',
      citizenName,
      history: [
        { timestamp: 'Just now', text: 'Grievance submitted by citizen via online portal.' },
        { timestamp: 'Just now', text: `Auto-routed to departmental queue with ${slaHours}h SLA timer.` }
      ]
    };

    setComplaints(prev => [newRecord, ...prev]);
    return newId;
  };

  // Update status (e.g. from Officer Dashboard)
  const updateComplaintStatus = (id, newStatus, newNotes) => {
    setComplaints(prev => prev.map(item => {
      if (item.id === id) {
        let variant = 'in-progress';
        let tier = item.escalationTier;
        let tierName = item.escalationLevelName;
        let slaText = item.slaStatusText;
        let slaVar = item.slaVariant;

        if (newStatus === 'Resolved') {
          variant = 'on-schedule';
          slaText = 'Resolved within SLA';
          slaVar = 'on-schedule';
        } else if (newStatus === 'In Progress') {
          variant = 'in-progress';
        } else if (newStatus.includes('Escalate') || newStatus === 'Escalated to Tier 2') {
          variant = 'escalated';
          tier = 'Tier 2';
          tierName = 'Sub-Divisional Oversight Level';
          slaText = 'Escalated to Tier 2 (Officer Triggered)';
          slaVar = 'escalated';
        } else if (newStatus === 'Escalated to Tier 3') {
          variant = 'escalated';
          tier = 'Tier 3';
          tierName = 'Zonal & Municipal Administration';
          slaText = 'Critical Breach (Escalated to Tier 3)';
          slaVar = 'escalated';
        }

        const updatedHistory = [
          ...item.history,
          {
            timestamp: 'Just now',
            text: newNotes || `Status updated to "${newStatus}" by assigned officer.`
          }
        ];

        return {
          ...item,
          status: newStatus,
          statusVariant: variant,
          escalationTier: tier,
          escalationLevelName: tierName,
          slaStatusText: slaText,
          slaVariant: slaVar,
          notes: newNotes || item.notes,
          history: updatedHistory
        };
      }
      return item;
    }));
  };

  const getComplaintById = (id) => {
    if (!id) return null;
    return complaints.find(c => c.id.trim().toUpperCase() === id.trim().toUpperCase()) || null;
  };

  const resetToSampleData = () => {
    setComplaints(INITIAL_COMPLAINTS);
  };

  return (
    <ComplaintContext.Provider value={{
      complaints,
      currentRole,
      setCurrentRole,
      addComplaint,
      updateComplaintStatus,
      getComplaintById,
      resetToSampleData
    }}>
      {children}
    </ComplaintContext.Provider>
  );
}

export function useComplaints() {
  const context = useContext(ComplaintContext);
  if (!context) {
    throw new Error('useComplaints must be used within a ComplaintProvider');
  }
  return context;
}
