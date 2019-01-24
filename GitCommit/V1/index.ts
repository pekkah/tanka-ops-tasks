import tl from "azure-pipelines-task-lib/task";
import path from "path";
import { execSync } from "child_process";


function commit(message: string, target: string): Buffer {
  return execSync(`git commit -m "${message}"`, {
    stdio: "inherit",
    cwd: target
  });
}

async function run(): Promise<void> {
  try {
    var taskManifestPath: string = path.join(__dirname, "task.json");
    tl.debug("Setting resource path to " + taskManifestPath);
    tl.setResourcePath(taskManifestPath);

    const message: string = tl.getInput("message", true);
    const target : string = tl.getPathInput("repositoryFolder", true, true);

    commit(message, target);
  } catch (err) {
    tl.setResult(tl.TaskResult.Failed, err.message);
  }
}

run();
