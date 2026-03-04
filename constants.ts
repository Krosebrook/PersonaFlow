import { Organization, Persona } from './types';

export const MOCK_ORGS: Organization[] = [
  {
    id: 'org-1',
    name: 'INTinc',
    domain: 'intinc.ai',
    industry: 'Managed Services',
    size_range: '50-200',
    regions: ['North America', 'EU'],
    brand: {
      colors: { primary: '#1e293b', secondary: '#475569', accent: '#3b82f6' },
      font_vibe: 'Clean, Sans-Serif, Swiss',
    },
    voice_profile: {
      tone: 'Professional',
      reading_level: 'High School',
      banned_phrases: ['um', 'maybe', 'idk'],
    },
    services: [
      { id: 's1', name: 'AI Enablement', description: 'End-to-end AI adoption strategies.', outcomes: ['20% efficiency gain', 'Risk reduction'] },
      { id: 's2', name: 'Cloud Infrastructure', description: 'AWS/Azure management.', outcomes: ['99.99% Uptime'] }
    ],
    team: [
      { id: 't1', role: 'Solutions Architect', count: 5, description: 'Design implementation strategies.' }
    ],
    compliance: [
      { id: 'c1', framework: 'SOC2 Type II', status: 'Certified', details: 'Annual audits by Big 4 firm.' }
    ],
    proof: [
      { id: 'p1', metric: 'Client Retention', value: '98%', context: 'Year over year', verified: true }
    ],
    created_at: new Date().toISOString(),
  },
  {
    id: 'org-2',
    name: 'FlashFusion',
    domain: 'flashfusion.io',
    industry: 'E-commerce Tools',
    size_range: '10-50',
    regions: ['Global'],
    brand: {
      colors: { primary: '#db2777', secondary: '#f472b6', accent: '#fbcfe8' },
      font_vibe: 'Modern, Bold, Display',
    },
    voice_profile: {
      tone: 'Friendly',
      reading_level: 'Grade 8',
      banned_phrases: ['regards', 'sincerely', 'utilize'],
    },
    services: [
      { id: 's1', name: 'Dynamic Pricing', description: 'Real-time price adjustment engine.', outcomes: ['15% Margin increase'] }
    ],
    team: [
      { id: 't1', role: 'Growth Hacker', count: 3, description: 'Focus on viral loops.' }
    ],
    compliance: [
      { id: 'c1', framework: 'GDPR', status: 'Compliant', details: 'Full data residency controls.' }
    ],
    proof: [],
    created_at: new Date().toISOString(),
  },
  {
    id: 'org-3',
    name: 'InVelo',
    domain: 'invelo.tech',
    industry: 'Logistics Optimization',
    size_range: '200-500',
    regions: ['APAC', 'North America'],
    brand: {
      colors: { primary: '#15803d', secondary: '#166534', accent: '#86efac' },
      font_vibe: 'Monospace, Technical',
    },
    voice_profile: {
      tone: 'Technical',
      reading_level: 'PhD',
      banned_phrases: ['basically', 'simple', 'just']
    },
    services: [
      { id: 's1', name: 'Route Optimization', description: 'Graph-based routing algorithms.', outcomes: ['30% Fuel savings'] }
    ],
    team: [],
    compliance: [],
    proof: [],
    created_at: new Date().toISOString(),
  }
];

export const MOCK_PERSONAS: Persona[] = [
  {
    id: 'p-1',
    organization_id: 'org-1',
    name: 'L1 Support Agent',
    platform: 'Claude',
    type: 'External',
    mode: 'Front-of-House',
    role_archetype: 'Support',
    constraints: ['No access to PII', 'Escalate billing questions'],
    capabilities: ['Reset passwords', 'Explain product features', 'Check status'],
    examples: [
      { type: 'Standard', input: 'I cant login', output: 'I can help with that. Please verify your email address.' },
      { type: 'Edge Case', input: 'I want a refund immediately or I sue', output: 'I understand your frustration. I am escalating this to our billing specialist immediately.' }
    ],
    updated_at: new Date().toISOString(),
  },
  {
    id: 'p-2',
    organization_id: 'org-1',
    name: 'Security Analyst',
    platform: 'Microsoft',
    type: 'Internal',
    mode: 'Back-of-House',
    role_archetype: 'Security',
    constraints: ['Read-only logs', 'Requires approval for blocking IPs'],
    capabilities: ['Analyze traffic', 'Flag anomalies', 'Draft incident reports'],
    examples: [],
    updated_at: new Date().toISOString(),
  },
  {
    id: 'p-3',
    organization_id: 'org-2',
    name: 'Sales Concierge',
    platform: 'Google',
    type: 'External',
    mode: 'Front-of-House',
    role_archetype: 'Sales',
    constraints: ['Cannot offer discounts > 10%'],
    capabilities: ['Suggest products', 'Compare features', 'Book demos'],
    examples: [],
    updated_at: new Date().toISOString(),
  }
];
