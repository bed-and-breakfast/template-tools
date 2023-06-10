import inquirer from 'inquirer';
export type Answers = {
    package: {
        name: string;
        description: string;
        author: string;
        keywords: string | string[];
    };
    githubPath: string;
    packageKeywordsBedBreakfast: boolean;
    codeClimateId: string;
    initialCommit: boolean;
};
export declare const processAnswers: (answers: Answers) => {
    package: {
        keywords: string[];
        name: string;
        description: string;
        author: string;
    };
    githubPath: string;
    packageKeywordsBedBreakfast: boolean;
    codeClimateId: string;
    initialCommit: boolean;
};
export declare const writePackageJson: (answers: Answers) => void;
export declare const writeReadme: (answers: Answers) => void;
export declare const removeChangelog: () => void;
export declare const initialCommit: (answers: Answers) => void;
export declare const questionUser: () => Promise<Answers> & {
    ui: inquirer.ui.Prompt<Answers>;
};
export declare const replaceCodeClimateId: (answers: Answers) => void;
export declare const initRepository: () => void;
