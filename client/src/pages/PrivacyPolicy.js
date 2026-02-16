import PolicyPage from '../components/common/PolicyPage';

const sections = [
    {
        heading: '1. Information We Collect',
        paragraphs: ['We collect information you submit through forms, service requests, and communication channels.'],
        list: ['Name and contact details', 'Business and service requirement information', 'Communication records related to support']
    },
    {
        heading: '2. How We Use Information',
        paragraphs: ['Your information is used only for service delivery, support communication, and improving operations.'],
        list: ['Responding to enquiries', 'Providing requested services', 'Compliance and internal quality controls']
    },
    {
        heading: '3. Data Security',
        paragraphs: ['Reasonable administrative and technical safeguards are maintained to protect data from unauthorized access.']
    },
    {
        heading: '4. Your Rights',
        paragraphs: ['You may request access, correction, or deletion of your personal data subject to legal and operational obligations.']
    }
];

const PrivacyPolicy = () => (
    <PolicyPage
        pageName="privacy_policy"
        title="Privacy Policy"
        lead="How we collect, use, and safeguard your information while delivering procurement support services."
        sections={sections}
        footerNote="For privacy requests, contact our support desk through the contact page."
    />
);

export default PrivacyPolicy;
