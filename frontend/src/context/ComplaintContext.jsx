import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const ComplaintContext = createContext(null);

const API_BASE = '/api';

const INITIAL_COMPLAINTS = [
  {
    id: 'MCT-SAMPLE-001',
    numericId: 1,
    title: 'Dangerous pothole cluster on 4th Main',
    category: 'Roads & Potholes',
    location: 'Ward 2 - Malleshwaram (North Zone)',
    priority: 'Medium',
    description: 'Multiple deep potholes near market intersection causing traffic slowdowns and two-wheeler skid hazards.',
    reportedAt: 'Yesterday, 10:30 AM',
    status: 'In Progress',
    statusVariant: 'in-progress',
    assignedTo: 'Amit Sharma (Field Officer)',
    escalationTier: 'Tier 1',
    escalationLevelName: 'Ward Field Officer Level',
    slaTotalHours: 48,
    slaElapsedHours: 18,
    slaRemainingHours: 30,
    slaStatusText: 'On Schedule (PostgreSQL SLA: 48h)',
    slaVariant: 'on-schedule',
    notes: 'Material dispatch scheduled for patch work. Site survey completed.',
    citizenName: 'Aarav Mehta',
    citizenPhone: '9876543210',
    history: [
      { timestamp: 'Yesterday, 10:30 AM', text: 'Complaint registered by citizen with geolocation tag.' },
      { timestamp: 'Yesterday, 11:15 AM', text: 'System mapped category to Roads & Civil Infrastructure Wing.' },
      { timestamp: 'Yesterday, 02:00 PM', text: 'Field inspection completed by JE Ward 14. Work order issued.' }
    ]
  },
  {
    id: 'MCT-SAMPLE-002',
    numericId: 2,
    title: 'Main distribution valve leak',
    category: 'Water Supply & Leakages',
    location: 'Ward 4 - Whitefield (East Zone)',
    priority: 'High',
    description: 'Subterranean water leak creating roadway sinking and severe potable water pressure drop.',
    reportedAt: '2 days ago, 04:15 PM',
    status: 'Approaching SLA Deadline',
    statusVariant: 'warning',
    assignedTo: 'Manoj Joshi (Field Officer)',
    escalationTier: 'Tier 1',
    escalationLevelName: 'Ward Field Officer Level (Threshold Warning)',
    slaTotalHours: 24,
    slaElapsedHours: 21,
    slaRemainingHours: 3,
    slaStatusText: 'Approaching Breach Threshold (PostgreSQL SLA: 24h)',
    slaVariant: 'warning',
    notes: 'Excavation team required for subterranean pipe rupture. Auto-escalation trigger in 3 hours.',
    citizenName: 'Diya Sengupta',
    citizenPhone: '9876543211',
    history: [
      { timestamp: '2 days ago, 04:15 PM', text: 'Grievance registered under Water Supply.' },
      { timestamp: '2 days ago, 05:00 PM', text: 'Assigned to Ward Water Engineer.' },
      { timestamp: 'Today, 01:00 PM', text: 'SLA countdown approaching deadline. Stored procedure will trigger escalation.' }
    ]
  },
  {
    id: 'MCT-SAMPLE-003',
    numericId: 3,
    title: 'Overflowing community dumpster',
    category: 'Solid Waste & Garbage',
    location: 'Ward 5 - Jayanagar (South Zone)',
    priority: 'High',
    description: 'Community dumpster has not been emptied for 3 days. Trash spilling across footpath and roadway.',
    reportedAt: '3 days ago, 08:00 AM',
    status: 'Escalated to Tier 2',
    statusVariant: 'escalated',
    assignedTo: 'Fatima Sheikh (Supervisor)',
    escalationTier: 'Tier 2',
    escalationLevelName: 'Sub-Divisional Oversight Level',
    slaTotalHours: 12,
    slaElapsedHours: 36,
    slaRemainingHours: 0,
    slaStatusText: 'SLA Elapsed • Escalated automatically by PostgreSQL stored procedure',
    slaVariant: 'escalated',
    notes: 'Initial 12-hour resolution window lapsed. Procedure escalated to Tier 2 officer for supervisory action.',
    citizenName: 'Rohan Gupta',
    citizenPhone: '9876543212',
    history: [
      { timestamp: '3 days ago, 08:00 AM', text: 'Sanitation grievance logged.' },
      { timestamp: '3 days ago, 08:00 PM', text: 'Tier 1 SLA (12h) lapsed without closure.' },
      { timestamp: '2 days ago, 09:00 AM', text: 'PostgreSQL stored procedure escalate_overdue_complaints() executed.' },
      { timestamp: '2 days ago, 09:00 AM', text: 'Assigned officer upgraded to Fatima Sheikh (Supervisor).' }
    ]
  }
];

export function ComplaintProvider({ children }) {
  const [complaints, setComplaints] = useState(INITIAL_COMPLAINTS);
  const [currentRole, setCurrentRole] = useState(() => {
    return localStorage.getItem('mct_demo_role') || 'citizen';
  });
  const [isLoading, setIsLoading] = useState(false);
  const [backendConnected, setBackendConnected] = useState(false);
  const [escalationNotice, setEscalationNotice] = useState(null);

  // Fetch complaints from backend API
  const fetchComplaints = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/complaints`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setComplaints(data);
          setBackendConnected(true);
        }
      } else {
        console.warn('API fetch returned non-200 status, using fallback dataset');
      }
    } catch (err) {
      console.warn('Backend API connection unavailable, operating with cached/demo dataset:', err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial load from backend
  useEffect(() => {
    fetchComplaints();
  }, [fetchComplaints]);

  // Sync role to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('mct_demo_role', currentRole);
    } catch (e) {
      console.warn('Could not write role to localStorage');
    }
  }, [currentRole]);

  // Add a newly submitted complaint (POST to PostgreSQL API)
  const addComplaint = async ({ title, category, location, priority, description, citizenName = 'Demo Resident', citizenPhone = '9876543210' }) => {
    try {
      const res = await fetch(`${API_BASE}/complaints`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          category,
          location,
          priority,
          description,
          citizenName,
          citizenPhone
        })
      });

      if (res.ok) {
        const created = await res.json();
        setComplaints(prev => [created, ...prev]);
        setBackendConnected(true);
        return created.id;
      }
    } catch (err) {
      console.warn('Backend API unavailable for complaint submission, generating client record:', err);
    }

    // Client-side fallback if backend API is offline
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const newId = `MCT-2026-${randomNum}`;

    let slaHours = 48;
    if (category.includes('Garbage') || category.includes('Sanitation')) slaHours = 12;
    else if (category.includes('Water') || category.includes('Drainage')) slaHours = 24;
    else if (category.includes('Streetlight')) slaHours = 36;

    const newRecord = {
      id: newId,
      numericId: randomNum,
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
      slaStatusText: `On Schedule (PostgreSQL SLA: ${slaHours}h)`,
      slaVariant: 'on-schedule',
      notes: 'Complaint logged into civic dispatch queue. Awaiting field crew assignment.',
      citizenName,
      citizenPhone,
      history: [
        { timestamp: 'Just now', text: 'Grievance submitted by citizen via online portal.' },
        { timestamp: 'Just now', text: `Auto-routed to departmental queue with ${slaHours}h SLA timer via trg_set_deadline.` }
      ]
    };

    setComplaints(prev => [newRecord, ...prev]);
    return newId;
  };

  // Update complaint status (e.g. from Officer Dashboard)
  const updateComplaintStatus = async (id, newStatus, newNotes) => {
    try {
      const res = await fetch(`${API_BASE}/complaints/${id}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus,
          notes: newNotes
        })
      });

      if (res.ok) {
        const updated = await res.json();
        setComplaints(prev => prev.map(item => item.id === id || item.numericId === updated.numericId ? updated : item));
        setBackendConnected(true);
        return;
      }
    } catch (err) {
      console.warn('Backend API update failed, applying optimistic update:', err);
    }

    // Client-side fallback update
    setComplaints(prev => prev.map(item => {
      if (item.id === id || String(item.numericId) === String(id)) {
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
          slaText = 'Escalated to Tier 2 (PostgreSQL Procedure)';
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

  // Run the PostgreSQL Stored Procedure for SLA Escalation
  const runEscalation = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/admin/escalate`, { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setEscalationNotice(data.message || 'Escalation procedure executed.');
        await fetchComplaints();
        setTimeout(() => setEscalationNotice(null), 6000);
        return data;
      }
    } catch (err) {
      console.warn('Failed to call escalate stored procedure API:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Find complaint by alphanumeric ID or raw numeric ID
  const getComplaintById = (id) => {
    if (!id) return null;
    const clean = id.trim().toUpperCase();
    return complaints.find(c => {
      const cId = (c.id || '').toUpperCase();
      const numId = String(c.numericId || '');
      return cId === clean || numId === clean || cId.endsWith(clean) || clean.endsWith(numId);
    }) || null;
  };

  const resetToSampleData = () => {
    fetchComplaints();
  };

  return (
    <ComplaintContext.Provider value={{
      complaints,
      currentRole,
      setCurrentRole,
      addComplaint,
      updateComplaintStatus,
      getComplaintById,
      resetToSampleData,
      fetchComplaints,
      runEscalation,
      isLoading,
      backendConnected,
      escalationNotice
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
