const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

dotenv.config()

// Import routes
const authRoutes = require('./routes/authRoute')
const pagesRoutes = require('./routes/pagesRoute')
const servicesRoutes = require('./routes/servicesRoute')
const tendersRoutes = require('./routes/tendersRoute')
const blogsRoutes = require('./routes/blogsRoute')
const enquiriesRoutes = require('./routes/enquiriesRoute')
const usersRoutes = require('./routes/usersRoute')
const settingsRoutes = require('./routes/settingsRoute')
const customerAuthRoutes = require('./routes/customerAuthRoute')
const paymentsRoutes = require('./routes/paymentsRoute')

const app = express()

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// In-memory data store for mock data
const mockData = {
    admins: [
        {
            _id: '1',
            email: 'admin@example.com',
            password: 'admin123', // plain text for testing
            name: 'Admin User'
        }
    ],
    pages: [
        {
            _id: '1',
            pageName: 'home',
            title: 'GeM Services India',
            content: JSON.stringify({
                title: 'GeM Services India',
                kicker: 'Enterprise Procurement Enablement',
                lead: 'Built for serious teams that need predictable support for GeM onboarding, catalogue execution, bid participation, and tender delivery timelines.',
                heroPrimaryImage: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1400&q=80',
                heroSecondaryImage: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1400&q=80'
            }),
            metaTitle: 'GeM Services India | Enterprise Procurement Services',
            metaDescription: 'Enterprise-grade GeM onboarding, catalogue, bid participation, and tender management support.',
            enabled: true,
            order: 1,
            createdAt: new Date(),
            updatedAt: new Date()
        }
    ],
    services: [
        {
            _id: '1',
            title: 'GeM Registration',
            slug: 'gem-registration',
            description: 'Complete onboarding support for compliant GeM seller activation.',
            price: 'Starts at Rs. 999',
            imageUrl: 'https://images.unsplash.com/photo-1554224155-3a589877462f?auto=format&fit=crop&w=1200&q=80',
            features: ['Document checklist and validation', 'Profile creation with category mapping', 'Portal verification support'],
            enabled: true,
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            _id: '2',
            title: 'Catalogue Enablement',
            slug: 'catalogue-enablement',
            description: 'Structured catalogue listing for better visibility and compliance.',
            price: 'Starts at Rs. 1,999',
            imageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80',
            features: ['SKU structuring and taxonomy', 'Specification cleanup', 'Bulk upload assistance'],
            enabled: true,
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            _id: '3',
            title: 'Bid Participation',
            slug: 'bid-participation',
            description: 'End-to-end bid preparation and submission with compliance checks.',
            price: 'Starts at Rs. 2,999',
            imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80',
            features: ['Tender shortlist support', 'Bid pack preparation', 'Submission-day assistance'],
            enabled: true,
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            _id: '4',
            title: 'Tender Tracking Desk',
            slug: 'tender-tracking',
            description: 'Opportunity discovery and tracking aligned to your business profile.',
            price: 'Starts at Rs. 1,499',
            imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
            features: ['Keyword watchlists', 'Deadline alerts', 'Opportunity summaries'],
            enabled: true,
            createdAt: new Date(),
            updatedAt: new Date()
        }
    ],
    tenders: [
        {
            _id: '1',
            title: 'Office Supplies Procurement - Delhi Secretariat',
            department: 'Department of Administrative Reforms',
            tenderNumber: 'DAR/DEL/2026/001',
            governmentType: 'state',
            state: 'Delhi',
            district: 'New Delhi',
            category: 'Office Supplies',
            lastDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            description: 'Rate contract for office supplies and stationery.',
            details: 'Supply, delivery, and inventory support for government departments.',
            estimatedValue: 1800000,
            currency: 'INR',
            documents: [
                {
                    name: 'Office-Supplies-RFP.pdf',
                    url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
                    type: 'application/pdf'
                }
            ],
            isPaidContent: false,
            enabled: true,
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            _id: '2',
            title: 'IT Infrastructure AMC - State Data Center',
            department: 'IT & Electronics Department',
            tenderNumber: 'ITED/2026/024',
            governmentType: 'state',
            state: 'Karnataka',
            district: 'Bengaluru',
            category: 'IT Services',
            lastDate: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000),
            description: 'Comprehensive annual maintenance contract for server and network infra.',
            details: 'Preventive and corrective maintenance for 24x7 operations.',
            estimatedValue: 5600000,
            currency: 'INR',
            documents: [
                {
                    name: 'IT-AMC-Scope.pdf',
                    url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
                    type: 'application/pdf'
                }
            ],
            isPaidContent: true,
            enabled: true,
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            _id: '3',
            title: 'Hospital Biomedical Equipment Supply',
            department: 'Health Department',
            tenderNumber: 'HD/TN/2026/114',
            governmentType: 'state',
            state: 'Tamil Nadu',
            district: 'Chennai',
            category: 'Medical Equipment',
            lastDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000),
            description: 'Supply and commissioning of biomedical equipment.',
            estimatedValue: 12500000,
            currency: 'INR',
            isPaidContent: false,
            enabled: true,
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            _id: '4',
            title: 'Solar Street Lighting Project - Phase 2',
            department: 'Urban Development Authority',
            tenderNumber: 'UDA/GJ/2026/087',
            governmentType: 'state',
            state: 'Gujarat',
            district: 'Ahmedabad',
            category: 'Electrical',
            lastDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
            description: 'Design, supply, installation, and maintenance of solar street lights.',
            estimatedValue: 8200000,
            currency: 'INR',
            isPaidContent: false,
            enabled: true,
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            _id: '5',
            title: 'School Smart Classroom Upgrade Program',
            department: 'School Education Department',
            tenderNumber: 'SED/AP/2026/311',
            governmentType: 'state',
            state: 'Andhra Pradesh',
            district: 'Vijayawada',
            category: 'Education Tech',
            lastDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
            description: 'Procurement and setup of smart classroom kits in government schools.',
            estimatedValue: 6900000,
            currency: 'INR',
            isPaidContent: false,
            enabled: true,
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            _id: '6',
            title: 'Road Rehabilitation and Drainage Works',
            department: 'Public Works Department',
            tenderNumber: 'PWD/MH/2026/552',
            governmentType: 'state',
            state: 'Maharashtra',
            district: 'Pune',
            category: 'Civil Works',
            lastDate: new Date(Date.now() + 11 * 24 * 60 * 60 * 1000),
            description: 'Road strengthening and stormwater drainage rehabilitation.',
            estimatedValue: 17400000,
            currency: 'INR',
            isPaidContent: false,
            enabled: true,
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            _id: '7',
            title: 'National Cyber Security Monitoring Platform',
            department: 'Ministry of Electronics & IT',
            tenderNumber: 'MEITY/CYB/2026/901',
            governmentType: 'central',
            state: 'Delhi',
            district: 'New Delhi',
            category: 'Cyber Security',
            lastDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000),
            description: 'SIEM and SOC implementation with 24x7 monitoring.',
            details: 'Scope includes SOC setup, threat intelligence integration, and response playbooks.',
            estimatedValue: 24500000,
            currency: 'INR',
            isPaidContent: true,
            enabled: true,
            createdAt: new Date(),
            updatedAt: new Date()
        }
    ],
    blogs: [
        {
            _id: '1',
            title: 'How to Win Tenders',
            category: 'Tender Tips',
            content: 'Winning tenders requires strategic planning and careful execution...',
            author: 'John Doe',
            date: new Date(),
            metaTitle: 'How to Win Tenders',
            metaDescription: 'Tips for winning tenders',
            enabled: true,
            createdAt: new Date(),
            updatedAt: new Date()
        }
    ],
    enquiries: [
        {
            _id: '1',
            name: 'John Doe',
            mobile: '9876543210',
            email: 'john@example.com',
            service: 'Tender Registration',
            message: 'I would like to register for a tender',
            createdAt: new Date()
        }
    ],
    users: [
        {
            _id: '1',
            name: 'John Doe',
            email: 'john@example.com',
            mobile: '9876543210',
            passwordHash: bcrypt.hashSync('User@123', 10),
            role: 'user',
            isPremium: false,
            premiumActiveUntil: null,
            isActive: true,
            createdAt: new Date()
        }
    ],
    otpRequests: {},
    payments: [],
    settings: {
        siteName: 'GeM Services India',
        siteTagline: 'Government Procurement Enablement Partner',
        siteDescription: 'Enterprise-grade GeM onboarding, bid participation, and tender operations support for businesses across India.',
        logoUrl: '',
        logoAlt: 'GeM Services India logo',
        websiteUrl: 'https://gemservicesindia.in',
        whatsappNumber: '+91 9876543210',
        phoneNumber: '+91 9876543210',
        email: 'info@gemservicesindia.in',
        addressLine: 'Lucknow, Uttar Pradesh, India',
        businessHours: 'Mon to Fri, 9:00 AM to 6:00 PM IST',
        facebookUrl: 'https://facebook.com/gemservicesindia',
        instagramUrl: 'https://instagram.com/gemservicesindia',
        linkedinUrl: 'https://linkedin.com/company/gemservicesindia',
        footerBlurb: 'Trusted procurement operations support for registration, bidding, compliance, and post-award execution.',
        footerSolutions: [
            'GeM Registration',
            'Catalogue Enablement',
            'Bid Participation',
            'Tender Tracking',
            'Compliance Support',
            'Enterprise SLA Desk'
        ],
        homeHeroImageUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=2000&q=80',
        homeHeroImageAlt: 'Enterprise team planning procurement operations',
        tenderAccessEnabled: true,
        premiumEnabled: true,
        premiumPlanName: 'Premium Tender Access',
        premiumPrice: 2999,
        premiumCurrency: 'INR',
        premiumDurationDays: 30,
        freeVisibleTenders: 5,
        premiumPreviewTenders: 2,
        razorpayKeyId: 'rzp_test_mock_enterprise'
    }
}

// Attach mock data to app for use in routes
app.locals.mockData = mockData

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/pages', pagesRoutes)
app.use('/api/services', servicesRoutes)
app.use('/api/tenders', tendersRoutes)
app.use('/api/blogs', blogsRoutes)
app.use('/api/enquiries', enquiriesRoutes)
app.use('/api/users', usersRoutes)
app.use('/api/settings', settingsRoutes)
app.use('/api/customer-auth', customerAuthRoutes)
app.use('/api/payments', paymentsRoutes)

// Serve static files from React build
const path = require('path')
app.use(express.static(path.join(__dirname, '../client/build')))

// Handle React routing, return all requests to React app
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'))
})

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})
