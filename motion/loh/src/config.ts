import {z} from 'zod';
import {zColor} from '@remotion/zod-types';

/**
 * Control panel — every field below appears as an editable form in Remotion Studio
 * (right-hand "Props" panel): text inputs, color pickers, sliders.
 */
export const schema = z.object({
  yellow: zColor().describe('اللون الأصفر (الخلفية)'),
  brown: zColor().describe('اللون البني (الخط)'),

  hook: z.string().describe('المشهد 1: سؤال البداية'),
  hookHighlight: z.string().describe('المشهد 1: الكلمة المظللة'),

  line1: z.string().describe('المشهد 3: السطر الأول'),
  line1Highlight: z.string(),
  line2: z.string().describe('المشهد 3: السطر الثاني'),

  problems: z.string().describe('المشهد 4: النص'),
  bigWordStart: z.string().describe('المشهد 4: بداية الكلمة الممطوطة'),
  bigWordEnd: z.string().describe('المشهد 4: نهاية الكلمة الممطوطة'),

  captions: z
    .array(z.object({text: z.string(), highlight: z.string()}))
    .length(5)
    .describe('المشهد 5: عناوين الشرح فوق الجوال (5)'),

  formCompany: z.string().describe('النموذج: اسم الشركة'),
  formPerson: z.string().describe('النموذج: اسم المسؤول'),
  formPhone: z.string().describe('النموذج: الجوال'),
  formEmail: z.string().describe('النموذج: الإيميل'),
  sentText: z.string().describe('رسالة بعد الإرسال'),

  tagline: z.string().describe('الخاتمة: الشعار النصي'),
  taglineHighlight: z.string(),

  voVolume: z.number().min(0).max(2).step(0.05).describe('صوت التعليق'),
  clipVolume: z.number().min(0).max(2).step(0.05).describe('صوت لقطة الأوجي'),
  sfxVolume: z.number().min(0).max(2).step(0.05).describe('المؤثرات الصوتية'),
  motionBlur: z.number().int().min(1).max(8).describe('تمويه الحركة (1 = معاينة سريعة)'),
});

export type Cfg = z.infer<typeof schema>;

export const defaults: Cfg = {
  yellow: '#f3c32c',
  brown: '#493929',
  hook: 'تدري وش أسهل \n من التسجيل عالأوجي؟',
  hookHighlight: 'عالأوجي؟',
  line1: 'إنك تسجل براندك \n عندنا!',
  line1Highlight: 'عندنا!',
  line2: 'بثلاث ضغطات بس',
  problems: 'بتحل مشاكل',
  bigWordStart: 'كثيـ',
  bigWordEnd: 'رة',
  captions: [
    {text: 'من واجهة التطبيق', highlight: ''},
    {text: 'تروح لـ حسابي', highlight: 'حسابي'},
    {text: 'ثم انضم لنا', highlight: 'انضم'},
    {text: 'وتعبي بيانات براندك', highlight: 'براندك'},
    {text: 'وتضغط إرسال', highlight: 'إرسال'},
  ],
  formCompany: 'براند الريم',
  formPerson: 'عبدالله محمد',
  formPhone: '0555 123 456',
  formEmail: 'hello@brand.sa',
  sentText: 'تم الإرسال',
  tagline: 'سجّل براندك بثلاث ضغطات',
  taglineHighlight: 'بثلاث',
  voVolume: 1,
  clipVolume: 1,
  sfxVolume: 1,
  motionBlur: 6,
};
