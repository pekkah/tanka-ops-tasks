import tl, { EndpointAuthorization } from "azure-pipelines-task-lib/task";
import path from "path";
import { execSync } from "child_process";

function clone(
  repository: string,
  branch: string,
  target: string
): Buffer {
  return execSync(
    `git clone --single-branch --branch ${branch}  ${repository} ${target}`,
    { stdio: "inherit" }
  );
}

/* 
git config --global user.email "you@example.com"
git config --global user.name "Your Name"
*/
function globalConfig (key: string, value: string) {
  return execSync(
    `git config --global ${key} "${value}"`,
    { stdio: "inherit" }
  );
}

function getGithubEndPointToken(githubEndpoint: string): string {
  const githubEndpointObject: EndpointAuthorization = tl.getEndpointAuthorization(
    githubEndpoint,
    false
  );

  let githubEndpointToken: string | null = null;

  if (!!githubEndpointObject) {
    tl.debug("Endpoint scheme: " + githubEndpointObject.scheme);

    if (githubEndpointObject.scheme === "PersonalAccessToken") {
      githubEndpointToken = githubEndpointObject.parameters.accessToken;
    } else if (githubEndpointObject.scheme === "OAuth") {
      // scheme: 'OAuth'
      githubEndpointToken = githubEndpointObject.parameters.AccessToken;
    } else if (githubEndpointObject.scheme) {
      throw new Error(
        tl.loc("InvalidEndpointAuthScheme", githubEndpointObject.scheme)
      );
    }
  }

  if (!githubEndpointToken) {
    throw new Error(`Could not get token for endpoint ${githubEndpoint}`);
  }

  return githubEndpointToken;
}



async function run(): Promise<void> {
  try {
    var taskManifestPath: string = path.join(__dirname, "task.json");
    tl.debug("Setting resource path to " + taskManifestPath);
    tl.setResourcePath(taskManifestPath);

    // get github details
    const githubEndpoint: string = tl.getInput("gitHubConnection", true);
    const githubEndpointToken: string = getGithubEndPointToken(githubEndpoint);
    const repositoryName: string = tl.getInput("repositoryName", true);
    const branch: string = tl.getInput("branch", true);
    const target: string = tl.getPathInput("target", true);
    const repositoryUrl: string = `https://${githubEndpointToken}@github.com/${repositoryName}.git`;
    const name: string = tl.getInput("name", true);
    const email: string = tl.getInput("email", true);

    globalConfig("user.email", email);
    globalConfig("user.name", name);
    clone(repositoryUrl, branch, target);
  } catch (err) {
    tl.setResult(tl.TaskResult.Failed, err.message);
  }
}

run();
