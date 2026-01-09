
import React, { useState, useEffect } from 'react';
import { SiteContent, Review, Service } from './types';
import { INITIAL_CONTENT, INITIAL_REVIEWS } from './constants';
import { IconLeg, IconHand, IconActivity, IconSettings, IconStar } from './components/Icons';
import AdminPanel from './components/AdminPanel';

const App: React.FC = () => {
  const [content, setContent] = useState<SiteContent>(INITIAL_CONTENT);
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [newReview, setNewReview] = useState({ author: '', text: '', rating: 5 });
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const savedContent = localStorage.getItem('prosto_center_content');
    const savedReviews = localStorage.getItem('prosto_center_reviews');
    if (savedContent) setContent(JSON.parse(savedContent));
    if (savedReviews) setReviews(JSON.parse(savedReviews));

    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAdminAccess = () => {
    const password = prompt("Введите пароль администратора:");
    if (password === "admin123") { // В проде здесь должен быть реальный механизм, для статики — заглушка
      setIsAdminOpen(true);
    } else if (password !== null) {
      alert("Неверный пароль");
    }
  };

  const updateContent = (newContent: SiteContent) => {
    setContent(newContent);
    localStorage.setItem('prosto_center_content', JSON.stringify(newContent));
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.author || !newReview.text) return;

    const review: Review = {
      id: Date.now().toString(),
      author: newReview.author,
      text: newReview.text,
      rating: newReview.rating,
      date: new Date().toLocaleDateString('ru-RU'),
      approved: false
    };

    const updated = [...reviews, review];
    setReviews(updated);
    localStorage.setItem('prosto_center_reviews', JSON.stringify(updated));
    setNewReview({ author: '', text: '', rating: 5 });
    alert("Спасибо! Ваш отзыв отправлен на модерацию.");
  };

  const approveReview = (id: string) => {
    const updated = reviews.map(r => r.id === id ? { ...r, approved: true } : r);
    setReviews(updated);
    localStorage.setItem('prosto_center_reviews', JSON.stringify(updated));
  };

  const deleteReview = (id: string) => {
    const updated = reviews.filter(r => r.id !== id);
    setReviews(updated);
    localStorage.setItem('prosto_center_reviews', JSON.stringify(updated));
  };

  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'Leg': return <IconLeg />;
      case 'Hand': return <IconHand />;
      case 'Activity': return <IconActivity />;
      default: return <IconActivity />;
    }
  };

  const approvedReviews = reviews.filter(r => r.approved);

  return (
    <div className="min-h-screen flex flex-col selection:bg-blue-100 selection:text-blue-900">
      <header className={`fixed top-0 w-full z-40 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-md py-3' : 'bg-transparent py-6'}`}>
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-2 group cursor-pointer" onClick={() => window.scrollTo(0,0)}>
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-200 group-hover:scale-110 transition-transform">P</div>
            <span className="text-xl font-bold tracking-tight text-gray-900">
              Prosto<span className="text-blue-600">Center</span>
            </span>
          </div>
          
          <nav className="hidden md:flex items-center gap-8">
            {['Услуги', 'О центре', 'Документы', 'Отзывы', 'Контакты'].map((item) => (
              <a 
                key={item} 
                href={`#${item.toLowerCase().replace(' ', '')}`} 
                className="text-sm font-semibold text-gray-600 hover:text-blue-600 transition-colors relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-0.5 after:bg-blue-600 after:transition-all hover:after:w-full"
              >
                {item}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <button 
              onClick={handleAdminAccess}
              className="p-2 text-gray-400 hover:text-blue-600 transition-colors rounded-full hover:bg-blue-50"
              title="Панель управления"
            >
              <IconSettings />
            </button>
            <a 
              href={`tel:${content.contactPhone}`}
              className="hidden lg:block bg-blue-600 text-white px-6 py-2.5 rounded-full font-bold text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 active:scale-95"
            >
              {content.contactPhone}
            </a>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 md:pt-48 md:pb-40 bg-white overflow-hidden">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-50/50 skew-x-12 translate-x-1/4 -z-10"></div>
          <div className="container mx-auto px-6 flex flex-col md:flex-row items-center gap-16">
            <div className="flex-1 text-center md:text-left z-10">
              <span className="inline-block px-4 py-1.5 bg-blue-100 text-blue-700 rounded-full text-xs font-bold uppercase tracking-widest mb-6">Ваш путь к движению</span>
              <h1 className="text-5xl md:text-7xl font-black text-gray-900 leading-[1.1] mb-8">
                {content.heroTitle}
              </h1>
              <p className="text-xl text-gray-600 mb-10 max-w-xl leading-relaxed">
                {content.heroSubtitle}
              </p>
              <div className="flex flex-col sm:flex-row gap-5 justify-center md:justify-start">
                <a href="#услуги" className="bg-blue-600 text-white px-10 py-5 rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all shadow-2xl shadow-blue-200 active:scale-95 flex items-center justify-center">
                  Наши услуги
                </a>
                <a href="#контакты" className="bg-white text-gray-900 border border-gray-200 px-10 py-5 rounded-2xl font-bold text-lg hover:bg-gray-50 transition-all active:scale-95 flex items-center justify-center">
                  Связаться с нами
                </a>
              </div>
            </div>
            <div className="flex-1 w-full max-w-xl">
              <div className="relative">
                <div className="absolute -inset-4 bg-blue-600/10 rounded-[2rem] blur-2xl"></div>
                <img 
                  src={content.heroImage} 
                  alt="Prosthetics Technology" 
                  className="relative rounded-[2.5rem] shadow-2xl object-cover aspect-square w-full border-8 border-white"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section id="услуги" className="py-28 bg-gray-50">
          <div className="container mx-auto px-6">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-black mb-6">Наши услуги</h2>
              <div className="w-24 h-2 bg-blue-600 mx-auto rounded-full"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {content.services.map(service => (
                <div key={service.id} className="group p-10 border border-transparent rounded-[2.5rem] bg-white hover:shadow-2xl hover:shadow-blue-100 transition-all duration-500 hover:-translate-y-2">
                  <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mb-8 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 rotate-3 group-hover:rotate-0">
                    <div className="scale-150">{renderIcon(service.icon)}</div>
                  </div>
                  <h3 className="text-2xl font-bold mb-5 text-gray-900">{service.title}</h3>
                  <p className="text-gray-600 leading-relaxed text-lg">
                    {service.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="оцентре" className="py-28 bg-white">
          <div className="container mx-auto px-6">
            <div className="flex flex-col lg:flex-row items-center gap-20">
              <div className="flex-1">
                <div className="relative">
                   <img 
                    src={content.aboutImage} 
                    alt="Center Interior" 
                    className="rounded-[3rem] shadow-2xl w-full border-4 border-white"
                  />
                  <div className="absolute -bottom-10 -right-10 bg-blue-600 text-white p-10 rounded-[2rem] shadow-2xl hidden md:block">
                    <div className="text-5xl font-black mb-1">100%</div>
                    <div className="text-sm font-bold opacity-80 uppercase tracking-widest">Качество жизни</div>
                  </div>
                </div>
              </div>
              <div className="flex-1">
                <h2 className="text-4xl md:text-5xl font-black mb-8">Почему выбирают нас?</h2>
                <p className="text-xl text-gray-600 leading-relaxed mb-12">
                  {content.aboutText}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="p-8 bg-gray-50 rounded-3xl border border-gray-100 flex items-start gap-4">
                    <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center shrink-0">✓</div>
                    <div>
                       <div className="text-2xl font-black text-blue-600">10+ лет</div>
                       <div className="text-gray-500 font-bold text-sm uppercase">Опыта в РФ</div>
                    </div>
                  </div>
                  <div className="p-8 bg-gray-50 rounded-3xl border border-gray-100 flex items-start gap-4">
                    <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center shrink-0">✓</div>
                    <div>
                       <div className="text-2xl font-black text-blue-600">500+</div>
                       <div className="text-gray-500 font-bold text-sm uppercase">Довольных лиц</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Documents Section */}
        <section id="документы" className="py-28 bg-blue-600 text-white overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-500 to-transparent opacity-50"></div>
          <div className="container mx-auto px-6 relative z-10">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-black mb-6">Документы и лицензии</h2>
              <div className="w-24 h-2 bg-white mx-auto rounded-full"></div>
              <p className="mt-8 text-blue-100 text-lg max-w-2xl mx-auto">Мы работаем открыто и профессионально. Здесь вы можете ознакомиться со всеми нашими разрешениями.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {content.documents.map(doc => (
                <a 
                  key={doc.id} 
                  href={doc.fileUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center p-8 bg-white/10 backdrop-blur-md border border-white/20 rounded-[2rem] hover:bg-white/20 transition-all group"
                >
                  <div className="w-14 h-14 bg-white text-blue-600 rounded-2xl flex items-center justify-center mr-5 group-hover:scale-110 transition-transform">
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-white text-lg leading-tight mb-2">{doc.title}</h4>
                    <span className="text-xs text-blue-200 font-bold uppercase tracking-wider">Открыть документ</span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Reviews Section */}
        <section id="отзывы" className="py-28 bg-white">
          <div className="container mx-auto px-6">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-black mb-6">Что о нас говорят</h2>
              <div className="w-24 h-2 bg-blue-600 mx-auto rounded-full"></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
              <div className="space-y-8">
                {approvedReviews.map(review => (
                  <div key={review.id} className="p-10 border border-gray-100 rounded-[2.5rem] bg-gray-50/50 hover:bg-white hover:shadow-2xl transition-all duration-500">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <h4 className="font-black text-xl text-gray-900">{review.author}</h4>
                        <div className="flex gap-1 mt-2">
                          {[...Array(5)].map((_, i) => (
                            <IconStar key={i} filled={i < review.rating} />
                          ))}
                        </div>
                      </div>
                      <span className="text-sm text-gray-400 font-bold">{review.date}</span>
                    </div>
                    <p className="text-gray-600 italic text-lg leading-relaxed">
                      "{review.text}"
                    </p>
                  </div>
                ))}
                {approvedReviews.length === 0 && (
                  <div className="p-20 border-4 border-dashed border-gray-100 rounded-[3rem] text-center text-gray-400 font-bold italic">
                    Отзывов пока нет. Будьте первыми!
                  </div>
                )}
              </div>

              <div className="bg-gray-900 rounded-[3rem] p-12 text-white shadow-3xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 rounded-full blur-3xl"></div>
                <h3 className="text-3xl font-black mb-8">Поделитесь опытом</h3>
                <form onSubmit={handleReviewSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold mb-2 text-gray-400 uppercase tracking-widest">Ваше имя</label>
                    <input 
                      type="text" 
                      required
                      value={newReview.author}
                      onChange={(e) => setNewReview(prev => ({ ...prev, author: e.target.value }))}
                      className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl focus:outline-none focus:border-blue-500 transition-colors text-white"
                      placeholder="Иван Иванов"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-2 text-gray-400 uppercase tracking-widest">Текст отзыва</label>
                    <textarea 
                      required
                      rows={4}
                      value={newReview.text}
                      onChange={(e) => setNewReview(prev => ({ ...prev, text: e.target.value }))}
                      className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl focus:outline-none focus:border-blue-500 transition-colors text-white"
                      placeholder="Расскажите вашу историю..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-3 text-gray-400 uppercase tracking-widest">Ваша оценка</label>
                    <div className="flex gap-3">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button 
                          key={star}
                          type="button"
                          onClick={() => setNewReview(prev => ({ ...prev, rating: star }))}
                          className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold transition-all ${newReview.rating >= star ? 'bg-yellow-400 text-gray-900 scale-110' : 'bg-white/10 text-gray-500 hover:bg-white/20'}`}
                        >
                          {star}
                        </button>
                      ))}
                    </div>
                  </div>
                  <button 
                    type="submit"
                    className="w-full bg-blue-600 text-white font-black py-5 rounded-2xl hover:bg-blue-700 transition-all active:scale-95 shadow-xl shadow-blue-900/20 text-lg"
                  >
                    Опубликовать отзыв
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* Contacts Section */}
        <section id="контакты" className="py-28 bg-gray-50 border-t border-gray-100">
          <div className="container mx-auto px-6">
            <div className="bg-white rounded-[4rem] shadow-xl overflow-hidden flex flex-col lg:flex-row border border-gray-100">
              <div className="lg:w-1/2 p-16 md:p-24 bg-blue-600 text-white">
                <h2 className="text-4xl md:text-5xl font-black mb-10">Ждем вас в гости</h2>
                <div className="space-y-10">
                  <div className="flex gap-6 items-start">
                    <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center shrink-0">
                       <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                    </div>
                    <div>
                      <h4 className="text-xl font-bold mb-2">Наш адрес</h4>
                      <p className="text-blue-100 text-lg opacity-80">{content.contactAddress}</p>
                    </div>
                  </div>
                  <div className="flex gap-6 items-start">
                    <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center shrink-0">
                       <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                    </div>
                    <div>
                      <h4 className="text-xl font-bold mb-2">Телефон</h4>
                      <p className="text-3xl font-black">{content.contactPhone}</p>
                    </div>
                  </div>
                  <div className="pt-10 border-t border-white/10 grid grid-cols-2 gap-8">
                    <div>
                      <h5 className="font-bold uppercase tracking-widest text-xs opacity-60 mb-2">Пн — Пт</h5>
                      <p className="text-xl font-bold">09:00 – 19:00</p>
                    </div>
                    <div>
                      <h5 className="font-bold uppercase tracking-widest text-xs opacity-60 mb-2">Суббота</h5>
                      <p className="text-xl font-bold">10:00 – 16:00</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="lg:w-1/2 bg-gray-100 relative min-h-[400px]">
                {/* Здесь можно интегрировать карту, например Google Maps или Yandex Maps. Пока — качественная заглушка */}
                <img 
                  src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&q=80&w=1200" 
                  className="w-full h-full object-cover grayscale opacity-50" 
                  alt="Map Placeholder" 
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-white p-8 rounded-3xl shadow-2xl text-center">
                     <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white mx-auto mb-4 animate-bounce">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/></svg>
                     </div>
                     <p className="font-black text-gray-900">Приходите к нам!</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-950 text-white pt-24 pb-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 border-b border-white/5 pb-16">
            <div className="col-span-1 lg:col-span-1">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">P</div>
                <span className="text-2xl font-black">ProstoCenter</span>
              </div>
              <p className="text-gray-500 leading-relaxed mb-8 text-lg">
                Мы используем передовые технологии протезирования, чтобы вернуть людям возможность жить полной и активной жизнью.
              </p>
            </div>
            
            <div>
              <h4 className="font-black text-lg mb-8 uppercase tracking-widest text-blue-500">Навигация</h4>
              <ul className="space-y-5 text-gray-400 font-medium">
                <li><a href="#услуги" className="hover:text-white transition-colors">Все услуги</a></li>
                <li><a href="#оцентре" className="hover:text-white transition-colors">История центра</a></li>
                <li><a href="#документы" className="hover:text-white transition-colors">Лицензии</a></li>
                <li><a href="#отзывы" className="hover:text-white transition-colors">Отзывы клиентов</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-black text-lg mb-8 uppercase tracking-widest text-blue-500">Связаться</h4>
              <ul className="space-y-5 text-gray-400 font-medium">
                <li className="flex gap-3 items-start"><span className="text-blue-500 shrink-0">📍</span> {content.contactAddress}</li>
                <li className="flex gap-3 items-center text-white text-xl font-bold"><span className="text-blue-500 shrink-0">📞</span> {content.contactPhone}</li>
                <li className="flex gap-3 items-center"><span className="text-blue-500 shrink-0">✉️</span> hello@prostocenter.ru</li>
              </ul>
            </div>

            <div>
              <h4 className="font-black text-lg mb-8 uppercase tracking-widest text-blue-500">Соцсети</h4>
              <div className="flex gap-4">
                {['VK', 'TG', 'WA'].map(social => (
                  <a key={social} href="#" className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center hover:bg-blue-600 transition-all font-black hover:-translate-y-1">
                    {social}
                  </a>
                ))}
              </div>
            </div>
          </div>
          
          <div className="pt-12 flex flex-col md:flex-row justify-between items-center gap-8 text-gray-600 text-sm font-bold">
            <p>© 2024 Центр протезирования ProstoCenter. Все права защищены.</p>
            <div className="flex gap-10">
              <a href="#" className="hover:text-white transition-colors uppercase tracking-widest">Privacy Policy</a>
              <button onClick={handleAdminAccess} className="hover:text-white transition-colors uppercase tracking-widest">Admin</button>
            </div>
          </div>
        </div>
      </footer>

      {isAdminOpen && (
        <AdminPanel 
          content={content}
          onUpdateContent={updateContent}
          reviews={reviews}
          onApproveReview={approveReview}
          onDeleteReview={deleteReview}
          onClose={() => setIsAdminOpen(false)}
        />
      )}
    </div>
  );
};

export default App;
