import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { execFileSync } from "node:child_process";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const buildDir = path.join(root, "build", "mcpb");
const bundlePath = path.join(root, "build", "apiverket-mcp.mcpb");

function run(command, args, cwd = root) {
  execFileSync(command, args, { cwd, stdio: "inherit" });
}

await rm(buildDir, { recursive: true, force: true });
await mkdir(buildDir, { recursive: true });

run("npm", ["run", "build"]);

await cp(path.join(root, "dist"), path.join(buildDir, "dist"), { recursive: true });
await cp(path.join(root, "mcpb", "manifest.json"), path.join(buildDir, "manifest.json"));
await cp(path.join(root, "README.md"), path.join(buildDir, "README.md"));
await cp(path.join(root, "LICENSE"), path.join(buildDir, "LICENSE"));

const pkg = JSON.parse(await readFile(path.join(root, "package.json"), "utf8"));
const runtimePackage = {
  type: pkg.type,
  dependencies: pkg.dependencies,
  engines: pkg.engines
};

await writeFile(
  path.join(buildDir, "package.json"),
  `${JSON.stringify(runtimePackage, null, 2)}\n`
);

if (existsSync(path.join(root, "package-lock.json"))) {
  await cp(path.join(root, "package-lock.json"), path.join(buildDir, "package-lock.json"));
  run("npm", ["ci", "--omit=dev", "--ignore-scripts"], buildDir);
} else {
  run("npm", ["install", "--omit=dev", "--ignore-scripts"], buildDir);
}

await writeFile(path.join(buildDir, ".mcpbignore"), [
  "package-lock.json",
  "npm-debug.log*",
  "*.map",
  ".DS_Store",
  ""
].join("\n"));

run("npx", ["-y", "@anthropic-ai/mcpb", "validate", buildDir]);
run("npx", ["-y", "@anthropic-ai/mcpb", "pack", buildDir, bundlePath]);
run("npx", ["-y", "@anthropic-ai/mcpb", "info", bundlePath]);

console.log(`MCPB bundle written to ${bundlePath}`);
