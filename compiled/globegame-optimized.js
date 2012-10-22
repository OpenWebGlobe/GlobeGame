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
  for(var c = a.split("."), d = b || goog.global, f;f = c.shift();) {
    if(goog.isDefAndNotNull(d[f])) {
      d = d[f]
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
    for(var d, a = a.replace(/\\/g, "/"), f = goog.dependencies_, e = 0;d = b[e];e++) {
      f.nameToPath[d] = a, a in f.pathToNames || (f.pathToNames[a] = {}), f.pathToNames[a][d] = !0
    }
    for(d = 0;b = c[d];d++) {
      a in f.requires || (f.requires[a] = {}), f.requires[a][b] = !0
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
          for(var h in d.requires[e]) {
            if(h in d.nameToPath) {
              a(d.nameToPath[h])
            }else {
              if(!goog.getObjectByName(h)) {
                throw Error("Undefined nameToPath for " + h);
              }
            }
          }
        }
        e in c || (c[e] = !0, b.push(e))
      }
    }
    var b = [], c = {}, d = goog.dependencies_, f;
    for(f in goog.included_) {
      d.written[f] || a(f)
    }
    for(f = 0;f < b.length;f++) {
      if(b[f]) {
        goog.importScript_(goog.basePath + b[f])
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
    var f = ("" + c[d]).replace(/\$/g, "$$$$"), a = a.replace(RegExp("\\{\\$" + d + "\\}", "gi"), f)
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
  for(var d = Array.prototype.slice.call(arguments, 2), f = !1, e = a.constructor;e;e = e.superClass_ && e.superClass_.constructor) {
    if(e.prototype[b] === c) {
      f = !0
    }else {
      if(f) {
        return e.prototype[b].apply(a, d)
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
owg.gg.FlyingText = {};
var m_hInc = 0;
function FlyingText(a, b, c) {
  this.text = b;
  this.fontcolor = c;
  this.alpha = this.scalefactor = 1;
  this.layer = a;
  var d = window.innerWidth / 2, f = window.innerHeight / 2 - 50, e = this, h = m_hInc * 60;
  m_hInc += 1;
  m_hInc >= 3 && (m_hInc = 0);
  var j = new Date, g;
  this.shape = new Kinetic.Shape({drawFunc:function() {
    g = new Date;
    var a = g.valueOf() - j.valueOf();
    e.alpha = 1 - a / 3500;
    e.scalefactor = 1 + a / 3500;
    if(e.alpha <= 0) {
      e.layer.remove(e.shape)
    }else {
      a = this.getContext();
      a.beginPath();
      a.font = "32pt LuckiestGuy";
      a.fillStyle = e.fontcolor;
      var b = d / e.scalefactor, c = (f - 200 + h) / e.scalefactor;
      a.textAlign = "center";
      a.fillText(e.text, b, c);
      a.lineWidth = 3;
      a.strokeStyle = "#000";
      a.strokeText(e.text, b, c);
      this.setScale(e.scalefactor, e.scalefactor);
      this.setAlpha(e.alpha)
    }
  }});
  a.add(this.shape)
}
goog.exportSymbol("FlyingText", FlyingText);
function Coins(a, b) {
  this.score = b;
  this.alpha = 1;
  this.layer = a;
  var c = this, d = 0;
  m_soundhandler.Play("coins");
  var f = new Date, e;
  this.shape = new Kinetic.Shape({drawFunc:function() {
    e = new Date;
    var a = e.valueOf() - f.valueOf();
    c.alpha = 1 - a / 3500;
    d += a / 300;
    if(c.alpha <= 0) {
      c.layer.remove(c.shape)
    }else {
      a = this.getContext();
      a.beginPath();
      a.font = "40pt LuckiestGuy";
      a.fillStyle = "#FE3";
      var b = 155 - d;
      a.textAlign = "left";
      a.fillText("+" + c.score, b, 75);
      a.lineWidth = 3;
      a.strokeStyle = "#000";
      a.strokeText("+" + c.score, b, 75);
      a.drawImage(m_images.coins, 248 - d, 20, 80, 100);
      this.setAlpha(c.alpha)
    }
  }});
  a.add(this.shape)
}
goog.exportSymbol("Coins", Coins);
function FadeOut(a) {
  var b = new Date, c, d = function() {
    c = new Date;
    m_ui.setAlpha(1 - (c.valueOf() - b.valueOf()) / 1E3);
    m_ui.getAlpha() > 0 ? setTimeout(function() {
      d()
    }, 0) : (m_ui.setAlpha(0), a())
  };
  d()
}
goog.exportSymbol("FadeOut", FadeOut);
function FadeIn(a) {
  var b = new Date, c, d = function() {
    c = new Date;
    m_ui.setAlpha(1 - (c.valueOf() - b.valueOf()) / 2E3);
    m_ui.getAlpha() < 1 ? setTimeout(function() {
      d()
    }, 0) : (m_ui.setAlpha(1), a())
  };
  d()
}
goog.exportSymbol("FadeIn", FadeIn);
function BlackScreen(a, b) {
  var c = new Kinetic.Rect({x:0, y:0, width:window.innerWidth, height:window.innerHeight, fill:"#000000", alpha:0});
  m_static.add(c);
  c.setZIndex(-100);
  var d = new Date, f, e = function() {
    f = new Date;
    var a = 0 + (f.valueOf() - d.valueOf()) / 800;
    c.setAlpha(a);
    a < 1 ? setTimeout(function() {
      e()
    }, 0) : c.setAlpha(1)
  }, h = function(a) {
    f = new Date;
    var b = 1 - (f.valueOf() - d.valueOf()) / 1E3;
    c.setAlpha(b);
    b > 0 ? setTimeout(function() {
      h(a)
    }, 0) : (c.setAlpha(1), a())
  };
  e();
  setTimeout(function() {
    d = new Date;
    h(function() {
      m_static.remove(c);
      b()
    })
  }, a)
}
goog.exportSymbol("FadeIn", FadeIn);
function Timeout(a, b) {
  var c = new Date, d = function(a, c, h) {
    c.valueOf() - a.valueOf() >= b ? h() : setTimeout(function() {
      d(a, new Date, h)
    }, 0)
  };
  setTimeout(function() {
    d(c, new Date, a)
  }, 0)
}
goog.exportSymbol("Timeout", Timeout);
owg.gg.SoundHandler = {};
function SoundHandler() {
  this.sounds = {}
}
SoundHandler.prototype.Play = function(a) {
  m_soundenabled && this.sounds[a].play()
};
goog.exportSymbol("SoundHandler", SoundHandler);
goog.exportProperty(SoundHandler.prototype, "Play", SoundHandler.prototype.Play);
owg.gg.Player = {};
function Player(a) {
  this.playerName = a;
  this.playerScore = 0
}
Player.prototype.ScorePoints = function(a, b) {
  new FlyingText(m_static, "+" + a + " " + m_locale.points + " " + b, "#FFEE11");
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
function Button01(a, b, c, d, f, e, h, j) {
  this.x = c;
  this.y = d;
  this.width = f;
  this.height = e;
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
    g.enabled == !1 ? a.drawImage(m_images.btn_01_d, c, d, f, e) : g.state == 0 ? a.drawImage(m_images.btn_01, c, d, f, e) : g.state == 1 ? a.drawImage(m_images.btn_01_h, c, d, f, e) : g.state == 2 ? (a.drawImage(m_images.btn_01_c, c, d, f, e), b = 2) : g.state == 3 ? a.drawImage(m_images.btn_01_t, c, d, f, e) : g.state == 4 ? a.drawImage(m_images.btn_01_f, c, d, f, e) : g.state == 5 && a.drawImage(m_images.btn_01_o, c, d, f, e);
    a.beginPath();
    a.rect(c, d, f, e);
    a.closePath();
    a.font = j + "pt TitanOne";
    a.fillStyle = "#FFF";
    var h = a.measureText(g.caption).width;
    a.measureText(g.caption);
    var k = c + b, b = d + 3 * (e / 5) + b;
    h <= f && (k = c + (f - h) / 2);
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
  this.shape.on("touchstart", function() {
    if(g.enabled && (g.onMouseDownEvent(), g.state < 3)) {
      g.state = 2
    }
  });
  this.shape.on("touchend", function() {
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
function Button02(a, b, c, d, f, e, h, j, g) {
  this.x = c;
  this.y = d;
  this.width = f;
  this.height = e;
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
    i.state == 0 ? a.drawImage(m_images.btn_02, c, d, f, e) : i.state == 1 ? a.drawImage(m_images.btn_02_h, c, d, f, e) : i.state == 2 && (a.drawImage(m_images.btn_02_c, c, d, f, e), b = 2);
    a.beginPath();
    a.rect(c, d, f, e);
    a.closePath();
    a.font = j + "pt TitanOne";
    a.fillStyle = "#FFF";
    var h = a.measureText(i.caption).width;
    a.measureText(i.caption);
    var g = c + b, b = d + 3 * (e / 5) + b;
    h <= f && (g = c + (f - h) / 2);
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
  this.shape.on("touchstart", function() {
    if(i.enabled && (i.onMouseDownEvent(), i.state < 3)) {
      i.state = 2
    }
  });
  this.shape.on("touchend", function() {
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
function Clock(a, b, c, d) {
  this.layer = a;
  this.x = b;
  this.y = c;
  this.seconds = d;
  this.visible = !0;
  this.obsolete = !1;
  var f = 2 / 60, e = this;
  this.running = !1;
  this.onTimeoutEvent = function() {
  };
  this.shape = new Kinetic.Shape({drawFunc:function() {
    if(e.visible == !0) {
      var a = this.getContext(), d = f * e.seconds - 0.5;
      a.drawImage(m_images.clock, b, c, 220, 260);
      a.beginPath();
      a.arc(b + 110, c + 153, 84, d * Math.PI, 1.5 * Math.PI, !1);
      a.lineTo(b + 110, c + 153);
      a.closePath();
      d = a.createPattern(m_images.dial, "no-repeat");
      a.fillStyle = d;
      a.translate(b + 25, c + 65);
      a.fill();
      a.fillStyle = e.seconds > 10 ? "#FFF" : "#F00";
      a.font = "40pt TitanOne";
      a.textAlign = "center";
      d = "" + e.seconds;
      a.fillText(d, 85, 110);
      a.lineWidth = 3;
      a.strokeStyle = "#000";
      a.strokeText(d, 85, 110)
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
      a.seconds > 0 ? a.Countdown() : (a.running = !1, m_soundhandler.Play("wrong"), a.onTimeoutEvent())
    }
  }, 1E3);
  this.running && (this.seconds -= 1, this.seconds <= 10 && m_soundhandler.Play("ping2"))
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
function ScreenText(a, b, c, d, f, e) {
  this.text = b;
  this.x = c;
  this.y = d;
  this.fontsize = f;
  this.align = e;
  this.layer = a;
  var h = this;
  this.shape = new Kinetic.Shape({drawFunc:function() {
    var a = this.getContext();
    a.textAlign = h.align;
    a.fillStyle = "#FFF";
    a.font = h.fontsize + "pt TitanOne";
    a.textAlign = h.align;
    a.fillText(h.text, h.x, h.y);
    a.lineWidth = 3;
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
function MessageDialog(a, b, c, d, f, e) {
  this.message = b;
  this.layer = a;
  this.okayButton = null;
  var h = this;
  this.Callback = function() {
  };
  this.OnOkay = function() {
    m_soundhandler.Play("ping1");
    h.Destroy();
    h.Callback()
  };
  this.shape = new Kinetic.Shape({drawFunc:function() {
    var a = this.getContext();
    a.beginPath();
    a.rect(c - f / 2, d - e / 2, f, e);
    var b = a.createLinearGradient(c, d - e / 2, c, d + e / 2);
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
    a.fillText(h.message, c, d - e / 2 + 80);
    a.lineWidth = 1;
    a.strokeStyle = "#000";
    a.strokeText(h.message, c, d - e / 2 + 80)
  }});
  a.add(this.shape);
  this.okayButton = new Button01(m_ui, "dialog", c - 150, d + e / 2 - 100, 300, 69, "OK", 15);
  this.okayButton.onClickEvent = h.OnOkay
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
    var c = a.createLinearGradient(10, 10, 10, 50);
    c.addColorStop(0, "#555");
    c.addColorStop(1, "#CCC");
    a.fillStyle = c;
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
function ProgressCount(a, b) {
  this.layer = a;
  this.qCount = 0;
  this.qMax = b;
  var c = this;
  this.shape = new Kinetic.Shape({drawFunc:function() {
    var a = this.getContext();
    a.fillStyle = "#FFF";
    a.font = "26pt TitanOne";
    a.textAlign = "left";
    a.fillText(c.qCount + "/" + c.qMax, 245, 47);
    a.lineWidth = 2;
    a.strokeStyle = "#000";
    a.strokeText(c.qCount + "/" + c.qMax, 245, 47)
  }});
  a.add(this.shape)
}
ProgressCount.prototype.Inc = function() {
  this.qCount += 1
};
ProgressCount.prototype.Destroy = function() {
  this.layer.remove(this.shape)
};
goog.exportSymbol("ProgressCount", ProgressCount);
goog.exportProperty(ProgressCount.prototype, "Destroy", ProgressCount.prototype.Destroy);
goog.exportProperty(ProgressCount.prototype, "Inc", ProgressCount.prototype.Inc);
function Pin(a, b, c, d) {
  this.layer = a;
  var f = this;
  this.x = c;
  this.y = d;
  this.visible = !0;
  this.shape = new Kinetic.Shape({drawFunc:function() {
    if(f.visible == !0) {
      var a = this.getContext();
      a.beginPath();
      a.drawImage(b, f.x - 74, f.y - 132, 86, 144)
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
function HighScoreDialog(a, b, c, d, f) {
  this.list = b;
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
    a.rect(window.innerWidth / 2 - c / 2, window.innerHeight / 2 - d / 2, c, d);
    var b = a.createLinearGradient(window.innerWidth / 2, window.innerHeight / 2 - d / 2, window.innerWidth / 2, window.innerHeight / 2 + d / 2);
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
    a.fillText(m_locale.highscores, window.innerWidth / 2, window.innerHeight / 2 - d / 2 + 45);
    a.strokeText(m_locale.highscores, window.innerWidth / 2, window.innerHeight / 2 - d / 2 + 45);
    a.font = "12pt TitanOne";
    a.lineWidth = 1;
    a.fillStyle = "#FFF";
    a.textAlign = "left";
    a.fillText("Swizz-Quiz Entwicklung:", 20, window.innerHeight - 110);
    a.strokeText("Swizz-Quiz Entwicklung:", 20, window.innerHeight - 110);
    a.fillText("Institut Vermessung und Geoinformation", 20, window.innerHeight - 95);
    a.strokeText("Institut Vermessung und Geoinformation", 20, window.innerHeight - 95);
    a.fillText("Robert W\u00fcest (robert.wueest@fhnw.ch)", 26, window.innerHeight - 78);
    a.strokeText("Robert W\u00fcest (robert.wueest@fhnw.ch)", 26, window.innerHeight - 78);
    a.fillText("Martin Christen (martin.christen@fhnw.ch)", 26, window.innerHeight - 65);
    a.strokeText("Martin Christen (martin.christen@fhnw.ch)", 26, window.innerHeight - 65);
    a.font = "15pt TitanOne";
    a.textAlign = "center";
    a.lineWidth = 2;
    for(b = 1;b <= e.list.length;b++) {
      a.fillStyle = b == 1 ? "#FFAA33" : f.playerName == e.list[b - 1][0] && f.playerScore == e.list[b - 1][2] ? "#0FF" : "#FFF";
      var g = b + ". " + e.list[b - 1][0] + "  " + e.list[b - 1][2];
      a.fillText(g, window.innerWidth / 2, window.innerHeight / 2 - d / 2 + 75 + b * 22);
      a.lineWidth = 1;
      a.strokeText(g, window.innerWidth / 2, window.innerHeight / 2 - d / 2 + 75 + b * 22)
    }
  }});
  a.add(this.shape);
  this.okayButton = new Button01(m_ui, "dialog", window.innerWidth / 2 - 150, window.innerHeight / 2 + d / 2 - 100, 300, 69, m_locale.playagain, 15);
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
  this.Prepare = function() {
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
function LandmarkChallenge(a, b, c, d, f) {
  this.correctOption = c;
  this.options = b;
  this.baseScore = a;
  this.views = d;
  this.flystate = 1;
  this.text = f;
  this.stop = !1;
  this.clock = null;
  this.buttonArray = [];
  this.screenText = null;
  var e = this;
  this.onOption1 = function() {
    e.PickOption(1, e.clock.GetSeconds())
  };
  this.onOption2 = function() {
    e.PickOption(2, e.clock.GetSeconds())
  };
  this.onOption3 = function() {
    e.PickOption(3, e.clock.GetSeconds())
  };
  this.onOption4 = function() {
    e.PickOption(4, e.clock.GetSeconds())
  };
  this.FlightCallback = function() {
    if(e.stop != !0 && e.flystate < e.views.length) {
      var a = e.views[e.flystate];
      e.flystate += 1;
      ogFlyTo(m_scene, a.longitude, a.latitude, a.elevation, a.yaw, a.pitch, a.roll);
      m_flystate = GlobeGame.FLYSTATE.FLYAROUND
    }
  }
}
LandmarkChallenge.prototype = new Challenge(0);
LandmarkChallenge.prototype.constructor = LandmarkChallenge;
LandmarkChallenge.prototype.Prepare = function(a) {
  var b = null, c = null, d = null, f = null, e = this, h = function() {
    b = new Button01(m_ui, "btn1", m_centerX - 310, window.innerHeight - 239, 300, 69, e.options[0], 15);
    b.onClickEvent = e.onOption1;
    c = new Button01(m_ui, "btn2", m_centerX + 10, window.innerHeight - 239, 300, 69, e.options[1], 15);
    c.onClickEvent = e.onOption2;
    d = new Button01(m_ui, "btn3", m_centerX - 310, window.innerHeight - 150, 300, 69, e.options[2], 15);
    d.onClickEvent = e.onOption3;
    f = new Button01(m_ui, "btn4", m_centerX + 10, window.innerHeight - 150, 300, 69, e.options[3], 15);
    f.onClickEvent = e.onOption4;
    e.buttonArray.push(b);
    e.buttonArray.push(c);
    e.buttonArray.push(d);
    e.buttonArray.push(f);
    e.screenText = new ScreenText(m_ui, e.text, m_centerX, window.innerHeight - 255, 26, "center");
    e.clock = new Clock(m_ui, 50, 75, 60);
    ogSetFlightDuration(m_scene, Math.floor(40 / (e.views.length - 1)) * 1E3);
    ogSetPosition(m_camera, e.views[0].longitude, e.views[0].latitude, e.views[0].elevation);
    ogSetOrientation(m_camera, e.views[0].yaw, e.views[0].pitch, e.views[0].roll);
    ogSetInPositionFunction(m_context, e.FlightCallback)
  };
  a > 0 ? setTimeout(h, a) : h()
};
LandmarkChallenge.prototype.Activate = function() {
  var a = this;
  FadeIn(function() {
    a.clock.onTimeoutEvent = function() {
      a.callback()
    };
    a.clock.Start();
    a.FlightCallback()
  })
};
LandmarkChallenge.prototype.Destroy = function(a) {
  if(!this.destroyed) {
    this.eventDestroyed = a, this.clock.Pause(), ogSetInPositionFunction(m_context, function() {
    }), this.stop = !0, ogStopFlyTo(m_scene), this.OnDestroy(), this.destroyed = !0
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
  var c = this;
  if(this.correctOption == a) {
    m_soundhandler.Play("correct");
    if(m_player) {
      var d = 0;
      m_player.ScorePoints(this.baseScore, "");
      d += this.baseScore;
      m_player.ScorePoints(Math.floor(b / 5), m_locale.timebonus);
      d += Math.floor(b / 5);
      b > 50 && (m_player.ScorePoints(20, m_locale.speedbonus), d += 20);
      Timeout(function() {
        new Coins(m_ui, d)
      }, 1E3)
    }
    this.buttonArray[a - 1].SetEnabled(!0);
    this.buttonArray[a - 1].SetState(3)
  }else {
    m_soundhandler.Play("wrong"), this.buttonArray[a - 1].SetEnabled(!0), this.buttonArray[this.correctOption - 1].SetEnabled(!0), this.buttonArray[a - 1].SetState(4), this.buttonArray[this.correctOption - 1].SetState(5)
  }
  setTimeout(function() {
    c.callback()
  }, 2E3)
};
goog.exportSymbol("LandmarkChallenge", LandmarkChallenge);
goog.exportProperty(LandmarkChallenge.prototype, "Prepare", LandmarkChallenge.prototype.Prepare);
goog.exportProperty(LandmarkChallenge.prototype, "Activate", LandmarkChallenge.prototype.Activate);
goog.exportProperty(LandmarkChallenge.prototype, "Destroy", LandmarkChallenge.prototype.Destroy);
goog.exportProperty(LandmarkChallenge.prototype, "OnDestroy", LandmarkChallenge.prototype.OnDestroy);
goog.exportProperty(LandmarkChallenge.prototype, "PickOption", LandmarkChallenge.prototype.PickOption);
goog.exportProperty(LandmarkChallenge.prototype, "RegisterCallback", LandmarkChallenge.prototype.RegisterCallback);
owg.gg.PickingChallenge = {};
function PickingChallenge(a, b, c) {
  this.screenText = null;
  this.baseScore = a;
  this.text = b;
  var d = this;
  this.zoomState = this.flystate = !1;
  this.pickPos = [null, 0, 0, 0];
  this.solutionPos = c;
  this.pickOverlay = this.okayBtn = this.distancText = this.line = this.resultPin = this.posPin = null;
  this.mouseLock = !1;
  this.hint = this.distanceLine = this.ogFrameLayer = this.clock = null;
  this.OnOkay = function() {
    var a = ogToCartesian(m_scene, d.solutionPos[0], d.solutionPos[1], d.solutionPos[2]), b = ogWorldToWindow(m_scene, a[0], a[1], a[2]), c = ogCalcDistanceWGS84(d.solutionPos[0], d.solutionPos[1], d.pickPos[1], d.pickPos[2]), c = Math.round(c / 1E3 * Math.pow(10, 1)) / Math.pow(10, 1);
    d.resultPin.SetPos(b[0], b[1]);
    m_soundhandler.Play("ping1");
    if(d.posPin) {
      d.distanceLine = new Kinetic.Shape({drawFunc:function() {
        var a = this.getContext();
        a.moveTo(b[0], b[1]);
        a.lineTo(d.posPin.x, d.posPin.y);
        a.lineWidth = 3;
        a.strokeStyle = "#DD6600";
        a.stroke();
        a.textAlign = "center";
        a.fillStyle = "#FF0";
        a.font = "16pt TitanOne";
        a.textAlign = "left";
        a.fillText(c + "km", b[0], b[1]);
        a.lineWidth = 2;
        a.strokeStyle = "#000";
        a.strokeText(c + "km", b[0], b[1])
      }}), m_ui.add(d.distanceLine)
    }
    if(m_player && c < 50) {
      var j = 0;
      m_player.ScorePoints(Math.floor(d.baseScore / 50 * (50 - c)), m_locale.estimation);
      j += Math.floor(d.baseScore / 50 * (50 - c));
      m_player.ScorePoints(Math.floor(d.clock.seconds / 5), m_locale.timebonus);
      j += Math.floor(d.clock.seconds / 5);
      d.clock.seconds > 50 && (m_player.ScorePoints(20, m_locale.speedbonus), j += 20);
      Timeout(function() {
        new Coins(m_ui, j)
      }, 1E3)
    }
    setTimeout(function() {
      d.callback()
    }, 2500)
  };
  this.MouseOverOkBtn = function() {
    d.mouseLock = !0
  };
  this.MouseOutOkBtn = function() {
    d.mouseLock = !1
  };
  this.OnMouseDown = function() {
    if(d.hint) {
      m_ui.remove(d.hint), d.hint = null
    }
    if(d.mouseLock == !1) {
      var a = m_stage.getMousePosition();
      d.posPin && d.posPin.SetPos(a.x, a.y);
      d.flystate == !0 && ogStopFlyTo(m_scene);
      var b = ogGetOrientation(m_scene), c = ogPickGlobe(m_scene, a.x, a.y);
      d.ZoomIn(c, b);
      m_soundhandler.Play("swoosh");
      if(d.posPin == null) {
        d.posPin = new Pin(m_ui, m_images.pin_blue, a.x, a.y)
      }
      d.zoomState = !0
    }
  };
  this.OnMouseUp = function() {
    if(d.mouseLock == !1) {
      d.zoomState = !1;
      var a = m_stage.getMousePosition();
      d.pickPos = ogPickGlobe(m_scene, a.x, a.y);
      m_soundhandler.Play("pick");
      d.posPin != null && d.posPin.SetVisible(!1);
      d.flystate == !0 && ogStopFlyTo(m_scene);
      d.ZoomOut()
    }
  };
  this.OnMouseMove = function() {
    if(d.zoomState == !0) {
      var a = m_stage.getMousePosition();
      d.posPin != null && d.posPin.SetPos(a.x, a.y)
    }
  };
  this.FlightCallback = function() {
    d.flystate = !1;
    var a = ogWorldToWindow(m_scene, d.pickPos[4], d.pickPos[5], d.pickPos[6]);
    d.posPin != null && (d.posPin.SetVisible(!0), d.posPin.SetPos(a[0], a[1]))
  }
}
PickingChallenge.prototype = new Challenge(1);
PickingChallenge.prototype.constructor = PickingChallenge;
PickingChallenge.prototype.Prepare = function(a) {
  var b = this, c = function() {
    b.screenText = new ScreenText(m_ui, b.text, m_centerX, window.innerHeight - 255, 26, "center");
    b.pickOverlay = new Kinetic.Rect({x:0, y:0, width:window.innerWidth, height:window.innerHeight});
    b.pickOverlay.on("mousedown", b.OnMouseDown);
    b.pickOverlay.on("mouseup", b.OnMouseUp);
    b.pickOverlay.on("mousemove", b.OnMouseMove);
    m_ui.add(b.pickOverlay);
    b.okayBtn = new Button01(m_ui, "okbtn1", m_centerX - 150, window.innerHeight - 180, 300, 69, "OK", 15);
    b.resultPin = new Pin(m_ui, m_images.pin_green, -1, -1);
    b.okayBtn.onClickEvent = b.OnOkay;
    b.okayBtn.onMouseOverEvent = b.MouseOverOkBtn;
    b.okayBtn.onMouseOutEvent = b.MouseOutOkBtn;
    b.hint = new Kinetic.Shape({drawFunc:function() {
      var a = this.getContext();
      a.beginPath();
      a.font = "22pt TitanOne";
      a.fillStyle = "#0FF";
      a.textAlign = "center";
      a.fillText(m_locale.pickhint, window.innerWidth / 2, window.innerHeight / 2);
      a.lineWidth = 3;
      a.strokeStyle = "#000";
      a.strokeText(m_locale.pickhint, window.innerWidth / 2, window.innerHeight / 2)
    }});
    m_ui.add(b.hint);
    b.clock = new Clock(m_ui, 50, 75, 60);
    ogSetPosition(m_camera, 8.225578, 46.8248707, 28E4);
    ogSetOrientation(m_camera, 0, -90, 0);
    ogSetInPositionFunction(m_context, b.FlightCallback);
    b.ogFrameLayer = ogAddImageLayer(m_globe, {url:[m_datahost], layer:"ch_boundaries", service:"owg"})
  };
  a > 0 ? setTimeout(function() {
    c()
  }, a) : c()
};
PickingChallenge.prototype.Activate = function() {
  var a = this;
  FadeIn(function() {
    a.clock.onTimeoutEvent = function() {
      a.callback()
    };
    a.clock.Start()
  })
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
  this.hint && m_ui.remove(a.hint);
  this.draftmode ? (a.screenText.Destroy(), a.resultPin.Destroy(), a.posPin && (a.posPin.Destroy(), a.distanceLine && m_ui.remove(a.distanceLine)), a.okayBtn.Destroy(), m_ui.remove(a.pickOverlay), ogRemoveImageLayer(a.ogFrameLayer), a.eventDestroyed()) : FadeOut(function() {
    a.screenText.Destroy();
    a.resultPin.Destroy();
    a.posPin && (a.posPin.Destroy(), a.distanceLine && m_ui.remove(a.distanceLine));
    a.okayBtn.Destroy();
    m_ui.remove(a.pickOverlay);
    setTimeout(function() {
      ogRemoveImageLayer(a.ogFrameLayer)
    }, 700);
    a.eventDestroyed()
  })
};
PickingChallenge.prototype.ZoomIn = function(a) {
  this.flystate = !0;
  ogSetFlightDuration(m_scene, 500);
  ogFlyToLookAtPosition(m_scene, a[1], a[2], a[3], 26E3, 0, -90, 0);
  m_flystate = GlobeGame.FLYSTATE.FLYAROUND
};
PickingChallenge.prototype.ZoomOut = function() {
  this.flystate = !0;
  ogSetFlightDuration(m_scene, 350);
  ogFlyTo(m_scene, 8.225578, 46.8248707, 28E4, 0, -90, 0);
  m_flystate = GlobeGame.FLYSTATE.FLYAROUND
};
goog.exportSymbol("PickingChallenge", PickingChallenge);
goog.exportProperty(PickingChallenge.prototype, "Prepare", PickingChallenge.prototype.Prepare);
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
  jQuery.get("getChallenges.php?lang=" + m_lang, function(c) {
    var c = jQuery.parseJSON(c), d = [];
    jQuery.each(c, function(a, b) {
      if(b.Type == 0) {
        var c = b.BaseScore, j = b.Title, c = new LandmarkChallenge(c, b.Options, b.CorrectOption, b.Views, j);
        d.push(c)
      }else {
        if(b.Type == 1) {
          var g = b.Longitude, i = b.Latitude, l = b.Elevation, c = b.BaseScore, j = b.Title, c = new PickingChallenge(c, j, [g, i, l]);
          d.push(c)
        }
      }
    });
    b.questions = d;
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
function TouchKeyboard(a, b, c, d, f, e) {
  this.caption = f;
  this.callback = e;
  this.layer = a;
  this.x = c;
  this.y = d;
  this.oX = c + 8;
  this.oY = d + 38;
  this.input = "";
  var h = this;
  this.shape = new Kinetic.Shape({drawFunc:function() {
    var a = this.getContext();
    a.beginPath();
    a.rect(h.x, h.y, 853, 390);
    var b = a.createLinearGradient(c, d, c, d + 390);
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
    a.fillText(f + h.input + "_", c + 20, d + 30);
    a.lineWidth = 1;
    a.strokeStyle = "#000";
    a.strokeText(f + h.input + "_", c + 20, d + 30)
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
GlobeGame.STATE = {IDLE:0, CHALLENGE:1, HIGHSCORE:2};
GlobeGame.FLYSTATE = {IDLE:0, FLYAROUND:1};
var m_images = {}, m_loadedImages = 0, m_numImages = 0, m_loadedSounds = 0, m_numSounds = 0, m_context = null, m_globe = null, m_scene = null, m_stage = null, m_ui = null, m_static = null, m_camera = null, m_centerX = window.innerWidth / 2, m_centerY = window.innerHeight / 2, m_lang = "none", m_datahost = "http://localhost", m_locale = [], m_player = null, m_qCount = 0, m_qMax = 10, m_progress = null, m_soundhandler = new SoundHandler, m_soundenabled = !0, m_state = GlobeGame.STATE.IDLE, m_flystate = 
GlobeGame.FLYSTATE.IDLE, m_score = null, m_gameData = null, m_globeGame = null, m_debug = !1, m_loaded = !1;
function GlobeGame(a, b, c) {
  b && (m_datahost = b);
  m_qCount = 0;
  this.currentChallenge = null;
  this.callbacks = [];
  m_globeGame = this;
  m_stage = new Kinetic.Stage(a, window.innerWidth, window.innerHeight);
  m_ui = new Kinetic.Layer;
  m_static = new Kinetic.Layer;
  m_soundenabled = c
}
GlobeGame.prototype.Init = function(a, b) {
  var c = this, d = {btn_01:"art/btn_01.png", btn_01_c:"art/btn_01_c.png", btn_01_h:"art/btn_01_h.png", btn_01_d:"art/btn_01_d.png", btn_01_f:"art/btn_01_f.png", btn_01_t:"art/btn_01_t.png", btn_01_o:"art/btn_01_o.png", btn_02:"art/btn_02.png", btn_02_c:"art/btn_02_c.png", btn_02_h:"art/btn_02_h.png", clock:"art/clock.png", dial:"art/dial.png", pin_blue:"art/pin_blue.png", pin_red:"art/pin_red.png", pin_green:"art/pin_green.png", pin_yellow:"art/pin_yellow.png", nw_logo:"art/nw_logo.png", logo:"art/logo.png", 
  logo_sm:"art/logo_sm.png", coins:"art/coins.png"}, f = new ScreenText(m_ui, "Loading sounds...", m_centerX, m_centerY, 25, "center");
  c.LoadSounds({pick:"sfx/pick.wav", correct:"sfx/correct.wav", wrong:"sfx/wrong.wav", coins:"sfx/coins.wav", highscores:"sfx/highscores.mp3", track01:"sfx/track01.mp3", track02:"sfx/track02.mp3", track03:"sfx/track03.mp3", track04:"sfx/track04.mp3", swoosh:"sfx/swoosh.wav", ping1:"sfx/ping1.wav", ping2:"sfx/ping2.wav"}, function() {
    f.text = "Loading images...";
    c.LoadImages(d, function() {
      f.text = "Choose language";
      var a = function() {
        f.text = "Loading language...";
        c.LoadLanguage(function() {
          if(!m_loaded) {
            m_loaded = !0;
            f.Destroy();
            var a = new Kinetic.Shape({drawFunc:function() {
              var a = this.getContext();
              a.drawImage(m_images.nw_logo, 1, window.innerHeight - 58, 469, 57);
              m_state != GlobeGame.STATE.CHALLENGE ? a.drawImage(m_images.logo, window.innerWidth / 2 - 352, 30, 705, 206) : a.drawImage(m_images.logo_sm, window.innerWidth - 260, 4, 254, 50);
              a.textAlign = "right";
              a.fillStyle = "#FFF";
              a.font = "18pt TitanOne";
              a.fillText("www.openwebglobe.org", window.innerWidth - 13, window.innerHeight - 30);
              a.lineWidth = 1;
              a.strokeStyle = "#000";
              a.strokeText("www.openwebglobe.org", window.innerWidth - 13, window.innerHeight - 30);
              a.fillStyle = "#FFF";
              a.font = "13pt TitanOne";
              a.fillText("SWISSIMAGE, DHM25 \u00a9 swisstopo JD100033", window.innerWidth - 13, window.innerHeight - 10);
              a.lineWidth = 1;
              a.strokeStyle = "#000";
              a.strokeText("SWISSIMAGE, DHM25 \u00a9 swisstopo JD100033", window.innerWidth - 13, window.innerHeight - 10);
              if(m_debug) {
                a.fillStyle = "#F00", a.font = "8pt TitanOne", a.textAlign = "left", a.fillText("State:" + m_state, 5, 80), a.fillText("Flystate:" + m_flystate, 5, 90)
              }
            }});
            m_static.add(a);
            if(m_soundenabled) {
              m_soundhandler.sounds.track01.volume = 0.25, m_soundhandler.sounds.track01.addEventListener("ended", function() {
                m_soundhandler.sounds.track02.play()
              }, !0), m_soundhandler.sounds.track02.volume = 0.25, m_soundhandler.sounds.track02.addEventListener("ended", function() {
                m_soundhandler.sounds.track03.play()
              }, !0), m_soundhandler.sounds.track03.volume = 0.25, m_soundhandler.sounds.track03.addEventListener("ended", function() {
                m_soundhandler.sounds.track04.play()
              }, !0), m_soundhandler.sounds.track04.volume = 0.25, m_soundhandler.sounds.track04.addEventListener("ended", function() {
                m_soundhandler.sounds.track01.play()
              }, !0), m_soundhandler.sounds["track0" + Math.floor(Math.random() * 4 + 1)].play()
            }
            m_gameData = new GameData(function() {
              c.EnterIdle()
            })
          }
        })
      }, b = new Button02(m_ui, "btn_de", window.innerWidth / 2 - 120, 300, 76, 69, "DEU", 15, function() {
        m_lang = "de";
        b.Destroy();
        d.Destroy();
        g.Destroy();
        a()
      }), d = new Button02(m_ui, "btn_fr", window.innerWidth / 2 - 40, 300, 76, 69, "FRA", 15, function() {
        m_lang = "fr";
        b.Destroy();
        d.Destroy();
        g.Destroy();
        a()
      }), g = new Button02(m_ui, "btn_en", window.innerWidth / 2 + 40, 300, 76, 69, "ENG", 15, function() {
        m_lang = "en";
        b.Destroy();
        d.Destroy();
        g.Destroy();
        a()
      })
    })
  });
  m_context = ogCreateContext({canvas:"canvas", fullscreen:!0});
  m_scene = ogCreateScene(m_context, OG_SCENE_3D_ELLIPSOID_WGS84, {rendertotexture:!1});
  m_globe = ogCreateWorld(m_scene);
  m_camera = ogGetActiveCamera(m_scene);
  ogAddImageLayer(m_globe, {url:[m_datahost], layer:"bluemarble", service:"owg"});
  ogAddImageLayer(m_globe, {url:[m_datahost], layer:"swissimage", service:"owg"});
  ogAddElevationLayer(m_globe, {url:[m_datahost], layer:"DHM25", service:"owg"});
  b != null && ogSetRenderQuality(m_globe, b);
  ogSetRenderFunction(m_context, this.OnOGRender);
  ogSetResizeFunction(m_context, this.OnOGResize);
  m_stage.add(m_static);
  m_stage.add(m_ui);
  m_stage.onFrame(function(b) {
    c.OnCanvasRender(b);
    a(b)
  });
  m_stage.start()
};
GlobeGame.prototype.EnterIdle = function() {
  var a = this;
  m_state = GlobeGame.STATE.IDLE;
  (new MessageDialog(m_ui, m_locale.start, window.innerWidth / 2, window.innerHeight - 200, 500, 220)).RegisterCallback(function() {
    a.StopFlyTo();
    m_ui.setAlpha(0);
    a.EnterChallenge()
  });
  this.FlyAround()
};
GlobeGame.prototype.EnterChallenge = function() {
  m_state = GlobeGame.STATE.CHALLENGE;
  m_player = new Player("");
  m_score = new ScoreCount(m_ui);
  m_progress = new ProgressCount(m_ui, m_qMax);
  this.ProcessChallenge()
};
GlobeGame.prototype.EnterHighscore = function() {
  var a = this;
  m_progress && m_progress.Destroy();
  m_ui.setAlpha(1);
  m_state = GlobeGame.STATE.HIGHSCORE;
  this.FlyAround();
  var b = new TouchKeyboard(m_ui, "keys", window.innerWidth / 2 - 426, window.innerHeight / 2 - 195, m_locale.entername, function(c) {
    m_player.playerName = c;
    b.Destroy();
    m_soundhandler.Play("highscores");
    jQuery.get("db.php?action=append&name=" + m_player.playerName + "&score=" + m_player.playerScore, function(b) {
      b = eval(b);
      (new HighScoreDialog(m_ui, b, 500, 650, m_player)).RegisterCallback(function() {
        m_score && m_score.Destroy();
        m_qCount = 0;
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
  m_flystate = GlobeGame.FLYSTATE.FLYAROUND;
  ogSetPosition(m_camera, 8.006896018981934, 46.27399444580078, 1E7);
  ogSetOrientation(m_camera, 0, -90, 0);
  var a = [{longitude:8.006896018981934, latitude:46.27399444580078, elevation:6440.3505859375, yaw:0.6147540983606554, pitch:-17.74590163934426, roll:0}, {longitude:8.078167915344238, latitude:46.43217849731445, elevation:3730.73583984375, yaw:-12.663934426229508, pitch:-5.737704918032784, roll:0}, {longitude:8.09277629852295, latitude:46.60940170288086, elevation:7909.09912109375, yaw:-50.9016393442623, pitch:-28.442622950819672, roll:0}, {longitude:7.97355318069458, latitude:46.78914260864258, 
  elevation:1968.3804931640625, yaw:-108.60655737704916, pitch:-18.360655737704917, roll:0}, {longitude:8.006896018981934, latitude:46.27399444580078, elevation:1E7, yaw:0, pitch:-90, roll:0}], b = 0;
  ogSetFlightDuration(m_scene, 2E4);
  var c = function() {
    var c = a[b];
    ogFlyTo(m_scene, c.longitude, c.latitude, c.elevation, c.yaw, c.pitch, c.roll);
    b >= 4 ? b = 0 : b += 1
  };
  ogSetInPositionFunction(m_context, c);
  c()
};
GlobeGame.prototype.CycleCallback = function() {
  for(var a = 0;a < this.callbacks.length;a++) {
    this.callbacks[a][1]()
  }
};
GlobeGame.prototype.InitQuiz = function() {
  this.currentChallenge.Activate()
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
  for(var c in a) {
    m_numImages++
  }
  for(c in a) {
    m_images[c] = new Image, m_images[c].onload = function() {
      ++m_loadedImages >= m_numImages && b != null && b()
    }, m_images[c].src = a[c]
  }
};
GlobeGame.prototype.LoadSounds = function(a, b) {
  if(m_soundenabled) {
    for(var c in a) {
      m_numSounds++
    }
    for(c in a) {
      m_soundhandler.sounds[c] = document.createElement("audio"), m_soundhandler.sounds[c].setAttribute("src", a[c]), m_soundhandler.sounds[c].load(), m_soundhandler.sounds[c].addEventListener("canplay", function() {
        ++m_loadedSounds >= m_numSounds && b != null && b()
      }, !0)
    }
  }else {
    b()
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
  m_qCount += 1;
  m_progress.Inc();
  m_qCount <= m_qMax ? (m_globeGame.currentChallenge = m_gameData.PickChallenge(), m_globeGame.currentChallenge.RegisterCallback(m_globeGame.ProcessChallenge), m_globeGame.currentChallenge.Prepare(1E3), BlackScreen(3500, function() {
    m_globeGame.InitQuiz()
  })) : (setTimeout(function() {
    m_globeGame.EnterHighscore()
  }, 1500), BlackScreen(3500, function() {
  }))
};
GlobeGame.prototype.StopFlyTo = function() {
  ogSetInPositionFunction(m_context, function() {
  });
  ogStopFlyTo(m_scene);
  m_flystate = GlobeGame.FLYSTATE.IDLE
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

