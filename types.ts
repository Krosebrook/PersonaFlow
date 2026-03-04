export interface Organization {
  id: string;
  name: string;
  domain: string;
  industry: string;
  size_range: string;
  regions: string[];
  brand: {
    colors: { primary: string; secondary: string; accent: string };
    font_vibe: string;
    logo_url?: string;
  };
  voice_profile: {
    tone: 'Professional' | 'Friendly' | 'Technical' | 'Urgent';
    reading_level: 'Grade 8' | 'High School' | 'PhD';
    banned_phrases: string[];
  };
  services: ServiceItem[];
  team: TeamMember[];
  compliance: ComplianceItem[];
  proof: ProofItem[];
  created_at: string;
}

export interface OrganizationVersion {
  id: string;
  organization_id: string;
  version_number: number;
  data: Partial<Organization>;
  created_by: string;
  created_at: string;
  change_summary: string;
}

export interface Collaborator {
  id: string;
  name: string;
  avatar_url?: string;
  color: string;
  status: 'active' | 'idle';
  current_path: string;
}

export interface ServiceItem {
  id: string;
  name: string;
  description: string;
  outcomes: string[];
}

export interface TeamMember {
  id: string;
  role: string;
  count: number;
  description: string;
}

export interface ComplianceItem {
  id: string;
  framework: string;
  status: 'Certified' | 'Compliant' | 'In Progress';
  details: string;
}

export interface ProofItem {
  id: string;
  metric: string;
  value: string;
  context: string;
  verified: boolean;
}

export interface Persona {
  id: string;
  organization_id: string;
  name: string;
  platform: 'Claude' | 'Google' | 'Microsoft' | 'Custom';
  type: 'Internal' | 'External';
  role_archetype: 'Sales' | 'Support' | 'IT' | 'Security' | 'HR' | 'Ops' | 'Finance' | 'Engineering';
  mode: 'Front-of-House' | 'Back-of-House';
  constraints: string[];
  capabilities: string[];
  examples: { input: string; output: string; type: 'Standard' | 'Edge Case' }[];
  updated_at: string;
}

export interface ExportResult {
  format: string;
  content: string;
}

export type WizardStep = 'identity' | 'brand' | 'services' | 'team' | 'compliance' | 'voice' | 'review';
