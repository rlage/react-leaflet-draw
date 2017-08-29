'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _propTypes = require('prop-types');

var _leafletDraw = require('leaflet-draw');

var _leafletDraw2 = _interopRequireDefault(_leafletDraw);

var _lodash = require('lodash.isequal');

var _lodash2 = _interopRequireDefault(_lodash);

var _reactLeaflet = require('react-leaflet');

var _leaflet = require('leaflet');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // eslint-disable-line


var eventHandlers = {
  onEdited: 'draw:edited',
  onEditStart: 'draw:editstart',
  onEditStop: 'draw:editstop',
  onDeleted: 'draw:deleted',
  onDeleteStart: 'draw:deletestart',
  onDeleteStop: 'draw:deletestop'
};

var EditControl = function (_LayersControl) {
  _inherits(EditControl, _LayersControl);

  function EditControl() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, EditControl);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = EditControl.__proto__ || Object.getPrototypeOf(EditControl)).call.apply(_ref, [this].concat(args))), _this), _this.onDrawCreate = function (e) {
      var onCreated = _this.props.onCreated;
      var layerContainer = _this.context.layerContainer;


      layerContainer.addLayer(e.layer);
      onCreated && onCreated(e);
    }, _this.onDrawEdited = function (e) {
      var onEdited = _this.props.onEdited;
      var layerContainer = _this.context.layerContainer;


      layerContainer.addLayer(e.layer);
      onEdited && onEdited(e);
    }, _this.updateDrawControls = function () {
      var layerContainer = _this.context.layerContainer;
      var _this$props = _this.props,
          draw = _this$props.draw,
          edit = _this$props.edit,
          position = _this$props.position;

      var options = {
        edit: _extends({}, edit, {
          featureGroup: layerContainer
        })
      };

      if (draw) {
        options.draw = draw;
      }

      if (position) {
        options.position = position;
      }

      _this.leafletElement = new L.Control.Draw(options); // eslint-disable-line
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(EditControl, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      var map = this.context.map;


      this.updateDrawControls();

      map.on('draw:created', this.onDrawCreate);
      map.on('draw:edited', this.onDrawEdited);

      for (var key in eventHandlers) {
        if (this.props[key]) {
          map.on(eventHandlers[key], this.props[key]);
        }
      }
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      var onMounted = this.props.onMounted;

      _get(EditControl.prototype.__proto__ || Object.getPrototypeOf(EditControl.prototype), 'componentDidMount', this).call(this);
      onMounted && onMounted(this.leafletElement);
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      var map = this.context.map;

      this.leafletElement.remove(map);

      map.off('draw:created', this.onDrawCreate);

      for (var key in eventHandlers) {
        if (this.props[key]) {
          map.off(eventHandlers[key], this.props[key]);
        }
      }
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate(prevProps) {
      // super updates positions if thats all that changed so call this first
      _get(EditControl.prototype.__proto__ || Object.getPrototypeOf(EditControl.prototype), 'componentDidUpdate', this).call(this, prevProps);

      if ((0, _lodash2.default)(this.props.draw, prevProps.draw) || this.props.position !== prevProps.position) {
        return false;
      }

      var map = this.context.map;


      this.leafletElement.remove(map);
      this.updateDrawControls();
      this.leafletElement.addTo(map);

      return null;
    }
  }]);

  return EditControl;
}(_reactLeaflet.LayersControl);

EditControl.propTypes = _extends({}, Object.keys(eventHandlers).reduce(function (acc, val) {
  acc[val] = _propTypes.PropTypes.func;
  return acc;
}, {}), {
  onCreated: _propTypes.PropTypes.func,
  onMounted: _propTypes.PropTypes.func,
  draw: _propTypes.PropTypes.shape({
    polyline: _propTypes.PropTypes.oneOfType([_propTypes.PropTypes.object, _propTypes.PropTypes.bool]),
    polygon: _propTypes.PropTypes.oneOfType([_propTypes.PropTypes.object, _propTypes.PropTypes.bool]),
    rectangle: _propTypes.PropTypes.oneOfType([_propTypes.PropTypes.object, _propTypes.PropTypes.bool]),
    circle: _propTypes.PropTypes.oneOfType([_propTypes.PropTypes.object, _propTypes.PropTypes.bool]),
    marker: _propTypes.PropTypes.oneOfType([_propTypes.PropTypes.object, _propTypes.PropTypes.bool])
  }),
  edit: _propTypes.PropTypes.shape({
    edit: _propTypes.PropTypes.oneOfType([_propTypes.PropTypes.object, _propTypes.PropTypes.bool]),
    remove: _propTypes.PropTypes.oneOfType([_propTypes.PropTypes.object, _propTypes.PropTypes.bool]),
    poly: _propTypes.PropTypes.oneOfType([_propTypes.PropTypes.object, _propTypes.PropTypes.bool]),
    allowIntersection: _propTypes.PropTypes.bool
  }),
  position: _propTypes.PropTypes.oneOf(['topright', 'topleft', 'bottomright', 'bottomleft'])
});
EditControl.contextTypes = {
  map: _propTypes.PropTypes.instanceOf(_leaflet.Map),
  layerContainer: _propTypes.PropTypes.shape({
    addLayer: _propTypes.PropTypes.func.isRequired,
    removeLayer: _propTypes.PropTypes.func.isRequired
  })
};
exports.default = EditControl;