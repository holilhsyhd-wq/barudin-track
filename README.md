# barudin-track# Website Tracking dengan Supabase

## 🚀 Setup Supabase (Gratis):

### Step 1: Buat Akun Supabase
1. Buka [supabase.com](https://supabase.com)
2. Sign up gratis dengan GitHub/Google
3. Buat new project

### Step 2: Setup Database Tables
Jalankan SQL ini di SQL Editor:

```sql
-- Table untuk tracking links
CREATE TABLE tracking_links (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    destination TEXT NOT NULL,
    description TEXT,
    tracking_url TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Table untuk tracking results  
CREATE TABLE tracking_results (
    id BIGSERIAL PRIMARY KEY,
    track_id TEXT REFERENCES tracking_links(id),
    link_name TEXT,
    timestamp TIMESTAMP WITH TIME ZONE,
    location JSONB,
    photo TEXT,
    ip TEXT,
    device TEXT,
    browser TEXT,
    user_agent TEXT,
    screen TEXT,
    language TEXT,
    timezone TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Enable Row Level Security
ALTER TABLE tracking_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE tracking_results ENABLE ROW LEVEL SECURITY;

-- Create policies untuk allow semua operasi
CREATE POLICY "Allow all operations on tracking_links" ON tracking_links
FOR ALL USING (true);

CREATE POLICY "Allow all operations on tracking_results" ON tracking_results
FOR ALL USING (true);
