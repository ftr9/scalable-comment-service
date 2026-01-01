import { IComment } from '@org/types';
import { faker } from '@org/backend';

export function generateCommentData(
  postId: string
): Omit<IComment, 'id' | 'createdAt' | 'updatedAt'> {
  return {
    userId: faker.database.mongodbObjectId(),
    postId: postId,
    user_name: faker.person.firstName(),
    content: faker.lorem.text(),
  };
}
