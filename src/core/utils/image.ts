const IMAGES_PATH = '/images';

export const useImage = (url: string) => {
  return new URL(`${IMAGES_PATH}/${url}`, import.meta.url).href;
};
