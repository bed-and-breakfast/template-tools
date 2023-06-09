/* eslint-disable import/no-extraneous-dependencies */
import { existsSync, readFileSync, rmSync, writeFileSync } from 'fs';
import { spawnSync } from 'child_process';
import chalk from 'chalk';
import inquirer from 'inquirer';
import validate from 'validate-npm-package-name';

export type Answers = {
    package: { name: string; description: string; author: string; keywords: string };
    githubPath: string;
    packageKeywordsBedBreakfast: boolean;
    codeClimate: boolean;
    initialCommit: boolean;
};

const invalid = (message: string) => {
    // eslint-disable-next-line no-console
    console.log(`\n${chalk.red(message)}`);
};

export const processAnswers = (answers: Answers) => ({
    ...answers,
    keywords: [
        ...(answers.packageKeywordsBedBreakfast ? ['bed', 'breakfast'] : []),
        ...(answers.package.keywords.length > 0
            ? answers.package.keywords.split(',').map((keyword) => keyword.trim())
            : []),
    ],
});

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
\n
[![NPM Version](https://img.shields.io/npm/v/${answers.package.name})](https://www.npmjs.com/package/${answers.package.name})
[![CI](https://github.com/${answers.githubPath}/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/${answers.githubPath}/actions/workflows/ci.yml)
[![Release](https://github.com/${answers.githubPath}/actions/workflows/release.yml/badge.svg?branch=main)](https://github.com/${answers.githubPath}/actions/workflows/release.yml)
${answers.codeClimate ? `[![Code Climate](https://codeclimate.com/github/${answers.githubPath}/badges/gpa.svg)](https://codeclimate.com/github/${answers.githubPath})
[![Code Coverage](https://codeclimate.com/github/${answers.githubPath}/badges/coverage.svg)](https://codeclimate.com/github/${answers.githubPath})` : ''}
[![Known Vulnerabilities](https://snyk.io/test/github/${answers.githubPath}/badge.svg?targetFile=package.json)](https://snyk.io/test/github/${answers.githubPath}?targetFile=package.json)`)
};

export const removeChangelog = () => {
    const changelogPath = 'CHANGELOG.md';

    if (existsSync(changelogPath)) {
        rmSync(changelogPath);
    }
};

export const doInitialCommit = () => {
    spawnSync('git', ['add', 'package.json']);

    spawnSync('git', ['add', 'README.md']);

    spawnSync('git', ['add', 'CHANGELOG.md']);

    const spawn = spawnSync('git', ['commit', '-am', '"feat: create initial commit"'], { shell: true });

    if (spawn.stderr) {
        // eslint-disable-next-line no-console
        console.error(chalk.red(Error(spawn.stderr.toString()).toString()));

        process.exitCode = 1;
    }
};

export const questionUser = () =>
    inquirer.prompt<Answers>([
        {
            type: 'input',
            name: 'package.name',
            message: "What is the package name (i.e. '@bed-and-breakfast/package')",
            validate: (input) => {
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
            validate: (input) => {
                const valid = input.length >= 1 && input.indexOf('/') > 0;

                if (!valid) {
                    invalid('Invalid github url path');
                }

                return valid;
            },
        },
        {
            type: 'confirm',
            name: 'codeClimate',
            message: 'Would you like to use Code Climate',
            default: true,
        },
        {
            type: 'confirm',
            name: 'initialCommit',
            message: 'Would you like to automatically do an initial commit',
            default: true,
        },
    ]);

export const initRepository = () => {
    questionUser().then((answers) => {
        // eslint-disable-next-line no-param-reassign
        answers = processAnswers(answers);

        writePackageJson(answers);

        writeReadme(answers);

        removeChangelog();

        if (answers.initialCommit) {
            doInitialCommit();
        }
    });
};
