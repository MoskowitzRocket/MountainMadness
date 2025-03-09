import Constants from 'expo-constants';

export const API_URL = 'https://api.perplexity.ai/chat/completions';
export const API_KEY = Constants.expoConfig?.extra?.API_KEY || process.env.API_KEY;
