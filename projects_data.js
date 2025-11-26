const ALL_PROJECTS = [
    {
        id: "project-1",
        title: "FlowState App: Meditation & Sleep",
        category: "UI/UX Mobile App",
        year: "2024",
        heroImage: "https://placehold.co/800x600/1e293b/f1f5f9?text=FlowState+Mobile+Hero",
        accentColor: "bg-indigo-600",
        isHidden: false,
        caseStudy: {
            client: "FlowState Wellness",
            role: "Lead UX/UI Designer",
            duration: "4 Months",
            brief: "A complete redesign of a mindfulness application focused on reducing friction in the daily tracking process and enhancing the visual language for a calm user experience.",
            sections: [
                {
                    id: "the-problem-goal",
                    title: "01. The Problem & Goal",
                    content: "The existing app suffered from high churn rates (35% after the first week) primarily due to an overwhelming onboarding process and a dated visual style that lacked emotional connection. The core goal was to simplify the daily tracking routine to increase retention and daily active usage (DAU) by 20%.",
                    media: "https://placehold.co/1200x600/334155/e2e8f0?text=UX+Wireframing+and+User+Flows"
                },
                {
                    id: "user-research-flows",
                    title: "02. User Research & Flows",
                    content: "We conducted qualitative interviews with 20 active users and built new user flow maps, finding that the key moment of friction was choosing a guided session. The initial step was consolidating decision points and creating an intuitive \"Quick Start\" button.",
                    media: ""
                },
                {
                    id: "visual-design-system",
                    title: "03. Visual Design & System",
                    content: "I developed a soft, dark-mode-first design system using gentle curves and large, legible typography (Figtree). The visual style was minimal, using subtle gradients to create depth without distraction. This premium aesthetic was designed to evoke calm and focus.",
                    media: "https://placehold.co/1200x700/6366f1/ffffff?text=FlowState+Final+UI+Mockups"
                }
            ]
        }
    },
    {
        id: "project-2",
        title: "Evolve Agency: Corporate Rebrand",
        category: "Visual Identity & Web Design",
        year: "2023",
        heroImage: "https://placehold.co/800x450/475569/f8fafc?text=Evolve+Web+Design+Hero",
        accentColor: "bg-green-600",
        isHidden: false,
        caseStudy: {
            client: "Evolve Marketing",
            role: "Visual Designer",
            duration: "2 Months",
            brief: "A full-scale digital and visual identity rebrand for a marketing agency, establishing authority and modernity in their segment.",
            sections: [
                {
                    id: "problem",
                    title: "01. The Dated Brand",
                    content: "The old brand identity felt stale and didn't convey the agency's cutting-edge work. The goal was to create a modular, adaptable visual system that works across digital and print."
                },
                {
                    id: "strategy",
                    title: "02. Color & Typography Strategy",
                    content: "We moved to a deep navy and forest green palette to evoke trust and growth, paired with a sharp, geometric sans-serif font for professionalism. The website design focused on bold, asymmetrical content blocks.",
                    media: "https://placehold.co/1200x700/065f46/d1fae5?text=Brand+Identity+Guide+Cover"
                }
            ]
        }
    },
    {
        id: "project-3",
        title: "Local Market: E-commerce Platform",
        category: "UX Research & E-commerce UI",
        year: "2023",
        heroImage: "https://placehold.co/800x550/1f2937/f3f4f6?text=Local+Market+E-commerce+UI",
        accentColor: "bg-yellow-600",
        isHidden: false,
        caseStudy: {
            client: "Farm-to-Table Collective",
            role: "UX Consultant",
            duration: "3 Months",
            brief: "Designing an accessible and localized e-commerce platform for farmers and local producers, optimizing checkout conversion for a diverse user base.",
            sections: [
                {
                    id: "problem",
                    title: "01. Accessibility Challenge",
                    content: "A strong focus was placed on WCAG AA compliance and a mobile-first approach due to the target demographic. Early user testing revealed critical friction points in the payment and delivery scheduling steps.",
                    media: "https://placehold.co/1200x500/78716c/fff7ed?text=User+Testing+Findings+Chart"
                },
                {
                    id: "solution",
                    title: "02. Streamlined Checkout",
                    content: "The solution was a simplified, three-step checkout process with large, clear button states and strong input validation. We also introduced a clear \"local delivery map\" visual to manage user expectations.",
                    media: "https://placehold.co/1200x700/f59e0b/000000?text=Mobile+Checkout+Flow+Optimization"
                }
            ]
        }
    },
    {
        id: "project-4",
        title: "Aero SaaS: Data Visualization",
        category: "UI/UX Dashboard",
        year: "2023",
        heroImage: "https://placehold.co/800x600/111827/d1d5db?text=Aero+SaaS+Dashboard+Hero",
        accentColor: "bg-red-600",
        isHidden: false,
        caseStudy: {
            client: "Aero Dynamics",
            role: "UI Lead",
            duration: "5 Months",
            brief: "Designing a complex SaaS dashboard for data visualization, focusing on clarity, speed, and customization for enterprise users.",
            sections: [
                {
                    id: "challenge",
                    title: "01. Data Density Challenge",
                    content: "The primary challenge was managing information density without causing cognitive overload. We implemented a modular widget system and dark mode interface to reduce eye strain during long working hours.",
                    media: "https://placehold.co/1200x800/dc2626/fef2f2?text=SaaS+Dashboard+Dark+Mode+View"
                }
            ]
        }
    },
    {
        id: "project-5",
        title: "Venture Fund: Investor Portal",
        category: "Web UX/UI",
        year: "2022",
        heroImage: "https://placehold.co/800x450/4f46e5/ffffff?text=Venture+Portal+UX",
        accentColor: "bg-pink-600",
        isHidden: false,
        caseStudy: {
            client: "Ascend Capital",
            role: "UX Designer",
            duration: "3 Months",
            brief: "Creating a secure, high-end investor portal to manage fund performance, documents, and communication.",
            sections: [
                {
                    id: "security",
                    title: "01. Security & Trust",
                    content: "Security and trust were paramount. The design utilized a highly structured layout with clean, authoritative typography and minimal colors to project confidence and stability.",
                    media: "https://placehold.co/1200x600/be185d/fce7f3?text=Investor+Portal+Security+Features"
                }
            ]
        }
    },
    {
        id: "project-6",
        title: "Aura Campaign: Lifestyle Visuals",
        category: "Social Media Design",
        year: "2024",
        heroImage: "https://placehold.co/800x600/a855f7/f3e8ff?text=Social+Campaign+Visuals",
        accentColor: "bg-purple-600",
        isHidden: false,
        caseStudy: {
            client: "Aura Fitness",
            role: "Visual Design Lead",
            duration: "1 Month",
            brief: "Development of a fresh, dynamic visual language for a 30-day Instagram campaign focused on wellness and hydration, designed to increase engagement and drive sign-ups.",
            sections: [
                {
                    id: "goal",
                    title: "01. Campaign Goals & Aesthetics",
                    content: "The primary goal was a 50% increase in post saves and shares. We defined a soft, ethereal aesthetic using pastel gradients and clean, minimal typography, moving away from standard stock imagery.",
                    media: "https://placehold.co/1200x700/7c3aed/f3e8ff?text=Instagram+Feed+Mockup+-+Aura+Campaign"
                }
            ]
        }
    },
    {
        id: "project-7",
        title: "QuickPost Templates: B2B Focus",
        category: "Content Design System",
        year: "2023",
        heroImage: "https://placehold.co/800x600/15803d/dcfce7?text=B2B+LinkedIn+Templates",
        accentColor: "bg-emerald-700",
        isHidden: false,
        caseStudy: {
            client: "QuickPost SaaS",
            role: "UX/Content Designer",
            duration: "6 Weeks",
            brief: "Designing a modular template system for LinkedIn and Twitter aimed at accelerating content creation for a B2B SaaS marketing team while maintaining brand consistency.",
            sections: [
                {
                    id: "challenge",
                    title: "01. Speed and Consistency",
                    content: "The marketing team struggled with slow content turnaround and inconsistent visual branding across channels. The objective was to design a system that allowed non-designers to produce branded content in under 5 minutes.",
                    media: "https://placehold.co/1200x500/059669/d1fae5?text=Modular+Template+Breakdown"
                }
            ]
        }
    }
];