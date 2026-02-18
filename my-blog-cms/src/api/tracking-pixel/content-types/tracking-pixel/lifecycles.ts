/**
 * Tracking Pixel Lifecycles
 * Automatically revalidates Next.js cache when tracking pixel settings change
 */

const NEXTJS_URL = process.env.NEXTJS_URL || 'http://localhost:3000';
const REVALIDATE_SECRET = process.env.REVALIDATE_SECRET || 'your-secret-token';

async function revalidateTrackingPixel() {
    try {
        const response = await fetch(`${NEXTJS_URL}/api/revalidate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                tag: 'tracking-pixel',
                secret: REVALIDATE_SECRET,
            }),
        });

        if (response.ok) {
            const data = await response.json();
            console.log('Tracking pixel cache revalidated:', data);
        } else {
            const error = await response.text();
            console.error('Failed to revalidate tracking pixel cache:', error);
        }
    } catch (error) {
        console.error('Error calling revalidation endpoint:', error);
    }
}

export default {
    async afterCreate() {
        console.log('Tracking pixel created, revalidating cache...');
        await revalidateTrackingPixel();
    },

    async afterUpdate() {
        console.log('Tracking pixel updated, revalidating cache...');
        await revalidateTrackingPixel();
    },

    async afterDelete() {
        console.log('Tracking pixel deleted, revalidating cache...');
        await revalidateTrackingPixel();
    },
};
