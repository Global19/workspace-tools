import findUp from "find-up";
import path from "path";
import jju from "jju";
import fs from "fs";

import { WorkspaceInfo } from "../../types/WorkspaceInfo";

export function getRushWorkspaceRoot(cwd: string): string {
  const rushJsonPath = findUp.sync("rush.json", { cwd });

  if (!rushJsonPath) {
    throw new Error("Could not find rush workspaces root");
  }

  return path.dirname(rushJsonPath);
}

export function getRushWorkspaces(cwd: string): WorkspaceInfo {
  try {
    const rushWorkspaceRoot = getRushWorkspaceRoot(cwd);
    const rushJsonPath = path.join(rushWorkspaceRoot, "rush.json");

    const rushConfig = jju.parse(fs.readFileSync(rushJsonPath, "utf-8"));
    const root = path.dirname(rushJsonPath);

    return rushConfig.projects.map((project) => {
      return {
        name: project.packageName,
        path: path.join(root, project.projectFolder),
        packageJson: {
          ...project.packageJson,
          packageJsonPath: path.join(
            root,
            project.projectFolder,
            "package.json"
          ),
        },
      };
    });
  } catch {
    return [];
  }
}
