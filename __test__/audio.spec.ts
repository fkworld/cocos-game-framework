import * as audio from "../src/audio";

audio._init_audio({
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
