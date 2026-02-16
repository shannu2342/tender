import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { blogPosts } from '../data/siteContent';
import { blogsService } from '../services/api';

const Blog = () => {
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

    return (
        <div className="page">
            <div className="container">
                <header className="page__header page__narrow">
                    <h1 className="page__title">Insights and Updates</h1>
                    <p className="page__lead">
                        Practical guidance on GeM operations, bid management, and enterprise procurement delivery.
                    </p>
                </header>

                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {blogs.map((post, index) => {
                        const slug = post.slug || post._id || post.id;
                        return (
                            <article key={slug} className="card">
                                <img src={post.cover || post.featuredImage || `https://picsum.photos/seed/blog-${index + 1}/900/560`} alt={post.title} className="media-cover media-cover--md" />
                                <div className="card-body">
                                    <div className="chip-row">
                                        <span className="chip chip--sky">{post.category || 'Insights'}</span>
                                        <span className="chip">{post.readTime || '5 min read'}</span>
                                    </div>
                                    <h2 className="section-title title-md mt-12">{post.title}</h2>
                                    <p className="section-subtitle">{post.excerpt || post.summary || 'Read the latest update from our team.'}</p>
                                    <div className="notice mt-12">
                                        <strong>{post.author || 'Editorial Team'}</strong>
                                        <p>{post.date ? new Date(post.date).toLocaleDateString() : '-'}</p>
                                    </div>
                                    <div className="cta-row">
                                        <Link to={`/blog/${slug}`} className="btn btn-primary">Read Article</Link>
                                    </div>
                                </div>
                            </article>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default Blog;
