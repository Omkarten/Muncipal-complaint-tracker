-- ==============================================================================
-- 07_seed_data.sql: Realistic Seed Data for Evaluation & Demonstrations
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. Departments (5)
-- ------------------------------------------------------------------------------
INSERT INTO Department (dept_name) VALUES
('Roads & Infrastructure'),
('Electricity & Lighting'),
('Water Supply & Sewerage'),
('Solid Waste & Sanitation'),
('Public Health');

-- ------------------------------------------------------------------------------
-- 2. Wards (10)
-- ------------------------------------------------------------------------------
INSERT INTO Ward (ward_name, zone) VALUES
('Ward 1 - Gandhi Nagar', 'North'),
('Ward 2 - Malleshwaram', 'North'),
('Ward 3 - Indiranagar', 'East'),
('Ward 4 - Whitefield', 'East'),
('Ward 5 - Jayanagar', 'South'),
('Ward 6 - JP Nagar', 'South'),
('Ward 7 - Rajajinagar', 'West'),
('Ward 8 - Vijayanagar', 'West'),
('Ward 9 - Shivaji Nagar', 'Central'),
('Ward 10 - MG Road Area', 'Central');

-- ------------------------------------------------------------------------------
-- 3. Officers (15) with 3-Tier Hierarchy (Head -> Supervisor -> Field Officer)
-- ------------------------------------------------------------------------------
-- Tier 1: Department Heads (supervisor_id IS NULL)
INSERT INTO Officer (name, dept_id, designation, supervisor_id, email) VALUES
('Dr. Ramesh Rao', 1, 'Head', NULL, 'ramesh.rao@municipality.gov.in'),     -- id: 1
('Smt. Sunita Verma', 2, 'Head', NULL, 'sunita.verma@municipality.gov.in'),  -- id: 2
('Shri Anil Kumar', 3, 'Head', NULL, 'anil.kumar@municipality.gov.in'),      -- id: 3
('Smt. Meenakshi Sundaram', 4, 'Head', NULL, 'meenakshi.s@municipality.gov.in'), -- id: 4
('Dr. Harish Patel', 5, 'Head', NULL, 'harish.patel@municipality.gov.in');   -- id: 5

-- Tier 2: Supervisors (report to Heads)
INSERT INTO Officer (name, dept_id, designation, supervisor_id, email) VALUES
('Vikram Malhotra', 1, 'Supervisor', 1, 'vikram.m@municipality.gov.in'),     -- id: 6
('Pooja Hegde', 2, 'Supervisor', 2, 'pooja.h@municipality.gov.in'),          -- id: 7
('Karthik Nambiar', 3, 'Supervisor', 3, 'karthik.n@municipality.gov.in'),     -- id: 8
('Fatima Sheikh', 4, 'Supervisor', 4, 'fatima.s@municipality.gov.in'),       -- id: 9
('Rajeshwari Iyer', 5, 'Supervisor', 5, 'rajeshwari.i@municipality.gov.in');  -- id: 10

-- Tier 3: Field Officers (report to Supervisors)
INSERT INTO Officer (name, dept_id, designation, supervisor_id, email) VALUES
('Amit Sharma', 1, 'Field Officer', 6, 'amit.sharma@municipality.gov.in'),    -- id: 11
('Deepak Chawla', 2, 'Field Officer', 7, 'deepak.c@municipality.gov.in'),    -- id: 12
('Manoj Joshi', 3, 'Field Officer', 8, 'manoj.j@municipality.gov.in'),       -- id: 13
('Kavita Deshmukh', 4, 'Field Officer', 9, 'kavita.d@municipality.gov.in'),  -- id: 14
('Suresh Raina', 5, 'Field Officer', 10, 'suresh.r@municipality.gov.in');     -- id: 15

-- ------------------------------------------------------------------------------
-- 4. Citizens (22)
-- ------------------------------------------------------------------------------
INSERT INTO Citizen (name, phone, email, address) VALUES
('Aarav Mehta', '9876543210', 'aarav.mehta@example.com', '12 Cross, Malleshwaram'),
('Diya Sengupta', '9876543211', 'diya.s@example.com', '45 Indiranagar 100ft Rd'),
('Rohan Gupta', '9876543212', 'rohan.g@example.com', '78 Whitefield Main Rd'),
('Ananya Sharma', '9876543213', 'ananya.sharma@example.com', '9th Block, Jayanagar'),
('Ishaan Reddy', '9876543214', 'ishaan.r@example.com', '21 JP Nagar 3rd Phase'),
('Pooja Nair', '9876543215', 'pooja.nair@example.com', '14 Rajajinagar 1st Stage'),
('Kabir Khan', '9876543216', 'kabir.khan@example.com', '33 Vijayanagar Club Rd'),
('Sneha Roy', '9876543217', 'sneha.roy@example.com', '5 Commercial St, Shivaji Nagar'),
('Aditya Joshi', '9876543218', 'aditya.j@example.com', '99 Brigade Rd, MG Road'),
('Meera Das', '9876543219', 'meera.das@example.com', '10 Gandhi Nagar 2nd Main'),
('Siddharth Menon', '9876543220', 'sid.menon@example.com', '88 Malleshwaram West'),
('Tanvi Kulkarni', '9876543221', 'tanvi.k@example.com', '17 Indiranagar Double Rd'),
('Arjun Kapoor', '9876543222', 'arjun.k@example.com', '4 ITPL Main Rd, Whitefield'),
('Rhea Bose', '9876543223', 'rhea.bose@example.com', '54 Jayanagar 4th T Block'),
('Dev Patel', '9876543224', 'dev.patel@example.com', '12 JP Nagar 6th Phase'),
('Tara Alva', '9876543225', 'tara.alva@example.com', '31 Rajajinagar Entrance'),
('Varun Dhawan', '9876543226', 'varun.d@example.com', '6 Vijayanagar Pipeline'),
('Bhavna Pillai', '9876543227', 'bhavna.p@example.com', '76 Shivaji Nagar Bazaar'),
('Nikhil Kamath', '9876543228', 'nikhil.k@example.com', '8 Residency Rd, MG Road'),
('Shalini Ghosh', '9876543229', 'shalini.g@example.com', '24 Gandhi Bazaar Link'),
('Mohan Lal', '9876543230', 'mohan.lal@example.com', '13 Ring Road, Jayanagar'),
('Geeta Raman', '9876543231', 'geeta.r@example.com', '40 8th Main, Malleshwaram');

-- ------------------------------------------------------------------------------
-- 5. SLA Rules (Resolution hours mapped by category & dept)
-- ------------------------------------------------------------------------------
INSERT INTO SLA_Rule (category, dept_id, resolution_hours) VALUES
-- Roads & Infrastructure (dept 1)
('Pothole Repair', 1, 72),            -- 3 days
('Damaged Footpath', 1, 120),         -- 5 days
('Fallen Road Sign', 1, 48),          -- 2 days
-- Electricity & Lighting (dept 2)
('Broken Streetlight', 2, 48),        -- 2 days
('Exposed Electric Wire', 2, 24),     -- 1 day (urgent)
('Transformer Sparking', 2, 12),      -- 12 hours (critical)
-- Water Supply & Sewerage (dept 3)
('Water Pipeline Leak', 3, 48),       -- 2 days
('Sewage Overflow', 3, 24),           -- 1 day (hazardous)
('No Water Supply', 3, 36),           -- 36 hours
-- Solid Waste & Sanitation (dept 4)
('Garbage Dump Clearance', 4, 24),    -- 1 day
('Dead Animal Removal', 4, 12),       -- 12 hours (urgent)
('Public Toilet Cleaning', 4, 48),    -- 2 days
-- Public Health (dept 5)
('Mosquito Fogging Request', 5, 72),  -- 3 days
('Stray Dog Menace', 5, 96),          -- 4 days
('Food Safety Inspection', 5, 48);    -- 2 days

-- ------------------------------------------------------------------------------
-- 6. Complaints (52 complaints across dates and statuses)
-- Note: Trigger trg_set_deadline calculates deadline_at automatically!
-- ------------------------------------------------------------------------------
-- Group A: Resolved complaints (past dates)
INSERT INTO Complaint (citizen_id, category, priority, description, ward_id, location_details, dept_id, assigned_officer, status, filed_at, resolved_at) VALUES
(1, 'Pothole Repair', 'Medium', 'Large pothole near 8th cross junction', 2, 'Opposite Canara Bank', 1, 11, 'Resolved', NOW() - INTERVAL '15 days', NOW() - INTERVAL '13 days'),
(2, 'Broken Streetlight', 'Low', 'Flickering street light on pole #45', 3, 'Near BDA complex', 2, 12, 'Resolved', NOW() - INTERVAL '14 days', NOW() - INTERVAL '12 days'),
(3, 'Water Pipeline Leak', 'High', 'Fresh drinking water gushing onto road', 4, 'Near inner circle', 3, 13, 'Resolved', NOW() - INTERVAL '12 days', NOW() - INTERVAL '11 days'),
(4, 'Garbage Dump Clearance', 'Medium', 'Uncollected garbage accumulating for 3 days', 5, 'Near 4th Block market', 4, 14, 'Resolved', NOW() - INTERVAL '10 days', NOW() - INTERVAL '9 days'),
(5, 'Mosquito Fogging Request', 'Medium', 'Severe mosquito breeding near stagnant drain', 6, 'Phase 3 park', 5, 15, 'Resolved', NOW() - INTERVAL '10 days', NOW() - INTERVAL '8 days'),
(6, 'Damaged Footpath', 'Low', 'Broken paver blocks causing elderly to trip', 7, '1st Stage main road', 1, 11, 'Resolved', NOW() - INTERVAL '9 days', NOW() - INTERVAL '5 days'),
(7, 'Sewage Overflow', 'Critical', 'Drainage backflow into residential storm drain', 8, 'Pipeline road', 3, 13, 'Resolved', NOW() - INTERVAL '8 days', NOW() - INTERVAL '7 days 18 hours'),
(8, 'Exposed Electric Wire', 'Critical', 'Low hanging live wire touching tree branch', 9, 'Commercial st corner', 2, 12, 'Resolved', NOW() - INTERVAL '7 days', NOW() - INTERVAL '6 days 20 hours'),
(9, 'Dead Animal Removal', 'High', 'Dead canine carcass near school gate', 10, 'Brigade road lane', 4, 14, 'Resolved', NOW() - INTERVAL '6 days', NOW() - INTERVAL '5 days 22 hours'),
(10, 'No Water Supply', 'High', 'No supply for 48 hours in sector 4', 1, 'Gandhi Nagar 2nd main', 3, 13, 'Resolved', NOW() - INTERVAL '5 days', NOW() - INTERVAL '4 days');

-- Group B: InProgress complaints (currently within deadline)
INSERT INTO Complaint (citizen_id, category, priority, description, ward_id, location_details, dept_id, assigned_officer, status, filed_at) VALUES
(11, 'Pothole Repair', 'Medium', 'Pothole formed after heavy rainfall', 2, 'Near post office', 1, 11, 'InProgress', NOW() - INTERVAL '10 hours'),
(12, 'Broken Streetlight', 'Medium', 'Dark stretch of road unsafe at night', 3, '12th main road', 2, 12, 'InProgress', NOW() - INTERVAL '8 hours'),
(13, 'Public Toilet Cleaning', 'Low', 'Toilet facility requires cleaning & water supply', 4, 'Near bus terminus', 4, 14, 'InProgress', NOW() - INTERVAL '12 hours'),
(14, 'Stray Dog Menace', 'Medium', 'Pack of aggressive dogs near residential apartments', 5, 'Near Rose Garden', 5, 15, 'InProgress', NOW() - INTERVAL '6 hours'),
(15, 'Water Pipeline Leak', 'Medium', 'Minor leak in secondary pipeline valve', 6, '15th cross road', 3, 13, 'InProgress', NOW() - INTERVAL '4 hours');

-- Group C: Open complaints (freshly filed, well within deadline)
INSERT INTO Complaint (citizen_id, category, priority, description, ward_id, location_details, dept_id, assigned_officer, status, filed_at) VALUES
(16, 'Damaged Footpath', 'Low', 'Missing manhole slab on pedestrian walk', 7, 'Near Metro station', 1, 11, 'Open', NOW() - INTERVAL '2 hours'),
(17, 'Exposed Electric Wire', 'Critical', 'Snagged cable hanging over footpath', 8, 'Vijayanagar club road', 2, 12, 'Open', NOW() - INTERVAL '1 hour'),
(18, 'Garbage Dump Clearance', 'Medium', 'Construction debris dumped on public road', 9, 'Shivaji Nagar main road', 4, 14, 'Open', NOW() - INTERVAL '30 minutes'),
(19, 'Mosquito Fogging Request', 'Low', 'Requesting community fogging before monsoon', 10, 'Residency road cross', 5, 15, 'Open', NOW() - INTERVAL '45 minutes'),
(20, 'Fallen Road Sign', 'Low', 'Direction signboard bent by wind', 1, 'Gandhi Nagar junction', 1, 11, 'Open', NOW() - INTERVAL '15 minutes');

-- Group D: Overdue complaints (filed several days ago, NOT resolved, breached deadline)
-- These will be picked up by escalate_overdue_complaints()!
INSERT INTO Complaint (citizen_id, category, priority, description, ward_id, location_details, dept_id, assigned_officer, status, filed_at) VALUES
(1, 'Pothole Repair', 'Critical', 'Deep crater in middle of intersection, multiple skids', 2, 'Circle junction', 1, 11, 'Open', NOW() - INTERVAL '5 days'),
(2, 'Broken Streetlight', 'High', 'Entire 100ft road streetlights not functioning', 3, 'Indiranagar 100ft road', 2, 12, 'Open', NOW() - INTERVAL '4 days'),
(3, 'Water Pipeline Leak', 'High', 'Main line crack leaking 5000L daily', 4, 'Whitefield road bridge', 3, 13, 'InProgress', NOW() - INTERVAL '4 days'),
(4, 'Garbage Dump Clearance', 'High', 'Overflowing community bin attracting flies', 5, 'Jayanagar 9th block', 4, 14, 'InProgress', NOW() - INTERVAL '3 days'),
(5, 'Food Safety Inspection', 'High', 'Stale oil smell and unhygienic conditions at eatery', 6, 'JP Nagar food street', 5, 15, 'Open', NOW() - INTERVAL '5 days'),
(6, 'Transformer Sparking', 'Critical', 'Transformer sparking audibly near residential houses', 7, 'Rajajinagar 3rd block', 2, 12, 'Open', NOW() - INTERVAL '2 days'),
(7, 'Sewage Overflow', 'Critical', 'Blackwater gushing onto pedestrian street', 8, 'Vijayanagar bazaar', 3, 13, 'Open', NOW() - INTERVAL '2 days'),
(8, 'Dead Animal Removal', 'High', 'Dead animal in storm drain', 9, 'Shivaji Nagar drain', 4, 14, 'Open', NOW() - INTERVAL '2 days'),
(9, 'Pothole Repair', 'High', 'Series of deep potholes outside school gate', 10, 'MG road bylane', 1, 11, 'InProgress', NOW() - INTERVAL '6 days'),
(10, 'No Water Supply', 'Critical', 'No water for 5 days in low-income cluster', 1, 'Gandhi Nagar lane 4', 3, 13, 'Open', NOW() - INTERVAL '3 days');

-- Group E: Historical complaints already Escalated in the past
INSERT INTO Complaint (citizen_id, category, priority, description, ward_id, location_details, dept_id, assigned_officer, status, filed_at) VALUES
(11, 'Pothole Repair', 'High', 'Pothole damaged car suspension', 2, 'Malleshwaram 4th main', 1, 6, 'Escalated', NOW() - INTERVAL '8 days'),
(12, 'Broken Streetlight', 'Medium', 'Repeated failure of sodium lamp', 3, 'Indiranagar defence colony', 2, 7, 'Escalated', NOW() - INTERVAL '7 days'),
(13, 'Water Pipeline Leak', 'High', 'Joint leak in primary underground supply', 4, 'Whitefield junction', 3, 8, 'Escalated', NOW() - INTERVAL '6 days'),
(14, 'Garbage Dump Clearance', 'Critical', 'Commercial waste dumped opposite hospital', 5, 'Jayanagar hospital road', 4, 9, 'Escalated', NOW() - INTERVAL '5 days'),
(15, 'Stray Dog Menace', 'Critical', 'Dog bite incident reported', 6, 'JP Nagar 2nd phase', 5, 10, 'Escalated', NOW() - INTERVAL '9 days');

-- Historical Escalation logs for Group E complaints
INSERT INTO Escalation_Log (complaint_id, from_officer, to_officer, reason, escalated_at) VALUES
(31, 11, 6, 'SLA deadline breached', NOW() - INTERVAL '5 days'),
(32, 12, 7, 'SLA deadline breached', NOW() - INTERVAL '5 days'),
(33, 13, 8, 'SLA deadline breached', NOW() - INTERVAL '4 days'),
(34, 14, 9, 'SLA deadline breached', NOW() - INTERVAL '4 days'),
(35, 15, 10, 'SLA deadline breached', NOW() - INTERVAL '6 days');

-- Group F1: Additional resolved complaints for volume & analytical depth
INSERT INTO Complaint (citizen_id, category, priority, description, ward_id, location_details, dept_id, assigned_officer, status, filed_at, resolved_at) VALUES
(17, 'Pothole Repair', 'Low', 'Small gravel patch coming off', 7, 'Rajajinagar entrance', 1, 11, 'Resolved', NOW() - INTERVAL '20 days', NOW() - INTERVAL '18 days'),
(18, 'Broken Streetlight', 'Medium', 'Streetlight not turning on automatically', 8, 'Vijayanagar pipeline', 2, 12, 'Resolved', NOW() - INTERVAL '18 days', NOW() - INTERVAL '16 days'),
(19, 'Water Pipeline Leak', 'Medium', 'Leak near water meter', 9, 'Commercial street lane', 3, 13, 'Resolved', NOW() - INTERVAL '16 days', NOW() - INTERVAL '14 days'),
(20, 'Garbage Dump Clearance', 'Medium', 'Tree branches left on footpath after trimming', 10, 'Residency road', 4, 14, 'Resolved', NOW() - INTERVAL '15 days', NOW() - INTERVAL '14 days'),
(21, 'Mosquito Fogging Request', 'Medium', 'Fogging needed before school reopening', 1, 'Gandhi Nagar high school', 5, 15, 'Resolved', NOW() - INTERVAL '12 days', NOW() - INTERVAL '9 days'),
(22, 'Damaged Footpath', 'Medium', 'Loose tiles near bank ATM', 2, 'Malleshwaram circle', 1, 11, 'Resolved', NOW() - INTERVAL '11 days', NOW() - INTERVAL '8 days'),
(1, 'Broken Streetlight', 'Low', 'Lamp cover broken by flying stone', 3, 'Indiranagar club road', 2, 12, 'Resolved', NOW() - INTERVAL '9 days', NOW() - INTERVAL '7 days'),
(2, 'Sewage Overflow', 'High', 'Drain choked with plastic bottles', 4, 'Whitefield market', 3, 13, 'Resolved', NOW() - INTERVAL '7 days', NOW() - INTERVAL '6 days'),
(3, 'Dead Animal Removal', 'Medium', 'Cat carcass in vacant plot', 5, 'Jayanagar 7th block', 4, 14, 'Resolved', NOW() - INTERVAL '5 days', NOW() - INTERVAL '4 days 12 hours');

-- Group F2: Additional open/in-progress complaints
INSERT INTO Complaint (citizen_id, category, priority, description, ward_id, location_details, dept_id, assigned_officer, status, filed_at) VALUES
(4, 'Stray Dog Menace', 'Low', 'Stray dogs barking at night', 6, 'JP Nagar 1st phase', 5, 15, 'Open', NOW() - INTERVAL '1 day'),
(5, 'Food Safety Inspection', 'Medium', 'Street vendor using unpotable water', 7, 'Rajajinagar food cart', 5, 15, 'Open', NOW() - INTERVAL '18 hours'),
(6, 'Pothole Repair', 'High', 'Multiple potholes after water tanker traffic', 8, 'Vijayanagar ring road', 1, 11, 'Open', NOW() - INTERVAL '14 hours'),
(7, 'Broken Streetlight', 'Critical', 'Total blackout on narrow alleyway', 9, 'Shivaji Nagar alley', 2, 12, 'Open', NOW() - INTERVAL '8 hours'),
(8, 'Water Pipeline Leak', 'Low', 'Dripping public tap valve', 10, 'MG road fountain square', 3, 13, 'Open', NOW() - INTERVAL '4 hours'),
(9, 'Garbage Dump Clearance', 'Low', 'Fallen leaves pile accumulating', 1, 'Gandhi Nagar park', 4, 14, 'Open', NOW() - INTERVAL '2 hours'),
(10, 'Transformer Sparking', 'Critical', 'Sparks seen during heavy winds', 2, 'Malleshwaram 15th cross', 2, 12, 'Open', NOW() - INTERVAL '3 hours'),
(11, 'Fallen Road Sign', 'Low', 'No parking sign knocked down', 3, 'Indiranagar 80ft road', 1, 11, 'Open', NOW() - INTERVAL '5 hours');

-- ------------------------------------------------------------------------------
-- 7. Seed Feedback Ratings (for resolved complaints)
-- ------------------------------------------------------------------------------
INSERT INTO Feedback (complaint_id, rating, comments, submitted_at) VALUES
(1, 5, 'Quick response, pothole filled cleanly within 48 hours.', NOW() - INTERVAL '12 days'),
(2, 4, 'Streetlight was replaced properly.', NOW() - INTERVAL '11 days'),
(3, 5, 'Water leak was stopped urgently before major wastage occurred.', NOW() - INTERVAL '10 days'),
(4, 3, 'Garbage was removed but area was not disinfected.', NOW() - INTERVAL '8 days'),
(5, 4, 'Fogging done thoroughly in our lane.', NOW() - INTERVAL '7 days'),
(6, 2, 'Footpath repaired hastily, uneven slabs left.', NOW() - INTERVAL '4 days'),
(7, 5, 'Drainage team arrived on Sunday morning, very dedicated!', NOW() - INTERVAL '6 days'),
(8, 5, 'Critical wire issue solved immediately. Thank you.', NOW() - INTERVAL '5 days'),
(9, 4, 'Cleaned within the same day.', NOW() - INTERVAL '5 days'),
(10, 3, 'Water restored after prolonged follow-up.', NOW() - INTERVAL '3 days'),
(36, 4, 'Patchwork done decently.', NOW() - INTERVAL '17 days'),
(37, 5, 'Streetlight works fine now.', NOW() - INTERVAL '15 days'),
(38, 4, 'Leak fixed without issues.', NOW() - INTERVAL '13 days'),
(39, 4, 'Branches cleared.', NOW() - INTERVAL '13 days'),
(40, 5, 'Fogging carried out on schedule.', NOW() - INTERVAL '8 days'),
(41, 3, 'Fair job, took 3 days.', NOW() - INTERVAL '7 days'),
(42, 4, 'Good work.', NOW() - INTERVAL '6 days'),
(43, 5, 'Prompt sewer cleaning.', NOW() - INTERVAL '5 days');

-- ------------------------------------------------------------------------------
-- 8. Seed Initial Notifications
-- ------------------------------------------------------------------------------
INSERT INTO Notification (citizen_id, complaint_id, message, sent_at, is_read) VALUES
(1, 1, 'Your complaint #1 (Pothole Repair) has been resolved. Please provide feedback.', NOW() - INTERVAL '13 days', TRUE),
(2, 2, 'Your complaint #2 (Broken Streetlight) has been resolved. Please provide feedback.', NOW() - INTERVAL '12 days', TRUE),
(3, 3, 'Your complaint #3 (Water Pipeline Leak) has been resolved. Please provide feedback.', NOW() - INTERVAL '11 days', TRUE),
(11, 31, 'Your complaint #31 (Pothole Repair) has breached its SLA resolution deadline and has been escalated to higher authority.', NOW() - INTERVAL '5 days', FALSE),
(12, 32, 'Your complaint #32 (Broken Streetlight) has breached its SLA resolution deadline and has been escalated to higher authority.', NOW() - INTERVAL '5 days', FALSE),
(13, 33, 'Your complaint #33 (Water Pipeline Leak) has breached its SLA resolution deadline and has been escalated to higher authority.', NOW() - INTERVAL '4 days', FALSE);
