'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _brace = require('brace');

var _brace2 = _interopRequireDefault(_brace);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _lodash = require('lodash.isequal');

var _lodash2 = _interopRequireDefault(_lodash);

var _lodash3 = require('lodash.get');

var _lodash4 = _interopRequireDefault(_lodash3);

var _editorOptions = require('./editorOptions.js');

require('brace/ext/split');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _ace$acequire = _brace2.default.acequire('ace/range'),
    Range = _ace$acequire.Range;

var _ace$acequire2 = _brace2.default.acequire('ace/split'),
    Split = _ace$acequire2.Split;

var SplitComponent = function (_Component) {
  _inherits(SplitComponent, _Component);

  function SplitComponent(props) {
    _classCallCheck(this, SplitComponent);

    var _this = _possibleConstructorReturn(this, (SplitComponent.__proto__ || Object.getPrototypeOf(SplitComponent)).call(this, props));

    _editorOptions.editorEvents.forEach(function (method) {
      _this[method] = _this[method].bind(_this);
    });
    return _this;
  }

  _createClass(SplitComponent, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this2 = this;

      var _props = this.props,
          className = _props.className,
          onBeforeLoad = _props.onBeforeLoad,
          mode = _props.mode,
          focus = _props.focus,
          theme = _props.theme,
          fontSize = _props.fontSize,
          value = _props.value,
          defaultValue = _props.defaultValue,
          cursorStart = _props.cursorStart,
          showGutter = _props.showGutter,
          wrapEnabled = _props.wrapEnabled,
          showPrintMargin = _props.showPrintMargin,
          _props$scrollMargin = _props.scrollMargin,
          scrollMargin = _props$scrollMargin === undefined ? [0, 0, 0, 0] : _props$scrollMargin,
          keyboardHandler = _props.keyboardHandler,
          onLoad = _props.onLoad,
          commands = _props.commands,
          annotations = _props.annotations,
          markers = _props.markers,
          splits = _props.splits;


      this.editor = _brace2.default.edit(this.refEditor);

      if (onBeforeLoad) {
        onBeforeLoad(_brace2.default);
      }

      var editorProps = Object.keys(this.props.editorProps);

      var split = new Split(this.editor.container, 'ace/theme/' + theme, splits);
      this.editor.env.split = split;

      this.splitEditor = split.getEditor(0);
      this.split = split;
      // in a split scenario we don't want a print margin for the entire application
      this.editor.setShowPrintMargin(false);
      this.editor.renderer.setShowGutter(false);
      // get a list of possible options to avoid 'misspelled option errors'
      var availableOptions = this.splitEditor.$options;
      split.forEach(function (editor, index) {
        for (var i = 0; i < editorProps.length; i++) {
          editor[editorProps[i]] = _this2.props.editorProps[editorProps[i]];
        }
        var defaultValueForEditor = (0, _lodash4.default)(defaultValue, index);
        var valueForEditor = (0, _lodash4.default)(value, index, '');
        editor.setTheme('ace/theme/' + theme);
        editor.renderer.setScrollMargin(scrollMargin[0], scrollMargin[1], scrollMargin[2], scrollMargin[3]);
        editor.getSession().setMode('ace/mode/' + mode);
        editor.setFontSize(fontSize);
        editor.renderer.setShowGutter(showGutter);
        editor.getSession().setUseWrapMode(wrapEnabled);
        editor.setShowPrintMargin(showPrintMargin);
        editor.on('focus', _this2.onFocus);
        editor.on('blur', _this2.onBlur);
        editor.on('copy', _this2.onCopy);
        editor.on('paste', _this2.onPaste);
        editor.on('change', _this2.onChange);
        editor.getSession().selection.on('changeSelection', _this2.onSelectionChange);
        editor.session.on('changeScrollTop', _this2.onScroll);
        editor.setValue(defaultValueForEditor === undefined ? valueForEditor : defaultValueForEditor, cursorStart);
        var newAnnotations = (0, _lodash4.default)(annotations, index, []);
        var newMarkers = (0, _lodash4.default)(markers, index, []);
        editor.getSession().setAnnotations(newAnnotations);
        if (newMarkers && newMarkers.length > 0) {
          _this2.handleMarkers(newMarkers, editor);
        }

        for (var _i = 0; _i < _editorOptions.editorOptions.length; _i++) {
          var option = _editorOptions.editorOptions[_i];
          if (availableOptions.hasOwnProperty(option)) {
            editor.setOption(option, _this2.props[option]);
          } else if (_this2.props[option]) {
            console.warn('ReaceAce: editor option ' + option + ' was activated but not found. Did you need to import a related tool or did you possibly mispell the option?');
          }
        }
        _this2.handleOptions(_this2.props, editor);
        if (Array.isArray(commands)) {
          commands.forEach(function (command) {
            editor.commands.addCommand(command);
          });
        }

        if (keyboardHandler) {
          editor.setKeyboardHandler('ace/keyboard/' + keyboardHandler);
        }
      });

      if (className) {
        this.refEditor.className += ' ' + className;
      }

      if (focus) {
        this.splitEditor.focus();
      }

      var sp = this.editor.env.split;
      sp.setOrientation(this.props.orientation === 'below' ? sp.BELOW : sp.BESIDE);
      sp.resize(true);
      if (onLoad) {
        onLoad(sp);
      }
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      var _this3 = this;

      var oldProps = this.props;

      var split = this.editor.env.split;

      if (nextProps.splits !== oldProps.splits) {
        split.setSplits(nextProps.splits);
      }

      if (nextProps.orientation !== oldProps.orientation) {
        split.setOrientation(nextProps.orientation === 'below' ? split.BELOW : split.BESIDE);
      }

      split.forEach(function (editor, index) {

        if (nextProps.mode !== oldProps.mode) {
          editor.getSession().setMode('ace/mode/' + nextProps.mode);
        }
        if (nextProps.keyboardHandler !== oldProps.keyboardHandler) {
          if (nextProps.keyboardHandler) {
            editor.setKeyboardHandler('ace/keyboard/' + nextProps.keyboardHandler);
          } else {
            editor.setKeyboardHandler(null);
          }
        }
        if (nextProps.fontSize !== oldProps.fontSize) {
          editor.setFontSize(nextProps.fontSize);
        }
        if (nextProps.wrapEnabled !== oldProps.wrapEnabled) {
          editor.getSession().setUseWrapMode(nextProps.wrapEnabled);
        }
        if (nextProps.showPrintMargin !== oldProps.showPrintMargin) {
          editor.setShowPrintMargin(nextProps.showPrintMargin);
        }
        if (nextProps.showGutter !== oldProps.showGutter) {
          editor.renderer.setShowGutter(nextProps.showGutter);
        }

        for (var i = 0; i < _editorOptions.editorOptions.length; i++) {
          var option = _editorOptions.editorOptions[i];
          if (nextProps[option] !== oldProps[option]) {
            editor.setOption(option, nextProps[option]);
          }
        }
        if (!(0, _lodash2.default)(nextProps.setOptions, oldProps.setOptions)) {
          _this3.handleOptions(nextProps, editor);
        }
        var nextValue = (0, _lodash4.default)(nextProps.value, index, '');
        if (editor.getValue() !== nextValue) {
          // editor.setValue is a synchronous function call, change event is emitted before setValue return.
          _this3.silent = true;
          var pos = editor.session.selection.toJSON();
          editor.setValue(nextValue, nextProps.cursorStart);
          editor.session.selection.fromJSON(pos);
          _this3.silent = false;
        }
        var newAnnotations = (0, _lodash4.default)(nextProps.annotations, index, []);
        var oldAnnotations = (0, _lodash4.default)(oldProps.annotations, index, []);
        if (!(0, _lodash2.default)(newAnnotations, oldAnnotations)) {
          editor.getSession().setAnnotations(newAnnotations);
        }

        var newMarkers = (0, _lodash4.default)(nextProps.markers, index, []);
        var oldMarkers = (0, _lodash4.default)(oldProps.markers, index, []);
        if (!(0, _lodash2.default)(newMarkers, oldMarkers) && Array.isArray(newMarkers)) {
          _this3.handleMarkers(newMarkers, editor);
        }
      });

      if (nextProps.className !== oldProps.className) {
        var appliedClasses = this.refEditor.className;
        var appliedClassesArray = appliedClasses.trim().split(' ');
        var oldClassesArray = oldProps.className.trim().split(' ');
        oldClassesArray.forEach(function (oldClass) {
          var index = appliedClassesArray.indexOf(oldClass);
          appliedClassesArray.splice(index, 1);
        });
        this.refEditor.className = ' ' + nextProps.className + ' ' + appliedClassesArray.join(' ');
      }

      if (nextProps.theme !== oldProps.theme) {
        split.setTheme('ace/theme/' + nextProps.theme);
      }

      if (nextProps.focus && !oldProps.focus) {
        this.splitEditor.focus();
      }
      if (nextProps.height !== this.props.height || nextProps.width !== this.props.width) {
        this.editor.resize();
      }
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.editor.destroy();
      this.editor = null;
    }
  }, {
    key: 'onChange',
    value: function onChange(event) {
      if (this.props.onChange && !this.silent) {
        var value = [];
        this.editor.env.split.forEach(function (editor) {
          value.push(editor.getValue());
        });
        this.props.onChange(value, event);
      }
    }
  }, {
    key: 'onSelectionChange',
    value: function onSelectionChange(event) {
      if (this.props.onSelectionChange) {
        var value = [];
        this.editor.env.split.forEach(function (editor) {
          value.push(editor.getSelection());
        });
        this.props.onSelectionChange(value, event);
      }
    }
  }, {
    key: 'onFocus',
    value: function onFocus() {
      if (this.props.onFocus) {
        this.props.onFocus();
      }
    }
  }, {
    key: 'onBlur',
    value: function onBlur() {
      if (this.props.onBlur) {
        this.props.onBlur();
      }
    }
  }, {
    key: 'onCopy',
    value: function onCopy(text) {
      if (this.props.onCopy) {
        this.props.onCopy(text);
      }
    }
  }, {
    key: 'onPaste',
    value: function onPaste(text) {
      if (this.props.onPaste) {
        this.props.onPaste(text);
      }
    }
  }, {
    key: 'onScroll',
    value: function onScroll() {
      if (this.props.onScroll) {
        this.props.onScroll(this.editor);
      }
    }
  }, {
    key: 'handleOptions',
    value: function handleOptions(props, editor) {
      var setOptions = Object.keys(props.setOptions);
      for (var y = 0; y < setOptions.length; y++) {
        editor.setOption(setOptions[y], props.setOptions[setOptions[y]]);
      }
    }
  }, {
    key: 'handleMarkers',
    value: function handleMarkers(markers, editor) {
      // remove foreground markers
      var currentMarkers = editor.getSession().getMarkers(true);
      for (var i in currentMarkers) {
        if (currentMarkers.hasOwnProperty(i)) {
          editor.getSession().removeMarker(currentMarkers[i].id);
        }
      }
      // remove background markers
      currentMarkers = editor.getSession().getMarkers(false);
      for (var _i2 in currentMarkers) {
        if (currentMarkers.hasOwnProperty(_i2)) {
          editor.getSession().removeMarker(currentMarkers[_i2].id);
        }
      }
      // add new markers
      markers.forEach(function (_ref) {
        var startRow = _ref.startRow,
            startCol = _ref.startCol,
            endRow = _ref.endRow,
            endCol = _ref.endCol,
            className = _ref.className,
            type = _ref.type,
            _ref$inFront = _ref.inFront,
            inFront = _ref$inFront === undefined ? false : _ref$inFront;

        var range = new Range(startRow, startCol, endRow, endCol);
        editor.getSession().addMarker(range, className, type, inFront);
      });
    }
  }, {
    key: 'updateRef',
    value: function updateRef(item) {
      this.refEditor = item;
    }
  }, {
    key: 'render',
    value: function render() {
      var _props2 = this.props,
          name = _props2.name,
          width = _props2.width,
          height = _props2.height,
          style = _props2.style;

      var divStyle = _extends({ width: width, height: height }, style);
      return _react2.default.createElement('div', { ref: this.updateRef,
        id: name,
        style: divStyle
      });
    }
  }]);

  return SplitComponent;
}(_react.Component);

exports.default = SplitComponent;


SplitComponent.propTypes = {
  mode: _propTypes2.default.string,
  splits: _propTypes2.default.number,
  orientation: _propTypes2.default.string,
  focus: _propTypes2.default.bool,
  theme: _propTypes2.default.string,
  name: _propTypes2.default.string,
  className: _propTypes2.default.string,
  height: _propTypes2.default.string,
  width: _propTypes2.default.string,
  fontSize: _propTypes2.default.oneOfType([_propTypes2.default.number, _propTypes2.default.string]),
  showGutter: _propTypes2.default.bool,
  onChange: _propTypes2.default.func,
  onCopy: _propTypes2.default.func,
  onPaste: _propTypes2.default.func,
  onFocus: _propTypes2.default.func,
  onBlur: _propTypes2.default.func,
  onScroll: _propTypes2.default.func,
  value: _propTypes2.default.arrayOf(_propTypes2.default.string),
  defaultValue: _propTypes2.default.arrayOf(_propTypes2.default.string),
  onLoad: _propTypes2.default.func,
  onSelectionChange: _propTypes2.default.func,
  onBeforeLoad: _propTypes2.default.func,
  minLines: _propTypes2.default.number,
  maxLines: _propTypes2.default.number,
  readOnly: _propTypes2.default.bool,
  highlightActiveLine: _propTypes2.default.bool,
  tabSize: _propTypes2.default.number,
  showPrintMargin: _propTypes2.default.bool,
  cursorStart: _propTypes2.default.number,
  editorProps: _propTypes2.default.object,
  setOptions: _propTypes2.default.object,
  style: _propTypes2.default.object,
  scrollMargin: _propTypes2.default.array,
  annotations: _propTypes2.default.array,
  markers: _propTypes2.default.array,
  keyboardHandler: _propTypes2.default.string,
  wrapEnabled: _propTypes2.default.bool,
  enableBasicAutocompletion: _propTypes2.default.oneOfType([_propTypes2.default.bool, _propTypes2.default.array]),
  enableLiveAutocompletion: _propTypes2.default.oneOfType([_propTypes2.default.bool, _propTypes2.default.array]),
  commands: _propTypes2.default.array
};

SplitComponent.defaultProps = {
  name: 'brace-editor',
  focus: false,
  orientation: 'below',
  splits: 2,
  mode: '',
  theme: '',
  height: '100%',
  width: '100%',
  value: [],
  fontSize: 12,
  showGutter: true,
  onChange: null,
  onPaste: null,
  onLoad: null,
  onScroll: null,
  minLines: null,
  maxLines: null,
  readOnly: false,
  highlightActiveLine: true,
  showPrintMargin: true,
  tabSize: 4,
  cursorStart: 1,
  editorProps: {},
  style: {},
  scrollMargin: [0, 0, 0, 0],
  setOptions: {},
  wrapEnabled: false,
  enableBasicAutocompletion: false,
  enableLiveAutocompletion: false
};