CREATE DATABASE IF NOT EXISTS academic_carbon_tracker;
USE academic_carbon_tracker;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(120) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('student', 'faculty', 'admin') NOT NULL DEFAULT 'student',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS emission_factors (
  id INT AUTO_INCREMENT PRIMARY KEY,
  activity_type ENUM('transportation', 'electricity', 'paper', 'device') NOT NULL UNIQUE,
  factor DECIMAL(10,4) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS activities (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  type ENUM('transportation', 'electricity', 'paper', 'device') NOT NULL,
  value DECIMAL(10,3) NOT NULL,
  emission DECIMAL(12,4) NOT NULL,
  activity_date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_activity_user FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE
);

CREATE INDEX idx_activities_user_date ON activities(user_id, activity_date);

INSERT INTO emission_factors (activity_type, factor) VALUES
('transportation', 0.1200),
('electricity', 0.4750),
('paper', 0.0100),
('device', 0.0400)
ON DUPLICATE KEY UPDATE factor = VALUES(factor);

-- Sample users (footballer names) to quickly restore student/faculty data
-- Password for all seeded users: football123
INSERT INTO users (name, email, password, role) VALUES
('Lionel Messi', 'messi.student@example.com', '$2a$10$Fd38hoxoUjCa29GoCbwWS.a1pcPDl6NnAyi/KTF5AReGSC5yTiJAq', 'student'),
('Kylian Mbappe', 'mbappe.student@example.com', '$2a$10$Fd38hoxoUjCa29GoCbwWS.a1pcPDl6NnAyi/KTF5AReGSC5yTiJAq', 'student'),
('Erling Haaland', 'haaland.student@example.com', '$2a$10$Fd38hoxoUjCa29GoCbwWS.a1pcPDl6NnAyi/KTF5AReGSC5yTiJAq', 'student'),
('Cristiano Ronaldo', 'ronaldo.faculty@example.com', '$2a$10$Fd38hoxoUjCa29GoCbwWS.a1pcPDl6NnAyi/KTF5AReGSC5yTiJAq', 'faculty'),
('Kevin De Bruyne', 'debruyne.faculty@example.com', '$2a$10$Fd38hoxoUjCa29GoCbwWS.a1pcPDl6NnAyi/KTF5AReGSC5yTiJAq', 'faculty'),
('Luka Modric', 'modric.faculty@example.com', '$2a$10$Fd38hoxoUjCa29GoCbwWS.a1pcPDl6NnAyi/KTF5AReGSC5yTiJAq', 'faculty')
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  password = VALUES(password),
  role = VALUES(role);
