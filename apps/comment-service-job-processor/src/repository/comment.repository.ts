import { IComment } from '@org/types';
import { prisma } from '../lib/prisma';

const sleep = (time = 2000) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

export const addCommentToDB = async (
  comment: Omit<IComment, 'id' | 'created_at' | 'updated_at'>[]
) => {
  const dbData = comment.map((c) => ({
    userId: 1,
    postId: 1,
    user_name: c.user_name,
    content: c.content,
  }));
  console.log('Saving to DB');

  await sleep();
  const addedComment = await prisma.comment.createManyAndReturn({
    data: dbData,
  });

  return addedComment;
};
