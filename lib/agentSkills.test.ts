import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import { listSkills, loadSkill } from "./agentSkills";

const withTempWorkspace = async (
  setup: (workspaceRoot: string) => Promise<void>,
  run: () => Promise<void>,
) => {
  const originalCwd = process.cwd();
  const workspaceRoot = await fs.mkdtemp(
    path.join(os.tmpdir(), "index-flow-agent-skills-"),
  );

  try {
    await setup(workspaceRoot);
    process.chdir(workspaceRoot);
    await run();
  } finally {
    process.chdir(originalCwd);
    await fs.rm(workspaceRoot, { recursive: true, force: true });
  }
};

test("loadSkill prefers project manifests before imported markdown skills", async () => {
  await withTempWorkspace(
    async (workspaceRoot) => {
      const projectSkillDir = path.join(
        workspaceRoot,
        "agents",
        "skills",
        "qa-review",
      );
      const importedSkillDir = path.join(
        workspaceRoot,
        ".agents",
        "skills",
        "qa-review",
      );

      await fs.mkdir(projectSkillDir, { recursive: true });
      await fs.mkdir(importedSkillDir, { recursive: true });

      await fs.writeFile(
        path.join(projectSkillDir, "skill.json"),
        JSON.stringify({
          id: "qa-review",
          name: "QA Review",
          description: "Project-owned manifest.",
          version: "1.0.0",
          prompt: "Run QA.",
        }),
      );
      await fs.writeFile(
        path.join(importedSkillDir, "SKILL.md"),
        `---
name: qa-review
description: Imported markdown skill
---

# Imported QA Review`,
      );
    },
    async () => {
      const skill = await loadSkill("qa-review");

      assert.equal(skill.name, "QA Review");
      assert.equal(skill.description, "Project-owned manifest.");
      assert.equal(skill.version, "1.0.0");
    },
  );
});

test("listSkills merges project and imported skill directories", async () => {
  await withTempWorkspace(
    async (workspaceRoot) => {
      const jsonSkillDir = path.join(
        workspaceRoot,
        "agents",
        "skills",
        "frontend-qa",
      );
      const markdownSkillDir = path.join(
        workspaceRoot,
        ".agents",
        "skills",
        "backend-qa",
      );

      await fs.mkdir(jsonSkillDir, { recursive: true });
      await fs.mkdir(markdownSkillDir, { recursive: true });

      await fs.writeFile(
        path.join(jsonSkillDir, "skill.json"),
        JSON.stringify({
          id: "frontend-qa",
          name: "Frontend QA",
          description: "Checks the frontend surface.",
          version: "1.0.0",
          prompt: "Inspect the frontend.",
        }),
      );
      await fs.writeFile(
        path.join(markdownSkillDir, "SKILL.md"),
        `---
name: backend-qa
description: Checks the backend surface.
---

# Backend QA`,
      );
    },
    async () => {
      const skills = await listSkills();
      const skillIds = skills.map((skill) => skill.id).sort();
      const importedSkill = skills.find((skill) => skill.id === "backend-qa");

      assert.deepEqual(skillIds, ["backend-qa", "frontend-qa"]);
      assert.equal(importedSkill?.version, "external");
      assert.match(importedSkill?.prompt ?? "", /Backend QA/);
    },
  );
});
