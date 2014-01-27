/**
 *      SlimUI
 *  a very lightweight framework for CCU.IO WebUIs
 *  made for old Browsers and slow Clients
 *
 *  Vanilla JavaScript, no use of jQuery or other Libraries
 *
 *  Copyright (c) 2014 Hobbyquaker
 *
 */

var SlimUI = function() {
    this.version = "0.0.3";
    this.config = {
        pollingInterval: 5000
    };
    this.init();
    this.pollValues(this);
    setInterval(function (_this) { _this.pollValues(_this) }, this.config.pollingInterval, this);
};

SlimUI.prototype = {
    /**
     *  Array aller verwendeter Datenpunkte
     */
    dps: [],
    /**
     *  Array aller Elemente die mit einem Datenpunkt verknüpft sind
     */
    dpElems: [],
    /**
     *  Startet SlimUI
     */
    init: function () {
        this.getElements(document);
    },
    /**
     *  durchsucht das DOM nach Elementen mit dem Attribut data-dp, füllt die Arrays dps und dpElems
     *
     * @param start
     *  DOM Objekt unter welchem Elemente gesucht werden - üblicherweise: document
     */
    getElements: function (start) {
        var elems = start.getElementsByTagName('*');
        var count = 0;
        for (var i = 0, l = elems.length; i < l; i++) {
            var elem = elems[i];
            if (elem.getAttribute("data-dp")) {

                /**
                 * id Attribut hinzufügen falls nötig
                 */
                if (!elem.getAttribute("id")) {
                    elem.setAttribute("id", "slim"+count++);
                }

                /**
                 *  Objekt das alle relevanten Informationen zu einem Element enthält.
                 *  Wird dem Array dpElems hizugefügt
                 */
                var elemObj = {
                    id: elem.getAttribute("id"),
                    dp: elem.getAttribute("data-dp"),
                    val: elem.getAttribute("data-val"),
                    name: elem.nodeName,
                    type: elem.type
                };
                this.dpElems.push(elemObj);

                /**
                 *  Liste der verwendeten Datenpunkte erzeugen
                 */
                if (this.dps.indexOf(elemObj.dp) == -1) {
                    this.dps.push(elemObj.dp);
                }

                /**
                 *  Event-Handler hinzufügen
                 */
                this.addHandler(elem, elemObj);

            }
        }
    },
    /**
     * Fügt einen onClick oder onChange Event-Handler zu INPUT und SELECT Elementen hinzu
     *
     * @param elem
     * @param elemObj
     */
    addHandler: function (elem, elemObj) {
        switch (elemObj.name) {
            case "SELECT":
                elem.addEventListener("change", function () {
                    slim.setValue(this.getAttribute("data-dp"), this.options[this.selectedIndex].value);
                }, false);
                break;
            case "INPUT":
                switch (elemObj.type) {
                    case "button":
                        elem.addEventListener("click", function () {
                            slim.setValue(this.getAttribute("data-dp"), this.getAttribute("data-val"));
                        }, false);
                        break;
                    case "text":
                    case "number":
                        elem.addEventListener("change", function () {
                            slim.setValue(this.getAttribute("data-dp"), this.value);
                        }, false);
                        break;
                    case "checkbox":
                        elem.addEventListener("change", function () {
                            slim.setValue(this.getAttribute("data-dp"), this.checked);
                        }, false);
                        break;
                }
                break;
        }
    },
    /**
     * Setzt einen Datenpunkt auf einen bestimmten Wert
     *
     * @param dp
     *   die ID des Datenpunkts
     * @param val
     *   der Wert
     */
    setValue: function (dp, val) {
        this.ajax("/api/set/"+dp+"?value="+val, {method: "GET"}, function () {});
    },
    /**
     * Fragt den Wert aller Datenpunkte von CCU.IO ab und aktualisiert die Elemente
     *
     */
    pollValues: function (_this) {
        var dps = _this.dps.join(",");
        _this.ajax("/api/getBulk/"+dps, {method: "GET"}, function (res) {
            for (var i = 0, l = _this.dpElems.length; i<l; i++) {
                var elemObj = _this.dpElems[i];
                if (res[elemObj.dp] !== undefined) {
                    _this.updateElement(elemObj, res[elemObj.dp]);
                }
            }
        });
    },
    /**
     *  Wert eines Elements updaten
     *
     * @param elemObj
     * @param val
     */
    updateElement: function (elemObj, val) {
        var elem = document.getElementById(elemObj.id);
        switch (elemObj.name) {
            case "SELECT":
                var options = elem.getElementsByTagName("OPTION");
                for (var i = 0, l = options.length; i < l; i++) {
                    if (options[i].value == val) {
                        elem.selectedIndex = i;
                        break;
                    }
                }
                break;
            case "INPUT":
                switch (elemObj.type) {
                    case "text":
                    case "number":
                        elem.value = val;
                        break;
                    case "checkbox":
                        elem.checked = val;
                        break;
                }
                break;
            case "SPAN":
                elem.innerHTML = val;
                break;
        }
    }
};

/**
 * Falls der Browser Array.indexOf nicht unterstützt wird diese Methode ergänzt
 */
if (!Array.indexOf){
    Array.prototype.indexOf = function(obj){
        for(var i=0; i<this.length; i++){
            if(this[i]==obj){
                return i;
            }
        }
        return -1;
    }
}

/**
 *  JSON.stringify und JSON.parse hinzufügen falls nicht vom Browser unterstützt
 *
 *  Douglas Crockfords json2.js - https://github.com/douglascrockford/JSON-js
 */
if (typeof JSON !== 'object') {
    JSON = {};
}

(function () {
    'use strict';

    function f(n) {
                return n < 10 ? '0' + n : n;
    }

    if (typeof Date.prototype.toJSON !== 'function') {

        Date.prototype.toJSON = function () {
            return isFinite(this.valueOf())
                ? this.getUTCFullYear()     + '-' +
                f(this.getUTCMonth() + 1) + '-' +
                f(this.getUTCDate())      + 'T' +
                f(this.getUTCHours())     + ':' +
                f(this.getUTCMinutes())   + ':' +
                f(this.getUTCSeconds())   + 'Z'
                : null;
        };

        String.prototype.toJSON      =
            Number.prototype.toJSON  =
                Boolean.prototype.toJSON = function () {
                    return this.valueOf();
                };
    }

    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        gap,
        indent,
        meta = {                '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"' : '\\"',
            '\\': '\\\\'
        },
        rep;

    function quote(string) {
        escapable.lastIndex = 0;
        return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
            var c = meta[a];
            return typeof c === 'string'
                ? c
                : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
        }) + '"' : '"' + string + '"';
    }

    function str(key, holder) {

        var i,
            k,
            v,
            length,
            mind = gap,
            partial,
            value = holder[key];

        if (value && typeof value === 'object' &&
            typeof value.toJSON === 'function') {
            value = value.toJSON(key);
        }

        if (typeof rep === 'function') {
            value = rep.call(holder, key, value);
        }

        switch (typeof value) {
            case 'string':
                return quote(value);

            case 'number':
                return isFinite(value) ? String(value) : 'null';

            case 'boolean':
            case 'null':
                return String(value);

            case 'object':
                if (!value) {
                    return 'null';
                }

                gap += indent;
                partial = [];

                if (Object.prototype.toString.apply(value) === '[object Array]') {

                    length = value.length;
                    for (i = 0; i < length; i += 1) {
                        partial[i] = str(i, value) || 'null';
                    }

                    v = partial.length === 0
                        ? '[]'
                        : gap
                        ? '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']'
                        : '[' + partial.join(',') + ']';
                    gap = mind;
                    return v;
                }

                if (rep && typeof rep === 'object') {
                    length = rep.length;
                    for (i = 0; i < length; i += 1) {
                        if (typeof rep[i] === 'string') {
                            k = rep[i];
                            v = str(k, value);
                            if (v) {
                                partial.push(quote(k) + (gap ? ': ' : ':') + v);
                            }
                        }
                    }
                } else {
                    for (k in value) {
                        if (Object.prototype.hasOwnProperty.call(value, k)) {
                            v = str(k, value);
                            if (v) {
                                partial.push(quote(k) + (gap ? ': ' : ':') + v);
                            }
                        }
                    }
                }

                v = partial.length === 0
                    ? '{}'
                    : gap
                    ? '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}'
                    : '{' + partial.join(',') + '}';
                gap = mind;
                return v;
        }
    }

    if (typeof JSON.stringify !== 'function') {
        JSON.stringify = function (value, replacer, space) {

            var i;
            gap = '';
            indent = '';

            if (typeof space === 'number') {
                for (i = 0; i < space; i += 1) {
                    indent += ' ';
                }

            } else if (typeof space === 'string') {
                indent = space;
            }

            rep = replacer;
            if (replacer && typeof replacer !== 'function' &&
                (typeof replacer !== 'object' ||
                    typeof replacer.length !== 'number')) {
                throw new Error('JSON.stringify');
            }

            return str('', {'': value});
        };
    }

    if (typeof JSON.parse !== 'function') {
        JSON.parse = function (text, reviver) {

            var j;
            function walk(holder, key) {
                var k, v, value = holder[key];
                if (value && typeof value === 'object') {
                    for (k in value) {
                        if (Object.prototype.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v;
                            } else {
                                delete value[k];
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value);
            }

            text = String(text);
            cx.lastIndex = 0;
            if (cx.test(text)) {
                text = text.replace(cx, function (a) {
                    return '\\u' +
                        ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                });
            }

            if (/^[\],:{}\s]*$/
                .test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')
                    .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
                    .replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

                j = eval('(' + text + ')');

                return typeof reviver === 'function'
                    ? walk({'': j}, '')
                    : j;
            }

            throw new SyntaxError('JSON.parse');
        };
    }
}());

/**
 * Ajax Funktion aus suchjs - https://github.com/bevacqua/suchjs
 */
// ajax
!function ($, XMLHttpRequest) {
    $.ajax = function (url, options, done) {
        var method = options.method.toUpperCase();
        var xhr = new XMLHttpRequest();
        xhr.responseType = options.responseType || 'json';
        xhr.open(method, compose(url), true);
        xhr.addEventListener('load', function () {
            var res = xhr.response; try { res = JSON.parse(res); } catch (e) {}
            done(res, xhr.status, xhrWrap());
        });
        xhr.addEventListener('error', function () {
            done(null, xhr.status, xhrWrap());
        });
        Object.keys(options.headers || {}).forEach(function (key) {
            xhr.setRequestHeader(key, options.headers[key]);
        });
        xhr.send(data());

        function compose (url) {
            if (method !== 'GET' || !options.data) {
                return url;
            }
            var params = Object.keys(options.data).map(function (key) {
                return key + '=' + options.data[key];
            }).join('&');
            var connector = '?';
            var query = url.lastIndexOf('?');
            if (query !== -1) {
                connector = (query === url.length - 1) ? '' : '&';
            }
            return url + connector + params;
        }

        function data () {
            if (method !== 'GET' && options.data) {
                var form = new FormData();
                Object.keys(options.data).forEach(function (key) {
                    form.append(key, JSON.stringify(options.data));
                });
            }
        }
        function xhrWrap () { return { headers: getHeaders(), original: xhr }; }

        function getHeaders () {
            return xhr.getAllResponseHeaders().split('\n').reduce(function (headers, header) {
                if (header.length) {
                    var sep = ': ';
                    var parts = header.split(sep);
                    var name = parts.shift();
                    var value = parts.join(sep);
                    if (name === 'Link') {
                        headers.Link = parseLinkHeader(value);
                    } else {
                        headers[name] = value;
                    }
                }
                return headers;
            }, {});
        }

        function parseLinkHeader (header) {
            var parts = header.split(',');
            var urlPart = /<(.*)>/;
            var relPart = /rel=['"](.*)['"]/i;
            return parts.reduce(function (links, part) {
                var pieces = part.split(';');
                var url = pieces[0].match(urlPart, '$1');
                var rel = pieces[1].match(relPart, '$1');
                if (url && url.length && rel && rel.length) {
                    links[rel[1]] = url[1];
                }
                return links;
            }, {});
        }
    };

    function mapjax (method) {
        var proper = method.toUpperCase();
        $[method] = function (url, options, done) {
            if (done === void 0) {
                done = options;
                options = {};
            }
            options.method = proper;
            $.ajax(url, options, done);
        };
    }
    mapjax('get');
    mapjax('post');
}(SlimUI.prototype, XMLHttpRequest);

/**
 *  SlimUI initialisieren
 */
var slim = new SlimUI();
