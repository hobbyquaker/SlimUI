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
    this.version = "0.0.2";
    this.config = {
        pollingInterval: 5000,
        requiredCcuIoVersion: "1.0.17"
    };
    this.init();
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
        // Event Handler
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
        console.log("setValue("+dp+","+val+")");
        this.ajax("/api/set/"+dp+"?value="+val, {method: "GET"}, function () {});
    },
    /**
     * Fragt den Wert aller Datenpunkte von CCU.IO ab und aktualisiert die Elemente
     *
     */
    pollValues: function () {

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



console.log(slim.dps);
console.log(JSON.stringify(slim.dpElems, null, "  "));