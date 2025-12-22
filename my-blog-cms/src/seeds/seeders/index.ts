
import {authorsData} from "../data/authors";
import {categoriesData} from "../data/categories";
import {tagsData} from "../data/tags";
import {servicesData} from "../data/services";
import {projectsData} from "../data/projects";
import {testimonialsData} from "../data/testimonials";
import {faqsData} from "../data/faqs";
import {blogsData} from "../data/blogs";
import {missionsData} from "../data/missions";
import {seedAuthors} from "./authorSeeder";
import {seedCategories} from "./categorySeeder";
import {seedTags} from "./tagSeeder";
import {seedServices} from "./serviceSeeder";
import {seedProjects} from "./projectSeeder";
import {seedTestimonials} from "./testimonialSeeder";
import {seedFAQs} from "./faqSeeder";
import {seedMissions} from "./missionSeeder";
import {seedBlogs} from "./blogSeeder";
import {seedSocialMedias} from "./socialMediaSeeder";

export const runSeeds = async (strapi: any) => {
    try {
        console.log('🌱 Starting internationalized seeding process...');

        // Seed Services
        try {
            await seedServices(strapi, servicesData);
        } catch (servicesError) {
            console.error('❌ Services seeding failed:', servicesError);
        }

        // Seed Projects
        try {
            await seedProjects(strapi, projectsData);
        } catch (projectsError) {
            console.error('❌ Projects seeding failed:', projectsError);
        }

        console.log('🎉 All internationalized seeding completed!');

    } catch (error) {
        console.error('❌ Error during seeding:', error);
        // Don't throw - let Strapi continue starting
    }
};