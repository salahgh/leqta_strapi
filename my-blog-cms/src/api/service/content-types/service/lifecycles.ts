/**
 * Service lifecycle hooks
 * Auto-generates slug from title if not provided
 */

// Helper function to generate a URL-friendly slug
function generateSlug(title: string): string {
    if (!title) return '';
    return title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
        .replace(/\s+/g, '-')          // Replace spaces with hyphens
        .replace(/-+/g, '-')           // Replace multiple hyphens with single
        .replace(/^-|-$/g, '');        // Remove leading/trailing hyphens
}

export default {
    beforeCreate(event: any) {
        const { data } = event.params;

        // Auto-generate slug from title if not provided
        if (data.title && !data.slug) {
            data.slug = generateSlug(data.title);
        }
    },

    beforeUpdate(event: any) {
        const { data } = event.params;

        // Auto-generate slug from title if slug is empty and title exists
        if (data.title && !data.slug) {
            data.slug = generateSlug(data.title);
        }
    },
};
