export const slugify = (text: string): string => {
  const azMapping: { [key: string]: string } = {
    'ə': 'e', 'Ə': 'e',
    'ı': 'i', 'I': 'i',
    'ö': 'o', 'Ö': 'o',
    'ü': 'u', 'Ü': 'u',
    'ş': 's', 'Ş': 's',
    'ç': 'c', 'Ç': 'c',
    'ğ': 'g', 'Ğ': 'g',
    '№': 'no'
  };

  const cyrillicToLatin: { [key: string]: string } = {
    'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo', 'ж': 'zh',
    'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o',
    'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u', 'ф': 'f', 'х': 'kh', 'ц': 'ts',
    'ч': 'ch', 'ш': 'sh', 'щ': 'sch', 'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu',
    'я': 'ya'
  };

  let str = text.trim().toLowerCase();

  // Replace Azerbaijani characters
  for (const key in azMapping) {
    str = str.replace(new RegExp(key, 'g'), azMapping[key]);
  }

  // Replace Russian Cyrillic characters
  for (const key in cyrillicToLatin) {
    str = str.replace(new RegExp(key, 'g'), cyrillicToLatin[key]);
  }

  return str
    .replace(/[^a-z0-9\s-]/g, '') // remove special chars
    .replace(/\s+/g, '-')         // replace spaces with hyphens
    .replace(/-+/g, '-')          // replace multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, '');     // trim leading/trailing hyphens
};
