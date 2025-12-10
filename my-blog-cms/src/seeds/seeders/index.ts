
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
        // console.log('🌱 Starting internationalized seeding process...');
        //
        // //Seed Authors first (required for blog relations)
        // await seedAuthors(strapi, authorsData);
        //
        // // Seed Categories (required for blog relations)
        // await seedCategories(strapi, categoriesData);
        //
        // // Seed Tags (required for blog relations)
        // await seedTags(strapi, tagsData);
        //
        // // Seed Services
        // await seedServices(strapi, servicesData);
        //
        // //Seed Projects
        // await seedProjects(strapi, projectsData);
        //
        // // Seed Testimonials
        // await seedTestimonials(strapi, testimonialsData);
        //
        // // Seed FAQs
        // await seedFAQs(strapi, faqsData);
        //
        // // Seed Missions
        // await seedMissions(strapi, missionsData);
        //
        // // Seed Social Medias
        // // await seedSocialMedias(strapi);
        //
        // // Seed Blogs (requires authors, categories, and tags)
        // await seedBlogs(strapi, blogsData);

        console.log('🎉 All internationalized seeding completed successfully!');

    } catch (error) {
        console.error('❌ Error during seeding:', error);
        throw error;
    }
};