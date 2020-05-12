/**
 * meta类的例子，建议新建的meta类复制此脚本
 */
@fy.DeSetMetaContext("MetaExample")
export class MetaExample extends fy.MetaBase {

    use_special(s: object): void { }

    use_default(id: string): void { }

}
