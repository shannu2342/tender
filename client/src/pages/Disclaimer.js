import PolicyPage from '../components/common/PolicyPage';

const sections = [
    {
        heading: '1. Informational Purpose',
        paragraphs: ['Content on this website is provided for general information and does not constitute legal or financial advice.']
    },
    {
        heading: '2. Accuracy and Updates',
        paragraphs: ['We strive for accuracy but do not warrant completeness of all content at all times.']
    },
    {
        heading: '3. Third-Party Platforms',
        paragraphs: ['External portals and websites are governed by their own terms, availability, and policies.']
    },
    {
        heading: '4. Liability',
        paragraphs: ['Use of this website and reliance on its content is at your own discretion and risk.']
    }
];

const Disclaimer = () => (
    <PolicyPage
        pageName="disclaimer"
        title="Disclaimer"
        lead="Important limitations regarding information published on this website."
        sections={sections}
    />
);

export default Disclaimer;
