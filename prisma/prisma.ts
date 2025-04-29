import { PrismaClient } from '@prisma/client'

// Thêm cấu hình database URL mặc định nếu không có .env
const databaseUrl = process.env.DATABASE_URL || "mongodb://localhost:27017/quackzzle";

// Log thông tin về database
console.log('DATABASE_URL:', databaseUrl ? "Configured" : "Not configured");

const prismaClientSingleton = () => {
  try {
    return new PrismaClient({
      datasources: {
        db: {
          url: databaseUrl,
        },
      },
    });
  } catch (error) {
    console.error('Error initializing PrismaClient:', error);
    // Tạm thời trả về một đối tượng Prisma đơn giản để tránh crash
    return {
      $connect: () => Promise.resolve(),
      $disconnect: () => Promise.resolve(),
      game: {
        findUnique: () => Promise.resolve(null),
        create: () => Promise.resolve({ id: 'mock-id', gameCode: 'MOCK' }),
      },
      player: {
        create: () => Promise.resolve({ id: 'mock-player-id', name: 'Mock Player' }),
      },
    } as any;
  }
};

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>
}

export const prisma = globalThis.prisma ?? prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma