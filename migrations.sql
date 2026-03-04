-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Organizations Table
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_user_id UUID NOT NULL,
    name TEXT NOT NULL,
    domain TEXT,
    industry TEXT,
    size_range TEXT,
    regions TEXT[],
    brand_colors JSONB DEFAULT '{}'::jsonb,
    brand_fonts JSONB DEFAULT '{}'::jsonb,
    logo_url TEXT,
    voice_profile JSONB DEFAULT '{}'::jsonb,
    services JSONB DEFAULT '[]'::jsonb,
    team JSONB DEFAULT '[]'::jsonb,
    compliance JSONB DEFAULT '[]'::jsonb,
    proof JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Persona Sets Table
CREATE TABLE persona_sets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Personas Table
CREATE TABLE personas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    persona_set_id UUID REFERENCES persona_sets(id) ON DELETE CASCADE,
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE, -- Denormalized for easier query/RLS
    platform TEXT NOT NULL, -- 'claude', 'google', 'microsoft', 'custom'
    facing TEXT CHECK (facing IN ('internal', 'external')),
    operating_mode TEXT CHECK (operating_mode IN ('front_of_house', 'back_of_house')),
    archetype TEXT,
    constraints JSONB DEFAULT '[]'::jsonb,
    canonical_profile JSONB DEFAULT '{}'::jsonb,
    exports JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Exports Table
CREATE TABLE exports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    persona_id UUID REFERENCES personas(id) ON DELETE CASCADE,
    platform TEXT NOT NULL,
    format TEXT NOT NULL, -- 'markdown', 'json', 'txt'
    content TEXT NOT NULL,
    checksum TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Audit Events Table
CREATE TABLE audit_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id UUID NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Organization Versions Table
CREATE TABLE organization_versions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    version_number INTEGER NOT NULL,
    data JSONB NOT NULL,
    change_summary TEXT,
    created_by UUID NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS POLICIES --

ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE persona_sets ENABLE ROW LEVEL SECURITY;
ALTER TABLE personas ENABLE ROW LEVEL SECURITY;
ALTER TABLE exports ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_versions ENABLE ROW LEVEL SECURITY;

-- Organizations: Users can only see/edit their own
CREATE POLICY "Users can view own organizations" 
ON organizations FOR SELECT 
USING (auth.uid() = owner_user_id);

CREATE POLICY "Users can update own organizations" 
ON organizations FOR UPDATE 
USING (auth.uid() = owner_user_id);

CREATE POLICY "Users can insert own organizations" 
ON organizations FOR INSERT 
WITH CHECK (auth.uid() = owner_user_id);

CREATE POLICY "Users can delete own organizations" 
ON organizations FOR DELETE 
USING (auth.uid() = owner_user_id);

-- Personas: Accessible if user owns the organization
CREATE POLICY "Users can view personas of own org" 
ON personas FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM organizations 
        WHERE organizations.id = personas.organization_id 
        AND organizations.owner_user_id = auth.uid()
    )
);

CREATE POLICY "Users can insert personas to own org" 
ON personas FOR INSERT 
WITH CHECK (
    EXISTS (
        SELECT 1 FROM organizations 
        WHERE organizations.id = organization_id 
        AND organizations.owner_user_id = auth.uid()
    )
);

-- Exports: Accessible if user owns the organization
CREATE POLICY "Users can view exports of own org" 
ON exports FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM organizations 
        WHERE organizations.id = exports.organization_id 
        AND organizations.owner_user_id = auth.uid()
    )
);

-- Organization Versions: Accessible if user owns the organization
CREATE POLICY "Users can view versions of own org" 
ON organization_versions FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM organizations 
        WHERE organizations.id = organization_versions.organization_id 
        AND organizations.owner_user_id = auth.uid()
    )
);

-- Functions
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_organizations_updated_at BEFORE UPDATE ON organizations FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_personas_updated_at BEFORE UPDATE ON personas FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
