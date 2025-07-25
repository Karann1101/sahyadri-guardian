-- Create database schema for Sahyadri Guardian

-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    display_name VARCHAR(255),
    photo_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Trails table
CREATE TABLE trails (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    distance_km DECIMAL(5,2),
    elevation_m INTEGER,
    difficulty VARCHAR(50),
    coordinates JSONB, -- Array of lat/lng points for polyline
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Hazard reports table
CREATE TABLE hazard_reports (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    trail_id INTEGER REFERENCES trails(id),
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    hazard_type VARCHAR(50) NOT NULL,
    severity VARCHAR(20) NOT NULL,
    description TEXT NOT NULL,
    photo_url TEXT,
    status VARCHAR(20) DEFAULT 'pending',
    verified_by INTEGER REFERENCES users(id),
    verified_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Weather data table
CREATE TABLE weather_data (
    id SERIAL PRIMARY KEY,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    temperature DECIMAL(4,1),
    humidity INTEGER,
    rainfall DECIMAL(5,2),
    wind_speed DECIMAL(4,1),
    visibility DECIMAL(4,1),
    pressure DECIMAL(6,2),
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Risk assessments table
CREATE TABLE risk_assessments (
    id SERIAL PRIMARY KEY,
    trail_id INTEGER REFERENCES trails(id),
    overall_risk_score DECIMAL(3,1),
    landslide_risk VARCHAR(20),
    flash_flood_risk VARCHAR(20),
    weather_risk VARCHAR(20),
    ai_recommendations JSONB,
    calculated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User locations table (for tracking and emergency)
CREATE TABLE user_locations (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    trail_id INTEGER REFERENCES trails(id),
    is_on_trail BOOLEAN DEFAULT true,
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Emergency contacts table
CREATE TABLE emergency_contacts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    contact_name VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    relationship VARCHAR(100),
    is_primary BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_hazard_reports_location ON hazard_reports(latitude, longitude);
CREATE INDEX idx_hazard_reports_trail ON hazard_reports(trail_id);
CREATE INDEX idx_hazard_reports_status ON hazard_reports(status);
CREATE INDEX idx_user_locations_user_trail ON user_locations(user_id, trail_id);
CREATE INDEX idx_weather_data_location ON weather_data(latitude, longitude);
CREATE INDEX idx_risk_assessments_trail ON risk_assessments(trail_id);
