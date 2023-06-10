"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initRepository = exports.replaceCodeClimateId = exports.questionUser = exports.initialCommit = exports.removeChangelog = exports.writeReadme = exports.writePackageJson = exports.processAnswers = void 0;
/* eslint-disable import/no-extraneous-dependencies */
const fs_1 = require("fs");
const child_process_1 = require("child_process");
const chalk_1 = __importDefault(require("chalk"));
const inquirer_1 = __importDefault(require("inquirer"));
const validate_npm_package_name_1 = __importDefault(require("validate-npm-package-name"));
const js_yaml_1 = require("js-yaml");
const invalid = (message) => {
    // eslint-disable-next-line no-console
    console.log(`\n${chalk_1.default.red(message)}`);
};
const processAnswers = (answers) => (Object.assign(Object.assign({}, answers), { package: Object.assign(Object.assign({}, answers.package), { keywords: [
            ...(answers.packageKeywordsBedBreakfast ? ['bed', 'breakfast'] : []),
            ...(answers.package.keywords.length > 0
                ? answers.package.keywords.split(',').map((keyword) => keyword.trim())
                : []),
        ] }) }));
exports.processAnswers = processAnswers;
const writePackageJson = (answers) => {
    let packageJson = JSON.parse((0, fs_1.readFileSync)('package.json').toString());
    packageJson = Object.assign(Object.assign(Object.assign({}, packageJson), answers.package), { version: '0.0.0', homepage: `https://github.com/${answers.githubPath}`, bugs: `https://github.com/${answers.githubPath}/issues`, repository: { url: `https://github.com/${answers.githubPath}.git` } });
    (0, fs_1.writeFileSync)('package.json', JSON.stringify(packageJson));
    (0, child_process_1.spawnSync)('npx', ['format-package', '-w']);
};
exports.writePackageJson = writePackageJson;
const writeReadme = (answers) => {
    // prettier-ignore
    (0, fs_1.writeFileSync)('README.md', `# ${answers.package.description}
    
[![NPM Version](https://img.shields.io/npm/v/${answers.package.name})](https://www.npmjs.com/package/${answers.package.name})
[![CI](https://github.com/${answers.githubPath}/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/${answers.githubPath}/actions/workflows/ci.yml)
[![Release](https://github.com/${answers.githubPath}/actions/workflows/release.yml/badge.svg?branch=main)](https://github.com/${answers.githubPath}/actions/workflows/release.yml)
${answers.codeClimateId ? `[![Code Climate](https://codeclimate.com/github/${answers.githubPath}/badges/gpa.svg)](https://codeclimate.com/github/${answers.githubPath})
[![Code Coverage](https://codeclimate.com/github/${answers.githubPath}/badges/coverage.svg)](https://codeclimate.com/github/${answers.githubPath})` : ''}
[![Known Vulnerabilities](https://snyk.io/test/github/${answers.githubPath}/badge.svg?targetFile=package.json)](https://snyk.io/test/github/${answers.githubPath}?targetFile=package.json)`);
};
exports.writeReadme = writeReadme;
const removeChangelog = () => {
    const changelogPath = 'CHANGELOG.md';
    if ((0, fs_1.existsSync)(changelogPath)) {
        (0, fs_1.rmSync)(changelogPath);
    }
};
exports.removeChangelog = removeChangelog;
const initialCommit = (answers) => {
    if (answers.initialCommit) {
        (0, child_process_1.spawnSync)('git', ['add', 'package.json']);
        (0, child_process_1.spawnSync)('git', ['add', 'README.md']);
        (0, child_process_1.spawnSync)('git', ['add', 'CHANGELOG.md']);
        const spawn = (0, child_process_1.spawnSync)('git', ['commit', '-am', '"feat: create initial commit"'], { shell: true });
        if (spawn.stderr) {
            // eslint-disable-next-line no-console
            console.error(chalk_1.default.red(Error(spawn.stderr.toString()).toString()));
            process.exitCode = 1;
        }
    }
};
exports.initialCommit = initialCommit;
const questionUser = () => inquirer_1.default.prompt([
    {
        type: 'input',
        name: 'package.name',
        message: "What is the package name (i.e. '@bed-and-breakfast/package')",
        validate: (input) => {
            const valid = (0, validate_npm_package_name_1.default)(input).validForNewPackages;
            if (!valid) {
                invalid('Invalid package name');
            }
            return valid;
        },
    },
    {
        type: 'input',
        name: 'package.description',
        message: "What is the package description (i.e. 'Bed & Breakfast Package')",
        validate: (input) => {
            const valid = input.length >= 5;
            if (!valid) {
                invalid('Package description is too short');
            }
            return valid;
        },
    },
    {
        type: 'input',
        name: 'package.author',
        message: "What is the package author (i.e. 'Bed & Breakfast')",
        default: 'Bed & Breakfast',
        validate: (input) => {
            const valid = input.length >= 1;
            if (!valid) {
                invalid('Invalid package author');
            }
            return valid;
        },
    },
    {
        type: 'confirm',
        name: 'packageKeywordsBedBreakfast',
        message: "Would you like to add ['bed', 'breakfast'] to package keywords",
        default: true,
    },
    {
        type: 'input',
        name: 'package.keywords',
        message: "Would you like to add other keywords (i.e. 'npm,package,...')",
        validate: (input) => {
            let valid = false;
            const keywords = input.split(',');
            valid =
                input.length === 0 ||
                    (input.length >= 3 &&
                        keywords.length === keywords.filter((keyword) => keyword.length > 0).length);
            if (!valid) {
                invalid('Invalid package keywords');
            }
            return valid;
        },
    },
    {
        type: 'input',
        name: 'githubPath',
        message: 'What is the github url path (https://github.com/<PATH>, i.e. bed-and-breakfast/package)',
        default: (answers) => 
        // eslint-disable-next-line no-nested-ternary
        answers.package.name.indexOf('/') === -1
            ? undefined
            : answers.package.name.indexOf('@') === 0
                ? answers.package.name.substring(1)
                : answers.package.name,
        validate: (input) => {
            const valid = input.length >= 1 && input.indexOf('/') > 0;
            if (!valid) {
                invalid('Invalid github url path');
            }
            return valid;
        },
    },
    {
        type: 'input',
        name: 'codeClimateId',
        message: "If you would like to use Code Climate please provide a repo ID, otherwise provide 'n'",
        validate: (input) => {
            var _a;
            const valid = input === 'n' || (input.length === 64 && ((_a = input.match(/^[a-z0-9]+$/)) === null || _a === void 0 ? void 0 : _a.length) === 1);
            if (!valid) {
                invalid('Invalid Code Climate repo ID\nhttps://codeclimate.com/github/repos/new > Add repo > https://codeclimate.com/repos/6483bb2044ebef4ee54144db/settings/test_reporter > TEST REPORTER ID');
            }
            return valid;
        },
    },
    {
        type: 'confirm',
        name: 'initialCommit',
        message: 'Would you like to automatically do an initial commit',
        default: true,
    },
]);
exports.questionUser = questionUser;
const replaceCodeClimateId = (answers) => {
    var _a;
    const ciWorkflow = (0, js_yaml_1.load)((0, fs_1.readFileSync)('.github/workflows/ci.yml').toString());
    const codeClimateStep = ciWorkflow.jobs.test.steps.find((step) => step && step.uses && step.uses.indexOf('paambaati/codeclimate-action') === 0);
    if (codeClimateStep) {
        if (answers.codeClimateId &&
            answers.codeClimateId.length === 64 &&
            ((_a = answers.codeClimateId.match(/^[a-z0-9]+$/)) === null || _a === void 0 ? void 0 : _a.length) === 1) {
            codeClimateStep.env.CC_TEST_REPORTER_ID = answers.codeClimateId;
        }
        else {
            ciWorkflow.jobs.test.steps.splice(ciWorkflow.jobs.test.steps.indexOf(codeClimateStep), 1);
        }
    }
    (0, fs_1.writeFileSync)('.github/workflows/ci.yml', (0, js_yaml_1.dump)(ciWorkflow));
    (0, child_process_1.spawnSync)('prettier', ['.github/workflows/ci.yml', '--write']);
};
exports.replaceCodeClimateId = replaceCodeClimateId;
const initRepository = () => {
    (0, exports.questionUser)().then((answers) => {
        // eslint-disable-next-line no-param-reassign
        answers = (0, exports.processAnswers)(answers);
        (0, exports.writePackageJson)(answers);
        (0, exports.writeReadme)(answers);
        (0, exports.replaceCodeClimateId)(answers);
        (0, exports.removeChangelog)();
        (0, exports.initialCommit)(answers);
    });
};
exports.initRepository = initRepository;
//# sourceMappingURL=init-repository.js.map