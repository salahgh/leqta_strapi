/**
 * Cookie Consent Lifecycles
 * Automatically revalidates Next.js cache when cookie consent settings change
 */

const NEXTJS_URL = process.env.NEXTJS_URL || 'http://localhost:3000';
const REVALIDATE_SECRET = process.env.REVALIDATE_SECRET || 'your-secret-token';

async function revalidateCookieConsent() {
    try {
        const response = await fetch(`${NEXTJS_URL}/api/revalidate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                tag: 'cookie-consent',
                secret: REVALIDATE_SECRET,
            }),
        });

        if (response.ok) {
            const data = await response.json();
            console.log('Cookie consent cache revalidated:', data);
        } else {
            const error = await response.text();
            console.error('Failed to revalidate cookie consent cache:', error);
        }
    } catch (error) {
        console.error('Error calling revalidation endpoint:', error);
    }
}

export default {
    async afterCreate() {
        console.log('Cookie consent created, revalidating cache...');
        await revalidateCookieConsent();
    },

    async afterUpdate() {
        console.log('Cookie consent updated, revalidating cache...');
        await revalidateCookieConsent();
    },

    async afterDelete() {
        console.log('Cookie consent deleted, revalidating cache...');
        await revalidateCookieConsent();
    },
};
