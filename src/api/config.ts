export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
export const STRAWPOLL_API_URL = import.meta.env.VITE_STRAWPOLL_API_URL || 'https://api.strawpoll.com/v3';
export const STRAWPOLL_API_KEY = import.meta.env.VITE_STRAWPOLL_API_KEY;

export const API_ENDPOINTS = {
	members: '/members',
	movieClubs: '/movie-clubs',
	attendance: '/attendance',
	polls: '/polls',
} as const;