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
goog.exportPath_ = function(a, b, d) {
  a = a.split(".");
  d = d || goog.global;
  !(a[0] in d) && d.execScript && d.execScript("var " + a[0]);
  for(var c;a.length && (c = a.shift());) {
    !a.length && goog.isDef(b) ? d[c] = b : d = d[c] ? d[c] : d[c] = {}
  }
};
goog.getObjectByName = function(a, b) {
  for(var d = a.split("."), c = b || goog.global, e;e = d.shift();) {
    if(goog.isDefAndNotNull(c[e])) {
      c = c[e]
    }else {
      return null
    }
  }
  return c
};
goog.globalize = function(a, b) {
  var d = b || goog.global, c;
  for(c in a) {
    d[c] = a[c]
  }
};
goog.addDependency = function(a, b, d) {
  if(!COMPILED) {
    for(var c, a = a.replace(/\\/g, "/"), e = goog.dependencies_, f = 0;c = b[f];f++) {
      e.nameToPath[c] = a, a in e.pathToNames || (e.pathToNames[a] = {}), e.pathToNames[a][c] = !0
    }
    for(c = 0;b = d[c];c++) {
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
          var d = a[b].src, c = d.lastIndexOf("?"), c = c == -1 ? d.length : c;
          if(d.substr(c - 7, 7) == "base.js") {
            goog.basePath = d.substr(0, c - 7);
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
    function a(f) {
      if(!(f in c.written)) {
        if(!(f in c.visited) && (c.visited[f] = !0, f in c.requires)) {
          for(var e in c.requires[f]) {
            if(e in c.nameToPath) {
              a(c.nameToPath[e])
            }else {
              if(!goog.getObjectByName(e)) {
                throw Error("Undefined nameToPath for " + e);
              }
            }
          }
        }
        f in d || (d[f] = !0, b.push(f))
      }
    }
    var b = [], d = {}, c = goog.dependencies_, e;
    for(e in goog.included_) {
      c.written[e] || a(e)
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
      var d = Object.prototype.toString.call(a);
      if(d == "[object Window]") {
        return"object"
      }
      if(d == "[object Array]" || typeof a.length == "number" && typeof a.splice != "undefined" && typeof a.propertyIsEnumerable != "undefined" && !a.propertyIsEnumerable("splice")) {
        return"array"
      }
      if(d == "[object Function]" || typeof a.call != "undefined" && typeof a.propertyIsEnumerable != "undefined" && !a.propertyIsEnumerable("call")) {
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
    for(var d in a) {
      if(d == b && Object.prototype.hasOwnProperty.call(a, b)) {
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
    var b = b == "array" ? [] : {}, d;
    for(d in a) {
      b[d] = goog.cloneObject(a[d])
    }
    return b
  }
  return a
};
goog.bindNative_ = function(a) {
  return a.call.apply(a.bind, arguments)
};
goog.bindJs_ = function(a, b) {
  var d = b || goog.global;
  if(arguments.length > 2) {
    var c = Array.prototype.slice.call(arguments, 2);
    return function() {
      var b = Array.prototype.slice.call(arguments);
      Array.prototype.unshift.apply(b, c);
      return a.apply(d, b)
    }
  }else {
    return function() {
      return a.apply(d, arguments)
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
    var d = Array.prototype.slice.call(arguments);
    d.unshift.apply(d, b);
    return a.apply(this, d)
  }
};
goog.mixin = function(a, b) {
  for(var d in b) {
    a[d] = b[d]
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
        var b = goog.global.document, d = b.createElement("script");
        d.type = "text/javascript";
        d.defer = !1;
        d.appendChild(b.createTextNode(a));
        b.body.appendChild(d);
        b.body.removeChild(d)
      }
    }else {
      throw Error("goog.globalEval not available");
    }
  }
};
goog.getCssName = function(a, b) {
  var d = function(a) {
    return goog.cssNameMapping_[a] || a
  }, c;
  c = goog.cssNameMapping_ ? goog.cssNameMappingStyle_ == "BY_WHOLE" ? d : function(a) {
    for(var a = a.split("-"), c = [], b = 0;b < a.length;b++) {
      c.push(d(a[b]))
    }
    return c.join("-")
  } : function(a) {
    return a
  };
  return b ? a + "-" + c(b) : c(a)
};
goog.setCssNameMapping = function(a, b) {
  goog.cssNameMapping_ = a;
  goog.cssNameMappingStyle_ = b
};
goog.getMsg = function(a, b) {
  var d = b || {}, c;
  for(c in d) {
    var e = ("" + d[c]).replace(/\$/g, "$$$$"), a = a.replace(RegExp("\\{\\$" + c + "\\}", "gi"), e)
  }
  return a
};
goog.exportSymbol = function(a, b, d) {
  goog.exportPath_(a, b, d)
};
goog.exportProperty = function(a, b, d) {
  a[b] = d
};
goog.inherits = function(a, b) {
  function d() {
  }
  d.prototype = b.prototype;
  a.superClass_ = b.prototype;
  a.prototype = new d;
  a.prototype.constructor = a
};
goog.base = function(a, b) {
  var d = arguments.callee.caller;
  if(d.superClass_) {
    return d.superClass_.constructor.apply(a, Array.prototype.slice.call(arguments, 1))
  }
  for(var c = Array.prototype.slice.call(arguments, 2), e = !1, f = a.constructor;f;f = f.superClass_ && f.superClass_.constructor) {
    if(f.prototype[b] === d) {
      e = !0
    }else {
      if(e) {
        return f.prototype[b].apply(a, c)
      }
    }
  }
  if(a[b] === d) {
    return a.constructor.prototype[b].apply(a, c)
  }else {
    throw Error("goog.base called from a method of one name to a method of a different name");
  }
};
goog.scope = function(a) {
  a.call(goog.global)
};
var owg = {gg:{}};
owg.gg.FlyingText = {};
var m_hInc = 0;
function FlyingText(a, b, d) {
  this.text = b;
  this.fontcolor = d;
  this.alpha = this.scalefactor = 1;
  this.layer = a;
  var c = this, e = m_hInc * 45;
  m_hInc += 1;
  m_hInc >= 3 && (m_hInc = 0);
  this.Step = function(a) {
    a += 1;
    c.alpha -= 0.02;
    c.scalefactor += 0.01;
    c.alpha <= 0 ? c.layer.remove(c.shape) : setTimeout(function() {
      c.Step(a)
    }, 15)
  };
  this.shape = new Kinetic.Shape({drawFunc:function() {
    var a = this.getContext();
    a.beginPath();
    a.font = "28pt LuckiestGuy";
    a.fillStyle = c.fontcolor;
    var b = window.innerWidth / 2 / c.scalefactor, d = (window.innerHeight / 2 - 200 + e) / c.scalefactor;
    a.textAlign = "center";
    a.fillText(c.text, b, d);
    a.lineWidth = 3;
    a.strokeStyle = "#000";
    a.strokeText(c.text, b, d);
    this.setScale(c.scalefactor, c.scalefactor);
    this.setAlpha(c.alpha)
  }});
  a.add(this.shape);
  c.Step(0)
}
goog.exportSymbol("FlyingText", FlyingText);
function FadeOut(a) {
  setTimeout(function() {
    m_ui.setAlpha(m_ui.getAlpha() - 0.1);
    m_ui.getAlpha() > 0 ? FadeOut(a) : (m_ui.setAlpha(0), a())
  }, 1)
}
goog.exportSymbol("FadeOut", FadeOut);
function FadeIn(a) {
  setTimeout(function() {
    m_ui.setAlpha(m_ui.getAlpha() + 0.1);
    m_ui.getAlpha() < 1 ? FadeIn(a) : (m_ui.setAlpha(1), a())
  }, 1)
}
goog.exportSymbol("FadeIn", FadeIn);
owg.gg.Player = {};
function Player(a) {
  this.playerName = a;
  this.playerScore = 0
}
Player.prototype.ScorePoints = function(a, b) {
  new FlyingText(m_static, "+" + a + " " + m_locale.points + " " + b, "#00FF00");
  this.playerScore += a
};
goog.exportSymbol("Player", Player);
goog.exportProperty(Player.prototype, "ScorePoints", Player.prototype.ScorePoints);
owg.gg.Button01 = {};
owg.gg.Button02 = {};
owg.gg.MessageDialog = {};
owg.gg.ScreenText = {};
owg.gg.Pin = {};
owg.gg.Clock = {};
owg.gg.ScoreCount = {};
function Button01(a, b, d, c, e, f, h, j) {
  this.x = d;
  this.y = c;
  this.width = e;
  this.height = f;
  this.state = 0;
  this.caption = h;
  this.fontsize = j;
  this.name = b;
  this.enabled = !0;
  this.layer = a;
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
  var g = this;
  this.shape = new Kinetic.Shape({drawFunc:function() {
    var a = this.getContext(), b = 0;
    g.enabled == !1 ? a.drawImage(m_images.btn_01_d, d, c, e, f) : g.state == 0 ? a.drawImage(m_images.btn_01, d, c, e, f) : g.state == 1 ? a.drawImage(m_images.btn_01_h, d, c, e, f) : g.state == 2 ? (a.drawImage(m_images.btn_01_c, d, c, e, f), b = 2) : g.state == 3 ? a.drawImage(m_images.btn_01_t, d, c, e, f) : g.state == 4 ? a.drawImage(m_images.btn_01_f, d, c, e, f) : g.state == 5 && a.drawImage(m_images.btn_01_o, d, c, e, f);
    a.beginPath();
    a.rect(d, c, e, f);
    a.closePath();
    a.font = j + "pt TitanOne";
    a.fillStyle = "#FFF";
    var h = a.measureText(g.caption).width;
    a.measureText(g.caption);
    var k = d + b, b = c + 3 * (f / 5) + b;
    h <= e && (k = d + (e - h) / 2);
    a.fillText(g.caption, k, b);
    a.lineWidth = 1;
    a.strokeStyle = "#000";
    a.strokeText(g.caption, k, b)
  }});
  this.shape.on("mouseout", function() {
    if(g.enabled && (g.onMouseOutEvent(), g.state < 3)) {
      g.state = 0
    }
  });
  this.shape.on("mouseover", function() {
    if(g.enabled && (g.onMouseOverEvent(), g.state < 3)) {
      g.state = 1
    }
  });
  this.shape.on("mousedown", function() {
    if(g.enabled && (g.onMouseDownEvent(), g.state < 3)) {
      g.state = 2
    }
  });
  this.shape.on("mouseup", function() {
    if(g.enabled && (g.onMouseUpEvent(), g.state < 3)) {
      g.state = 1, g.onClickEvent()
    }
  });
  this.shape.name = b;
  a.add(this.shape)
}
Button01.prototype.SetEnabled = function(a) {
  this.enabled = a
};
Button01.prototype.SetState = function(a) {
  this.state = a
};
Button01.prototype.Destroy = function() {
  this.layer.remove(this.shape)
};
goog.exportSymbol("Button01", Button01);
goog.exportProperty(Button01.prototype, "SetEnabled", Button01.prototype.SetEnabled);
goog.exportProperty(Button01.prototype, "SetState", Button01.prototype.SetState);
goog.exportProperty(Button01.prototype, "Destroy", Button01.prototype.Destroy);
function Button02(a, b, d, c, e, f, h, j, g) {
  this.x = d;
  this.y = c;
  this.width = e;
  this.height = f;
  this.state = 0;
  this.caption = h;
  this.fontsize = j;
  this.name = b;
  this.enabled = !0;
  this.layer = a;
  this.onClickEvent = g == null ? function() {
  } : g;
  this.onMouseOverEvent = function() {
  };
  this.onMouseOutEvent = function() {
  };
  this.onMouseDownEvent = function() {
  };
  this.onMouseUpEvent = function() {
  };
  var i = this;
  this.shape = new Kinetic.Shape({drawFunc:function() {
    var a = this.getContext(), b = 0;
    i.state == 0 ? a.drawImage(m_images.btn_02, d, c, e, f) : i.state == 1 ? a.drawImage(m_images.btn_02_h, d, c, e, f) : i.state == 2 && (a.drawImage(m_images.btn_02_c, d, c, e, f), b = 2);
    a.beginPath();
    a.rect(d, c, e, f);
    a.closePath();
    a.font = j + "pt TitanOne";
    a.fillStyle = "#FFF";
    var h = a.measureText(i.caption).width;
    a.measureText(i.caption);
    var g = d + b, b = c + 3 * (f / 5) + b;
    h <= e && (g = d + (e - h) / 2);
    a.fillText(i.caption, g, b);
    a.lineWidth = 1;
    a.strokeStyle = "#000";
    a.strokeText(i.caption, g, b)
  }});
  this.shape.on("mouseout", function() {
    if(i.enabled && (i.onMouseOutEvent(), i.state < 3)) {
      i.state = 0
    }
  });
  this.shape.on("mouseover", function() {
    if(i.enabled && (i.onMouseOverEvent(), i.state < 3)) {
      i.state = 1
    }
  });
  this.shape.on("mousedown", function() {
    if(i.enabled && (i.onMouseDownEvent(), i.state < 3)) {
      i.state = 2
    }
  });
  this.shape.on("mouseup", function() {
    if(i.enabled && (i.onMouseUpEvent(), i.state < 3)) {
      i.state = 1, i.onClickEvent(i)
    }
  });
  this.shape.name = b;
  a.add(this.shape)
}
Button02.prototype.Destroy = function() {
  this.layer.remove(this.shape)
};
goog.exportSymbol("Button02", Button02);
goog.exportProperty(Button02.prototype, "Destroy", Button02.prototype.Destroy);
function Clock(a, b, d, c) {
  this.layer = a;
  this.x = b;
  this.y = d;
  this.seconds = c;
  this.visible = !0;
  this.obsolete = !1;
  var e = 2 / 60, f = this;
  this.running = !1;
  this.onTimeoutEvent = function() {
  };
  this.shape = new Kinetic.Shape({drawFunc:function() {
    if(f.visible == !0) {
      var a = this.getContext(), c = e * f.seconds - 0.5;
      a.drawImage(m_images.clock, b, d, 220, 260);
      a.beginPath();
      a.arc(b + 110, d + 153, 84, c * Math.PI, 1.5 * Math.PI, !1);
      a.lineTo(b + 110, d + 153);
      a.closePath();
      c = a.createPattern(m_images.dial, "no-repeat");
      a.fillStyle = c;
      a.translate(b + 25, d + 65);
      a.fill();
      a.fillStyle = f.seconds > 10 ? "#FFF" : "#F00";
      a.font = "40pt TitanOne";
      a.textAlign = "center";
      c = "" + f.seconds;
      a.fillText(c, 85, 110);
      a.lineWidth = 3;
      a.strokeStyle = "#000";
      a.strokeText(c, 85, 110)
    }
  }});
  a.add(this.shape)
}
Clock.prototype.Start = function() {
  this.running = !0;
  this.Countdown()
};
Clock.prototype.Pause = function() {
  this.running = !1
};
Clock.prototype.Resume = function() {
  this.running = !0
};
Clock.prototype.Countdown = function() {
  var a = this;
  setTimeout(function() {
    if(a.obsolete != !0) {
      a.seconds > 0 ? a.Countdown() : (a.running = !1, a.onTimeoutEvent())
    }
  }, 1E3);
  this.running && (this.seconds -= 1)
};
Clock.prototype.Destroy = function() {
  this.obsolete = !0;
  this.OnDestroy()
};
Clock.prototype.OnDestroy = function() {
  this.layer.remove(this.shape)
};
Clock.prototype.SetVisible = function(a) {
  this.visible = a
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
function ScreenText(a, b, d, c, e, f) {
  this.text = b;
  this.x = d;
  this.y = c;
  this.fontsize = e;
  this.align = f;
  this.layer = a;
  var h = this;
  this.shape = new Kinetic.Shape({drawFunc:function() {
    var a = this.getContext();
    a.textAlign = h.align;
    a.fillStyle = "#FFF";
    a.font = h.fontsize + "pt TitanOne";
    a.textAlign = h.align;
    a.fillText(h.text, h.x, h.y);
    a.lineWidth = 2;
    a.strokeStyle = "#000";
    a.strokeText(h.text, h.x, h.y)
  }});
  a.add(this.shape)
}
ScreenText.prototype.Destroy = function() {
  this.layer.remove(this.shape)
};
goog.exportSymbol("ScreenText", ScreenText);
goog.exportProperty(ScreenText.prototype, "Destroy", ScreenText.prototype.Destroy);
function MessageDialog(a, b, d, c) {
  this.message = b;
  this.layer = a;
  this.okayButton = null;
  var e = this;
  this.Callback = function() {
  };
  this.OnOkay = function() {
    e.Destroy();
    e.Callback()
  };
  this.shape = new Kinetic.Shape({drawFunc:function() {
    var a = this.getContext();
    a.beginPath();
    a.rect(window.innerWidth / 2 - d / 2, window.innerHeight / 2 - c / 2, d, c);
    var b = a.createLinearGradient(window.innerWidth / 2, window.innerHeight / 2 - c / 2, window.innerWidth / 2, window.innerHeight / 2 + c / 2);
    b.addColorStop(0, "#555");
    b.addColorStop(1, "#CCC");
    a.fillStyle = b;
    a.fill();
    a.lineWidth = 3;
    a.strokeStyle = "#FFF";
    a.stroke();
    a.textAlign = "center";
    a.fillStyle = "#FFF";
    a.font = "18pt TitanOne";
    a.textAlign = "center";
    a.fillText(e.message, window.innerWidth / 2, window.innerHeight / 2 - c / 2 + 80);
    a.lineWidth = 1;
    a.strokeStyle = "#000";
    a.strokeText(e.message, window.innerWidth / 2, window.innerHeight / 2 - c / 2 + 80)
  }});
  a.add(this.shape);
  this.okayButton = new Button01(m_ui, "dialog", window.innerWidth / 2 - 150, window.innerHeight / 2 + c / 2 - 100, 300, 69, "OK", 15);
  this.okayButton.onClickEvent = this.OnOkay
}
MessageDialog.prototype.RegisterCallback = function(a) {
  this.Callback = a
};
MessageDialog.prototype.Destroy = function() {
  this.layer.remove(this.shape);
  this.layer.remove(this.okayButton.shape)
};
goog.exportSymbol("MessageDialog", MessageDialog);
goog.exportProperty(MessageDialog.prototype, "RegisterCallback", MessageDialog.prototype.RegisterCallback);
goog.exportProperty(MessageDialog.prototype, "Destroy", MessageDialog.prototype.Destroy);
function ScoreCount(a) {
  this.layer = a;
  this.shape = new Kinetic.Shape({drawFunc:function() {
    var a = this.getContext();
    a.beginPath();
    a.rect(10, 10, 225, 50);
    var d = a.createLinearGradient(10, 10, 10, 50);
    d.addColorStop(0, "#555");
    d.addColorStop(1, "#CCC");
    a.fillStyle = d;
    a.fill();
    a.lineWidth = 3;
    a.strokeStyle = "#FFF";
    a.stroke();
    a.textAlign = "center";
    a.fillStyle = "#FFF";
    a.font = "16pt TitanOne";
    a.textAlign = "left";
    a.fillText(m_locale.score + ": " + m_player.playerScore, 25, 45);
    a.lineWidth = 2;
    a.strokeStyle = "#000";
    a.strokeText(m_locale.score + ": " + m_player.playerScore, 25, 45)
  }});
  a.add(this.shape)
}
ScoreCount.prototype.Destroy = function() {
  this.layer.remove(this.shape)
};
goog.exportSymbol("ScoreCount", ScoreCount);
goog.exportProperty(ScoreCount.prototype, "Destroy", ScoreCount.prototype.Destroy);
function Pin(a, b, d, c) {
  this.layer = a;
  var e = this;
  this.x = d;
  this.y = c;
  this.visible = !0;
  this.shape = new Kinetic.Shape({drawFunc:function() {
    if(e.visible == !0) {
      var a = this.getContext();
      a.beginPath();
      a.drawImage(b, e.x - 74, e.y - 132, 86, 144)
    }
  }});
  a.add(this.shape)
}
Pin.prototype.SetPos = function(a, b) {
  this.x = a;
  this.y = b
};
Pin.prototype.SetVisible = function(a) {
  this.visible = a
};
Pin.prototype.Destroy = function() {
  this.layer.remove(this.shape)
};
goog.exportSymbol("Pin", Pin);
goog.exportProperty(Pin.prototype, "SetPos", Pin.prototype.SetPos);
goog.exportProperty(Pin.prototype, "SetVisible", Pin.prototype.SetVisible);
goog.exportProperty(Pin.prototype, "Destroy", Pin.prototype.Destroy);
function HighScoreDialog(a, b, d, c, e) {
  this.list = b;
  this.layer = a;
  this.okayButton = null;
  var f = this;
  this.Callback = function() {
  };
  this.OnOkay = function() {
    f.Destroy();
    f.Callback()
  };
  this.shape = new Kinetic.Shape({drawFunc:function() {
    var a = this.getContext();
    a.beginPath();
    a.rect(window.innerWidth / 2 - d / 2, window.innerHeight / 2 - c / 2, d, c);
    var b = a.createLinearGradient(window.innerWidth / 2, window.innerHeight / 2 - c / 2, window.innerWidth / 2, window.innerHeight / 2 + c / 2);
    b.addColorStop(0, "#555");
    b.addColorStop(1, "#CCC");
    a.fillStyle = b;
    a.fill();
    a.lineWidth = 3;
    a.strokeStyle = "#FFF";
    a.stroke();
    a.textAlign = "center";
    a.lineWidth = 2;
    a.strokeStyle = "#000";
    a.fillStyle = "#FF0";
    a.font = "25pt TitanOne";
    a.fillText(m_locale.highscores, window.innerWidth / 2, window.innerHeight / 2 - c / 2 + 45);
    a.strokeText(m_locale.highscores, window.innerWidth / 2, window.innerHeight / 2 - c / 2 + 45);
    a.font = "15pt TitanOne";
    for(b = 1;b <= f.list.length;b++) {
      a.fillStyle = b == 1 ? "#FFAA33" : e.playerName == f.list[b - 1][0] && e.playerScore == f.list[b - 1][2] ? "#0FF" : "#FFF";
      var g = b + ". " + f.list[b - 1][0] + "  " + f.list[b - 1][2];
      a.fillText(g, window.innerWidth / 2, window.innerHeight / 2 - c / 2 + 75 + b * 22);
      a.lineWidth = 1;
      a.strokeText(g, window.innerWidth / 2, window.innerHeight / 2 - c / 2 + 75 + b * 22)
    }
  }});
  a.add(this.shape);
  this.okayButton = new Button01(m_ui, "dialog", window.innerWidth / 2 - 150, window.innerHeight / 2 + c / 2 - 100, 300, 69, m_locale.playagain, 15);
  this.okayButton.onClickEvent = this.OnOkay
}
HighScoreDialog.prototype.RegisterCallback = function(a) {
  this.Callback = a
};
HighScoreDialog.prototype.Destroy = function() {
  this.layer.remove(this.shape);
  this.layer.remove(this.okayButton.shape)
};
goog.exportSymbol("HighScoreDialog", HighScoreDialog);
goog.exportProperty(HighScoreDialog.prototype, "RegisterCallback", HighScoreDialog.prototype.RegisterCallback);
goog.exportProperty(HighScoreDialog.prototype, "Destroy", HighScoreDialog.prototype.Destroy);
owg.gg.Challenge = {};
function Challenge(a) {
  this.type = a;
  this.baseScore = 0;
  this.draftmode = this.destroyed = !1;
  var b = this;
  this.eventDestroyed = function() {
  };
  this.callback = function() {
  };
  this.Activate = function() {
  };
  this.Destroy = function() {
  };
  this.OnDestroy = function() {
  };
  this.RegisterCallback = function(a) {
    b.callback = a
  }
}
goog.exportSymbol("Challenge", Challenge);
owg.gg.LandmarkChallenge = {};
function LandmarkChallenge(a, b, d, c, e) {
  this.correctOption = d;
  this.options = b;
  this.baseScore = a;
  this.views = c;
  this.flystate = 1;
  this.text = e;
  this.stop = !1;
  this.clock = null;
  this.buttonArray = [];
  this.screenText = null;
  var f = this;
  this.onOption1 = function() {
    f.PickOption(1, f.clock.GetSeconds())
  };
  this.onOption2 = function() {
    f.PickOption(2, f.clock.GetSeconds())
  };
  this.onOption3 = function() {
    f.PickOption(3, f.clock.GetSeconds())
  };
  this.onOption4 = function() {
    f.PickOption(4, f.clock.GetSeconds())
  };
  this.FlightCallback = function() {
    if(f.stop != !0 && f.flystate < f.views.length) {
      var a = f.views[f.flystate], b = ogGetScene(m_context);
      f.flystate += 1;
      ogFlyTo(b, a.longitude, a.latitude, a.elevation, a.yaw, a.pitch, a.roll)
    }
  }
}
LandmarkChallenge.prototype = new Challenge(0);
LandmarkChallenge.prototype.constructor = LandmarkChallenge;
LandmarkChallenge.prototype.Activate = function() {
  var a = null, b = null, d = null, c = null, e = this, a = new Button01(m_ui, "btn1", m_centerX - 310, window.innerHeight - 239, 300, 69, this.options[0], 15);
  a.onClickEvent = this.onOption1;
  b = new Button01(m_ui, "btn2", m_centerX + 10, window.innerHeight - 239, 300, 69, this.options[1], 15);
  b.onClickEvent = this.onOption2;
  d = new Button01(m_ui, "btn3", m_centerX - 310, window.innerHeight - 150, 300, 69, this.options[2], 15);
  d.onClickEvent = this.onOption3;
  c = new Button01(m_ui, "btn4", m_centerX + 10, window.innerHeight - 150, 300, 69, this.options[3], 15);
  c.onClickEvent = this.onOption4;
  this.buttonArray.push(a);
  this.buttonArray.push(b);
  this.buttonArray.push(d);
  this.buttonArray.push(c);
  this.screenText = new ScreenText(m_ui, this.text, m_centerX, window.innerHeight - 255, 20, "center");
  this.clock = new Clock(m_ui, 50, 75, 60);
  this.clock.onTimeoutEvent = function() {
    e.callback()
  };
  this.clock.Start();
  FadeIn(function() {
  });
  a = Math.floor(40 / (this.views.length - 1)) * 1E3;
  b = ogGetScene(m_context);
  ogSetFlightDuration(b, a);
  a = ogGetActiveCamera(b);
  ogSetPosition(a, this.views[0].longitude, this.views[0].latitude, this.views[0].elevation);
  ogSetOrientation(a, this.views[0].yaw, this.views[0].pitch, this.views[0].roll);
  ogSetInPositionFunction(m_context, this.FlightCallback);
  this.FlightCallback()
};
LandmarkChallenge.prototype.Destroy = function(a) {
  if(!this.destroyed) {
    this.eventDestroyed = a, this.clock.Pause(), ogSetInPositionFunction(m_context, function() {
    }), this.stop = !0, a = ogGetScene(m_context), ogStopFlyTo(a), this.OnDestroy(), this.destroyed = !0
  }
};
LandmarkChallenge.prototype.OnDestroy = function() {
  this.clock.Destroy();
  var a = this;
  this.draftmode ? (a.buttonArray[0].Destroy(), a.buttonArray[1].Destroy(), a.buttonArray[2].Destroy(), a.buttonArray[3].Destroy(), a.screenText.Destroy(), a.eventDestroyed()) : FadeOut(function() {
    a.buttonArray[0].Destroy();
    a.buttonArray[1].Destroy();
    a.buttonArray[2].Destroy();
    a.buttonArray[3].Destroy();
    a.screenText.Destroy();
    a.eventDestroyed()
  })
};
LandmarkChallenge.prototype.PickOption = function(a, b) {
  this.buttonArray[0].SetEnabled(!1);
  this.buttonArray[1].SetEnabled(!1);
  this.buttonArray[2].SetEnabled(!1);
  this.buttonArray[3].SetEnabled(!1);
  var d = this;
  this.correctOption == a ? (m_player && (m_player.ScorePoints(this.baseScore, ""), m_player.ScorePoints(Math.floor(b / 5), m_locale.timebonus), b > 50 && m_player.ScorePoints(20, m_locale.speedbonus)), this.buttonArray[a - 1].SetEnabled(!0), this.buttonArray[a - 1].SetState(3)) : (this.buttonArray[a - 1].SetEnabled(!0), this.buttonArray[this.correctOption - 1].SetEnabled(!0), this.buttonArray[a - 1].SetState(4), this.buttonArray[this.correctOption - 1].SetState(5));
  setTimeout(function() {
    d.callback()
  }, 2E3)
};
goog.exportSymbol("LandmarkChallenge", LandmarkChallenge);
goog.exportProperty(LandmarkChallenge.prototype, "Activate", LandmarkChallenge.prototype.Activate);
goog.exportProperty(LandmarkChallenge.prototype, "Destroy", LandmarkChallenge.prototype.Destroy);
goog.exportProperty(LandmarkChallenge.prototype, "OnDestroy", LandmarkChallenge.prototype.OnDestroy);
goog.exportProperty(LandmarkChallenge.prototype, "PickOption", LandmarkChallenge.prototype.PickOption);
goog.exportProperty(LandmarkChallenge.prototype, "RegisterCallback", LandmarkChallenge.prototype.RegisterCallback);
owg.gg.PickingChallenge = {};
function PickingChallenge(a, b, d) {
  this.screenText = null;
  this.baseScore = a;
  this.text = b;
  var c = this;
  this.zoomState = this.flystate = !1;
  this.pickPos = [null, 0, 0, 0];
  this.solutionPos = d;
  this.pickOverlay = this.okayBtn = this.distancText = this.line = this.resultPin = this.posPin = null;
  this.mouseLock = !1;
  this.distanceLine = this.ogFrameLayer = this.clock = null;
  this.OnOkay = function() {
    var a = ogGetScene(m_context), b = ogToCartesian(a, c.solutionPos[0], c.solutionPos[1], c.solutionPos[2]), d = ogWorldToWindow(a, b[0], b[1], b[2]), j = ogCalcDistanceWGS84(c.solutionPos[0], c.solutionPos[1], c.pickPos[1], c.pickPos[2]), j = Math.round(j / 1E3 * Math.pow(10, 1)) / Math.pow(10, 1);
    c.resultPin.SetPos(d[0], d[1]);
    if(c.posPin) {
      c.distanceLine = new Kinetic.Shape({drawFunc:function() {
        var a = this.getContext();
        a.moveTo(d[0], d[1]);
        a.lineTo(c.posPin.x, c.posPin.y);
        a.lineWidth = 3;
        a.strokeStyle = "#DD6600";
        a.stroke();
        a.textAlign = "center";
        a.fillStyle = "#FF0";
        a.font = "16pt TitanOne";
        a.textAlign = "left";
        a.fillText(j + "km", d[0], d[1]);
        a.lineWidth = 2;
        a.strokeStyle = "#000";
        a.strokeText(j + "km", d[0], d[1])
      }}), m_ui.add(c.distanceLine)
    }
    m_player && j < 50 && (m_player.ScorePoints(Math.floor(c.baseScore / 50 * (50 - j)), m_locale.estimation), m_player.ScorePoints(Math.floor(c.clock.seconds / 5), m_locale.timebonus), c.clock.seconds > 50 && m_player.ScorePoints(20, m_locale.speedbonus));
    setTimeout(function() {
      c.callback()
    }, 2500)
  };
  this.MouseOverOkBtn = function() {
    c.mouseLock = !0
  };
  this.MouseOutOkBtn = function() {
    c.mouseLock = !1
  };
  this.OnMouseDown = function() {
    if(c.mouseLock == !1) {
      var a = m_stage.getMousePosition(), b = ogGetScene(m_context);
      c.posPin && c.posPin.SetPos(a.x, a.y);
      c.flystate == !0 && ogStopFlyTo(b);
      var d = ogGetOrientation(b), b = ogPickGlobe(b, a.x, a.y);
      c.ZoomIn(b, d);
      if(c.posPin == null) {
        c.posPin = new Pin(m_ui, m_images.pin_blue, a.x, a.y)
      }
      c.zoomState = !0
    }
  };
  this.OnMouseUp = function() {
    if(c.mouseLock == !1) {
      var a = ogGetScene(m_context);
      c.zoomState = !1;
      var b = m_stage.getMousePosition();
      c.pickPos = ogPickGlobe(a, b.x, b.y);
      c.posPin != null && c.posPin.SetVisible(!1);
      c.flystate == !0 && ogStopFlyTo(a);
      c.ZoomOut()
    }
  };
  this.OnMouseMove = function() {
    if(c.zoomState == !0) {
      var a = m_stage.getMousePosition();
      c.posPin != null && c.posPin.SetPos(a.x, a.y)
    }
  };
  this.FlightCallback = function() {
    c.flystate = !1;
    var a = ogGetScene(m_context), a = ogWorldToWindow(a, c.pickPos[4], c.pickPos[5], c.pickPos[6]);
    c.posPin != null && (c.posPin.SetVisible(!0), c.posPin.SetPos(a[0], a[1]))
  }
}
PickingChallenge.prototype = new Challenge(1);
PickingChallenge.prototype.constructor = PickingChallenge;
PickingChallenge.prototype.Activate = function() {
  this.screenText = new ScreenText(m_ui, this.text, m_centerX, window.innerHeight - 255, 20, "center");
  this.pickOverlay = new Kinetic.Rect({x:0, y:0, width:window.innerWidth, height:window.innerHeight});
  var a = this;
  this.pickOverlay.on("mousedown", this.OnMouseDown);
  this.pickOverlay.on("mouseup", this.OnMouseUp);
  this.pickOverlay.on("mousemove", this.OnMouseMove);
  m_ui.add(this.pickOverlay);
  this.okayBtn = new Button01(m_ui, "okbtn1", m_centerX - 150, window.innerHeight - 180, 300, 69, "OK", 15);
  this.resultPin = new Pin(m_ui, m_images.pin_green, -1, -1);
  this.okayBtn.onClickEvent = this.OnOkay;
  this.okayBtn.onMouseOverEvent = this.MouseOverOkBtn;
  this.okayBtn.onMouseOutEvent = this.MouseOutOkBtn;
  this.clock = new Clock(m_ui, 50, 75, 60);
  this.clock.onTimeoutEvent = function() {
    a.callback()
  };
  this.clock.Start();
  FadeIn(function() {
  });
  var b = ogGetScene(m_context), b = ogGetActiveCamera(b);
  ogSetPosition(b, 8.225578, 46.8248707, 28E4);
  ogSetOrientation(b, 0, -90, 0);
  ogSetInPositionFunction(m_context, this.FlightCallback);
  this.ogFrameLayer = ogAddImageLayer(m_globe, {url:["http://10.42.2.37"], layer:"ch_boundaries", service:"owg"})
};
PickingChallenge.prototype.Destroy = function(a) {
  if(!this.destroyed) {
    this.eventDestroyed = a, ogSetInPositionFunction(m_context, function() {
    }), this.clock.Pause(), this.OnDestroy(), this.destroyed = !0
  }
};
PickingChallenge.prototype.OnDestroy = function() {
  this.clock.Destroy();
  var a = this;
  this.draftmode ? (a.screenText.Destroy(), a.resultPin.Destroy(), a.posPin && (a.posPin.Destroy(), a.distanceLine && m_ui.remove(a.distanceLine)), a.okayBtn.Destroy(), m_ui.remove(a.pickOverlay), ogRemoveImageLayer(a.ogFrameLayer), a.eventDestroyed()) : FadeOut(function() {
    a.screenText.Destroy();
    a.resultPin.Destroy();
    a.posPin && (a.posPin.Destroy(), a.distanceLine && m_ui.remove(a.distanceLine));
    a.okayBtn.Destroy();
    m_ui.remove(a.pickOverlay);
    ogRemoveImageLayer(a.ogFrameLayer);
    a.eventDestroyed()
  })
};
PickingChallenge.prototype.ZoomIn = function(a) {
  this.flystate = !0;
  var b = ogGetScene(m_context);
  ogSetFlightDuration(b, 1E3);
  ogFlyToLookAtPosition(b, a[1], a[2], a[3], 2E4, 0, -90, 0)
};
PickingChallenge.prototype.ZoomOut = function() {
  this.flystate = !0;
  var a = ogGetScene(m_context);
  ogSetFlightDuration(a, 800);
  ogFlyTo(a, 8.225578, 46.8248707, 28E4, 0, -90, 0)
};
goog.exportSymbol("PickingChallenge", PickingChallenge);
goog.exportProperty(PickingChallenge.prototype, "Activate", PickingChallenge.prototype.Activate);
goog.exportProperty(PickingChallenge.prototype, "Destroy", PickingChallenge.prototype.Destroy);
goog.exportProperty(PickingChallenge.prototype, "OnDestroy", PickingChallenge.prototype.OnDestroy);
goog.exportProperty(PickingChallenge.prototype, "ZoomIn", PickingChallenge.prototype.ZoomIn);
goog.exportProperty(PickingChallenge.prototype, "ZoomOut", PickingChallenge.prototype.ZoomOut);
goog.exportProperty(PickingChallenge.prototype, "RegisterCallback", PickingChallenge.prototype.RegisterCallback);
owg.gg.GameData = {};
function GameData(a) {
  this.questions = [];
  var b = this;
  jQuery.getJSON("data/challenges_" + m_lang + ".json", function(d) {
    var c = [];
    jQuery.each(d, function(a, b) {
      if(b.Type == 0) {
        var d = b.BaseScore, j = b.Title, d = new LandmarkChallenge(d, b.Options, b.CorrectOption, b.Views, j);
        c.push(d)
      }else {
        if(b.Type == 1) {
          var g = b.Longitude, i = b.Latitude, l = b.Elevation, d = b.BaseScore, j = b.Title, d = new PickingChallenge(d, j, [g, i, l]);
          c.push(d)
        }
      }
    });
    b.questions = c;
    a && a()
  })
}
GameData.prototype.PickChallenge = function() {
  var a = Math.floor(Math.random() * this.questions.length), b = this.questions[a];
  this.questions.splice(a, 1);
  return b
};
goog.exportSymbol("GameData", GameData);
goog.exportProperty(GameData.prototype, "PickChallenge", GameData.prototype.PickChallenge);
owg.gg.TouchKeyboard = {};
function TouchKeyboard(a, b, d, c, e, f) {
  this.caption = e;
  this.callback = f;
  this.layer = a;
  this.x = d;
  this.y = c;
  this.oX = d + 8;
  this.oY = c + 38;
  this.input = "";
  var h = this;
  this.shape = new Kinetic.Shape({drawFunc:function() {
    var a = this.getContext();
    a.beginPath();
    a.rect(h.x, h.y, 853, 390);
    var b = a.createLinearGradient(d, c, d, c + 390);
    b.addColorStop(0, "#555");
    b.addColorStop(1, "#CCC");
    a.fillStyle = b;
    a.fill();
    a.lineWidth = 3;
    a.strokeStyle = "#FFF";
    a.stroke();
    a.textAlign = "left";
    a.fillStyle = "#FFF";
    a.font = "16pt TitanOne";
    a.fillText(e + h.input + "_", d + 20, c + 30);
    a.lineWidth = 1;
    a.strokeStyle = "#000";
    a.strokeText(e + h.input + "_", d + 20, c + 30)
  }});
  a.add(this.shape);
  this.Append = function(a) {
    h.input += a.caption
  };
  this.OnOkay = function() {
    h.callback && h.callback(h.input)
  };
  this.Backspace = function() {
    h.input = h.input.substring(0, h.input.length - 1)
  };
  this.Space = function() {
    h.input += " "
  };
  this.spaceButton = new Button01(a, "btn_space", this.oX + 267, this.oY + 276, 300, 69, " ", 15);
  this.spaceButton.onClickEvent = this.Space;
  this.buttonArray = [new Button02(a, "btn_1", this.oX, this.oY, 76, 69, "1", 15, this.Append), new Button02(a, "btn_2", this.oX + 76, this.oY, 76, 69, "2", 15, this.Append), new Button02(a, "btn_3", this.oX + 152, this.oY, 76, 69, "3", 15, this.Append), new Button02(a, "btn_4", this.oX + 228, this.oY, 76, 69, "4", 15, this.Append), new Button02(a, "btn_5", this.oX + 304, this.oY, 76, 69, "5", 15, this.Append), new Button02(a, "btn_6", this.oX + 380, this.oY, 76, 69, "6", 15, this.Append), new Button02(a, 
  "btn_7", this.oX + 456, this.oY, 76, 69, "7", 15, this.Append), new Button02(a, "btn_8", this.oX + 532, this.oY, 76, 69, "8", 15, this.Append), new Button02(a, "btn_9", this.oX + 608, this.oY, 76, 69, "9", 15, this.Append), new Button02(a, "btn_0", this.oX + 684, this.oY, 76, 69, "0", 15, this.Append), new Button02(a, "btn_back", this.oX + 760, this.oY, 76, 69, "<-", 15, this.Backspace), new Button02(a, "btn_q", this.oX + 38, this.oY + 69, 76, 69, "Q", 15, this.Append), new Button02(a, "btn_w", 
  this.oX + 38 + 76, this.oY + 69, 76, 69, "W", 15, this.Append), new Button02(a, "btn_e", this.oX + 38 + 152, this.oY + 69, 76, 69, "E", 15, this.Append), new Button02(a, "btn_r", this.oX + 38 + 228, this.oY + 69, 76, 69, "R", 15, this.Append), new Button02(a, "btn_t", this.oX + 38 + 304, this.oY + 69, 76, 69, "T", 15, this.Append), new Button02(a, "btn_z", this.oX + 38 + 380, this.oY + 69, 76, 69, "Z", 15, this.Append), new Button02(a, "btn_u", this.oX + 38 + 456, this.oY + 69, 76, 69, "U", 15, 
  this.Append), new Button02(a, "btn_i", this.oX + 38 + 532, this.oY + 69, 76, 69, "I", 15, this.Append), new Button02(a, "btn_o", this.oX + 38 + 608, this.oY + 69, 76, 69, "O", 15, this.Append), new Button02(a, "btn_p", this.oX + 38 + 684, this.oY + 69, 76, 69, "P", 15, this.Append), new Button02(a, "btn_a", this.oX + 76, this.oY + 138, 76, 69, "A", 15, this.Append), new Button02(a, "btn_s", this.oX + 76 + 76, this.oY + 138, 76, 69, "S", 15, this.Append), new Button02(a, "btn_d", this.oX + 76 + 
  152, this.oY + 138, 76, 69, "D", 15, this.Append), new Button02(a, "btn_f", this.oX + 76 + 228, this.oY + 138, 76, 69, "F", 15, this.Append), new Button02(a, "btn_g", this.oX + 76 + 304, this.oY + 138, 76, 69, "G", 15, this.Append), new Button02(a, "btn_h", this.oX + 76 + 380, this.oY + 138, 76, 69, "H", 15, this.Append), new Button02(a, "btn_j", this.oX + 76 + 456, this.oY + 138, 76, 69, "J", 15, this.Append), new Button02(a, "btn_k", this.oX + 76 + 532, this.oY + 138, 76, 69, "K", 15, this.Append), 
  new Button02(a, "btn_l", this.oX + 76 + 608, this.oY + 138, 76, 69, "L", 15, this.Append), new Button02(a, "btn_y", this.oX + 38, this.oY + 207, 76, 69, "Y", 15, this.Append), new Button02(a, "btn_x", this.oX + 38 + 76, this.oY + 207, 76, 69, "X", 15, this.Append), new Button02(a, "btn_c", this.oX + 38 + 152, this.oY + 207, 76, 69, "C", 15, this.Append), new Button02(a, "btn_v", this.oX + 38 + 228, this.oY + 207, 76, 69, "V", 15, this.Append), new Button02(a, "btn_b", this.oX + 38 + 304, this.oY + 
  207, 76, 69, "B", 15, this.Append), new Button02(a, "btn_n", this.oX + 38 + 380, this.oY + 207, 76, 69, "N", 15, this.Append), new Button02(a, "btn_m", this.oX + 38 + 456, this.oY + 207, 76, 69, "M", 15, this.Append), new Button02(a, "btn_ae", this.oX + 38 + 532, this.oY + 207, 76, 69, "\u00c4", 15, this.Append), new Button02(a, "btn_oe", this.oX + 38 + 608, this.oY + 207, 76, 69, "\u00d6", 15, this.Append), new Button02(a, "btn_ue", this.oX + 38 + 684, this.oY + 207, 76, 69, "\u00dc", 15, this.Append), 
  new Button02(a, "btn_ue", this.oX + 760, this.oY + 276, 76, 69, "OK", 15, this.OnOkay)]
}
TouchKeyboard.prototype.Destroy = function() {
  this.layer.remove(this.shape);
  for(var a = 0;a < this.buttonArray.length;a++) {
    this.buttonArray[a].Destroy()
  }
  this.spaceButton.Destroy()
};
owg.gg.GlobeGame = {};
var m_images = {}, m_loadedImages = 0, m_numImages = 0, m_context = null, m_globe = null, m_stage = null, m_ui = null, m_static = null, m_centerX = window.innerWidth / 2, m_centerY = window.innerHeight / 2, m_lang = "de", m_locale = [], m_player = null, m_score = null, m_gameData = null, m_globeGame = null;
function GlobeGame(a) {
  this.state = GlobeGame.STATE.IDLE;
  this.qCount = 0;
  this.currentChallenge = null;
  this.callbacks = [];
  m_globeGame = this;
  m_stage = new Kinetic.Stage(a, window.innerWidth, window.innerHeight);
  m_ui = new Kinetic.Layer;
  m_static = new Kinetic.Layer
}
GlobeGame.STATE = {IDLE:0, CHALLENGE:1, HIGHSCORE:2};
GlobeGame.prototype.Init = function(a, b) {
  var d = this;
  m_gameData = new GameData(function() {
    var a = {btn_01:"art/btn_01.png", btn_01_c:"art/btn_01_c.png", btn_01_h:"art/btn_01_h.png", btn_01_d:"art/btn_01_d.png", btn_01_f:"art/btn_01_f.png", btn_01_t:"art/btn_01_t.png", btn_01_o:"art/btn_01_o.png", btn_02:"art/btn_02.png", btn_02_c:"art/btn_02_c.png", btn_02_h:"art/btn_02_h.png", clock:"art/clock.png", dial:"art/dial.png", pin_blue:"art/pin_blue.png", pin_red:"art/pin_red.png", pin_green:"art/pin_green.png", pin_yellow:"art/pin_yellow.png", nw_logo:"art/nw_logo.png"};
    d.LoadLanguage(function() {
      d.LoadImages(a, function() {
        var a = new Kinetic.Shape({drawFunc:function() {
          this.getContext().drawImage(m_images.nw_logo, 0, window.innerHeight - 82, 670, 82)
        }});
        m_static.add(a);
        d.EnterIdle()
      })
    })
  });
  m_context = ogCreateContextFromCanvas("canvas", !0);
  m_globe = ogCreateGlobe(m_context);
  ogAddImageLayer(m_globe, {url:["http://10.42.2.37"], layer:"bluemarble", service:"owg"});
  ogAddImageLayer(m_globe, {url:["http://10.42.2.37"], layer:"swissimage", service:"owg"});
  ogAddElevationLayer(m_globe, {url:["http://10.42.2.37"], layer:"DHM25", service:"owg"});
  b != null && ogSetRenderQuality(m_globe, b);
  ogSetRenderFunction(m_context, this.OnOGRender);
  ogSetResizeFunction(m_context, this.OnOGResize);
  m_stage.add(m_static);
  m_stage.add(m_ui);
  m_stage.onFrame(function(b) {
    d.OnCanvasRender(b);
    a(b)
  });
  m_stage.start()
};
GlobeGame.prototype.EnterIdle = function() {
  var a = this;
  (new MessageDialog(m_ui, m_locale.start, 500, 250)).RegisterCallback(function() {
    a.StopFlyTo();
    m_ui.setAlpha(0);
    a.EnterChallenge()
  });
  this.FlyAround()
};
GlobeGame.prototype.EnterChallenge = function() {
  this.state = GlobeGame.STATE.CHALLENGE;
  m_player = new Player("");
  m_score = new ScoreCount(m_ui);
  this.ProcessChallenge()
};
GlobeGame.prototype.EnterHighscore = function() {
  var a = this;
  m_ui.setAlpha(1);
  this.FlyAround();
  var b = new TouchKeyboard(m_ui, "keys", window.innerWidth / 2 - 426, window.innerHeight / 2 - 195, m_locale.entername, function(d) {
    m_player.playerName = d;
    b.Destroy();
    jQuery.get("db.php?action=append&name=" + m_player.playerName + "&score=" + m_player.playerScore, function(b) {
      b = eval(b);
      (new HighScoreDialog(m_ui, b, 500, 650, m_player)).RegisterCallback(function() {
        m_score && m_score.Destroy();
        m_gameData = new GameData(function() {
          a.StopFlyTo();
          m_ui.setAlpha(0);
          a.EnterChallenge()
        })
      })
    })
  })
};
GlobeGame.prototype.FlyAround = function() {
  var a = ogGetScene(m_context), b = ogGetActiveCamera(a);
  ogSetPosition(b, 8.006896018981934, 46.27399444580078, 1E7);
  ogSetOrientation(b, 0, -90, 0);
  var d = [{longitude:8.006896018981934, latitude:46.27399444580078, elevation:6440.3505859375, yaw:0.6147540983606554, pitch:-17.74590163934426, roll:0}, {longitude:8.078167915344238, latitude:46.43217849731445, elevation:3730.73583984375, yaw:-12.663934426229508, pitch:-5.737704918032784, roll:0}, {longitude:8.09277629852295, latitude:46.60940170288086, elevation:7909.09912109375, yaw:-50.9016393442623, pitch:-28.442622950819672, roll:0}, {longitude:7.97355318069458, latitude:46.78914260864258, 
  elevation:1968.3804931640625, yaw:-108.60655737704916, pitch:-18.360655737704917, roll:0}, {longitude:8.006896018981934, latitude:46.27399444580078, elevation:1E7, yaw:0, pitch:-90, roll:0}], c = 0;
  ogSetFlightDuration(a, 2E4);
  b = function() {
    var b = d[c];
    ogFlyTo(a, b.longitude, b.latitude, b.elevation, b.yaw, b.pitch, b.roll);
    c >= 4 ? c = 0 : c += 1
  };
  ogSetInPositionFunction(m_context, b);
  b()
};
GlobeGame.prototype.CycleCallback = function() {
  for(var a = 0;a < this.callbacks.length;a++) {
    this.callbacks[a][1]()
  }
};
GlobeGame.prototype.InitQuiz = function() {
  this.currentChallenge.Activate();
  this.state = 2
};
GlobeGame.prototype.RegisterCycleCallback = function(a, b) {
  this.callbacks.push([a, b])
};
GlobeGame.prototype.UnregisterCycleCallback = function(a) {
  for(var b = 0;b < this.callbacks.length;b++) {
    this.callbacks[b][0] == a && this.callbacks.splice(b, 1)
  }
};
GlobeGame.prototype.LoadImages = function(a, b) {
  for(var d in a) {
    m_numImages++
  }
  for(d in a) {
    m_images[d] = new Image, m_images[d].onload = function() {
      ++m_loadedImages >= m_numImages && b != null && b()
    }, m_images[d].src = a[d]
  }
};
GlobeGame.prototype.LoadLanguage = function(a) {
  jQuery.getJSON("data/lang_" + m_lang + ".json", function(b) {
    m_locale = b;
    a != null && a()
  })
};
GlobeGame.prototype.ProcessChallenge = function() {
  m_globeGame && (m_globeGame.currentChallenge && !m_globeGame.currentChallenge.destroyed ? m_globeGame.currentChallenge.Destroy(m_globeGame.NextChallenge) : m_globeGame.NextChallenge())
};
GlobeGame.prototype.NextChallenge = function() {
  m_gameData.questions.length > 0 ? (m_globeGame.currentChallenge = m_gameData.PickChallenge(), m_globeGame.currentChallenge.RegisterCallback(m_globeGame.ProcessChallenge), m_globeGame.InitQuiz()) : m_globeGame.EnterHighscore()
};
GlobeGame.prototype.StopFlyTo = function() {
  var a = ogGetScene(m_context);
  ogSetInPositionFunction(m_context, function() {
  });
  ogStopFlyTo(a)
};
GlobeGame.prototype.OnCanvasRender = function() {
  m_stage.draw();
  this.CycleCallback()
};
GlobeGame.prototype.OnOGRender = function() {
};
GlobeGame.prototype.OnOGResize = function() {
  m_stage.setSize(window.innerWidth, window.innerHeight);
  m_centerX = window.innerWidth / 2;
  m_centerY = window.innerHeight / 2
};
goog.exportSymbol("GlobeGame", GlobeGame);
goog.exportProperty(GlobeGame.prototype, "EnterIdle", GlobeGame.prototype.EnterIdle);
goog.exportProperty(GlobeGame.prototype, "EnterChallenge", GlobeGame.prototype.EnterChallenge);
goog.exportProperty(GlobeGame.prototype, "EnterHighscore", GlobeGame.prototype.EnterHighscore);
goog.exportProperty(GlobeGame.prototype, "CycleCallback", GlobeGame.prototype.CycleCallback);
goog.exportProperty(GlobeGame.prototype, "InitQuiz", GlobeGame.prototype.InitQuiz);
goog.exportProperty(GlobeGame.prototype, "ProcessChallenge", GlobeGame.prototype.ProcessChallenge);
goog.exportProperty(GlobeGame.prototype, "NextChallenge", GlobeGame.prototype.NextChallenge);
goog.exportProperty(GlobeGame.prototype, "RegisterCycleCallback", GlobeGame.prototype.RegisterCycleCallback);
goog.exportProperty(GlobeGame.prototype, "UnregisterCycleCallback", GlobeGame.prototype.UnregisterCycleCallback);
goog.exportProperty(GlobeGame.prototype, "LoadImages", GlobeGame.prototype.LoadImages);
goog.exportProperty(GlobeGame.prototype, "LoadLanguage", GlobeGame.prototype.LoadLanguage);
goog.exportProperty(GlobeGame.prototype, "Init", GlobeGame.prototype.Init);
goog.exportProperty(GlobeGame.prototype, "StopFlyTo", GlobeGame.prototype.StopFlyTo);
goog.exportProperty(GlobeGame.prototype, "OnOGResize", GlobeGame.prototype.OnOGResize);
goog.exportProperty(GlobeGame.prototype, "OnOGRender", GlobeGame.prototype.OnOGRender);
goog.exportProperty(GlobeGame.prototype, "OnCanvasRender", GlobeGame.prototype.OnCanvasRender);

