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
    this.version = "0.0.1";
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
     *
     */
    init: function () {
        this.getElements(document);
    },
    /**
     *  durchsucht das DOM nach Elementen mit dem Attribut data-dp, füllt die Arrays dps und dpElems
     *
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

                // id Attribut hinzufügen falls nötig
                if (!elem.getAttribute("id")) {
                    elem.setAttribute("id", "slim"+count++);
                }

                var elemObj = {
                    id: elem.getAttribute("id"),
                    dp: elem.getAttribute("data-dp"),
                    val: elem.getAttribute("data-val"),
                    name: elem.nodeName,
                    type: elem.type
                };
                this.dpElems.push(elemObj);

                // Liste der verwendeten Datenpunkte erzeugen
                if (this.dps.indexOf(elemObj.dp) == -1) {
                    this.dps.push(elemObj.dp);
                }

                // Event-Handler hinzufügen
                this.addHandler(elemObj);

            }
        }

    },
    /**
     * Fügt einen onClick oder onChange Event-Handler zu INPUT und SELECT Elementen hinzu
     *
     * @param elemObj
     */
    addHandler: function (elemObj) {
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
        alert("setValue("+dp+","+val+")");
    },
    /**
     * Fragt den Wert aller Datenpunkte von CCU.IO ab und aktualisiert die Elemente
     *
     */
    pollValues: function () {

    },
    /**
     * Helper für Ajax Get Requests
     *
     * @param url
     * @param cb
     */
    ajaxGet: function (url, cb) {

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
 *  SlimUI initialisieren
 */
var slim = new SlimUI();

console.log(slim.dps);
console.log(JSON.stringify(slim.dpElems, null, "  "));