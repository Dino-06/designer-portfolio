import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowRight, Rss, Mail, Linkedin, Dribbble, Twitter } from 'lucide-react';

// --- SIMULATED PROJECT DATA (Replaces Headless CMS Fetch) ---
const allProjects = [
  {
    id: 'project-1',
    title: 'FlowState App: Meditation & Sleep',
    category: 'UI/UX Mobile App',
    year: '2024',
    heroImage: 'https://placehold.co/800x600/1e293b/f1f5f9?text=FlowState+Mobile+Hero',
    brief: 'A complete redesign of a mindfulness application focused on reducing friction in the daily tracking process and enhancing the visual language for a calm user experience.',
    process: [
      { type: 'heading', content: 'Challenge: Retention Rate' },
      { type: 'paragraph', content: 'The existing app suffered from high churn rates primarily due to an overwhelming onboarding process and a dated visual style that lacked emotional connection. Our goal was to simplify core user flows and establish a premium, minimal aesthetic.' },
      { type: 'image', url: 'https://placehold.co/800x400/334155/e2e8f0?text=UX+Wireframing+and+User+Flows', caption: 'Initial wireframes focusing on the daily check-in flow.' },
      { type: 'heading', content: 'Solution: Minimalist Design System' },
      { type: 'paragraph', content: 'I developed a soft, dark-mode-first design system using gentle curves and large, legible typography. The main navigation was simplified from five tabs to three, pushing secondary functions into accessible drawer menus.' },
    ],
    link: '#project-1',
    accentColor: 'bg-indigo-600',
  },
  {
    id: 'project-2',
    title: 'Evolve Agency: Corporate Rebrand',
    category: 'Visual Identity & Web Design',
    year: '2023',
    heroImage: 'https://placehold.co/800x450/475569/f8fafc?text=Evolve+Web+Design+Hero',
    brief: 'A full-scale digital and visual identity rebrand for a mid-sized marketing agency, focusing on establishing authority and modernity in their market segment.',
    process: [
      { type: 'heading', content: 'Core Deliverables' },
      { type: 'paragraph', content: 'This project included logo design, comprehensive brand guidelines, and a custom website design built on Webflow principles. The key was integrating dynamic content blocks that the client could easily update.' },
      { type: 'image', url: 'https://placehold.co/800x500/0f172a/94a3b8?text=Visual+Identity+Mockup+-+Style+Tile', caption: 'The finalized style tile, showcasing typography and color palette.' },
    ],
    link: '#project-2',
    accentColor: 'bg-green-600',
  },
  {
    id: 'project-3',
    title: 'Local Market: E-commerce Platform',
    category: 'UX Research & E-commerce UI',
    year: '2023',
    heroImage: 'https://placehold.co/800x550/1f2937/f3f4f6?text=Local+Market+E-commerce+UI',
    brief: 'Designing an accessible and localized e-commerce platform for farmers and local producers, optimizing checkout conversion for a diverse user base.',
    process: [
      { type: 'paragraph', content: 'A strong focus was placed on accessibility (WCAG AA) and mobile-first design due to the target demographic. User testing revealed critical friction points in the payment and delivery scheduling steps, which were subsequently streamlined.' },
      { type: 'image', url: 'https://placehold.co/800x400/78716c/fff7ed?text=Checkout+Flow+Optimization+Screens', caption: 'A/B testing results led to a simplified, three-step checkout process.' },
    ],
    link: '#project-3',
    accentColor: 'bg-yellow-600',
  },
  {
    id: 'project-4',
    title: 'Aero SaaS: Data Visualization',
    category: 'UI/UX Dashboard',
    year: '2023',
    heroImage: 'https://placehold.co/800x600/111827/d1d5db?text=Aero+SaaS+Dashboard+Hero',
    brief: 'Designing a complex SaaS dashboard for data visualization, focusing on clarity, speed, and customization for enterprise users.',
    process: [
      { type: 'paragraph', content: 'The primary challenge was managing information density without causing cognitive overload. We implemented a modular widget system and dark mode interface to reduce eye strain during long working hours.' }
    ],
    link: '#project-4',
    accentColor: 'bg-red-600',
  },
  {
    id: 'project-5',
    title: 'Venture Fund: Investor Portal',
    category: 'Web UX/UI',
    year: '2022',
    heroImage: 'https://placehold.co/800x450/4f46e5/ffffff?text=Venture+Portal+UX',
    brief: 'Creating a secure, high-end investor portal to manage fund performance, documents, and communication.',
    process: [
      { type: 'paragraph', content: 'Security and trust were paramount. The design utilized a highly structured layout with clean, authoritative typography and minimal colors to project confidence and stability.' }
    ],
    link: '#project-5',
    accentColor: 'bg-pink-600',
  },
];

// Utility Component for Section Layout
const Section = ({ id, children, className = '' }) => (
  <section id={id} className={`py-16 md:py-24 container mx-auto px-6 max-w-7xl ${className}`}>
    {children}
  </section>
);

// --- 1. Header & Navigation Component ---
const Header = ({ scrollToSection }) => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: 'Work', target: 'work' },
    { name: 'About', target: 'about' },
    { name: 'Contact', target: 'contact' },
  ];

  const handleNavClick = (target) => {
    scrollToSection(target);
    setIsOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="flex justify-between items-center py-4">
          <div className="text-2xl font-extrabold tracking-tight cursor-pointer" onClick={() => scrollToSection('hero')}>
            [Designer Name]
          </div>
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8 font-medium">
            {navItems.map(item => (
              <a 
                key={item.name}
                href={`#${item.target}`} 
                onClick={(e) => { e.preventDefault(); handleNavClick(item.target); }}
                className="text-gray-600 hover:text-indigo-600 transition duration-300 relative group"
              >
                {item.name}
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
              </a>
            ))}
          </nav>
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 text-gray-700 rounded-lg hover:bg-gray-100 transition"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle navigation menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      {/* Mobile Overlay Menu */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-white/95 backdrop-blur-lg pt-16">
          <nav className="flex flex-col items-center space-y-6 text-2xl font-semibold mt-10">
            {navItems.map(item => (
              <a 
                key={item.name}
                href={`#${item.target}`} 
                onClick={(e) => { e.preventDefault(); handleNavClick(item.target); }}
                className="text-gray-800 hover:text-indigo-600 transition duration-300"
              >
                {item.name}
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

// --- 2. Hero Component ---
const Hero = ({ scrollToSection }) => (
  <Section id="hero" className="min-h-[calc(100vh-6rem)] flex items-center justify-center text-center">
    <div className="max-w-4xl">
      <h1 className="text-6xl md:text-8xl font-black mb-6 leading-tight">
        Designing <span className="text-indigo-600">Intuitive</span> Digital Experiences.
      </h1>
      <p className="text-xl md:text-2xl text-gray-600 mb-10 font-light">
        I am a UX/UI Designer specializing in clean, human-centered interfaces that drive business goals and delight users. Let's build something impactful.
      </p>
      <button 
        onClick={() => scrollToSection('work')}
        className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-full shadow-xl text-white bg-indigo-600 hover:bg-indigo-700 transition duration-300 transform hover:scale-[1.02]"
      >
        View My Work <ArrowRight className="ml-2 h-5 w-5" />
      </button>
    </div>
  </Section>
);

// --- 3. Project Card Component ---
const ProjectCard = ({ project }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 ease-in-out cursor-pointer group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Project Image */}
      <img
        src={project.heroImage}
        alt={`${project.title} hero`}
        className={`w-full h-full object-cover transition-transform duration-500 ${isHovered ? 'scale-105 opacity-80' : 'scale-100'}`}
        // Fallback for image loading issues
        onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/800x600/6366f1/ffffff?text=Project+Mockup"; }}
      />
      {/* Overlay Content */}
      <a href={project.link} className="absolute inset-0 flex flex-col justify-end p-6 bg-gradient-to-t from-black/80 to-transparent transition-opacity duration-300">
        <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
          <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full text-white mb-2 ${project.accentColor || 'bg-indigo-600'}`}>
            {project.category}
          </span>
          <h3 className="text-2xl font-bold text-white mb-1 leading-snug">{project.title}</h3>
          <p className="text-gray-300 text-sm">{project.year}</p>
        </div>
      </a>
    </div>
  );
};

// --- 4. Work Section (Index) Component ---
const WorkSection = ({ scrollToSection }) => {
  // State to manage how many projects are currently visible
  const initialLimit = 4;
  const [visibleCount, setVisibleCount] = useState(initialLimit);
  
  // Projects to display (first 'visibleCount' number of them)
  const projectsToShow = allProjects.slice(0, visibleCount);
  
  // UI states
  const showMorePlaceholder = allProjects.length > initialLimit && visibleCount === initialLimit;
  const isExpanded = allProjects.length > initialLimit && visibleCount === allProjects.length;

  const handleShowMore = () => {
    setVisibleCount(allProjects.length);
  };
  
  const handleCollapse = () => {
    setVisibleCount(initialLimit);
    // Smoothly scroll back to the top of the work section for better UX
    scrollToSection('work'); 
  };

  return (
    <Section id="work">
      <h2 className="text-4xl md:text-5xl font-extrabold mb-12 text-center">Selected Work</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projectsToShow.map((project, index) => (
          <ProjectCard key={project.id} project={project} />
        ))}
        
        {/* The mock expansion card is only shown if we are showing the initial limit (4) and there are more projects */}
        {showMorePlaceholder && (
          <div 
            className="flex flex-col items-center justify-center p-8 rounded-xl border-4 border-dashed border-gray-300 text-gray-500 transition-colors duration-300 hover:border-indigo-400 hover:text-indigo-600 cursor-pointer"
            onClick={handleShowMore} // Clicking the placeholder also triggers 'Show More'
          >
            <Rss size={36} className="mb-3"/>
            <p className="text-lg font-semibold text-center">See More Projects</p>
            <p className="text-sm text-center">{allProjects.length - initialLimit} more pieces of work.</p>
          </div>
        )}
      </div>

      {/* Conditional 'Show More' / 'Show Less' Button */}
      {allProjects.length > initialLimit && (
        <div className="text-center mt-8">
          {!isExpanded ? (
            <button
              onClick={handleShowMore}
              className="inline-flex items-center justify-center px-6 py-3 border border-indigo-600 text-base font-medium rounded-full text-indigo-600 hover:bg-indigo-50 transition duration-300 shadow-md"
            >
              Show All {allProjects.length} Projects
            </button>
          ) : (
            <button
              onClick={handleCollapse}
              className="inline-flex items-center justify-center px-6 py-3 bg-indigo-600 border border-indigo-600 text-base font-medium rounded-full text-white hover:bg-indigo-700 transition duration-300 shadow-md"
            >
              Show Less
            </button>
          )}
        </div>
      )}
      
      <div className="text-center mt-16">
          <a 
            href="#contact" 
            onClick={(e) => { e.preventDefault(); scrollToSection('contact'); }}
            className="inline-flex items-center text-lg font-medium text-indigo-600 hover:text-indigo-800 transition group"
          >
              Have a project in mind? Let's talk.
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
          </a>
      </div>
    </Section>
  );
};

// --- 5. About Section Component ---
const AboutSection = () => (
  <Section id="about" className="bg-gray-50">
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
      {/* Profile/Summary */}
      <div className="lg:col-span-2">
        <h2 className="text-4xl md:text-5xl font-extrabold mb-8">Hello, I'm [Designer Name]</h2>
        <p className="text-lg text-gray-700 mb-6 leading-relaxed">
          I am a multidisciplinary designer with 8+ years of experience crafting digital products from concept to launch. My philosophy centers on **empathy and data-driven design**, ensuring every interface is not just beautiful, but highly functional and accessible.
        </p>
        <p className="text-lg text-gray-700 leading-relaxed">
          My expertise spans the full design lifecycle, from conducting **UX research** and mapping **user journeys** to creating high-fidelity **UI prototypes** and establishing scalable **design systems**. I thrive in fast-paced environments, collaborating closely with product managers and engineers to ship exceptional experiences.
        </p>
        <div className="mt-8">
            <h3 className="text-2xl font-bold mb-4">Core Skills</h3>
            <div className="flex flex-wrap gap-3">
                {['User Research', 'Wireframing', 'Prototyping (Figma/Sketch)', 'Design Systems', 'Mobile UI', 'Web UX', 'Interaction Design', 'Accessibility (WCAG)'].map(skill => (
                    <span key={skill} className="px-4 py-2 bg-white text-gray-800 border border-gray-200 rounded-full text-sm font-medium shadow-sm">
                        {skill}
                    </span>
                ))}
            </div>
        </div>
      </div>
      
      {/* Image/Bio Card */}
      <div className="lg:col-span-1 flex justify-center lg:justify-end">
        <div className="w-full max-w-sm bg-white p-6 rounded-xl shadow-2xl">
          <img
            src="https://placehold.co/400x400/1f2937/f3f4f6?text=Designer+Portrait"
            alt="Designer Portrait"
            className="w-full h-auto rounded-lg mb-4 object-cover"
            onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/400x400/1f2937/f3f4f6?text=Designer+Portrait"; }}
          />
          <p className="text-sm text-gray-500 italic">"Design is not just what it looks like and feels like. Design is how it works."</p>
        </div>
      </div>
    </div>
  </Section>
);

// --- 6. Contact Section Component ---
const ContactSection = () => (
  <Section id="contact">
    <div className="max-w-3xl mx-auto text-center">
      <h2 className="text-4xl md:text-5xl font-extrabold mb-4">Let's Connect</h2>
      <p className="text-xl text-gray-600 mb-10">
        I am currently open to new opportunities and collaborations. Whether you need a full-time lead designer or consultation on a challenging UX problem, drop me a line.
      </p>
      
      {/* Contact Link */}
      <a 
        href="mailto:hello@designername.com"
        className="inline-flex items-center justify-center px-10 py-4 border-2 border-indigo-600 text-lg font-semibold rounded-full text-indigo-600 hover:bg-indigo-50 transition duration-300 transform hover:scale-[1.02]"
      >
        <Mail className="mr-3 h-6 w-6" />
        hello@designername.com
      </a>
      
      {/* Social Links */}
      <div className="flex justify-center space-x-6 mt-12">
        {[
          { icon: Linkedin, href: '#', label: 'LinkedIn' },
          { icon: Dribbble, href: '#', label: 'Dribbble' },
          { icon: Twitter, href: '#', label: 'Twitter/X' },
        ].map(({ icon: Icon, href, label }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-indigo-600 transition duration-300 p-3 rounded-full hover:bg-indigo-50"
            aria-label={label}
          >
            <Icon size={24} />
          </a>
        ))}
      </div>
    </div>
  </Section>
);

// --- 7. Footer Component ---
const Footer = ({ scrollToSection }) => (
    <footer className="bg-gray-900 text-white">
        <div className="container mx-auto px-6 max-w-7xl py-12">
            <div className="flex flex-col md:flex-row justify-between items-center">
                <div className="text-xl font-bold mb-4 md:mb-0 cursor-pointer" onClick={() => scrollToSection('hero')}>
                    [Designer Name]
                </div>
                <div className="text-sm text-gray-400">
                    &copy; {new Date().getFullYear()} All rights reserved. | Designed for clarity and speed.
                </div>
                <div className="flex space-x-4 mt-4 md:mt-0">
                    {['Work', 'About', 'Contact'].map(name => (
                        <a 
                            key={name}
                            href={`#${name.toLowerCase()}`} 
                            onClick={(e) => { e.preventDefault(); scrollToSection(name.toLowerCase()); }}
                            className="text-sm text-gray-400 hover:text-indigo-400 transition"
                        >
                            {name}
                        </a>
                    ))}
                </div>
            </div>
        </div>
    </footer>
);

// --- MAIN APP COMPONENT ---
const App = () => {
  // Utility function to handle smooth scrolling
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    // Ensure the body has the default font applied
    document.body.className = 'font-sans antialiased text-gray-900';
  }, []);

  return (
    <div className="min-h-screen bg-white font-sans">
      
      <Header scrollToSection={scrollToSection} />
      <main>
        <Hero scrollToSection={scrollToSection} />
        <WorkSection scrollToSection={scrollToSection} />
        <AboutSection />
        <ContactSection />
      </main>
      <Footer scrollToSection={scrollToSection} />
    </div>
  );
};

export default App;