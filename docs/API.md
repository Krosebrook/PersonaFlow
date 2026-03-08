# API Reference

This document covers the two service modules that provide external-facing functionality:

- **`services/aiService.ts`** — Google Gemini AI content generation
- **`services/adapterService.ts`** — Platform-specific prompt export

## Table of Contents

- [AI Service](#ai-service)
  - [generateServices](#generateservices)
  - [generateCompliance](#generatecompliance)
  - [generateTeamStructure](#generateteamstructure)
- [Adapter Service](#adapter-service)
  - [generatePersonaExport](#generatepersonaexport)
- [Error Handling](#error-handling)

---

## AI Service

**File:** `services/aiService.ts`

Uses the Google Gemini API (`gemini-3-flash-preview` model) to auto-generate structured content during the organization wizard flow. All functions return typed arrays validated against a strict JSON schema.

### API Key Resolution

The service looks for an API key in the following order:

1. `process.env.API_KEY` (injected by Vite from `GEMINI_API_KEY` in `.env.local`)
2. `localStorage.getItem('GEMINI_API_KEY')` (allows runtime key entry without a rebuild)
3. Falls back to the string `'missing-key'` — requests will fail gracefully and return fallback data

---

### `generateServices`

Generates a list of service offerings for a given industry and company name.

```ts
generateServices(industry: string, companyName: string): Promise<ServiceItem[]>
```

**Parameters**

| Name | Type | Description |
|---|---|---|
| `industry` | `string` | Industry label, e.g. `"Managed Services"` or `"Healthcare"` |
| `companyName` | `string` | Company display name used to personalise the prompt |

**Returns**

`Promise<ServiceItem[]>` — an array of three service objects.

```ts
// Example return value
[
  {
    id: "gen-svc-1712345678-0",
    name: "Cloud Infrastructure Management",
    description: "End-to-end management of public and hybrid cloud environments.",
    outcomes: ["99.9% uptime SLA", "30% average cost reduction"]
  },
  // …
]
```

**Fallback (on error)**

```ts
[
  { id: 'err-1', name: 'Strategic Planning', description: '…', outcomes: ['…'] },
  { id: 'err-2', name: 'Operational Excellence', description: '…', outcomes: ['…'] }
]
```

**Usage**

```ts
import { generateServices } from '../services/aiService';

const services = await generateServices('Healthcare', 'MediCorp');
```

---

### `generateCompliance`

Generates a list of compliance frameworks relevant to a given industry.

```ts
generateCompliance(industry: string): Promise<ComplianceItem[]>
```

**Parameters**

| Name | Type | Description |
|---|---|---|
| `industry` | `string` | Industry label, e.g. `"Finance"` or `"Healthcare"` |

**Returns**

`Promise<ComplianceItem[]>` — an array of three compliance items.

```ts
// Example return value
[
  {
    id: "gen-comp-1712345678-0",
    framework: "HIPAA",
    status: "Compliant",
    details: "Patient data handling and privacy controls."
  },
  // …
]
```

**Fallback (on error)**

```ts
[
  { id: 'err-c1', framework: 'General Data Protection', status: 'Compliant', details: '…' }
]
```

**Usage**

```ts
import { generateCompliance } from '../services/aiService';

const frameworks = await generateCompliance('Healthcare');
```

---

### `generateTeamStructure`

Generates a suggested team structure for a given industry.

```ts
generateTeamStructure(industry: string): Promise<TeamMember[]>
```

**Parameters**

| Name | Type | Description |
|---|---|---|
| `industry` | `string` | Industry label, e.g. `"Logistics"` |

**Returns**

`Promise<TeamMember[]>` — an array of team role objects.

```ts
// Example return value
[
  {
    id: "gen-team-1712345678-0",
    role: "Solutions Architect",
    description: "Designs scalable infrastructure solutions.",
    count: 3
  },
  // …
]
```

**Fallback (on error)**

```ts
[
  { id: 'err-t1', role: 'Team Lead', description: '…', count: 1 }
]
```

**Usage**

```ts
import { generateTeamStructure } from '../services/aiService';

const team = await generateTeamStructure('Logistics');
```

---

## Adapter Service

**File:** `services/adapterService.ts`

Converts an `Organization` and `Persona` pair into a fully-formatted system prompt string for a specific AI platform. All functions are synchronous pure functions.

---

### `generatePersonaExport`

The main entry point. Delegates to the appropriate platform-specific generator based on `persona.platform`.

```ts
generatePersonaExport(org: Organization, persona: Persona): string
```

**Parameters**

| Name | Type | Description |
|---|---|---|
| `org` | `Organization` | The organization the persona belongs to |
| `persona` | `Persona` | The persona to export |

**Returns**

`string` — a formatted prompt ready to paste into an AI system configuration.

**Platform Routing**

| `persona.platform` | Generator | Output Format |
|---|---|---|
| `'Claude'` | `generateClaudePrompt()` | XML with semantic tags |
| `'Google'` | `generateGooglePrompt()` | Markdown with `##` headers |
| `'Microsoft'` | `generateMicrosoftPrompt()` | Markdown with numbered sections |
| `'Custom'` | `generateGenericPrompt()` | Plain text |

**Usage**

```ts
import { generatePersonaExport } from '../services/adapterService';

const promptString = generatePersonaExport(organization, persona);
// Paste into clipboard or trigger file download
```

---

### Platform Prompt Formats

#### Claude (XML)

```xml
<system_prompt>
  <role_and_persona>…</role_and_persona>
  <organization_context>…</organization_context>
  <tone_and_style>…</tone_and_style>
  <rules_and_constraints>
    <capabilities>…</capabilities>
    <constraints>…</constraints>
    <compliance_frameworks>…</compliance_frameworks>
  </rules_and_constraints>
  <examples>
    <example type="Standard">
      <user_input>…</user_input>
      <agent_response>…</agent_response>
    </example>
  </examples>
  <instructions>…</instructions>
</system_prompt>
```

#### Google (Markdown)

```markdown
# System Instructions

## Role and Persona
…
## Organization Context
…
## Tone and Voice
…
## Capabilities and Constraints
…
## Few-Shot Examples
…
## Final Directive
…
```

#### Microsoft (Markdown)

```markdown
# System Message

## 1. Persona Definition
…
## 2. Voice & Tone Guidelines
…
## 3. Operational Boundaries
…
## 4. Interaction Examples
…
```

---

## Error Handling

### AI Service

All three generation functions catch any thrown error and return pre-defined fallback data. Errors are logged to the console as `"AI Generation Error (<Type>): …"`.

Common failure causes:
- Missing or invalid `GEMINI_API_KEY`
- API quota exceeded
- Network timeout

The fallback data allows the wizard to continue even when the AI service is unavailable.

### Adapter Service

The adapter functions do not throw — they are pure string-interpolation functions. If the `org` or `persona` objects contain empty arrays (e.g. no compliance frameworks), the corresponding sections will render as empty lists rather than crashing.
