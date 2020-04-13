/**
 * 解析csv为json文件
 * - 读取所有的csv文件，并写入为单个json文件，保存在resources/csv路径下
 * - 标准的csv格式，以//开头的为注释行，每张表中必须带有id属性
 * - json文件格式为：文件名-id-单行内容（属性名+数值）
 */

import fs from "fs"
import Papa from "papaparse"

// csv源数据
const SOURCE_CSV = "./game-config-csv/"
// 目标json数据
const TARGET_JSON = "./assets/resources/game-config-csv-all.json"

function start() {
    // 读取所有的files
    let files = fs.readdirSync(SOURCE_CSV)
    // 解析csv保存为json
    let all_json = {}
    files.forEach(file => {
        let file_array = Papa.parse(fs.readFileSync(SOURCE_CSV + file).toString(), {
            header: true,
            skipEmptyLines: "greedy",
            comments: "//",
        }).data
        all_json[file] = Object.fromEntries(file_array.map(v => [v["id"], v]))
        console.log(file, file_array.length)
    })
    fs.writeFileSync(TARGET_JSON, JSON.stringify(all_json))
}

start()
