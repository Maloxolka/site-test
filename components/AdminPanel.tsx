
import React, { useState } from 'react';
import { SiteContent, Review, Service, SiteDocument } from '../types';
import { IconTrash, IconCheck, IconSettings } from './Icons';

interface AdminPanelProps {
  content: SiteContent;
  onUpdateContent: (newContent: SiteContent) => void;
  reviews: Review[];
  onApproveReview: (id: string) => void;
  onDeleteReview: (id: string) => void;
  onClose: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ 
  content, 
  onUpdateContent, 
  reviews, 
  onApproveReview, 
  onDeleteReview,
  onClose 
}) => {
  const [localContent, setLocalContent] = useState<SiteContent>(content);
  const [newDocTitle, setNewDocTitle] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setLocalContent(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (name: 'heroImage' | 'aboutImage', e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLocalContent(prev => ({ ...prev, [name]: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleServiceChange = (id: string, field: keyof Service, value: string) => {
    setLocalContent(prev => ({
      ...prev,
      services: prev.services.map(s => s.id === id ? { ...s, [field]: value } : s)
    }));
  };

  const addDocument = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && newDocTitle) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newDoc: SiteDocument = {
          id: Date.now().toString(),
          title: newDocTitle,
          fileUrl: reader.result as string
        };
        setLocalContent(prev => ({
          ...prev,
          documents: [...prev.documents, newDoc]
        }));
        setNewDocTitle('');
      };
      reader.readAsDataURL(file);
    } else if (!newDocTitle) {
      alert("Введите название документа перед загрузкой файла.");
    }
  };

  const deleteDocument = (id: string) => {
    setLocalContent(prev => ({
      ...prev,
      documents: prev.documents.filter(d => d.id !== id)
    }));
  };

  const saveContent = () => {
    onUpdateContent(localContent);
    alert("Контент успешно сохранен!");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b flex justify-between items-center bg-blue-600 text-white">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <IconSettings /> Панель администратора
          </h2>
          <button onClick={onClose} className="hover:bg-blue-700 p-2 rounded-full transition-colors">
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-10">
          {/* Main Content Section */}
          <section>
            <h3 className="text-xl font-semibold mb-6 border-l-4 border-blue-600 pl-4">Главный экран и контакты</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Заголовок</label>
                  <input 
                    name="heroTitle"
                    value={localContent.heroTitle}
                    onChange={handleInputChange}
                    className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Главное изображение</label>
                  <div className="flex items-center gap-4">
                    <img src={localContent.heroImage} className="w-16 h-12 object-cover rounded border" alt="Preview" />
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => handleImageUpload('heroImage', e)}
                      className="text-xs"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Подзаголовок</label>
                  <textarea 
                    name="heroSubtitle"
                    value={localContent.heroSubtitle}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Телефон</label>
                  <input 
                    name="contactPhone"
                    value={localContent.contactPhone}
                    onChange={handleInputChange}
                    className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Адрес</label>
                  <input 
                    name="contactAddress"
                    value={localContent.contactAddress}
                    onChange={handleInputChange}
                    className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Изображение "О центре"</label>
                  <div className="flex items-center gap-4">
                    <img src={localContent.aboutImage} className="w-16 h-12 object-cover rounded border" alt="Preview" />
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => handleImageUpload('aboutImage', e)}
                      className="text-xs"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Documents Section */}
          <section>
            <h3 className="text-xl font-semibold mb-6 border-l-4 border-blue-600 pl-4">Документация (Лицензии и разрешения)</h3>
            <div className="bg-gray-50 p-6 rounded-xl space-y-4">
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <input 
                  type="text" 
                  placeholder="Название документа (напр. Лицензия №...)"
                  value={newDocTitle}
                  onChange={(e) => setNewDocTitle(e.target.value)}
                  className="flex-1 border p-2 rounded-lg"
                />
                <input 
                  type="file" 
                  accept=".pdf,image/*"
                  onChange={addDocument}
                  className="text-sm border p-1 rounded-lg bg-white"
                />
              </div>
              <div className="space-y-2">
                {localContent.documents.map(doc => (
                  <div key={doc.id} className="flex justify-between items-center p-3 bg-white border rounded-lg shadow-sm">
                    <span className="text-sm font-medium text-gray-700">{doc.title}</span>
                    <button 
                      onClick={() => deleteDocument(doc.id)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <IconTrash />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Services Section */}
          <section>
            <h3 className="text-xl font-semibold mb-6 border-l-4 border-blue-600 pl-4">Услуги</h3>
            <div className="grid grid-cols-1 gap-6">
              {localContent.services.map(service => (
                <div key={service.id} className="p-4 border rounded-xl bg-gray-50 flex flex-col md:flex-row gap-4">
                   <div className="flex-1">
                      <input 
                        value={service.title}
                        onChange={(e) => handleServiceChange(service.id, 'title', e.target.value)}
                        placeholder="Название услуги"
                        className="w-full font-bold bg-transparent border-b mb-2 focus:border-blue-500 outline-none"
                      />
                      <textarea 
                        value={service.description}
                        onChange={(e) => handleServiceChange(service.id, 'description', e.target.value)}
                        placeholder="Описание"
                        rows={2}
                        className="w-full text-sm bg-transparent outline-none focus:ring-1 focus:ring-blue-100 rounded"
                      />
                   </div>
                </div>
              ))}
            </div>
          </section>

          {/* Reviews Moderation Section */}
          <section>
            <h3 className="text-xl font-semibold mb-6 border-l-4 border-blue-600 pl-4">Управление отзывами</h3>
            <div className="space-y-4">
              {reviews.length === 0 ? (
                <p className="text-gray-500 italic">Отзывов пока нет.</p>
              ) : (
                reviews.map(review => (
                  <div key={review.id} className={`p-4 border rounded-xl flex justify-between items-start gap-4 ${review.approved ? 'bg-white' : 'bg-orange-50 border-orange-200'}`}>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold">{review.author}</span>
                        <span className="text-xs text-gray-400">{review.date}</span>
                        {!review.approved && (
                          <span className="text-[10px] bg-orange-200 text-orange-800 px-1.5 py-0.5 rounded uppercase font-bold tracking-wider">Новый</span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 italic">"{review.text}"</p>
                    </div>
                    <div className="flex gap-2">
                      {!review.approved && (
                        <button 
                          onClick={() => onApproveReview(review.id)}
                          className="bg-green-100 text-green-700 p-2 rounded-lg hover:bg-green-200 transition-colors"
                          title="Одобрить"
                        >
                          <IconCheck />
                        </button>
                      )}
                      <button 
                        onClick={() => onDeleteReview(review.id)}
                        className="bg-red-100 text-red-700 p-2 rounded-lg hover:bg-red-200 transition-colors"
                        title="Удалить"
                      >
                        <IconTrash />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>

        <div className="p-6 border-t bg-gray-50 flex justify-end gap-4">
          <button 
            onClick={onClose}
            className="px-6 py-2 border rounded-xl hover:bg-white transition-colors"
          >
            Отмена
          </button>
          <button 
            onClick={saveContent}
            className="px-10 py-2 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95"
          >
            Сохранить изменения
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
