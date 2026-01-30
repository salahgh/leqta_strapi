/**
 * Site Setting Lifecycles
 * Automatically revalidates Next.js cache when site settings change
 */

const NEXTJS_URL = process.env.NEXTJS_URL || 'http://localhost:3000';
const REVALIDATE_SECRET = process.env.REVALIDATE_SECRET || 'your-secret-token';

async function revalidateSiteSettings() {
    try {
        const response = await fetch(`${NEXTJS_URL}/api/revalidate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                tag: 'site-settings',
                secret: REVALIDATE_SECRET,
            }),
        });

        if (response.ok) {
            const data = await response.json();
            console.log('✅ Site settings cache revalidated:', data);
        } else {
            const error = await response.text();
            console.error('❌ Failed to revalidate site settings cache:', error);
        }
    } catch (error) {
        console.error('❌ Error calling revalidation endpoint:', error);
    }
}

export default {
    async afterCreate() {
        console.log('📝 Site settings created, revalidating cache...');
        await revalidateSiteSettings();
    },

    async afterUpdate() {
        console.log('📝 Site settings updated, revalidating cache...');
        await revalidateSiteSettings();
    },

    async afterDelete() {
        console.log('📝 Site settings deleted, revalidating cache...');
        await revalidateSiteSettings();
    },
};
