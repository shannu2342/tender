import PolicyPage from '../components/common/PolicyPage';

const sections = [
    {
        heading: '1. Acceptance of Terms',
        paragraphs: ['By using this website or engaging our services, you agree to these terms and related policies.']
    },
    {
        heading: '2. Service Scope',
        paragraphs: ['Service deliverables are defined through engagement-specific communication and applicable agreements.']
    },
    {
        heading: '3. Client Responsibilities',
        list: ['Provide accurate and complete information', 'Share required documents on time', 'Review and approve submissions when requested']
    },
    {
        heading: '4. Fees and Payments',
        paragraphs: ['Commercial terms, payment schedules, and applicable taxes are communicated before service execution.']
    },
    {
        heading: '5. Limitation of Liability',
        paragraphs: ['We are not liable for losses arising from third-party portal issues, force majeure events, or incomplete client inputs.']
    }
];

const TermsConditions = () => (
    <PolicyPage
        pageName="terms_conditions"
        title="Terms and Conditions"
        lead="Governing terms for using our website and procurement support services."
        sections={sections}
        footerNote="Continued use of this website indicates acceptance of current terms."
    />
);

export default TermsConditions;
