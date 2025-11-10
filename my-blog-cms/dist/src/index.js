"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const seeders_1 = require("./seeds/seeders");
module.exports = {
    register( /* { strapi } */) {
        // Registration logic
    },
    bootstrap({ strapi }) {
        // Run modular seeding with i18n support
        setTimeout(async () => {
            await (0, seeders_1.runSeeds)(strapi);
        }, 6000);
    },
};
