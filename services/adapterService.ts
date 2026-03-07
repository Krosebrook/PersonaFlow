import { Organization, Persona } from '../types';

export const generatePersonaExport = (org: Organization, persona: Persona): string => {
  if (persona.platform === 'Claude') return generateClaudePrompt(org, persona);
  if (persona.platform === 'Google') return generateGooglePrompt(org, persona);
  if (persona.platform === 'Microsoft') return generateMicrosoftPrompt(org, persona);
  return generateGenericPrompt(org, persona);
};

const formatList = (items: string[]) => items.map(i => `- ${i}`).join('\n');

const generateClaudePrompt = (org: Organization, persona: Persona) => {
  return `
<system_prompt>
<role_and_persona>
You are an AI agent acting as ${persona.name} for ${org.name}.
Your archetypal role is: ${persona.role_archetype}.
You are operating in a ${persona.type}-facing capacity, in a ${persona.mode} mode.
</role_and_persona>

<organization_context>
Company Name: ${org.name}
Industry: ${org.industry}
Core Services: ${org.services.map(s => s.name).join(', ')}
</organization_context>

<tone_and_style>
Tone: ${org.voice_profile.tone}
Reading Level: ${org.voice_profile.reading_level}
Banned Phrases (NEVER USE): ${org.voice_profile.banned_phrases.join(', ')}
</tone_and_style>

<rules_and_constraints>
<capabilities>
You are authorized to perform the following actions:
${formatList(persona.capabilities)}
</capabilities>

<constraints>
You must strictly adhere to the following constraints:
${formatList(persona.constraints)}
</constraints>

<compliance_frameworks>
You must operate within the bounds of the following compliance standards:
${org.compliance.map(c => c.framework).join(', ')}
</compliance_frameworks>
</rules_and_constraints>

<examples>
${persona.examples.map(ex => `
<example type="${ex.type}">
<user_input>${ex.input}</user_input>
<agent_response>${ex.output}</agent_response>
</example>`).join('\n')}
</examples>

<instructions>
Adopt the persona completely. Do not break character. Follow all constraints and tone guidelines strictly. Prioritize compliance above all else.
</instructions>
</system_prompt>
`.trim();
};

const generateGooglePrompt = (org: Organization, persona: Persona) => {
  return `
# System Instructions

## Role and Persona
You are acting as ${persona.name}, a ${persona.role_archetype} for ${org.name} (a ${org.industry} company).
You interact with ${persona.type === 'Internal' ? 'internal employees' : 'external customers'} in a ${persona.mode} capacity.

## Organization Context
- **Company:** ${org.name}
- **Core Services:** ${org.services.map(s => s.name).join(', ')}

## Tone and Voice
- **Tone:** ${org.voice_profile.tone}
- **Reading Level:** ${org.voice_profile.reading_level}
- **Prohibited Phrases (DO NOT USE):** ${org.voice_profile.banned_phrases.join(', ')}

## Capabilities and Constraints
**You are authorized to:**
${formatList(persona.capabilities)}

**Strict Constraints:**
${formatList(persona.constraints)}

**Compliance Requirements:**
You must operate within the bounds of: ${org.compliance.map(c => c.framework).join(', ')}.

## Few-Shot Examples
${persona.examples.map(ex => `
**User:** ${ex.input}
**Agent:** ${ex.output}
`).join('\n')}

## Final Directive
Maintain this persona consistently. Prioritize constraints and compliance above all else.
`.trim();
};

const generateMicrosoftPrompt = (org: Organization, persona: Persona) => {
  return `
# System Message

You are ${persona.name}, an AI assistant for ${org.name}.

## 1. Persona Definition
- **Role:** ${persona.role_archetype}
- **Audience:** ${persona.type === 'Internal' ? 'Internal team members' : 'External customers'}
- **Mode:** ${persona.mode}
- **Industry:** ${org.industry}

## 2. Voice & Tone Guidelines
- **Primary Tone:** ${org.voice_profile.tone}
- **Complexity:** ${org.voice_profile.reading_level}
- **Negative Constraints (Banned Phrases):** ${org.voice_profile.banned_phrases.join(', ')}

## 3. Operational Boundaries
### Allowed Capabilities
${formatList(persona.capabilities)}

### Strict Constraints
${formatList(persona.constraints)}

### Compliance Standards
Must adhere to: ${org.compliance.map(c => c.framework).join(', ')}

## 4. Interaction Examples
${persona.examples.map((ex, i) => `
### Example ${i + 1} (${ex.type})
**User:** ${ex.input}
**Assistant:** ${ex.output}
`).join('\n')}
`.trim();
};

const generateGenericPrompt = (org: Organization, persona: Persona) => {
  return `
You are ${persona.name}, an AI assistant for ${org.name}.
Role: ${persona.role_archetype}

Capabilities:
${formatList(persona.capabilities)}

Constraints:
${formatList(persona.constraints)}
`.trim();
};
