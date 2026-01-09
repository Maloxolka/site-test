
import { SiteContent, Review } from './types';

export const INITIAL_CONTENT: SiteContent = {
  heroTitle: "Возвращаем радость движения",
  heroSubtitle: "Индивидуальное протезирование верхних и нижних конечностей с использованием передовых технологий и заботой о каждом пациенте.",
  heroImage: "https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?auto=format&fit=crop&q=80&w=1000",
  aboutText: "Наш центр — это команда профессионалов с многолетним опытом. Мы не просто создаем протезы, мы помогаем людям вернуться к активной жизни. Используем только сертифицированные комплектующие от ведущих мировых производителей.",
  aboutImage: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=1000",
  contactPhone: "+7 (999) 123-45-67",
  contactAddress: "г. Москва, ул. Протезная, д. 42, офис 101",
  services: [
    {
      id: '1',
      title: "Протезирование ног",
      description: "От стопы до бедра. Индивидуальный подбор гильзы и коленного модуля.",
      icon: "Leg"
    },
    {
      id: '2',
      title: "Протезирование рук",
      description: "Косметические, тяговые и современные бионические протезы.",
      icon: "Hand"
    },
    {
      id: '3',
      title: "Реабилитация",
      description: "Школа ходьбы и адаптации. Обучение пользованию протезом с нуля.",
      icon: "Activity"
    }
  ],
  documents: [
    {
      id: 'doc1',
      title: "Лицензия на осуществление медицинской деятельности",
      fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
    },
    {
      id: 'doc2',
      title: "Сертификат соответствия ГОСТ Р ИСО",
      fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
    }
  ]
};

export const INITIAL_REVIEWS: Review[] = [
  {
    id: '1',
    author: "Александр В.",
    text: "Спасибо огромное команде центра! Вернули меня к нормальной жизни. Протез сидит как влитой.",
    rating: 5,
    date: "2023-10-15",
    approved: true
  },
  {
    id: '2',
    author: "Марина К.",
    text: "Очень внимательное отношение к деталям. Все объяснили, подобрали идеальный вариант для моих задач.",
    rating: 5,
    date: "2023-11-02",
    approved: true
  }
];
