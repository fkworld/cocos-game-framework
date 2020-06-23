import { _init_local } from "../src";
import {
  get_audio,
  get_music_switch,
  get_sound_switch,
  play_audio,
  pre_audio,
  reverse_music_switch,
  reverse_sound_switch,
  stop_audio,
  _init_audio,
} from "../src/audio";

beforeEach(() => {
  _init_local({}, true);
  _init_audio({ test_music: "###muisc", test_sound: "sound" }, true, true);
});

describe(get_music_switch.name, () => {
  test("", () => {
    expect(get_music_switch()).toBe(true);
  });
  test("初始化时传入false", () => {
    _init_audio({}, false, false);
    expect(get_music_switch()).toBe(false);
  });
});

describe(reverse_music_switch.name, () => {
  test("", () => {
    reverse_music_switch();
    expect(get_music_switch()).toBe(false);
    reverse_music_switch();
    expect(get_music_switch()).toBe(true);
  });
});

describe(get_sound_switch.name, () => {
  test("", () => {
    expect(get_sound_switch()).toBe(true);
  });
  test("初始化时传入false", () => {
    _init_audio({}, false, false);
    expect(get_sound_switch()).toBe(false);
  });
});

describe(reverse_sound_switch.name, () => {
  test("", () => {
    reverse_sound_switch();
    expect(get_sound_switch()).toBe(false);
    reverse_sound_switch();
    expect(get_sound_switch()).toBe(true);
  });
});

describe(pre_audio.name, () => {
  // TODO
});

describe(get_audio.name, () => {
  // TODO
});

describe(play_audio.name, () => {
  // TODO
});

describe(stop_audio.name, () => {
  // TODO
});
