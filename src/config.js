import firebaseconfig from 'firebaseconfig';

export const FIREBASE_URL = firebaseconfig.url;

export const FIREBASE_CONFIG = firebaseconfig.config;

// Route paths
export const LOGIN_PATH = '/login';
export const DASHBOARD_PATH = '/dashboard';
export const HOME_PATH = '/home';
export const GALLERIES_PATH = '/galleries';
export const GALLERY_PATH = '/galleries/:gallery';
export const NEWS_REPORTING_PATH = '/news-reporting';
export const PRICING_PATH = '/pricing';
export const ABOUT_PATH = '/about';
export const CONTACT_PATH = '/contact';
export const POST_LOGIN_PATH = DASHBOARD_PATH;
export const POST_LOGOUT_PATH = HOME_PATH;
