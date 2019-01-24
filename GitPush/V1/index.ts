import tl from "azure-pipelines-task-lib/task";
import path from "path";
import { execSync } from "child_process";

function push(target: string): Buffer {
  return execSync(`git push`, {
    stdio: "inherit",
    cwd: target
  });
}

async function run(): Promise<void> {
  try {
    var taskManifestPath: string = path.join(__dirname, "task.json");
    tl.debug("Setting resource path to " + taskManifestPath);
    tl.setResourcePath(taskManifestPath);

    const target: string = tl.getPathInput("repositoryFolder", true, true);
    push(target);
  } catch (err) {
    tl.setResult(tl.TaskResult.Failed, err.message);
  }
}

run();
