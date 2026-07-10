import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const filesToRemove = [
  "docs/personal-project-timeline.txt",
  "docs/legal-requirements-tracker.txt",
  "docs/final-docs-update-checklist.txt",
  "docs/private-docs-cleanup-memo.txt",
  "docs/production-auth-plan.md",
];

const removed = [];
const missing = [];

for (const relativePath of filesToRemove) {
  const absolutePath = path.resolve(root, relativePath);
  if (!fs.existsSync(absolutePath)) {
    missing.push(relativePath);
    continue;
  }

  fs.unlinkSync(absolutePath);
  removed.push(relativePath);
}

console.log("[launch-freeze-cleanup] Removed files:");
for (const file of removed) {
  console.log(`- ${file}`);
}

if (missing.length) {
  console.log("[launch-freeze-cleanup] Files already missing:");
  for (const file of missing) {
    console.log(`- ${file}`);
  }
}

console.log("[launch-freeze-cleanup] Done.");
