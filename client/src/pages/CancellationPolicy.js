import PolicyPage from '../components/common/PolicyPage';

const sections = [
    {
        heading: '1. Cancellation Requests',
        paragraphs: ['Cancellation requests must be submitted through official communication channels with engagement reference details.']
    },
    {
        heading: '2. Effective Date',
        paragraphs: ['Cancellation is effective only after acknowledgement by our support team.']
    },
    {
        heading: '3. Charges on Cancellation',
        paragraphs: ['Applicable charges may apply for work already completed or third-party costs incurred before cancellation.']
    },
    {
        heading: '4. Re-activation',
        paragraphs: ['Cancelled engagements can be re-activated subject to current scope, capacity, and revised timelines.']
    }
];

const CancellationPolicy = () => (
    <PolicyPage
        pageName="cancellation_policy"
        title="Cancellation Policy"
        lead="Rules and process for cancellation of active service engagements."
        sections={sections}
    />
);

export default CancellationPolicy;
