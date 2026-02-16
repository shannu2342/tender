import PolicyPage from '../components/common/PolicyPage';

const sections = [
    {
        heading: '1. Tender Information Sources',
        paragraphs: ['Tender listings and summaries are compiled from available sources and may change without notice.']
    },
    {
        heading: '2. Verification Responsibility',
        paragraphs: ['Users must verify tender details directly from official issuing authorities before acting.']
    },
    {
        heading: '3. Participation Risk',
        paragraphs: ['Participation decisions and submission outcomes remain the responsibility of the participating entity.']
    },
    {
        heading: '4. No Government Affiliation',
        paragraphs: ['We are an independent service provider and not an official government body.']
    }
];

const TenderDisclaimer = () => (
    <PolicyPage
        pageName="tender_disclaimer"
        title="Tender Disclaimer"
        lead="Specific terms governing tender-related information and participation guidance."
        sections={sections}
    />
);

export default TenderDisclaimer;
