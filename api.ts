import axios from 'axios';


const API_KEY = process.env.PIXABAY_API_KEY;
const BASE_URL = 'https://pixabay.com/api/';

export interface Wallpaper {
  id: number;
  webformatURL: string;
  largeImageURL: string;
  user: string;
  tags: string;
}

export const fetchWallpapers = async (page: number = 1, perPage: number = 20): Promise<Wallpaper[]> => {
  try {
    const response = await axios.get<{ hits: Wallpaper[] }>(`${BASE_URL}`, {
      params: {
        key: API_KEY,
        page,
        per_page: perPage,
        image_type: 'photo',
        orientation: 'vertical',
        category: 'backgrounds',
      },
    });
    return response.data.hits;
  } catch (error) {
    console.error('Error fetching wallpapers:', error);
    return [];
  }
};
