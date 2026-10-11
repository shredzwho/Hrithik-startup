import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import pb from '@/lib/pocketbaseClient.js';
import { LoadingSpinner } from '@/components/SharedComponents.jsx';

const BlogPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    pb.collection('blog_posts').getFullList({ sort: '-publish_date', $autoCancel: false })
      .then(res => setPosts(res))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Helmet>
        <title>Training Blog & Powerlifting Guides | STRONGBUILD</title>
        <meta name="description" content="Iron Intel — training tips, lever belt and wrist wrap guides, meet-day peaking advice and powerlifting news from STRONGBUILD, India's premium strength gear brand." />
      </Helmet>
      
      <div className="bg-secondary py-16 md:py-24 border-b border-border/50 text-center pt-32">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight mb-4 heading-balance">Iron Intel</h1>
          <p className="text-lg text-primary">Training tips, equipment guides, and powerlifting news.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {loading ? <LoadingSpinner /> : (
          posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map(post => (
                <Link key={post.id} to={`/blog/${post.slug}`} className="luxury-card rounded-lg overflow-hidden group flex flex-col">
                  <div className="aspect-video bg-black relative overflow-hidden">
                    {post.featured_image ? (
                      <img src={pb.files.getURL(post, post.featured_image)} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground font-bold tracking-widest uppercase">STRONGBUILD</div>
                    )}
                    {post.category && (
                      <span className="absolute top-4 left-4 bg-accent text-white text-xs font-bold px-2 py-1 tracking-wider uppercase">
                        {post.category}
                      </span>
                    )}
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-xl font-bold text-white mb-3 line-clamp-2">{post.title}</h3>
                    <p className="text-muted-foreground text-sm line-clamp-3 mb-4 flex-1">{post.excerpt || post.content.substring(0,100)}...</p>
                    <div className="text-xs text-primary font-medium tracking-wider uppercase mt-auto">
                      {new Date(post.publish_date || post.created).toLocaleDateString()} • {post.reading_time || 5} Min Read
                    </div>
                  </div>
                </Link>
              ))}
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