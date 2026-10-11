import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useParams, Link } from 'react-router-dom';
import { Calendar, Clock, ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
import pb from '@/lib/pocketbaseClient.js';
import { LoadingSpinner } from '@/components/SharedComponents.jsx';

const BlogPostDetailPage = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setLoading(true);
    setNotFound(false);
    pb.collection('blog_posts').getFirstListItem(pb.filter('slug = {:slug}', { slug }), {
      $autoCancel: false,
    })
      .then((rec) => {
        setPost(rec);
        return pb.collection('blog_posts').getList(1, 3, {
          filter: pb.filter('slug != {:slug}', { slug }),
          sort: '-publish_date',
          $autoCancel: false,
        });
      })
      .then((res) => setRelated(res.items || []))
      .catch((err) => {
        if (err?.status === 404) setNotFound(true);
        else console.error(err);
      })
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <div className="pt-32"><LoadingSpinner /></div>;

  if (notFound || !post) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 pt-32">
        <h1 className="text-5xl font-black text-white uppercase mb-4">Article Not Found</h1>
        <p className="text-muted-foreground mb-8">The article you are looking for may have been moved or unpublished.</p>
        <Link to="/blog" className="bg-accent text-white font-bold px-8 py-4 rounded-xl uppercase tracking-wider">Back to Blog</Link>
      </div>
    );
  }

  const paragraphs = (post.content || '').split('\n').filter(Boolean);

  return (
    <>
      <Helmet>
        <title>{post.seo_title || `${post.title} - STRONGBUILD`}</title>
        <meta name="description" content={post.seo_description || post.excerpt || post.title} />
      </Helmet>

      {/* Hero */}
      <section className="relative pt-32 pb-16 border-b border-white/10 bg-[#070707]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/blog" className="inline-flex items-center gap-2 text-brand-blue text-sm font-bold uppercase tracking-wider mb-6 hover:text-white transition-colors">
            <ArrowLeft className="h-4 w-4" /> All Articles
          </Link>
          {post.category && <span className="section-eyebrow">{post.category}</span>}
          <h1 className="text-3xl md:text-5xl font-black uppercase text-white tracking-tight mt-2 mb-6 heading-balance">{post.title}</h1>
          <div className="flex flex-wrap items-center gap-5 text-sm text-muted-foreground">
            {post.author && <span className="font-bold text-white/80">{post.author}</span>}
            <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" /> {new Date(post.publish_date || post.created).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
            <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> {post.reading_time || 5} min read</span>
          </div>
        </div>
      </section>

      {/* Featured image */}
      {post.featured_image ? (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 mb-12 relative z-10">
          <div className="aspect-[16/9] rounded-2xl overflow-hidden border border-white/10">
            <img src={pb.files.getURL(post, post.featured_image)} alt={post.title} className="w-full h-full object-cover" />
          </div>
        </div>
      ) : null}

      {/* Body */}
      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {post.excerpt && <p className="text-xl text-white/80 leading-relaxed mb-10 font-light">{post.excerpt}</p>}
        <div className="space-y-6 text-white/75 leading-relaxed text-lg">
          {paragraphs.map((para, i) => {
            const isHeading = /^[A-Z][A-Za-z0-9 ]{2,40}$/.test(para.trim()) && para.trim().length < 45 && i > 0;
            if (isHeading) {
              return <h2 key={i} className="text-2xl font-black uppercase text-white tracking-tight pt-4">{para.trim()}</h2>;
            }
            return <p key={i}>{para}</p>;
          })}
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex items-center justify-between">
          <Link to="/shop" className="inline-flex items-center gap-2 bg-accent text-white font-bold px-6 py-3 rounded-xl uppercase tracking-wider text-sm hover:bg-accent/90 transition-colors">
            Shop the gear <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </article>

      {/* Related */}
      {related.length > 0 && (
        <section className="py-16 border-t border-white/10 bg-[#070707]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-black uppercase text-white tracking-tight mb-8">Keep reading</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {related.map((r) => (
                <Link key={r.id} to={`/blog/${r.slug}`} className="luxury-card rounded-xl overflow-hidden group flex flex-col">
                  <div className="aspect-video bg-black relative overflow-hidden">
                    {r.featured_image ? (
                      <img src={pb.files.getURL(r, r.featured_image)} alt={r.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground font-bold tracking-widest uppercase text-xs">STRONGBUILD</div>
                    )}
                  </div>
                  <div className="p-5">
                    {r.category && <span className="text-xs text-brand-blue font-bold uppercase tracking-wider">{r.category}</span>}
                    <h3 className="font-bold text-white mt-2 line-clamp-2">{r.title}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default BlogPostDetailPage;
