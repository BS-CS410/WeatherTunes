# Documentation Sync Scripts

This folder contains scripts for managing documentation synchronization between the local `docs/` folder and the GitHub wiki.

## Scripts

### `sync-docs-to-wiki.sh` (Recommended)

Enhanced script for ongoing documentation maintenance:

- ✅ Handles both initial setup and updates
- ✅ Checks for existing wiki repository and pulls latest changes
- ✅ Only commits when there are actual changes
- ✅ Includes timestamps and changed files in commit messages
- ✅ Error handling and validation

**Usage:**

```bash
./sync-docs-to-wiki.sh
```

### `migrate-to-wiki.sh` (Legacy)

Original one-time migration script. Keep for reference but use the sync script instead.

## Workflow

1. **Make changes** to files in the `docs/` folder
2. **Test locally** that your documentation looks correct
3. **Run sync script** to push changes to GitHub wiki:
   ```bash
   ./sync-docs-to-wiki.sh
   ```
4. **Verify on GitHub** that the wiki pages updated correctly

## File Mapping

The sync script automatically converts your hierarchical docs structure to GitHub's flat wiki format:

| Local File                              | Wiki Page                       |
| --------------------------------------- | ------------------------------- |
| `docs/README.md`                        | `Home`                          |
| `docs/architecture/overview.md`         | `Architecture-Overview`         |
| `docs/architecture/components.md`       | `Architecture-Components`       |
| `docs/architecture/state-management.md` | `Architecture-State-Management` |
| `docs/features/weather.md`              | `Features-Weather`              |
| `docs/features/settings.md`             | `Features-Settings`             |
| `docs/features/video-backgrounds.md`    | `Features-Video-Backgrounds`    |
| `docs/features/music.md`                | `Features-Music`                |
| `docs/development/getting-started.md`   | `Development-Getting-Started`   |
| `docs/development/setup.md`             | `Development-Setup`             |
| `docs/backend/api-requirements.md`      | `Backend-API-Requirements`      |

## Notes

- The script automatically updates internal links to work with wiki format
- Missing files are skipped (won't cause errors)
- The script checks for changes and only commits when necessary
- You can run the script multiple times safely
