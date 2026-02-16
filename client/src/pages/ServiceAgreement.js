import PolicyPage from '../components/common/PolicyPage';

const sections = [
    {
        heading: '1. Engagement Structure',
        paragraphs: ['Service engagements are executed based on mutually agreed scope, timeline, and responsibilities.']
    },
    {
        heading: '2. Deliverables and Dependencies',
        paragraphs: ['Deliverables are provided according to agreed milestones and subject to timely client inputs.']
    },
    {
        heading: '3. Confidentiality',
        paragraphs: ['Both parties are expected to protect confidential information shared during engagement.']
    },
    {
        heading: '4. Commercial Terms',
        paragraphs: ['Payments, taxes, and invoicing are governed by proposal and invoice terms.']
    },
    {
        heading: '5. Termination',
        paragraphs: ['Either party may terminate based on terms documented in the active engagement communication.']
    }
];

const ServiceAgreement = () => (
    <PolicyPage
        pageName="service_agreement"
        title="Service Agreement"
        lead="General principles and obligations governing delivery of services."
        sections={sections}
    />
);

export default ServiceAgreement;
