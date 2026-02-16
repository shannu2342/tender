export const serviceCatalog = [
    {
        slug: 'gem-registration',
        title: 'GeM Registration',
        shortDescription: 'Complete onboarding support for compliant GeM seller activation.',
        longDescription:
            'We handle eligibility checks, profile setup, and document submission so your team can start selling on GeM without process delays.',
        price: 'Starts at Rs. 999',
        imageUrl: 'https://images.unsplash.com/photo-1554224155-3a589877462f?auto=format&fit=crop&w=1200&q=80',
        features: ['Document checklist and validation', 'Profile creation with category mapping', 'Portal verification support', 'Post-activation guidance'],
        benefits: ['Faster onboarding', 'Reduced rejection risk', 'Clear accountability'],
        process: [
            { step: '01', title: 'Discovery Call', description: 'We validate business type, categories, and required credentials.' },
            { step: '02', title: 'Document Pack', description: 'Our team compiles and reviews all mandatory files.' },
            { step: '03', title: 'Portal Execution', description: 'Registration is submitted and tracked till activation.' },
            { step: '04', title: 'Go-Live Support', description: 'We provide operational guidance for first transactions.' }
        ]
    },
    {
        slug: 'catalogue-enablement',
        title: 'Catalogue Enablement',
        shortDescription: 'Structured catalogue listing for better visibility and compliance.',
        longDescription:
            'From image and spec standardization to category mapping, we optimize your catalogue for discoverability and buyer clarity.',
        price: 'Starts at Rs. 1,999',
        imageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80',
        features: ['SKU structuring and taxonomy', 'Specification cleanup', 'Listing QA', 'Bulk upload assistance'],
        benefits: ['Higher listing quality', 'Reduced buyer confusion', 'Improved conversion'],
        process: [
            { step: '01', title: 'Catalogue Audit', description: 'Existing product data is reviewed for gaps and conflicts.' },
            { step: '02', title: 'Data Normalization', description: 'Titles, specs, and images are standardized.' },
            { step: '03', title: 'Upload and Validation', description: 'Listings are uploaded with compliance checks.' },
            { step: '04', title: 'Performance Tuning', description: 'We improve catalogue quality using buyer signals.' }
        ]
    },
    {
        slug: 'bid-participation',
        title: 'Bid Participation',
        shortDescription: 'End-to-end bid preparation and submission with compliance checks.',
        longDescription:
            'We align eligibility, documentation, and pricing inputs to help your organization submit complete and competitive bids on time.',
        price: 'Starts at Rs. 2,999',
        imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80',
        features: ['Tender shortlist support', 'Bid pack preparation', 'Compliance and clause review', 'Submission-day assistance'],
        benefits: ['Reduced last-minute issues', 'More complete submissions', 'Better bid confidence'],
        process: [
            { step: '01', title: 'Tender Qualification', description: 'We assess fit, risks, and business viability.' },
            { step: '02', title: 'Response Development', description: 'Technical and commercial sections are assembled.' },
            { step: '03', title: 'Pre-Submission QA', description: 'A final compliance and document check is performed.' },
            { step: '04', title: 'Submission and Follow-up', description: 'We support upload, acknowledgements, and queries.' }
        ]
    },
    {
        slug: 'tender-tracking',
        title: 'Tender Tracking Desk',
        shortDescription: 'Opportunity discovery and tracking aligned to your business profile.',
        longDescription:
            'Our tracking desk monitors relevant portals and alerts your team with actionable summaries and deadlines.',
        price: 'Starts at Rs. 1,499',
        imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
        features: ['Keyword and category watchlists', 'Deadline alerts', 'Opportunity summaries', 'Bid/no-bid recommendation notes'],
        benefits: ['Improved pipeline visibility', 'Faster decision cycles', 'Lower missed-deadline risk'],
        process: [
            { step: '01', title: 'Watchlist Setup', description: 'Business-relevant categories and regions are configured.' },
            { step: '02', title: 'Monitoring', description: 'Opportunities are tracked continuously.' },
            { step: '03', title: 'Daily Alerts', description: 'Your team receives curated updates and priorities.' },
            { step: '04', title: 'Weekly Review', description: 'We refine watchlists based on outcomes and focus areas.' }
        ]
    },
    {
        slug: 'compliance-support',
        title: 'Compliance and Documentation',
        shortDescription: 'Structured support for statutory and procurement documentation.',
        longDescription:
            'We help maintain accurate, up-to-date documentation required for onboarding and bidding cycles.',
        price: 'Custom engagement',
        imageUrl: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1200&q=80',
        features: ['Document control matrix', 'Version tracking', 'Compliance checklist', 'Renewal reminders'],
        benefits: ['Audit readiness', 'Fewer documentation errors', 'Operational continuity'],
        process: [
            { step: '01', title: 'Gap Assessment', description: 'Current compliance posture is reviewed.' },
            { step: '02', title: 'Control Setup', description: 'Required templates and trackers are established.' },
            { step: '03', title: 'Execution Support', description: 'Teams are assisted through active compliance tasks.' },
            { step: '04', title: 'Continuous Review', description: 'Ongoing refresh and periodic audits are scheduled.' }
        ]
    },
    {
        slug: 'enterprise-sla-support',
        title: 'Enterprise SLA Support',
        shortDescription: 'Dedicated procurement support desk with SLA-backed response windows.',
        longDescription:
            'Designed for multi-entity teams that require predictable delivery, clear escalation paths, and coordinated support across multiple bids.',
        price: 'Enterprise pricing',
        imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
        features: ['Dedicated success manager', 'SLA response guarantees', 'Priority queue handling', 'Executive reporting'],
        benefits: ['Predictable support delivery', 'Single point of accountability', 'Better stakeholder visibility'],
        process: [
            { step: '01', title: 'SLA Design', description: 'Scope, response targets, and ownership matrix are defined.' },
            { step: '02', title: 'Team Onboarding', description: 'Escalation, communication, and tools are aligned.' },
            { step: '03', title: 'Operational Delivery', description: 'The support desk runs against agreed SLAs.' },
            { step: '04', title: 'Quarterly Review', description: 'KPIs and process improvements are reviewed with leadership.' }
        ]
    }
];

export const pricingPlans = [
    {
        name: 'Starter',
        price: 'Rs. 999',
        frequency: '/month',
        featured: false,
        description: 'For teams starting GeM and basic procurement operations.',
        points: ['GeM registration assistance', 'Basic catalogue setup', 'Email support', 'Monthly compliance checklist'],
        sampleDeliverables: [
            'Seller profile setup checklist',
            '2 sample catalogue line items',
            'Compliance readiness tracker'
        ],
        sampleTimeline: '3-5 business days'
    },
    {
        name: 'Growth',
        price: 'Rs. 2,999',
        frequency: '/month',
        featured: true,
        description: 'For active teams that need bid participation support.',
        points: ['Everything in Starter', 'Bid participation support', 'Tender tracking desk', 'Priority support window'],
        sampleDeliverables: [
            'Bid response template with compliance matrix',
            'Tender shortlist sheet (weekly)',
            'Review-ready submission checklist'
        ],
        sampleTimeline: '2-3 business days'
    },
    {
        name: 'Enterprise',
        price: 'Custom',
        frequency: '',
        featured: false,
        description: 'For large teams requiring SLA-backed procurement operations.',
        points: ['Dedicated account lead', 'SLA-backed support', 'Advanced reporting', 'Custom workflows and integrations'],
        sampleDeliverables: [
            'SLA response model and ownership matrix',
            'Executive KPI reporting template',
            'Custom workflow blueprint for your org'
        ],
        sampleTimeline: '1-2 business days for proposal draft'
    }
];

export const testimonials = [
    {
        name: 'Arun Kumar',
        role: 'CEO, Tech Solutions',
        text: 'Their team turned our manual tender process into a structured pipeline. Response quality and timeline discipline improved immediately.'
    },
    {
        name: 'Priya Sharma',
        role: 'Founder, Creative Designs',
        text: 'From GeM onboarding to bid submissions, execution was clear and predictable. We always knew what was pending and why.'
    },
    {
        name: 'Rajesh Singh',
        role: 'Director, Manufacturing Co.',
        text: 'The compliance support and tender alerts helped us scale participation without increasing our internal team size.'
    }
];

export const faqs = [
    {
        q: 'How quickly can onboarding start?',
        a: 'Most engagements start within one business day after kickoff and document alignment.'
    },
    {
        q: 'Do you support only GeM tenders?',
        a: 'No. We support GeM and broader government tender workflows based on your operating model.'
    },
    {
        q: 'Can you work with our internal procurement team?',
        a: 'Yes. We commonly operate as an extended execution layer with clear ownership and reporting.'
    },
    {
        q: 'Is enterprise SLA support available?',
        a: 'Yes. SLA-backed response and escalation models are available for enterprise plans.'
    }
];

export const blogPosts = [
    {
        slug: 'gem-registration-playbook',
        title: 'GeM Registration Playbook for Growing Businesses',
        excerpt: 'A practical framework for completing GeM registration with fewer rework cycles.',
        category: 'GeM Operations',
        author: 'Editorial Team',
        date: '2026-01-20',
        readTime: '6 min read',
        cover: 'https://picsum.photos/seed/blog-enterprise-1/900/560',
        content: [
            'GeM onboarding becomes significantly smoother when documentation ownership is assigned upfront and every file follows a versioning convention.',
            'Before submission, run a two-pass review: first for legal and statutory validity, second for portal-specific format constraints.',
            'Teams that maintain a reusable checklist reduce turnaround time for future submissions and renewals.'
        ],
        tags: ['GeM', 'Onboarding', 'Documentation']
    },
    {
        slug: 'winning-tender-responses',
        title: 'How Enterprise Teams Build Stronger Tender Responses',
        excerpt: 'Build a repeatable tender response workflow with less deadline pressure.',
        category: 'Tender Strategy',
        author: 'Bid Desk',
        date: '2026-01-08',
        readTime: '7 min read',
        cover: 'https://picsum.photos/seed/blog-enterprise-2/900/560',
        content: [
            'Winning response quality is mostly operational discipline: clear ownership, strict document controls, and review checkpoints.',
            'Create a bid/no-bid template that captures eligibility, commercial viability, and execution capacity before teams invest in drafting.',
            'Schedule dry-runs for critical submissions to avoid last-hour portal issues.'
        ],
        tags: ['Tender', 'Bids', 'Execution']
    },
    {
        slug: 'catalogue-quality-framework',
        title: 'Catalogue Quality Framework for GeM Sellers',
        excerpt: 'Improve discoverability and buyer confidence using a structured listing model.',
        category: 'Catalogue',
        author: 'Marketplace Team',
        date: '2025-12-29',
        readTime: '5 min read',
        cover: 'https://picsum.photos/seed/blog-enterprise-3/900/560',
        content: [
            'Catalogue quality affects both visibility and conversion. Standardized titles and complete technical fields improve buyer trust.',
            'Maintain a product data sheet that maps each item to category requirements before upload.',
            'Review underperforming SKUs monthly and refine imagery, specifications, and pricing signals.'
        ],
        tags: ['Catalogue', 'Quality', 'GeM']
    }
];

export const tenderRecords = [
    {
        id: '1',
        title: 'Supply of Network and Security Appliances',
        department: 'Department of Information Technology',
        governmentType: 'state',
        state: 'Uttar Pradesh',
        district: 'Lucknow',
        tenderNumber: 'UPIT/2026/014',
        description: 'Supply, installation, and support of enterprise-grade network and security appliances.',
        details:
            'Scope includes supply, installation, baseline configuration, and support for critical branch locations with mandatory compliance documentation.',
        eligibilityCriteria:
            'Registered suppliers with relevant OEM authorization, GST, and three similar deployments in the last five years.',
        documentsRequired: ['GST certificate', 'Company registration', 'OEM authorization letter', 'Past performance documents'],
        lastDate: '2026-03-12',
        openingDate: '2026-03-16',
        category: 'it-infrastructure',
        estimatedValue: 22000000,
        currency: 'INR',
        contact: {
            name: 'Procurement Cell',
            phone: '+91 9876543210',
            email: 'it.procurement@up.gov.in',
            whatsapp: '919876543210'
        },
        location: {
            address: 'IT Bhawan',
            pinCode: '226001',
            city: 'Lucknow',
            state: 'Uttar Pradesh'
        },
        documents: [
            { name: 'Tender Notice', url: '#' },
            { name: 'Technical Specifications', url: '#' },
            { name: 'Commercial Terms', url: '#' }
        ],
        tags: ['IT', 'Security', 'Networking'],
        isPaidContent: true
    },
    {
        id: '2',
        title: 'Civil Renovation for District Education Offices',
        department: 'Department of Education',
        governmentType: 'state',
        state: 'Uttar Pradesh',
        district: 'Kanpur',
        tenderNumber: 'UPEDU/2026/008',
        description: 'Renovation and modernization of district education office infrastructure.',
        details:
            'Work includes structural repairs, interior upgrades, electrical retrofitting, and compliance with public building norms.',
        eligibilityCriteria:
            'Class-A registered contractors with statutory licenses and demonstrated public-sector project experience.',
        documentsRequired: ['Contractor license', 'GST certificate', 'Work completion certificates'],
        lastDate: '2026-03-20',
        openingDate: '2026-03-25',
        category: 'construction',
        estimatedValue: 48000000,
        currency: 'INR',
        contact: {
            name: 'Works Division',
            phone: '+91 9876543211',
            email: 'works.education@up.gov.in',
            whatsapp: '919876543211'
        },
        location: {
            address: 'Education Directorate',
            pinCode: '208001',
            city: 'Kanpur',
            state: 'Uttar Pradesh'
        },
        documents: [
            { name: 'Scope of Work', url: '#' },
            { name: 'BOQ', url: '#' }
        ],
        tags: ['Construction', 'Civil', 'Education'],
        isPaidContent: false
    },
    {
        id: '3',
        title: 'Procurement of Diagnostic Equipment',
        department: 'Department of Health',
        governmentType: 'central',
        state: 'Delhi',
        district: 'New Delhi',
        tenderNumber: 'MOHFW/2026/022',
        description: 'Procurement and commissioning of diagnostic equipment for referral hospitals.',
        details:
            'Includes delivery, commissioning, user training, warranty, and annual maintenance coverage for listed facilities.',
        eligibilityCriteria:
            'Authorized OEM partners with relevant certifications and healthcare deployment references.',
        documentsRequired: ['ISO certificate', 'GST certificate', 'OEM authorization', 'Financial statements'],
        lastDate: '2026-02-28',
        openingDate: '2026-03-05',
        category: 'medical',
        estimatedValue: 76000000,
        currency: 'INR',
        contact: {
            name: 'Central Procurement Unit',
            phone: '+91 9876543212',
            email: 'health.tender@nic.in',
            whatsapp: '919876543212'
        },
        location: {
            address: 'Nirman Bhawan',
            pinCode: '110011',
            city: 'New Delhi',
            state: 'Delhi'
        },
        documents: [
            { name: 'Tender Dossier', url: '#' },
            { name: 'Technical Annexure', url: '#' }
        ],
        tags: ['Healthcare', 'Medical', 'Diagnostics'],
        isPaidContent: true
    }
];
