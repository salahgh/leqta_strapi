"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runSeeds = void 0;
const authors_1 = require("../data/authors");
const categories_1 = require("../data/categories");
const tags_1 = require("../data/tags");
const services_1 = require("../data/services");
const projects_1 = require("../data/projects");
const testimonials_1 = require("../data/testimonials");
const faqs_1 = require("../data/faqs");
const blogs_1 = require("../data/blogs");
const missions_1 = require("../data/missions");
const authorSeeder_1 = require("./authorSeeder");
const categorySeeder_1 = require("./categorySeeder");
const tagSeeder_1 = require("./tagSeeder");
const serviceSeeder_1 = require("./serviceSeeder");
const projectSeeder_1 = require("./projectSeeder");
const testimonialSeeder_1 = require("./testimonialSeeder");
const faqSeeder_1 = require("./faqSeeder");
const missionSeeder_1 = require("./missionSeeder");
const blogSeeder_1 = require("./blogSeeder");
const runSeeds = async (strapi) => {
    try {
        console.log('🌱 Starting internationalized seeding process...');
        //Seed Authors first (required for blog relations)
        await (0, authorSeeder_1.seedAuthors)(strapi, authors_1.authorsData);
        // Seed Categories (required for blog relations)
        await (0, categorySeeder_1.seedCategories)(strapi, categories_1.categoriesData);
        // Seed Tags (required for blog relations)
        await (0, tagSeeder_1.seedTags)(strapi, tags_1.tagsData);
        // Seed Services
        await (0, serviceSeeder_1.seedServices)(strapi, services_1.servicesData);
        //Seed Projects
        await (0, projectSeeder_1.seedProjects)(strapi, projects_1.projectsData);
        // Seed Testimonials
        await (0, testimonialSeeder_1.seedTestimonials)(strapi, testimonials_1.testimonialsData);
        // Seed FAQs
        await (0, faqSeeder_1.seedFAQs)(strapi, faqs_1.faqsData);
        // Seed Missions
        await (0, missionSeeder_1.seedMissions)(strapi, missions_1.missionsData);
        // Seed Blogs (requires authors, categories, and tags)
        await (0, blogSeeder_1.seedBlogs)(strapi, blogs_1.blogsData);
        console.log('🎉 All internationalized seeding completed successfully!');
    }
    catch (error) {
        console.error('❌ Error during seeding:', error);
        throw error;
    }
};
exports.runSeeds = runSeeds;
