import { Router } from 'express';
import { prisma } from '../utils/prisma.js';
import { verifyAccess } from '../middleware/verifyAccessToken.js';

const router = Router();

// Alle Folder für alle Nutzer (kein userId Filter mehr)
router.get('/', verifyAccess, async (req, res) => {
  try {
    const folders = await prisma.folder.findMany({
      include: { todos: true },
      orderBy: { id: 'asc' }
    });
    res.json(folders);
  } catch (e) {
    res.status(500).json({ error: 'Fehler beim Laden' });
  }
});

// Einzelner Folder (kein userId Filter)
router.get('/:id', verifyAccess, async (req, res) => {
  const id = Number(req.params.id);
  try {
    const folder = await prisma.folder.findFirst({
      where: { id },
      include: { todos: true }
    });
    if (!folder) return res.status(404).json({ error: 'Folder nicht gefunden' });
    res.json(folder);
  } catch (e) {
    res.status(500).json({ error: 'Fehler beim Laden' });
  }
});

// Erstellen (userId bleibt gespeichert, aber Zugriff nicht eingeschränkt)
router.post('/', verifyAccess, async (req, res) => {
  try {
    const folder = await prisma.folder.create({
      data: { name: req.body.name, userId: req.user.sub }
    });
    res.json(folder);
  } catch (e) {
    res.status(400).json({ error: 'Folder konnte nicht erstellt werden' });
  }
});

// Update ohne userId Einschränkung
router.put('/:id', verifyAccess, async (req, res) => {
  const id = Number(req.params.id);
  try {
    const result = await prisma.folder.update({
      where: { id },
      data: { name: req.body.name, done: req.body.done }
    });
    res.json({ success: true, folder: result });
  } catch (e) {
    res.status(404).json({ error: 'Folder nicht gefunden oder Update fehlgeschlagen' });
  }
});

// Löschen ohne userId Einschränkung (Todos werden vorher entfernt)
router.delete('/:id', verifyAccess, async (req, res) => {
  const id = Number(req.params.id);
  try {
    const folder = await prisma.folder.findUnique({ where: { id } });
    if (!folder) return res.status(404).json({ error: 'Folder nicht gefunden' });

    await prisma.$transaction([
      prisma.folder.delete({ where: { id } })
    ]);

    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: 'Folder konnte nicht gelöscht werden' });
  }
});

export default router;
