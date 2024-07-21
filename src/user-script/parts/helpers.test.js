import { describe, expect, it } from 'vitest';
import { upperCaseFirstLetter } from './helpers';

describe('upperCaseFirstLetter', () => {
  it('upperCaseFirstLetter() - should capitalize', () => {
    expect(upperCaseFirstLetter('jonh')).toBe('Jonh');
  });
});
