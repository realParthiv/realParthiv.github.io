---
title: AcademicShield 2.0
stack: [Django, React, TypeScript, Ethereum, Solidity, Celery, Razorpay]
year: 2025
status: "VERIFIED — SHIPPED"
summary: "A university management platform that records every issued degree on-chain, so an employer can verify a certificate without having to ask the university."
featured: true
order: 1
---
# Eradicating Academic Fraud & Operational Fragmentation

Academic credential fraud remains a widespread issue globally. Physical degrees and standard digital PDFs are easily forged, altered, or photoshopped, while background verifications can take weeks or months. Simultaneously, universities suffer from fragmented operational software—using disconnected platforms for student enrollment, examination grading, timetable scheduling, fee collection, and transcript generation. 

**AcademicShield 2.0** was engineered as an enterprise-grade multi-tenant governance and credential verification ecosystem. It unifies the entire academic lifecycle into a single platform while anchoring digital degrees directly to the **Ethereum Sepolia** blockchain—ensuring certificates are mathematically unforgeable by construction, not policy.

## Multi-Tenant Architecture & Data Isolation

AcademicShield 2.0 operates as a SaaS platform hosting multiple independent universities within a single deployment.

```
University Tenant A                       University Tenant B
├── Isolated Departments & Courses        ├── Isolated Departments & Courses
├── Custom Grade Scales & Policies        ├── Custom Grade Scales & Policies
├── Custom HTML/CSS Certificate Engine    ├── Custom HTML/CSS Certificate Engine
└── Encrypted Razorpay Financial Vault    └── Encrypted Razorpay Financial Vault
```

Data isolation is maintained through logical row-level partitioning across all core domain entities (`Department`, `Course`, `Subject`, `StudentProfile`, `Exam`, `Result`, `FeeStructure`). API controllers enforce scoped querysets based on the authenticated user's university context (`user.university_id`), ensuring zero cross-tenant data leakage. Access is governed by a **6-tier Role-Based Access Control (RBAC)** matrix ranging from Global Superadmins and University Administrators down to Faculty and Students.

## On-Chain Credential Anchoring (`CredentialRegistry.sol`)

The platform's trust layer relies on a custom **Solidity** smart contract deployed to the Ethereum Sepolia Testnet.

### Cryptographic Hashing and Batching
When a certificate is generated, the backend computes a SHA-256 cryptographic fingerprint combining student identity, course details, and issue timestamp:

```
certificate_hash = SHA-256(certificate_number + student_id + enrollment_no + issue_date)
```

University administrators use MetaMask client-side signatures to execute `anchorCredential` or `batchAnchorCredentials` on `CredentialRegistry.sol`. Gas efficiency is maximized through batch anchoring array inputs, achieving a **~75% reduction in gas fees** compared to single-credential transactions.

### Sub-Second Public Verification
Employers or background verifiers can scan a certificate's dynamic QR code or visit `/verify/{hash}`. The public interface executes a zero-cost read call directly against the Ethereum blockchain, validating the certificate's existence, issuing institution address, timestamp, and revocation status in real time with zero authentication required.

## Non-Intermediary Direct Financial Architecture

Universities frequently reject SaaS platforms that hold tuition fees in intermediary escrow accounts or take transaction commissions. AcademicShield 2.0 resolves this through a **Non-Intermediary Financial Architecture**:

1. Each university inputs its own **Razorpay Gateway API credentials** via the administrative portal.
2. Credentials are encrypted at rest using **Fernet AES Symmetric Encryption** before persistence.
3. During student fee checkout, the system initializes Razorpay directly using that university's Key ID.
4. Tuition payments flow directly from the student's bank account to the university's bank account. **The platform never holds or touches student tuition funds.**

## Automated Academic Operations Engine

Beyond credential verification, AcademicShield 2.0 automates complex university operational workflows:

- **Multi-Tier Result Approval Pipeline:** Grades progress through a strict approval chain:
  `Faculty entry (pending)` → `Department review` → `University approval` → `Published`
- **Automated SGPA/CGPA Calculation:** Calculates grade points, semester performance, and cumulative GPAs against customizable institutional grade boundaries.
- **Promotion Policy Engine:** Evaluates student performance against configurable rules (minimum CGPA thresholds, maximum backlog limits, attendance percentages) to automate semester advancement or detention.
- **Real-Time Kanban Timetable Scheduler:** Features drag-and-drop scheduling with an in-memory conflict detection engine that prevents double-booking rooms, faculty members, or student groups.

## Security, Auditing & Resilience

System integrity is protected by stateless **SimpleJWT** token authentication with automatic rotation and blacklisting. A custom middleware intercepts all state-changing API requests (`POST`, `PUT`, `PATCH`, `DELETE`) to record immutable audit logs containing user IDs, IP addresses, payloads, and timestamps. Asynchronous background tasks—such as Sepolia block confirmation polling and PDF generation—are handled by **Celery** workers backed by **Redis**, ensuring API responsiveness under peak load.
