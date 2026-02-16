import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { blogPosts } from '../data/siteContent';
import { blogsService } from '../services/api';

const BlogDetail = () => {
    const { slug } = useParams();
    const [blogs, setBlogs] = useState(blogPosts);

    useEffect(() => {
        const loadBlogs = async () => {
            try {
                const response = await blogsService.getBlogs();
                if (Array.isArray(response.data) && response.data.length) {
                    setBlogs(response.data);
                }
            } catch (error) {
                // Keep fallback data.
            }
        };

        loadBlogs();
    }, []);

    const post = useMemo(() => {
        return (
            blogs.find((item) => String(item.slug || item._id || item.id) === String(slug)) ||
            blogs[0]
        );
    }, [blogs, slug]);

    const related = useMemo(
        () => blogs.filter((item) => (item.slug || item._id || item.id) !== (post?.slug || post?._id || post?.id)).slice(0, 2),
        [blogs, post]
    );

    const paragraphs = Array.isArray(post?.content)
        ? post.content
        : [post?.content || post?.description || 'Detailed blog content will be updated here.'];

    return (
        <div className="page">
            <div className="container page__narrow">
                <article className="legal-card prose">
                    <div className="chip-row">
                        <span className="chip chip--sky">{post?.category || 'Insights'}</span>
                        <span className="chip">{post?.readTime || '5 min read'}</span>
                    </div>
                    <h1 className="page__title mt-12">{post?.title}</h1>
                    <p className="page__lead">{post?.excerpt || post?.summary}</p>
                    <img src={post?.cover || post?.featuredImage || 'https://picsum.photos/seed/blog-fallback/900/560'} alt={post?.title} className="media-cover media-cover--md mt-18 mb-18" />

                    <h2>Article</h2>
                    {paragraphs.map((paragraph, idx) => (
                        <p key={`${idx}-${paragraph.slice(0, 24)}`}>{paragraph}</p>
                    ))}

                    <h2>Tags</h2>
                    <div className="chip-row">
                        {(post?.tags || ['GeM', 'Procurement']).map((tag) => (
                            <span key={tag} className="chip">{tag}</span>
                        ))}
                    </div>
                </article>

                <section className="page page--no-bottom">
                    <h2 className="section-title">Related Articles</h2>
                    <div className="grid gap-8 md:grid-cols-2">
                        {related.map((item, index) => (
                            <article key={item.slug || item._id || item.id} className="card">
                                <img src={item.cover || item.featuredImage || `https://picsum.photos/seed/blog-related-${index + 1}/900/560`} alt={item.title} className="media-cover media-cover--sm" />
                                <div className="card-body">
                                    <h3 className="section-title title-sm">{item.title}</h3>
                                    <p className="section-subtitle">{item.excerpt || item.summary || 'Read more from our insights desk.'}</p>
                                    <div className="cta-row">
                                        <Link className="btn btn-secondary" to={`/blog/${item.slug || item._id || item.id}`}>Read</Link>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default BlogDetail;
