import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Medal, Image as ImageIcon, CheckCircle, Loader2 } from 'lucide-react';
import BreadcrumbNav from '@/components/BreadcrumbNav.jsx';
import pb from '@/lib/pocketbaseClient.js';
import { toast } from 'sonner';

const AthleteSponsorship = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [photos, setPhotos] = useState(null);

  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', age: '', location: '', sport: 'Powerlifting',
    competition_level: 'Local', squat_pr: '', bench_pr: '', deadlift_pr: '',
    instagram: '', youtube: '', tiktok: '', follower_count: '', bio: '',
    sponsorship_reason: '', equipment_used: '', achievements: '', terms_accepted: false
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) {
      toast.error("Maximum 5 files allowed");
      e.target.value = "";
      return;
    }
    const invalidFile = files.find(f => !['image/jpeg', 'image/png', 'image/webp'].includes(f.type));
    if (invalidFile) {
      toast.error("Only JPG, PNG and WEBP image formats are supported");
      e.target.value = "";
      return;
    }
    const oversizedFile = files.find(f => f.size > 5 * 1024 * 1024);
    if (oversizedFile) {
      toast.error("Each image must be 5MB or smaller");
      e.target.value = "";
      return;
    }
    setPhotos(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.terms_accepted) {
      toast.error("You must accept the terms and conditions.");
      return;
    }

    setLoading(true);
    try {
      const submissionData = new FormData();
      Object.keys(formData).forEach(key => {
        submissionData.append(key, formData[key]);
      });
      
      if (photos) {
        photos.forEach(file => {
          submissionData.append('photos', file);
        });
      }

      await pb.collection('athlete_sponsorship_applications').create(submissionData, { $autoCancel: false });
      
      setSuccess(true);
      toast.success("Application submitted successfully!");
      window.scrollTo(0, 0);
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit application. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4 pt-20">
        <div className="h-24 w-24 bg-primary/20 rounded-full flex items-center justify-center mb-6">
          <CheckCircle className="h-12 w-12 text-primary" />
        </div>
        <h1 className="text-4xl font-black text-foreground uppercase tracking-tight mb-4">Application Received</h1>
        <p className="text-xl text-muted-foreground max-w-lg mb-8">We have received your dossier. Our team reviews all applications carefully. Due to high volume, please allow 2-3 weeks for a response.</p>
        <button onClick={() => window.location.href = '/'} className="bg-primary text-primary-foreground font-bold px-8 py-4 rounded-sm tracking-wider uppercase hover:bg-primary/90 transition-colors">
          Return to Base
        </button>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Athlete Sponsorship | STRONGBUILD</title>
        <meta name="description" content="Apply to become a sponsored STRONGBUILD athlete. Active strength-sport competitors get free gear, affiliate codes, prototype access and co-branded content opportunities." />
      </Helmet>
      
      {/* Hero Section */}
      <section className="relative py-32 border-b border-border overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.hostinger.com/724a6abd-c130-44eb-b399-9334bee1447e.png" 
            alt="STRONGBUILD athlete locking out a heavy deadlift on the competition platform" 
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-16">
          <span className="font-steelfish text-base uppercase tracking-widest text-brand-blue font-bold block mb-2">Division Roster</span>
          <h1 className="font-steelfish text-5xl md:text-7xl font-bold uppercase text-white mb-3 heading-balance">JOIN THE STRONGBUILD ELITE</h1>
          <p className="text-sm md:text-base text-white/70 max-w-2xl mx-auto font-sans">We back powerlifters and athletes who compete on the platform. Apply to become a sponsored STRONGBUILD athlete.</p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <BreadcrumbNav items={[{ label: "Athlete Sponsorship" }]} />

        {/* Benefits & Requirements */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="luxury-card border border-white/10 p-8 rounded-2xl">
            <h3 className="font-steelfish text-3xl font-bold text-white uppercase tracking-wider mb-4">The Armory Allowance</h3>
            <ul className="space-y-4 text-white/70 font-sans text-sm">
              <li className="flex items-start gap-3"><Medal className="h-5 w-5 text-accent shrink-0" /> Monthly free competition gear allowance</li>
              <li className="flex items-start gap-3"><Medal className="h-5 w-5 text-brand-blue shrink-0" /> Custom affiliate discount codes for followers</li>
              <li className="flex items-start gap-3"><Medal className="h-5 w-5 text-accent shrink-0" /> Early prototype testing for unreleased gear</li>
              <li className="flex items-start gap-3"><Medal className="h-5 w-5 text-brand-blue shrink-0" /> National meet media features & photo coverage</li>
            </ul>
          </div>
          <div className="luxury-card border border-white/10 p-8 rounded-2xl">
            <h3 className="font-steelfish text-3xl font-bold text-white uppercase tracking-wider mb-4">Athlete Criteria</h3>
            <ul className="space-y-4 text-white/70 font-sans text-sm">
              <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-accent shrink-0" /> Active competitor in tested strength sports</li>
              <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-brand-blue shrink-0" /> Consistent training content & platform videos</li>
              <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-accent shrink-0" /> Alignment with Strength · Pride · Honour</li>
              <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-brand-blue shrink-0" /> Minimum 18 years of age</li>
            </ul>
          </div>
        </div>

        {/* Application Form */}
        <div className="luxury-card p-6 md:p-10 rounded-2xl border border-white/10">
          <h2 className="font-steelfish text-4xl font-bold uppercase text-white mb-8 text-center border-b border-white/10 pb-6">SPONSORSHIP APPLICATION</h2>
          
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Section: Personal Details */}
            <div>
              <h3 className="text-xl font-bold text-primary uppercase tracking-wider mb-4">Personal Intel</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-white/80 mb-2 uppercase">Full Name *</label>
                  <input type="text" name="name" required value={formData.name} onChange={handleInputChange} className="w-full p-3 rounded-sm border border-border focus:border-primary" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-white/80 mb-2 uppercase">Email *</label>
                  <input type="email" name="email" required value={formData.email} onChange={handleInputChange} className="w-full p-3 rounded-sm border border-border focus:border-primary" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-white/80 mb-2 uppercase">Phone</label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className="w-full p-3 rounded-sm border border-border focus:border-primary" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-white/80 mb-2 uppercase">Age</label>
                    <input type="number" name="age" value={formData.age} onChange={handleInputChange} className="w-full p-3 rounded-sm border border-border focus:border-primary" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-white/80 mb-2 uppercase">City/Country</label>
                    <input type="text" name="location" value={formData.location} onChange={handleInputChange} className="w-full p-3 rounded-sm border border-border focus:border-primary" />
                  </div>
                </div>
              </div>
            </div>

            {/* Section: Athletic Profile */}
            <div className="pt-6 border-t border-border">
              <h3 className="text-xl font-bold text-primary uppercase tracking-wider mb-4">Athletic Profile</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-bold text-white/80 mb-2 uppercase">Discipline *</label>
                  <select name="sport" required value={formData.sport} onChange={handleInputChange} className="w-full p-3 rounded-sm border border-border focus:border-primary">
                    <option>Powerlifting</option>
                    <option>Weightlifting</option>
                    <option>Strongman</option>
                    <option>Bodybuilding</option>
                    <option>CrossFit</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-white/80 mb-2 uppercase">Competition Level *</label>
                  <select name="competition_level" required value={formData.competition_level} onChange={handleInputChange} className="w-full p-3 rounded-sm border border-border focus:border-primary">
                    <option>Local / Regional</option>
                    <option>National</option>
                    <option>International / Elite</option>
                  </select>
                </div>
              </div>

              <label className="block text-sm font-bold text-white/80 mb-4 uppercase">Personal Records (Lbs/Kg)</label>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div>
                  <input type="text" name="squat_pr" placeholder="Squat" value={formData.squat_pr} onChange={handleInputChange} className="w-full p-3 rounded-sm border border-border focus:border-primary" />
                </div>
                <div>
                  <input type="text" name="bench_pr" placeholder="Bench" value={formData.bench_pr} onChange={handleInputChange} className="w-full p-3 rounded-sm border border-border focus:border-primary" />
                </div>
                <div>
                  <input type="text" name="deadlift_pr" placeholder="Deadlift" value={formData.deadlift_pr} onChange={handleInputChange} className="w-full p-3 rounded-sm border border-border focus:border-primary" />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-bold text-white/80 mb-2 uppercase">Major Achievements / Titles</label>
                <textarea name="achievements" rows="3" value={formData.achievements} onChange={handleInputChange} className="w-full p-3 rounded-sm border border-border focus:border-primary" placeholder="List your recent competition placements..."></textarea>
              </div>
            </div>

            {/* Section: Social & Brand */}
            <div className="pt-6 border-t border-border">
              <h3 className="text-xl font-bold text-primary uppercase tracking-wider mb-4">Media Presence</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-bold text-white/80 mb-2 uppercase">Instagram Handle</label>
                  <input type="text" name="instagram" placeholder="@username" value={formData.instagram} onChange={handleInputChange} className="w-full p-3 rounded-sm border border-border focus:border-primary" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-white/80 mb-2 uppercase">Total Followers (All Platforms)</label>
                  <input type="number" name="follower_count" placeholder="e.g. 15000" value={formData.follower_count} onChange={handleInputChange} className="w-full p-3 rounded-sm border border-border focus:border-primary" />
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-white/80 mb-2 uppercase">Bio / About You</label>
                  <textarea name="bio" rows="3" value={formData.bio} onChange={handleInputChange} className="w-full p-3 rounded-sm border border-border focus:border-primary" placeholder="Tell us your story..."></textarea>
                </div>
                <div>
                  <label className="block text-sm font-bold text-white/80 mb-2 uppercase">Why partner with STRONGBUILD?</label>
                  <textarea name="sponsorship_reason" rows="3" value={formData.sponsorship_reason} onChange={handleInputChange} className="w-full p-3 rounded-sm border border-border focus:border-primary" placeholder="What makes you a good fit for our brand?"></textarea>
                </div>
                <div>
                  <label className="block text-sm font-bold text-white/80 mb-2 uppercase">What gear are you currently using?</label>
                  <textarea name="equipment_used" rows="2" value={formData.equipment_used} onChange={handleInputChange} className="w-full p-3 rounded-sm border border-border focus:border-primary"></textarea>
                </div>
              </div>
            </div>

            {/* Section: Uploads */}
            <div className="pt-6 border-t border-border">
              <h3 className="text-xl font-bold text-primary uppercase tracking-wider mb-4">Media Uploads</h3>
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center bg-muted/50 hover:bg-muted transition-colors relative cursor-pointer group">
                <input type="file" multiple accept="image/jpeg,image/png,image/webp" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                <ImageIcon className="h-10 w-10 text-secondary mx-auto mb-3 group-hover:text-primary transition-colors" />
                <p className="text-foreground font-bold mb-1">Click to upload training photos</p>
                <p className="text-sm text-muted-foreground">Max 5 images (JPG, PNG, WEBP). Up to 5MB each.</p>
                {photos && photos.length > 0 && (
                  <div className="mt-4 text-sm text-primary font-bold">
                    {photos.length} file(s) selected
                  </div>
                )}
              </div>
            </div>

            <div className="pt-6 border-t border-border">
              <label className="flex items-start gap-3 cursor-pointer group">
                <div className="relative flex items-center justify-center mt-1">
                  <input type="checkbox" name="terms_accepted" required checked={formData.terms_accepted} onChange={handleInputChange} className="peer sr-only" />
                  <div className="w-5 h-5 border-2 border-secondary rounded-sm peer-checked:bg-primary peer-checked:border-primary transition-colors"></div>
                  <CheckCircle className="absolute text-white w-3 h-3 opacity-0 peer-checked:opacity-100 pointer-events-none" />
                </div>
                <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                  I confirm that all information provided is accurate. I understand that submitting this application does not guarantee sponsorship.
                </span>
              </label>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-black tracking-widest uppercase py-4 rounded-sm text-lg flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
            >
              {loading ? <><Loader2 className="h-6 w-6 animate-spin" /> Transmitting...</> : 'Submit Application'}
            </button>

          </form>
        </div>
      </div>
    </>
  );
};

export default AthleteSponsorship;