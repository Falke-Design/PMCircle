import CircleUtils from "../Utils/utils";

L.PM.Draw.Circle3Point = L.PM.Draw.Circle2Point.extend({
    initialize(map) {
        this._map = map;
        this._shape = 'Circle3Point';
        this.toolbarButtonName = 'drawCircle3Point';
    },
    _getMiddlePoint(){
        const A = this._centerMarker.getLatLng();
        const B = this._circleMarker.getLatLng();
        const C = this._hintMarker.getLatLng();

        const pt_A = this._map.latLngToContainerPoint(A);
        const pt_B = this._map.latLngToContainerPoint(B);
        const pt_C = this._map.latLngToContainerPoint(C);

        let pt_M = CircleUtils._calculateCircleCenter3P(pt_A, pt_B, pt_C);
        //If containerpoints on the same point, because of zooming
        if(isNaN(pt_M.x) || isNaN(pt_M.y)){
            pt_M = CircleUtils._calculateCircleCenter2P(pt_A,pt_C);
        }

        return this._map.containerPointToLatLng(pt_M);
    },
    _placeCenterMarker(e){
      this._layerGroup.addLayer(this._layer);
      this._layerGroup.addLayer(this._centerMarker);
        // assign the coordinate of the click to the hintMarker, that's necessary for
        // mobile where the marker can't follow a cursor
        if (!this._hintMarker._snapped) {
            this._hintMarker.setLatLng(e.latlng);
        }

        // get coordinate for new vertex by hintMarker (cursor marker)
        const latlng = this._hintMarker.getLatLng();

        this._centerMarker.setLatLng(latlng);

        this._map.off('click', this._placeCenterMarker, this);

        this._map.on('click', this._placeCircleMarker, this);
        this._hintMarker.on('move', this._syncHintLine, this);
        this._hintMarker.setTooltipContent(
            L.PM.Utils.getTranslation("tooltips.continueLine")
        );
    },
    _placeCircleCenter() {
        const latlng = this._centerMarker.getLatLng();

        if (latlng) {
            //Disable Hintline
            this._hintMarker.off('move', this._syncHintLine, this);
            this._hintline.setLatLngs([]);
            // sync the hintline with hint marker
            this._hintMarker.on('move', this._syncCircleRadiusMulti, this);
            this._hintMarker.setTooltipContent(
                L.PM.Utils.getTranslation("tooltips.finishCircle")
            );

        }
    }
});
