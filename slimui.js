/**
 *      SlimUI
 *  a lightweight framework for CCU.IO WebUIs
 *  made for old Browsers and slow Clients
 *
 *  Copyright (c) 2014 Hobbyquaker
 *
 */

SlimUI = function() {
    this.version = "0.0.1";
};

SlimUI.prototype = {
    dps: [],
    dpElems: [],
    init: function () {
        this.getElements(document);
    },
    getElements: function (start) {
        var elems = start.getElementsByTagName('*');

        var count = 0;
        for (var i = 0, l = elems.length; i < l; i++) {
            var elem = elems[i];
            if (elem.getAttribute("data-dp")) {

                // Create list of objects
                var elemObj = {
                    id: "slim"+count,
                    dp: elem.getAttribute("data-dp"),
                    val: elem.getAttribute("data-val"),
                    name: elem.nodeName
                };
                this.dpElems.push(elemObj);

                // Create list of used datapoints
                if (this.dps.indexOf(elemObj.dp) == -1) {
                    this.dps.push(elemObj.dp);
                }

                // Add id attribute
                elem.setAttribute("id", "slim"+count++);

                // Add event handler
                switch (elemObj.name) {
                    case "BUTTON":
                        elem.addEventListener("click", function () {
                            slim.setValue(this.getAttribute("data-dp"), this.getAttribute("data-val"));
                        }, false);
                        break;
                    case "SELECT":
                        elem.addEventListener("change", function () {
                            slim.setValue(this.getAttribute("data-dp"), this.options[this.selectedIndex].value);
                        }, false);
                        break;
                    case "INPUT":
                        elem.addEventListener("change", function () {
                            slim.setValue(this.getAttribute("data-dp"), this.value);
                        }, false);
                        break;
                }

            }
        }

    },
    setValue: function (dp, val) {
        alert("setValue("+dp+","+val+")");
    },
    pollValues: function () {

    },
    ajaxGet: function (url, cb) {

    }
};

// Add indexOf Method if necessary
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


var slim = new SlimUI();

slim.init();

console.log(slim.dps);
console.log(JSON.stringify(slim.dpElems, null, "  "));