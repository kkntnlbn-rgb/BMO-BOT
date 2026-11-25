import {z} from 'zod';
import {zColor} from '@remotion/zod-types';

const cap = z.object({text: z.string(), highlight: z.string()});

/** Control panel — every field is editable live in Remotion Studio's Props panel. */
export const schema = z.object({
  bg: zColor().describe('لون الخلفية'),
  ink: zColor().describe('لون الخط'),
  s1: z.array(cap).length(2).describe('المشهد 1: البداية'),
  s2: z.array(cap).length(3).describe('المشهد 2: المشكلة'),
  s3: z.array(cap).length(3).describe('المشهد 3: الحل'),
  s4: z.array(cap).length(2).describe('المشهد 4: التحوّل'),
  products: z.array(z.string()).length(3).describe('المشهد 4: أسماء المنتجات'),
  s5: z.array(cap).length(4).describe('المشهد 5: الختام'),
  voVolume: z.number().min(0).max(2).step(0.05).describe('صوت التعليق'),
  musicVolume: z.number().min(0).max(2).step(0.05).describe('الموسيقى الهادئة'),
  sfxVolume: z.number().min(0).max(2).step(0.05).describe('المؤثرات'),
  motionBlur: z.number().int().min(1).max(8).describe('تمويه الحركة (1 = معاينة سريعة)'),
});
export type Cfg = z.infer<typeof schema>;

export const defaults: Cfg = {
  bg: '#c9ecd6',
  ink: '#0e4d3b',
  s1: [
    {text: 'الماءُ سِرُّ الحياة', highlight: 'الحياة'},
    {text: 'وزجاجةُ الماءِ اليومية \n قد تكونُ بدايةَ حكاية', highlight: 'حكاية'},
  ],
  s2: [
    {text: 'التخلُّصُ العشوائيُّ منها', highlight: ''},
    {text: 'يزيدُ تراكمَ النفايات', highlight: 'النفايات'},
    {text: 'ويُهدِّدُ توازنَ بيئتِنا', highlight: 'بيئتِنا'},
  ],
  s3: [
    {text: 'والحلّ؟', highlight: ''},
    {text: 'إعادةُ التدوير', highlight: 'التدوير'},
    {text: 'لتحويلِ المخلَّفاتِ \n إلى موارد', highlight: 'موارد'},
  ],
  s4: [
    {text: 'من زجاجةٍ مستهلَكة', highlight: ''},
    {text: 'إلى منتجاتٍ جديدةٍ ومفيدة', highlight: 'ومفيدة'},
  ],
  products: ['لجمالِ المنزل', 'لتنظيمِ المكتب', 'لهدايا الأطفال'],
  s5: [
    {text: 'لا تجعلْ زجاجتَك \n نهايةَ قصّة', highlight: ''},
    {text: 'بل بدايةً جديدة', highlight: 'جديدة'},
    {text: 'أعِدْ تدويرَها', highlight: 'تدويرَها'},
    {text: 'رؤية السعودية \n 2030', highlight: '2030'},
  ],
  voVolume: 1,
  musicVolume: 1,
  sfxVolume: 1,
  motionBlur: 6,
};
