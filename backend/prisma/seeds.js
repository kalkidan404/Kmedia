require("dotenv").config();

const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const { faker } = require("@faker-js/faker");
const bcrypt = require("bcrypt");

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL
});

const prisma = new PrismaClient({
    adapter
});

async function main() {
  console.log("Seeding database...");

  // Clear existing data
  await prisma.like.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.post.deleteMany();
  await prisma.follow.deleteMany();
  await prisma.followRequest.deleteMany();
  await prisma.user.deleteMany();

  // Create users
  const users = [];

  for (let i = 0; i < 10; i++) {
    const password = await bcrypt.hash("password123", 10);

    const user = await prisma.user.create({
      data: {
        name: faker.person.fullName(),
        email: faker.internet.email().toLowerCase(),
        password,
        profileImage: faker.image.avatar()
      }
    });

    users.push(user);
  }

  // Create posts
  const posts = [];

  for (let i = 0; i < 30; i++) {
    const randomUser = faker.helpers.arrayElement(users);

    const post = await prisma.post.create({
      data: {
        content: faker.lorem.paragraph(),
        authorId: randomUser.id
      }
    });

    posts.push(post);
  }

  // Create comments
  for (let i = 0; i < 50; i++) {
    const randomUser = faker.helpers.arrayElement(users);
    const randomPost = faker.helpers.arrayElement(posts);

    await prisma.comment.create({
      data: {
        content: faker.lorem.sentence(),
        authorId: randomUser.id,
        postId: randomPost.id
      }
    });
  }

  // Create likes
  for (const post of posts) {
    const numberOfLikes = faker.number.int({
      min: 1,
      max: 5
    });

    const selectedUsers = faker.helpers.arrayElements(
      users,
      numberOfLikes
    );

    for (const user of selectedUsers) {
      await prisma.like.create({
        data: {
          userId: user.id,
          postId: post.id
        }
      });
    }
  }

  // Create follow relationships
  for (const user of users) {
    const possibleUsers = users.filter(
      (otherUser) => otherUser.id !== user.id
    );

    const followedUsers = faker.helpers.arrayElements(
      possibleUsers,
      faker.number.int({
        min: 1,
        max: 3
      })
    );

    for (const followedUser of followedUsers) {
      await prisma.follow.create({
        data: {
          followerId: user.id,
          followedId: followedUser.id
        }
      });
    }
  }

  console.log("Seeding complete!");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });