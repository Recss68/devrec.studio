import {
	PUBLIC_SANITY_DATASET,
	PUBLIC_SANITY_PROJECT_ID,
	PUBLIC_SANITY_API_VERSION,
	PUBLIC_SANITY_STUDIO_URL
} from '$env/static/public';

export const dataset = PUBLIC_SANITY_DATASET;
export const projectId = PUBLIC_SANITY_PROJECT_ID;
export const apiVersion = PUBLIC_SANITY_API_VERSION || '2026-07-24';
export const studioUrl = PUBLIC_SANITY_STUDIO_URL || 'http://localhost:3333';
