import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { IndianRupee, Link as LinkIcon, Users, CheckCircle, Loader2, ChevronDown } from 'lucide-react';
import BreadcrumbNav from '@/components/BreadcrumbNav.jsx';
import pb from '@/lib/pocketbaseClient.js';
import { toast } from 'sonner';

const AccordionItem = ({ title, content, isOpen, onClick }) => (
  <div className="border-b border-border">
    <button 
      onClick={onClick}
      type="button"
      className="w-full flex items-center justify-between py-6 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm"
    >
      <span className="text-lg font-medium text-foreground">{title}</span>
      <ChevronDown className={`h-5 w-5 text-secondary transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
    </button>
    <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96 pb-6' : 'max-h-0'}`}>
      <p className="text-muted-foreground">{content}</p>
    </div>
  </div>
);

const AffiliateProgram = () => {
  const [openFaq, setOpenFaq] = useState(0);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', website: '', instagram: '', youtube: '',
    tiktok: '', follower_count: '', niche: 'Powerlifting', promotion_method: '',
    monthly_traffic: '', affiliate_experience: '', why_join: '', terms_accepted: false
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.terms_accepted) {
      toast.error("You must accept the terms and conditions.");
      return;
    }

    setLoading(true);
    try {
      await pb.collection('affiliate_applications').create(formData, { $autoCancel: false });
      setSuccess(true);
      toast.success("Affiliate application submitted!");
      window.scrollTo(0, 0);
    } catch (err) {
      console.error(err);
      toast.error("Submission failed. Please check the fields and try again.");
    } finally {
      setLoading(false);
    }
  };

  const faqs = [
    { q: "How much commission do I earn?", a: "You earn a base rate of 15% on all individual product sales and 20% on bundle sales generated through your unique link." },
    { q: "How long does the tracking cookie last?", a: "We offer a 30-day cookie window. If a customer clicks your link and purchases within 30 days, you get the credit." },
    { q: "How and when do I get paid?", a: "Commissions are paid out monthly via Bank Transfer, UPI, or PayPal on the 15th of every month for the previous month's earnings. Minimum payout threshold is ₹2000." },
    { q: "Do I need a large following to apply?", a: "While a strong audience helps, we value engagement and content quality over pure numbers. Micro-influencers with highly engaged strength niches are welcome." },
    { q: "Can I use my own affiliate link for personal purchases?", a: "No. Self-referrals are strictly prohibited and will result in commission cancellation and potential account termination." },
    { q: "What marketing materials do you provide?", a: "Approved affiliates get access to a dashboard with high-res product images, banners, promotional copy, and exclusive discount codes for their audience." }
  ];

  if (success) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4 pt-20">
        <div className="h-24 w-24 bg-primary/20 rounded-full flex items-center justify-center mb-6">
          <CheckCircle className="h-12 w-12 text-primary" />
        </div>
        <h1 className="text-4xl font-black text-foreground uppercase tracking-tight mb-4">Application Submitted</h1>
        <p className="text-xl text-muted-foreground max-w-lg mb-8">Thank you for applying to the STRONGBUILD Affiliate Program. We review applications weekly and will be in touch via email.</p>
        <button onClick={() => window.location.href = '/'} className="bg-primary text-primary-foreground font-bold px-8 py-4 rounded-sm tracking-wider uppercase hover:bg-primary/90 transition-colors">
          Return to Base
        </button>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Affiliate Program | STRONGBUILD</title>
        <meta name="description" content="Join the STRONGBUILD affiliate program and earn 15% on gear and 20% on bundles with a 30-day cookie. Get marketing assets, discount codes and a dedicated affiliate manager." />
      </Helmet>
      
      {/* Hero Section */}
      <section className="bg-card py-24 border-b border-border pt-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background z-10 pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-20">
          <h1 className="text-4xl md:text-6xl font-black uppercase text-foreground mb-6 heading-balance">Monetize Your Influence</h1>
          <p className="text-lg text-secondary max-w-2xl mx-auto mb-8">Partner with STRONGBUILD. Promote premium gear. Earn aggressive commissions.</p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <BreadcrumbNav items={[{ label: "Affiliate Program" }]} />

        {/* Benefits Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="luxury-card p-8 rounded-xl text-center">
            <IndianRupee className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-black text-foreground uppercase mb-2">High Commissions</h3>
            <p className="text-muted-foreground text-sm">Earn 15% on standard gear and 20% on premium bundles.</p>
          </div>
          <div className="luxury-card p-8 rounded-xl text-center">
            <LinkIcon className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-black text-foreground uppercase mb-2">30-Day Cookie</h3>
            <p className="text-muted-foreground text-sm">Get credited for purchases made up to 30 days after the click.</p>
          </div>
          <div className="luxury-card p-8 rounded-xl text-center">
            <Users className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-black text-foreground uppercase mb-2">Dedicated Support</h3>
            <p className="text-muted-foreground text-sm">Access marketing assets and a dedicated affiliate manager.</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-12 mb-16">
          
          {/* Form */}
          <div className="lg:col-span-8 luxury-card p-6 md:p-10 rounded-xl">
            <h2 className="text-2xl font-black uppercase text-foreground mb-8 border-b border-border pb-4">Affiliate Application</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-secondary mb-2 uppercase">Full Name *</label>
                  <input type="text" name="name" required value={formData.name} onChange={handleInputChange} className="w-full p-3 rounded-sm border border-border focus:border-primary" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-secondary mb-2 uppercase">Email *</label>
                  <input type="email" name="email" required value={formData.email} onChange={handleInputChange} className="w-full p-3 rounded-sm border border-border focus:border-primary" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-secondary mb-2 uppercase">Phone Number</label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className="w-full p-3 rounded-sm border border-border focus:border-primary" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-secondary mb-2 uppercase">Website / Blog URL</label>
                  <input type="url" name="website" placeholder="https://" value={formData.website} onChange={handleInputChange} className="w-full p-3 rounded-sm border border-border focus:border-primary" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-secondary mb-2 uppercase">Primary Content Niche *</label>
                  <select name="niche" required value={formData.niche} onChange={handleInputChange} className="w-full p-3 rounded-sm border border-border focus:border-primary">
                    <option>Powerlifting</option>
                    <option>General Fitness</option>
                    <option>Gym / Commercial Facility</option>
                    <option>Strength Coaching</option>
                    <option>Lifestyle / Supplements</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-secondary mb-2 uppercase">Total Audience Size</label>
                  <input type="number" name="follower_count" placeholder="e.g. 50000" value={formData.follower_count} onChange={handleInputChange} className="w-full p-3 rounded-sm border border-border focus:border-primary" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-secondary mb-2 uppercase">Social Media Handles</label>
                <input type="text" name="instagram" placeholder="IG / YouTube / TikTok (@handles)" value={formData.instagram} onChange={handleInputChange} className="w-full p-3 rounded-sm border border-border focus:border-primary" />
              </div>

              <div>
                <label className="block text-sm font-bold text-secondary mb-2 uppercase">How will you promote STRONGBUILD? *</label>
                <textarea name="promotion_method" required rows="3" value={formData.promotion_method} onChange={handleInputChange} className="w-full p-3 rounded-sm border border-border focus:border-primary" placeholder="e.g., YouTube gear reviews, Instagram reels, blog posts..."></textarea>
              </div>

              <div>
                <label className="block text-sm font-bold text-secondary mb-2 uppercase">Why join our program?</label>
                <textarea name="why_join" rows="2" value={formData.why_join} onChange={handleInputChange} className="w-full p-3 rounded-sm border border-border focus:border-primary"></textarea>
              </div>

              <div className="pt-4 border-t border-border">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <div className="relative flex items-center justify-center mt-1">
                    <input type="checkbox" name="terms_accepted" required checked={formData.terms_accepted} onChange={handleInputChange} className="peer sr-only" />
                    <div className="w-5 h-5 border-2 border-secondary rounded-sm peer-checked:bg-primary peer-checked:border-primary transition-colors"></div>
                    <CheckCircle className="absolute text-white w-3 h-3 opacity-0 peer-checked:opacity-100 pointer-events-none" />
                  </div>
                  <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                    I agree to the Affiliate Terms of Service. I confirm I will not engage in spam, coupon-site scraping, or self-referrals.
                  </span>
                </label>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-black tracking-widest uppercase py-4 rounded-sm text-lg flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none mt-4"
              >
                {loading ? <><Loader2 className="h-6 w-6 animate-spin" /> Processing...</> : 'Apply to Network'}
              </button>
            </form>
          </div>

          {/* Sidebar FAQs */}
          <div className="lg:col-span-4">
            <div className="sticky top-24">
              <h2 className="text-xl font-black uppercase text-foreground mb-6">Program FAQ</h2>
              <div className="border-t border-border">
                {faqs.map((faq, index) => (
                  <AccordionItem 
                    key={index} 
                    title={faq.q} 
                    content={faq.a} 
                    isOpen={openFaq === index} 
                    onClick={() => setOpenFaq(openFaq === index ? -1 : index)} 
                  />
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default AffiliateProgram;