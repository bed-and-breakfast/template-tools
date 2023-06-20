/* eslint-disable import/no-extraneous-dependencies */
import { existsSync, mkdirSync, readdirSync, readFileSync, rmdirSync, rmSync, writeFileSync } from 'fs';
import { spawnSync } from 'child_process';
import chalk from 'chalk';
import inquirer from 'inquirer';
import validate from 'validate-npm-package-name';
import { dump, load } from 'js-yaml';
import { templateAddRemote } from '../template-remote';

export type Answers = {
    package: { name: string; description: string; author: string; keywords: string | string[] };
    githubPath: string;
    packageKeywordsBedBreakfast: boolean;
    codeClimateId: string;
    initialCommit: boolean;
    uninstallPackage: boolean;
};

const invalid = (message: string) => {
    // eslint-disable-next-line no-console
    console.log(`\n${chalk.red(message)}`);
};

export const processAnswers = (answers: Answers) => ({
    ...answers,
    package: {
        ...answers.package,
        keywords: [
            ...(answers.packageKeywordsBedBreakfast ? ['bed', 'breakfast'] : []),
            ...(answers.package.keywords.length > 0
                ? (answers.package.keywords as string).split(',').map((keyword) => keyword.trim())
                : []),
        ],
    },
});

const backupAnswersFile = 'tmp/template-init-answers.json';
export const getBackupAnswers = (): Answers | false => {
    if (existsSync(backupAnswersFile)) {
        return JSON.parse(readFileSync(backupAnswersFile).toString());
    }

    return false;
};

export const setBackupAnswers = (answers: Answers) => {
    const dir = backupAnswersFile.substring(0, backupAnswersFile.lastIndexOf('/'));

    if (!existsSync(dir)) {
        mkdirSync(dir, { recursive: true });
    }

    writeFileSync(backupAnswersFile, JSON.stringify(answers));
};

export const clearBackupAnswers = () => {
    const dir = backupAnswersFile.substring(0, backupAnswersFile.lastIndexOf('/'));

    rmSync(backupAnswersFile);

    if (readdirSync(dir).length === 0) {
        rmdirSync(dir);
    }
};

export const writePackageJson = (answers: Answers) => {
    let packageJson = JSON.parse(readFileSync('package.json').toString());

    packageJson = {
        ...packageJson,
        ...answers.package,
        version: '0.0.0',
        homepage: `https://github.com/${answers.githubPath}`,
        bugs: `https://github.com/${answers.githubPath}/issues`,
        repository: { url: `https://github.com/${answers.githubPath}.git` },
    };

    writeFileSync('package.json', JSON.stringify(packageJson));

    spawnSync('npx', ['format-package', '-w']);
};

export const writeReadme = (answers: Answers) => {
    // prettier-ignore
    writeFileSync('README.md', `# ${answers.package.description}
    
[![NPM Version](https://img.shields.io/npm/v/${answers.package.name})](https://www.npmjs.com/package/${answers.package.name})
[![CI](https://github.com/${answers.githubPath}/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/${answers.githubPath}/actions/workflows/ci.yml)
[![Release](https://github.com/${answers.githubPath}/actions/workflows/release.yml/badge.svg?branch=main)](https://github.com/${answers.githubPath}/actions/workflows/release.yml)
${answers.codeClimateId ? `[![Code Climate](https://codeclimate.com/github/${answers.githubPath}/badges/gpa.svg)](https://codeclimate.com/github/${answers.githubPath})
[![Code Coverage](https://codeclimate.com/github/${answers.githubPath}/badges/coverage.svg)](https://codeclimate.com/github/${answers.githubPath})` : ''}
[![Known Vulnerabilities](https://snyk.io/test/github/${answers.githubPath}/badge.svg?targetFile=package.json)](https://snyk.io/test/github/${answers.githubPath}?targetFile=package.json)
[![Semantic Release: Conventional Commits](https://img.shields.io/badge/semantic--release-conventional--commits-e10079?logo=semantic-release)](https://github.com/semantic-release/semantic-release)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)`)
};

export const removeChangelog = () => {
    const changelogPath = 'CHANGELOG.md';

    if (existsSync(changelogPath)) {
        rmSync(changelogPath);
    }
};

export const initialCommit = (answers: Answers) => {
    const logError = (stderr: Buffer) => {
        // eslint-disable-next-line no-console
        console.error(chalk.red(Error(stderr.toString()).toString()));
    };

    if (answers.initialCommit) {
        spawnSync('git', ['add', 'package.json']);

        spawnSync('git', ['add', 'README.md']);

        spawnSync('git', ['rm', 'CHANGELOG.md']);

        const commit = spawnSync('git', ['commit', '-am', '"feat: initialize repository"'], { shell: true });

        // eslint-disable-next-line no-console
        if (commit.status !== 0) {
            logError(commit.stderr);

            return false;
        }

        const push = spawnSync('git', ['push']);

        // eslint-disable-next-line no-console
        if (push.status !== 0) {
            logError(push.stderr);

            return false;
        }

        return true;
    }

    return true;
};

export const npmInstall = () => {
    spawnSync('npm', ['install']);
};

export const uninstallPackage = (answers: Answers) => {
    if (answers.uninstallPackage) {
        spawnSync('npm', ['uninstall', '-D', '@bed-and-breakfast/template-tools']);
    }
};

export const backupQuestionUser = () =>
    inquirer.prompt<{ backup: boolean }>([
        {
            type: 'confirm',
            name: 'backup',
            message: 'Would you like to re-use your previous answers?',
            default: true,
        },
    ]);

export const questionUser = () =>
    inquirer.prompt<Answers>([
        {
            type: 'input',
            name: 'package.name',
            message: "What is the package name (i.e. '@bed-and-breakfast/package')",
            validate: (input: string) => {
                const valid = validate(input).validForNewPackages;

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
            validate: (input: string) => {
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
            validate: (input: string) => {
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
            validate: (input: string) => {
                const keywords = input.split(',');

                const valid =
                    input.length === 0 ||
                    (input.length >= 3 &&
                        keywords.length === keywords.filter((keyword: string) => keyword.length > 0).length);

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
            default: (answers: Answers) =>
                // eslint-disable-next-line no-nested-ternary
                answers.package.name.indexOf('/') === -1
                    ? undefined
                    : answers.package.name.indexOf('@') === 0
                    ? answers.package.name.substring(1)
                    : answers.package.name,
            validate: (input: string) => {
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
            validate: (input: string) => {
                const valid = input === 'n' || (input.length === 64 && input.match(/^[a-z0-9]+$/)?.length === 1);

                if (!valid) {
                    invalid(
                        'Invalid Code Climate repo ID\nhttps://codeclimate.com/github/repos/new > Add repo > https://codeclimate.com/repos/6483bb2044ebef4ee54144db/settings/test_reporter > TEST REPORTER ID'
                    );
                }

                return valid;
            },
        },
        {
            type: 'confirm',
            name: 'initialCommit',
            message: 'Would you like to automatically do an initial commit?',
            default: true,
        },
        // {
        //     type: 'confirm',
        //     name: 'uninstallPackage',
        //     message: 'Would you like to uninstall the template tools package?',
        //     default: true,
        // },
    ]);

export const replaceCodeClimateId = (answers: Answers) => {
    const ciWorkflow = load(readFileSync('.github/workflows/ci.yml').toString()) as {
        jobs: { test: { steps: { uses: string; env: { CC_TEST_REPORTER_ID: string } }[] } };
    };

    const codeClimateStep = ciWorkflow.jobs.test.steps.find(
        (step) => step && step.uses && step.uses.indexOf('paambaati/codeclimate-action') === 0
    );

    if (codeClimateStep) {
        if (
            answers.codeClimateId &&
            answers.codeClimateId.length === 64 &&
            answers.codeClimateId.match(/^[a-z0-9]+$/)?.length === 1
        ) {
            codeClimateStep.env.CC_TEST_REPORTER_ID = answers.codeClimateId;
        } else {
            ciWorkflow.jobs.test.steps.splice(ciWorkflow.jobs.test.steps.indexOf(codeClimateStep), 1);
        }
    }

    writeFileSync('.github/workflows/ci.yml', dump(ciWorkflow));

    spawnSync('prettier', ['.github/workflows/ci.yml', '--write']);
};

export const doInit = (answers: Answers) => {
    npmInstall();
    writePackageJson(answers);
    writeReadme(answers);
    replaceCodeClimateId(answers);
    removeChangelog();
    templateAddRemote();
    // uninstallPackage(processedAnswers);

    if (initialCommit(answers)) {
        clearBackupAnswers();
    } else {
        process.exit(1);
    }
};

export const initRepository = () => {
    const backupAnswers = getBackupAnswers();

    const questionaire = () => {
        questionUser().then((answers) => {
            const processedAnswers = processAnswers(answers);

            setBackupAnswers(processedAnswers);

            doInit(processedAnswers);
        });
    };

    if (backupAnswers) {
        // eslint-disable-next-line no-console
        console.log(backupAnswers);

        backupQuestionUser().then(({ backup }) => {
            if (backup) {
                doInit(backupAnswers as Answers);
            } else {
                questionaire();
            }
        });
    } else {
        questionaire();
    }
};
