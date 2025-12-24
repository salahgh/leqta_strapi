import { servicesData } from "../data/services";
import { seedServices } from "./serviceSeeder";
import { blogsData } from "../data/blogs";
import { seedBlogs } from "./blogSeeder";

export const runSeeds = async (strapi: any) => {
    console.log('🌱 runSeeds called');

    // Seed Services
    await seedServices(strapi, servicesData);

    // Seed Blogs
    await seedBlogs(strapi, blogsData);

    console.log('🎉 Seeding completed!');
};