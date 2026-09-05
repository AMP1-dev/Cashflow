import { initialRadioConfig, initialChannels, initialShows, initialSchedule, initialArticles, initialSongLibrary, timeBasedSchedule, initialB2BClients } from '../data/radioData';

const CONFIG_KEY = 'amp_radio_config_v6';
const CHANNELS_KEY = 'amp_radio_channels_v6';
const SHOWS_KEY = 'amp_radio_shows_v6';
const SCHEDULE_KEY = 'amp_radio_schedule_v6';
const ARTICLES_KEY = 'amp_radio_articles_v6';
const REQUESTS_KEY = 'amp_radio_requests_v6';
const AUTH_KEY = 'amp_radio_admin_auth_v6';
const PASS_KEY = 'amp_radio_admin_pass_v6';
const TIME_SCHEDULE_KEY = 'amp_radio_time_schedule_v6';
const B2B_CLIENTS_KEY = 'amp_radio_b2b_clients_v6';

export const radioStorage = {
  getConfig: () => {
    try {
      const data = localStorage.getItem(CONFIG_KEY);
      return data ? { ...initialRadioConfig, ...JSON.parse(data) } : initialRadioConfig;
    } catch {
      return initialRadioConfig;
    }
  },
  saveConfig: (config) => {
    try {
      localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
    } catch (e) {
      console.error(e);
    }
  },
  getTimeSchedule: () => {
    try {
      const data = localStorage.getItem(TIME_SCHEDULE_KEY);
      return data ? JSON.parse(data) : timeBasedSchedule;
    } catch {
      return timeBasedSchedule;
    }
  },
  saveTimeSchedule: (schedule) => {
    try {
      localStorage.setItem(TIME_SCHEDULE_KEY, JSON.stringify(schedule));
    } catch (e) {
      console.error(e);
    }
  },
  getChannels: () => {
    try {
      const data = localStorage.getItem(CHANNELS_KEY);
      return data ? JSON.parse(data) : initialChannels;
    } catch {
      return initialChannels;
    }
  },
  saveChannels: (channels) => {
    try {
      localStorage.setItem(CHANNELS_KEY, JSON.stringify(channels));
    } catch (e) {
      console.error(e);
    }
  },
  getShows: () => {
    try {
      const data = localStorage.getItem(SHOWS_KEY);
      return data ? JSON.parse(data) : initialShows;
    } catch {
      return initialShows;
    }
  },
  saveShows: (shows) => {
    try {
      localStorage.setItem(SHOWS_KEY, JSON.stringify(shows));
    } catch (e) {
      console.error(e);
    }
  },
  getSchedule: () => {
    try {
      const data = localStorage.getItem(SCHEDULE_KEY);
      return data ? JSON.parse(data) : initialSchedule;
    } catch {
      return initialSchedule;
    }
  },
  saveSchedule: (schedule) => {
    try {
      localStorage.setItem(SCHEDULE_KEY, JSON.stringify(schedule));
    } catch (e) {
      console.error(e);
    }
  },
  getArticles: () => {
    try {
      const data = localStorage.getItem(ARTICLES_KEY);
      return data ? JSON.parse(data) : initialArticles;
    } catch {
      return initialArticles;
    }
  },
  saveArticles: (articles) => {
    try {
      localStorage.setItem(ARTICLES_KEY, JSON.stringify(articles));
    } catch (e) {
      console.error(e);
    }
  },
  getSongLibrary: () => initialSongLibrary,
  getRequests: () => {
    try {
      const data = localStorage.getItem(REQUESTS_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },
  saveRequests: (requests) => {
    try {
      localStorage.setItem(REQUESTS_KEY, JSON.stringify(requests));
    } catch (e) {
      console.error(e);
    }
  },
  getAuthSession: () => {
    try {
      return localStorage.getItem(AUTH_KEY) === 'true';
    } catch {
      return false;
    }
  },
  saveAuthSession: (isAuth) => {
    try {
      localStorage.setItem(AUTH_KEY, isAuth ? 'true' : 'false');
    } catch (e) {
      console.error(e);
    }
  },
  getAdminPass: () => {
    try {
      return localStorage.getItem(PASS_KEY) || 'amplificadora2026';
    } catch {
      return 'amplificadora2026';
    }
  },
  saveAdminPass: (pass) => {
    try {
      localStorage.setItem(PASS_KEY, pass);
    } catch (e) {
      console.error(e);
    }
  },
  getB2BClients: () => {
    try {
      const data = localStorage.getItem(B2B_CLIENTS_KEY);
      return data ? JSON.parse(data) : initialB2BClients;
    } catch {
      return initialB2BClients;
    }
  },
  saveB2BClients: (clients) => {
    try {
      localStorage.setItem(B2B_CLIENTS_KEY, JSON.stringify(clients));
    } catch (e) {
      console.error(e);
    }
  }
};
