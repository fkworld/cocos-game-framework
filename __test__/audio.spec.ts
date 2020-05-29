import * as audio from "../src/audio";
import * as local from "../src/local";

local._init_local_runtime({
  language: "chinese",
  music: true,
  sound: true,
});
audio._init_audio_runtime({
  test_music: "###muisc",
  test_sound: "sound",
});

test("get_music_switch", () => {
  expect(audio.get_music_switch()).toBe(true);
});

test("reverse_music_switch", () => {
  audio.reverse_music_switch();
  expect(audio.get_music_switch()).toBe(false);
  audio.reverse_music_switch();
  expect(audio.get_music_switch()).toBe(true);
});

test("get_sound_switch", () => {
  expect(audio.get_sound_switch()).toBe(true);
});

test("reverse_sound_switch", () => {
  audio.reverse_sound_switch();
  expect(audio.get_sound_switch()).toBe(false);
  audio.reverse_sound_switch();
  expect(audio.get_sound_switch()).toBe(true);
});
