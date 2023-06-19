import { spawnSync } from 'child_process';

export const templateAddRemote = () => {
    spawnSync('git', ['remote', 'add', 'template', 'git@github.com:bed-and-breakfast/templates-open-source.git']);
    spawnSync('git', ['remote', 'set-url', 'template', '--push="Thou shalt not push!"']);
};

export const templatePull = () => {
    spawnSync('git', ['pull', 'template', 'main', '--allow-unrelated-histories']);
};
