import {prisma} from './src/utils/prisma.js';
import bcrypt from 'bcrypt';

async function addUser() {
    const email = '';
    const username = '';
    const password = '';

    try {
        // Password hashen
        const hashedPassword = await bcrypt.hash(password, 10);

        // User erstellen
        const user = await prisma.user.create({
            data: {
                email,
                username,
                password: hashedPassword
            }
        });

        console.log('✅ User erfolgreich erstellt:', {
            id: user.id,
            email: user.email,
            username: user.username
        });

        // Beispiel-Folder für den User erstellen
        const folder = await prisma.folder.create({
            data: {
                name: 'Mein erster Ordner',
                userId: user.id
            }
        });

        const folderTwo = await prisma.folder.create({
            data: {
                name: 'Mein zweiter Ordner',
                userId: user.id
            }
        });

        console.log('✅ Beispiel-Folder erstellt:', folder);
        console.log('✅ Beispiel-Folder erstellt:', folderTwo);

    } catch (error) {
        console.error('❌ Fehler beim Erstellen des Users:', error);
    } finally {
        await prisma.$disconnect();
    }
}

addUser();
