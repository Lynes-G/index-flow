import { z } from "zod";
import fs from "node:fs/promises";
import path from "node:path";

const skillSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string().min(1),
  version: z.string().min(1),
  tools: z.array(z.string().min(1)).optional().default([]),
  prompt: z.string().min(1),
  examples: z.array(z.string().min(1)).optional().default([]),
  owner: z.string().min(1).optional(),
  tags: z.array(z.string().min(1)).optional().default([]),
});

export type AgentSkill = z.infer<typeof skillSchema>;

const skillsRoot = path.resolve(process.cwd(), "skills");

async function readSkillFile(skillDir: string) {
  const skillPath = path.join(skillsRoot, skillDir, "skill.json");
  const raw = await fs.readFile(skillPath, "utf-8");
  const parsed = skillSchema.parse(JSON.parse(raw));

  if (parsed.id !== skillDir) {
    throw new Error(`Skill id mismatch: ${parsed.id} != ${skillDir}`);
  }

  return parsed;
}

export async function loadSkill(id: string): Promise<AgentSkill> {
  return readSkillFile(id);
}

export async function listSkills(): Promise<AgentSkill[]> {
  try {
    await fs.access(skillsRoot);
  } catch {
    return [];
  }

  const entries = await fs.readdir(skillsRoot, { withFileTypes: true });
  const skillDirs = entries.filter((entry) => entry.isDirectory());
  const skills = await Promise.all(
    skillDirs.map((entry) => readSkillFile(entry.name)),
  );

  return skills;
}
