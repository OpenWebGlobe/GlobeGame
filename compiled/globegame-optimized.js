var COMPILED = false;
var goog = goog || {};
goog.global = this;
goog.DEBUG = true;
goog.LOCALE = "en";
goog.evalWorksForGlobals_ = null;
goog.provide = function(name) {
  if(!COMPILED) {
    if(goog.getObjectByName(name) && !goog.implicitNamespaces_[name]) {
      throw Error('Namespace "' + name + '" already declared.');
    }
    var namespace = name;
    while(namespace = namespace.substring(0, namespace.lastIndexOf("."))) {
      goog.implicitNamespaces_[namespace] = true
    }
  }
  goog.exportPath_(name)
};
goog.setTestOnly = function(opt_message) {
  if(COMPILED && !goog.DEBUG) {
    opt_message = opt_message || "";
    throw Error("Importing test-only code into non-debug environment" + opt_message ? ": " + opt_message : ".");
  }
};
if(!COMPILED) {
  goog.implicitNamespaces_ = {}
}
goog.exportPath_ = function(name, opt_object, opt_objectToExportTo) {
  var parts = name.split(".");
  var cur = opt_objectToExportTo || goog.global;
  if(!(parts[0] in cur) && cur.execScript) {
    cur.execScript("var " + parts[0])
  }
  for(var part;parts.length && (part = parts.shift());) {
    if(!parts.length && goog.isDef(opt_object)) {
      cur[part] = opt_object
    }else {
      if(cur[part]) {
        cur = cur[part]
      }else {
        cur = cur[part] = {}
      }
    }
  }
};
goog.getObjectByName = function(name, opt_obj) {
  var parts = name.split(".");
  var cur = opt_obj || goog.global;
  for(var part;part = parts.shift();) {
    if(goog.isDefAndNotNull(cur[part])) {
      cur = cur[part]
    }else {
      return null
    }
  }
  return cur
};
goog.globalize = function(obj, opt_global) {
  var global = opt_global || goog.global;
  for(var x in obj) {
    global[x] = obj[x]
  }
};
goog.addDependency = function(relPath, provides, requires) {
  if(!COMPILED) {
    var provide, require;
    var path = relPath.replace(/\\/g, "/");
    var deps = goog.dependencies_;
    for(var i = 0;provide = provides[i];i++) {
      deps.nameToPath[provide] = path;
      if(!(path in deps.pathToNames)) {
        deps.pathToNames[path] = {}
      }
      deps.pathToNames[path][provide] = true
    }
    for(var j = 0;require = requires[j];j++) {
      if(!(path in deps.requires)) {
        deps.requires[path] = {}
      }
      deps.requires[path][require] = true
    }
  }
};
goog.require = function(rule) {
  if(!COMPILED) {
    if(goog.getObjectByName(rule)) {
      return
    }
    var path = goog.getPathFromDeps_(rule);
    if(path) {
      goog.included_[path] = true;
      goog.writeScripts_()
    }else {
      var errorMessage = "goog.require could not find: " + rule;
      if(goog.global.console) {
        goog.global.console["error"](errorMessage)
      }
      throw Error(errorMessage);
    }
  }
};
goog.basePath = "";
goog.global.CLOSURE_BASE_PATH;
goog.global.CLOSURE_NO_DEPS;
goog.global.CLOSURE_IMPORT_SCRIPT;
goog.nullFunction = function() {
};
goog.identityFunction = function(var_args) {
  return arguments[0]
};
goog.abstractMethod = function() {
  throw Error("unimplemented abstract method");
};
goog.addSingletonGetter = function(ctor) {
  ctor.getInstance = function() {
    return ctor.instance_ || (ctor.instance_ = new ctor)
  }
};
if(!COMPILED) {
  goog.included_ = {};
  goog.dependencies_ = {pathToNames:{}, nameToPath:{}, requires:{}, visited:{}, written:{}};
  goog.inHtmlDocument_ = function() {
    var doc = goog.global.document;
    return typeof doc != "undefined" && "write" in doc
  };
  goog.findBasePath_ = function() {
    if(goog.global.CLOSURE_BASE_PATH) {
      goog.basePath = goog.global.CLOSURE_BASE_PATH;
      return
    }else {
      if(!goog.inHtmlDocument_()) {
        return
      }
    }
    var doc = goog.global.document;
    var scripts = doc.getElementsByTagName("script");
    for(var i = scripts.length - 1;i >= 0;--i) {
      var src = scripts[i].src;
      var qmark = src.lastIndexOf("?");
      var l = qmark == -1 ? src.length : qmark;
      if(src.substr(l - 7, 7) == "base.js") {
        goog.basePath = src.substr(0, l - 7);
        return
      }
    }
  };
  goog.importScript_ = function(src) {
    var importScript = goog.global.CLOSURE_IMPORT_SCRIPT || goog.writeScriptTag_;
    if(!goog.dependencies_.written[src] && importScript(src)) {
      goog.dependencies_.written[src] = true
    }
  };
  goog.writeScriptTag_ = function(src) {
    if(goog.inHtmlDocument_()) {
      var doc = goog.global.document;
      doc.write('<script type="text/javascript" src="' + src + '"></' + "script>");
      return true
    }else {
      return false
    }
  };
  goog.writeScripts_ = function() {
    var scripts = [];
    var seenScript = {};
    var deps = goog.dependencies_;
    function visitNode(path) {
      if(path in deps.written) {
        return
      }
      if(path in deps.visited) {
        if(!(path in seenScript)) {
          seenScript[path] = true;
          scripts.push(path)
        }
        return
      }
      deps.visited[path] = true;
      if(path in deps.requires) {
        for(var requireName in deps.requires[path]) {
          if(requireName in deps.nameToPath) {
            visitNode(deps.nameToPath[requireName])
          }else {
            if(!goog.getObjectByName(requireName)) {
              throw Error("Undefined nameToPath for " + requireName);
            }
          }
        }
      }
      if(!(path in seenScript)) {
        seenScript[path] = true;
        scripts.push(path)
      }
    }
    for(var path in goog.included_) {
      if(!deps.written[path]) {
        visitNode(path)
      }
    }
    for(var i = 0;i < scripts.length;i++) {
      if(scripts[i]) {
        goog.importScript_(goog.basePath + scripts[i])
      }else {
        throw Error("Undefined script input");
      }
    }
  };
  goog.getPathFromDeps_ = function(rule) {
    if(rule in goog.dependencies_.nameToPath) {
      return goog.dependencies_.nameToPath[rule]
    }else {
      return null
    }
  };
  goog.findBasePath_();
  if(!goog.global.CLOSURE_NO_DEPS) {
    goog.importScript_(goog.basePath + "deps.js")
  }
}
goog.typeOf = function(value) {
  var s = typeof value;
  if(s == "object") {
    if(value) {
      if(value instanceof Array) {
        return"array"
      }else {
        if(value instanceof Object) {
          return s
        }
      }
      var className = Object.prototype.toString.call(value);
      if(className == "[object Window]") {
        return"object"
      }
      if(className == "[object Array]" || typeof value.length == "number" && typeof value.splice != "undefined" && typeof value.propertyIsEnumerable != "undefined" && !value.propertyIsEnumerable("splice")) {
        return"array"
      }
      if(className == "[object Function]" || typeof value.call != "undefined" && typeof value.propertyIsEnumerable != "undefined" && !value.propertyIsEnumerable("call")) {
        return"function"
      }
    }else {
      return"null"
    }
  }else {
    if(s == "function" && typeof value.call == "undefined") {
      return"object"
    }
  }
  return s
};
goog.propertyIsEnumerableCustom_ = function(object, propName) {
  if(propName in object) {
    for(var key in object) {
      if(key == propName && Object.prototype.hasOwnProperty.call(object, propName)) {
        return true
      }
    }
  }
  return false
};
goog.propertyIsEnumerable_ = function(object, propName) {
  if(object instanceof Object) {
    return Object.prototype.propertyIsEnumerable.call(object, propName)
  }else {
    return goog.propertyIsEnumerableCustom_(object, propName)
  }
};
goog.isDef = function(val) {
  return val !== undefined
};
goog.isNull = function(val) {
  return val === null
};
goog.isDefAndNotNull = function(val) {
  return val != null
};
goog.isArray = function(val) {
  return goog.typeOf(val) == "array"
};
goog.isArrayLike = function(val) {
  var type = goog.typeOf(val);
  return type == "array" || type == "object" && typeof val.length == "number"
};
goog.isDateLike = function(val) {
  return goog.isObject(val) && typeof val.getFullYear == "function"
};
goog.isString = function(val) {
  return typeof val == "string"
};
goog.isBoolean = function(val) {
  return typeof val == "boolean"
};
goog.isNumber = function(val) {
  return typeof val == "number"
};
goog.isFunction = function(val) {
  return goog.typeOf(val) == "function"
};
goog.isObject = function(val) {
  var type = goog.typeOf(val);
  return type == "object" || type == "array" || type == "function"
};
goog.getUid = function(obj) {
  return obj[goog.UID_PROPERTY_] || (obj[goog.UID_PROPERTY_] = ++goog.uidCounter_)
};
goog.removeUid = function(obj) {
  if("removeAttribute" in obj) {
    obj.removeAttribute(goog.UID_PROPERTY_)
  }
  try {
    delete obj[goog.UID_PROPERTY_]
  }catch(ex) {
  }
};
goog.UID_PROPERTY_ = "closure_uid_" + Math.floor(Math.random() * 2147483648).toString(36);
goog.uidCounter_ = 0;
goog.getHashCode = goog.getUid;
goog.removeHashCode = goog.removeUid;
goog.cloneObject = function(obj) {
  var type = goog.typeOf(obj);
  if(type == "object" || type == "array") {
    if(obj.clone) {
      return obj.clone()
    }
    var clone = type == "array" ? [] : {};
    for(var key in obj) {
      clone[key] = goog.cloneObject(obj[key])
    }
    return clone
  }
  return obj
};
Object.prototype.clone;
goog.bindNative_ = function(fn, selfObj, var_args) {
  return fn.call.apply(fn.bind, arguments)
};
goog.bindJs_ = function(fn, selfObj, var_args) {
  var context = selfObj || goog.global;
  if(arguments.length > 2) {
    var boundArgs = Array.prototype.slice.call(arguments, 2);
    return function() {
      var newArgs = Array.prototype.slice.call(arguments);
      Array.prototype.unshift.apply(newArgs, boundArgs);
      return fn.apply(context, newArgs)
    }
  }else {
    return function() {
      return fn.apply(context, arguments)
    }
  }
};
goog.bind = function(fn, selfObj, var_args) {
  if(Function.prototype.bind && Function.prototype.bind.toString().indexOf("native code") != -1) {
    goog.bind = goog.bindNative_
  }else {
    goog.bind = goog.bindJs_
  }
  return goog.bind.apply(null, arguments)
};
goog.partial = function(fn, var_args) {
  var args = Array.prototype.slice.call(arguments, 1);
  return function() {
    var newArgs = Array.prototype.slice.call(arguments);
    newArgs.unshift.apply(newArgs, args);
    return fn.apply(this, newArgs)
  }
};
goog.mixin = function(target, source) {
  for(var x in source) {
    target[x] = source[x]
  }
};
goog.now = Date.now || function() {
  return+new Date
};
goog.globalEval = function(script) {
  if(goog.global.execScript) {
    goog.global.execScript(script, "JavaScript")
  }else {
    if(goog.global.eval) {
      if(goog.evalWorksForGlobals_ == null) {
        goog.global.eval("var _et_ = 1;");
        if(typeof goog.global["_et_"] != "undefined") {
          delete goog.global["_et_"];
          goog.evalWorksForGlobals_ = true
        }else {
          goog.evalWorksForGlobals_ = false
        }
      }
      if(goog.evalWorksForGlobals_) {
        goog.global.eval(script)
      }else {
        var doc = goog.global.document;
        var scriptElt = doc.createElement("script");
        scriptElt.type = "text/javascript";
        scriptElt.defer = false;
        scriptElt.appendChild(doc.createTextNode(script));
        doc.body.appendChild(scriptElt);
        doc.body.removeChild(scriptElt)
      }
    }else {
      throw Error("goog.globalEval not available");
    }
  }
};
goog.cssNameMapping_;
goog.cssNameMappingStyle_;
goog.getCssName = function(className, opt_modifier) {
  var getMapping = function(cssName) {
    return goog.cssNameMapping_[cssName] || cssName
  };
  var renameByParts = function(cssName) {
    var parts = cssName.split("-");
    var mapped = [];
    for(var i = 0;i < parts.length;i++) {
      mapped.push(getMapping(parts[i]))
    }
    return mapped.join("-")
  };
  var rename;
  if(goog.cssNameMapping_) {
    rename = goog.cssNameMappingStyle_ == "BY_WHOLE" ? getMapping : renameByParts
  }else {
    rename = function(a) {
      return a
    }
  }
  if(opt_modifier) {
    return className + "-" + rename(opt_modifier)
  }else {
    return rename(className)
  }
};
goog.setCssNameMapping = function(mapping, style) {
  goog.cssNameMapping_ = mapping;
  goog.cssNameMappingStyle_ = style
};
goog.getMsg = function(str, opt_values) {
  var values = opt_values || {};
  for(var key in values) {
    var value = ("" + values[key]).replace(/\$/g, "$$$$");
    str = str.replace(new RegExp("\\{\\$" + key + "\\}", "gi"), value)
  }
  return str
};
goog.exportSymbol = function(publicPath, object, opt_objectToExportTo) {
  goog.exportPath_(publicPath, object, opt_objectToExportTo)
};
goog.exportProperty = function(object, publicName, symbol) {
  object[publicName] = symbol
};
goog.inherits = function(childCtor, parentCtor) {
  function tempCtor() {
  }
  tempCtor.prototype = parentCtor.prototype;
  childCtor.superClass_ = parentCtor.prototype;
  childCtor.prototype = new tempCtor;
  childCtor.prototype.constructor = childCtor
};
goog.base = function(me, opt_methodName, var_args) {
  var caller = arguments.callee.caller;
  if(caller.superClass_) {
    return caller.superClass_.constructor.apply(me, Array.prototype.slice.call(arguments, 1))
  }
  var args = Array.prototype.slice.call(arguments, 2);
  var foundCaller = false;
  for(var ctor = me.constructor;ctor;ctor = ctor.superClass_ && ctor.superClass_.constructor) {
    if(ctor.prototype[opt_methodName] === caller) {
      foundCaller = true
    }else {
      if(foundCaller) {
        return ctor.prototype[opt_methodName].apply(me, args)
      }
    }
  }
  if(me[opt_methodName] === caller) {
    return me.constructor.prototype[opt_methodName].apply(me, args)
  }else {
    throw Error("goog.base called from a method of one name " + "to a method of a different name");
  }
};
goog.scope = function(fn) {
  fn.call(goog.global)
};
goog.provide("owg.gg.FlyingText");
var m_ftinternal = 0;
function FlyingText(layer, text, fontcolor) {
  this.text = text;
  this.fontcolor = fontcolor;
  this.scalefactor = 1;
  this.alpha = 1;
  this.layer = layer;
  var that = this;
  var rY = m_ftinternal * 45;
  m_ftinternal += 1;
  if(m_ftinternal > 3) {
    m_ftinternal = 0
  }
  this.shape = new Kinetic.Shape(function() {
    var ctx = this.getContext();
    ctx.beginPath();
    ctx.font = "28pt LuckiestGuy";
    ctx.fillStyle = that.fontcolor;
    var tX = window.innerWidth / 2 / that.scalefactor;
    var tY = (window.innerHeight / 2 - 200 + rY) / that.scalefactor;
    ctx.textAlign = "center";
    ctx.fillText(that.text, tX, tY);
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#000";
    ctx.strokeText(that.text, tX, tY);
    this.setScale(that.scalefactor, that.scalefactor);
    that.scalefactor = that.scalefactor + 0.05;
    this.setAlpha(that.alpha);
    that.alpha = that.alpha - 0.05;
    if(that.alpha <= 0) {
      that.layer.remove(that.shape)
    }
  });
  layer.add(this.shape)
}
goog.exportSymbol("FlyingText", FlyingText);
function FadeOut(callback) {
  setTimeout(function() {
    m_ui.setAlpha(m_ui.getAlpha() - 0.1);
    if(m_ui.getAlpha() > 0) {
      FadeOut(callback)
    }else {
      m_ui.setAlpha(0);
      callback()
    }
  }, 1)
}
goog.exportSymbol("FadeOut", FadeOut);
function FadeIn(callback) {
  setTimeout(function() {
    m_ui.setAlpha(m_ui.getAlpha() + 0.1);
    if(m_ui.getAlpha() < 1) {
      FadeIn(callback)
    }else {
      m_ui.setAlpha(1);
      callback()
    }
  }, 1)
}
goog.exportSymbol("FadeIn", FadeIn);
goog.provide("owg.gg.Player");
goog.require("owg.gg.FlyingText");
function Player(name) {
  this.playerName = name;
  this.playerScore = 0
}
Player.prototype.ScorePoints = function(amount, description) {
  var text = new FlyingText(m_static, "+" + amount + " " + m_locale["points"] + " " + description, "#00FF00");
  this.playerScore += amount
};
goog.exportSymbol("Player", Player);
goog.exportProperty(Player.prototype, "ScorePoints", Player.prototype.ScorePoints);
goog.provide("owg.gg.Button01");
goog.provide("owg.gg.MessageDialog");
goog.provide("owg.gg.ScreenText");
goog.provide("owg.gg.Pin");
goog.provide("owg.gg.Clock");
goog.provide("owg.gg.ScoreCount");
function Button01(layer, name, x, y, width, height, caption, fontsize) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.state = 0;
  this.caption = caption;
  this.fontsize = fontsize;
  this.name = name;
  this.enabled = true;
  this.layer = layer;
  this.onClickEvent = function() {
  };
  this.onMouseOverEvent = function() {
  };
  this.onMouseOutEvent = function() {
  };
  this.onMouseDownEvent = function() {
  };
  this.onMouseUpEvent = function() {
  };
  var that = this;
  this.shape = new Kinetic.Shape(function() {
    var ctx = this.getContext();
    var clickOffset = 0;
    if(that.enabled == false) {
      ctx.drawImage(m_images["btn_01_d"], x, y, width, height)
    }else {
      if(that.state == 0) {
        ctx.drawImage(m_images["btn_01"], x, y, width, height)
      }else {
        if(that.state == 1) {
          ctx.drawImage(m_images["btn_01_h"], x, y, width, height)
        }else {
          if(that.state == 2) {
            ctx.drawImage(m_images["btn_01_c"], x, y, width, height);
            clickOffset = 2
          }else {
            if(that.state == 3) {
              ctx.drawImage(m_images["btn_01_t"], x, y, width, height)
            }else {
              if(that.state == 4) {
                ctx.drawImage(m_images["btn_01_f"], x, y, width, height)
              }else {
                if(that.state == 5) {
                  ctx.drawImage(m_images["btn_01_o"], x, y, width, height)
                }
              }
            }
          }
        }
      }
    }
    ctx.beginPath();
    ctx.rect(x, y, width, height);
    ctx.closePath();
    ctx.font = fontsize + "pt TitanOne";
    ctx.fillStyle = "#FFF";
    var textWidth = ctx.measureText(that.caption).width;
    var textHeight = ctx.measureText(that.caption).height;
    var tX = x + clickOffset;
    var tY = y + 3 * (height / 5) + clickOffset;
    if(textWidth <= width) {
      tX = x + (width - textWidth) / 2
    }
    ctx.fillText(that.caption, tX, tY);
    ctx.lineWidth = 1;
    ctx.strokeStyle = "#000";
    ctx.strokeText(that.caption, tX, tY)
  });
  this.shape.on("mouseout", function() {
    that.onMouseOutEvent();
    if(that.state < 3) {
      that.state = 0
    }
  });
  this.shape.on("mouseover", function() {
    that.onMouseOverEvent();
    if(that.state < 3) {
      that.state = 1
    }
  });
  this.shape.on("mousedown", function() {
    that.onMouseDownEvent();
    if(that.state < 3) {
      that.state = 2
    }
  });
  this.shape.on("mouseup", function() {
    that.onMouseUpEvent();
    if(that.state < 3) {
      that.state = 1;
      that.onClickEvent()
    }
  });
  this.shape.name = name;
  layer.add(this.shape)
}
Button01.prototype.SetEnabled = function(enabled) {
  this.enabled = enabled
};
Button01.prototype.SetState = function(state) {
  this.state = state
};
Button01.prototype.Destroy = function() {
  this.layer.remove(this.shape)
};
goog.exportSymbol("Button01", Button01);
goog.exportProperty(Button01.prototype, "SetEnabled", Button01.prototype.SetEnabled);
goog.exportProperty(Button01.prototype, "SetState", Button01.prototype.SetState);
goog.exportProperty(Button01.prototype, "Destroy", Button01.prototype.Destroy);
function Clock(layer, x, y, seconds) {
  this.layer = layer;
  this.x = x;
  this.y = y;
  this.seconds = seconds;
  this.visible = true;
  this.obsolete = false;
  var unit = 2 / 60;
  var that = this;
  this.running = false;
  this.onTimeoutEvent = function() {
  };
  this.shape = new Kinetic.Shape(function() {
    if(that.visible == true) {
      var ctx = this.getContext();
      var pos = unit * that.seconds - 0.5;
      ctx.drawImage(m_images["clock"], x, y, 220, 260);
      ctx.beginPath();
      ctx.arc(x + 110, y + 153, 84, pos * Math.PI, 1.5 * Math.PI, false);
      ctx.lineTo(x + 110, y + 153);
      ctx.closePath();
      var pattern = ctx.createPattern(m_images["dial"], "no-repeat");
      ctx.fillStyle = pattern;
      ctx.translate(x + 25, y + 65);
      ctx.fill();
      if(that.seconds > 10) {
        ctx.fillStyle = "#FFF"
      }else {
        ctx.fillStyle = "#F00"
      }
      ctx.font = "40pt TitanOne";
      ctx.textAlign = "center";
      var secs = "" + that.seconds;
      ctx.fillText(secs, 85, 110);
      ctx.lineWidth = 3;
      ctx.strokeStyle = "#000";
      ctx.strokeText(secs, 85, 110)
    }
  });
  layer.add(this.shape)
}
Clock.prototype.Start = function() {
  this.running = true;
  this.Countdown()
};
Clock.prototype.Pause = function() {
  this.running = false
};
Clock.prototype.Resume = function() {
  this.running = true
};
Clock.prototype.Countdown = function() {
  var that = this;
  setTimeout(function() {
    if(that.obsolete == true) {
    }else {
      if(that.seconds > 0) {
        that.Countdown()
      }else {
        that.running = false;
        that.onTimeoutEvent()
      }
    }
  }, 1E3);
  if(this.running) {
    this.seconds = this.seconds - 1
  }
};
Clock.prototype.Destroy = function() {
  this.obsolete = true;
  this.OnDestroy()
};
Clock.prototype.OnDestroy = function() {
  this.layer.remove(this.shape)
};
Clock.prototype.SetVisible = function(visible) {
  this.visible = visible
};
Clock.prototype.GetSeconds = function() {
  return this.seconds
};
goog.exportSymbol("Clock", Clock);
goog.exportProperty(Clock.prototype, "Start", Clock.prototype.Start);
goog.exportProperty(Clock.prototype, "Pause", Clock.prototype.Pause);
goog.exportProperty(Clock.prototype, "Resume", Clock.prototype.Resume);
goog.exportProperty(Clock.prototype, "Countdown", Clock.prototype.Countdown);
goog.exportProperty(Clock.prototype, "Destroy", Clock.prototype.Destroy);
goog.exportProperty(Clock.prototype, "OnDestroy", Clock.prototype.OnDestroy);
goog.exportProperty(Clock.prototype, "SetVisible", Clock.prototype.SetVisible);
goog.exportProperty(Clock.prototype, "GetSeconds", Clock.prototype.GetSeconds);
function ScreenText(layer, text, x, y, fontsize, align) {
  this.text = text;
  this.x = x;
  this.y = y;
  this.fontsize = fontsize;
  this.align = align;
  this.layer = layer;
  var that = this;
  this.shape = new Kinetic.Shape(function() {
    var ctx = this.getContext();
    ctx.textAlign = that.align;
    ctx.fillStyle = "#FFF";
    ctx.font = that.fontsize + "pt TitanOne";
    ctx.textAlign = that.align;
    ctx.fillText(that.text, that.x, that.y);
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#000";
    ctx.strokeText(that.text, that.x, that.y)
  });
  layer.add(this.shape)
}
ScreenText.prototype.Destroy = function() {
  this.layer.remove(this.shape)
};
goog.exportSymbol("ScreenText", ScreenText);
goog.exportProperty(ScreenText.prototype, "Destroy", ScreenText.prototype.Destroy);
function MessageDialog(layer, message, width, height) {
  this.message = message;
  this.layer = layer;
  this.okayButton = null;
  var that = this;
  this.Callback = function() {
  };
  this.OnOkay = function() {
    that.Destroy();
    that.Callback()
  };
  this.shape = new Kinetic.Shape(function() {
    var ctx = this.getContext();
    ctx.beginPath();
    ctx.rect(window.innerWidth / 2 - width / 2, window.innerHeight / 2 - height / 2, width, height);
    var grad = ctx.createLinearGradient(window.innerWidth / 2, window.innerHeight / 2 - height / 2, window.innerWidth / 2, window.innerHeight / 2 + height / 2);
    grad.addColorStop(0, "#555");
    grad.addColorStop(1, "#CCC");
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#FFF";
    ctx.stroke();
    ctx.textAlign = "center";
    ctx.fillStyle = "#FFF";
    ctx.font = "18pt TitanOne";
    ctx.textAlign = "center";
    ctx.fillText(that.message, window.innerWidth / 2, window.innerHeight / 2 - height / 2 + 80);
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#000";
    ctx.strokeText(that.message, window.innerWidth / 2, window.innerHeight / 2 - height / 2 + 80)
  });
  layer.add(this.shape);
  this.okayButton = new Button01(m_ui, "dialog", window.innerWidth / 2 - 150, window.innerHeight / 2 + height / 2 - 100, 300, 69, "OK", 15);
  this.okayButton.onClickEvent = this.OnOkay
}
MessageDialog.prototype.RegisterCallback = function(callback) {
  this.Callback = callback
};
MessageDialog.prototype.Destroy = function() {
  this.layer.remove(this.shape);
  this.layer.remove(this.okayButton.shape)
};
goog.exportSymbol("MessageDialog", MessageDialog);
goog.exportProperty(MessageDialog.prototype, "RegisterCallback", MessageDialog.prototype.RegisterCallback);
goog.exportProperty(MessageDialog.prototype, "Destroy", MessageDialog.prototype.Destroy);
function ScoreCount(layer) {
  this.layer = layer;
  var that = this;
  this.shape = new Kinetic.Shape(function() {
    var ctx = this.getContext();
    ctx.beginPath();
    ctx.rect(10, 10, 225, 50);
    var grad = ctx.createLinearGradient(10, 10, 10, 50);
    grad.addColorStop(0, "#555");
    grad.addColorStop(1, "#CCC");
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#FFF";
    ctx.stroke();
    ctx.textAlign = "center";
    ctx.fillStyle = "#FFF";
    ctx.font = "16pt TitanOne";
    ctx.textAlign = "left";
    ctx.fillText(m_locale["score"] + ": " + m_player.playerScore, 25, 45);
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#000";
    ctx.strokeText(m_locale["score"] + ": " + m_player.playerScore, 25, 45)
  });
  layer.add(this.shape)
}
ScoreCount.prototype.Destroy = function() {
  this.layer.remove(this.shape)
};
goog.exportSymbol("ScoreCount", ScoreCount);
goog.exportProperty(ScoreCount.prototype, "Destroy", ScoreCount.prototype.Destroy);
function Pin(layer, image, x, y) {
  this.layer = layer;
  var that = this;
  this.x = x;
  this.y = y;
  this.visible = true;
  this.shape = new Kinetic.Shape(function() {
    if(that.visible == true) {
      var ctx = this.getContext();
      ctx.beginPath();
      ctx.drawImage(image, that.x - 74, that.y - 132, 86, 144)
    }
  });
  layer.add(this.shape)
}
Pin.prototype.SetPos = function(x, y) {
  this.x = x;
  this.y = y
};
Pin.prototype.SetVisible = function(visible) {
  this.visible = visible
};
Pin.prototype.Destroy = function() {
  this.layer.remove(this.shape)
};
goog.exportSymbol("Pin", Pin);
goog.exportProperty(Pin.prototype, "SetPos", Pin.prototype.SetPos);
goog.exportProperty(Pin.prototype, "SetVisible", Pin.prototype.SetVisible);
goog.exportProperty(Pin.prototype, "Destroy", Pin.prototype.Destroy);
goog.provide("owg.gg.Challenge");
function Challenge(type) {
  this.type = type;
  this.baseScore = 0;
  this.Activate = function() {
  };
  this.Destroy = function() {
  };
  this.OnDestroy = function() {
  }
}
goog.exportSymbol("Challenge", Challenge);
goog.provide("owg.gg.LandmarkChallenge");
goog.require("owg.gg.Challenge");
goog.require("owg.gg.Button01");
goog.require("owg.gg.FlyingText");
goog.require("owg.gg.ScreenText");
goog.require("owg.gg.Clock");
function LandmarkChallenge(baseScore, options, correctOption, views, title) {
  this.correctOption = correctOption;
  this.options = options;
  this.baseScore = baseScore;
  this.views = views;
  this.flystate = 1;
  this.text = title;
  this.stop = false;
  this.clock = null;
  this.buttonArray = [];
  this.screenText = null;
  var that = this;
  this.onOption1 = function() {
    that.PickOption(1, that.clock.GetSeconds())
  };
  this.onOption2 = function() {
    that.PickOption(2, that.clock.GetSeconds())
  };
  this.onOption3 = function() {
    that.PickOption(3, that.clock.GetSeconds())
  };
  this.onOption4 = function() {
    that.PickOption(4, that.clock.GetSeconds())
  };
  this.FlightCallback = function() {
    if(that.stop != true && that.flystate - 1 < that.views.length) {
      var oView = that.views[that.flystate];
      var scene = ogGetScene(m_context);
      that.flystate += 1;
      ogFlyTo(scene, oView["longitude"], oView["latitude"], oView["elevation"], oView["yaw"], oView["pitch"], oView["roll"])
    }
  }
}
LandmarkChallenge.prototype = new Challenge(0);
LandmarkChallenge.prototype.constructor = LandmarkChallenge;
LandmarkChallenge.prototype.Activate = function() {
  var btn1 = null;
  var btn2 = null;
  var btn3 = null;
  var btn4 = null;
  btn1 = new Button01(m_ui, "btn1", m_centerX - 310, window.innerHeight - 239, 300, 69, this.options[0], 15);
  btn1.onClickEvent = this.onOption1;
  btn2 = new Button01(m_ui, "btn2", m_centerX + 10, window.innerHeight - 239, 300, 69, this.options[1], 15);
  btn2.onClickEvent = this.onOption2;
  btn3 = new Button01(m_ui, "btn3", m_centerX - 310, window.innerHeight - 150, 300, 69, this.options[2], 15);
  btn3.onClickEvent = this.onOption3;
  btn4 = new Button01(m_ui, "btn4", m_centerX + 10, window.innerHeight - 150, 300, 69, this.options[3], 15);
  btn4.onClickEvent = this.onOption4;
  this.buttonArray.push(btn1);
  this.buttonArray.push(btn2);
  this.buttonArray.push(btn3);
  this.buttonArray.push(btn4);
  this.screenText = new ScreenText(m_ui, this.text, m_centerX, window.innerHeight - 255, 20, "center");
  this.clock = new Clock(m_ui, 50, 75, 60);
  this.clock.Start();
  FadeIn(function() {
  });
  var flightduration = Math.floor(40 / (this.views.length - 1)) * 1E3;
  var scene = ogGetScene(m_context);
  ogSetFlightDuration(scene, flightduration);
  var camId = ogGetActiveCamera(scene);
  ogSetPosition(camId, this.views[0].longitude, this.views[0].latitude, this.views[0].elevation);
  ogSetOrientation(camId, this.views[0]["yaw"], this.views[0]["pitch"], this.views[0]["roll"]);
  ogSetInPositionFunction(m_context, this.FlightCallback);
  this.FlightCallback()
};
LandmarkChallenge.prototype.Destroy = function() {
  this.clock.Pause();
  this.stop = true;
  var scene = ogGetScene(m_context);
  ogStopFlyTo(scene);
  this.OnDestroy()
};
LandmarkChallenge.prototype.OnDestroy = function() {
  this.clock.Destroy();
  var that = this;
  FadeOut(function() {
    that.buttonArray[0].Destroy();
    that.buttonArray[1].Destroy();
    that.buttonArray[2].Destroy();
    that.buttonArray[3].Destroy();
    that.screenText.Destroy();
    if(m_globeGame) {
      m_globeGame.NextChallenge()
    }
  })
};
LandmarkChallenge.prototype.PickOption = function(option, timeleft) {
  this.buttonArray[0].SetEnabled(false);
  this.buttonArray[1].SetEnabled(false);
  this.buttonArray[2].SetEnabled(false);
  this.buttonArray[3].SetEnabled(false);
  var that = this;
  if(this.correctOption == option) {
    m_player.ScorePoints(this.baseScore, "");
    m_player.ScorePoints(Math.floor(timeleft / 5), m_locale["timebonus"]);
    if(timeleft > 50) {
      m_player.ScorePoints(20, m_locale["speedbonus"])
    }
    this.buttonArray[option - 1].SetEnabled(true);
    this.buttonArray[option - 1].SetState(3);
    setTimeout(function() {
      that.Destroy()
    }, 2E3)
  }else {
    this.buttonArray[option - 1].SetEnabled(true);
    this.buttonArray[this.correctOption - 1].SetEnabled(true);
    this.buttonArray[option - 1].SetState(4);
    this.buttonArray[this.correctOption - 1].SetState(5);
    setTimeout(function() {
      that.Destroy()
    }, 2E3)
  }
};
goog.exportSymbol("LandmarkChallenge", LandmarkChallenge);
goog.exportProperty(LandmarkChallenge.prototype, "Activate", LandmarkChallenge.prototype.Activate);
goog.exportProperty(LandmarkChallenge.prototype, "Destroy", LandmarkChallenge.prototype.Destroy);
goog.exportProperty(LandmarkChallenge.prototype, "OnDestroy", LandmarkChallenge.prototype.OnDestroy);
goog.exportProperty(LandmarkChallenge.prototype, "PickOption", LandmarkChallenge.prototype.PickOption);
goog.provide("owg.gg.PickingChallenge");
goog.require("owg.gg.Challenge");
goog.require("owg.gg.Button01");
goog.require("owg.gg.FlyingText");
goog.require("owg.gg.ScreenText");
goog.require("owg.gg.Clock");
goog.require("owg.gg.Pin");
function PickingChallenge(baseScore, title, pos) {
  this.screenText = null;
  this.baseScore = baseScore;
  this.text = title;
  var that = this;
  this.flystate = false;
  this.zoomState = false;
  this.pickPos = [];
  this.solutionPos = pos;
  this.posPin = null;
  this.resultPin = null;
  this.line = null;
  this.distancText = null;
  this.okayBtn = null;
  this.overlay = null;
  this.mouseLock = false;
  this.clock = null;
  this.OnOkay = function() {
    var scene = ogGetScene(m_context);
    var cartesian = ogToCartesian(scene, that.solutionPos[0], that.solutionPos[1], that.solutionPos[2]);
    var screenPos = ogWorldToWindow(scene, cartesian[0], cartesian[1], cartesian[2]);
    var distance = ogCalcDistanceWGS84(that.solutionPos[0], that.solutionPos[1], that.pickPos[1], that.pickPos[2]);
    distance = Math.round(distance / 1E3 * Math.pow(10, 1)) / Math.pow(10, 1);
    that.resultPin = new Pin(m_ui, m_images["pin_green"], screenPos[0], screenPos[1]);
    var line = new Kinetic.Shape(function() {
      var ctx = this.getContext();
      ctx.moveTo(screenPos[0], screenPos[1]);
      ctx.lineTo(that.posPin.x, that.posPin.y);
      ctx.lineWidth = 3;
      ctx.strokeStyle = "#DD6600";
      ctx.stroke();
      ctx.textAlign = "center";
      ctx.fillStyle = "#FF0";
      ctx.font = "16pt TitanOne";
      ctx.textAlign = "left";
      ctx.fillText(distance + "km", screenPos[0], screenPos[1]);
      ctx.lineWidth = 2;
      ctx.strokeStyle = "#000";
      ctx.strokeText(distance + "km", screenPos[0], screenPos[1])
    });
    m_ui.add(line);
    m_player.ScorePoints(Math.floor(that.baseScore / distance), m_locale["estimation"]);
    m_player.ScorePoints(Math.floor(that.clock.seconds / 5), m_locale["timebonus"]);
    if(that.clock.seconds > 50) {
      m_player.ScorePoints(20, m_locale["speedbonus"])
    }
    setTimeout(function() {
      m_ui.remove(line);
      that.Destroy()
    }, 2500)
  };
  this.MouseOverOkBtn = function() {
    that.mouseLock = true
  };
  this.MouseOutOkBtn = function() {
    that.mouseLock = false
  };
  this.OnMouseDown = function() {
    if(that.mouseLock == false) {
      var pos = m_stage.getMousePosition();
      var scene = ogGetScene(m_context);
      if(that.posPin) {
        that.posPin.SetPos(pos.x, pos.y)
      }
      if(that.flystate == true) {
        ogStopFlyTo(scene)
      }
      var ori = ogGetOrientation(scene);
      var result = ogPickGlobe(scene, pos.x, pos.y);
      that.ZoomIn(result, ori);
      if(that.posPin == null) {
        that.posPin = new Pin(m_ui, m_images["pin_blue"], pos.x, pos.y)
      }
      that.zoomState = true
    }
  };
  this.OnMouseUp = function() {
    if(that.mouseLock == false) {
      var scene = ogGetScene(m_context);
      that.zoomState = false;
      var pos = m_stage.getMousePosition();
      var mx = pos.x - 10;
      var my = pos.y - 10;
      that.pickPos = ogPickGlobe(scene, pos.x, pos.y);
      that.posPin.SetVisible(false);
      if(that.flystate == true) {
        ogStopFlyTo(scene)
      }
      that.ZoomOut()
    }
  };
  this.OnMouseMove = function() {
    if(that.zoomState == true) {
      var pos = m_stage.getMousePosition();
      that.posPin.SetPos(pos.x, pos.y)
    }
  };
  this.FlightCallback = function() {
    that.flystate = false;
    var scene = ogGetScene(m_context);
    var pos = ogWorldToWindow(scene, that.pickPos[4], that.pickPos[5], that.pickPos[6]);
    that.posPin.SetVisible(true);
    that.posPin.SetPos(pos[0], pos[1])
  }
}
PickingChallenge.prototype = new Challenge(1);
PickingChallenge.prototype.constructor = PickingChallenge;
PickingChallenge.prototype.Activate = function() {
  this.screenText = new ScreenText(m_ui, this.text, m_centerX, window.innerHeight - 255, 20, "center");
  this.overlay = new Kinetic.Rect({x:0, y:0, width:window.innerWidth, height:window.innerHeight});
  this.overlay.on("mousedown", this.OnMouseDown);
  this.overlay.on("mouseup", this.OnMouseUp);
  this.overlay.on("mousemove", this.OnMouseMove);
  m_ui.add(this.overlay);
  this.okayBtn = new Button01(m_ui, "okbtn1", m_centerX - 150, window.innerHeight - 180, 300, 69, "OK", 15);
  this.okayBtn.onClickEvent = this.OnOkay;
  this.okayBtn.onMouseOverEvent = this.MouseOverOkBtn;
  this.okayBtn.onMouseOutEvent = this.MouseOutOkBtn;
  this.clock = new Clock(m_ui, 50, 75, 60);
  this.clock.Start();
  FadeIn(function() {
  });
  var scene = ogGetScene(m_context);
  var camId = ogGetActiveCamera(scene);
  ogSetPosition(camId, 8.225578, 46.8248707, 28E4);
  ogSetOrientation(camId, 0, -90, 0);
  ogSetInPositionFunction(m_context, this.FlightCallback);
  this.layerId = ogAddImageLayer(m_globe, {url:["http://10.42.2.37"], layer:"ch_boundaries", service:"owg"})
};
PickingChallenge.prototype.Destroy = function() {
  this.clock.Pause();
  var scene = ogGetScene(m_context);
  this.OnDestroy()
};
PickingChallenge.prototype.OnDestroy = function() {
  this.clock.Destroy();
  var that = this;
  FadeOut(function() {
    that.screenText.Destroy();
    that.resultPin.Destroy();
    that.posPin.Destroy();
    that.okayBtn.Destroy();
    m_ui.remove(that.overlay);
    ogRemoveImageLayer(that.layerId);
    if(m_globeGame) {
      m_globeGame.NextChallenge()
    }
  })
};
PickingChallenge.prototype.ZoomIn = function(pos, ori) {
  this.flystate = true;
  var scene = ogGetScene(m_context);
  ogSetFlightDuration(scene, 1E3);
  ogFlyToLookAtPosition(scene, pos[1], pos[2], pos[3], 2E4, 0, -90, 0)
};
PickingChallenge.prototype.ZoomOut = function(ori) {
  this.flystate = true;
  var scene = ogGetScene(m_context);
  ogSetFlightDuration(scene, 800);
  ogFlyTo(scene, 8.225578, 46.8248707, 28E4, 0, -90, 0)
};
goog.exportSymbol("PickingChallenge", PickingChallenge);
goog.exportProperty(PickingChallenge.prototype, "Activate", PickingChallenge.prototype.Activate);
goog.exportProperty(PickingChallenge.prototype, "Destroy", PickingChallenge.prototype.Destroy);
goog.exportProperty(PickingChallenge.prototype, "OnDestroy", PickingChallenge.prototype.OnDestroy);
goog.exportProperty(PickingChallenge.prototype, "ZoomIn", PickingChallenge.prototype.ZoomIn);
goog.exportProperty(PickingChallenge.prototype, "ZoomOut", PickingChallenge.prototype.ZoomOut);
goog.provide("owg.gg.GameData");
goog.require("owg.gg.Challenge");
goog.require("owg.gg.LandmarkChallenge");
goog.require("owg.gg.PickingChallenge");
function GameData() {
  this.questions = [];
  var that = this;
  jQuery.getJSON("../data/challenges_" + m_lang + ".json", function(data) {
    var items = [];
    jQuery.each(data, function(key, val) {
      if(val.Type == 0) {
        var baseScore = val.BaseScore;
        var options = val.Options;
        var correctOption = val.CorrectOption;
        var views = val.Views;
        var title = val.Title;
        var landmarkchallenge = new LandmarkChallenge(baseScore, options, correctOption, views, title);
        items.push(landmarkchallenge)
      }else {
        if(val.Type == 1) {
          var lng = val.Longitude;
          var lat = val.Latitude;
          var elv = val.Elevation;
          var baseScore = val.BaseScore;
          var title = val.Title;
          var pos = [lng, lat, elv];
          var pickingchallenge = new PickingChallenge(baseScore, title, pos);
          items.push(pickingchallenge)
        }
      }
    });
    that.questions = items
  })
}
GameData.prototype.PickChallenge = function() {
  var index = Math.floor(Math.random() * this.questions.length);
  var challenge = this.questions[index];
  this.questions.splice(index, 1);
  return challenge
};
goog.exportSymbol("GameData", GameData);
goog.exportProperty(GameData.prototype, "PickChallenge", GameData.prototype.PickChallenge);
goog.provide("owg.gg.GlobeGame");
goog.require("owg.gg.Button01");
goog.require("owg.gg.MessageDialog");
goog.require("owg.gg.ScreenText");
goog.require("owg.gg.Clock");
goog.require("owg.gg.ScoreCount");
goog.require("owg.gg.Pin");
goog.require("owg.gg.FlyingText");
goog.require("owg.gg.Player");
goog.require("owg.gg.Challenge");
goog.require("owg.gg.LandmarkChallenge");
goog.require("owg.gg.PickingChallenge");
goog.require("owg.gg.GameData");
var m_images = {};
var m_loadedImages = 0;
var m_numImages = 0;
var m_context = ogCreateContextFromCanvas("canvas", true);
var m_globe = ogCreateGlobe(m_context);
var m_stage = null;
var m_ui = new Kinetic.Layer;
var m_static = new Kinetic.Layer;
var m_centerX = window.innerWidth / 2;
var m_centerY = window.innerHeight / 2;
var m_lang = "de";
var m_locale = [];
var m_player = null;
var m_score = null;
var m_gameData = null;
var m_globeGame = null;
function GlobeGame() {
  this.state = 0;
  this.qCount = 0;
  this.currentChallenge = null;
  this.callbacks = [];
  var that = this
}
GlobeGame.prototype.OnLoaded = function() {
  this.state = 1;
  var name = prompt(m_locale["entername"], "Name");
  m_player = new Player(name);
  m_score = new ScoreCount(m_ui);
  this.currentChallenge = m_gameData.PickChallenge();
  this.InitQuiz()
};
GlobeGame.prototype.CycleCallback = function() {
  for(var i = 0;i < this.callbacks.length;i++) {
    this.callbacks[i][1]()
  }
};
GlobeGame.prototype.InitQuiz = function() {
  this.currentChallenge.Activate();
  this.state = 2
};
GlobeGame.prototype.NextChallenge = function() {
  if(m_gameData.questions.length > 0) {
    this.currentChallenge = m_gameData.PickChallenge();
    this.InitQuiz()
  }
};
GlobeGame.prototype.RegisterCycleCallback = function(id, callback) {
  this.callbacks.push([id, callback])
};
GlobeGame.prototype.UnregisterCycleCallback = function(id) {
  for(var i = 0;i < this.callbacks.length;i++) {
    if(this.callbacks[i][0] == id) {
      this.callbacks.splice(i, 1)
    }
  }
};
GlobeGame.prototype.LoadImages = function(sources, callback) {
  var that = this;
  for(var src in sources) {
    m_numImages++
  }
  for(var src in sources) {
    m_images[src] = new Image;
    m_images[src].onload = function() {
      if(++m_loadedImages >= m_numImages) {
        callback()
      }
    };
    m_images[src].src = sources[src]
  }
};
GlobeGame.prototype.LoadLanguage = function(callback) {
  jQuery.getJSON("../data/lang_" + m_lang + ".json", function(data) {
    m_locale = data;
    callback()
  })
};
GlobeGame.prototype.Init = function(renderCallback, canvasDiv) {
  var that = this;
  m_stage = new Kinetic.Stage(canvasDiv, window.innerWidth, window.innerHeight);
  m_gameData = new GameData;
  var sources = {btn_01:"../art/btn_01.png", btn_01_c:"../art/btn_01_c.png", btn_01_h:"../art/btn_01_h.png", btn_01_d:"../art/btn_01_d.png", btn_01_f:"../art/btn_01_f.png", btn_01_t:"../art/btn_01_t.png", btn_01_o:"../art/btn_01_o.png", clock:"../art/clock.png", dial:"../art/dial.png", pin_blue:"../art/pin_blue.png", pin_red:"../art/pin_red.png", pin_green:"../art/pin_green.png", pin_yellow:"../art/pin_yellow.png"};
  this.LoadImages(sources, null);
  this.LoadLanguage(function() {
    var startMessage = new MessageDialog(m_ui, m_locale.start, 500, 250);
    startMessage.RegisterCallback(function() {
      m_ui.setAlpha(0);
      that.OnLoaded()
    })
  });
  ogAddImageLayer(m_globe, {url:["http://www.openwebglobe.org/data/img"], layer:"World500", service:"i3d"});
  ogAddImageLayer(m_globe, {url:["http://10.42.2.37"], layer:"swissimage", service:"owg"});
  ogAddElevationLayer(m_globe, {url:["http://10.42.2.37"], layer:"DHM25", service:"owg"});
  ogSetRenderFunction(m_context, this.OnOGRender);
  ogSetResizeFunction(m_context, this.OnOGResize);
  m_stage.add(m_static);
  m_stage.add(m_ui);
  m_stage.onFrame(function(frame) {
    that.OnCanvasRender(frame);
    renderCallback(frame)
  });
  m_stage.start()
};
GlobeGame.prototype.OnCanvasRender = function(frame) {
  m_stage.draw();
  this.CycleCallback()
};
GlobeGame.prototype.OnOGRender = function(context) {
};
GlobeGame.prototype.OnOGResize = function(context) {
  m_stage.setSize(window.innerWidth, window.innerHeight);
  m_centerX = window.innerWidth / 2;
  m_centerY = window.innerHeight / 2
};
function InitGlobeGame(renderCallback, canvasDiv) {
  m_globeGame = new GlobeGame;
  m_globeGame.Init(renderCallback, canvasDiv)
}
goog.exportSymbol("GlobeGame", GlobeGame);
goog.exportProperty(GlobeGame.prototype, "OnLoaded", GlobeGame.prototype.OnLoaded);
goog.exportProperty(GlobeGame.prototype, "CycleCallback", GlobeGame.prototype.CycleCallback);
goog.exportProperty(GlobeGame.prototype, "InitQuiz", GlobeGame.prototype.InitQuiz);
goog.exportProperty(GlobeGame.prototype, "NextChallenge", GlobeGame.prototype.NextChallenge);
goog.exportProperty(GlobeGame.prototype, "RegisterCycleCallback", GlobeGame.prototype.RegisterCycleCallback);
goog.exportProperty(GlobeGame.prototype, "UnregisterCycleCallback", GlobeGame.prototype.UnregisterCycleCallback);
goog.exportProperty(GlobeGame.prototype, "LoadImages", GlobeGame.prototype.LoadImages);
goog.exportProperty(GlobeGame.prototype, "LoadLanguage", GlobeGame.prototype.LoadLanguage);
goog.exportProperty(GlobeGame.prototype, "Init", GlobeGame.prototype.Init);
goog.exportProperty(GlobeGame.prototype, "OnOGResize", GlobeGame.prototype.OnOGResize);
goog.exportProperty(GlobeGame.prototype, "OnOGRender", GlobeGame.prototype.OnOGRender);
goog.exportProperty(GlobeGame.prototype, "OnCanvasRender", GlobeGame.prototype.OnCanvasRender);
goog.exportSymbol("InitGlobeGame", InitGlobeGame);

