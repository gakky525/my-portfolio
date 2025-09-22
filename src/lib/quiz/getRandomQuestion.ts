import { prisma } from '@/lib/prisma';
import { Category } from '@prisma/client';

// 問題をランダムで1問取得する関数
export async function getRandomQuestion(
  category: string,
  field: string,
  excludeIds: number[] = [] // 出題済みの除外対象の問題のID
) {
  const upperCategory = category.toUpperCase();

  // カテゴリが正しいかチェック（enumで定義したANATOMYまたはPHYSIOLOGY以外ならエラー）
  if (!Object.values(Category).includes(upperCategory as Category)) {
    throw new Error(`Invalid category: ${category}`);
  }

  // 検索条件（SQLのWHERE句の代わり）
  const whereCondition = {
    category: upperCategory as Category, // category で絞る
    ...(field !== 'all' ? { field: decodeURIComponent(field) } : {}), // field が'all'でなければ、その分野で絞る
    ...(excludeIds.length > 0 ? { id: { notIn: excludeIds } } : {}), // excludeIds があれば、それらの問題を除外
  };

  // 該当する問題のID一覧を取得
  const ids = await prisma.question.findMany({
    where: whereCondition,
    select: { id: true },
  });

  if (ids.length === 0) return null;

  // idsからランダムで1つ選ぶ
  const randomId = ids[Math.floor(Math.random() * ids.length)].id;

  // 選んだ問題をDBから取得
  const question = await prisma.question.findUnique({
    where: { id: randomId },
    include: { choices: true },
  });

  return question;
}
