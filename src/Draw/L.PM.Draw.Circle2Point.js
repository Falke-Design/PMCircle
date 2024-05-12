import CircleUtils from "../Utils/utils";

L.PM.Draw.Circle2Point = L.PM.Draw.Circle.extend({
    initialize(map) {
        L.PM.Draw.Circle.prototype.initialize.call(this, map);
        this._map = map;
        this._shape = 'Circle2Point';
        this.toolbarButtonName = 'drawCircle2Point';
    },
    enable(options) {
        L.PM.Draw.Circle.prototype.enable.call(this,options);
        var tooltip_text = L.PM.Utils.getTranslation("tooltips.firstVertex");
        // add tooltip to hintmarker
        if (this.options.tooltips && this._hintMarker) {
            if(this._hintMarker.isTooltipOpen()){
                this._hintMarker.unbindTooltip();
            }
            this._hintMarker
                .bindTooltip(tooltip_text, {
                    permanent: true,
                    offset: L.point(0, 10),
                    direction: 'bottom',
                    opacity: 0.8,
                }).openTooltip();
        }
    },
    disable(){
        L.PM.Draw.Circle.prototype.disable.call(this);
        this._map.off('click', this._placeCircleMarker, this);
        if(this._hintMarker) {
            this._hintMarker.off('move', this._syncHintLine, this);
            this._hintMarker.off('move', this._syncCircleRadiusMulti, this);
        }
        this._circleMarker = null;
        this._centerMarker = null;
        this._hintMarker = null;
    },
    setPathOptions(options) {
        this.options.pathOptions = options;
        this.options.templineStyle = options;
        this.options.hintlineStyle = options;
    },
    _syncCircleRadiusMulti() {
        if(!this._circleMarker){
            this._createCircleMarker(this._centerMarker.getLatLng());
        }
        const A = this._centerMarker.getLatLng();
        const M = this._getMiddlePoint();
        const distance = this._map.distance(A,M);

        this._layer.setLatLng(M);
        this._layer.setRadius(distance);
    },
    _getMiddlePoint(){
        const A = this._centerMarker.getLatLng();
        const C = this._hintMarker.getLatLng();

        const pt_A = this._map.latLngToContainerPoint(A);
        const pt_C = this._map.latLngToContainerPoint(C);

        const pt_M = CircleUtils._calculateCircleCenter2P(pt_A,pt_C);
        return this._map.containerPointToLatLng(pt_M);
    },
    _placeCenterMarker(e){
        L.PM.Draw.Circle.prototype._placeCenterMarker.call(this, e);
        this._layer.setLatLng(this._hintMarker.getLatLng());
        this._hintMarker.on('move', this._syncHintLine, this);
    },
    _placeCircleMarker(e) {
        if(!this._circleMarker){
            this._createCircleMarker(this._hintMarker.getLatLng());
        }

        // assign the coordinate of the click to the hintMarker, that's necessary for
        // mobile where the marker can't follow a cursor
        if (!this._hintMarker._snapped) {
            this._hintMarker.setLatLng(e.latlng);
        }

        // get coordinate for new vertex by hintMarker (cursor marker)
        const latlng = this._hintMarker.getLatLng();

        this._circleMarker.setLatLng(latlng);

        this._map.off('click', this._placeCircleMarker, this);
        this._map.on('click', this._finishShape, this);

        this._placeCircleCenter();
    },
    _placeCircleCenter() {
        const latlng = this._centerMarker.getLatLng();

        if (latlng) {
            // sync the hintline with hint marker
            this._hintMarker.on('move', this._syncCircleRadiusMulti, this);
            this._hintMarker.setTooltipContent(
                L.PM.Utils.getTranslation("tooltips.finishCircle")
            );

        }
    },
    _finishShape(e) {
        // If snap finish is required but the last marker wasn't snapped, do not finish the shape!
        if (
            this.options.requireSnapToFinish &&
            !this._hintMarker._snapped &&
            !this._isFirstLayer()
        ) {
            return;
        }

        // calc the radius
        const center = this._layer.getLatLng();
        const radius = this._layer.getRadius();

        const options = { ...this.options.pathOptions, radius };

        // create the final circle layer
        const circleLayer = L.circle(center, options);
        this._setPane(circleLayer, 'layerPane');
        this._finishLayer(circleLayer);
        circleLayer.addTo(this._map.pm._getContainingLayer());

        if (circleLayer.pm) {
            // create polygon around the circle border
            circleLayer.pm._updateHiddenPolyCircle();
        }

        // fire the pm:create event and pass shape and layer
        this._fireCreate(circleLayer);

        // disable drawing
        this.disable();
        if(this.options.continueDrawing){
            this.enable();
        }
    },
    _createCircleMarker(latlng){
        this._circleMarker = L.marker(latlng, {
            icon: L.divIcon({ className: 'marker-icon' }),
            draggable: false,
            zIndexOffset: 100,
        });
        this._circleMarker._pmTempLayer = true;
        this._layerGroup.addLayer(this._circleMarker);
    }
});
