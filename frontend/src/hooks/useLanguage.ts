import { useTranslation } from 'react-i18next';

export const useLanguage = () => {
  const { i18n } = useTranslation();

  const changeLanguage = async (lng: 'az' | 'en' | 'ru') => {
    await i18n.changeLanguage(lng);
    localStorage.setItem('i18nextLng', lng);
  };

  return {
    language: (i18n.language || 'az').split('-')[0] as 'az' | 'en' | 'ru',
    changeLanguage,
  };
};
