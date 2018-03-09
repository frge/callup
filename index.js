'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function stern(src, start) {
    const quote = src[start];
    let prevCharIsBackslash = false;
    let at = start;
    let ch;
    while (ch = src[++at]) {
        if (ch === '\\') {
            prevCharIsBackslash = !prevCharIsBackslash;
            continue;
        }
        // end
        if (ch === quote && !prevCharIsBackslash) {
            return at;
        }
        prevCharIsBackslash = false;
    }
    return -1;
}

function parse(src) {
    let at = 0;
    const peek = () => src[at];
    const consume = () => src[at++];
    function call(name, start) {
        let args = [];
        let ch;
        let tmp = '';
        let deep = 1;
        function setArg() {
            try {
                const node = parse(src.substring(start, at));
                node && args.push(node);
                return node;
            }
            catch (e) {
                const [msg, errAt] = e.message.split('at', 2);
                if (isNaN(+errAt))
                    throw e;
                error(start + +errAt, msg);
            }
        }
        while (ch = peek()) {
            if (ch === ')' && --deep === 0) {
                setArg();
                consume();
                tmp = '';
                break;
            }
            if (ch === '(') {
                deep++;
                consume();
                tmp = '';
                continue;
            }
            if (ch === ',') {
                if (!setArg()) {
                    error(at);
                }
                consume();
                start = at;
                tmp = '';
                continue;
            }
            if (ch === '"' || ch === "'") {
                const quoteEnd = stern(src, at);
                if (quoteEnd === -1)
                    error(at, 'Bad string');
                at = quoteEnd + 1;
                continue;
            }
            tmp += consume();
        }
        if (tmp) {
            error(-1, 'Parse Failed');
        }
        return { name, args };
    }
    function lr() {
        let ch;
        let tmp = '';
        let tmpStop = false;
        let node = null;
        while (ch = peek()) {
            switch (ch) {
                case '+':
                case '-':
                case '*':
                case '/':
                case '%':
                    consume();
                    if (node && tmp) {
                        error(at);
                    }
                    return {
                        op: ch,
                        left: node || tmp,
                        right: lr()
                    };
            }
            if (ch === '(') {
                consume();
                node = call(tmp, at);
                tmp = '';
                continue;
            }
            if (ch === '"' || ch === "'") {
                if (node || tmp)
                    error(at);
                const quoteEnd = stern(src, at);
                if (quoteEnd === -1)
                    error(at, 'Bad string');
                node = src.substring(at, quoteEnd + 1);
                at = quoteEnd + 1;
                tmp = '';
                continue;
            }
            if (ch <= ' ') {
                if (tmp && !tmpStop) {
                    tmpStop = true;
                }
                consume();
                continue;
            }
            if (tmp && tmpStop) {
                error(at);
            }
            tmp += consume();
        }
        if (node && tmp) {
            error(at);
        }
        return tmp || node;
    }
    function error(at, message = 'Invalid char') {
        throw {
            name: 'SyntaxError',
            message: message + ' at ' + at,
            at
        };
    }
    return lr();
}

exports.parse = parse;
