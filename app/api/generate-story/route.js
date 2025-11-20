import { NextResponse } from 'next/server';
import { saveStory } from '@/lib/db';

export async function POST(request) {
  try {
    const body = await request.json();
    const { age, gender, interests, style, lesson } = body;

    const prompt = `اكتب قصة أطفال عربية جميلة قبل النوم بناءً على المعلومات التالية:

الفئة العمرية: ${age} سنوات
الجنس: ${gender === 'male' ? 'ولد' : 'بنت'}
مجالات الاهتمام: ${interests.join('، ')}
الأسلوب: ${style}
الدرس المراد تعليمه: ${lesson}

مهم جداً:
1. اكتب قصة جذابة ومناسبة للفئة العمرية المحددة، مع شخصيات محببة ونهاية سعيدة
2. يجب أن تحتوي القصة على قيم إسلامية أصيلة مثل: الرحمة، الإحسان، التوكل على الله، الأمانة، والأخلاق الحميدة
3. استخدم لغة عربية فصحى بسيطة ومفهومة تناسب الفئة العمرية
4. اجعل القصة طويلة وممتعة، بين 800-1000 كلمة على الأقل
5. قسّم القصة إلى عدة فصول أو مشاهد، وطوّر الشخصيات والأحداث بشكل جيد
6. تأكد من أن مستوى التعقيد والمفردات مناسبة للعمر

بعد كتابة القصة، في نهاية ردك، أضف سطرين منفصلين:
IMAGE_PROMPT_1: [وصف بالإنجليزية لمشهد كرتوني من بداية القصة - 30% من الأحداث]
IMAGE_PROMPT_2: [وصف بالإنجليزية لمشهد كرتوني من منتصف/نهاية القصة - 75% من الأحداث]

ملاحظة: وصف الصور يجب أن يكون بالإنجليزية، مفصل، ومناسب لأسلوب الرسوم المتحركة للأطفال (cartoon style).`;

    const apiKey = process.env.ANTHROPIC_API_KEY;
    
    if (!apiKey) {
      throw new Error('ANTHROPIC_API_KEY not configured');
    }

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01"
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

    if (!response.ok) {
      const errorData = await response.text();
      console.error('API Error:', response.status, errorData);
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    const fullText = data.content[0].text;
    
    // Extract image prompts
    const imagePrompt1Match = fullText.match(/IMAGE_PROMPT_1:\s*(.+)/);
    const imagePrompt2Match = fullText.match(/IMAGE_PROMPT_2:\s*(.+)/);
    
    // Remove image prompts from story text
    const storyText = fullText
      .replace(/IMAGE_PROMPT_1:.+/g, '')
      .replace(/IMAGE_PROMPT_2:.+/g, '')
      .trim();
    
    // Generate image URLs using Pollinations.ai
    const imageUrl1 = imagePrompt1Match 
      ? `https://image.pollinations.ai/prompt/${encodeURIComponent(imagePrompt1Match[1].trim() + ', cartoon style, children illustration, colorful, friendly')}`
      : null;
      
    const imageUrl2 = imagePrompt2Match 
      ? `https://image.pollinations.ai/prompt/${encodeURIComponent(imagePrompt2Match[1].trim() + ', cartoon style, children illustration, colorful, friendly')}`
      : null;
    
    // Save to database
    const storyId = saveStory({
      age,
      gender,
      interests,
      style,
      lesson,
      story: storyText,
      image1: imageUrl1,
      image2: imageUrl2
    });
    
    return NextResponse.json({ 
      story: storyText,
      images: {
        image1: imageUrl1,
        image2: imageUrl2
      },
      storyId
    });
  } catch (error) {
    console.error('Error generating story:', error);
    return NextResponse.json(
      { error: 'Failed to generate story', details: error.message },
      { status: 500 }
    );
  }
}