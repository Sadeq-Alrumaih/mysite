"use client";
import React, { useState } from 'react';
import { Sparkles, Moon, Star, BookOpen, Loader2 } from 'lucide-react';

export default function ArabicStoriesApp() {
  const [step, setStep] = useState('form'); // 'form' or 'story'
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    age: '',
    gender: '',
    interests: [],
    style: '',
    lesson: ''
  });
  const [story, setStory] = useState('');

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const isFormValid = () => {
    return formData.age && formData.gender && formData.interests.length > 0 && 
           formData.style && formData.lesson;
  };

  const toggleInterest = (interest) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const generateStory = async () => {
    if (!isFormValid()) return;

    setLoading(true);
    
    try {
      const prompt = `اكتب قصة أطفال عربية جميلة قبل النوم بناءً على المعلومات التالية:

الفئة العمرية: ${formData.age} سنوات
الجنس: ${formData.gender === 'male' ? 'ولد' : 'بنت'}
مجالات الاهتمام: ${formData.interests.join('، ')}
الأسلوب: ${formData.style}
الدرس المراد تعليمه: ${formData.lesson}

اكتب قصة جذابة ومناسبة للفئة العمرية المحددة، مع شخصيات محببة ونهاية سعيدة تعلم الدرس المطلوب. استخدم لغة عربية فصحى بسيطة ومفهومة تناسب الفئة العمرية. 

مهم جداً: اجعل القصة طويلة وممتعة، يجب أن تكون بين 800-1000 كلمة على الأقل. قسّم القصة إلى عدة فصول أو مشاهد، وطوّر الشخصيات والأحداث بشكل جيد. تأكد من أن مستوى التعقيد والمفردات مناسبة للعمر.`;

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 4000,
          messages: [
            { 
              role: "user", 
              content: prompt
            }
          ]
        })
      });

      const data = await response.json();
      const storyText = data.content[0].text;
      
      setStory(storyText);
      setStep('story');
    } catch (error) {
      console.error('Error generating story:', error);
      alert('حدث خطأ في إنشاء القصة. يرجى المحاولة مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setStep('form');
    setStory('');
    setFormData({
      age: '',
      gender: '',
      interests: [],
      style: '',
      lesson: ''
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-purple-100 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-2 rounded-xl">
              <Moon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">قصص ما قبل النوم</h1>
              <p className="text-sm text-gray-500">Arabic Bedtime Stories</p>
            </div>
          </div>
          <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        {step === 'form' ? (
          <div className="bg-white rounded-3xl shadow-xl shadow-purple-100/50 overflow-hidden">
            {/* Form Header */}
            <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 px-8 py-10 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl mb-4">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">
                دعنا نصنع قصة خاصة
              </h2>
              <p className="text-white/90 text-lg">
                Let's create a special story for your child
              </p>
            </div>

            {/* Form Fields */}
            <div className="p-8 space-y-6">
              {/* Age */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  العمر / Age *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {[
                    { value: '3-5', label: '3-5 سنوات / years', emoji: '👶', color: 'from-blue-400 to-cyan-400' },
                    { value: '6-8', label: '6-8 سنوات / years', emoji: '🧒', color: 'from-green-400 to-emerald-400' },
                    { value: '9-11', label: '9-11 سنة / years', emoji: '👦', color: 'from-orange-400 to-amber-400' },
                    { value: '12+', label: '12+ سنة / years', emoji: '👨', color: 'from-purple-400 to-violet-400' }
                  ].map(age => (
                    <button
                      key={age.value}
                      onClick={() => handleInputChange('age', age.value)}
                      className={`px-5 py-4 rounded-xl font-medium transition-all flex items-center gap-3 ${
                        formData.age === age.value
                          ? `bg-gradient-to-r ${age.color} text-white shadow-lg scale-105`
                          : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <span className="text-2xl">{age.emoji}</span>
                      <span className="text-sm font-semibold">{age.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Gender */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  الجنس / Gender *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleInputChange('gender', 'male')}
                    className={`px-6 py-3 rounded-xl font-medium transition-all ${
                      formData.gender === 'male'
                        ? 'bg-blue-500 text-white shadow-lg shadow-blue-200'
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    ولد / Boy
                  </button>
                  <button
                    onClick={() => handleInputChange('gender', 'female')}
                    className={`px-6 py-3 rounded-xl font-medium transition-all ${
                      formData.gender === 'female'
                        ? 'bg-pink-500 text-white shadow-lg shadow-pink-200'
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    بنت / Girl
                  </button>
                </div>
              </div>

              {/* Interests */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  مجالات الاهتمام / Interests * <span className="text-xs text-gray-500">(اختر واحد أو أكثر)</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { value: 'animals', label: 'حيوانات / Animals', emoji: '🐾' },
                    { value: 'space', label: 'فضاء / Space', emoji: '🚀' },
                    { value: 'nature', label: 'طبيعة / Nature', emoji: '🌳' },
                    { value: 'sports', label: 'رياضة / Sports', emoji: '⚽' },
                    { value: 'ocean', label: 'بحر / Ocean', emoji: '🌊' },
                    { value: 'dinosaurs', label: 'ديناصورات / Dinosaurs', emoji: '🦕' },
                    { value: 'magic', label: 'سحر / Magic', emoji: '✨' },
                    { value: 'vehicles', label: 'مركبات / Vehicles', emoji: '🚗' },
                    { value: 'cooking', label: 'طبخ / Cooking', emoji: '👨‍🍳' },
                    { value: 'music', label: 'موسيقى / Music', emoji: '🎵' },
                    { value: 'art', label: 'فن / Art', emoji: '🎨' },
                    { value: 'robots', label: 'روبوتات / Robots', emoji: '🤖' }
                  ].map(interest => (
                    <button
                      key={interest.value}
                      onClick={() => toggleInterest(interest.value)}
                      className={`px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
                        formData.interests.includes(interest.value)
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                          : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <span>{interest.emoji}</span>
                      <span className="text-xs leading-tight">{interest.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Style */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  الأسلوب / Style *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { value: 'funny', label: 'مضحك / Funny', emoji: '😄' },
                    { value: 'serious', label: 'جاد / Serious', emoji: '🎯' },
                    { value: 'adventurous', label: 'مغامرة / Adventure', emoji: '🗺️' },
                    { value: 'magical', label: 'سحري / Magical', emoji: '🪄' },
                    { value: 'mystery', label: 'غموض / Mystery', emoji: '🔍' },
                    { value: 'heartwarming', label: 'مؤثر / Heartwarming', emoji: '💝' }
                  ].map(option => (
                    <button
                      key={option.value}
                      onClick={() => handleInputChange('style', option.value)}
                      className={`px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                        formData.style === option.value
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                          : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <span>{option.emoji}</span>
                      <span className="text-xs">{option.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Lesson */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  الدرس المراد تعليمه / Lesson to Teach *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { value: 'honesty', label: 'الصدق / Honesty', emoji: '🤝' },
                    { value: 'kindness', label: 'اللطف / Kindness', emoji: '💗' },
                    { value: 'courage', label: 'الشجاعة / Courage', emoji: '🦁' },
                    { value: 'sharing', label: 'المشاركة / Sharing', emoji: '🤲' },
                    { value: 'respect', label: 'الاحترام / Respect', emoji: '🙏' },
                    { value: 'perseverance', label: 'المثابرة / Perseverance', emoji: '💪' },
                    { value: 'friendship', label: 'الصداقة / Friendship', emoji: '👫' },
                    { value: 'gratitude', label: 'الامتنان / Gratitude', emoji: '🙌' },
                    { value: 'patience', label: 'الصبر / Patience', emoji: '⏳' },
                    { value: 'responsibility', label: 'المسؤولية / Responsibility', emoji: '⭐' },
                    { value: 'empathy', label: 'التعاطف / Empathy', emoji: '🤗' },
                    { value: 'forgiveness', label: 'التسامح / Forgiveness', emoji: '🕊️' }
                  ].map(lesson => (
                    <button
                      key={lesson.value}
                      onClick={() => handleInputChange('lesson', lesson.value)}
                      className={`px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
                        formData.lesson === lesson.value
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                          : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <span>{lesson.emoji}</span>
                      <span className="text-xs">{lesson.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <button
                onClick={generateStory}
                disabled={!isFormValid() || loading}
                className={`w-full py-4 rounded-xl font-bold text-white transition-all ${
                  !isFormValid() || loading
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]'
                }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    جاري إنشاء القصة...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    اصنع قصتي / Create My Story
                  </span>
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl shadow-xl shadow-purple-100/50 overflow-hidden">
            {/* Story Header */}
            <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-8 py-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl mb-4">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-1">
                قصتك الخاصة
              </h2>
              <p className="text-white/90">Your Special Story</p>
            </div>

            {/* Story Content */}
            <div className="p-8 sm:p-12">
              <div 
                dir="rtl" 
                className="prose prose-lg max-w-none text-gray-800 leading-relaxed"
                style={{ 
                  fontFamily: 'system-ui, -apple-system, sans-serif',
                  lineHeight: '2',
                  fontSize: '1.125rem'
                }}
              >
                {story.split('\n').map((paragraph, index) => (
                  paragraph.trim() && (
                    <p key={index} className="mb-6">
                      {paragraph}
                    </p>
                  )
                ))}
              </div>

              {/* Action Buttons */}
              <div className="mt-10 pt-8 border-t border-gray-100 flex gap-4">
                <button
                  onClick={resetForm}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  قصة جديدة / New Story
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  طباعة / Print
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>قصص مخصصة لطفلك مع الذكاء الاصطناعي</p>
          <p className="mt-1">Personalized stories powered by AI</p>
        </div>
      </div>
    </div>
  );
}
