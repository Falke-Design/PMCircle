import circleExtend from "./Draw.Circle";

L.PMCircle = L.Class.extend({
    options: {
        text: {
            "continueLine": "Click to continue drawing",
            "finishCircle": "Click to finish circle",
            "startCircle": "Click to place circle center",
            "firstVertex": "Click to place first vertex",
            "cancel": "Cancel",
            "title": "Draw Circle",
        }
    },
    buttonClasses: {
        "circle" :{
            className: " leaflet-pm-icon-circle"
        },
        "2point" :{
            className: " leaflet-pm-icon-circle-2point"
        },
        "3point" :{
            className: " leaflet-pm-icon-circle-3point"
        },
    },
    cssadded: false,
    initialize(map, options) {
        this.map = map;
        if(this.map && this.map.pm){
            this.map.pm.pmCircle = this;
        }

        if(options && options.text){
            options.text = this.setText(options.text);
        }

        var circleType = "circle";
        if(options && options.circleType) {
            circleType = options.circleType;
            delete options.circleType;
        }

        L.setOptions(this, options);
        this.map.pm.Draw.Circle.options.circleType = circleType;

        this._overwriteFunctions();
        this._addCss();

        this.map.pm.Toolbar._showHideButtons = this._extend(this.map.pm.Toolbar._showHideButtons,this._createActionBtn(this),this.map.pm.Toolbar);
        this.map.pm.Toolbar._showHideButtons();

        this.setCircleType(this.map.pm.Draw.Circle.options.circleType); //circle, 2point, 3point
    },
    setOptions(options){
        if(options && options.text){
            options.text = this.setText(options.text);
        }
        if(options && options.circleType) {
            this.setCircleType(options.circleType);
            delete options.circleType;
        }
        L.setOptions(this, options);
    },
    setCircleType(type){
        this.map.pm.Draw.Circle.options.circleType = type;
        this._updateToolbarIcon();
        this.map.pm.Draw.Circle.toggle();
        this.map.pm.Draw.Circle.toggle();

    },
    setText: function(text){
        if(text["continueLine"]){
            this.options.text["continueLine"] = text["continueLine"];
        }
        if(text["continueLine"]){
            this.options.text["continueLine"] = text["continueLine"];
        }
        if(text["startCircle"]){
            this.options.text["startCircle"] = text["startCircle"];
        }
        if(text["firstVertex"]){
            this.options.text["firstVertex"] = text["firstVertex"];
        }
        if(text["title"]){
            this.options.text["title"] = text["title"];
        }
        if(text["cancel"]){
            this.options.text["cancel"] = text["cancel"];
        }

        if(this.map && this.map.pm){
            this.map.pm.pmCircle = this;
        }
        return this.options.text;
    },
    getText(name){
      return this.options.text[name];
    },
    _overwriteFunctions: function() {
        var that = this;
        L.PM.Draw.Circle.include(circleExtend);

        L.PM.Draw.Circle.prototype.enableOrg = L.PM.Draw.Circle.prototype.enable;
        L.PM.Draw.Circle.prototype.enable = function (options) {
            this.enableOrg(options);
            var tooltip_text = this.options.circleType === 'circle' ? this._map.pm.pmCircle.getText('startCircle') : this._map.pm.pmCircle.getText('firstVertex');
            // add tooltip to hintmarker
            if (this.options.tooltips) {
                this._hintMarker
                    .bindTooltip(tooltip_text, {
                        permanent: true,
                        offset: L.point(0, 10),
                        direction: 'bottom',
                        opacity: 0.8,
                    }).openTooltip();
            }
        };

        L.PM.Draw.Circle.prototype.disableOrg = L.PM.Draw.Circle.prototype.disable;
        L.PM.Draw.Circle.prototype.disable = function () {
            this.disableOrg();
            this._map.off('click', this._placeCircleMarker, this);
            this._hintMarker.off('move', this._syncHintLine, this);
            this._hintMarker.off('move', this._syncCircleRadiusMulti, this);
        }
    },
    _createActionBtn: function(that){
        return function() {
            const actions = [
                {
                    name: 'circle',
                    className: 'leaflet-pm-toolbar action-icon'+that.buttonClasses['circle'].className,
                    onClick() {
                        that.setCircleType("circle");
                    },
                },
                {
                    name: '2point',
                    className: 'leaflet-pm-toolbar action-icon '+that.buttonClasses['2point'].className,
                    onClick() {
                        that.setCircleType("2point");
                    },
                },
                {
                    name: '3point',
                    className: 'leaflet-pm-toolbar action-icon'+that.buttonClasses['3point'].className,
                    onClick() {
                        that.setCircleType("3point");
                    },
                },
                {
                    name: 'cancel',
                    text: that.map.pm.pmCircle.options.text.cancel,
                    className: 'verticaltop',
                    onClick() {
                        that.map.pm.Draw.Circle.toggle();
                    },
                },
            ];

            that._updateToolbarIcon();
            var actionContainer = that.map.pm.Toolbar.buttons.drawCircle.buttonsDomNode.children[1];
            actionContainer.innerHTML = "";
            actions.forEach(action => {
                var name = action.name;
                const actionNode = L.DomUtil.create(
                    'a',
                    `leaflet-pm-action action-${name}`,
                    actionContainer
                );

                if (action.text) {
                    actionNode.innerHTML = action.text;
                }
                if(action.className) {
                    L.DomUtil.addClass(actionNode, action.className);
                }

                L.DomEvent.addListener(actionNode, 'click', action.onClick, that);
                L.DomEvent.disableClickPropagation(actionNode);
            });
        }
    },
    _extend: function(fn,code,that){
        return function(){
            fn.apply(that,arguments);
            code.apply(that,arguments);
        }
    },
    _updateToolbarIcon(){
        var buttonContainer = this.map.pm.Toolbar.buttons.drawCircle.buttonsDomNode.children[0];

        buttonContainer.innerHTML = "";
        const image = L.DomUtil.create('div', 'control-icon', buttonContainer);
        image.setAttribute('title', this.map.pm.pmCircle.options.text.title);

        var circleType = this.map.pm.Draw.Circle.options.circleType;
        if (this.buttonClasses[circleType].className) {
            L.DomUtil.addClass(image, this.buttonClasses[circleType].className);
        }else{
            L.DomUtil.addClass(image, this.buttonClasses["circle"].className);
        }
        return buttonContainer;
    },
    _addCss: function () {
        if (this.cssadded) {
            return;
        }
        this.cssadded = true;
        var styles = ".action-icon{ background-color: #fff !important; width: 30px !important; padding: 0 !important; margin: 0 !important; -webkit-background-size: 19px; background-size: 19px; vertical-align: middle; border-bottom: 1px solid #ccc !important; } .action-icon:hover { background-color: #f3f3f3 !important; } .leaflet-pm-icon-circle-3point{ background-image: url(\"data:image/svg+xml;base64,PCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDIzLjAuMCwgU1ZHIEV4cG9ydCBQbHVnLUluICAtLT4NCjxzdmcgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjY0cHgiDQoJIGhlaWdodD0iNTMuNDZweCIgdmlld0JveD0iMCAwIDY0IDUzLjQ2IiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA2NCA1My40NjsiIHhtbDpzcGFjZT0icHJlc2VydmUiPg0KPHN0eWxlIHR5cGU9InRleHQvY3NzIj4NCgkuc3Qwe2ZpbGw6IzVCNUI1Qjt9DQoJLnN0MXtmaWxsOiNGRkZGRkY7fQ0KPC9zdHlsZT4NCjxkZWZzPg0KPC9kZWZzPg0KPGc+DQoJPGc+DQoJCTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik0zMi4zNiw1My40NmMtNi4yNywwLTEyLjU0LTIuMzktMTcuMzItNy4xNmMtOS41NS05LjU1LTkuNTUtMjUuMDksMC0zNC42NGwwLDBjOS41NS05LjU1LDI1LjA5LTkuNTUsMzQuNjQsMA0KCQkJYzQuNjMsNC42Myw3LjE4LDEwLjc4LDcuMTgsMTcuMzJzLTIuNTUsMTIuNjktNy4xOCwxNy4zMkM0NC45MSw1MS4wNywzOC42NCw1My40NiwzMi4zNiw1My40NnogTTE5LjA3LDE1LjY5DQoJCQljLTcuMzMsNy4zMy03LjMzLDE5LjI1LDAsMjYuNThjNy4zMyw3LjMzLDE5LjI1LDcuMzMsMjYuNTgsMGMzLjU1LTMuNTUsNS41MS04LjI3LDUuNTEtMTMuMjlzLTEuOTYtOS43NC01LjUxLTEzLjI5DQoJCQlDMzguMzIsOC4zNiwyNi40LDguMzYsMTkuMDcsMTUuNjlMMTkuMDcsMTUuNjl6Ii8+DQoJPC9nPg0KCTxnPg0KCQk8cGF0aCBjbGFzcz0ic3QwIiBkPSJNMi44NiwzNS4yNmMzLjgzLDMuODMsMTAuMDIsMy44MiwxMy44NCwwYzMuODMtMy44MywzLjgzLTEwLjAxLDAtMTMuODRjLTMuODItMy44Mi0xMC4wMS0zLjgzLTEzLjg0LDANCgkJCUMtMC45NSwyNS4yNC0wLjk1LDMxLjQ0LDIuODYsMzUuMjZ6IE0xMy4yNSwyNC44OGMxLjkxLDEuOTEsMS45MSw1LjAyLDAsNi45M3MtNS4wMSwxLjktNi45Mi0wLjAxYy0xLjkxLTEuOTEtMS45MS01LDAtNi45MQ0KCQkJUzExLjM0LDIyLjk3LDEzLjI1LDI0Ljg4eiIvPg0KCTwvZz4NCgk8Zz4NCgkJPHBhdGggY2xhc3M9InN0MCIgZD0iTTI2LjU2LDEzLjI4YzMuMDQsMy4wNCw3Ljk3LDMuMDQsMTEsMHMzLjA0LTcuOTYsMC0xMWMtMy4wNC0zLjA0LTcuOTctMy4wNC0xMSwwUzIzLjUzLDEwLjI0LDI2LjU2LDEzLjI4eg0KCQkJIE0zNC44MSw1LjAzYzEuNTIsMS41MiwxLjUyLDMuOTksMC4wMSw1LjVjLTEuNTIsMS41Mi0zLjk4LDEuNTEtNS41LTAuMDFjLTEuNTEtMS41MS0xLjUyLTMuOTcsMC01LjQ5DQoJCQlDMzAuODMsMy41MiwzMy4zLDMuNTIsMzQuODEsNS4wM3oiLz4NCgk8L2c+DQoJPGc+DQoJCTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0yOS4zMiw1LjAzYzEuNTEtMS41MSwzLjk4LTEuNTEsNS40OSwwYzEuNTIsMS41MiwxLjUyLDMuOTksMC4wMSw1LjVjLTEuNTIsMS41Mi0zLjk4LDEuNTEtNS41LTAuMDENCgkJCUMyNy44LDkuMDEsMjcuNzksNi41NiwyOS4zMiw1LjAzeiIvPg0KCTwvZz4NCgk8Zz4NCgkJPHBhdGggY2xhc3M9InN0MCIgZD0iTTQ3LjI5LDM1LjI2YzMuODMsMy44MywxMC4wMiwzLjgyLDEzLjg0LDBjMy44My0zLjgzLDMuODMtMTAuMDEsMC0xMy44NGMtMy44Mi0zLjgyLTEwLjAxLTMuODMtMTMuODQsMA0KCQkJQzQzLjQ3LDI1LjI0LDQzLjQ3LDMxLjQ1LDQ3LjI5LDM1LjI2eiBNNTcuNjcsMjQuODhjMS45MSwxLjkxLDEuOTEsNS4wMiwwLDYuOTNjLTEuOTEsMS45MS01LjAxLDEuOS02LjkyLTAuMDENCgkJCWMtMS45MS0xLjkxLTEuOTEtNSwwLTYuOTFDNTIuNjYsMjIuOTgsNTUuNzcsMjIuOTcsNTcuNjcsMjQuODh6Ii8+DQoJPC9nPg0KCTxnPg0KCQk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNNTAuNzUsMjQuODljMS45MS0xLjkxLDUuMDEtMS45Miw2LjkyLTAuMDFjMS45MSwxLjkxLDEuOTEsNS4wMiwwLDYuOTNjLTEuOTEsMS45MS01LjAxLDEuOS02LjkyLTAuMDENCgkJCUM0OC44NSwyOS44OSw0OC44NSwyNi44LDUwLjc1LDI0Ljg5eiIvPg0KCTwvZz4NCgk8Zz4NCgkJPHBhdGggY2xhc3M9InN0MSIgZD0iTTYuMzMsMjQuODljMS45MS0xLjkxLDUuMDEtMS45Miw2LjkyLTAuMDFjMS45MSwxLjkxLDEuOTEsNS4wMiwwLDYuOTNzLTUuMDEsMS45LTYuOTItMC4wMQ0KCQkJQzQuNDIsMjkuODksNC40MiwyNi44LDYuMzMsMjQuODl6Ii8+DQoJPC9nPg0KCTxnPg0KCQk8Y2lyY2xlIGNsYXNzPSJzdDAiIGN4PSIzMi4zNiIgY3k9IjI4Ljk4IiByPSIzLjQyIi8+DQoJPC9nPg0KPC9nPg0KPC9zdmc+DQo=\") ; } .leaflet-pm-icon-circle-2point{ background-size: 16px; background-image: url(\"data:image/svg+xml;base64,PCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDIzLjAuMCwgU1ZHIEV4cG9ydCBQbHVnLUluICAtLT4NCjxzdmcgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjUzLjAycHgiDQoJIGhlaWdodD0iNTMuMDFweCIgdmlld0JveD0iMCAwIDUzLjAyIDUzLjAxIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA1My4wMiA1My4wMTsiIHhtbDpzcGFjZT0icHJlc2VydmUiPg0KPHN0eWxlIHR5cGU9InRleHQvY3NzIj4NCgkuc3Qwe2ZpbGw6IzVCNUI1Qjt9DQoJLnN0MXtmaWxsOiNGRkZGRkY7fQ0KPC9zdHlsZT4NCjxkZWZzPg0KPC9kZWZzPg0KPGc+DQoJPGc+DQoJCTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik0yNS43Nyw1MS43OGMtMTQuMDQsMC0yNS40Ny0xMS40Mi0yNS40Ny0yNS40N2MwLTE0LjA0LDExLjQyLTI1LjQ3LDI1LjQ3LTI1LjQ3czI1LjQ3LDExLjQyLDI1LjQ3LDI1LjQ3DQoJCQlDNTEuMjQsNDAuMzUsMzkuODIsNTEuNzgsMjUuNzcsNTEuNzh6IE0yNS43Nyw2Ljc2QzE1LDYuNzYsNi4yMywxNS41Myw2LjIzLDI2LjMxUzE1LDQ1Ljg1LDI1Ljc3LDQ1Ljg1czE5LjU1LTguNzcsMTkuNTUtMTkuNTUNCgkJCVMzNi41NSw2Ljc2LDI1Ljc3LDYuNzZ6Ii8+DQoJPC9nPg0KCTxnPg0KCQk8cGF0aCBjbGFzcz0ic3QwIiBkPSJNNDIuODQsMGMtNS42MywwLTEwLjE4LDQuNTYtMTAuMTgsMTAuMThjMCw1LjYzLDQuNTUsMTAuMTgsMTAuMTgsMTAuMThjNS42MSwwLDEwLjE4LTQuNTUsMTAuMTgtMTAuMTgNCgkJCUM1My4wMiw0LjU2LDQ4LjQ2LDAsNDIuODQsMHogTTQyLjg0LDE1LjI3Yy0yLjgxLDAtNS4wOS0yLjI5LTUuMDktNS4wOXMyLjI5LTUuMDgsNS4wOS01LjA4YzIuODEsMCw1LjA4LDIuMjcsNS4wOCw1LjA4DQoJCQlTNDUuNjUsMTUuMjcsNDIuODQsMTUuMjd6Ii8+DQoJPC9nPg0KCTxnPg0KCQk8cGF0aCBjbGFzcz0ic3QwIiBkPSJNMTAuMTgsMzIuNjZDNC41NSwzMi42NiwwLDM3LjIyLDAsNDIuODRjMCw1LjYzLDQuNTUsMTAuMTgsMTAuMTgsMTAuMThjNS42MSwwLDEwLjE4LTQuNTUsMTAuMTgtMTAuMTgNCgkJCUMyMC4zNSwzNy4yMiwxNS43OSwzMi42NiwxMC4xOCwzMi42NnogTTEwLjE4LDQ3LjkzYy0yLjgxLDAtNS4wOS0yLjI5LTUuMDktNS4wOWMwLTIuODEsMi4yOS01LjA4LDUuMDktNS4wOHM1LjA4LDIuMjcsNS4wOCw1LjA4DQoJCQlDMTUuMjYsNDUuNjUsMTIuOTgsNDcuOTMsMTAuMTgsNDcuOTN6Ii8+DQoJPC9nPg0KCTxnPg0KCQk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNMTUuMjYsNDIuODRjMCwyLjgxLTIuMjcsNS4wOS01LjA4LDUuMDlzLTUuMDktMi4yOS01LjA5LTUuMDljMC0yLjgxLDIuMjktNS4wOCw1LjA5LTUuMDgNCgkJCVMxNS4yNiw0MC4wMywxNS4yNiw0Mi44NHoiLz4NCgk8L2c+DQoJPGc+DQoJCTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik00Ny45MiwxMC4xOGMwLDIuODEtMi4yNyw1LjA5LTUuMDgsNS4wOWMtMi44MSwwLTUuMDktMi4yOS01LjA5LTUuMDlzMi4yOS01LjA4LDUuMDktNS4wOA0KCQkJQzQ1LjY1LDUuMDksNDcuOTIsNy4zNyw0Ny45MiwxMC4xOHoiLz4NCgk8L2c+DQoJPGc+DQoJCTxjaXJjbGUgY2xhc3M9InN0MCIgY3g9IjI1Ljc3IiBjeT0iMjYuMzEiIHI9IjMuNTUiLz4NCgk8L2c+DQo8L2c+DQo8L3N2Zz4NCg==\"); } .verticaltop{ vertical-align: top; }";
        var styleSheet = document.createElement("style");
        styleSheet.type = "text/css";
        styleSheet.innerText = styles;
        document.head.appendChild(styleSheet);
    },

});



