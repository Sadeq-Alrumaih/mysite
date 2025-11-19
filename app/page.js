"use client";

import React, { useState } from 'react';
import { Moon, Star, BookOpen, Sparkles, Home } from 'lucide-react';
import StoriesApp from './components/StoriesApp';

export default function MainApp() {
  const [currentSection, setCurrentSection] = useState('home'); // 'home', 'stories', 'temp'

  const renderHome = () => (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl mb-6 shadow-xl">
            <Moon className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            مرحباً بك في عالم القصص
          </h1>
          <p className="text-xl text-gray-600 mb-2">Welcome to the World of Stories</p>
          <p className="text-gray-500 max-w-2xl mx-auto mt-4">
            استكشف عالماً من القصص المخصصة لأطفالك مع القيم الإسلامية الأصيلة
          </p>
        </div>

        {/* Sections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Stories Section */}
          <button
            onClick={() => setCurrentSection('stories')}
            className="group bg-white rounded-3xl shadow-xl shadow-purple-100/50 p-8 hover:scale-105 transition-all duration-300 text-left"
          >
            <div className="bg-gradient-to-br from-purple-500 to-pink-500 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">
              قصص ما قبل النوم
            </h2>
            <p className="text-gray-600 mb-2">Bedtime Stories</p>
            <p className="text-sm text-gray-500 leading-relaxed">
              قصص عربية مخصصة لطفلك بناءً على عمره واهتماماته مع قيم إسلامية أصيلة
            </p>
            <div className="mt-6 flex items-center gap-2 text-purple-600 font-semibold">
              <span>ابدأ الآن</span>
              <Sparkles className="w-4 h-4" />
            </div>
          </button>

          {/* Temp Section - Placeholder */}
          <button
            onClick={() => setCurrentSection('temp')}
            className="group bg-white rounded-3xl shadow-xl shadow-purple-100/50 p-8 hover:scale-105 transition-all duration-300 text-left opacity-60 cursor-not-allowed"
            disabled
          >
            <div className="bg-gradient-to-br from-gray-400 to-gray-500 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
              <Star className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">
              قريباً
            </h2>
            <p className="text-gray-600 mb-2">Coming Soon</p>
            <p className="text-sm text-gray-500 leading-relaxed">
              المزيد من المحتوى الرائع قادم قريباً
            </p>
            <div className="mt-6 flex items-center gap-2 text-gray-500 font-semibold">
              <span>قريباً</span>
            </div>
          </button>
        </div>

        {/* Footer */}
        <div className="mt-16 text-center text-sm text-gray-500">
          <p>منصة تعليمية للأطفال مع القيم الإسلامية</p>
          <p className="mt-1">Educational platform for children with Islamic values</p>
        </div>
      </div>
    </div>
  );

  const renderTemp = () => (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-gray-400 to-gray-500 rounded-3xl mb-6">
          <Star className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-gray-800 mb-4">قريباً</h1>
        <p className="text-xl text-gray-600 mb-8">Coming Soon</p>
        <button
          onClick={() => setCurrentSection('home')}
          className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all"
        >
          العودة للرئيسية / Back to Home
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Top Navigation Bar */}
      {currentSection !== 'home' && (
        <div className="bg-white/80 backdrop-blur-sm border-b border-purple-100 sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <button
              onClick={() => setCurrentSection('home')}
              className="flex items-center gap-2 text-gray-700 hover:text-purple-600 transition-colors"
            >
              <Home className="w-5 h-5" />
              <span className="font-semibold">الرئيسية / Home</span>
            </button>
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-2 rounded-xl">
                <Moon className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-800">
                  {currentSection === 'stories' && 'قصص ما قبل النوم'}
                  {currentSection === 'temp' && 'قريباً'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      {currentSection === 'home' && renderHome()}
      {currentSection === 'stories' && <StoriesApp />}
      {currentSection === 'temp' && renderTemp()}
    </>
  );
}