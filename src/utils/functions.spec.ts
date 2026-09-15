import { describe, expect, it } from 'vitest';
import { canCheckTool, computeBuiltToolsGuards } from './functions';
import { ToolsGroup } from './types';

const NETS = 1;
const CATCHERS = 2;
const CURRENT_FISHING = 7;

type Check = 'unchecked' | 'empty' | 'withFish';

const toolsGroup = (id: number, toolType: number, buildFishingId?: number, check?: Check) =>
  ({
    id,
    tools: [{ id, toolType: { id: toolType } }],
    buildEvent: { id: `b${id}`, ...(buildFishingId ? { fishing: { id: buildFishingId } } : {}) },
    ...(check === 'empty' ? { weightEvent: { id: `w${id}`, data: {} } } : {}),
    ...(check === 'withFish' ? { weightEvent: { id: `w${id}`, data: { 5: 3 } } } : {}),
  }) as unknown as ToolsGroup;

describe('canCheckTool', () => {
  it('hides the check for a tool set during this fishing', () => {
    expect(canCheckTool(toolsGroup(1, NETS, CURRENT_FISHING), CURRENT_FISHING)).toBe(false);
  });

  it('keeps the check for a tool left in the water by an earlier fishing', () => {
    expect(canCheckTool(toolsGroup(1, NETS, 6), CURRENT_FISHING)).toBe(true);
  });

  it('compares ids across types — the API encodes them as strings', () => {
    expect(canCheckTool(toolsGroup(1, NETS, CURRENT_FISHING), '7')).toBe(false);
  });

  it('keeps the check when the build fishing is unknown', () => {
    expect(canCheckTool(toolsGroup(1, NETS), CURRENT_FISHING)).toBe(true);
  });
});

describe('computeBuiltToolsGuards', () => {
  it('leaves tools set during this fishing out of the counts', () => {
    const guards = computeBuiltToolsGuards(
      [
        toolsGroup(11, NETS, 6),
        toolsGroup(12, NETS, 6),
        toolsGroup(13, NETS, CURRENT_FISHING), // dropped minutes ago
      ],
      CURRENT_FISHING,
    );

    expect(guards.toolTypesCounts[NETS]).toBe(2);
  });

  it('clears the mid-checking lock once every checkable net is done', () => {
    // Two leftover nets handled (one empty check, one weighed) plus a net set
    // on this trip. Counting the fresh net would keep NETS "mid-checking" and
    // leave every other tool type locked behind it.
    const guards = computeBuiltToolsGuards(
      [
        toolsGroup(11, NETS, 6, 'empty'),
        toolsGroup(12, NETS, 6, 'withFish'),
        toolsGroup(13, NETS, CURRENT_FISHING),
        toolsGroup(21, CATCHERS, 6),
      ],
      CURRENT_FISHING,
    );

    expect(guards.notCompletedToolType).toBeUndefined();
  });

  it('still reports a half-checked type as mid-checking', () => {
    const guards = computeBuiltToolsGuards(
      [toolsGroup(11, NETS, 6, 'empty'), toolsGroup(12, NETS, 6)],
      CURRENT_FISHING,
    );

    expect(guards.notCompletedToolType).toBe(String(NETS));
  });
});
