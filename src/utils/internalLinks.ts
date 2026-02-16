import type { Card } from '../types/card';

/**
 * Markdown内の [[カードタイトル]] 記法を検出してHTMLリンクに変換
 */
export function parseInternalLinks(content: string, cards: Card[]): string {
  return content.replace(/\[\[(.+?)\]\]/g, (_match, title) => {
    const linkedCard = cards.find((c) => c.title.trim() === title.trim());

    if (linkedCard) {
      // リンク化（クリック可能）
      return `<a
        href="#"
        class="internal-link"
        data-card-id="${linkedCard.id}"
      >${title}</a>`;
    } else {
      // カードが見つからない場合（壊れたリンク）
      return `<span class="broken-link" title="リンク先のカードが見つかりません">[[${title}]]</span>`;
    }
  });
}

/**
 * 本文中にまだリンク化されていないカードタイトルを検出
 */
export function detectInlineLinkCandidates(
  content: string,
  allCards: Card[],
  currentCardId?: string
): Array<{ card: Card; occurrences: number }> {
  const candidates = allCards
    .filter((card) => {
      // 自分自身は除外
      if (currentCardId && card.id === currentCardId) return false;

      // タイトルが空の場合は除外
      if (!card.title.trim()) return false;

      // 本文にカードタイトルが含まれているか
      // かつ、まだ [[]] で囲まれていないか
      const escapedTitle = escapeRegex(card.title);
      const notLinkedPattern = new RegExp(`(?<!\\[\\[)${escapedTitle}(?!\\]\\])`, 'gi');
      return notLinkedPattern.test(content);
    })
    .map((card) => {
      // 出現回数をカウント
      const matches = content.match(new RegExp(escapeRegex(card.title), 'gi'));
      return {
        card,
        occurrences: matches?.length || 0,
      };
    })
    .sort((a, b) => b.occurrences - a.occurrences); // 出現回数順

  return candidates;
}

/**
 * 本文中の指定されたタイトルを [[タイトル]] に自動置換
 */
export function autoInsertInternalLink(content: string, title: string): string {
  // 既に [[タイトル]] となっている箇所は除外して置換
  const escapedTitle = escapeRegex(title);
  const regex = new RegExp(`(?<!\\[\\[)${escapedTitle}(?!\\]\\])`, 'g');

  return content.replace(regex, `[[${title}]]`);
}

/**
 * 正規表現の特殊文字をエスケープ
 */
function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
