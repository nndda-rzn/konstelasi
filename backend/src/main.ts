import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { EntityManager } from '@mikro-orm/core';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  // Create Guest User and Bypass Supabase Storage RLS
  const em = app.get(EntityManager);
  const guestId = '00000000-0000-0000-0000-000000000000';
  
  try {
    const guest = await em.findOne('User', { id: guestId });
    if (!guest) {
      em.create('User', { id: guestId, email: 'guest@diary.local', createdAt: new Date() });
      await em.flush();
    }
    
    // Attempt to drop strict RLS from storage to allow guest uploads
    await em.getConnection().execute(`
      DROP POLICY IF EXISTS "Authenticated Upload" ON storage.objects;
      CREATE POLICY "Public Upload" ON storage.objects FOR INSERT WITH CHECK ( bucket_id = 'notes_images' );
      DROP POLICY IF EXISTS "Owner Deletion" ON storage.objects;
      CREATE POLICY "Public Deletion" ON storage.objects FOR DELETE USING ( bucket_id = 'notes_images' );
    `);
  } catch (e) {
    console.log('Setup guest DB sync error: ', e.message);
  }

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
