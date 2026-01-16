# SaaS Compliance & Accessibility Standards Checklist

> Universal reference for international compliance, accessibility, and responsive design standards.  
> Prioritized by legal necessity and business impact.

---

## Priority Legend

| Priority | Meaning | Action |
|----------|---------|--------|
|  CRITICAL | Legal mandate / Launch blocker | Must implement before launch |
|  HIGH | Enterprise requirement | Required for B2B sales |
|  MEDIUM | Market standard | Competitive disadvantage without |
|  LOW | Best practice | Enhances trust |
|  RECOMMENDED | Future-proofing | Early adoption advantage |

---

## 1. Data Privacy & Protection

### 1.1 GDPR — General Data Protection Regulation
>  CRITICAL | EU/EEA | Penalties: €20M or 4% global revenue

- [ ] Establish lawful basis for all data processing (consent, contract, legitimate interest)
- [ ] Implement explicit, informed, freely-given consent mechanisms
- [ ] Build data subject rights functionality:
  - [ ] Right to access
  - [ ] Right to rectification
  - [ ] Right to erasure ("right to be forgotten")
  - [ ] Right to data portability
  - [ ] Right to object
- [ ] Conduct Data Protection Impact Assessments (DPIAs) for high-risk processing
- [ ] Implement 72-hour breach notification workflow
- [ ] Execute Data Processing Agreements (DPAs) with all third-party processors
- [ ] Apply privacy by design and default in architecture
- [ ] Appoint Data Protection Officer (DPO) if required
- [ ] Maintain Records of Processing Activities (RoPA)
- [ ] Implement cookie consent management
- [ ] Provide clear privacy policy with required disclosures

### 1.2 CCPA/CPRA — California Consumer Privacy Act
>  CRITICAL | California, USA | Penalties: $2,500-$7,500 per violation

**Applicability threshold:** >$25M revenue, OR 50K+ consumers, OR 50%+ revenue from data sales

- [ ] Implement "Do Not Sell My Personal Information" opt-out
- [ ] Provide "right to know" data collection disclosures
- [ ] Build data deletion request workflow
- [ ] Ensure non-discrimination for privacy rights exercise
- [ ] Update privacy policy with CCPA-required disclosures
- [ ] Implement sensitive personal information handling (CPRA)
- [ ] Provide opt-out of automated decision-making

### 1.3 US State Privacy Laws (2025)
>  HIGH to  MEDIUM | Various states

| State | Law | Effective | Priority |
|-------|-----|-----------|----------|
| Virginia | VCDPA | Jan 2023 |  HIGH |
| Colorado | CPA | Jul 2023 |  HIGH |
| Connecticut | CTDPA | Jul 2023 |  HIGH |
| Utah | UCPA | Dec 2023 |  MEDIUM |
| Texas | TDPSA | Jul 2024 |  HIGH |
| Florida | FDBR | Jul 2024 |  HIGH |
| Oregon | OCPA | Jul 2024 |  MEDIUM |
| Delaware | DPDPA | Jan 2025 |  MEDIUM |
| Iowa | ICDPA | Jan 2025 |  MEDIUM |
| New Hampshire | SB255 | Jan 2025 |  MEDIUM |
| New Jersey | SB332 | Jan 2025 |  MEDIUM |
| Tennessee | TIPA | Jul 2025 |  MEDIUM |
| Minnesota | MCDPA | Jul 2025 |  MEDIUM |
| Maryland | MODPA | Oct 2025 |  MEDIUM |

- [ ] Identify applicable state laws based on user geography
- [ ] Implement universal opt-out mechanisms
- [ ] Build consent management for minor data (enhanced protections)
- [ ] Support biometric data restrictions where applicable

### 1.4 International Privacy Regulations
>  HIGH to  MEDIUM | Various jurisdictions

| Region | Law | Standard | Priority |
|--------|-----|----------|----------|
| Canada | PIPEDA / ACA | Federal privacy |  HIGH |
| Ontario | AODA | Provincial |  HIGH |
| UK | UK GDPR | Post-Brexit GDPR |  HIGH |
| Brazil | LGPD | GDPR-equivalent |  MEDIUM |
| Australia | Privacy Act 1988 | APPs |  MEDIUM |
| Japan | APPI | Personal info protection |  MEDIUM |

- [ ] Map data flows to identify applicable jurisdictions
- [ ] Implement Standard Contractual Clauses (SCCs) for international transfers
- [ ] Consider EU-US Data Privacy Framework certification
- [ ] Document all cross-border data transfers

---

## 2. Security & Trust Frameworks

### 2.1 SOC 2 — Service Organization Control 2
>  HIGH | US market | Enterprise B2B requirement

**Trust Service Criteria (TSC):**

- [ ] **Security (required):** Protection against unauthorized access
  - [ ] Access controls and authentication
  - [ ] Network and application firewalls
  - [ ] Intrusion detection
  - [ ] Encryption at rest and in transit
- [ ] **Availability:** Systems operational as committed
  - [ ] Uptime monitoring and SLAs
  - [ ] Disaster recovery procedures
  - [ ] Backup and restoration testing
- [ ] **Processing Integrity:** Accurate and timely processing
  - [ ] Input validation
  - [ ] Error handling procedures
  - [ ] Quality assurance processes
- [ ] **Confidentiality:** Protected confidential information
  - [ ] Data classification
  - [ ] Encryption of sensitive data
  - [ ] Secure disposal procedures
- [ ] **Privacy:** Personal information handling
  - [ ] Privacy notice and consent
  - [ ] Data minimization
  - [ ] Retention policies

**Attestation Types:**
- [ ] Type I: Point-in-time control design assessment
- [ ] Type II: 6-12 month control effectiveness assessment (preferred)

### 2.2 ISO/IEC 27001:2022 — Information Security Management
>  HIGH | International | Enterprise/regulated industries

- [ ] Establish Information Security Management System (ISMS)
- [ ] Define ISMS scope and boundaries
- [ ] Conduct risk assessment and treatment
- [ ] Implement controls across 14 domains:
  - [ ] Information security policies
  - [ ] Organization of information security
  - [ ] Human resource security
  - [ ] Asset management
  - [ ] Access control
  - [ ] Cryptography
  - [ ] Physical and environmental security
  - [ ] Operations security
  - [ ] Communications security
  - [ ] System acquisition, development, maintenance
  - [ ] Supplier relationships
  - [ ] Information security incident management
  - [ ] Business continuity management
  - [ ] Compliance
- [ ] Conduct internal audits
- [ ] Management review process
- [ ] Continuous improvement program
- [ ] Third-party certification audit

### 2.3 PCI DSS 4.0 — Payment Card Industry Data Security
>  CRITICAL (if processing payments) | Global | Penalties: $5K-$100K/month

**Mandatory as of March 31, 2025**

- [ ] Define and document PCI DSS scope annually
- [ ] Implement multi-factor authentication (MFA) for all CDE access
- [ ] Enforce 12-character minimum passwords
- [ ] Inventory and authorize all payment page scripts
- [ ] Deploy automated malware detection for public-facing web apps
- [ ] Implement change/tamper detection for payment pages
- [ ] Monitor third-party service provider compliance
- [ ] Conduct targeted risk analysis for control frequencies
- [ ] Security awareness training (phishing, social engineering)
- [ ] Quarterly vulnerability scans (ASV for external)
- [ ] Annual penetration testing
- [ ] Incident response plan with payment page monitoring

**Compliance Levels:**

| Level | Transactions/Year | Requirement |
|-------|-------------------|-------------|
| 1 | >6 million | Annual QSA assessment |
| 2 | 1-6 million | SAQ + quarterly scans |
| 3 | 20K-1 million | SAQ + quarterly scans |
| 4 | <20K | SAQ + quarterly scans |

### 2.4 HIPAA — Health Insurance Portability and Accountability
>  CRITICAL (if handling PHI) | USA | Penalties: up to $1.5M/year per category

- [ ] Execute Business Associate Agreements (BAAs) with all vendors
- [ ] Implement Administrative Safeguards:
  - [ ] Security management process
  - [ ] Workforce security
  - [ ] Information access management
  - [ ] Security awareness training
  - [ ] Security incident procedures
  - [ ] Contingency plan
- [ ] Implement Physical Safeguards:
  - [ ] Facility access controls
  - [ ] Workstation security
  - [ ] Device and media controls
- [ ] Implement Technical Safeguards:
  - [ ] Access controls
  - [ ] Audit controls
  - [ ] Integrity controls
  - [ ] Transmission security
- [ ] 60-day breach notification requirement
- [ ] Minimum necessary standard for PHI access
- [ ] Patient rights: access, amendment, accounting of disclosures

### 2.5 Additional Security Frameworks
>  MEDIUM to  LOW | Various

| Framework | Use Case | Priority |
|-----------|----------|----------|
| NIST CSF 2.0 | US government, federal contractors |  MEDIUM |
| CIS Controls v8 | Prioritized security controls |  MEDIUM |
| ISO 42001 | AI management systems |  RECOMMENDED |
| FedRAMP | US federal government cloud |  LOW |
| StateRAMP | US state/local government |  LOW |

---

## 3. Accessibility Standards

### 3.1 WCAG 2.2 — Web Content Accessibility Guidelines
>  CRITICAL | Global | Legal baseline for ADA, EAA, Section 508

**Target: Level AA conformance (legal requirement)**

#### Principle 1: Perceivable

- [ ] **1.1.1 Non-text Content (A):** Alt text for images, icons, controls
- [ ] **1.2.1 Audio-only/Video-only (A):** Transcripts or descriptions
- [ ] **1.2.2 Captions (A):** Synchronized captions for video
- [ ] **1.2.3 Audio Description (A):** For prerecorded video
- [ ] **1.2.4 Captions Live (AA):** Real-time captions
- [ ] **1.2.5 Audio Description (AA):** For all prerecorded video
- [ ] **1.3.1 Info and Relationships (A):** Semantic HTML structure
- [ ] **1.3.2 Meaningful Sequence (A):** Logical reading order
- [ ] **1.3.3 Sensory Characteristics (A):** Don't rely on shape/color alone
- [ ] **1.3.4 Orientation (AA):** Support portrait and landscape
- [ ] **1.3.5 Identify Input Purpose (AA):** Autocomplete attributes
- [ ] **1.4.1 Use of Color (A):** Color not sole indicator
- [ ] **1.4.2 Audio Control (A):** Pause/stop/mute for auto-playing audio
- [ ] **1.4.3 Contrast Minimum (AA):** 4.5:1 for normal text, 3:1 for large
- [ ] **1.4.4 Resize Text (AA):** 200% zoom without loss
- [ ] **1.4.5 Images of Text (AA):** Use real text, not images
- [ ] **1.4.10 Reflow (AA):** No horizontal scroll at 320px
- [ ] **1.4.11 Non-text Contrast (AA):** 3:1 for UI components
- [ ] **1.4.12 Text Spacing (AA):** Support user text spacing
- [ ] **1.4.13 Content on Hover/Focus (AA):** Dismissible, hoverable, persistent

#### Principle 2: Operable

- [ ] **2.1.1 Keyboard (A):** All functionality via keyboard
- [ ] **2.1.2 No Keyboard Trap (A):** Can navigate away from all components
- [ ] **2.1.4 Character Key Shortcuts (A):** Configurable shortcuts
- [ ] **2.2.1 Timing Adjustable (A):** Extend/disable time limits
- [ ] **2.2.2 Pause, Stop, Hide (A):** Control moving content
- [ ] **2.3.1 Three Flashes (A):** No content flashes >3/sec
- [ ] **2.4.1 Bypass Blocks (A):** Skip navigation links
- [ ] **2.4.2 Page Titled (A):** Descriptive page titles
- [ ] **2.4.3 Focus Order (A):** Logical tab sequence
- [ ] **2.4.4 Link Purpose (A):** Clear link text
- [ ] **2.4.5 Multiple Ways (AA):** Multiple navigation methods
- [ ] **2.4.6 Headings and Labels (AA):** Descriptive headings
- [ ] **2.4.7 Focus Visible (AA):** Visible focus indicator
- [ ] **2.4.11 Focus Not Obscured (AA):** 🆕 Focused elements visible
- [ ] **2.5.1 Pointer Gestures (A):** Single-pointer alternatives
- [ ] **2.5.2 Pointer Cancellation (A):** Up-event activation
- [ ] **2.5.3 Label in Name (A):** Accessible name matches visible
- [ ] **2.5.4 Motion Actuation (A):** Alternatives to device motion
- [ ] **2.5.7 Dragging Movements (AA):** 🆕 Single-pointer alternatives
- [ ] **2.5.8 Target Size Minimum (AA):** 🆕 24x24 CSS pixels minimum

#### Principle 3: Understandable

- [ ] **3.1.1 Language of Page (A):** `lang` attribute on `<html>`
- [ ] **3.1.2 Language of Parts (AA):** `lang` on foreign text
- [ ] **3.2.1 On Focus (A):** No unexpected context change
- [ ] **3.2.2 On Input (A):** No unexpected context change
- [ ] **3.2.3 Consistent Navigation (AA):** Same navigation order
- [ ] **3.2.4 Consistent Identification (AA):** Same labels for same functions
- [ ] **3.2.6 Consistent Help (A):** 🆕 Help in same location
- [ ] **3.3.1 Error Identification (A):** Identify errors clearly
- [ ] **3.3.2 Labels or Instructions (A):** Input labels provided
- [ ] **3.3.3 Error Suggestion (AA):** Suggest corrections
- [ ] **3.3.4 Error Prevention (AA):** Confirm/review for legal/financial
- [ ] **3.3.7 Redundant Entry (A):** 🆕 Don't require re-entering info
- [ ] **3.3.8 Accessible Authentication (AA):** 🆕 No cognitive function tests

#### Principle 4: Robust

- [ ] **4.1.2 Name, Role, Value (A):** ARIA for custom controls
- [ ] **4.1.3 Status Messages (AA):** Programmatic status updates

### 3.2 US Accessibility Laws

| Law | Scope | Standard | Priority |
|-----|-------|----------|----------|
| ADA Title III | Private businesses | WCAG 2.1 AA |  CRITICAL |
| ADA Title II | State/local government | WCAG 2.1 AA |  CRITICAL |
| Section 508 | Federal agencies/contractors | WCAG 2.0 AA → 2.2 |  HIGH |
| California Unruh | California businesses | WCAG 2.0 AA |  HIGH |

- [ ] Publish accessibility statement
- [ ] Provide accessibility feedback mechanism
- [ ] Document accessibility testing procedures
- [ ] Create VPAT (Voluntary Product Accessibility Template)

### 3.3 European Accessibility Act (EAA) & EN 301 549
>  CRITICAL | EU market | Enforced June 28, 2025

- [ ] Conform to EN 301 549 (incorporates WCAG 2.1 AA)
- [ ] Ensure e-commerce checkout accessibility
- [ ] Make digital documents (PDFs) accessible
- [ ] Publish accessibility statement
- [ ] Provide accessible customer service channels
- [ ] Self-service terminal accessibility (if applicable)

**Covered services:**
- E-commerce websites and apps
- Banking services
- Transport services
- E-books and e-readers
- Streaming services
- Telecommunications

### 3.4 International Accessibility Laws

| Region | Law | Standard | Priority |
|--------|-----|----------|----------|
| Canada | ACA / AODA | CAN/ASC EN 301 549 (WCAG 2.1 AA) |  HIGH |
| UK | Equality Act / PSBAR | EN 301 549 |  HIGH |
| Australia | DDA / AS EN 301 549 | WCAG 2.1 AA |  MEDIUM |
| Germany | BITV 2.0 | EN 301 549 |  MEDIUM |
| France | RGAA 4.1 | WCAG 2.1 AA |  MEDIUM |
| Israel | IS 5568 | WCAG 2.0 AA |  MEDIUM |
| Japan | JIS X 8341-3 | WCAG 2.0 AA |  LOW |
| India | RPWD Act | EN (IS) 301 549 |  LOW |
| New Zealand | Web Standard 1.1 | WCAG 2.1 AA |  LOW |

---

## 4. Responsive Design Standards

### 4.1 Breakpoints (2025 Standard)
>  CRITICAL to  MEDIUM | Mobile-first approach

```css
/* Mobile First — Base styles (no media query) */

/* Small devices (landscape phones, ≥576px) */
@media (min-width: 576px) { }

/* Medium devices (tablets, ≥768px) */
@media (min-width: 768px) { }

/* Large devices (desktops, ≥992px) */
@media (min-width: 992px) { }

/* Extra large devices (large desktops, ≥1200px) */
@media (min-width: 1200px) { }

/* XXL devices (≥1400px) */
@media (min-width: 1400px) { }
```

| Category | Breakpoint | Devices | Priority |
|----------|------------|---------|----------|
| XS | < 576px | Small phones portrait |  CRITICAL |
| SM | ≥ 576px | Large phones, landscape |  CRITICAL |
| MD | ≥ 768px | Tablets portrait |  HIGH |
| LG | ≥ 992px | Tablets landscape, laptops |  HIGH |
| XL | ≥ 1200px | Desktops |  HIGH |
| XXL | ≥ 1400px | Large desktops |  MEDIUM |

**Micro-breakpoints (as needed):**
- 480px — Large phone landscape
- 640px — Small tablet portrait
- 1024px — Standard laptop
- 1440px — High-res laptops
- 1920px — Full HD
- 2560px — 2K/QHD

### 4.2 Responsive Implementation Checklist

- [ ] **Mobile-first CSS:** Base styles for mobile, enhance with min-width
- [ ] **Viewport meta tag:** `<meta name="viewport" content="width=device-width, initial-scale=1">`
- [ ] **Fluid grids:** Use %, rem, em instead of fixed px
- [ ] **Flexible images:** `max-width: 100%; height: auto;`
- [ ] **Fluid typography:** `font-size: clamp(1rem, 2vw + 0.5rem, 1.5rem)`
- [ ] **Container queries:** Component-level responsiveness
- [ ] **No horizontal scroll:** At any breakpoint
- [ ] **Touch targets:** Minimum 44x44 CSS pixels (48dp Android)
- [ ] **Test both orientations:** Portrait AND landscape
- [ ] **Reduced motion:** `@media (prefers-reduced-motion: reduce)`
- [ ] **Dark mode:** `@media (prefers-color-scheme: dark)`
- [ ] **High contrast:** `@media (prefers-contrast: high)`

### 4.3 Platform-Specific Guidelines

#### iOS (Apple Human Interface Guidelines)
- [ ] Adaptive layouts with Auto Layout / Size Classes
- [ ] SF Pro system font with Dynamic Type
- [ ] Tab bars for primary navigation
- [ ] 44pt minimum touch targets
- [ ] Safe area insets (notches, home indicator)
- [ ] Support all iPhone sizes (5.4", 6.1", 6.7")
- [ ] iPad multitasking (Slide Over, Split View, Stage Manager)

#### Android (Material Design 3)
- [ ] Canonical layouts for adaptive design
- [ ] Navigation Rail for tablets
- [ ] Roboto/Google Sans typography
- [ ] 48dp minimum touch targets
- [ ] WindowSizeClass support (Compact, Medium, Expanded)
- [ ] Foldable device continuity

### 4.4 Progressive Web App (PWA) Requirements

- [ ] **Web App Manifest** (`manifest.json`)
  - [ ] `name` and `short_name`
  - [ ] `icons` (192x192, 512x512 minimum)
  - [ ] `start_url`
  - [ ] `display` mode (standalone, fullscreen)
  - [ ] `theme_color` and `background_color`
- [ ] **Service Worker**
  - [ ] Offline functionality
  - [ ] Caching strategy
  - [ ] Background sync (optional)
  - [ ] Push notifications (optional)
- [ ] **HTTPS** required
- [ ] **Core Web Vitals**
  - [ ] LCP (Largest Contentful Paint) < 2.5s
  - [ ] FID (First Input Delay) < 100ms
  - [ ] CLS (Cumulative Layout Shift) < 0.1
  - [ ] INP (Interaction to Next Paint) < 200ms

---

## 5. Emerging & Future Standards

### 5.1 EU Data Act
>  RECOMMENDED | Effective September 12, 2025

- [ ] Data portability in machine-readable formats
- [ ] Customer switching with 2-month notice
- [ ] No switching charges (mandatory after Jan 2027)
- [ ] Open API interoperability

### 5.2 EU AI Act
>  RECOMMENDED | Phased implementation through 2027

- [ ] Risk classification of AI systems
- [ ] Fundamental Rights Impact Assessment (high-risk)
- [ ] Transparency for AI-generated content
- [ ] Prohibited practices compliance

### 5.3 WCAG 3.0
>  RECOMMENDED | Expected 2026+

- [ ] Monitor W3C working drafts
- [ ] New scoring methodology (bronze/silver/gold)
- [ ] Expanded scope beyond web

---

## 6. Implementation Roadmap

### Phase 1: Foundation (0-6 months) —  CRITICAL
- [ ] PCI DSS 4.0 (if processing payments)
- [ ] GDPR compliance framework
- [ ] CCPA/state privacy compliance
- [ ] WCAG 2.2 AA baseline
- [ ] Responsive design (all standard breakpoints)
- [ ] Privacy policy and cookie consent

### Phase 2: Enterprise Enablement (6-12 months) —  HIGH
- [ ] SOC 2 Type I attestation
- [ ] ISO 27001 certification prep
- [ ] EN 301 549 / EAA compliance
- [ ] Canadian ACA/AODA compliance
- [ ] VPAT publication
- [ ] Accessibility statement

### Phase 3: Market Expansion (12-18 months) —  MEDIUM
- [ ] SOC 2 Type II attestation
- [ ] ISO 27001 certification
- [ ] Additional state privacy laws
- [ ] International accessibility certs
- [ ] HIPAA compliance (if applicable)

### Phase 4: Excellence (18+ months) —  LOW /  RECOMMENDED
- [ ] ISO 42001 (AI management)
- [ ] WCAG 2.2 AAA partial conformance
- [ ] EU Data Act readiness
- [ ] EU AI Act compliance

---

## Appendix A: Acronym Reference

| Acronym | Full Name |
|---------|-----------|
| ACA | Accessible Canada Act |
| ADA | Americans with Disabilities Act |
| AODA | Accessibility for Ontarians with Disabilities Act |
| CCPA | California Consumer Privacy Act |
| CPRA | California Privacy Rights Act |
| DDA | Disability Discrimination Act |
| DPA | Data Processing Agreement |
| DPIA | Data Protection Impact Assessment |
| DPO | Data Protection Officer |
| EAA | European Accessibility Act |
| GDPR | General Data Protection Regulation |
| HIPAA | Health Insurance Portability and Accountability Act |
| ISMS | Information Security Management System |
| LGPD | Lei Geral de Proteção de Dados (Brazil) |
| MFA | Multi-Factor Authentication |
| PCI DSS | Payment Card Industry Data Security Standard |
| PHI | Protected Health Information |
| PIPEDA | Personal Information Protection and Electronic Documents Act |
| POUR | Perceivable, Operable, Understandable, Robust |
| PWA | Progressive Web App |
| QSA | Qualified Security Assessor |
| RoPA | Records of Processing Activities |
| SAQ | Self-Assessment Questionnaire |
| SOC | Service Organization Control |
| TSC | Trust Service Criteria |
| VPAT | Voluntary Product Accessibility Template |
| WCAG | Web Content Accessibility Guidelines |

---

## Appendix B: Testing Tools

### Accessibility
- axe DevTools (browser extension)
- WAVE (web accessibility evaluation)
- Lighthouse (Chrome DevTools)
- NVDA / VoiceOver / JAWS (screen readers)
- Colour Contrast Analyser

### Responsive
- Chrome DevTools Device Mode
- BrowserStack / LambdaTest
- Responsively App
- Firefox Responsive Design Mode

### Security
- OWASP ZAP
- Burp Suite
- Nessus
- Qualys SSL Labs

---

*Last updated: January 2026*