/**
 * Maps database image paths (from seeding scripts) to actual public URLs.
 *
 * The seeding scripts stored paths like:
 *   /src/assets/cakes/file.jpg
 *   /src/assets/cheese cakes/file.jpg
 *   etc.
 *
 * These files have been copied to client/public/assets/* so Vite serves them
 * directly at /assets/cakes/file.jpg (no backend required).
 */

// Map from the exact folder name stored in DB to the public folder name
const FOLDER_MAP = {
    'cakes': 'cakes',
    'cheese cakes': 'cheesecakes',
    'chocolates': 'chocolates',
    'cookies br': 'cookies_brownies',
    'cupcakes': 'cupcakes',
    'donuts': 'donuts',
    'macarrons': 'macarons',
    'moroccan sweets': 'moroccan_sweets',
    'tartellettes': 'tarts',
    'tiramisu sin': 'tiramisu',
    'viennoiseries': 'viennoiseries',
};

export const resolveImageUrl = (imagePath) => {
    if (!imagePath) return '';

    // Already a full URL (external or uploaded)
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
        return imagePath;
    }

    // Backend uploads (user-uploaded profile images, etc.)
    if (imagePath.startsWith('/uploads/')) {
        return `http://localhost:5000${imagePath}`;
    }

    // Seeded local assets: /src/assets/<folder>/<file>
    if (imagePath.startsWith('/src/assets/')) {
        // Extract folder name and filename
        // e.g. /src/assets/cheese cakes/file.jpg -> folder="cheese cakes", file="file.jpg"
        const withoutPrefix = imagePath.replace('/src/assets/', '');
        const slashIdx = withoutPrefix.indexOf('/');
        if (slashIdx === -1) return imagePath;

        const dbFolder = withoutPrefix.substring(0, slashIdx);
        const fileName = withoutPrefix.substring(slashIdx + 1);
        const publicFolder = FOLDER_MAP[dbFolder] || dbFolder;

        return `/assets/${publicFolder}/${fileName}`;
    }

    return imagePath;
};
