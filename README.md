# Leaflet PMCircle: Extend circle drawing
This is a [Leaflet Geoman](https://github.com/geoman-io/leaflet-geoman) Subplugin 

Demo: [PMCircle](https://falke-design.github.io/PMCircle/)

### Installation
Download [pmCircle.js](https://raw.githubusercontent.com/Falke-Design/PMCircle/master/dist/pmCircle.js) and include them in your project.

`<script src="./dist/pmCircle.js"></script>`

or use the script over cdn:

`<script src="https://cdn.jsdelivr.net/gh/Falke-Design/PMCircle/dist/pmCircle.js"></script>`

### Init PMCircle
Add PMCircle after added Controls of Leaflet Geoman **map.pm.addControls()**

`pmCircle = new L.PMCircle(map)`

You can set the circle type on init: ('circle', '2point', '3point')

`pmCircle = new L.PMCircle(map, {circleType: '2point'})`

### Functions
##### Options
`pmCircle.setOptions(options)`
```
circleType: 'circle' | '2point' | '3point'
text: {continueLine: "continueLine", finishCircle: "finishCircle",startCircle: "startCircle",firstVertex: "firstVertex",cancel: "cancel",title: "title"}
```

##### setText
`pmCircle.setText(options)`
```
text: {continueLine: "continueLine", finishCircle: "finishCircle",startCircle: "startCircle",firstVertex: "firstVertex",cancel: "cancel",title: "title"}
```

##### setCircleType
`pmCircle.setCircleType('circle' | '2point' | '3point')`
