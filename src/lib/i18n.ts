
/**
 * SaaS UI Trends 2026 - Internationalization & Localization
 * Cross-cultural design support with RTL and locale-aware formatting
 */

export type Locale = 'en' | 'es' | 'fr' | 'de' | 'ja' | 'zh' | 'ar' | 'he' | 'pt' | 'ko';
export type Direction = 'ltr' | 'rtl';

export const RTL_LANGUAGES: Locale[] = ['ar', 'he'];

export const localeConfig: Record<Locale, {
  name: string;
  nativeName: string;
  direction: Direction;
  dateFormat: string;
  numberFormat: Intl.NumberFormatOptions;
}> = {
  en: {
    name: 'English',
    nativeName: 'English',
    direction: 'ltr',
    dateFormat: 'MM/dd/yyyy',
    numberFormat: { style: 'decimal' },
  },
  es: {
    name: 'Spanish',
    nativeName: 'Español',
    direction: 'ltr',
    dateFormat: 'dd/MM/yyyy',
    numberFormat: { style: 'decimal' },
  },
  fr: {
    name: 'French',
    nativeName: 'Français',
    direction: 'ltr',
    dateFormat: 'dd/MM/yyyy',
    numberFormat: { style: 'decimal' },
  },
  de: {
    name: 'German',
    nativeName: 'Deutsch',
    direction: 'ltr',
    dateFormat: 'dd.MM.yyyy',
    numberFormat: { style: 'decimal' },
  },
  ja: {
    name: 'Japanese',
    nativeName: '日本語',
    direction: 'ltr',
    dateFormat: 'yyyy/MM/dd',
    numberFormat: { style: 'decimal' },
  },
  zh: {
    name: 'Chinese',
    nativeName: '中文',
    direction: 'ltr',
    dateFormat: 'yyyy/MM/dd',
    numberFormat: { style: 'decimal' },
  },
  ar: {
    name: 'Arabic',
    nativeName: 'العربية',
    direction: 'rtl',
    dateFormat: 'dd/MM/yyyy',
    numberFormat: { style: 'decimal' },
  },
  he: {
    name: 'Hebrew',
    nativeName: 'עברית',
    direction: 'rtl',
    dateFormat: 'dd/MM/yyyy',
    numberFormat: { style: 'decimal' },
  },
  pt: {
    name: 'Portuguese',
    nativeName: 'Português',
    direction: 'ltr',
    dateFormat: 'dd/MM/yyyy',
    numberFormat: { style: 'decimal' },
  },
  ko: {
    name: 'Korean',
    nativeName: '한국어',
    direction: 'ltr',
    dateFormat: 'yyyy.MM.dd',
    numberFormat: { style: 'decimal' },
  },
};

/**
 * Get direction for a locale
 */
export function getDirection(locale: Locale): Direction {
  return localeConfig[locale]?.direction || 'ltr';
}

/**
 * Check if locale is RTL
 */
export function isRTL(locale: Locale): boolean {
  return RTL_LANGUAGES.includes(locale);
}

/**
 * Format currency with locale awareness
 */
export function formatCurrency(
  amount: number,
  currency: string,
  locale: string
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount);
}

/**
 * Format date with locale awareness
 */
export function formatDate(
  date: Date,
  locale: string,
  options?: Intl.DateTimeFormatOptions
): string {
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };

  return new Intl.DateTimeFormat(locale, options || defaultOptions).format(date);
}

/**
 * Format number with locale awareness
 */
export function formatNumber(
  value: number,
  locale: string,
  options?: Intl.NumberFormatOptions
): string {
  return new Intl.NumberFormat(locale, options).format(value);
}

/**
 * Format relative time
 */
export function formatRelativeTime(
  date: Date,
  locale: string
): string {
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
  const now = new Date();
  const diffInSeconds = (date.getTime() - now.getTime()) / 1000;

  if (Math.abs(diffInSeconds) < 60) {
    return rtf.format(Math.round(diffInSeconds), 'second');
  }

  const diffInMinutes = diffInSeconds / 60;
  if (Math.abs(diffInMinutes) < 60) {
    return rtf.format(Math.round(diffInMinutes), 'minute');
  }

  const diffInHours = diffInMinutes / 60;
  if (Math.abs(diffInHours) < 24) {
    return rtf.format(Math.round(diffInHours), 'hour');
  }

  const diffInDays = diffInHours / 24;
  if (Math.abs(diffInDays) < 30) {
    return rtf.format(Math.round(diffInDays), 'day');
  }

  const diffInMonths = diffInDays / 30;
  if (Math.abs(diffInMonths) < 12) {
    return rtf.format(Math.round(diffInMonths), 'month');
  }

  const diffInYears = diffInMonths / 12;
  return rtf.format(Math.round(diffInYears), 'year');
}

/**
 * Format percentage
 */
export function formatPercent(
  value: number,
  locale: string,
  decimals: number = 0
): string {
  return new Intl.NumberFormat(locale, {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value / 100);
}

/**
 * Format compact number (1K, 1M, etc.)
 */
export function formatCompactNumber(
  value: number,
  locale: string
): string {
  return new Intl.NumberFormat(locale, {
    notation: 'compact',
    compactDisplay: 'short',
  }).format(value);
}

/**
 * Get list formatter
 */
export function formatList(
  items: string[],
  locale: string,
  type: 'conjunction' | 'disjunction' = 'conjunction'
): string {
  return new Intl.ListFormat(locale, { type }).format(items);
}

/**
 * Apply direction to document
 */
export function applyDirection(direction: Direction): void {
  if (typeof document === 'undefined') return;
  document.documentElement.dir = direction;
}

/**
 * Apply locale to document
 */
export function applyLocale(locale: Locale): void {
  if (typeof document === 'undefined') return;
  document.documentElement.lang = locale;
  applyDirection(getDirection(locale));
}

/**
 * Simple translation dictionary type
 */
export type TranslationDictionary = Record<string, Record<string, string>>;

/**
 * Basic translations for common UI elements
 */
export const commonTranslations: TranslationDictionary = {
  en: {
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    create: 'Create',
    loading: 'Loading...',
    search: 'Search',
    filter: 'Filter',
    sort: 'Sort',
    close: 'Close',
    back: 'Back',
    next: 'Next',
    previous: 'Previous',
    submit: 'Submit',
    confirm: 'Confirm',
    yes: 'Yes',
    no: 'No',
  },
  es: {
    save: 'Guardar',
    cancel: 'Cancelar',
    delete: 'Eliminar',
    edit: 'Editar',
    create: 'Crear',
    loading: 'Cargando...',
    search: 'Buscar',
    filter: 'Filtrar',
    sort: 'Ordenar',
    close: 'Cerrar',
    back: 'Atrás',
    next: 'Siguiente',
    previous: 'Anterior',
    submit: 'Enviar',
    confirm: 'Confirmar',
    yes: 'Sí',
    no: 'No',
  },
  fr: {
    save: 'Enregistrer',
    cancel: 'Annuler',
    delete: 'Supprimer',
    edit: 'Modifier',
    create: 'Créer',
    loading: 'Chargement...',
    search: 'Rechercher',
    filter: 'Filtrer',
    sort: 'Trier',
    close: 'Fermer',
    back: 'Retour',
    next: 'Suivant',
    previous: 'Précédent',
    submit: 'Soumettre',
    confirm: 'Confirmer',
    yes: 'Oui',
    no: 'Non',
  },
  de: {
    save: 'Speichern',
    cancel: 'Abbrechen',
    delete: 'Löschen',
    edit: 'Bearbeiten',
    create: 'Erstellen',
    loading: 'Wird geladen...',
    search: 'Suchen',
    filter: 'Filtern',
    sort: 'Sortieren',
    close: 'Schließen',
    back: 'Zurück',
    next: 'Weiter',
    previous: 'Zurück',
    submit: 'Absenden',
    confirm: 'Bestätigen',
    yes: 'Ja',
    no: 'Nein',
  },
  ja: {
    save: '保存',
    cancel: 'キャンセル',
    delete: '削除',
    edit: '編集',
    create: '作成',
    loading: '読み込み中...',
    search: '検索',
    filter: 'フィルター',
    sort: '並べ替え',
    close: '閉じる',
    back: '戻る',
    next: '次へ',
    previous: '前へ',
    submit: '送信',
    confirm: '確認',
    yes: 'はい',
    no: 'いいえ',
  },
  ar: {
    save: 'حفظ',
    cancel: 'إلغاء',
    delete: 'حذف',
    edit: 'تعديل',
    create: 'إنشاء',
    loading: 'جار التحميل...',
    search: 'بحث',
    filter: 'تصفية',
    sort: 'ترتيب',
    close: 'إغلاق',
    back: 'رجوع',
    next: 'التالي',
    previous: 'السابق',
    submit: 'إرسال',
    confirm: 'تأكيد',
    yes: 'نعم',
    no: 'لا',
  },
  zh: {
    save: '保存',
    cancel: '取消',
    delete: '删除',
    edit: '编辑',
    create: '创建',
    loading: '加载中...',
    search: '搜索',
    filter: '筛选',
    sort: '排序',
    close: '关闭',
    back: '返回',
    next: '下一步',
    previous: '上一步',
    submit: '提交',
    confirm: '确认',
    yes: '是',
    no: '否',
  },
  he: {
    save: 'שמור',
    cancel: 'ביטול',
    delete: 'מחק',
    edit: 'ערוך',
    create: 'צור',
    loading: 'טוען...',
    search: 'חיפוש',
    filter: 'סינון',
    sort: 'מיון',
    close: 'סגור',
    back: 'חזרה',
    next: 'הבא',
    previous: 'הקודם',
    submit: 'שלח',
    confirm: 'אישור',
    yes: 'כן',
    no: 'לא',
  },
  pt: {
    save: 'Salvar',
    cancel: 'Cancelar',
    delete: 'Excluir',
    edit: 'Editar',
    create: 'Criar',
    loading: 'Carregando...',
    search: 'Pesquisar',
    filter: 'Filtrar',
    sort: 'Ordenar',
    close: 'Fechar',
    back: 'Voltar',
    next: 'Próximo',
    previous: 'Anterior',
    submit: 'Enviar',
    confirm: 'Confirmar',
    yes: 'Sim',
    no: 'Não',
  },
  ko: {
    save: '저장',
    cancel: '취소',
    delete: '삭제',
    edit: '편집',
    create: '만들기',
    loading: '로딩 중...',
    search: '검색',
    filter: '필터',
    sort: '정렬',
    close: '닫기',
    back: '뒤로',
    next: '다음',
    previous: '이전',
    submit: '제출',
    confirm: '확인',
    yes: '예',
    no: '아니오',
  },
};

/**
 * Get translation for a key
 */
export function t(key: string, locale: Locale = 'en'): string {
  return commonTranslations[locale]?.[key] || commonTranslations.en[key] || key;
}

const i18nUtils = {
  localeConfig,
  getDirection,
  isRTL,
  formatCurrency,
  formatDate,
  formatNumber,
  formatRelativeTime,
  formatPercent,
  formatCompactNumber,
  formatList,
  applyDirection,
  applyLocale,
  t,
};

export default i18nUtils;
