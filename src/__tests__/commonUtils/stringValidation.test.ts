// @ts-nocheck
import { stringValidation, URLvalidator } from '../../commonUtils/stringValidation';

it('commonUtils string validation test', () => {
    let resp = stringValidation('test data');
    expect(resp).toEqual(true);
});

it('commonUtils URL validation test', () => {
    let resp = URLvalidator('https://www.dentsu.com');
    expect(resp).toEqual(true);
});
