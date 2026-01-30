import { servicesData } from "../data/services";
import { seedServices } from "./serviceSeeder";
import { blogsData } from "../data/blogs";
import { seedBlogs } from "./blogSeeder";
import { plansData } from "../data/plans";
import { seedPlans } from "./planSeeder";
import { cookieConsentData } from "../data/cookieConsent";
import { seedCookieConsent } from "./cookieConsentSeeder";

export const runSeeds = async (strapi: any) => {
    console.log('🌱 runSeeds called');

    // Seed Services
    await seedServices(strapi, servicesData);

    // Seed Blogs
    await seedBlogs(strapi, blogsData);

    // Seed Plans
    await seedPlans(strapi, plansData);

    // Seed Cookie Consent (Law 18-07 Compliance)
    await seedCookieConsent(strapi, cookieConsentData);

    console.log('🎉 Seeding completed!');
};