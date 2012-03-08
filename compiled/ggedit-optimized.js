var COMPILED = !0, goog = goog || {};
goog.global = this;
goog.DEBUG = !0;
goog.LOCALE = "en";
goog.evalWorksForGlobals_ = null;
goog.provide = function(a) {
  if(!COMPILED) {
    if(goog.getObjectByName(a) && !goog.implicitNamespaces_[a]) {
      throw Error('Namespace "' + a + '" already declared.');
    }
    for(var b = a;b = b.substring(0, b.lastIndexOf("."));) {
      goog.implicitNamespaces_[b] = !0
    }
  }
  goog.exportPath_(a)
};
goog.setTestOnly = function(a) {
  if(COMPILED && !goog.DEBUG) {
    throw a = a || "", Error("Importing test-only code into non-debug environment" + a ? ": " + a : ".");
  }
};
if(!COMPILED) {
  goog.implicitNamespaces_ = {}
}
goog.exportPath_ = function(a, b, c) {
  a = a.split(".");
  c = c || goog.global;
  !(a[0] in c) && c.execScript && c.execScript("var " + a[0]);
  for(var d;a.length && (d = a.shift());) {
    !a.length && goog.isDef(b) ? c[d] = b : c = c[d] ? c[d] : c[d] = {}
  }
};
goog.getObjectByName = function(a, b) {
  for(var c = a.split("."), d = b || goog.global, e;e = c.shift();) {
    if(goog.isDefAndNotNull(d[e])) {
      d = d[e]
    }else {
      return null
    }
  }
  return d
};
goog.globalize = function(a, b) {
  var c = b || goog.global, d;
  for(d in a) {
    c[d] = a[d]
  }
};
goog.addDependency = function(a, b, c) {
  if(!COMPILED) {
    for(var d, a = a.replace(/\\/g, "/"), e = goog.dependencies_, f = 0;d = b[f];f++) {
      e.nameToPath[d] = a, a in e.pathToNames || (e.pathToNames[a] = {}), e.pathToNames[a][d] = !0
    }
    for(d = 0;b = c[d];d++) {
      a in e.requires || (e.requires[a] = {}), e.requires[a][b] = !0
    }
  }
};
goog.require = function(a) {
  if(!COMPILED && !goog.getObjectByName(a)) {
    var b = goog.getPathFromDeps_(a);
    if(b) {
      goog.included_[b] = !0, goog.writeScripts_()
    }else {
      throw a = "goog.require could not find: " + a, goog.global.console && goog.global.console.error(a), Error(a);
    }
  }
};
goog.basePath = "";
goog.nullFunction = function() {
};
goog.identityFunction = function(a) {
  return a
};
goog.abstractMethod = function() {
  throw Error("unimplemented abstract method");
};
goog.addSingletonGetter = function(a) {
  a.getInstance = function() {
    return a.instance_ || (a.instance_ = new a)
  }
};
if(!COMPILED) {
  goog.included_ = {}, goog.dependencies_ = {pathToNames:{}, nameToPath:{}, requires:{}, visited:{}, written:{}}, goog.inHtmlDocument_ = function() {
    var a = goog.global.document;
    return typeof a != "undefined" && "write" in a
  }, goog.findBasePath_ = function() {
    if(goog.global.CLOSURE_BASE_PATH) {
      goog.basePath = goog.global.CLOSURE_BASE_PATH
    }else {
      if(goog.inHtmlDocument_()) {
        for(var a = goog.global.document.getElementsByTagName("script"), b = a.length - 1;b >= 0;--b) {
          var c = a[b].src, d = c.lastIndexOf("?"), d = d == -1 ? c.length : d;
          if(c.substr(d - 7, 7) == "base.js") {
            goog.basePath = c.substr(0, d - 7);
            break
          }
        }
      }
    }
  }, goog.importScript_ = function(a) {
    var b = goog.global.CLOSURE_IMPORT_SCRIPT || goog.writeScriptTag_;
    !goog.dependencies_.written[a] && b(a) && (goog.dependencies_.written[a] = !0)
  }, goog.writeScriptTag_ = function(a) {
    return goog.inHtmlDocument_() ? (goog.global.document.write('<script type="text/javascript" src="' + a + '"><\/script>'), !0) : !1
  }, goog.writeScripts_ = function() {
    function a(e) {
      if(!(e in d.written)) {
        if(!(e in d.visited) && (d.visited[e] = !0, e in d.requires)) {
          for(var g in d.requires[e]) {
            if(g in d.nameToPath) {
              a(d.nameToPath[g])
            }else {
              if(!goog.getObjectByName(g)) {
                throw Error("Undefined nameToPath for " + g);
              }
            }
          }
        }
        e in c || (c[e] = !0, b.push(e))
      }
    }
    var b = [], c = {}, d = goog.dependencies_, e;
    for(e in goog.included_) {
      d.written[e] || a(e)
    }
    for(e = 0;e < b.length;e++) {
      if(b[e]) {
        goog.importScript_(goog.basePath + b[e])
      }else {
        throw Error("Undefined script input");
      }
    }
  }, goog.getPathFromDeps_ = function(a) {
    return a in goog.dependencies_.nameToPath ? goog.dependencies_.nameToPath[a] : null
  }, goog.findBasePath_(), goog.global.CLOSURE_NO_DEPS || goog.importScript_(goog.basePath + "deps.js")
}
goog.typeOf = function(a) {
  var b = typeof a;
  if(b == "object") {
    if(a) {
      if(a instanceof Array) {
        return"array"
      }else {
        if(a instanceof Object) {
          return b
        }
      }
      var c = Object.prototype.toString.call(a);
      if(c == "[object Window]") {
        return"object"
      }
      if(c == "[object Array]" || typeof a.length == "number" && typeof a.splice != "undefined" && typeof a.propertyIsEnumerable != "undefined" && !a.propertyIsEnumerable("splice")) {
        return"array"
      }
      if(c == "[object Function]" || typeof a.call != "undefined" && typeof a.propertyIsEnumerable != "undefined" && !a.propertyIsEnumerable("call")) {
        return"function"
      }
    }else {
      return"null"
    }
  }else {
    if(b == "function" && typeof a.call == "undefined") {
      return"object"
    }
  }
  return b
};
goog.propertyIsEnumerableCustom_ = function(a, b) {
  if(b in a) {
    for(var c in a) {
      if(c == b && Object.prototype.hasOwnProperty.call(a, b)) {
        return!0
      }
    }
  }
  return!1
};
goog.propertyIsEnumerable_ = function(a, b) {
  return a instanceof Object ? Object.prototype.propertyIsEnumerable.call(a, b) : goog.propertyIsEnumerableCustom_(a, b)
};
goog.isDef = function(a) {
  return a !== void 0
};
goog.isNull = function(a) {
  return a === null
};
goog.isDefAndNotNull = function(a) {
  return a != null
};
goog.isArray = function(a) {
  return goog.typeOf(a) == "array"
};
goog.isArrayLike = function(a) {
  var b = goog.typeOf(a);
  return b == "array" || b == "object" && typeof a.length == "number"
};
goog.isDateLike = function(a) {
  return goog.isObject(a) && typeof a.getFullYear == "function"
};
goog.isString = function(a) {
  return typeof a == "string"
};
goog.isBoolean = function(a) {
  return typeof a == "boolean"
};
goog.isNumber = function(a) {
  return typeof a == "number"
};
goog.isFunction = function(a) {
  return goog.typeOf(a) == "function"
};
goog.isObject = function(a) {
  a = goog.typeOf(a);
  return a == "object" || a == "array" || a == "function"
};
goog.getUid = function(a) {
  return a[goog.UID_PROPERTY_] || (a[goog.UID_PROPERTY_] = ++goog.uidCounter_)
};
goog.removeUid = function(a) {
  "removeAttribute" in a && a.removeAttribute(goog.UID_PROPERTY_);
  try {
    delete a[goog.UID_PROPERTY_]
  }catch(b) {
  }
};
goog.UID_PROPERTY_ = "closure_uid_" + Math.floor(Math.random() * 2147483648).toString(36);
goog.uidCounter_ = 0;
goog.getHashCode = goog.getUid;
goog.removeHashCode = goog.removeUid;
goog.cloneObject = function(a) {
  var b = goog.typeOf(a);
  if(b == "object" || b == "array") {
    if(a.clone) {
      return a.clone()
    }
    var b = b == "array" ? [] : {}, c;
    for(c in a) {
      b[c] = goog.cloneObject(a[c])
    }
    return b
  }
  return a
};
goog.bindNative_ = function(a) {
  return a.call.apply(a.bind, arguments)
};
goog.bindJs_ = function(a, b) {
  var c = b || goog.global;
  if(arguments.length > 2) {
    var d = Array.prototype.slice.call(arguments, 2);
    return function() {
      var b = Array.prototype.slice.call(arguments);
      Array.prototype.unshift.apply(b, d);
      return a.apply(c, b)
    }
  }else {
    return function() {
      return a.apply(c, arguments)
    }
  }
};
goog.bind = function() {
  goog.bind = Function.prototype.bind && Function.prototype.bind.toString().indexOf("native code") != -1 ? goog.bindNative_ : goog.bindJs_;
  return goog.bind.apply(null, arguments)
};
goog.partial = function(a) {
  var b = Array.prototype.slice.call(arguments, 1);
  return function() {
    var c = Array.prototype.slice.call(arguments);
    c.unshift.apply(c, b);
    return a.apply(this, c)
  }
};
goog.mixin = function(a, b) {
  for(var c in b) {
    a[c] = b[c]
  }
};
goog.now = Date.now || function() {
  return+new Date
};
goog.globalEval = function(a) {
  if(goog.global.execScript) {
    goog.global.execScript(a, "JavaScript")
  }else {
    if(goog.global.eval) {
      if(goog.evalWorksForGlobals_ == null) {
        goog.global.eval("var _et_ = 1;"), typeof goog.global._et_ != "undefined" ? (delete goog.global._et_, goog.evalWorksForGlobals_ = !0) : goog.evalWorksForGlobals_ = !1
      }
      if(goog.evalWorksForGlobals_) {
        goog.global.eval(a)
      }else {
        var b = goog.global.document, c = b.createElement("script");
        c.type = "text/javascript";
        c.defer = !1;
        c.appendChild(b.createTextNode(a));
        b.body.appendChild(c);
        b.body.removeChild(c)
      }
    }else {
      throw Error("goog.globalEval not available");
    }
  }
};
goog.getCssName = function(a, b) {
  var c = function(a) {
    return goog.cssNameMapping_[a] || a
  }, d;
  d = goog.cssNameMapping_ ? goog.cssNameMappingStyle_ == "BY_WHOLE" ? c : function(a) {
    for(var a = a.split("-"), b = [], d = 0;d < a.length;d++) {
      b.push(c(a[d]))
    }
    return b.join("-")
  } : function(a) {
    return a
  };
  return b ? a + "-" + d(b) : d(a)
};
goog.setCssNameMapping = function(a, b) {
  goog.cssNameMapping_ = a;
  goog.cssNameMappingStyle_ = b
};
goog.getMsg = function(a, b) {
  var c = b || {}, d;
  for(d in c) {
    var e = ("" + c[d]).replace(/\$/g, "$$$$"), a = a.replace(RegExp("\\{\\$" + d + "\\}", "gi"), e)
  }
  return a
};
goog.exportSymbol = function(a, b, c) {
  goog.exportPath_(a, b, c)
};
goog.exportProperty = function(a, b, c) {
  a[b] = c
};
goog.inherits = function(a, b) {
  function c() {
  }
  c.prototype = b.prototype;
  a.superClass_ = b.prototype;
  a.prototype = new c;
  a.prototype.constructor = a
};
goog.base = function(a, b) {
  var c = arguments.callee.caller;
  if(c.superClass_) {
    return c.superClass_.constructor.apply(a, Array.prototype.slice.call(arguments, 1))
  }
  for(var d = Array.prototype.slice.call(arguments, 2), e = !1, f = a.constructor;f;f = f.superClass_ && f.superClass_.constructor) {
    if(f.prototype[b] === c) {
      e = !0
    }else {
      if(e) {
        return f.prototype[b].apply(a, d)
      }
    }
  }
  if(a[b] === c) {
    return a.constructor.prototype[b].apply(a, d)
  }else {
    throw Error("goog.base called from a method of one name to a method of a different name");
  }
};
goog.scope = function(a) {
  a.call(goog.global)
};
var owg = {gg:{}};
owg.gg.Editor = {};
var m_images = {}, m_loadedImages = 0, m_numImages = 0, m_context, m_globe, m_stage, m_ui = new Kinetic.Layer, m_static = new Kinetic.Layer, m_centerX = (window.innerWidth - 350) / 2, m_centerY = window.innerHeight / 2, m_challenge = null, m_cType = 0, m_pin, m_pick = [!1, 0, 0, 0], m_zoom = !1, m_pickOverlay, trLayer = null, m_elev, m_views = [];
function SelectAllText(a) {
  document.getElementById(a).focus();
  document.getElementById(a).select()
}
function LoadImages(a) {
  for(var b in a) {
    m_numImages++
  }
  for(b in a) {
    m_images[b] = new Image, m_images[b].src = a[b]
  }
}
function Init() {
  ogSetArtworkDirectory("../WebViewer/art/");
  m_context = ogCreateContextFromCanvas("canvas", !0);
  m_globe = ogCreateGlobe(m_context);
  m_stage = new Kinetic.Stage("main_ui", window.innerWidth, window.innerHeight);
  LoadImages({btn_01:"art/btn_01.png", btn_01_c:"art/btn_01_c.png", btn_01_h:"art/btn_01_h.png", btn_01_d:"art/btn_01_d.png", btn_01_f:"art/btn_01_f.png", btn_01_t:"art/btn_01_t.png", btn_01_o:"art/btn_01_o.png", clock:"art/clock.png", dial:"art/dial.png", pin_blue:"art/pin_blue.png", pin_red:"art/pin_red.png", pin_green:"art/pin_green.png", pin_yellow:"art/pin_yellow.png"});
  ogAddImageLayer(m_globe, {url:["http://10.42.2.37"], layer:"bluemarble", service:"owg"});
  ogAddImageLayer(m_globe, {url:["http://10.42.2.37"], layer:"swissimage", service:"owg"});
  m_elev = ogAddElevationLayer(m_globe, {url:["http://10.42.2.37"], layer:"DHM25", service:"owg"});
  ogSetRenderQuality(m_globe, 2);
  ogSetRenderFunction(m_context, OnRender);
  ogSetResizeFunction(m_context, OnResize);
  var a = ogGetScene(m_context), b = ogGetActiveCamera(a);
  ogSetPosition(b, 8.225578, 46.8248707, 28E4);
  ogSetOrientation(b, 0, -90, 0);
  ogSetCanvasSizeOffset(a, 360, 1);
  m_pin = new Pin(m_static, m_images.pin_red, 0, 0);
  m_pickOverlay = new Kinetic.Rect({x:0, y:0, width:window.innerWidth, height:window.innerHeight});
  m_static.add(m_pickOverlay);
  m_pickOverlay.on("mousedown", PickMouseDown);
  m_pickOverlay.on("mouseup", PickMouseUp);
  m_pickOverlay.on("mousemove", PickMouseMove);
  m_stage.add(m_ui);
  m_stage.onFrame(function(a) {
    OnCanvasRender(a)
  });
  m_stage.start()
}
function PickMouseMove() {
  if(m_zoom) {
    var a = m_stage.getMousePosition();
    ogGetScene(m_context);
    m_pin.SetPos(a.x, a.y)
  }
}
function PickMouseDown() {
  var a = m_stage.getMousePosition(), b = ogGetScene(m_context), c = ogGetActiveCamera(b), a = ogPickGlobe(b, a.x, a.y);
  ogSetPosition(c, a[1], a[2], 5E4);
  m_zoom = !0
}
function PickMouseUp() {
  var a = ogGetScene(m_context), b = ogGetActiveCamera(a);
  m_zoom = !1;
  var c = m_stage.getMousePosition();
  m_pick = ogPickGlobe(a, c.x, c.y);
  ogSetPosition(b, 8.225578, 46.8248707, 28E4);
  setTimeout(function() {
    var b = ogWorldToWindow(a, m_pick[4], m_pick[5], m_pick[6]);
    m_pin.SetPos(b[0], b[1])
  }, 100)
}
function TypeChanged(a) {
  a == "landmark" ? (ClearViews(), jQuery("#picking_div").css("visibility", "hidden"), jQuery("#landmark_div").css("visibility", "visible"), jQuery("#main_ui").css("visibility", "hidden"), m_cType = 0, m_stage.remove(m_static), m_elev = ogAddElevationLayer(m_globe, {url:["http://10.42.2.37"], layer:"DHM25", service:"owg"})) : a == "picking" && (jQuery("#picking_div").css("visibility", "visible"), jQuery("#landmark_div").css("visibility", "hidden"), jQuery("#main_ui").css("visibility", "visible"), 
  m_cType = 1, a = ogGetScene(m_context), a = ogGetActiveCamera(a), ogSetPosition(a, 8.225578, 46.8248707, 28E4), ogSetOrientation(a, 0, -90, 0), m_stage.add(m_static), ogRemoveImageLayer(m_elev))
}
function TrafficLayer(a) {
  a ? trLayer = ogAddImageLayer(m_globe, {url:["http://10.42.2.37"], layer:"osm_transparent", service:"owg"}) : ogRemoveImageLayer(trLayer)
}
function ViewObj(a, b, c, d, e, f) {
  this.longitude = a;
  this.latitude = b;
  this.elevation = c;
  this.yaw = d;
  this.pitch = e;
  this.roll = f
}
function AddView() {
  var a = ogGetScene(m_context), b = ogGetOrientation(a), a = ogGetPosition(a), b = new ViewObj(a.longitude, a.latitude, a.elevation, b.yaw, b.pitch, b.roll);
  m_views.push(b)
}
function Update() {
  var a = jQuery.parseJSON(document.getElementById("output").innerHTML);
  m_cType == 0 ? m_challenge = new LandmarkChallenge(a.BaseScore, a.Options, a.CorrectOption, a.Views, a.Title) : (m_stage.remove(m_static), m_challenge = new PickingChallenge(a.BaseScore, a.Title, [a.Longitude, a.Latitude, a.Elevation]));
  m_challenge.draftmode = !0;
  m_challenge.Activate()
}
function ClearViews() {
  m_views = []
}
function ShowChallenge() {
  jQuery("#main_ui").css("visibility", "visible");
  jQuery("#testbtn").css("visibility", "hidden");
  jQuery("#resetbtn").css("visibility", "visible");
  jQuery("#details").css("visibility", "hidden");
  jQuery("#landmark_div").css("visibility", "hidden");
  jQuery("#picking_div").css("visibility", "hidden");
  Update()
}
function HideChallenge() {
  m_challenge && m_challenge.Destroy(OnChallengeReset);
  jQuery("#testbtn").css("visibility", "visible");
  jQuery("#resetbtn").css("visibility", "hidden");
  jQuery("#details").css("visibility", "visible");
  m_cType == 0 ? jQuery("#landmark_div").css("visibility", "visible") : m_cType == 1 && jQuery("#picking_div").css("visibility", "visible")
}
function OnChallengeReset() {
  var a = ogGetScene(m_context), a = ogGetActiveCamera(a);
  ogSetPosition(a, 8.225578, 46.8248707, 28E4);
  ogSetOrientation(a, 0, -90, 0);
  m_cType == 0 ? jQuery("#main_ui").css("visibility", "hidden") : m_cType == 1 && m_stage.add(m_static)
}
function OnCanvasRender() {
  m_stage.draw()
}
function OnRender() {
  var a = ogGetScene(m_context), b = ogGetOrientation(a), a = ogGetPosition(a);
  document.getElementById("current").innerText = "yaw=" + b.yaw + " pitch=" + b.pitch + " roll=" + b.roll + "lng=" + a.longitude + " lat=" + a.latitude + " elev=" + a.elevation;
  if(m_cType == 0) {
    for(var c = '{\n   "Type": 0,\n   "BaseScore": ' + document.getElementById("basescore").value + ',\n   "Title": "' + document.getElementById("title").value + '",\n   "CorrectOption": ' + document.getElementById("correctoption").value + ',\n   "Options": ["' + document.getElementById("option1").value + '", "' + document.getElementById("option2").value + '", "' + document.getElementById("option3").value + '", "' + document.getElementById("option4").value + '"],\n   "Views": [\n', b = 0;b < m_views.length;b++) {
      c = c + '       { "longitude": ' + m_views[b].longitude + ',\n        "latitude": ' + m_views[b].latitude + ',\n        "elevation": ' + m_views[b].elevation + ',\n        "yaw": ' + m_views[b].yaw + ',\n        "pitch": ' + m_views[b].pitch + ',\n        "roll": ' + m_views[b].roll + "\n       }", b < m_views.length - 1 && (c += ",\n")
    }
    c += "   \n]\n}"
  }else {
    m_cType == 1 && (c = '{\n   "Type": 1,\n   "BaseScore": ' + document.getElementById("basescore").value + ',\n   "Title": "' + document.getElementById("title").value + '",\n   "Longitude": ' + m_pick[1] + ',\n   "Latitude": ' + m_pick[2] + ',\n   "Elevation": ' + m_pick[3] + "\n\n}")
  }
  document.getElementById("output").innerHTML = c
}
function OnResize() {
  m_centerX = (window.innerWidth - 350) / 2;
  m_centerY = window.innerHeight / 2;
  m_stage.setSize(window.innerWidth - 350, window.innerHeight)
}
goog.exportSymbol("SelectAllText", SelectAllText);
goog.exportSymbol("LoadImages", LoadImages);
goog.exportSymbol("Init", Init);
goog.exportSymbol("PickMouseMove", PickMouseMove);
goog.exportSymbol("PickMouseDown", PickMouseDown);
goog.exportSymbol("PickMouseUp", PickMouseUp);
goog.exportSymbol("TypeChanged", TypeChanged);
goog.exportSymbol("TrafficLayer", TrafficLayer);
goog.exportSymbol("ViewObj", ViewObj);
goog.exportSymbol("AddView", AddView);
goog.exportSymbol("Update", Update);
goog.exportSymbol("ClearViews", ClearViews);
goog.exportSymbol("ShowChallenge", ShowChallenge);
goog.exportSymbol("HideChallenge", HideChallenge);
goog.exportSymbol("OnChallengeReset", OnChallengeReset);
goog.exportSymbol("OnCanvasRender", OnCanvasRender);
goog.exportSymbol("OnRender", OnRender);
goog.exportSymbol("OnResize", OnResize);

