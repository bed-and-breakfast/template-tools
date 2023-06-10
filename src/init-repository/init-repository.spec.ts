import { existsSync, rmSync } from 'fs';
import { removeChangelog } from './init-repository';
import mocked = jest.mocked;

jest.mock('fs');
jest.mock('child_process');

// const answers: Answers = {
//     package: {
//         name: '@test-suite/test',
//         author: 'Test Author',
//         description: 'Test Package',
//         keywords: 'test, package',
//     },
//     codeClimate: true,
//     githubPath: 'test-suite/test123',
//     initialCommit: false,
//     packageKeywordsBedBreakfast: false,
// };

describe(removeChangelog.name, () => {
    it('Should remove changelog when CHANGELOG.md exists', async () => {
        mocked(existsSync).mockReturnValueOnce(true);

        removeChangelog();

        expect(rmSync).toHaveBeenCalledTimes(1);
        expect(rmSync).toHaveBeenCalledWith('CHANGELOG.md');

        mocked(existsSync).mockClear();
        mocked(rmSync).mockClear();
    });

    it("Should not call rmSync when CHANGELOG.md doesn't exist", async () => {
        mocked(existsSync).mockReturnValueOnce(false);

        removeChangelog();

        expect(rmSync).toHaveBeenCalledTimes(0);

        mocked(existsSync).mockClear();
        mocked(rmSync).mockClear();
    });
});

// describe(doInitialCommit.name, () => {
//     it('Should remove changelog when CHANGELOG.md exists', async () => {
//         mocked(existsSync).mockReturnValueOnce(true);
//
//         removeChangelog();
//
//         expect(rmSync).toHaveBeenCalledTimes(1);
//         expect(rmSync).toHaveBeenCalledWith('CHANGELOG.md');
//
//         mocked(existsSync).mockClear();
//         mocked(rmSync).mockClear();
//     });
//
//     it("Should not call rmSync when CHANGELOG.md doesn't exist", async () => {
//         mocked(existsSync).mockReturnValueOnce(false);
//
//         removeChangelog();
//
//         expect(rmSync).toHaveBeenCalledTimes(0);
//
//         mocked(existsSync).mockClear();
//         mocked(rmSync).mockClear();
//     });
// });

// describe(writePackageJson.name, () => {
//     const answers: Answers = {
//         package: {
//             name: '@bed-and-breakfast/test',
//         },
//     };
//
//     beforeAll(() => {
//         const packageJson = JSON.parse(readFileSync('package.json').toString());
//
//         expect();
//     });
//
//     it('Should remove changelog when CHANGELOG.md exists', async () => {
//         mocked(existsSync).mockReturnValueOnce(true);
//
//         removeChangelog();
//
//         expect(rmSync).toHaveBeenCalledTimes(1);
//         expect(rmSync).toHaveBeenCalledWith('CHANGELOG.md');
//
//         mocked(existsSync).mockClear();
//         mocked(rmSync).mockClear();
//     });
//
//     it('Should create package.json with format', async () => {
//         writePackageJson(answers);
//
//         expect(writeFileSync).toHaveBeenCalledTimes(1);
//         expect(writeFileSync).toHaveBeenCalledWith('package.json', JSON.stringify({...}));
//     });
// });

// describe(questionUser.name, () => {
//     it('Should create package.json with format', async () => {
//         // spawnSync('tsc', ['--outDir', '___TEST___']);
//         // spawnSync('tsc');
//         // spawnSync('tsc --outDir ___TEST___');
//
//         // const ss = spawn('node', [], { stdio: [process.stdin, process.stdout, process.stderr] });
//         console.log('GVD');
//         const ss = spawnSync('ls');
//         console.log(ss.stdout);
//
//         // ss.stdin.setDefaultEncoding('utf-8');
//         // ss.stdout.pipe(process.stdout);
//         //
//         // ss.stdin.write("console.log('Hello from PhantomJS')\n");
//         //
//         // ss.stdin.end();
//
//         // await new Promise((resolve) => {
//         //     ss.on('exit', resolve);
//         // });
//
//         const a = await run(
//             ['TEST/init/index.js'],
//             [
//                 answers.package.name,
//                 ENTER,
//                 // answers.package.description,
//                 // ENTER,
//                 // ENTER,
//                 // 'n',
//                 // ENTER,
//                 // answers.package.keywords,
//                 // ENTER,
//                 // ENTER,
//                 // ENTER,
//                 // 'n',
//                 // ENTER,
//             ]
//         );
//
//         console.log(a);
//     });
// });

// await run([cliPath], [ENTER]);
// t.regex(result, new RegExp('TEST-1', 'g'));
// }
