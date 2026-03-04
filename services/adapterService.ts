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
<system_role>
You are an AI agent acting as ${persona.name} for ${org.name}.
Your archetypal role is: ${persona.role_archetype}.
Your context: ${persona.type} facing, ${persona.mode}.
</system_role>

<organization_context>
Name: ${org.name}
Industry: ${org.industry}
Mission: We deliver ${org.services.map(s => s.name).join(', ')}.
Tone: ${org.voice_profile.tone} (Reading Level: ${org.voice_profile.reading_level})
Compliance: ${org.compliance.map(c => c.framework).join(', ')} - maintain strict adherence.
</organization_context>

<constraints>
${formatList(persona.constraints)}
NEVER use these phrases: ${org.voice_profile.banned_phrases.join(', ')}
</constraints>

<capabilities>
${formatList(persona.capabilities)}
</capabilities>

<examples>
${persona.examples.map(ex => `
<example type="${ex.type}">
User: ${ex.input}
Agent: ${ex.output}
</example>`).join('\n')}
</examples>

<instruction>
Adopt the persona completely. Do not break character.
</instruction>
`.trim();
};

const generateGooglePrompt = (org: Organization, persona: Persona) => {
  return `
**OBJECTIVE**
Act as ${persona.name} for ${org.name}, a ${org.industry} company.
Role: ${persona.role_archetype} (${persona.type} / ${persona.mode})

**CONTEXT**
- Company: ${org.name}
- Key Services: ${org.services.map(s => s.name).join(', ')}
- Voice: ${org.voice_profile.tone}
- Compliance Standards: ${org.compliance.map(c => c.framework).join(', ')}

**DIRECTIVES**
1. Adhere to the following constraints strictly:
${formatList(persona.constraints)}
2. You are authorized to:
${formatList(persona.capabilities)}
3. Avoid prohibited vocabulary: ${org.voice_profile.banned_phrases.join(', ')}

**FEW-SHOT EXAMPLES**
${persona.examples.map(ex => `
Input: "${ex.input}"
Output: "${ex.output}"
`).join('\n')}
`.trim();
};

const generateMicrosoftPrompt = (org: Organization, persona: Persona) => {
  return `
# System Prompt: ${persona.name} for ${org.name}

## Profile
You are a helpful, intelligent assistant working for ${org.name}.
Your role is **${persona.role_archetype}**.
You are interacting with **${persona.type === 'Internal' ? 'internal employees' : 'external customers'}**.

## Tone & Style
- Tone: ${org.voice_profile.tone}
- Complexity: ${org.voice_profile.reading_level}
- Do NOT use: ${org.voice_profile.banned_phrases.join(', ')}

## Rules of Engagement
### Allowed Actions
${formatList(persona.capabilities)}

### Strict Boundaries & Compliance
- You must comply with: ${org.compliance.map(c => c.framework).join(', ')}.
- Constraints:
${formatList(persona.constraints)}

## Interaction Examples
${persona.examples.map((ex, i) => `### Scenario ${i + 1} (${ex.type})\n**User:** ${ex.input}\n**Response:** ${ex.output}`).join('\n\n')}
`.trim();
};

const generateGenericPrompt = (org: Organization, persona: Persona) => {
  return `Role: ${persona.name} at ${org.name}\nArchetype: ${persona.role_archetype}\n\n${formatList(persona.capabilities)}`;
};
