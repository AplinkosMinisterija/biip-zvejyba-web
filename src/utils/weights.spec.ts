import { describe, expect, it } from 'vitest';
import { otherToolsPreliminary } from './weights';

describe('otherToolsPreliminary', () => {
  it('subtracts the own group entry from the fishing-wide aggregate', () => {
    expect(otherToolsPreliminary({ 1: 10, 2: 5 }, { 1: 4 })).toEqual({ 1: 6, 2: 5 });
  });

  it('drops species fully covered by the own entry', () => {
    expect(otherToolsPreliminary({ 1: 4 }, { 1: 4 })).toEqual({});
  });

  it('clamps at zero when a stale aggregate is smaller than the own entry', () => {
    expect(otherToolsPreliminary({ 1: 3 }, { 1: 5 })).toEqual({});
  });

  it('avoids floating point artifacts', () => {
    expect(otherToolsPreliminary({ 1: 17.1 }, { 1: 12.3 })).toEqual({ 1: 4.8 });
  });

  it('handles missing inputs', () => {
    expect(otherToolsPreliminary(undefined, undefined)).toEqual({});
    expect(otherToolsPreliminary({ 1: 2 }, undefined)).toEqual({ 1: 2 });
  });
});
