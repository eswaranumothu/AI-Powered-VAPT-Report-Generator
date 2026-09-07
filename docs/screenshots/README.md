# Screenshots

Drop the following image files into this folder. They are referenced by the
root `README.md`. Filenames must match exactly (PNG).

| Filename | What it should show |
|----------|---------------------|
| `dashboard.png` | Dashboard: welcome banner, stat cards (Total Projects / Reports Generated / Draft Projects / Total Users), recent projects |
| `add-vulnerability.png` | "Add Vulnerability" form before generation (just the title field filled, e.g. `ssrf`) |
| `add-vulnerability-generated.png` | Same form after clicking **Generate** — severity, CVSS, CWE, OWASP, description and impact populated by AI |
| `project-details.png` | Project details page: header (code, stage, type, View PDF Report) and the Vulnerability Findings table |
| `evidence.png` | Evidence panel with Case tabs, a screenshot thumbnail and the AI **Generate** step button |
| `login.png` | Login screen |

After adding the files, commit and push:

```bash
git add docs/screenshots
git commit -m "docs: add screenshots"
git push
```
