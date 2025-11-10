import { Mission } from "@/lib/strapi";

export const defaultMissions: Mission[] = [
    {
        id: 1,
        documentId: "mission-1",
        title: "Mission",
        description:
            "Empowering businesses through innovative content and filmmaking",
        icon: "Users",
        iconSrc: undefined,
        featured: true,
        order: 1,
        publishedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: 2,
        documentId: "vision-2",
        title: "Vision",
        description:
            "Leading Algeria's creative industry with impactful video content",
        icon: "Telescope",
        iconSrc: undefined,
        featured: true,
        order: 2,
        publishedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: 3,
        documentId: "signature-3",
        title: "Signature",
        description: "Where creativity meets strategy",
        icon: "Wand2",
        iconSrc: undefined,
        featured: true,
        order: 3,
        publishedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
];
