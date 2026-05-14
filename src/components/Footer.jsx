import React from 'react';
import { Hexagon, Globe, MessageCircle, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="relative bg-bg-dark text-bg-primary pt-20 pb-8 border-t-[1px] border-accent-gold overflow-hidden">
      {/* Dense Hex Grid Pattern at 4% opacity */}
      <div 
        className="absolute inset-0 opacity-[0.04] pointer-events-none" 
        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'30\' height=\'51.96\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M15 0L30 8.66V25.98L15 34.64L0 25.98V8.66L15 0ZM15 51.96L30 43.3V25.98L15 34.64L0 43.3V51.96Z\' fill=\'none\' stroke=\'%23F5F3EF\' stroke-width=\'1\'/%3E%3C/svg%3E")' }}
      ></div>
      
      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Col */}
          <div className="flex flex-col">
            <Link to="/" className="flex items-center group mb-6">
              <span className="font-serif text-3xl font-bold tracking-wide flex items-center">
                <Hexagon className="w-8 h-8 text-accent-gold mr-1 group-hover:scale-110 transition-transform duration-500" strokeWidth={1.5} />
                rcHive
              </span>
            </Link>
            <p className="font-editorial text-text-muted text-lg mb-6">
              "Where Structure Meets Vision"
            </p>
            <p className="font-sans text-sm text-text-muted">
              Designing spaces that define tomorrow through precision and human experience.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif text-lg mb-6 text-surface">Explore</h4>
            <ul className="space-y-4">
              {[
                { name: 'Home', path: '/' },
                { name: 'Projects', path: '/projects' },
                { name: 'Services', path: '/services' },
                { name: 'Repository', path: '/repository' },
                { name: 'Studio', path: '/studio' },
                { name: 'About', path: '/about' }
              ].map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="font-sans text-sm text-text-muted hover:text-accent-gold transition-colors inline-block relative group">
                    {link.name}
                    <span className="absolute -bottom-1 left-0 h-[1px] w-0 bg-accent-gold transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-serif text-lg mb-6 text-surface">Expertise</h4>
            <ul className="space-y-4">
              {[
                { name: 'Residential Design', cat: 'Residential' },
                { name: 'Commercial Architecture', cat: 'Commercial' },
                { name: 'Urban Planning', cat: 'Urban Planning' },
                { name: 'Interior Design', cat: 'Interior' },
                { name: 'Heritage Restoration', cat: 'Heritage' }
              ].map((service) => (
                <li key={service.name}>
                  <Link 
                    to="/projects" 
                    state={{ category: service.cat }}
                    className="font-sans text-sm text-text-muted hover:text-accent-gold transition-colors inline-block relative group"
                  >
                    {service.name}
                    <span className="absolute -bottom-1 left-0 h-[1px] w-0 bg-accent-gold transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact / Newsletter */}
          <div>
            <h4 className="font-serif text-lg mb-6 text-surface">Stay Connected</h4>
            <form className="mb-8 relative group">
              <div className="relative">
                <input 
                  type="email" 
                  id="newsletter"
                  placeholder=" "
                  className="block w-full bg-transparent border-b border-text-muted py-3 text-sm focus:outline-none focus:border-accent-gold transition-colors peer text-bg-primary"
                />
                <label 
                  htmlFor="newsletter" 
                  className="absolute left-0 top-3 text-sm text-text-muted transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-3 peer-focus:-top-4 peer-focus:text-xs peer-focus:text-accent-gold"
                >
                  Email Address
                </label>
              </div>
              <button 
                type="button"
                className="absolute right-0 bottom-3 text-accent-gold hover:text-bg-primary transition-colors font-mono text-xs uppercase tracking-widest"
              >
                Subscribe
              </button>
            </form>
            
            <div className="flex space-x-4">
              <a href="#" className="p-2 border border-text-muted rounded-full hover:border-accent-gold hover:text-accent-gold transition-colors"><Globe className="w-4 h-4" /></a>
              <a href="#" className="p-2 border border-text-muted rounded-full hover:border-accent-gold hover:text-accent-gold transition-colors"><MessageCircle className="w-4 h-4" /></a>
              <a href="#" className="p-2 border border-text-muted rounded-full hover:border-accent-gold hover:text-accent-gold transition-colors"><Mail className="w-4 h-4" /></a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-text-muted/20 flex flex-col md:flex-row justify-between items-center">
          <p className="font-mono text-xs text-text-muted uppercase tracking-widest mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} ArcHive Repository. Established in 2026. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <Link to="/privacy" className="font-mono text-xs text-text-muted uppercase tracking-widest hover:text-accent-gold transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="font-mono text-xs text-text-muted uppercase tracking-widest hover:text-accent-gold transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
