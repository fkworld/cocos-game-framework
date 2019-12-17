import { FMeta } from "../framework/FMeta";

/**
 * meta类的例子,建议新建的meta类复制此脚本
 */
@FMeta.SetMetaContext({
    file_path_list: [],
})
export class MetaExample extends FMeta.MetaBase {

    on_load(source: FMeta.CsvLine): void {

    }

}
