const Configuration = {
    extends: ['@commitlint/config-conventional'],
    rules: {
        'type-enum': [
            2,
            'always',

            // Types are explained here: https://github.com/pvdlg/conventional-commit-types
            ['build', 'chore', 'ci', 'docs', 'feat', 'fix', 'perf', 'refactor', 'revert', 'style', 'test'],
        ],
    },
};

module.exports = Configuration;
