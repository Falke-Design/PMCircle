
var circleExtend = {
    setPathOptions(options) {
        this.options.pathOptions = options;
        this.options.templineStyle = options;
        this.options.hintlineStyle = options;
    },
    _syncCircleRadiusMulti() {
        if(!this._circleMarker){
            this._createCircleMarker();
        }

        const A = this._centerMarker.getLatLng();
        const B = this._circleMarker.getLatLng();
        const C = this._hintMarker.getLatLng();

        const pt_A = this._map.latLngToContainerPoint(A);
        const pt_B = this._map.latLngToContainerPoint(B);
        const pt_C = this._map.latLngToContainerPoint(C);

        var pt_M = this._calculateCircleCenter(pt_A, pt_B, pt_C);

        //If containerpoints on the same point, because of zooming
        if(isNaN(pt_M.x) || isNaN(pt_M.y) || this.options.circleType === '2point'){
            pt_M = this._calculateCircleCenter2P(pt_A,pt_C);
        }

        const M = this._map.containerPointToLatLng(pt_M);

        const distance = A.distanceTo(M);

        this._layer.setLatLng(M);
        this._layer.setRadius(distance);
    },
    _placeCenterMarker(e){
        // assign the coordinate of the click to the hintMarker, that's necessary for
        // mobile where the marker can't follow a cursor
        if (!this._hintMarker._snapped) {
            this._hintMarker.setLatLng(e.latlng);
        }

        // get coordinate for new vertex by hintMarker (cursor marker)
        const latlng = this._hintMarker.getLatLng();

        this._centerMarker.setLatLng(latlng);

        this._map.off('click', this._placeCenterMarker, this);
        if(this.options.circleType === '3point'){
            this._map.on('click', this._placeCircleMarker, this);
            this._hintMarker.on('move', this._syncHintLine, this);
            this._hintMarker.setTooltipContent(
                L.PM.Utils.getTranslation("tooltips.continueLine")
            );
        }else if(this.options.circleType === '2point'){
            this._map.on('click', this._finishShape, this);
            this._hintMarker.on('move', this._syncHintLine, this);
            this._placeCircleCenter();
        }else{
            this._map.on('click', this._finishShape, this);
            this._placeCircleCenter();
        }

    },
    _placeCircleMarker(e) {

        if(!this._circleMarker){
            this._createCircleMarker();
        }

        // assign the coordinate of the click to the hintMarker, that's necessary for
        // mobile where the marker can't follow a cursor
        if (!this._hintMarker._snapped) {
            this._hintMarker.setLatLng(e.latlng);
        }

        // get coordinate for new vertex by hintMarker (cursor marker)
        const latlng = this._hintMarker.getLatLng();

        this._circleMarker.setLatLng(latlng);

        this._map.off('click', this._placeCenterMarker, this);
        this._map.on('click', this._finishShape, this);

        this._placeCircleCenter();
    },
    _placeCircleCenter() {
        const latlng = this._centerMarker.getLatLng();

        if (latlng) {
            // sync the hintline with hint marker
            if(this.options.circleType === "circle"){
                this._layer.setLatLng(latlng);
                this._hintMarker.on('move', this._syncHintLine, this);
                this._hintMarker.on('move', this._syncCircleRadius, this);

                this._layer.fire('pm:centerplaced', {
                    shape: this._shape,
                    workingLayer: this._layer,
                    latlng,
                });
            }else{
                if(this.options.circleType === "3point"){
                    //Disable Hintline
                    this._hintMarker.off('move', this._syncHintLine, this);
                    this._hintline.setLatLngs([]);
                }

                this._hintMarker.on('move', this._syncCircleRadiusMulti, this);
            }

            this._hintMarker.setTooltipContent(
                this._map.pm.pmCircle.getText('finishCircle')
            );

        }
    },
    _finishShape(e) {
        // calc the radius
        var center,radius;
        if(this.options.circleType === 'circle'){
            const cursor = e.latlng;
            center = this._centerMarker.getLatLng();
            radius = center.distanceTo(cursor);
        }else{
            // calc the radius
            center = this._layer.getLatLng();
            radius = this._layer.getRadius();
        }


        const options = Object.assign({}, this.options.pathOptions, { radius });

        // create the final circle layer
        var circleLayer = L.circle(center, options).addTo(this._map);

        this._circleMarker = undefined;
        // disable drawing
        this.disable();

        // fire the pm:create event and pass shape and layer
        this._map.fire('pm:create', {
            shape: this._shape,
            layer: circleLayer,
        });

    },

    _calculateCircleCenter(A,B,C) {
        var yDelta_a = B.y - A.y;
        var xDelta_a = B.x - A.x;
        var yDelta_b = C.y - B.y;
        var xDelta_b = C.x - B.x;

        var center = {};

        var aSlope = yDelta_a / xDelta_a;
        var bSlope = yDelta_b / xDelta_b;

        center.x = (aSlope*bSlope*(A.y - C.y) + bSlope*(A.x + B.x) - aSlope*(B.x+C.x) )/(2* (bSlope-aSlope) );
        center.y = -1*(center.x - (A.x+B.x)/2)/aSlope +  (A.y+B.y)/2;
        return center;

    },
    _calculateCircleCenter2P(A,C){
        var dis = this._distance(A,C);
        var r = dis / 2;
        var angle = this._angle(A,C);
        return this._findDestinationPoint(A,r,angle);
    },

    _findDestinationPoint(point, distance, angle) {
        var result = {};
        angle = angle - 90;
        result.x = Math.round(Math.cos(angle * Math.PI / 180) * distance + point.x);
        result.y = Math.round(Math.sin(angle * Math.PI / 180) * distance + point.y);
        return result;
    },
    _distance(p1,p2){
        var x = p1.x - p2.x;
        var y = p1.y - p2.y;
        return Math.sqrt( x*x + y*y );
    },
    _angle(p1,p2){
        var x = p1.x - p2.x;
        var y = p1.y - p2.y;
        var _angle = ((Math.atan2(y, x) * 180 / Math.PI) * (-1) - 90)* (-1);
        return _angle < 0 ? _angle + 180 : _angle - 180;
    },
    _createCircleMarker(){
        this._circleMarker = L.marker([0, 0], {
            icon: L.divIcon({ className: 'marker-icon' }),
            draggable: false,
            zIndexOffset: 100,
        });
        this._circleMarker._pmTempLayer = true;
        this._layerGroup.addLayer(this._circleMarker);
    }

};

export default circleExtend;
