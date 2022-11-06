export class Subject {
    state: Record<string, unknown>
    observers: any[]
    constructor(data = {}) {
        this.observers = []
        this.state = data
    }

    /**
     * 获取值
     */
    getState() {
        return this.state
    }

    /**
     * 设置值
     * @param state
     * @param immediate
     */
    setState(state: any, immediate = false) {
        this.state = state
        if (immediate)
            this.notifyAllObservers()
    }

    /**
     * 添加观察者
     * @param observer<Observer>
     */
    attach(observer: any) {
        this.observers.push(observer)
    }

    /**
     * 通知
     */
    notifyAllObservers() {
        for (const observer of this.observers) {
            if (typeof observer.update === 'function')
                observer.update(this.state)
        }
    }
}

export class Observer {
    subject: any
    update: any
    constructor(subject: any, update: any) {
        this.subject = subject
        this.update = update
        this.subject.attach(this)
    }
}

/**
 * 水公共数据仓库
 */
export class Store {
    storeObj: { [key: string]: any }
    constructor() {
        this.storeObj = {}
    }

    /**
     * 水公共数据仓库初始化数据
     * @param key<string> 数据键
     * @param value<any> 数据值
     * @param callback<Function> 数据修改回调函数
     * @return {Observer}
     */
    initValue(key: string, value: { [key: string]: any }, callback: any) {
        const currentValueSubject = new Subject(value)
        // eslint-disable-next-line no-new
        new Observer(currentValueSubject, async (res: any) => {
            if (typeof callback === 'function')
                callback(res)
        })
        this.storeObj[key] = currentValueSubject
    }

    /**
     * 获取水数据仓库数据
     * @param key<any>
     */
    getValue(key: string) {
        return this.storeObj[key] instanceof Subject ? this.storeObj[key].getState() : null
    }

    /**
     * 水公共数据仓库添加数据
     * @param key<string> 数据键
     * @param value<any> 数据值
     * @param callback<Function> 数据修改回调函数
     * @return {Observer}
     */
    setValue(key: string, value: { type: string; value: Date }, callback: any) {
        const immediateFlag = this.storeObj[key] && this.storeObj[key] instanceof Subject
        if (!immediateFlag)
            this.initValue(key, value, callback)

        this.storeObj[key].setState(value, true)
    }

    /**
     * 给特定数据添加观察者
     * @param key<String> 数据键
     * @param fun<Function> 回调
     */
    pushObserver(key: string, fun: void) {
        if (this.storeObj[key] instanceof Subject)
            return new Observer(this.storeObj[key], fun)

        throw new Error('current data not in Store')
    }

    /**
     * 移除观察者
     * @param key<String> 数据键
     * @param fun<Function> 回调函数
     */
    deleteObserver(key: string, fun: void | undefined) {
        if (!fun)
            return

        if (this.storeObj[key] instanceof Subject) {
            const observers = this.storeObj[key].observers
            if (Array.isArray(observers)) {
                for (let i = observers.length - 1; i >= 0; i--) {
                    const _fn = observers[i]
                    if (_fn === fun)
                        observers.splice(i, 1)
                }
            }
        }
    }
}
const WaterStore = () => {
    return () => {
        const _globalWaterStore: any = new Store()
        return _globalWaterStore
    }
}
export default WaterStore()
