import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import pb from '@/lib/pocketbaseClient.js';
import { LoadingSpinner } from '@/components/SharedComponents.jsx';
import { FALLBACK_BLOG_POSTS } from '@/data/blogFallback.js';

const BlogPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    pb.collection('blog_posts').getFullList({ sort: '-publish_date', $autoCancel: false })
      .then(res => {
        if (res && res.length > 0) {
          setPosts(res);
        } else {
          setPosts(FALLBACK_BLOG_POSTS);
        }
      })
      .catch((err) => {
        console.warn('PocketBase fetch failed, using fallback articles:', err);
        setPosts(FALLBACK_BLOG_POSTS);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Helmet>
        <title>Training Blog & Powerlifting Guides | STRONGBUILD</title>
        <meta name="description" content="Iron Intel — training tips, lever belt and wrist wrap guides, meet-day peaking advice and powerlifting news from STRONGBUILD, India's premium strength gear brand." />
      </Helmet>
      
      <div className="bg-gradient-to-b from-[#0f0f0f] to-[#050505] py-16 md:py-24 border-b border-white/10 text-center pt-32 sm:pt-36">
        <div className="max-w-3xl mx-auto px-4">
          <span className="font-steelfish text-base uppercase tracking-widest text-brand-blue font-bold block mb-2">Powerlifting Knowledge Hub</span>
          <h1 className="font-steelfish text-5xl sm:text-7xl font-bold text-white uppercase tracking-tight mb-3 heading-balance">IRON INTEL &amp; GUIDES</h1>
          <p className="text-sm md:text-base text-white/70 font-sans max-w-xl mx-auto">Training techniques, equipment sizing breakdowns, and competition peaking strategies.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {loading ? <LoadingSpinner /> : (
          posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map(post => {
                const fallbackMatch = FALLBACK_BLOG_POSTS.find(f => f.slug === post.slug);
                const imageSrc = post.featured_image
                  ? pb.files.getURL(post, post.featured_image)
                  : (post.cover_image || fallbackMatch?.cover_image || "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1200&auto=format&fit=crop");

                return (
                  <Link key={post.id || post.slug} to={`/blog/${post.slug}`} className="luxury-card rounded-lg overflow-hidden group flex flex-col hover:border-accent/40 transition-all">
                    <div className="aspect-video bg-black relative overflow-hidden">
                      <img src={imageSrc} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      {post.category && (
                        <span className="absolute top-4 left-4 bg-accent text-white text-xs font-bold px-2.5 py-1 tracking-wider uppercase rounded shadow">
                          {post.category}
                        </span>
                      )}
                    </div>
                    <div className="p-6 flex-1 flex flex-col">
                      <h3 className="text-xl font-bold text-white mb-3 line-clamp-2 group-hover:text-accent transition-colors">{post.title}</h3>
                      <p className="text-muted-foreground text-sm line-clamp-3 mb-4 flex-1">{post.excerpt || post.content?.substring(0,100)}...</p>
                      <div className="text-xs text-primary font-medium tracking-wider uppercase mt-auto">
                        {new Date(post.publish_date || post.created).toLocaleDateString()} • {post.reading_time || 5} Min Read
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-24 text-muted-foreground">
              <p className="text-xl">No articles published yet. Check back soon.</p>
            </div>
          )
        )}
      </div>
    </>
  );
};

export default BlogPage;