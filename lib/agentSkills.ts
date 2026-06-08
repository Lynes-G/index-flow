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

const skillRootCandidates = ["agents/skills", ".agents/skills", "skills"];

const getSkillRoots = () =>
  skillRootCandidates.map((root) => path.resolve(process.cwd(), root));

const humanizeSkillId = (value: string) =>
  value
    .split(/[-_]/)
    .filter(Boolean)
    .map((segment) => segment[0].toUpperCase() + segment.slice(1))
    .join(" ");

const parseMarkdownSkill = (skillDir: string, raw: string): AgentSkill => {
  const frontmatterMatch = raw.match(/^---\s*\r?\n([\s\S]*?)\r?\n---/);
  const titleMatch = raw.match(/^#\s+(.+)$/m);

  const frontmatter = frontmatterMatch?.[1] ?? "";
  const name =
    frontmatter.match(/^name:\s*(.+)$/m)?.[1]?.trim() ??
    titleMatch?.[1]?.trim() ??
    humanizeSkillId(skillDir);
  const description =
    frontmatter.match(/^description:\s*(.+)$/m)?.[1]?.trim() ?? `${name} skill`;

  return skillSchema.parse({
    id: skillDir,
    name,
    description,
    version: "external",
    prompt: raw,
    tools: [],
    examples: [],
    tags: [],
  });
};

async function readSkillDirectory(skillsRoot: string, skillDir: string) {
  const jsonSkillPath = path.join(skillsRoot, skillDir, "skill.json");

  try {
    const raw = await fs.readFile(jsonSkillPath, "utf-8");
    const parsed = skillSchema.parse(JSON.parse(raw));

    if (parsed.id !== skillDir) {
      throw new Error(`Skill id mismatch: ${parsed.id} != ${skillDir}`);
    }

    return parsed;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
      throw error;
    }
  }

  const markdownSkillPath = path.join(skillsRoot, skillDir, "SKILL.md");
  const markdown = await fs.readFile(markdownSkillPath, "utf-8");
  return parseMarkdownSkill(skillDir, markdown);
}

async function listSkillDirectories(skillsRoot: string) {
  try {
    const entries = await fs.readdir(skillsRoot, { withFileTypes: true });
    return entries
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return [];
    }

    throw error;
  }
}

export async function loadSkill(id: string): Promise<AgentSkill> {
  for (const skillsRoot of getSkillRoots()) {
    try {
      return await readSkillDirectory(skillsRoot, id);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") {
        continue;
      }

      throw error;
    }
  }

  throw new Error(`Skill not found: ${id}`);
}

export async function listSkills(): Promise<AgentSkill[]> {
  const seenSkillIds = new Set<string>();
  const skills: AgentSkill[] = [];

  for (const skillsRoot of getSkillRoots()) {
    const skillDirs = await listSkillDirectories(skillsRoot);

    for (const skillDir of skillDirs) {
      if (seenSkillIds.has(skillDir)) {
        continue;
      }

      skills.push(await readSkillDirectory(skillsRoot, skillDir));
      seenSkillIds.add(skillDir);
    }
  }

  return skills;
}
