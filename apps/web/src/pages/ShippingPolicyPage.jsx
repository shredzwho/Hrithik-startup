import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Package, Globe, Clock, AlertTriangle, ChevronDown } from 'lucide-react';
import BreadcrumbNav from '@/components/BreadcrumbNav.jsx';

const AccordionItem = ({ title, content, isOpen, onClick }) => (
  <div className="border-b border-border">
    <button 
      onClick={onClick}
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

const ShippingPolicyPage = () => {
  const [openFaq, setOpenFaq] = useState(0);

  const faqs = [
    { q: "How quickly will my order ship?", a: "Most domestic orders are processed and shipped within 1-2 business days. During high-volume releases or sales, processing may take up to 4 business days." },
    { q: "Do you ship internationally?", a: "Yes, we ship globally. International delivery times vary by destination, typically taking 7-14 business days. Please note that customs duties and taxes are the responsibility of the recipient." },
    { q: "How can I track my order?", a: "Once your order ships, you will receive an email with a tracking number. You can also track your order directly on our Track Order page." },
    { q: "What happens if my package is lost?", a: "If your tracking shows as delivered but you haven't received it, please contact the carrier directly. If a package is confirmed lost in transit, contact our support team for a replacement." },
    { q: "Can I change my shipping address?", a: "Address changes can only be made within 1 hour of placing the order. Please contact our support team immediately if you need to update your details." },
    { q: "Do you ship to P.O. Boxes?", a: "Yes, standard shipping can be delivered to P.O. Boxes. However, express or overnight services require a physical address." }
  ];

  return (
    <>
      <Helmet>
        <title>Shipping & Delivery Policy | STRONGBUILD</title>
        <meta name="description" content="STRONGBUILD shipping policy — processing times, domestic and international delivery estimates, shipping rates, tracking and delivery requirements for powerlifting gear across India and worldwide." />
      </Helmet>
      
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-[#0f0f0f] to-[#050505] py-24 border-b border-white/10 pt-36">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="font-steelfish text-base uppercase tracking-widest text-brand-blue font-bold block mb-2">Priority Fulfilment</span>
          <h1 className="font-steelfish text-5xl md:text-7xl font-bold uppercase text-white mb-3 heading-balance">SHIPPING &amp; DISPATCH POLICY</h1>
          <p className="text-sm md:text-base text-white/70 max-w-2xl mx-auto font-sans">We process and dispatch gear with the same intensity you bring to the platform. Dispatched same-day from Pune.</p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <BreadcrumbNav items={[{ label: "Shipping Policy" }]} />

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="luxury-card p-8 rounded-xl flex flex-col items-start">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-6">
              <Clock className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-3">Processing Time</h3>
            <p className="text-muted-foreground">All orders require 1-2 business days for processing before they are handed off to our shipping partners. Orders placed after 4 PM IST on Friday will process the following Monday.</p>
          </div>
          
          <div className="luxury-card p-8 rounded-xl flex flex-col items-start">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-6">
              <Globe className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-3">International Orders</h3>
            <p className="text-muted-foreground">We ship worldwide. Please be aware that cross-border shipments may incur customs fees, import duties, or taxes, which are the buyer's responsibility.</p>
          </div>
        </div>

        {/* Shipping Rates Table */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-6 uppercase tracking-wider">Domestic Shipping Rates</h2>
          <div className="overflow-x-auto border border-border rounded-lg bg-card">
            <table className="premium-table">
              <thead>
                <tr>
                  <th>Shipping Method</th>
                  <th>Estimated Delivery</th>
                  <th>Cost</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="font-medium text-foreground">Standard Ground</td>
                  <td className="text-muted-foreground">5-7 Business Days</td>
                  <td className="text-foreground">₹99 (Free over ₹5000)</td>
                </tr>
                <tr>
                  <td className="font-medium text-foreground">Express Priority</td>
                  <td className="text-muted-foreground">2-3 Business Days</td>
                  <td className="text-foreground">₹299</td>
                </tr>
                <tr>
                  <td className="font-medium text-foreground">Overnight Air</td>
                  <td className="text-muted-foreground">Next Business Day (if ordered before 1PM)</td>
                  <td className="text-foreground">Calculated at Checkout</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Important Notices */}
        <div className="mb-16 space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4 uppercase tracking-wider">Delivery Requirements & Restrictions</h2>
            <div className="bg-muted p-6 border-l-4 border-primary text-muted-foreground space-y-4 rounded-r-lg">
              <p className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span><strong>Address Accuracy:</strong> Ensure your delivery address is 100% correct. We are not responsible for packages delivered to incorrect addresses provided by the customer.</span>
              </p>
              <p className="flex items-start gap-3">
                <Package className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span><strong>Failed Deliveries:</strong> If a package is returned to us due to multiple failed delivery attempts or an incorrect address, you will be responsible for the re-shipping fees.</span>
              </p>
            </div>
          </section>
        </div>

        {/* FAQs */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-6 uppercase tracking-wider">Shipping FAQ</h2>
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
    </>
  );
};

export default ShippingPolicyPage;