import PolicyPage from '../components/common/PolicyPage';

const sections = [
    {
        heading: '1. Refund Eligibility',
        paragraphs: ['Refunds are evaluated based on service stage, deliverables completed, and engagement terms.']
    },
    {
        heading: '2. Non-Refundable Items',
        list: ['Completed advisory work', 'Submitted registrations or bids', 'Third-party statutory/government fees']
    },
    {
        heading: '3. Request Process',
        orderedList: ['Submit a written refund request with engagement details.', 'Our team reviews delivery records and terms.', 'Decision is shared through registered contact details.']
    },
    {
        heading: '4. Processing Timeline',
        paragraphs: ['Approved refunds are processed through original payment channels within standard business timelines.']
    }
];

const RefundPolicy = () => (
    <PolicyPage
        pageName="refund_policy"
        title="Refund Policy"
        lead="Policy for assessing and processing refund requests for service engagements."
        sections={sections}
    />
);

export default RefundPolicy;
