import React, { useState } from 'react';
import Overlay from '../Overlay';
import { useUi } from '../../context/UiContext';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SERVICE_DATA = {
  'Architectural Design': {
    tagline: 'Comprehensive architectural solutions from concept to construction.',
    overview: 'Our architectural design service encompasses the full spectrum of building creation. We begin with deep site analysis and conceptual sketches, evolving into detailed schematic designs and working drawings. Our approach ensures that every structure is both aesthetically striking and fundamentally sound, tailored perfectly to the client\'s vision and the site\'s context.',
    included: [
      'Site analysis', 'Concept sketches', 'Schematic design', 'Design development', 
      'Working drawings', '3D visualization', 'BOQ preparation', 'Project management'
    ],
    for: ['Solo Architect', 'Design Firm', 'Developer'],
    duration: '4–8 weeks',
    pricing: '₹ 45,000',
    faqs: [
      { q: 'How do you handle revisions?', a: 'We include up to three major revision cycles during the schematic design phase to ensure alignment with your vision.' },
      { q: 'Do you assist with local permits?', a: 'Yes, our team prepares all necessary drawings and documentation required for local municipal approvals.' },
      { q: 'Can you work with my contractor?', a: 'Absolutely. We provide comprehensive working drawings and coordinate closely with contractors to ensure design fidelity.' }
    ]
  },
  'Interior Architecture': {
    tagline: 'Crafting spaces that harmonize function with aesthetic brilliance.',
    overview: 'We focus on the volumetric experience of interior spaces. This service goes beyond surface decoration to address space planning, lighting design, and custom millwork. We create interior environments that are intuitive, inspiring, and perfectly aligned with the overall architectural intent.',
    included: [
      'Space planning', 'Furniture layout', 'Material boards', 'Lighting design', 
      'Custom millwork drawings', '3D renders', 'Site supervision guidelines', 'FF&E schedule'
    ],
    for: ['Home Owner', 'Interior Firm', 'Hospitality'],
    duration: '3–6 weeks',
    pricing: '₹ 30,000',
    faqs: [
      { q: 'Do you procure furniture?', a: 'We provide an FF&E schedule with specific recommendations, but procurement is handled separately or by the client.' },
      { q: 'How detailed are the millwork drawings?', a: 'Our custom millwork drawings are construction-ready, detailing joints, materials, and hardware specifications.' },
      { q: 'Can you work within an existing structure?', a: 'Yes, adaptive reuse and interior renovations are a core part of our interior architecture practice.' }
    ]
  },
  'Urban & Master Planning': {
    tagline: 'Designing sustainable and thriving communities at scale.',
    overview: 'Our urban planning service addresses the complex challenges of large-scale development. We analyze land use, zoning, and environmental impact to create comprehensive master plans. Our goal is to design circulation networks and community spaces that foster connectivity and resilience.',
    included: [
      'Land-use analysis', 'Zoning compliance', 'Master plan drawings', 'Circulation design', 
      'Environmental impact notes', 'Community mapping', 'Regulatory submissions', 'Phasing plan'
    ],
    for: ['Government', 'Developer', 'Planning Firm'],
    duration: '10–16 weeks',
    pricing: '₹ 1,50,000',
    faqs: [
      { q: 'What scale of projects do you handle?', a: 'We handle everything from campus master plans (5-10 acres) to large-scale township developments (100+ acres).' },
      { q: 'Do you conduct environmental studies?', a: 'We prepare preliminary environmental impact notes and coordinate with specialized consultants for full EIA reports.' },
      { q: 'How do you approach community engagement?', a: 'We incorporate community mapping and stakeholder workshops to ensure our plans reflect local needs.' }
    ]
  },
  'Digital Repository Access': {
    tagline: 'Your private, version-controlled architecture workspace.',
    overview: 'Unlock the full power of ArcHive with premium repository access. This service provides professional-grade tools for studios and individuals to manage architectural assets. Enjoy unlimited uploads, robust version control, and private collaboration spaces tailored for design workflows.',
    included: [
      'Unlimited project uploads', 'Version control (patch/minor/major)', 'Private repositories', 'Collaboration tools', 
      'Analytics dashboard', 'Export & download', 'Custom profile branding', 'Priority support'
    ],
    for: ['Student', 'Professional', 'Studio'],
    duration: 'Instant setup',
    pricing: '₹ 4,999/yr',
    faqs: [
      { q: 'Is there a limit on file sizes?', a: 'Repository access allows individual file uploads up to 500MB, accommodating large BIM and CAD models.' },
      { q: 'Can I invite external collaborators?', a: 'Yes, you can invite clients or external consultants to view specific private repositories with granular permissions.' },
      { q: 'How does version control work for CAD files?', a: 'We track distinct versions of your files, allowing you to rollback or branch designs just like code repositories.' }
    ]
  },
  'Structural Review': {
    tagline: 'Rigorous peer review for structural integrity and efficiency.',
    overview: 'Ensure your designs meet the highest standards of safety and efficiency. Our structural review service provides an independent analysis of load calculations, code compliance, and material usage. We offer actionable recommendations to optimize your structural systems without compromising design intent.',
    included: [
      'Structural load analysis', 'Code compliance check', 'Peer review report', 'Recommendations document', 
      'Revision comments', 'Digital stamp (where applicable)', 'Material efficiency review'
    ],
    for: ['Architect', 'Engineer', 'Developer'],
    duration: '2–4 weeks',
    pricing: '₹ 25,000',
    faqs: [
      { q: 'Do you provide a stamped certificate?', a: 'Where applicable by local jurisdiction and upon full compliance, our licensed engineers can provide a digital stamp.' },
      { q: 'Will this delay my project timeline?', a: 'Our review happens concurrently with final design detailing, minimizing impact on your overall schedule.' },
      { q: 'Can you suggest cost-saving alternatives?', a: 'Yes, our material efficiency review specifically looks for ways to optimize structural systems to reduce costs.' }
    ]
  },
  'Portfolio Studio': {
    tagline: 'Elevate your professional presence with a curated digital portfolio.',
    overview: 'Stand out in the architecture community with our Portfolio Studio service. We help you curate, design, and optimize your project pages on ArcHive. From custom cover image editing to SEO optimization, we ensure your work is presented flawlessly to potential clients and employers.',
    included: [
      'Curated project page design', 'Custom cover image editing', 'Tags & metadata', 'ArcHive profile branding', 
      'SEO optimization', 'Analytics access', 'Social share kit', 'Featured listing consideration'
    ],
    for: ['Student', 'Professional', 'Freelancer'],
    duration: '1–2 weeks',
    pricing: '₹ 15,000',
    faqs: [
      { q: 'Do I need to provide all the images?', a: 'You provide the raw project assets, and our team will edit, crop, and sequence them for maximum impact.' },
      { q: 'Will this help me get clients?', a: 'A polished portfolio significantly improves conversion rates, and the included SEO optimization helps you rank higher in searches.' },
      { q: 'Can I update the portfolio later?', a: 'Yes, you retain full control over your profile and can add or modify projects at any time after the initial curation.' }
    ]
  }
};

export default function ServiceOverlay() {
  const { activeServiceOverlay, closeService, openConsultation } = useUi();
  const navigate = useNavigate();
  const [activeFaq, setActiveFaq] = useState(null);

  const data = activeServiceOverlay ? SERVICE_DATA[activeServiceOverlay] : null;

  if (!data) return null;

  return (
    <Overlay isOpen={!!activeServiceOverlay} onClose={closeService} maxWidth="680px">
      <div className="p-[40px] px-[44px]">
        {/* Header */}
        <div className="mb-8">
          <div className="font-mono text-[11px] text-accent-gold uppercase tracking-wider mb-2">Service Category</div>
          <h2 className="font-serif text-[30px] text-[#1A1A1A] leading-tight mb-2">{activeServiceOverlay}</h2>
          <div className="font-sans italic text-[15px] text-text-muted">{data.tagline}</div>
          <div className="w-[40px] h-[2px] bg-accent-gold mt-6" />
        </div>

        {/* Overview */}
        <p className="font-sans text-[15px] leading-[1.8] text-[#1A1A1A] mb-10">
          {data.overview}
        </p>

        {/* What's Included */}
        <div className="mb-10">
          <h3 className="font-mono text-[11px] text-accent-gold uppercase tracking-wider mb-4">What's Included</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-8">
            {data.included.map((item, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="text-accent-gold text-[10px] mt-1 flex-shrink-0">⬡</span>
                <span className="font-sans text-[14px] text-[#1A1A1A]">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Who It's For */}
        <div className="mb-10">
          <h3 className="font-mono text-[11px] text-accent-gold uppercase tracking-wider mb-4">Who It's For</h3>
          <div className="flex flex-wrap gap-3">
            {data.for.map((persona, i) => (
              <div key={i} className="border border-accent-gold rounded-full px-4 py-1.5 font-sans text-[13px] text-[#1A1A1A]">
                {persona}
              </div>
            ))}
          </div>
        </div>

        {/* Process Snapshot */}
        <div className="mb-10">
          <h3 className="font-mono text-[11px] text-accent-gold uppercase tracking-wider mb-4">Process Snapshot</h3>
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {['Discovery', 'Development', 'Delivery'].map((step, i) => (
              <React.Fragment key={step}>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-accent-gold text-[12px]">⬡</span>
                  <span className="font-mono text-[12px] text-[#1A1A1A]">{step}</span>
                </div>
                {i < 2 && <span className="text-text-muted mx-2 flex-shrink-0">→</span>}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Timeline & Pricing */}
        <div className="mb-10 bg-accent-gold/5 border border-accent-gold/20 rounded-xl p-6 flex flex-col md:flex-row gap-6 md:gap-12">
          <div>
            <div className="font-mono text-[11px] text-text-muted uppercase tracking-wider mb-1">Typical Duration</div>
            <div className="font-serif text-[24px] text-accent-gold">{data.duration}</div>
          </div>
          <div>
            <div className="font-mono text-[11px] text-text-muted uppercase tracking-wider mb-1">Starting From</div>
            <div className="font-serif text-[24px] text-accent-gold">{data.pricing}</div>
          </div>
          <div className="md:ml-auto self-end text-[11px] text-text-muted font-sans">
            *Pricing varies by scope. Contact for a quote.
          </div>
        </div>

        {/* FAQ Accordion */}
        <div className="mb-12">
          <h3 className="font-mono text-[11px] text-accent-gold uppercase tracking-wider mb-4">Common Questions</h3>
          <div className="flex flex-col gap-2">
            {data.faqs.map((faq, i) => {
              const isActive = activeFaq === i;
              return (
                <div key={i} className={`border border-border-light rounded-lg overflow-hidden transition-all duration-300 ${isActive ? 'border-l-2 border-l-accent-gold' : ''}`}>
                  <button
                    onClick={() => setActiveFaq(isActive ? null : i)}
                    className="w-full flex items-center justify-between p-4 text-left bg-white hover:bg-accent-gold/5 transition-colors"
                  >
                    <span className={`font-sans text-[14px] font-medium transition-colors ${isActive ? 'text-accent-gold' : 'text-[#1A1A1A]'}`}>
                      {faq.q}
                    </span>
                    {isActive ? <ChevronUp className="w-4 h-4 text-accent-gold" /> : <ChevronDown className="w-4 h-4 text-text-muted" />}
                  </button>
                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="px-4 pb-4 font-sans text-[14px] text-text-muted leading-[1.7]">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA Row */}
        <div className="sticky bottom-0 bg-white pt-4 border-t border-border-light flex flex-col sm:flex-row gap-4 mt-auto">
          <button
            onClick={() => {
              closeService();
              openConsultation();
            }}
            className="flex-1 bg-accent-gold text-bg-dark h-12 rounded font-sans font-medium hover:bg-accent-gold-hover transition-colors flex items-center justify-center gap-2"
          >
            Book a Free Consultation <span>→</span>
          </button>
          <button
            onClick={() => {
              closeService();
              navigate(`/projects?filter=${activeServiceOverlay}`);
            }}
            className="flex-1 border border-accent-gold text-accent-gold h-12 rounded font-sans font-medium hover:bg-accent-gold/5 transition-colors flex items-center justify-center gap-2"
          >
            View Related Projects <span>↗</span>
          </button>
        </div>
      </div>
    </Overlay>
  );
}
