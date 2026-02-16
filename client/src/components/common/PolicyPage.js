import { useManagedPage } from '../../hooks/useManagedPage';

const PolicyPage = ({ pageName, title, lead, sections, footerNote }) => {
    const content = useManagedPage(pageName, { title, lead, sections, footerNote });

    return (
        <div className="page">
            <div className="container page__narrow">
                <header className="page__header">
                    <h1 className="page__title">{content.title}</h1>
                    <p className="page__lead">{content.lead}</p>
                </header>

                <article className="legal-card prose">
                    {(content.sections || []).map((section, index) => (
                        <section key={section.heading || index}>
                            <h2>{section.heading}</h2>
                            {section.paragraphs?.map((text) => (
                                <p key={text}>{text}</p>
                            ))}
                            {section.list?.length ? (
                                <ul>
                                    {section.list.map((item) => (
                                        <li key={item}>{item}</li>
                                    ))}
                                </ul>
                            ) : null}
                            {section.orderedList?.length ? (
                                <ol>
                                    {section.orderedList.map((item) => (
                                        <li key={item}>{item}</li>
                                    ))}
                                </ol>
                            ) : null}
                        </section>
                    ))}
                    {content.footerNote ? <p className="notice">{content.footerNote}</p> : null}
                    {content.body ? <p>{content.body}</p> : null}
                </article>
            </div>
        </div>
    );
};

export default PolicyPage;
