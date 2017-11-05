/**
 * @file: EventEmitter
 * @author: Cuttle Cong
 * @date: 2017/11/1
 * @description:
 */
function assertType(type) {
    if (typeof type !== 'string') {
        throw new TypeError('type is not type of String!');
    }
}

function assertFn(fn) {
    if (typeof fn !== 'function') {
        throw new TypeError('fn is not type of Function!');
    }
}

function EventEmitter() {
    this._events = {};
}

function on(type, fn) {
    assertType(type);
    assertFn(fn);
    this._events[type] = this._events[type] || [];
    this._events[type].push({
        type: 'always',
        fn: fn
    });
}

function prepend(type, fn) {
    assertType(type);
    assertFn(fn);
    this._events[type] = this._events[type] || [];
    this._events[type].unshift({
        type: 'always',
        fn: fn
    });
}

function prependOnce(type, fn) {
    assertType(type);
    assertFn(fn);
    this._events[type] = this._events[type] || [];
    this._events[type].unshift({
        type: 'once',
        fn
    });
}

function once(type, fn) {
    assertType(type);
    assertFn(fn);
    this._events[type] = this._events[type] || [];
    this._events[type].push({
        type: 'once',
        fn
    });
}

function off(type, nullOrFn) {
    assertType(type);
    if (!this._events[type]) return;
    if (typeof nullOrFn === 'function') {
        var index = this._events[type].findIndex(function (event) {
            return event.fn === nullOrFn;
        });
        if (index >= 0) {
            this._events[type].splice(index, 1);
        }
    } else {
        delete this._events[type];
    }
}

function emit(type, /* arguments */) {
    assertType(type);
    var args = [].slice.call(arguments, 1);
    var self = this;
    if (this._events[type]) {
        this._events[type].forEach(function (event) {
            event.fn.apply(null, args);
            if (event.type === 'once') {
                self.off(type, event.fn);
            }
        })
    }
}

EventEmitter.prototype.on = EventEmitter.prototype.addListener = on;
EventEmitter.prototype.once = EventEmitter.prototype.addOnceListener = once;
EventEmitter.prototype.prepend = EventEmitter.prototype.prependListener = prepend;
EventEmitter.prototype.prependOnce = EventEmitter.prototype.prependOnceListener = prependOnce;
EventEmitter.prototype.off = EventEmitter.prototype.removeListener = off;
EventEmitter.prototype.emit = EventEmitter.prototype.trigger = emit;

if (typeof module !== 'undefined') {
    module.exports = EventEmitter;
}