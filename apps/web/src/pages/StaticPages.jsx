import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { CheckCircle, Loader2, Search, Package, Truck, CheckCircle2 } from 'lucide-react';
import pb from '@/lib/pocketbaseClient.js';
import { toast } from 'sonner';

const PageHeader = ({ title, subtitle }) => (
  <div className="bg-secondary py-16 md:py-24 border-b border-border/50 text-center pt-32">
    <div className="max-w-3xl mx-auto px-4">
      <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight mb-4 heading-balance">{title}</h1>
      {subtitle && <p className="text-lg text-primary">{subtitle}</p>}
    </div>
  </div>
);

const Container = ({ children }) => (
  <div className="max-w-4xl mx-auto px-4 py-16 text-muted-foreground leading-relaxed space-y-6">{children}</div>
);

/* ---------------- FAQ ---------------- */
const FAQ_DATA = [
  { q: 'Is the lever belt IPF approved in dimensions?', a: 'Our 10mm and 13mm lever belts are built to 10cm width and standard thickness used in tested federations across India.' },
  { q: 'How fast do you ship?', a: 'Orders placed before 4pm IST are dispatched the same working day. Metro delivery typically lands in 2-3 days.' },
  { q: 'Do you offer bundle discounts?', a: 'Yes. Belt + wraps + chalk bundles are priced below the sum of individual items, and Frequently Bought Together adds an extra saving at checkout.' },
  { q: 'What is the warranty?', a: 'Every belt carries a 2-year stitching and hardware warranty. Wraps and straps are covered for 6 months against manufacturing defects.' },
  { q: 'Is COD available?', a: 'Cash on delivery is available on eligible pin codes; prepaid orders ship first and receive priority dispatch.' },
  { q: 'How do I pick my belt size?', a: 'Measure at the navel over your usual training gear and match the size guide on each product page. Size so the belt sits in the middle of the prong holes.' },
  { q: 'Can I return or exchange gear?', a: 'Unused gear in original packaging can be returned or exchanged within 30 days of delivery. See our Returns & Exchanges page for full details.' },
  { q: 'Do you ship internationally?', a: 'Yes, we ship worldwide. International delivery typically takes 7-14 business days. Customs duties and taxes are the responsibility of the recipient.' },
];

export const FAQPage = () => {
  const [open, setOpen] = useState(0);
  return (
    <>
      <Helmet>
        <title>FAQ - STRONGBUILD</title>
        <meta name="description" content="Answers to common questions about STRONGBUILD powerlifting gear, shipping, returns, warranties and sizing." />
      </Helmet>
      <PageHeader title="Frequently Asked Questions" subtitle="Everything you need to know before you lift." />
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="divide-y divide-white/10 border-y border-white/10">
          {FAQ_DATA.map((f, i) => (
            <div key={f.q}>
              <button onClick={() => setOpen(open === i ? -1 : i)} className="w-full flex items-center justify-between gap-6 py-6 text-left">
                <span className="font-semibold text-white">{f.q}</span>
                <span className={`text-accent text-2xl shrink-0 transition-transform ${open === i ? 'rotate-45' : ''}`}>+</span>
              </button>
              {open === i && <p className="text-muted-foreground pb-6 leading-relaxed">{f.a}</p>}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

/* ---------------- Contact ---------------- */
export const ContactPage = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await pb.collection('contact_submissions').create(form, { $autoCancel: false });
      setSent(true);
      toast.success('Message sent. We will be in touch shortly.');
      setForm({ name: '', email: '', message: '' });
    } catch (err) {
      console.error(err);
      toast.error('Could not send your message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Contact Us - STRONGBUILD</title>
        <meta name="description" content="Get in touch with the STRONGBUILD team for product, order and sponsorship enquiries." />
      </Helmet>
      <PageHeader title="Contact Us" subtitle="We are here to help you lift heavier." />
      <Container>
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">Get in Touch</h2>
            <p className="mb-2"><strong className="text-white">Email:</strong> support@strongbuild.shop</p>
            <p className="mb-2"><strong className="text-white">Phone / WhatsApp:</strong> +91 8317339439</p>
            <p className="mb-2"><strong className="text-white">Hours:</strong> Mon-Sat, 10am - 7pm IST</p>
            <p className="mb-6"><strong className="text-white">Instagram:</strong> <a href="https://www.instagram.com/strongbuild.shop" target="_blank" rel="noopener noreferrer" className="text-brand-blue hover:underline">@strongbuild.shop</a></p>
            <div className="glass-panel rounded-xl p-5 text-sm">
              <p className="text-white font-bold uppercase tracking-wider mb-1">Dispatch & Returns</p>
              <p>STRONGBUILD Fulfilment Centre<br />Pune, Maharashtra 411001<br />India</p>
            </div>
          </div>

          {sent ? (
            <div className="flex flex-col items-center justify-center text-center glass-panel rounded-xl p-10">
              <CheckCircle className="h-12 w-12 text-accent mb-4" />
              <h3 className="text-xl font-black text-white uppercase mb-2">Message Received</h3>
              <p className="text-muted-foreground mb-6">Thank you for reaching out. Our team responds within one business day.</p>
              <button onClick={() => setSent(false)} className="text-accent font-bold uppercase tracking-wider text-sm">Send another</button>
            </div>
          ) : (
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-bold uppercase tracking-wider text-primary mb-2">Name</label>
                <input type="text" name="name" required value={form.name} onChange={handleChange} className="w-full p-3 rounded-sm bg-secondary border border-border text-white" />
              </div>
              <div>
                <label className="block text-sm font-bold uppercase tracking-wider text-primary mb-2">Email</label>
                <input type="email" name="email" required value={form.email} onChange={handleChange} className="w-full p-3 rounded-sm bg-secondary border border-border text-white" />
              </div>
              <div>
                <label className="block text-sm font-bold uppercase tracking-wider text-primary mb-2">Message</label>
                <textarea name="message" rows="5" required value={form.message} onChange={handleChange} className="w-full p-3 rounded-sm bg-secondary border border-border text-white"></textarea>
              </div>
              <button type="submit" disabled={loading} className="bg-accent text-white font-bold uppercase tracking-wider px-6 py-3 rounded-sm w-full hover:bg-accent/90 flex items-center justify-center gap-2 disabled:opacity-50">
                {loading ? <><Loader2 className="h-5 w-5 animate-spin" /> Sending...</> : 'Send Message'}
              </button>
            </form>
          )}
        </div>
      </Container>
    </>
  );
};

/* ---------------- Track Order ---------------- */
const STATUS_STEPS = [
  { key: 'pending', label: 'Order Placed', icon: Package },
  { key: 'confirmed', label: 'Confirmed', icon: CheckCircle2 },
  { key: 'shipped', label: 'Shipped', icon: Truck },
  { key: 'delivered', label: 'Delivered', icon: CheckCircle },
];

export const TrackOrderPage = () => {
  const [form, setForm] = useState({ order_number: '', email: '' });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);
    try {
      // Save the lookup attempt for record-keeping
      pb.collection('track_order_queries').create(form, { $autoCancel: false }).catch(() => {});

      if (!pb.authStore.isValid) {
        setError('Please log in to your account to track your orders. Order tracking is linked to your STRONGBUILD account for security.');
        setLoading(false);
        return;
      }

      const records = await pb.collection('orders').getFullList({
        filter: pb.filter('order_number = {:on}', { on: form.order_number.trim() }),
        $autoCancel: false,
      });

      if (records.length === 0) {
        setError('No order found with that number linked to your account. Double-check the order number from your confirmation email.');
      } else {
        setResult(records[0]);
        toast.success('Order found');
      }
    } catch (err) {
      console.error(err);
      setError('Could not look up your order right now. Please try again or contact support.');
    } finally {
      setLoading(false);
    }
  };

  const statusIndex = result ? STATUS_STEPS.findIndex((s) => s.key === result.status) : -1;

  return (
    <>
      <Helmet>
        <title>Track Order - STRONGBUILD</title>
        <meta name="description" content="Track the status of your STRONGBUILD order from placement to delivery." />
      </Helmet>
      <PageHeader title="Track Your Order" subtitle="Follow your gear from dispatch to doorstep." />
      <Container>
        <div className="max-w-xl mx-auto">
          <form className="space-y-4 glass-panel rounded-xl p-8" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-bold uppercase tracking-wider text-primary mb-2">Order Number</label>
              <input type="text" name="order_number" required placeholder="e.g. ORD-12345" value={form.order_number} onChange={handleChange} className="w-full p-3 rounded-sm bg-black border border-border text-white" />
            </div>
            <div>
              <label className="block text-sm font-bold uppercase tracking-wider text-primary mb-2">Email Address</label>
              <input type="email" name="email" required placeholder="Email used at checkout" value={form.email} onChange={handleChange} className="w-full p-3 rounded-sm bg-black border border-border text-white" />
            </div>
            <button type="submit" disabled={loading} className="bg-accent text-white font-bold uppercase tracking-wider px-6 py-3 rounded-sm w-full hover:bg-accent/90 flex items-center justify-center gap-2 disabled:opacity-50">
              {loading ? <><Loader2 className="h-5 w-5 animate-spin" /> Tracking...</> : <><Search className="h-5 w-5" /> Track Order</>}
            </button>
          </form>

          {error && (
            <div className="mt-6 glass-panel rounded-xl p-6 text-center">
              <p className="text-muted-foreground">{error}</p>
              {error.includes('log in') && (
                <Link to="/login" className="inline-block mt-4 text-accent font-bold uppercase tracking-wider text-sm">Go to Login</Link>
              )}
            </div>
          )}

          {result && (
            <div className="mt-6 glass-panel rounded-xl p-8">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Order</p>
                  <p className="font-black text-white text-lg">#{(result.order_number || result.id.slice(0, 8)).toUpperCase()}</p>
                </div>
                <span className="px-3 py-1 bg-accent text-white text-xs font-bold uppercase tracking-wider rounded-full">{result.status || 'Pending'}</span>
              </div>
              <div className="flex justify-between items-center">
                {STATUS_STEPS.map((step, i) => (
                  <div key={step.key} className="flex flex-col items-center flex-1 relative">
                    {i < STATUS_STEPS.length - 1 && (
                      <div className={`absolute top-5 left-1/2 w-full h-0.5 ${i <= statusIndex ? 'bg-accent' : 'bg-white/10'}`} />
                    )}
                    <div className={`relative z-10 h-10 w-10 rounded-full flex items-center justify-center border-2 ${i <= statusIndex ? 'bg-accent border-accent text-white' : 'bg-secondary border-white/10 text-muted-foreground'}`}>
                      <step.icon className="h-5 w-5" />
                    </div>
                    <span className={`text-xs mt-2 text-center ${i <= statusIndex ? 'text-white font-bold' : 'text-muted-foreground'}`}>{step.label}</span>
                  </div>
                ))}
              </div>
              {result.tracking_number && (
                <p className="mt-6 text-sm text-muted-foreground border-t border-white/10 pt-4">
                  Courier tracking number: <span className="text-white font-bold">{result.tracking_number}</span>
                </p>
              )}
              <p className="mt-2 text-xs text-muted-foreground">Placed on {new Date(result.created).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
            </div>
          )}
        </div>
      </Container>
    </>
  );
};

/* ---------------- Legal ---------------- */
const PRIVACY_CONTENT = (
  <>
    <p>STRONGBUILD ("we", "us", "our") operates strongbuild.shop and is committed to protecting your privacy. This Privacy Policy explains how we collect, use, store and protect your personal information when you visit our website or purchase our powerlifting equipment.</p>
    <p>Last updated: September 2026.</p>

    <h2 className="text-2xl font-bold text-white mt-8 mb-4">1. Information We Collect</h2>
    <p>We collect information you provide directly to us, such as your name, email address, phone number, shipping address and payment details when you create an account, place an order, subscribe to our newsletter, or contact our support team. We also automatically collect browsing data including IP address, browser type, pages visited and time spent on the site through cookies and similar technologies.</p>

    <h2 className="text-2xl font-bold text-white mt-8 mb-4">2. How We Use Your Information</h2>
    <ul className="list-disc list-inside space-y-2">
      <li>Processing and fulfilling your orders, including shipping and returns.</li>
      <li>Communicating with you about your orders, account and customer support enquiries.</li>
      <li>Sending marketing communications such as product drops and promotions, where you have opted in.</li>
      <li>Improving our website, products and services through analytics and feedback.</li>
      <li>Preventing fraud, unauthorised transactions and abuse of our platform.</li>
      <li>Complying with applicable Indian laws and regulations.</li>
    </ul>

    <h2 className="text-2xl font-bold text-white mt-8 mb-4">3. Cookies</h2>
    <p>We use cookies to remember your preferences, keep items in your shopping cart, and understand how you use our site. You can control cookies through your browser settings, but disabling them may affect site functionality such as checkout.</p>

    <h2 className="text-2xl font-bold text-white mt-8 mb-4">4. Sharing Your Information</h2>
    <p>We do not sell your personal information. We share data only with trusted service providers who help us run our business — payment processors (Razorpay), shipping couriers, and email delivery partners — under strict confidentiality obligations. We may disclose information when required by law or to protect our rights and safety.</p>

    <h2 className="text-2xl font-bold text-white mt-8 mb-4">5. Data Security</h2>
    <p>We use industry-standard security measures including SSL encryption to protect your personal information. Payment details are processed through PCI-DSS compliant gateways and are never stored on our servers. While we strive to protect your data, no method of transmission over the internet is completely secure.</p>

    <h2 className="text-2xl font-bold text-white mt-8 mb-4">6. Your Rights</h2>
    <p>You have the right to access, correct, update or delete your personal information. You may also opt out of marketing communications at any time using the unsubscribe link in our emails. To exercise these rights, contact us at support@strongbuild.shop.</p>

    <h2 className="text-2xl font-bold text-white mt-8 mb-4">7. Children's Privacy</h2>
    <p>Our website is not intended for individuals under the age of 18. We do not knowingly collect personal information from children. If you believe we have collected such data, please contact us so we can delete it.</p>

    <h2 className="text-2xl font-bold text-white mt-8 mb-4">8. Changes to This Policy</h2>
    <p>We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated revision date. We encourage you to review this policy periodically.</p>

    <h2 className="text-2xl font-bold text-white mt-8 mb-4">9. Contact Us</h2>
    <p>If you have any questions about this Privacy Policy, please contact us at:<br />
    STRONGBUILD<br />
    Email: support@strongbuild.shop<br />
    Phone: +91 8317339439<br />
    Pune, Maharashtra, India</p>
  </>
);

const TERMS_CONTENT = (
  <>
    <p>Welcome to STRONGBUILD. These Terms & Conditions govern your use of strongbuild.shop and the purchase of products from our store. By accessing our website or placing an order, you agree to these terms.</p>
    <p>Last updated: September 2026.</p>

    <h2 className="text-2xl font-bold text-white mt-8 mb-4">1. Use of Our Website</h2>
    <p>You agree to use our website only for lawful purposes and in a manner that does not infringe the rights of, or restrict the use of, this site by any third party. You must not misuse our site by knowingly introducing viruses, trojans or other malicious code, or attempting to gain unauthorised access to our systems.</p>

    <h2 className="text-2xl font-bold text-white mt-8 mb-4">2. Accounts</h2>
    <p>To place orders and access certain features, you may need to create an account. You are responsible for maintaining the confidentiality of your login credentials and for all activity under your account. You must be at least 18 years old to create an account and make purchases.</p>

    <h2 className="text-2xl font-bold text-white mt-8 mb-4">3. Products & Pricing</h2>
    <p>We strive to display our products and prices as accurately as possible. However, we do not warrant that product descriptions, imagery or pricing are entirely accurate, current or error-free. We reserve the right to correct errors and to change prices without notice. All products are subject to availability.</p>

    <h2 className="text-2xl font-bold text-white mt-8 mb-4">4. Orders</h2>
    <p>All orders are subject to acceptance and availability. We may decline or cancel an order at our discretion, in which case any payment made will be refunded in full. Once an order is confirmed, you will receive an email with your order number and tracking details once dispatched.</p>

    <h2 className="text-2xl font-bold text-white mt-8 mb-4">5. Payment</h2>
    <p>We accept payments via Razorpay, UPI, credit and debit cards, and cash on delivery (where eligible). Payment must be received in full before goods are dispatched, except for COD orders. Prices are listed in Indian Rupees (INR) and include applicable taxes unless stated otherwise.</p>

    <h2 className="text-2xl font-bold text-white mt-8 mb-4">6. Shipping</h2>
    <p>Orders are processed and dispatched within 1-2 business days. Delivery times are estimates and may vary by location. Please refer to our Shipping Policy for full details. STRONGBUILD is not liable for delays caused by couriers or events beyond our control.</p>

    <h2 className="text-2xl font-bold text-white mt-8 mb-4">7. Returns & Exchanges</h2>
    <p>Unused items in original packaging may be returned or exchanged within 30 days of delivery. Customised or final-sale items are non-returnable. Please refer to our Returns & Exchanges Policy for the full process and conditions.</p>

    <h2 className="text-2xl font-bold text-white mt-8 mb-4">8. Warranty</h2>
    <p>Our lever belts carry a 2-year warranty against stitching and hardware defects. Wrist wraps and straps carry a 6-month warranty against manufacturing defects. Warranty does not cover normal wear, misuse, or unauthorised modifications.</p>

    <h2 className="text-2xl font-bold text-white mt-8 mb-4">9. Intellectual Property</h2>
    <p>All content on this website — including text, graphics, logos, images and product designs — is the property of STRONGBUILD and protected under Indian and international intellectual property laws. You may not reproduce, distribute or use any content without our written permission.</p>

    <h2 className="text-2xl font-bold text-white mt-8 mb-4">10. Limitation of Liability</h2>
    <p>To the fullest extent permitted by law, STRONGBUILD shall not be liable for any indirect, incidental or consequential damages arising from your use of our website or products. Our total liability for any claim shall not exceed the amount you paid for the relevant order.</p>

    <h2 className="text-2xl font-bold text-white mt-8 mb-4">11. Governing Law</h2>
    <p>These Terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in Pune, Maharashtra, India.</p>

    <h2 className="text-2xl font-bold text-white mt-8 mb-4">12. Contact</h2>
    <p>For any questions about these Terms, please contact us at:<br />
    STRONGBUILD<br />
    Email: support@strongbuild.shop<br />
    Phone: +91 8317339439<br />
    Pune, Maharashtra, India</p>
  </>
);

export const LegalPage = ({ title }) => (
  <>
    <Helmet>
      <title>{title} - STRONGBUILD</title>
      <meta name="description" content={`${title} for STRONGBUILD, India's premium powerlifting gear brand.`} />
    </Helmet>
    <PageHeader title={title} />
    <Container>
      <div className="prose prose-invert max-w-none space-y-4">
        {title === 'Privacy Policy' ? PRIVACY_CONTENT : TERMS_CONTENT}
      </div>
    </Container>
  </>
);

export const AffiliateProgram = () => null;
export const AthleteSponsorshipPage = () => null;
