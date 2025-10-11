/**
 * Rehypeプラグイン：H1-H6要素内のEmojiを<span class="emoji">でラップ
 * これにより、Emojiはグラデーションの影響を受けずに元の色を保持
 */
import { visit } from 'unist-util-visit';

// Emoji検出の正規表現（包括的）
const emojiRegex =
  /(\p{Emoji_Presentation}|\p{Emoji}\uFE0F|\p{Emoji_Modifier_Base}\p{Emoji_Modifier}?)/gu;

// 対象とする見出しタグ
const headingTags = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];

/**
 * テキストノードをEmojiと通常テキストに分割
 */
function splitTextWithEmoji(text) {
  const parts = [];
  let lastIndex = 0;
  let match;

  // 正規表現をリセット
  emojiRegex.lastIndex = 0;

  while ((match = emojiRegex.exec(text)) !== null) {
    // Emoji前のテキスト
    if (match.index > lastIndex) {
      parts.push({
        type: 'text',
        value: text.slice(lastIndex, match.index),
      });
    }

    // Emoji
    parts.push({
      type: 'emoji',
      value: match[0],
    });

    lastIndex = match.index + match[0].length;
  }

  // 残りのテキスト
  if (lastIndex < text.length) {
    parts.push({
      type: 'text',
      value: text.slice(lastIndex),
    });
  }

  return parts;
}

/**
 * Rehypeプラグインのメイン関数
 */
export default function rehypeWrapEmoji() {
  return tree => {
    visit(tree, 'element', node => {
      // H1-H6要素を対象
      if (!headingTags.includes(node.tagName)) {
        return;
      }

      // 子要素を処理
      const newChildren = [];

      for (const child of node.children) {
        // テキストノードのみ処理
        if (child.type === 'text') {
          const parts = splitTextWithEmoji(child.value);

          for (const part of parts) {
            if (part.type === 'emoji') {
              // Emojiをspanでラップ
              newChildren.push({
                type: 'element',
                tagName: 'span',
                properties: { className: ['emoji'] },
                children: [{ type: 'text', value: part.value }],
              });
            } else {
              // 通常のテキスト
              newChildren.push({
                type: 'text',
                value: part.value,
              });
            }
          }
        } else {
          // テキストノード以外はそのまま
          newChildren.push(child);
        }
      }

      node.children = newChildren;
    });
  };
}
