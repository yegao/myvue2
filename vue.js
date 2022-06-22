const methodsToPatch = [
    'push',
    'pop',
    'shift',
    'unshift',
    'split',
    'sort',
    'reverse'
];

const oldArrayPrototype = Array.prototype;
const newArrayPrototype = Object.create(oldArrayPrototype);
methodsToPatch.forEach(function (method) {
    newArrayPrototype[method] = function(...args) {
        const len = this.length;
        const result = oldArrayPrototype[method].call(this, ...args);
        console.log('调用了' + method + '方法');
        switch(method) {
            case 'unshift':
            case 'push': {
                args.forEach((arg, index) => {
                    defineReactive(this, len + index, arg)
                });
                break;
            }
            case 'splice': {
                // list = ['m', 'n', 'x', 'y', 'z'];
                // list.splice(3, 2, 'a', 'b', 'c', 'd');
                // list = ['m', 'n', 'x', 'a', 'b', 'c', 'd'];
                const inserted = args.slice(2);
                const start = args[0];
                const slen = args[1];
                inserted.forEach((arg, index) => {
                    defineReactive(this, )
                });
            }
        }
        return result;
    };
})

// Object.defineProperty(newArrayPrototype, 'push', {
//     enumerable: true,
//     writable: true,
//     configurable: true,
//     value: function(...args) {
//         console.log('做了push动作');
//     }
// })
console.dir(newArrayPrototype)
console.dir(Array.prototype)
// console.dir(oldArrayPrototype)
// console.dir(newArrayPrototype)

function isArray(value) {
    return value instanceof Array;
}


function Vue(options) {
    // 实现功能
    this._init(options)
}

Vue.prototype._init = function(options) {
    const vm = this;
    vm.$options = options;
    initState(vm);
}

Vue.prototype.$set = function(prop, addonKey, addonValue) {
    defineReactive(prop, addonKey, addonValue)
}

function initState(vm) {
    initData(vm);
}

function initData(vm) {
    const data = vm.$options.data;
    vm._data = data;
    observe(data)
    const keys = Object.keys(data);
    for (const key of keys) {
        proxy(vm, '_data', key)
    }
}

function observe(data) {
    new Observer(data)
}

class Observer {
    constructor(data) {
        if (isArray(data)) {
            console.log(data)
            data.__proto__ = newArrayPrototype
            data.forEach((item, index) => {
                defineReactive(data, index, item);
            })
        } else {
            this.walk(data)
        }
    }

    walk(data) {
        const keys = Object.keys(data);
        for (const key of keys) {
            defineReactive(data, key, data[key])
        }
    }
}

function defineReactive(data, key, value) {
    if (typeof value === 'object') {
        observe(value)
    }
    Object.defineProperty(data, key, {
        get() {
            return value
        },
        set(newValue) {
            console.log('监听到'+ key+'的值发生变化：'+ newValue)
            if (typeof newValue === 'object') {
                observe(newValue)
            }
            value = newValue
        }
    })
}

function proxy(vm, asia, key) {
    Object.defineProperty(vm, key, {
        get() {
            return vm[asia][key]
        },
        set(newValue) {
            vm[asia][key] = newValue
        }
    })
}