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
function push(target) {
    return child_process_1.execSync(`git push`, {
        stdio: "inherit",
        cwd: target
    });
}
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            var taskManifestPath = path_1.default.join(__dirname, "task.json");
            task_1.default.debug("Setting resource path to " + taskManifestPath);
            task_1.default.setResourcePath(taskManifestPath);
            const target = task_1.default.getPathInput("repositoryFolder", true, true);
            push(target);
        }
        catch (err) {
            task_1.default.setResult(task_1.default.TaskResult.Failed, err.message);
        }
    });
}
run();
