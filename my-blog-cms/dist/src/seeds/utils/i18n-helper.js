// export const createLocalizedEntry = async (strapi: any, entityName: string, baseData: any, translations: any) => {
//     try {
//         // Helper function to determine which fields should NOT be localized (keep same across locales)
//         const getNonLocalizedFields = (entityName: string) => {
//             const entityTypeMap = {
//                 'api::author.author': ['name', 'email', 'social_links'], // Keep these same across locales
//                 'api::category.category': [], // All fields can be localized
//                 'api::tag.tag': [], // All fields can be localized
//                 'api::testimonial.testimonial': ['author', 'role', 'company', 'rating'], // Keep these same
//                 // Add other entity types as needed
//             };
//             return entityTypeMap[entityName] || [];
//         };
//
//         // Helper function to make unique fields locale-specific ONLY for entities that need it
//         const makeUniqueFieldsLocaleSpecific = (data: any, locale: string, entityName: string) => {
//             const modifiedData = { ...data };
//             const nonLocalizedFields = getNonLocalizedFields(entityName);
//
//             // For non-English locales, append locale suffix to unique fields
//             // BUT ONLY if they're not in the non-localized list
//             if (locale !== 'en') {
//                 if (modifiedData.email && !nonLocalizedFields.includes('email')) {
//                     if (!modifiedData.email.includes(`-${locale}`)) {
//                         const [emailPart, domain] = modifiedData.email.split('@');
//                         modifiedData.email = `${emailPart}-${locale}@${domain}`;
//                     }
//                 }
//                 if (modifiedData.name && !nonLocalizedFields.includes('name')) {
//                     if (!modifiedData.name.includes(`-${locale}`)) {
//                         modifiedData.name = `${modifiedData.name}-${locale}`;
//                     }
//                 }
//                 if (modifiedData.title && !nonLocalizedFields.includes('title')) {
//                     if (!modifiedData.title.includes(`-${locale}`)) {
//                         modifiedData.title = `${modifiedData.title}-${locale}`;
//                     }
//                 }
//                 if (modifiedData.slug && !nonLocalizedFields.includes('slug')) {
//                     if (!modifiedData.slug.includes(`-${locale}`)) {
//                         modifiedData.slug = `${modifiedData.slug}-${locale}`;
//                     }
//                 }
//                 if (modifiedData.author && !nonLocalizedFields.includes('author')) {
//                     if (!modifiedData.author.includes(`-${locale}`)) {
//                         modifiedData.author = `${modifiedData.author}-${locale}`;
//                     }
//                 }
//             }
//
//             return modifiedData;
//         };
//
//         // Build query filters based on available fields for each entity type
//         const buildQueryFilters = (data: any, locale: string) => {
//             const filters: any = { locale };
//             const orConditions = [];
//
//             // Add conditions based on available fields
//             if (data.slug) orConditions.push({ slug: data.slug });
//             if (data.title) orConditions.push({ title: data.title });
//             if (data.name) orConditions.push({ name: data.name });
//             if (data.email) orConditions.push({ email: data.email });
//             if (data.author) orConditions.push({ author: data.author });
//
//             if (orConditions.length > 0) {
//                 filters.$or = orConditions;
//             }
//
//             return { filters };
//         };
//
//         // Check if English entry already exists
//         const englishData = makeUniqueFieldsLocaleSpecific(baseData, 'en', entityName);
//         const existingEnglishEntry = await strapi.entityService.findMany(entityName,
//             buildQueryFilters(englishData, 'en')
//         );
//
//         let englishEntry;
//
//         if (existingEnglishEntry && existingEnglishEntry.length > 0) {
//             englishEntry = existingEnglishEntry[0];
//             console.log(`English entry already exists for ${entityName}: ${englishEntry.title || englishEntry.name || englishEntry.author}`);
//         } else {
//             // Create English (default) entry
//             englishEntry = await strapi.entityService.create(entityName, {
//                 data: {
//                     ...englishData,
//                     locale: 'en',
//                     publishedAt: new Date()
//                 }
//             });
//             console.log(`Created English entry for ${entityName}: ${englishEntry.title || englishEntry.name || englishEntry.author}`);
//         }
//
//         const createdEntries = [englishEntry];
//
//         // Create Arabic translation if it doesn't exist
//         if (translations && translations.ar) {
//             const arabicData = makeUniqueFieldsLocaleSpecific({
//                 ...baseData, // Start with base data
//                 ...translations.ar // Override with Arabic translations
//             }, 'ar', entityName);
//
//             const existingArabicEntry = await strapi.entityService.findMany(entityName,
//                 buildQueryFilters(arabicData, 'ar')
//             );
//
//             if (!existingArabicEntry || existingArabicEntry.length === 0) {
//                 const arabicEntry = await strapi.entityService.create(entityName, {
//                     data: {
//                         ...arabicData,
//                         locale: 'ar',
//                         publishedAt: new Date(),
//                         localizations: [englishEntry.id] // Link to English entry
//                     }
//                 });
//                 createdEntries.push(arabicEntry);
//                 console.log(`Created Arabic translation for ${entityName}: ${arabicData.name || arabicData.title || arabicData.author}`);
//             } else {
//                 createdEntries.push(existingArabicEntry[0]);
//                 console.log(`Arabic translation already exists for ${entityName}`);
//             }
//         }
//
//         // Create French translation if it doesn't exist
//         if (translations && translations.fr) {
//             const frenchData = makeUniqueFieldsLocaleSpecific({
//                 ...baseData, // Start with base data
//                 ...translations.fr // Override with French translations
//             }, 'fr', entityName);
//
//             const existingFrenchEntry = await strapi.entityService.findMany(entityName,
//                 buildQueryFilters(frenchData, 'fr')
//             );
//
//             if (!existingFrenchEntry || existingFrenchEntry.length === 0) {
//                 const frenchEntry = await strapi.entityService.create(entityName, {
//                     data: {
//                         ...frenchData,
//                         locale: 'fr',
//                         publishedAt: new Date(),
//                         localizations: [englishEntry.id] // Link to English entry
//                     }
//                 });
//                 createdEntries.push(frenchEntry);
//                 console.log(`Created French translation for ${entityName}: ${frenchData.name || frenchData.title || frenchData.author}`);
//             } else {
//                 createdEntries.push(existingFrenchEntry[0]);
//                 console.log(`French translation already exists for ${entityName}`);
//             }
//         }
//
//         // Update English entry to link back to translations
//         if (createdEntries.length > 1) {
//             try {
//                 const translationIds = createdEntries.slice(1).map(entry => entry.id);
//                 await strapi.entityService.update(entityName, englishEntry.id, {
//                     data: {
//                         localizations: translationIds
//                     }
//                 });
//                 console.log(`Linked localizations for ${entityName}`);
//             } catch (linkError) {
//                 console.warn(`Warning: Could not link localizations for ${entityName}:`, linkError.message);
//             }
//         }
//
//         return englishEntry;
//     } catch (error) {
//         console.error(`Error creating localized entry for ${entityName}:`, error);
//         throw error;
//     }
// };
//
// export const checkExistingEntries = async (strapi: any, entityName: string) => {
//     return await strapi.entityService.findMany(entityName);
// };
