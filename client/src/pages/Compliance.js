import PolicyPage from '../components/common/PolicyPage';

const sections = [
    {
        heading: '1. Compliance Commitment',
        paragraphs: ['Our team follows a compliance-led approach in documentation, process execution, and communication.']
    },
    {
        heading: '2. Operational Controls',
        list: ['Document versioning', 'Checklist-based submission reviews', 'Defined ownership and approval gates']
    },
    {
        heading: '3. Ethical Practices',
        paragraphs: ['We maintain ethical conduct standards and do not support non-compliant or misleading submissions.']
    },
    {
        heading: '4. Continuous Improvement',
        paragraphs: ['Processes are periodically reviewed to improve quality, speed, and governance outcomes.']
    }
];

const Compliance = () => (
    <PolicyPage
        pageName="compliance"
        title="Compliance"
        lead="Our approach to governance, documentation discipline, and ethical procurement operations."
        sections={sections}
    />
);

export default Compliance;
