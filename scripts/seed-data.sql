-- Seed data for Sahyadri Guardian

-- Insert sample trails
INSERT INTO trails (name, description, distance_km, elevation_m, difficulty, coordinates) VALUES
('Sinhagad Fort Trek', 'Historic fort trek with moderate difficulty and scenic views', 3.2, 1312, 'Moderate', 
 '[{"lat": 18.3664, "lng": 73.7556}, {"lat": 18.3680, "lng": 73.7580}, {"lat": 18.3700, "lng": 73.7600}, {"lat": 18.3720, "lng": 73.7620}]'),

('Rajgad Fort Trek', 'Challenging trek to the capital of Maratha Empire', 5.8, 1376, 'Hard',
 '[{"lat": 18.2456, "lng": 73.6789}, {"lat": 18.2480, "lng": 73.6820}, {"lat": 18.2500, "lng": 73.6850}, {"lat": 18.2520, "lng": 73.6880}]'),

('Torna Fort Trek', 'First fort captured by Shivaji Maharaj, moderate difficulty', 4.1, 1403, 'Moderate',
 '[{"lat": 18.2123, "lng": 73.6234}, {"lat": 18.2140, "lng": 73.6250}, {"lat": 18.2160, "lng": 73.6270}, {"lat": 18.2180, "lng": 73.6290}]'),

('Lohagad Fort Trek', 'Easy trek suitable for beginners with beautiful monsoon views', 2.5, 1033, 'Easy',
 '[{"lat": 18.7089, "lng": 73.4856}, {"lat": 18.7100, "lng": 73.4870}, {"lat": 18.7120, "lng": 73.4890}, {"lat": 18.7140, "lng": 73.4910}]'),

('Visapur Fort Trek', 'Twin fort of Lohagad with rocky terrain', 3.0, 1084, 'Moderate',
 '[{"lat": 18.7234, "lng": 73.4567}, {"lat": 18.7250, "lng": 73.4580}, {"lat": 18.7270, "lng": 73.4600}, {"lat": 18.7290, "lng": 73.4620}]');

-- Insert sample users
INSERT INTO users (email, display_name, photo_url) VALUES
('john.trekker@example.com', 'John Trekker', '/placeholder.svg?height=32&width=32'),
('jane.explorer@example.com', 'Jane Explorer', '/placeholder.svg?height=32&width=32'),
('mike.hiker@example.com', 'Mike Hiker', '/placeholder.svg?height=32&width=32'),
('admin@sahyadriguardian.com', 'Admin User', '/placeholder.svg?height=32&width=32');

-- Insert sample hazard reports
INSERT INTO hazard_reports (user_id, trail_id, latitude, longitude, hazard_type, severity, description, status) VALUES
(1, 1, 18.3690, 73.7590, 'landslide', 'high', 'Large landslide blocking main trail path after heavy rainfall', 'verified'),
(2, 2, 18.2470, 73.6800, 'fallen_tree', 'moderate', 'Large tree fallen across trail after storm', 'verified'),
(3, 3, 18.2150, 73.6260, 'slippery_rock', 'low', 'Wet rocks near waterfall area, exercise caution', 'resolved'),
(1, 1, 18.3710, 73.7610, 'trail_damage', 'moderate', 'Erosion has damaged trail steps', 'pending'),
(2, 4, 18.7110, 73.4880, 'flash_flood', 'high', 'Stream crossing flooded due to heavy rains', 'verified');

-- Insert sample weather data
INSERT INTO weather_data (latitude, longitude, temperature, humidity, rainfall, wind_speed, visibility, pressure) VALUES
(18.3690, 73.7590, 24.5, 78, 2.5, 12.3, 8.2, 1012.5),
(18.2470, 73.6800, 23.8, 82, 4.1, 15.2, 6.8, 1010.2),
(18.2150, 73.6260, 25.2, 75, 1.8, 10.5, 9.1, 1013.8),
(18.7110, 73.4880, 22.9, 85, 6.2, 18.7, 5.5, 1008.9);

-- Insert sample risk assessments
INSERT INTO risk_assessments (trail_id, overall_risk_score, landslide_risk, flash_flood_risk, weather_risk, ai_recommendations) VALUES
(1, 6.2, 'moderate', 'high', 'moderate', '["Check weather conditions before starting", "Carry emergency supplies", "Inform someone about your trek plan"]'),
(2, 8.1, 'high', 'high', 'high', '["Avoid trekking during monsoon", "Use proper trekking gear", "Trek in groups", "Carry first aid kit"]'),
(3, 3.4, 'low', 'moderate', 'low', '["Good conditions for trekking", "Carry sufficient water", "Start early to avoid afternoon heat"]'),
(4, 4.8, 'moderate', 'high', 'moderate', '["Monitor stream water levels", "Avoid during heavy rainfall", "Carry rain gear"]'),
(5, 5.5, 'moderate', 'moderate', 'moderate', '["Rocky terrain requires good footwear", "Check weather forecast", "Carry headlamp for early starts"]);

-- Insert sample emergency contacts
INSERT INTO emergency_contacts (user_id, contact_name, phone_number, relationship, is_primary) VALUES
(1, 'Sarah Trekker', '+91-9876543210', 'Spouse', true),
(1, 'Emergency Services', '108', 'Emergency', false),
(2, 'David Explorer', '+91-9876543211', 'Brother', true),
(3, 'Lisa Hiker', '+91-9876543212', 'Friend', true);
