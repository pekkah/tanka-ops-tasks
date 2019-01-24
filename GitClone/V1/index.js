"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const task_1 = __importDefault(require("azure-pipelines-task-lib/task"));
const path_1 = __importDefault(require("path"));
const child_process_1 = require("child_process");
function clone(repository, branch, target) {
    return child_process_1.execSync(`git clone --single-branch --branch ${branch}  ${repository} ${target}`, { stdio: "inherit" });
}
/*
git config --global user.email "you@example.com"
git config --global user.name "Your Name"
*/
function globalConfig(key, value) {
    return child_process_1.execSync(`git config --global ${key} "${value}"`, { stdio: "inherit" });
}
function getGithubEndPointToken(githubEndpoint) {
    const githubEndpointObject = task_1.default.getEndpointAuthorization(githubEndpoint, false);
    let githubEndpointToken = null;
    if (!!githubEndpointObject) {
        task_1.default.debug("Endpoint scheme: " + githubEndpointObject.scheme);
        if (githubEndpointObject.scheme === "PersonalAccessToken") {
            githubEndpointToken = githubEndpointObject.parameters.accessToken;
        }
        else if (githubEndpointObject.scheme === "OAuth") {
            // scheme: 'OAuth'
            githubEndpointToken = githubEndpointObject.parameters.AccessToken;
        }
        else if (githubEndpointObject.scheme) {
            throw new Error(task_1.default.loc("InvalidEndpointAuthScheme", githubEndpointObject.scheme));
        }
    }
    if (!githubEndpointToken) {
        throw new Error(`Could not get token for endpoint ${githubEndpoint}`);
    }
    return githubEndpointToken;
}
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            var taskManifestPath = path_1.default.join(__dirname, "task.json");
            task_1.default.debug("Setting resource path to " + taskManifestPath);
            task_1.default.setResourcePath(taskManifestPath);
            // get github details
            const githubEndpoint = task_1.default.getInput("gitHubConnection", true);
            const githubEndpointToken = getGithubEndPointToken(githubEndpoint);
            const repositoryName = task_1.default.getInput("repositoryName", true);
            const branch = task_1.default.getInput("branch", true);
            const target = task_1.default.getPathInput("target", true);
            const repositoryUrl = `https://${githubEndpointToken}@github.com/${repositoryName}.git`;
            const name = task_1.default.getInput("name", true);
            const email = task_1.default.getInput("email", true);
            globalConfig("user.email", email);
            globalConfig("user.name", name);
            clone(repositoryUrl, branch, target);
        }
        catch (err) {
            task_1.default.setResult(task_1.default.TaskResult.Failed, err.message);
        }
    });
}
run();
