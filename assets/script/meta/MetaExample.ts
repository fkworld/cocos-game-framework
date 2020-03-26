import { FMeta } from "../framework/FMeta";

/**
 * meta类的例子，建议新建的meta类复制此脚本
 */
@FMeta.SetMetaContext("MetaExample")
export class MetaExample extends FMeta.MetaBase {

    use_special(s: object): void { }

    use_default(id: string): void { }

}
