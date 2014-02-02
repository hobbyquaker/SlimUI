# SlimUI

ein sehr leichtgewichtiges Framework zur Erstellung von CCU.IO WebUIs. Gemacht für alte Browser und langsame Clients.
"Vanilla" JavaScript, es werden keine Bibliotheken wie jQuery o.Ä. eingesetzt.

* Weniger als 500 Zeilen Code, minifiziert nur 5,7kB groß
* Kommuniziert mit CCU.IO über die SimpleAPI (keine Websockets)
* Verwendet Douglas Crockfords json2.js falls der Browser kein JSON.parse() unterstützt - https://github.com/douglascrockford/JSON-js

## Browser-Kompatibilität

### erfolgreich getestet:
* Internet Explorer 6 (Windows XP)
* Internet Explorer 7 (Windows XP)
* Internet Explorer 8 (Windows XP)
* Firefox 26 (OSX)
* Chrome 32 (OSX)
* Safari 7 (OSX)

### erfolglos getestet - läuft (bisher) nicht auf:
* Internet Explorer 5.5 (Windows XP)

bitte meldet Browser auf denen ihr SlimUI getestet habt damit ich diese Liste ergänzen kann.

## Dokumentation

SlimUI benötigt CCU.IO Version >= 1.0.17

Elemente die mit CCU.IO verknüpft werden sollen benötigen das Attribut data-dp mit einer Datenpunkt-ID.
Folgende Elemente können verknüpft werden:

* input type=checkbox
* input type=button
* input type=text
* input type=number
* select
* span

Für Input-Elemente vom Typ Button muss zusätzlich das Attribut data-val angegeben werden das den Wert beinhaltet auf
den der Datenpunkt gesetzt wird wenn der Button geklickt wird.

Beispiele siehe index.html

## Roadmap/Todo

* Formatierung von numerischen Werten (Anzahl Nachkommstellen über Attribut data-digits)
* Toggle Buttons (Attribut data-toggle)
* Anzeige von Timestamps (Attribut data-ts)

## Changelog

### 0.0.4
* eigener Ajax Wrapper, suchjs rausgeschmissen
* IE Fixes
* Firefox Fixes

### 0.0.3
* pollValues und updateElements implementiert

### 0.0.2
* setValue implementiert


## Lizenz

Copyright (c) 2014 hobbyquaker [http://hobbyquaker.github.io](http://hobbyquaker.github.io)

Lizenz: [CC BY-NC 3.0](http://creativecommons.org/licenses/by-nc/3.0/de/)

Sie dürfen das Werk bzw. den Inhalt vervielfältigen, verbreiten und öffentlich zugänglich machen,
Abwandlungen und Bearbeitungen des Werkes bzw. Inhaltes anfertigen zu den folgenden Bedingungen:

  * **Namensnennung** - Sie müssen den Namen des Autors/Rechteinhabers in der von ihm festgelegten Weise nennen.
  * **Keine kommerzielle Nutzung** - Dieses Werk bzw. dieser Inhalt darf nicht für kommerzielle Zwecke verwendet werden.

Wobei gilt:
Verzichtserklärung - Jede der vorgenannten Bedingungen kann aufgehoben werden, sofern Sie die ausdrückliche Einwilligung des Rechteinhabers dazu erhalten.

Die Veröffentlichung dieser Software erfolgt in der Hoffnung, daß sie Ihnen von Nutzen sein wird, aber OHNE IRGENDEINE GARANTIE, sogar ohne die implizite Garantie der MARKTREIFE oder der VERWENDBARKEIT FÜR EINEN BESTIMMTEN ZWECK. Die Nutzung dieser Software erfolgt auf eigenes Risiko!