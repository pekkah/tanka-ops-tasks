import tl from "azure-pipelines-task-lib/task";
import path from "path";
import { execSync } from "child_process";

function addAll(target: string): Buffer {
  return execSync(`git add --all`, {
    stdio: "inherit",
    cwd: target
  });
}

async function run(): Promise<void> {
  try {
    var taskManifestPath: string = path.join(__dirname, "task.json");
    tl.debug("Setting resource path to " + taskManifestPath);
    tl.setResourcePath(taskManifestPath);

    // get github details
    const target: string = tl.getPathInput("repositoryFolder", true, true);

    addAll(target);
  } catch (err) {
    tl.setResult(tl.TaskResult.Failed, err.message);
  }
}

run();
