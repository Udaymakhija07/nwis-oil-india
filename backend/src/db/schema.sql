-- NWIS Core Relational Schema
CREATE EXTENSION IF NOT EXISTS postgis;

CREATE TABLE IF NOT EXISTS wells (
    well_id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    field VARCHAR(100) NOT NULL,
    block VARCHAR(100) NOT NULL,
    status VARCHAR(50) DEFAULT 'COMPLETED',
    latitude NUMERIC(10, 6) NOT NULL,
    longitude NUMERIC(10, 6) NOT NULL,
    surface_geom GEOMETRY(Point, 4326),
    kb_elev NUMERIC(8, 2) DEFAULT 115.00,
    spud_date DATE,
    td_md NUMERIC(8, 2) NOT NULL,
    td_tvd NUMERIC(8, 2) NOT NULL,
    well_type VARCHAR(50) DEFAULT 'DIRECTIONAL',
    rig VARCHAR(100) DEFAULT 'OIL-RIG-08'
);

CREATE INDEX IF NOT EXISTS idx_wells_field ON wells(field);
CREATE INDEX IF NOT EXISTS idx_wells_geom ON wells USING GIST(surface_geom);

CREATE TABLE IF NOT EXISTS well_surveys (
    id SERIAL PRIMARY KEY,
    well_id VARCHAR(50) REFERENCES wells(well_id) ON DELETE CASCADE,
    md NUMERIC(8, 2) NOT NULL,
    inc NUMERIC(6, 2) NOT NULL,
    azi NUMERIC(6, 2) NOT NULL,
    tvd NUMERIC(8, 2) NOT NULL,
    north NUMERIC(10, 2) NOT NULL,
    east NUMERIC(10, 2) NOT NULL,
    dls NUMERIC(6, 2) DEFAULT 0.00
);

CREATE INDEX IF NOT EXISTS idx_surveys_well_md ON well_surveys(well_id, md);

CREATE TABLE IF NOT EXISTS formation_tops (
    id SERIAL PRIMARY KEY,
    well_id VARCHAR(50) REFERENCES wells(well_id) ON DELETE CASCADE,
    formation VARCHAR(100) NOT NULL,
    top_md NUMERIC(8, 2) NOT NULL,
    top_tvd NUMERIC(8, 2) NOT NULL,
    bottom_md NUMERIC(8, 2),
    bottom_tvd NUMERIC(8, 2),
    lithology VARCHAR(100),
    pressure_regime VARCHAR(100) DEFAULT 'NORMAL'
);

CREATE INDEX IF NOT EXISTS idx_formation_tops ON formation_tops(well_id, top_md);

CREATE TABLE IF NOT EXISTS events (
    event_id VARCHAR(50) PRIMARY KEY,
    well_id VARCHAR(50) REFERENCES wells(well_id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    md_from NUMERIC(8, 2) NOT NULL,
    md_to NUMERIC(8, 2) NOT NULL,
    tvd NUMERIC(8, 2),
    formation VARCHAR(100),
    start_ts TIMESTAMP,
    duration_h NUMERIC(6, 2),
    npt_h NUMERIC(6, 2) DEFAULT 0.0,
    severity VARCHAR(20) DEFAULT 'MEDIUM',
    volume_lost_m3 NUMERIC(8, 2) DEFAULT 0.0,
    mud_wt NUMERIC(5, 2),
    cause TEXT,
    mitigation TEXT,
    outcome TEXT,
    source_doc_id VARCHAR(100),
    page INT,
    evidence_quote TEXT,
    confidence NUMERIC(4, 2) DEFAULT 0.92,
    verified BOOLEAN DEFAULT true
);

CREATE INDEX IF NOT EXISTS idx_events_well_depth ON events(well_id, md_from, md_to);
CREATE INDEX IF NOT EXISTS idx_events_type ON events(type);
CREATE INDEX IF NOT EXISTS idx_events_formation ON events(formation);

CREATE TABLE IF NOT EXISTS casing_program (
    id SERIAL PRIMARY KEY,
    well_id VARCHAR(50) REFERENCES wells(well_id) ON DELETE CASCADE,
    string_type VARCHAR(50) NOT NULL,
    size_in NUMERIC(5, 2) NOT NULL,
    shoe_md NUMERIC(8, 2) NOT NULL,
    shoe_tvd NUMERIC(8, 2) NOT NULL,
    grade VARCHAR(50) DEFAULT 'L-80',
    weight_ppf NUMERIC(6, 2)
);

CREATE TABLE IF NOT EXISTS cement_jobs (
    id SERIAL PRIMARY KEY,
    well_id VARCHAR(50) REFERENCES wells(well_id) ON DELETE CASCADE,
    casing_string VARCHAR(50),
    slurry VARCHAR(100),
    density_sg NUMERIC(4, 2),
    volume_m3 NUMERIC(8, 2),
    toc_md NUMERIC(8, 2),
    quality VARCHAR(50) DEFAULT 'GOOD',
    issue_flag BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS mud_program (
    id SERIAL PRIMARY KEY,
    well_id VARCHAR(50) REFERENCES wells(well_id) ON DELETE CASCADE,
    md_from NUMERIC(8, 2) NOT NULL,
    md_to NUMERIC(8, 2) NOT NULL,
    mud_type VARCHAR(50) DEFAULT 'WBM',
    mw_min NUMERIC(4, 2) NOT NULL,
    mw_max NUMERIC(4, 2) NOT NULL,
    visc NUMERIC(6, 2),
    lcm_used VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS ddr_entries (
    id SERIAL PRIMARY KEY,
    well_id VARCHAR(50) REFERENCES wells(well_id) ON DELETE CASCADE,
    date DATE NOT NULL,
    md_start NUMERIC(8, 2),
    md_end NUMERIC(8, 2),
    activity_code VARCHAR(50),
    narrative TEXT,
    npt_flag BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS drilling_ts (
    id SERIAL PRIMARY KEY,
    well_id VARCHAR(50) REFERENCES wells(well_id) ON DELETE CASCADE,
    ts TIMESTAMP NOT NULL,
    md NUMERIC(8, 2) NOT NULL,
    rop NUMERIC(6, 2),
    wob NUMERIC(6, 2),
    rpm NUMERIC(6, 2),
    torque NUMERIC(8, 2),
    spp NUMERIC(8, 2),
    flow_in NUMERIC(8, 2),
    flow_out NUMERIC(8, 2),
    pit_vol NUMERIC(8, 2),
    hookload NUMERIC(8, 2),
    mw_in NUMERIC(4, 2),
    ecd NUMERIC(4, 2)
);

CREATE INDEX IF NOT EXISTS idx_drilling_ts_well_md ON drilling_ts(well_id, md);

CREATE TABLE IF NOT EXISTS documents (
    doc_id VARCHAR(100) PRIMARY KEY,
    well_id VARCHAR(50) REFERENCES wells(well_id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    file_uri VARCHAR(255) NOT NULL,
    pages INT DEFAULT 1,
    ocr_status VARCHAR(50) DEFAULT 'COMPLETED',
    quality_score NUMERIC(4, 2) DEFAULT 0.95
);

CREATE TABLE IF NOT EXISTS doc_chunks (
    chunk_id SERIAL PRIMARY KEY,
    doc_id VARCHAR(100) REFERENCES documents(doc_id) ON DELETE CASCADE,
    well_id VARCHAR(50),
    page INT,
    formation VARCHAR(100),
    md_range VARCHAR(50),
    text TEXT NOT NULL,
    metadata JSONB
);

CREATE TABLE IF NOT EXISTS lessons (
    lesson_id SERIAL PRIMARY KEY,
    event_id VARCHAR(50) REFERENCES events(event_id) ON DELETE CASCADE,
    well_id VARCHAR(50),
    formation VARCHAR(100),
    md_range VARCHAR(50),
    summary TEXT NOT NULL,
    recommendation TEXT NOT NULL,
    votes_up INT DEFAULT 5,
    votes_down INT DEFAULT 0,
    verified_by VARCHAR(100) DEFAULT 'Chief Drilling Engineer, OIL Duliajan'
);

CREATE TABLE IF NOT EXISTS alerts (
    alert_id SERIAL PRIMARY KEY,
    well_id VARCHAR(50) REFERENCES wells(well_id) ON DELETE CASCADE,
    md NUMERIC(8, 2) NOT NULL,
    risk_type VARCHAR(50) NOT NULL,
    prob NUMERIC(4, 2) NOT NULL,
    level VARCHAR(20) NOT NULL,
    evidence_json JSONB NOT NULL,
    ts TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    useful BOOLEAN,
    action_taken VARCHAR(100),
    comment TEXT
);

CREATE TABLE IF NOT EXISTS users (
    user_id SERIAL PRIMARY KEY,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'ENGINEER',
    name VARCHAR(100),
    assets JSONB
);
