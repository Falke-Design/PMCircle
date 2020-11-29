# Leaflet PMCircle: Extend circle drawing
This is a [Leaflet Geoman](https://github.com/geoman-io/leaflet-geoman) Subplugin 

Demo: [PMCircle](https://falke-design.github.io/PMCircle/)

### Installation
Download [pmCircle.js](https://raw.githubusercontent.com/Falke-Design/PMCircle/master/dist/pmCircle.js) and include them in your project.

`<script src="./dist/pmCircle.js"></script>`

or use the script over cdn:

`<script src="https://cdn.jsdelivr.net/gh/Falke-Design/PMCircle@latest/dist/pmCircle.js"></script>`

### Init PMCircle
Add PMCircle after added Controls of Leaflet Geoman **map.pm.addControls()**

```
pmCircle = new L.PMCircle(map)
```

You can enable or disable the controls with
```
map.pm.addControls({
    "Circle2Point": false, 
    "Circle3Point": true
})
```

Also it is possible to enable the new circle shapes directly
```
map.pm.enableDraw("Circle2Point")
```
