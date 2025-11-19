"use client";

import React, { useState } from 'react';
import { Sparkles, Moon, Star, BookOpen, Loader2, ArrowRight, ArrowLeft } from 'lucide-react';

export default function StoriesApp() {
  const [currentStep, setCurrentStep] = useState(1);
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

  const toggleInterest = (interest) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const canProceed = () => {
    switch(currentStep) {
      case 1: return formData.age !== '';
      case 2: return formData.gender !== '';
      case 3: return formData.interests.length > 0;
      case 4: return formData.style !== '';
      case 5: return formData.lesson !== '';
      default: return false;
    }
  };

  const nextStep = () => {
    if (canProceed() && currentStep < 5) {
      setCurrentStep(currentStep + 1);
    } else if (currentStep === 5 && canProceed()) {
      generateStory();
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const generateStory = async () => {
    setLoading(true);
    
    try {
      const response = await fetch("/api/generate-story", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Failed to generate story');
      }

      const data = await response.json();
      
      setStory(data.story);
      setCurrentStep(6);
    } catch (error) {
      console.error('Error generating story:', error);
      alert('حدث خطأ في إنشاء القصة. يرجى المحاولة مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setCurrentStep(1);
    setStory('');
    setFormData({
      age: '',
      gender: '',
      interests: [],
      style: '',
      lesson: ''
    });
  };

  const renderStep = () => {
    if (loading) {
      return (
        <div className="bg-white rounded-3xl shadow-xl shadow-purple-100/50 p-12 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mb-6">
            <Loader2 className="w-10 h-10 text-white animate-spin" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">جاري إنشاء القصة...</h2>
          <p className="text-gray-600">Creating your magical story...</p>
        </div>
      );
    }

    if (currentStep === 6) {
      return (
        <div className="bg-white rounded-3xl shadow-xl shadow-purple-100/50 overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-8 py-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl mb-4">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-1">قصتك الخاصة</h2>
            <p className="text-white/90">Your Special Story</p>
          </div>

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
      );
    }

    return (
      <div className="bg-white rounded-3xl shadow-xl shadow-purple-100/50 overflow-hidden">
        <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 px-8 py-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">
            {currentStep === 1 && 'اختر العمر'}
            {currentStep === 2 && 'اختر الجنس'}
            {currentStep === 3 && 'اختر الاهتمامات'}
            {currentStep === 4 && 'اختر الأسلوب'}
            {currentStep === 5 && 'اختر الدرس'}
          </h2>
          <p className="text-white/90 text-lg">
            {currentStep === 1 && 'Select Age Group'}
            {currentStep === 2 && 'Select Gender'}
            {currentStep === 3 && 'Select Interests'}
            {currentStep === 4 && 'Select Style'}
            {currentStep === 5 && 'Select Lesson'}
          </p>
          
          <div className="mt-6 flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map(step => (
              <div
                key={step}
                className={`h-2 rounded-full transition-all ${
                  step === currentStep ? 'w-8 bg-white' : 'w-2 bg-white/40'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="p-8 sm:p-12">
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { value: '3-5', label: '3-5 سنوات / years', emoji: '👶', color: 'from-blue-400 to-cyan-400' },
                  { value: '6-8', label: '6-8 سنوات / years', emoji: '🧒', color: 'from-green-400 to-emerald-400' },
                  { value: '9-11', label: '9-11 سنة / years', emoji: '👦', color: 'from-orange-400 to-amber-400' },
                  { value: '12+', label: '12+ سنة / years', emoji: '👨', color: 'from-purple-400 to-violet-400' }
                ].map(age => (
                  <button
                    key={age.value}
                    onClick={() => handleInputChange('age', age.value)}
                    className={`px-6 py-6 rounded-2xl font-medium transition-all flex items-center gap-4 ${
                      formData.age === age.value
                        ? `bg-gradient-to-r ${age.color} text-white shadow-xl scale-105`
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100 hover:scale-102'
                    }`}
                  >
                    <span className="text-3xl">{age.emoji}</span>
                    <span className="text-base font-semibold">{age.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  onClick={() => handleInputChange('gender', 'male')}
                  className={`px-8 py-8 rounded-2xl font-semibold text-lg transition-all ${
                    formData.gender === 'male'
                      ? 'bg-blue-500 text-white shadow-xl shadow-blue-200 scale-105'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100 hover:scale-102'
                  }`}
                >
                  <div className="text-4xl mb-3">👦</div>
                  ولد / Boy
                </button>
                <button
                  onClick={() => handleInputChange('gender', 'female')}
                  className={`px-8 py-8 rounded-2xl font-semibold text-lg transition-all ${
                    formData.gender === 'female'
                      ? 'bg-pink-500 text-white shadow-xl shadow-pink-200 scale-105'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100 hover:scale-102'
                  }`}
                >
                  <div className="text-4xl mb-3">👧</div>
                  بنت / Girl
                </button>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-4">
              <p className="text-center text-gray-600 mb-6">اختر واحد أو أكثر / Select one or more</p>
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
                    className={`px-4 py-4 rounded-xl text-sm font-medium transition-all flex flex-col items-center gap-2 ${
                      formData.interests.includes(interest.value)
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg scale-105'
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span className="text-2xl">{interest.emoji}</span>
                    <span className="text-xs text-center leading-tight">{interest.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                    className={`px-6 py-6 rounded-xl font-medium transition-all flex items-center justify-center gap-3 ${
                      formData.style === option.value
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-xl scale-105'
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100 hover:scale-102'
                    }`}
                  >
                    <span className="text-3xl">{option.emoji}</span>
                    <span className="text-base">{option.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {currentStep === 5 && (
            <div className="space-y-4">
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
                    className={`px-5 py-5 rounded-xl text-sm font-medium transition-all flex items-center gap-3 ${
                      formData.lesson === lesson.value
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg scale-105'
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span className="text-2xl">{lesson.emoji}</span>
                    <span className="text-sm">{lesson.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-10 flex gap-4">
            {currentStep > 1 && (
              <button
                onClick={prevStep}
                className="px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all flex items-center gap-2"
              >
                <ArrowLeft className="w-5 h-5" />
                رجوع / Back
              </button>
            )}
            <button
              onClick={nextStep}
              disabled={!canProceed()}
              className={`flex-1 px-6 py-4 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2 ${
                !canProceed()
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]'
              }`}
            >
              {currentStep === 5 ? (
                <>
                  <Sparkles className="w-5 h-5" />
                  اصنع قصتي / Create My Story
                </>
              ) : (
                <>
                  التالي / Next
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {renderStep()}
        {currentStep !== 6 && (
          <div className="mt-8 text-center text-sm text-gray-500">
            <p>قصص مخصصة لطفلك مع القيم الإسلامية</p>
            <p className="mt-1">Personalized stories with Islamic values</p>
          </div>
        )}
      </div>
    </div>
  );
}