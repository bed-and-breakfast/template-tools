import { add } from './example';

describe(add.name, () => {
    it('Should add up first and second argument', () => {
        expect(add(1, 2)).toEqual(3);
        expect(add(2, 3)).toEqual(5);
    });
});
