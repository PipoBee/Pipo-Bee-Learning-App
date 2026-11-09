import { PrismaClient, Role, TaskType } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { INITIAL_CURRICULUM } from '@phonicsquest/shared';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Pipo Bee Database Seeding...');

  // 1. Clean existing records in dependency order
  await prisma.attempt.deleteMany();
  await prisma.studentSoundMastery.deleteMany();
  await prisma.studentProgress.deleteMany();
  await prisma.studentProfile.deleteMany();
  await prisma.taskItem.deleteMany();
  await prisma.task.deleteMany();
  await prisma.level.deleteMany();
  await prisma.world.deleteMany();
  await prisma.user.deleteMany();

  // 2. Create Single Admin User
  const adminPasswordHash = await bcrypt.hash('Admin123!', 10);
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@phonicsquest.com',
      passwordHash: adminPasswordHash,
      fullName: 'Head Administrator',
      role: Role.ADMIN,
    },
  });
  console.log(`✅ Seeded Admin User: ${adminUser.email}`);

  // 3. Create Parent / Learner User
  const studentPasswordHash = await bcrypt.hash('Learner123!', 10);
  const studentUser = await prisma.user.create({
    data: {
      email: 'student@phonicsquest.com',
      passwordHash: studentPasswordHash,
      fullName: 'Leo Student Family',
      role: Role.STUDENT,
    },
  });

  // 4. Create Single Learner Profile
  const learnerProfile = await prisma.studentProfile.create({
    data: {
      userId: studentUser.id,
      displayName: 'Leo',
      avatarId: 'mascot_parrot_01',
      age: 6,
      totalStars: 42,
      totalCoins: 150,
      streakDays: 3,
      clientId: 'learner-leo-profile-client-id',
    },
  });
  console.log(`✅ Seeded Learner Profile: ${learnerProfile.displayName}`);

  // 4b. Create Parent with two child dashboards
  const parentPasswordHash = await bcrypt.hash('Parent123!', 10);
  const parentUser = await prisma.user.create({
    data: {
      email: 'parent@phonicsquest.com',
      passwordHash: parentPasswordHash,
      fullName: 'Alex Parent',
      role: Role.PARENT,
    },
  });

  const childMia = await prisma.studentProfile.create({
    data: {
      userId: parentUser.id,
      displayName: 'Mia',
      avatarId: 'owl_01',
      age: 6,
      totalStars: 18,
      totalCoins: 70,
      streakDays: 2,
    },
  });

  const childSam = await prisma.studentProfile.create({
    data: {
      userId: parentUser.id,
      displayName: 'Sam',
      avatarId: 'fox_01',
      age: 7,
      totalStars: 9,
      totalCoins: 40,
      streakDays: 1,
    },
  });
  console.log(`✅ Seeded Parent User: ${parentUser.email} with children Mia & Sam`);

  // 5. Seed all 15 Levels across 5 Worlds from Curriculum Specification
  let totalTasks = 0;
  let totalItems = 0;

  for (const worldData of INITIAL_CURRICULUM) {
    const world = await prisma.world.create({
      data: {
        id: worldData.id,
        code: worldData.code,
        title: worldData.title,
        description: worldData.description,
        orderIndex: worldData.orderIndex,
        themeColor: worldData.themeColor,
        accentColor: worldData.accentColor,
        iconName: worldData.iconName,
      },
    });

    for (const levelData of worldData.levels) {
      const level = await prisma.level.create({
        data: {
          id: levelData.id,
          worldId: world.id,
          title: levelData.title,
          subtitle: levelData.subtitle,
          soundLabel: levelData.soundLabel,
          orderIndex: levelData.orderIndex,
          requiredStars: levelData.requiredStars,
          passThresholdScore: levelData.passThresholdScore,
          isTestLevel: levelData.isTestLevel,
        },
      });

      // Unlock first level for seeded learners
      await prisma.studentProgress.create({
        data: {
          studentId: learnerProfile.id,
          levelId: level.id,
          isUnlocked: levelData.orderIndex === 1,
          isCompleted: levelData.orderIndex === 1,
          starsEarned: levelData.orderIndex === 1 ? 3 : 0,
          highScore: levelData.orderIndex === 1 ? 100 : 0,
          totalAttempts: levelData.orderIndex === 1 ? 2 : 0,
        },
      });

      await prisma.studentProgress.create({
        data: {
          studentId: childMia.id,
          levelId: level.id,
          isUnlocked: levelData.orderIndex <= 2,
          isCompleted: levelData.orderIndex === 1,
          starsEarned: levelData.orderIndex === 1 ? 2 : 0,
          highScore: levelData.orderIndex === 1 ? 80 : 0,
          totalAttempts: levelData.orderIndex === 1 ? 1 : 0,
        },
      });

      await prisma.studentProgress.create({
        data: {
          studentId: childSam.id,
          levelId: level.id,
          isUnlocked: levelData.orderIndex === 1,
          isCompleted: false,
          starsEarned: 0,
          highScore: 0,
        },
      });

      for (const taskData of levelData.tasks) {
        totalTasks++;
        const task = await prisma.task.create({
          data: {
            id: taskData.id,
            levelId: level.id,
            taskType: taskData.taskType as TaskType,
            orderIndex: taskData.orderIndex,
            title: taskData.title,
            instructionText: taskData.instructionText,
          },
        });

        for (const itemData of taskData.items) {
          totalItems++;
          await prisma.taskItem.create({
            data: {
              id: itemData.id,
              taskId: task.id,
              orderIndex: itemData.orderIndex,
              targetGrapheme: itemData.targetGrapheme,
              targetPhoneme: itemData.targetPhoneme,
              targetWord: itemData.targetWord || null,
              promptText: itemData.promptText,
              optionsJson: (itemData.options as unknown as object) || null,
              strokeDataJson: (itemData.tracingData as unknown as object) || null,
            },
          });
        }
      }
    }
  }

  console.log(`✅ Seeded ${INITIAL_CURRICULUM.length} Worlds, 15 Levels, ${totalTasks} Tasks, and ${totalItems} Items.`);

  // 6. Seed Learner Sound Mastery Diagnostics & Weak Words
  const masteryData = [
    { phoneme: 's', masteryScore: 0.95, totalAttempts: 18, correctAttempts: 17, isWeakFlag: false },
    { phoneme: 'a', masteryScore: 0.90, totalAttempts: 15, correctAttempts: 14, isWeakFlag: false },
    { phoneme: 't', masteryScore: 0.88, totalAttempts: 16, correctAttempts: 14, isWeakFlag: false },
    { phoneme: 'p', masteryScore: 0.52, totalAttempts: 12, correctAttempts: 6, isWeakFlag: true }, // Weak sound
    { phoneme: 'i', masteryScore: 0.80, totalAttempts: 10, correctAttempts: 8, isWeakFlag: false },
    { phoneme: 'n', masteryScore: 0.78, totalAttempts: 10, correctAttempts: 8, isWeakFlag: false },
  ];

  for (const m of masteryData) {
    await prisma.studentSoundMastery.create({
      data: {
        studentId: learnerProfile.id,
        phoneme: m.phoneme,
        masteryScore: m.masteryScore,
        totalAttempts: m.totalAttempts,
        correctAttempts: m.correctAttempts,
        isWeakFlag: m.isWeakFlag,
      },
    });
  }

  // 7. Seed Initial Sample Audio Asset Record
  await prisma.audioAsset.upsert({
    where: { storageKey: 'audio/phonemes/sound_s_chime.wav' },
    update: {},
    create: {
      fileName: 'sound_s_chime.wav',
      storageKey: 'audio/phonemes/sound_s_chime.wav',
      publicUrl: 'http://localhost:3000/uploads/sound_s_chime.wav',
      mimeType: 'audio/wav',
      sizeBytes: 48200,
      category: 'PHONEME',
      transcript: '/s/',
    },
  });

  console.log('🎉 Seeding successfully completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
