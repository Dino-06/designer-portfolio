function App() {
  const [count, setCount] = useState(0)
  
import './App.css'
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Menu, X, ArrowRight, Rss, Mail, Linkedin, Dribbble, Twitter, ArrowLeft } from 'lucide-react';

// --- SIMULATED PROJECT DATA (Replaces Headless CMS Fetch) ---
const allProjects = [
  {
    id: 'project-1',
    title: 'FlowState App: Meditation & Sleep',
    category: 'UI/UX Mobile App',
    year: '2024',
    heroImage: 'https://placehold.co/800x600/1e293b/f1f5f9?text=FlowState+Mobile+Hero',
    accentColor: 'bg-indigo-600', 
    caseStudy: {
      client: 'FlowState Wellness',
      role: 'Lead UX/UI Designer',
      duration: '4 Months',
      brief: 'A complete redesign of a mindfulness application focused on reducing friction in the daily tracking process and enhancing the visual language for a calm user experience.',
      sections: [
        { id: 'problem', title: '01. The Problem & Goal', content: 'The existing app suffered from high churn rates (35% after the first week) primarily due to an overwhelming onboarding process and a dated visual style that lacked emotional connection. The core goal was to simplify the daily tracking routine to increase retention and daily active usage (DAU) by 20%.', media: 'https://placehold.co/1200x600/334155/e2e8f0?text=UX+Wireframing+and+User+Flows' },
        { id: 'research', title: '02. User Research & Flows', content: 'We conducted qualitative interviews with 20 active users and built new user flow maps, finding that the key moment of friction was choosing a guided session. The initial step was consolidating decision points and creating an intuitive "Quick Start" button.' },
        { id: 'wireframe', title: '03. Wireframing & Prototyping', content: 'Initial low-fidelity wireframes focused solely on the critical path: open app -> start session -> end session. This phase was all about functionality, leading to a simplified main navigation with only three primary tabs: Home, Sessions, and Profile.', media: 'https://placehold.co/1200x800/52525b/d4d4d8?text=Simplified+Navigation+Mockup' },
        { id: 'visual', title: '04. Visual Design & System', content: 'I developed a soft, dark-mode-first design system using gentle curves and large, legible typography (Figtree). The visual style was minimal, using subtle gradients to create depth without distraction. This premium aesthetic was designed to evoke calm and focus.', media: 'https://placehold.co/1200x700/6366f1/ffffff?text=FlowState+Final+UI+Mockups' },
        { id: 'outcome', title: '05. Outcome & Impact', content: 'Post-launch, the simplified flows reduced churn to 15% in the first week. DAU increased by 25% within the first month. The premium visual language also supported a price increase for the subscription tiers.' },
      ],
    }
  },
  {
    id: 'project-2',
    title: 'Evolve Agency: Corporate Rebrand',
    category: 'Visual Identity & Web Design',
    year: '2023',
    heroImage: 'https://placehold.co/800x450/475569/f8fafc?text=Evolve+Web+Design+Hero',
    accentColor: 'bg-green-600',
    caseStudy: {
        client: 'Evolve Marketing', role: 'Visual Designer', duration: '2 Months',
        brief: 'A full-scale digital and visual identity rebrand for a marketing agency, establishing authority and modernity in their segment.',
        sections: [
            { id: 'problem', title: '01. The Dated Brand', content: 'The old brand identity felt stale and didn\'t convey the agency\'s cutting-edge work. The goal was to create a modular, adaptable visual system that works across digital and print.' },
            { id: 'strategy', title: '02. Color & Typography Strategy', content: 'We moved to a deep navy and forest green palette to evoke trust and growth, paired with a sharp, geometric sans-serif font for professionalism. The website design focused on bold, asymmetrical content blocks.', media: 'https://placehold.co/1200x700/065f46/d1fae5?text=Brand+Identity+Guide+Cover' },
            { id: 'deliverables', title: '03. Key Deliverables', content: 'Delivered: comprehensive brand guidelines, custom SVG logos for light/dark modes, and a responsive website template using a grid system that adapts perfectly across all devices.', media: 'https://placehold.co/1200x600/1c1917/f5f5f4?text=Evolve+Website+Homepage+Layout' }
        ],
    }
  },
  {
    id: 'project-3',
    title: 'Local Market: E-commerce Platform',
    category: 'UX Research & E-commerce UI',
    year: '2023',
    heroImage: 'https://placehold.co/800x550/1f2937/f3f4f6?text=Local+Market+E-commerce+UI',
    accentColor: 'bg-yellow-600',
    caseStudy: {
        client: 'Farm-to-Table Collective', role: 'UX Consultant', duration: '3 Months',
        brief: 'Designing an accessible and localized e-commerce platform for farmers and local producers, optimizing checkout conversion for a diverse user base.',
        sections: [
            { id: 'problem', title: '01. Accessibility Challenge', content: 'A strong focus was placed on WCAG AA compliance and a mobile-first approach due to the target demographic. Early user testing revealed critical friction points in the payment and delivery scheduling steps.', media: 'https://placehold.co/1200x500/78716c/fff7ed?text=User+Testing+Findings+Chart' },
            { id: 'solution', title: '02. Streamlined Checkout', content: 'The solution was a simplified, three-step checkout process with large, clear button states and strong input validation. We also introduced a clear "local delivery map" visual to manage user expectations.', media: 'https://placehold.co/1200x700/f59e0b/000000?text=Mobile+Checkout+Flow+Optimization' }
        ],
    }
  },
  { 
    id: 'project-4', 
    title: 'Aero SaaS: Data Visualization', 
    category: 'UI/UX Dashboard', 
    year: '2023', 
    heroImage: 'https://placehold.co/800x600/111827/d1d5db?text=Aero+SaaS+Dashboard+Hero', 
    accentColor: 'bg-red-600', 
    caseStudy: { 
      client: 'Aero Dynamics', 
      role: 'UI Lead', 
      duration: '5 Months',
      brief: 'Designing a complex SaaS dashboard for data visualization, focusing on clarity, speed, and customization for enterprise users.',
      sections: [
        { id: 'challenge', title: '01. Data Density Challenge', content: 'The primary challenge was managing information density without causing cognitive overload. We implemented a modular widget system and dark mode interface to reduce eye strain during long working hours.', media: 'https://placehold.co/1200x800/dc2626/fef2f2?text=SaaS+Dashboard+Dark+Mode+View' },
        { id: 'outcome', title: '02. Results', content: 'The new dashboard reduced error reporting time by 30% and improved user satisfaction scores by 15%.' }
      ],
    }
  },
  { 
    id: 'project-5', 
    title: 'Venture Fund: Investor Portal', 
    category: 'Web UX/UI', 
    year: '2022', 
    heroImage: 'https://placehold.co/800x450/4f46e5/ffffff?text=Venture+Portal+UX', 
    accentColor: 'bg-pink-600', 
    caseStudy: { 
      client: 'Ascend Capital', 
      role: 'UX Designer', 
      duration: '3 Months',
      brief: 'Creating a secure, high-end investor portal to manage fund performance, documents, and communication.',
      sections: [
        { id: 'security', title: '01. Security & Trust', content: 'Security and trust were paramount. The design utilized a highly structured layout with clean, authoritative typography and minimal colors to project confidence and stability.', media: 'https://placehold.co/1200x600/be185d/fce7f3?text=Investor+Portal+Security+Features' },
        { id: 'documents', title: '02. Document Management', content: 'A key feature was a highly secure, filtered document library for quarterly reports and legal documents.' }
      ],
    }
  },
  // --- NEW SOCIAL MEDIA PROJECTS ---
  { 
    id: 'project-6', 
    title: 'Aura Campaign: Lifestyle Visuals', 
    category: 'Social Media Design', 
    year: '2024', 
    heroImage: 'https://placehold.co/800x600/a855f7/f3e8ff?text=Social+Campaign+Visuals', 
    accentColor: 'bg-purple-600', 
    caseStudy: { 
      client: 'Aura Fitness', 
      role: 'Visual Design Lead', 
      duration: '1 Month',
      brief: 'Development of a fresh, dynamic visual language for a 30-day Instagram campaign focused on wellness and hydration, designed to increase engagement and drive sign-ups.',
      sections: [
        { id: 'goal', title: '01. Campaign Goals & Aesthetics', content: 'The primary goal was a 50% increase in post saves and shares. We defined a soft, ethereal aesthetic using pastel gradients and clean, minimal typography, moving away from standard stock imagery.', media: 'https://placehold.co/1200x700/7c3aed/f3e8ff?text=Instagram+Feed+Mockup+-+Aura+Campaign' },
        { id: 'templates', title: '02. Template System Design', content: 'Created 15 reusable, responsive templates (stories, reels covers, static posts) optimized for high readability on small screens. The templates were designed in Figma for easy hand-off to the content team.', media: 'https://placehold.co/1200x600/9333ea/ffffff?text=Responsive+Story+Templates+Showcase' },
        { id: 'results', title: '03. Campaign Performance', content: 'The campaign successfully exceeded goals, achieving a 75% increase in post saves and a 15% lift in subscription conversions directly attributable to social media channels.' }
      ],
    }
  },
  { 
    id: 'project-7', 
    title: 'QuickPost Templates: B2B Focus', 
    category: 'Content Design System', 
    year: '2023', 
    heroImage: 'https://placehold.co/800x600/15803d/dcfce7?text=B2B+LinkedIn+Templates', 
    accentColor: 'bg-emerald-700', 
    caseStudy: { 
      client: 'QuickPost SaaS', 
      role: 'UX/Content Designer', 
      duration: '6 Weeks',
      brief: 'Designing a modular template system for LinkedIn and Twitter aimed at accelerating content creation for a B2B SaaS marketing team while maintaining brand consistency.',
      sections: [
        { id: 'challenge', title: '01. Speed and Consistency', content: 'The marketing team struggled with slow content turnaround and inconsistent visual branding across channels. The objective was to design a system that allowed non-designers to produce branded content in under 5 minutes.', media: 'https://placehold.co/1200x500/059669/d1fae5?text=Modular+Template+Breakdown' },
        { id: 'system', title: '02. Modular Template Creation', content: 'I created a library of 10 modular components (Quote Blocks, Data Insights, Event Promos) with clear rules on color usage, typography scale, and image placement, all contained within a single Figma library.' },
        { id: 'training', title: '03. Documentation & Training', content: 'Provided comprehensive video and written documentation for template usage, dramatically reducing design review time and improving content velocity.', media: 'https://placehold.co/1200x700/10b981/000000?text=LinkedIn+Template+Visual+Example' }
      ],
    }
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
const ProjectCard = ({ project, openCaseStudy }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 ease-in-out cursor-pointer group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      // Set an ID based on the project ID so we can scroll to it later
      id={`project-card-${project.id}`} 
      onClick={() => openCaseStudy(project.id)}
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
      <div className="absolute inset-0 flex flex-col justify-end p-6 bg-gradient-to-t from-black/80 to-transparent transition-opacity duration-300">
        <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
          <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full text-white mb-2 ${project.accentColor || 'bg-indigo-600'}`}>
            {project.category}
          </span>
          <h3 className="text-2xl font-bold text-white mb-1 leading-snug">{project.title}</h3>
          <p className="text-gray-300 text-sm">{project.year}</p>
        </div>
      </div>
    </div>
  );
};

// --- 4. Work Section (Index) Component ---
const WorkSection = ({ scrollToSection, openCaseStudy }) => {
  const initialLimit = 4;
  const [visibleCount, setVisibleCount] = useState(initialLimit);
  
  const projectsToShow = allProjects.slice(0, visibleCount);
  
  const showMorePlaceholder = allProjects.length > initialLimit && visibleCount === initialLimit;
  const isExpandedList = allProjects.length > initialLimit && visibleCount === allProjects.length;

  const handleShowMore = () => {
    setVisibleCount(allProjects.length);
  };
  
  const handleCollapse = () => {
    setVisibleCount(initialLimit);
    scrollToSection('work'); 
  };

  return (
    <Section id="work">
      <h2 className="text-4xl md:text-5xl font-extrabold mb-12 text-center">Selected Work</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projectsToShow.map((project) => (
          <ProjectCard key={project.id} project={project} openCaseStudy={openCaseStudy} />
        ))}
        
        {/* The mock expansion card is only shown if we are showing the initial limit (4) and there are more projects */}
        {showMorePlaceholder && (
          <div 
            className="flex flex-col items-center justify-center p-8 rounded-xl border-4 border-dashed border-gray-300 text-gray-500 transition-colors duration-300 hover:border-indigo-400 hover:text-indigo-600 cursor-pointer"
            onClick={handleShowMore} 
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
          {!isExpandedList ? (
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

// --- 5. About Section Component (Content remains the same) ---
const AboutSection = () => (
    <Section id="about" className="bg-gray-50">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
        <div className="lg:col-span-2">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-8">Hello, I'm [Designer Name]</h2>
          <p className="text-lg text-gray-700 mb-6 leading-relaxed">I am a multidisciplinary designer with 8+ years of experience crafting digital products from concept to launch. My philosophy centers on **empathy and data-driven design**, ensuring every interface is not just beautiful, but highly functional and accessible.</p>
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

// --- 6. Contact Section Component (Content remains the same) ---
const ContactSection = () => (
    <Section id="contact">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-extrabold mb-4">Let's Connect</h2>
        <p className="text-xl text-gray-600 mb-10">
          I am currently open to new opportunities and collaborations. Whether you need a full-time lead designer or consultation on a challenging UX problem, drop me a line.
        </p>
        
        <a 
          href="mailto:hello@designername.com"
          className="inline-flex items-center justify-center px-10 py-4 border-2 border-indigo-600 text-lg font-semibold rounded-full text-indigo-600 hover:bg-indigo-50 transition duration-300 transform hover:scale-[1.02]"
        >
          <Mail className="mr-3 h-6 w-6" />
          hello@designername.com
        </a>
        
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

// --- 7. Footer Component (Content remains the same) ---
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

// --- 8. Case Study Modal Component ---

const CaseStudyModal = ({ project, isModalOpen, closeCaseStudy }) => {
    // 1. Lock body scroll and trigger animation entry is now managed by App component

    // 2. Handle ESC key to close the modal
    useEffect(() => {
        const handleEsc = (event) => {
            if (event.key === 'Escape') {
                closeCaseStudy();
            }
        };
        window.addEventListener('keydown', handleEsc);
        return () => {
            window.removeEventListener('keydown', handleEsc);
        };
    }, [closeCaseStudy]);

    const { title, category, year, caseStudy } = project;

    // Utility for scrolling to a section ID within the modal
    const scrollToSection = (id) => {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    };

    // Safety check for caseStudy data
    if (!caseStudy || !caseStudy.sections || caseStudy.sections.length === 0) {
        return (
            <div 
                className={`fixed inset-0 z-[100] bg-white flex items-center justify-center p-6 transition-transform duration-300 ease-in-out ${isModalOpen ? 'translate-x-0' : 'translate-x-full'}`}
                role="dialog" 
                aria-modal="true"
            >
                <div className="text-center">
                    <p className="text-2xl font-bold text-red-600 mb-4">Case Study Missing</p>
                    <p className="text-gray-700">Detailed content for "{title}" is not yet available.</p>
                    <button onClick={closeCaseStudy} className="mt-6 inline-flex items-center text-indigo-600 hover:text-indigo-800 font-semibold">
                        <ArrowLeft className="w-5 h-5 mr-2" /> Back to Work Index
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div 
            // Slide-in/Slide-out animation using translate-x-full
            className={`fixed inset-0 z-[100] bg-white overflow-y-scroll transition-transform duration-300 ease-in-out 
                        ${isModalOpen ? 'translate-x-0' : 'translate-x-full'}`}
            role="dialog" aria-modal="true" aria-labelledby="modal-title"
        >
            <div className="container mx-auto px-6 max-w-7xl">
                
                {/* Fixed Top Bar for Navigation and Close */}
                <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm py-4 border-b border-gray-200 flex justify-between items-center">
                    <button 
                        onClick={closeCaseStudy}
                        className="flex items-center text-indigo-600 hover:text-indigo-800 transition duration-300 font-semibold text-base md:text-lg"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Back to Work Index
                    </button>
                    <nav className="hidden sm:flex space-x-4 text-sm">
                      {caseStudy.sections.map((section) => (
                          <a 
                              key={section.id} 
                              href={`#${section.id}`} 
                              onClick={(e) => { e.preventDefault(); scrollToSection(section.id); }}
                              className="text-gray-600 hover:text-indigo-600 transition"
                          >
                              {section.title.split('. ')[1] || section.title}
                          </a>
                      ))}
                    </nav>
                </div>

                {/* Case Study Content */}
                <div className="pt-12 pb-24 max-w-5xl mx-auto">
                    
                    {/* Hero */}
                    <header className="text-center mb-16">
                        <span className="text-sm font-medium text-gray-500 uppercase tracking-wider">{category} - {year}</span>
                        <h1 id="modal-title" className="text-5xl md:text-7xl font-black mt-3 mb-6 leading-tight text-gray-900">{title}</h1>
                        <p className="text-xl text-gray-600 italic max-w-3xl mx-auto">{caseStudy.brief}</p>
                        <div className="mt-8 flex justify-center space-x-6 text-gray-600 text-sm">
                            <span>**Client:** {caseStudy.client}</span>
                            <span>**Role:** {caseStudy.role}</span>
                            <span>**Duration:** {caseStudy.duration}</span>
                        </div>
                    </header>

                    {/* Sections (The Narrative) */}
                    <div className="space-y-20">
                        {caseStudy.sections.map((section, index) => (
                            <div 
                                key={section.id} 
                                id={section.id} 
                                className="group pt-2"
                            >
                                <p className="text-sm font-semibold text-indigo-600 mb-2">{section.title}</p>
                                <h2 className="text-4xl font-extrabold mb-6 text-gray-900">{section.title.split('. ')[1] || section.title}</h2>
                                <p className="text-lg text-gray-700 leading-relaxed mb-8">
                                    {section.content}
                                </p>
                                
                                {/* Media / Mockup Placeholder (if data is available) */}
                                {section.media && (
                                    <img 
                                        src={section.media}
                                        alt={`Mockup for ${section.title}`}
                                        className="w-full rounded-xl shadow-2xl transition duration-500 hover:scale-[1.005]"
                                        onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/1200x600/111827/d1d5db?text=Design+Mockup+Placeholder"; }}
                                    />
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Final CTA */}
                    <div className="mt-20 pt-10 border-t border-gray-300 text-center">
                        <p className="text-2xl font-bold text-gray-800 mb-6">Ready to discuss your next project?</p>
                        <button 
                            onClick={closeCaseStudy}
                            className="inline-flex items-center justify-center px-8 py-3 bg-indigo-600 border border-indigo-600 text-base font-medium rounded-full text-white hover:bg-indigo-700 transition duration-300 shadow-lg"
                        >
                            Back to Index
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};


// --- MAIN APP COMPONENT ---
const App = () => {
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [scrollPosition, setScrollPosition] = useState(0); 
  
  // Controls the CSS animation (true = fully open, false = animating out)
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // NEW STATE to track the ID of the card to scroll to after unmount
  const [cardToScrollTo, setCardToScrollTo] = useState(null);

  // Utility function to handle smooth scrolling
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const openCaseStudy = (id) => {
    // 1. Save scroll position for restoration
    setScrollPosition(window.scrollY);
    
    // 2. Save the ID of the card we need to scroll to later
    setCardToScrollTo(id);
    
    // 3. Mount the component
    setSelectedProjectId(id);
    
    // 4. Start the entrance animation after mounting
    setTimeout(() => {
        setIsModalOpen(true);
    }, 10);
  };

  const closeCaseStudy = () => {
    // 1. Start the exit animation
    setIsModalOpen(false);
    
    // 2. Wait for the animation to finish (300ms, matching CSS duration)
    setTimeout(() => {
        // 3. Unmount the component from the DOM
        setSelectedProjectId(null);
        
        // Note: Scroll restoration is now handled by the useEffect below
    }, 300); 
  };
  
  // Effect to manage body overflow when modal is opening/closing
  useEffect(() => {
    if (selectedProjectId) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
        document.body.style.overflow = '';
    };
  }, [selectedProjectId]);


  // FIX: Scroll Restoration Effect
  // This effect runs whenever selectedProjectId becomes null (i.e., the main page re-renders)
  useEffect(() => {
    // Check if the modal just closed AND we have a card ID to scroll to
    if (!selectedProjectId && cardToScrollTo) {
      // Find the specific card element
      const element = document.getElementById(`project-card-${cardToScrollTo}`);
      if (element) {
        // Scroll the card back into view
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      // Reset the card ID after scrolling
      setCardToScrollTo(null);
    }
  }, [selectedProjectId, cardToScrollTo]);


  useEffect(() => {
    // Ensure the body has the default font applied
    document.body.className = 'font-sans antialiased text-gray-900';
  }, []);

  const selectedProject = allProjects.find(p => p.id === selectedProjectId);

  return (
    <div className="min-h-screen bg-white font-sans">
      
      {/* FIX: Apply transition and opacity/pointer-events to the main content container */}
      <div className={`transition-opacity duration-300 ${selectedProjectId ? 'opacity-50 pointer-events-none' : 'opacity-100 pointer-events-auto'}`}>
        <Header scrollToSection={scrollToSection} />
        <main>
            <Hero scrollToSection={scrollToSection} />
            <WorkSection scrollToSection={scrollToSection} openCaseStudy={openCaseStudy} />
            <AboutSection />
            <ContactSection />
        </main>
        <Footer scrollToSection={scrollToSection} />
      </div>
      
      {/* Modal is rendered outside the main content flow */}
      {selectedProjectId && selectedProject && (
          <CaseStudyModal 
            project={selectedProject} 
            closeCaseStudy={closeCaseStudy} 
            isModalOpen={isModalOpen} // Pass the animation state to the modal
          />
        )}
    </div>
  );
};

export default App;
