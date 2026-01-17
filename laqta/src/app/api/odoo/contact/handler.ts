import xmlrpc from "xmlrpc";

// Odoo configuration - add these to your .env.local file
const ODOO_URL = process.env.ODOO_URL; // e.g., 'https://your-odoo-instance.com'
const ODOO_DB = process.env.ODOO_DB; // your database name
const ODOO_API_KEY = process.env.ODOO_API_KEY; // your API key
const ODOO_USERNAME = process.env.ODOO_USERNAME; // your username (needed for API key auth)

export default async function handler(formData: any) {
    try {
        // 1. Authenticate
        const common = xmlrpc.createClient({
            url: `${ODOO_URL}/xmlrpc/common`,
        });

        const uid = await new Promise((resolve, reject) => {
            common.methodCall(
                "login",
                [ODOO_DB, ODOO_USERNAME, ODOO_API_KEY],
                (err, value) => {
                    if (err) reject(err);
                    else resolve(value);
                },
            );
        });

        console.log("uid", uid);

        if (!uid) {
            throw new Error("Authentication failed");
        }

        // 2. Create models client
        const models = xmlrpc.createClient({
            url: `${ODOO_URL}/xmlrpc/object`,
        });

        // 3. Find the 'Warm' stage ID
        const warmStageId = await new Promise((resolve, reject) => {
            models.methodCall(
                "execute_kw",
                [
                    ODOO_DB,
                    uid,
                    ODOO_API_KEY,
                    "crm.stage",
                    "search",
                    [[["name", "ilike", "warm"]]], // wrapped domain
                    { limit: 1 }, // kwargs for limit
                ],
                (err, value) => {
                    if (err) reject(err);
                    else resolve(value && value.length > 0 ? value[0] : null);
                },
            );
        });

        console.log(warmStageId);

        // 4. Create opportunity (crm.lead with type='opportunity')
        const opportunityData = {
            name: `Opportunity - ${formData.companyName || formData.fullName}`,
            contact_name: formData.fullName,
            email_from: formData.email,
            phone: formData.phoneNumber,
            partner_name: formData.companyName,
            function: formData.jobTitle,
            website: formData.website,
            type: "opportunity", // This makes it an opportunity instead of a lead
            stage_id: warmStageId, // Set to 'Warm' stage
            description: `
--- Selected Service & Plan ---
Service: ${formData.selectedService || "Not specified"}
Plan: ${formData.selectedPlan || "Not specified"}

--- Company Information ---
Industry: ${formData.industry} ${formData.otherIndustry ? `(${formData.otherIndustry})` : ""}
Website: ${formData.website || "Not provided"}

--- Social Media ---
- Facebook: ${formData.facebook || "Not provided"}
- Instagram: ${formData.instagram || "Not provided"}
- TikTok: ${formData.tiktok || "Not provided"}
- LinkedIn: ${formData.linkedin || "Not provided"}

--- Project Details ---
Description: ${formData.projectDescription || "Not provided"}
Goals: ${formData.goals || "Not provided"}
            `.trim(),
        };

        const opportunityId = await new Promise((resolve, reject) => {
            models.methodCall(
                "execute",
                [
                    ODOO_DB,
                    uid,
                    ODOO_API_KEY,
                    "crm.lead",
                    "create",
                    [opportunityData], // Wrap the data object in an array
                ],
                (err, value) => {
                    if (err) reject(err);
                    else resolve(value);
                },
            );
        });

        return { success: true, opportunityId, stage: "Warm" };
    } catch (error) {
        throw new Error(error.message || "Failed to create opportunity");
    }
}
