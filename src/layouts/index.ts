/**
 * @description Export Split Layouts
 */
const contexts: Record<string, any> = import.meta.globEager('./*.vue')
const modules: Array<any> = []
for (const [, val] of Object.entries(contexts))
    modules.push(val)

const layouts: any[] = []
modules.forEach((component: any) => {
    const layout = component.default
    layouts.push(layout)
})
export default layouts
