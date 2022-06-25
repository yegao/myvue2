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
    if (options.el) {
        vm.$mount(options.el);
    }
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
            // console.log('监听到'+ key+'的值发生变化：'+ newValue)
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

// 渲染相关
Vue.prototype.$mount = function(el) {
    el = document.querySelector(el);    
    if (el) {
        let template = null
        if (template) {
            template = this.$options.template;
        } else {
            console.dir(el)
            template = el.outerHTML;
        }
        compileToFunctions(template)
    }
}

function compileToFunctions(template) {
    console.log(template);
    parseHTML(template)
}

var unicodeRegExp = /a-zA-Z\u00B7\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u037D\u037F-\u1FFF\u200C-\u200D\u203F-\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD/;
var attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;
var dynamicArgAttribute = /^\s*((?:v-[\w-]+:|@|:|#)\[[^=]+?\][^\s"'<>\/=]*)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;
var ncname = "[a-zA-Z_][\\-\\.0-9_a-zA-Z".concat(unicodeRegExp.source, "]*");
var qnameCapture = "((?:".concat(ncname, "\\:)?").concat(ncname, ")");
var startTagOpen = new RegExp("^<".concat(qnameCapture));
var startTagClose = /^\s*(\/?)>/;
var endTag = new RegExp("^<\\/".concat(qnameCapture, "[^>]*>"));
var doctype = /^<!DOCTYPE [^>]+>/i;
// #7298: escape - to avoid being passed as HTML comment when inlined in page
var comment = /^<!\--/;
var conditionalComment = /^<!\[/;

const ELEMENT_TYPE = 1;
const TEXT_TYPE = 3;
/**
{
    tagname: 'div',
    attrs: [{key: 'id', value: 'app'}],
    parent: null,
    children: [
        {
            tagname: 'span',
            attrs:[],
            parent: {...},
            text: '{{name}} 非常棒'
        },
        {
            tagname: 'span',
            attrs:[],
            parent: {...},
            text: '{{age}}'
        }
    ]
}
*/
function parseHTML(html) {
    let root = null;
    let stack = [];
    let currentNode = null;
    function advance(len) {
        html = html.substring(len);
    }

    function start(node) {
        if(!root) {
            root = node;
        } else {
            currentNode.children.push(node);
            node.parent = currentNode;
        }
        currentNode = node;
        stack.push(node);
    }

    function str(text) {
        currentNode.children.push({
            type: TEXT_TYPE,
            text
        });
    }

    function end() {
        stack.pop();
        currentNode = stack[stack.length - 1];
    }

    function parseStartTagOpen(match) {
        const node = {
            type: ELEMENT_TYPE,
            tagName: match[1],
            attrs: [],
            children: []
        };
        advance(match[0].length);
        
        let attributeMatch = null;
        while(attributeMatch = html.match(attribute)){
            if (attributeMatch) {
                node.attrs.push({
                    name: attributeMatch[1],
                    value: attributeMatch[3] || attributeMatch[4] || attributeMatch[5]
                })
            }
            advance(attributeMatch[0].length)
        }
        const startTagCloseMatch = html.match(startTagClose);
        if (!startTagCloseMatch) {
            console.error('模版不符合规范');
            return false;
        }
        advance(startTagCloseMatch[0].length);
        return node;
    }
    let index = 0;
    while(html.length && index < 100) {
        if (html.indexOf('<')===0) {
            const startTagOpenMath = html.match(startTagOpen);
            if (startTagOpenMath) {
                const node = parseStartTagOpen(startTagOpenMath)
                console.log(node);
                start(node);
                continue;
            }
            const endTagMatch = html.match(endTag);
            if (endTagMatch) {
                advance(endTagMatch[0].length);
                end()
            }
        }
        let endIndex = 0;
        if((endIndex = html.indexOf('<')) > 0) {
            const text = html.slice(0, end);
            console.log(text)
            advance(endIndex);
            str(text.replace(/\s*/g, ''))
            continue
        }
        index++;
    }
    console.log(root);
    return root;
}

// <div id="app" name="xyz" style="color: #ff0000;"></div>