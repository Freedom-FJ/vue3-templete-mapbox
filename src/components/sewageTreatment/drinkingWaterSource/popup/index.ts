/**
 * @description Export Split Layouts
 */
const contexts: any = import.meta.globEager('./*.vue')
const popLayouts: { [key: string]: any } = {}
for (const key in contexts) {
    const replaceKey: string = key.replace(/(\.\/module\/|\.vue)/g, '') // 去除末尾的.png
    popLayouts[replaceKey.substring(replaceKey.lastIndexOf('/') + 1)]
         = contexts[key].default
}
export default popLayouts
