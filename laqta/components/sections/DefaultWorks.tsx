export const defaultWorks = [
    {
        id: 1,
        attributes: {
            title: "Brand Positioning for AI SaaS",
            description: "We helped Neuromind simplify their complex AI product through a clear brand voice, captivating explainer videos, and conversion-driven landing pages—leading to a 35% boost in trial signups within 2 months.",
            category: "AI & SaaS Industry",
            metrics: "Let's shape clarity from complexity.",
            cta_text: "Get a free audit",
            image_position: "left" as const,
            featured: true,
            image: {
                data: {
                    attributes: {
                        url: "/images/workImage.jpg",
                        alternativeText: "AI SaaS Brand Positioning Project"
                    }
                }
            },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            publishedAt: new Date().toISOString(),
        }
    },
    {
        id: 2,
        attributes: {
            title: "E-commerce Platform Redesign",
            description: "Complete redesign of an e-commerce platform that resulted in 40% increase in conversion rates and improved user experience across all devices.",
            category: "E-commerce & Retail",
            metrics: "Driving sales through design.",
            cta_text: "View case study",
            image_position: "right" as const,
            featured: true,
            image: {
                data: {
                    attributes: {
                        url: "/images/workImage.jpg",
                        alternativeText: "E-commerce Platform Redesign"
                    }
                }
            },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            publishedAt: new Date().toISOString(),
        }
    },
    {
        id: 3,
        attributes: {
            title: "Mobile App Development",
            description: "Built a comprehensive mobile application for a fintech startup, focusing on user security and seamless financial transactions.",
            category: "Fintech & Mobile",
            metrics: "Innovation meets security.",
            cta_text: "Explore project",
            image_position: "left" as const,
            featured: false,
            image: {
                data: {
                    attributes: {
                        url: "/images/workImage.jpg",
                        alternativeText: "Mobile App Development Project"
                    }
                }
            },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            publishedAt: new Date().toISOString(),
        }
    }
];