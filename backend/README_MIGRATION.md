# Prisma Migration - Entfernung des `done` Feldes

## Übersicht
Diese Anleitung beschreibt die Schritte zur Entfernung des `done` Boolean-Feldes aus dem `Folder` Modell in der Prisma-Datenbank, ohne die gesamte Datenbank zu löschen.

## Datum der Migration
**9. November 2025**

## Durchgeführte Änderungen

### 1. Schema-Änderung
Das `done` Feld wurde aus dem `Folder` Modell in der `schema.prisma` Datei entfernt:

```prisma
// Vorher:
model Folder {
  id     Int     @id @default(autoincrement())
  name   String
  done   Boolean @default(false)  // <- Dieses Feld wurde entfernt
  userId Int
  user   User    @relation(fields: [userId], references: [id])
  todos  Todo[]
}

// Nachher:
model Folder {
  id     Int     @id @default(autoincrement())
  name   String
  userId Int
  user   User    @relation(fields: [userId], references: [id])
  todos  Todo[]
}
```

## CLI-Befehle

### Schritt 1: Navigation zum Backend-Verzeichnis
```cmd
cd C:\vhost\Angular-Template\auth\backend
```

### Schritt 2: Migration erstellen und anwenden
```cmd
npx prisma migrate dev --name remove_folder_done_field
```

**Ausgabe:**
- Migration erfolgreich erstellt: `20251109181213_remove_folder_done_field`
- 1 Datensatz mit non-null Wert wurde behandelt
- Datenbank wurde erfolgreich aktualisiert

### Schritt 3: Verifikation der Synchronisation
```cmd
npx prisma db push
```

**Ergebnis:** Datenbank ist mit dem Prisma Schema synchronisiert.

## Migration Details

- **Migration Name:** `remove_folder_done_field`
- **Migration ID:** `20251109181213_remove_folder_done_field`
- **Betroffene Tabelle:** `Folder`
- **Entferntes Feld:** `done` (Boolean mit default(false))

## Wichtige Hinweise

1. ⚠️ **Datenverlust:** Das `done` Feld und alle seine Werte wurden permanent entfernt
2. ✅ **Andere Daten:** Alle anderen Daten in der `Folder` Tabelle blieben erhalten
3. ✅ **Referenzen:** Beziehungen zu `User` und `Todo` Modellen sind unverändert
4. 🔄 **Rollback:** Falls nötig, kann eine neue Migration erstellt werden, um das Feld wieder hinzuzufügen

## Nächste Schritte

Nach dieser Migration sollten Sie:

1. **Backend-Code überprüfen:** Entfernen Sie alle Referenzen auf das `done` Feld aus:
   - Controllers
   - Services
   - API-Responses
   
2. **Frontend-Code aktualisieren:** Entfernen Sie UI-Elemente, die das `done` Feld verwenden

3. **Tests aktualisieren:** Passen Sie Unit- und Integration-Tests entsprechend an

## Fehlerbehebung

**EPERM-Fehler:** 
```
EPERM: operation not permitted, rename '...\query_engine-windows.dll.node.tmp...'
```
Dieser Windows-spezifische Fehler beeinträchtigt nicht die Migration und kann ignoriert werden.

## Backup-Empfehlung

Für zukünftige Migrationen empfiehlt es sich, ein Backup der Datenbank zu erstellen:
```cmd
copy dev.db dev.db.backup
```
