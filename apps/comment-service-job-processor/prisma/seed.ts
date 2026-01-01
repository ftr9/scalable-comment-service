import { prisma } from '../src/lib/prisma';

async function main() {
  await prisma.user.upsert({
    where: {
      email: 'sample@gmail.com',
    },
    update: {
      name: 'sample-123',
    },
    create: {
      id: 1,
      email: 'sample@gmail.com',
      name: 'sample-123',
    },
  });

  console.log('User created');

  await prisma.post.upsert({
    where: {
      id: 1,
    },
    update: {
      content: 'this actually makes sense to me',
      published: true,
      title: 'whoa what just happened',
    },
    create: {
      id: 1,
      authorId: 1,
      content: 'this actually makes sense to me',
      published: true,
      title: 'whoa what just happened',
    },
  });

  console.log('migrated the post successfully');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
