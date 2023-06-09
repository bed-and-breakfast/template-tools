module.exports = {
    disableEmoji: true,
    format: '{type}{scope}: {emoji}{subject}',
    list: ['build', 'chore', 'ci', 'docs', 'feat', 'fix', 'perf', 'refactor', 'revert', 'style', 'test'],
    maxMessageLength: 64,
    minMessageLength: 3,
    questions: ['type', 'scope', 'subject', 'body', 'breaking', 'issues'],
    scopes: [],
    types: {
        build: {
            description:
                'Changes that affect the build system or external dependencies (example scopes: gulp, broccoli, npm)',
            value: 'build',
        },
        chore: {
            description: "Other changes that don't modify src or test files",
            value: 'chore',
        },
        ci: {
            description:
                'Changes to our CI configuration files and scripts (example scopes: Travis, Circle, BrowserStack, SauceLabs)',
            value: 'ci',
        },
        docs: {
            description: 'Documentation only changes',
            value: 'docs',
        },
        feat: {
            description: 'A new feature',
            value: 'feat',
        },
        fix: {
            description: 'A bug fix',
            value: 'fix',
        },
        perf: {
            description: 'A code change that improves performance',
            value: 'perf',
        },
        refactor: {
            description: 'A code change that neither fixes a bug or adds a feature',
            value: 'refactor',
        },
        release: {
            description: 'Create a release commit',
            value: 'release',
        },
        revert: {
            description: 'Reverts a previous commit',
            value: 'revert',
        },
        style: {
            description:
                'Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)',
            value: 'style',
        },
        test: {
            description: 'Adding missing tests or correcting existing tests',
            value: 'test',
        },
        messages: {
            type: "Select the type of change that you're committing:",
            customScope: 'Select the scope this component affects:',
            subject: 'Write a short, imperative mood description of the change:\n',
            body: 'Provide a longer description of the change:\n ',
            breaking: 'List any breaking changes:\n',
            footer: 'Issues this commit closes, e.g #123:',
            confirmCommit: 'The packages that this commit has affected\n',
        },
    },
};
