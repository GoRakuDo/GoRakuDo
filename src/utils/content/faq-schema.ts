/**
 * FAQ Schema Generator for GoRakuDo
 * 
 * このユーティリティは、FAQ Schema（構造化データ）を生成するための関数を提供します。
 * Google検索結果でのリッチスニペット表示とSEO向上を目的としています。
 * 
 * 使用例:
 * ```typescript
 * import { generateFAQSchema } from '../utils/faq-schema';
 * 
 * const faqData = [
 *   {
 *     question: "GoRakuDoとは何ですか？",
 *     answer: "GoRakuDoは日本語学習プラットフォームです。"
 *   }
 * ];
 * 
 * const faqSchema = generateFAQSchema(faqData);
 * ```
 */

export interface FAQItem {
 question: string;
 answer: string;
 id?: string;
}

export interface FAQSchema {
 '@context': 'https://schema.org';
 '@type': 'FAQPage';
 mainEntity: Array<{
  '@type': 'Question';
  name: string;
  acceptedAnswer: {
   '@type': 'Answer';
   text: string;
  };
 }>;
}

/**
 * FAQ Schemaを生成する関数
 * 
 * @param faqData - FAQアイテムの配列
 * @returns FAQ Schema（JSON-LD形式）
 */
export function generateFAQSchema(faqData: FAQItem[]): FAQSchema | null {
 if (!faqData || faqData.length === 0) {
  return null;
 }

 return {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqData.map(faq => ({
   '@type': 'Question',
   name: faq.question,
   acceptedAnswer: {
    '@type': 'Answer',
    text: cleanAnswerText(faq.answer)
   }
  }))
 };
}

/**
 * HTMLタグを除去してテキストのみを抽出する関数
 * 
 * @param htmlText - HTMLタグを含むテキスト
 * @returns クリーンなテキスト
 */
function cleanAnswerText(htmlText: string): string {
 // HTMLタグを除去
 const textWithoutTags = htmlText.replace(/<[^>]*>/g, '');

 // 複数の空白を単一の空白に変換
 const normalizedText = textWithoutTags.replace(/\s+/g, ' ').trim();

 // 改行文字を適切に処理
 return normalizedText.replace(/\n+/g, ' ').trim();
}

/**
 * FAQ Schemaを検証する関数
 * 
 * @param schema - 検証するFAQ Schema
 * @returns 検証結果
 */
export function validateFAQSchema(schema: FAQSchema): {
 isValid: boolean;
 errors: string[];
} {
 const errors: string[] = [];

 if (!schema['@context'] || schema['@context'] !== 'https://schema.org') {
  errors.push('Invalid @context');
 }

 if (!schema['@type'] || schema['@type'] !== 'FAQPage') {
  errors.push('Invalid @type');
 }

 if (!schema.mainEntity || !Array.isArray(schema.mainEntity)) {
  errors.push('mainEntity must be an array');
 } else {
  schema.mainEntity.forEach((item, index) => {
   if (!item['@type'] || item['@type'] !== 'Question') {
    errors.push(`Item ${index}: Invalid @type`);
   }

   if (!item.name || typeof item.name !== 'string') {
    errors.push(`Item ${index}: Missing or invalid name`);
   }

   if (!item.acceptedAnswer || !item.acceptedAnswer['@type'] || item.acceptedAnswer['@type'] !== 'Answer') {
    errors.push(`Item ${index}: Invalid acceptedAnswer`);
   }

   if (!item.acceptedAnswer?.text || typeof item.acceptedAnswer.text !== 'string') {
    errors.push(`Item ${index}: Missing or invalid answer text`);
   }
  });
 }

 return {
  isValid: errors.length === 0,
  errors
 };
}

/**
 * Default FAQ data for GoRakuDo — /faq/ page
 * Search-intent-driven questions targeting Indonesian learners of Japanese.
 * Each question owns a unique topic not covered on other pages' FAQ schemas.
 */
export const defaultFAQData: FAQItem[] = [
 {
  question: "Apakah bisa belajar bahasa Jepang tanpa kursus?",
  answer: "Ya, metode Immersion membuktikan bahwa belajar bahasa Jepang secara otodidak sangat efektif. Dengan mengonsumsi konten native (anime, manga, podcast) secara konsisten sebagai Comprehensible Input, otak membentuk intuisi bahasa secara alami — sama seperti cara anak kecil belajar bahasa ibu tanpa les atau buku teks.",
  id: "belajar-tanpa-kursus"
 },
 {
  question: "Apakah perlu JLPT untuk bekerja di Jepang?",
  answer: "JLPT tidak selalu wajib, tetapi sangat membantu. Banyak perusahaan Jepang mensyaratkan JLPT N2 untuk posisi non-teknis dan N1 untuk posisi yang memerlukan komunikasi tingkat tinggi. Namun, kemampuan percakapan nyata sering lebih dihargai daripada sertifikat. Metode Immersion membantu membangun kedua hal tersebut secara bersamaan.",
  id: "jlpt-kerja-jepang"
 },
 {
  question: "Apa sumber belajar bahasa Jepang gratis terbaik?",
  answer: "Sumber gratis terbaik untuk metode Immersion: (1) Anime dan drama Jepang dengan subtitle Jepang untuk listening, (2) Yomitan + Anki untuk membangun kosakata dari konten native, (3) Komunitas Discord seperti GoRakuDo untuk praktik dan motivasi, (4) NHK Web Easy untuk reading level menengah. Kuncinya adalah konsistensi input setiap hari.",
  id: "sumber-belajar-gratis"
 },
 {
  question: "Kenapa sudah hafal tata bahasa tapi masih tidak bisa bicara?",
  answer: "Ini disebut 'fossilization' — otak Anda menghafal aturan secara sadar tetapi belum membentuk intuisi bahasa bawah sadar. Menurut teori Prof. Stephen Krashen, acquisition (pemerolehan alami) berbeda dari learning (belajar sadar). Solusinya adalah memperbanyak Comprehensible Input agar otak memproses bahasa secara natural, bukan mengandalkan hafalan.",
  id: "hafal-tapi-tidak-bisa-bicara"
 },
 {
  question: "Berapa jam per hari idealnya belajar bahasa Jepang?",
  answer: "Untuk hasil optimal dengan metode Immersion, targetkan 4-6 jam Comprehensible Input per hari (menonton, membaca, mendengarkan konten Jepang). Ini termasuk aktivitas pasif seperti mendengarkan podcast saat commute. Konsistensi lebih penting dari durasi — 3 jam setiap hari lebih efektif daripada 10 jam di akhir pekan saja.",
  id: "jam-belajar-ideal"
 },
 {
  question: "Apa bedanya GoRakuDo dengan situs belajar bahasa Jepang lain?",
  answer: "GoRakuDo adalah platform open-source 100% gratis yang berfokus pada metode Immersion berdasarkan penelitian Linguistik Modern (Second Language Acquisition). Berbeda dari situs yang mengajarkan tata bahasa tradisional, GoRakuDo menyediakan panduan step-by-step untuk belajar dari konten native Jepang, lengkap dengan panduan tools (Anki, Yomitan) dan komunitas Discord 10.000+ member.",
  id: "beda-gorakudo"
 }
];

/**
 * デフォルトFAQ Schemaを生成する関数
 * 
 * @returns デフォルトFAQ Schema
 */
export function generateDefaultFAQSchema(): FAQSchema {
 return generateFAQSchema(defaultFAQData)!;
}
