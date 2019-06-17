/** 基础i18n文件对应的type */
export type TypeI18n = { [key in keyof typeof en]: string }

/** i18n-英文 */
export const en = {

    "panel_loading_game_info": "{0}\nCreated by {1}\nV {2} @{3}",

    "panel_message_title": "Message",
    "panel_message_yes": "Yes",
    "panel_message_no": "No",
}
