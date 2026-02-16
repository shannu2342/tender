import { useManagedPage } from '../hooks/useManagedPage';
import { pageTemplates } from '../config/pageTemplates';

const About = () => {
    const content = useManagedPage('about', pageTemplates.about);

    return (
        <div className="page">
            <div className="container page__narrow">
                <header className="page__header">
                    <h1 className="page__title">{content.title}</h1>
                    <p className="page__lead">{content.lead}</p>
                </header>

                <section className="legal-card prose">
                    {content.heroImage ? (
                        <img src={content.heroImage} alt={content.title} className="media-cover media-cover--md" style={{ borderRadius: 14, marginBottom: 18 }} />
                    ) : null}
                    {(content.sections || []).map((section) => (
                        <section key={section.heading}>
                            <h2>{section.heading}</h2>
                            {(section.paragraphs || []).map((text) => (
                                <p key={text}>{text}</p>
                            ))}
                            {section.list?.length ? (
                                <ul>
                                    {section.list.map((item) => (
                                        <li key={item}>{item}</li>
                                    ))}
                                </ul>
                            ) : null}
                        </section>
                    ))}
                    {content.body ? <p>{content.body}</p> : null}
                </section>
            </div>
        </div>
    );
};

export default About;
