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
 * GoRakuDo用のデフォルトFAQデータ
 * 主要なFAQアイテムを定義
 */
export const defaultFAQData: FAQItem[] = [
 {
  question: "GoRakuDoとは何ですか？",
  answer: "GoRakuDoは、日本語学習を支援する総合プラットフォームです。初心者から上級者まで、効率的な日本語学習をサポートする様々なツールとリソースを提供しています。",
  id: "what-is-gorakudo"
 },
 {
  question: "どのレベルの日本語学習者向けですか？",
  answer: "GoRakuDoは、日本語学習の全レベルに対応しています。初心者（N5-N4）から上級者（N1）まで、個人のレベルに合わせたカスタマイズされた学習プランをご提供します。",
  id: "target-levels"
 },
 {
  question: "無料で利用できますか？",
  answer: "はい、GoRakuDoの基本的な機能は無料でご利用いただけます。基本的な学習コンテンツ、進捗追跡機能、コミュニティ参加、月5回までのAI学習支援が含まれます。",
  id: "pricing"
 },
 {
  question: "GoRakuDoの使い方を教えてください",
  answer: "GoRakuDoの基本的な使い方：1.アカウント作成、2.レベル診断、3.学習プラン選択、4.学習開始、5.進捗確認の5ステップで始められます。",
  id: "how-to-use"
 },
 {
  question: "学習進捗は保存されますか？",
  answer: "はい、すべての学習進捗は安全に保存されます。完了したレッスンとクイズの結果、学習時間と頻度、苦手分野の分析、個人設定とカスタマイズが保存され、デバイスを変更しても引き継げます。",
  id: "progress-save"
 },
 {
  question: "モバイルアプリはありますか？",
  answer: "現在、モバイルアプリの開発を進めており、2024年後半にリリース予定です。現在はレスポンシブWebサイト（スマートフォン対応）とPWA機能をご利用いただけます。",
  id: "mobile-app"
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
