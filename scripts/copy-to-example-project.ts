/**
 * 将部分文件拷贝置 example project 下
 */
import fs from "fs-extra";

interface Config {
  src: string;
  dest: string;
}

const configs: Config[] = [
  {
    src: ".vscode/settings.json",
    dest: "example-project/.vscode/settings.json",
  },
  { src: "dist/fy-1.0.0.dev.js", dest: "example-project/assets/script/lib/fy-1.0.0.dev.js" },
  { src: "types/", dest: "example-project/types/" },
];

const run = () => {
  configs.forEach(config => {
    fs.copySync(config.src, config.dest);
    console.log("Copy success!", config.src, "->", config.dest);
  });
};

run();
