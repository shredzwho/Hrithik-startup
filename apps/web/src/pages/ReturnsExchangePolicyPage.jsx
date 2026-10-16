import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { RotateCcw, ShieldCheck, HelpCircle, Mail, ChevronDown } from 'lucide-react';
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

const ReturnsExchangePolicyPage = () => {
  const [openFaq, setOpenFaq] = useState(0);

  const faqs = [
    { q: "How long do I have to return an item?", a: "You have 30 days from the date of delivery to return or exchange unused items in their original condition and packaging." },
    { q: "Do I have to pay for return shipping?", a: "If you are returning an item due to a defect or our error, we cover the return shipping. For size exchanges or change of mind, the customer is responsible for return shipping costs." },
    { q: "How long does the refund process take?", a: "Once we receive and inspect your return, refunds are processed within 5-7 business days. It may take an additional 3-5 days for the funds to appear on your bank statement." },
    { q: "Can I return a custom embroidered belt?", a: "No. Custom orders, personalized items, and clearance/final sale products are non-returnable and non-refundable unless there is a manufacturing defect." },
    { q: "What if my gear breaks or arrives damaged?", a: "If your gear is damaged upon arrival or fails due to a defect, please contact us immediately at support@strongbuild.in with photos of the issue. We will initiate a warranty claim." },
    { q: "How do exchanges work?", a: "The fastest way to ensure you get what you want is to return the item you have, and once the return is accepted, make a separate purchase for the new item. Alternatively, contact support for a direct exchange process." },
    { q: "Can I return apparel that has been washed?", a: "No. Apparel must be unwashed, unworn, and have original tags attached to be eligible for a return." },
    { q: "What happens if my return is rejected?", a: "If an item is returned in unacceptable condition (e.g., chalk stains, sweat odors), we will reject the refund and ship the item back to you at your expense." }
  ];

  return (
    <>
      <Helmet>
        <title>Returns & Exchanges Policy | STRONGBUILD</title>
        <meta name="description" content="STRONGBUILD returns and exchanges — 30-day window on unused gear in original packaging, refund timelines, non-returnable items and the step-by-step return process for powerlifting equipment." />
      </Helmet>
      
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-[#0f0f0f] to-[#050505] py-24 border-b border-white/10 pt-36">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="font-steelfish text-base uppercase tracking-widest text-brand-blue font-bold block mb-2">Confidence Guarantee</span>
          <h1 className="font-steelfish text-5xl md:text-7xl font-bold uppercase text-white mb-3 heading-balance">RETURNS &amp; SIZING EXCHANGES</h1>
          <p className="text-sm md:text-base text-white/70 max-w-2xl mx-auto font-sans">We stand 100% behind our competition gear. If the belt or wrap size isn’t the right fit, we make it right.</p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <BreadcrumbNav items={[{ label: "Returns & Exchanges" }]} />

        {/* Policy Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="luxury-card border border-white/10 p-6 rounded-2xl text-center">
            <RotateCcw className="h-10 w-10 text-brand-blue mx-auto mb-4" />
            <h3 className="font-steelfish text-2xl font-bold text-white uppercase mb-1">30-Day Window</h3>
            <p className="text-xs text-white/60 font-sans">Exchange unused items within 30 days of delivery.</p>
          </div>
          <div className="luxury-card border border-white/10 p-6 rounded-2xl text-center">
            <ShieldCheck className="h-10 w-10 text-accent mx-auto mb-4" />
            <h3 className="font-steelfish text-2xl font-bold text-white uppercase mb-1">2-Year Warranty</h3>
            <p className="text-xs text-white/60 font-sans">Lever hardware and quad stitching coverage.</p>
          </div>
          <div className="luxury-card border border-white/10 p-6 rounded-2xl text-center">
            <Mail className="h-10 w-10 text-brand-blue mx-auto mb-4" />
            <h3 className="font-steelfish text-2xl font-bold text-white uppercase mb-1">Instant Support</h3>
            <p className="text-xs text-white/60 font-sans">Direct WhatsApp assistance for sizing swaps.</p>
          </div>
        </div>

        {/* Process Steps */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-8 uppercase tracking-wider">How to Return or Exchange</h2>
          <div className="space-y-8">
            <div className="flex gap-6">
              <div className="shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground font-black text-xl flex items-center justify-center">1</div>
              <div>
                <h3 className="text-xl font-bold text-foreground mb-2">Initiate the Request</h3>
                <p className="text-muted-foreground">Email us at support@strongbuild.in with your order number, the item(s) you wish to return, and the reason for return. If damaged, attach photos.</p>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground font-black text-xl flex items-center justify-center">2</div>
              <div>
                <h3 className="text-xl font-bold text-foreground mb-2">Pack the Gear</h3>
                <p className="text-muted-foreground">Securely pack the item(s) in their original packaging. Ensure all tags are attached. We recommend using a trackable shipping service.</p>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground font-black text-xl flex items-center justify-center">3</div>
              <div>
                <h3 className="text-xl font-bold text-foreground mb-2">Ship It Back</h3>
                <p className="text-muted-foreground">Mail the package to our returns facility using the instructions provided by our support team. Return shipping costs for sizing/preference issues are covered by the buyer.</p>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground font-black text-xl flex items-center justify-center">4</div>
              <div>
                <h3 className="text-xl font-bold text-foreground mb-2">Inspection & Refund</h3>
                <p className="text-muted-foreground">Once received, our team inspects the gear. If approved, we will issue a refund to your original payment method or dispatch your exchanged item within 5-7 business days.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Non-Returnable Items */}
        <div className="bg-muted p-8 rounded-xl border border-border mb-16">
          <h2 className="text-xl font-bold text-foreground mb-4 uppercase tracking-wider text-primary">Non-Returnable Items</h2>
          <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
            <li>Customized or embroidered belts</li>
            <li>Items marked as Final Sale or Clearance</li>
            <li>Apparel that has been washed, worn, or smells of sweat/cologne</li>
            <li>Gear with chalk marks, heavy wear, or scratches</li>
            <li>Gift cards</li>
          </ul>
        </div>

        {/* FAQs */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-6 uppercase tracking-wider">Returns FAQ</h2>
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

        {/* Contact Support */}
        <div className="text-center py-12 border-t border-border">
          <Mail className="h-10 w-10 text-accent mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-4">Still need help?</h2>
          <p className="text-muted-foreground mb-6">Our support team is ready to assist you with any return or exchange queries.</p>
          <a href="mailto:support@strongbuild.in" className="inline-block bg-primary hover:bg-primary/90 text-primary-foreground font-bold tracking-widest uppercase px-8 py-4 rounded-sm transition-all duration-300 active:scale-95">
            Contact Support
          </a>
        </div>

      </div>
    </>
  );
};

export default ReturnsExchangePolicyPage;