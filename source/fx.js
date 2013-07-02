/*******************************************************************************
 #      ____               __          __  _      _____ _       _               #
 #     / __ \              \ \        / / | |    / ____| |     | |              #
 #    | |  | |_ __   ___ _ __ \  /\  / /__| |__ | |  __| | ___ | |__   ___      #
 #    | |  | | '_ \ / _ \ '_ \ \/  \/ / _ \ '_ \| | |_ | |/ _ \| '_ \ / _ \     #
 #    | |__| | |_) |  __/ | | \  /\  /  __/ |_) | |__| | | (_) | |_) |  __/     #
 #     \____/| .__/ \___|_| |_|\/  \/ \___|_.__/ \_____|_|\___/|_.__/ \___|     #
 #           | |                                                                #
 #           |_|                 _____ _____  _  __                             #
 #                              / ____|  __ \| |/ /                             #
 #                             | (___ | |  | | ' /                              #
 #                              \___ \| |  | |  <                               #
 #                              ____) | |__| | . \                              #
 #                             |_____/|_____/|_|\_\                             #
 #                                                                              #
 #                              (c) 2011-2012 by                                #
 #           University of Applied Sciences Northwestern Switzerland            #
 #                     Institute of Geomatics Engineering                       #
 #                          Author:robert.wst@gmail.com                         #
 ********************************************************************************
 *     Licensed under MIT License. Read the file LICENSE for more information   *
 *******************************************************************************/
/* Effects */
goog.provide('owg.gg.FlyingText');
var m_hInc = 0;
//-----------------------------------------------------------------------------
/**
 * @class FlyingText
 * @constructor
 *
 * @description splash text flying around
 *
 * @author Robert Wüest robert.wst@gmail.ch
 *
 * @param {Object} layer
 * @param {string} text
 * @param {string} fontcolor
 */
function FlyingText(layer, text, fontcolor) {
   this.text = text;
   this.fontcolor = fontcolor;
   this.scalefactor = 1.0;
   this.alpha = 1.0;
   this.layer = layer;
   this.destroyed = false;
   var x0 = (window.innerWidth / 2);
   var y0 = window.innerHeight / 2 - 75;
   var that = this;
   var rY = m_hInc * 60;
   m_hInc += 1;
   if (m_hInc >= 3)
      m_hInc = 0;

   var t0 = new Date();
   var t1;
   var uniqueId = m_globeGame.GenerateUniqueId();
   this.shape = new Kinetic.Shape({drawFunc: function (canvas) {
      t1 = new Date();
      var delta = t1.valueOf() - t0.valueOf();
      that.alpha = 1.0 - (delta / 1800);
      that.scalefactor = 1.0 + (delta / 1800);
      if (that.alpha <= 0.0) {
         this.destroyed = true;
         setTimeout(function () {
            that.shape.remove();
         }, 500);
      }
      else {
         var ctx = canvas.getContext();
         ctx.beginPath(); // !!!
         ctx.font = "32pt LuckiestGuy";
         ctx.fillStyle = that.fontcolor;
         var tX = x0;
         var tY = (y0 - 200 + rY) * (that.scalefactor / 2);
         ctx.textAlign = "center";
         ctx.fillText(that.text, tX, tY);
         ctx.lineWidth = 3;
         ctx.strokeStyle = "#000"; // stroke color
         ctx.strokeText(that.text, tX, tY);
         this.setOpacity(that.alpha);
         canvas.fillStroke(this);
      }

   }});
   layer.add(this.shape);
}
goog.exportSymbol('FlyingText', FlyingText);
//-----------------------------------------------------------------------------
/**
 * @class Coins
 * @constructor
 *
 * @description splash coins
 *
 * @author Robert Wüest robert.wst@gmail.ch
 *
 * @param {Object} layer
 * @param {number} score
 */
function Coins(layer, score) {
   this.score = score;
   this.alpha = 1.0;
   this.layer = layer;
   var that = this;
   var inc = 0;
   m_soundhandler.Play("coins");
   var t0 = new Date();
   var t1;
   this.shape = new Kinetic.Shape({drawFunc: function (canvas) {
      t1 = new Date();
      var delta = t1.valueOf() - t0.valueOf();
      that.alpha = 1 - (delta / 1200);
      inc += (delta / 300);
      if (that.alpha <= 0.0) {
         that.shape.remove();
      }
      else {
         var ctx = canvas.getContext();
         ctx.beginPath(); // !!!
         ctx.font = "40pt LuckiestGuy";
         ctx.fillStyle = "#FE3";
         var tX = 155 - inc;
         var tY = 75;
         ctx.textAlign = "left";
         ctx.fillText("+" + that.score, tX, tY);
         ctx.lineWidth = 3;
         ctx.strokeStyle = "#000"; // stroke color
         ctx.strokeText("+" + that.score, tX, tY);
         ctx.drawImage(m_images["coins"], 248 - inc, 20, 80, 100);
         this.setOpacity(that.alpha);
         canvas.fillStroke(this);
      }
   }});
   layer.add(this.shape);
}
goog.exportSymbol('Coins', Coins);
//-----------------------------------------------------------------------------
/**
 * @description screen fade out return with callback
 * @param {function()} callback
 */
function FadeOut(callback) {
   var t0 = new Date();
   var t1;
   var _fadeOut = function () {
      t1 = new Date();
      var delta = t1.valueOf() - t0.valueOf();
      var alpha = 1.0 - (delta / 1000);

      if (alpha > 0.0) {
         m_ui.setOpacity(alpha);
      }
      else {
         m_ui.setOpacity(0.0);
         m_globeGame.UnregisterCycleCallback("fadeout");
         callback();
      }
   };
   m_globeGame.RegisterCycleCallback("fadeout", _fadeOut);
}
goog.exportSymbol('FadeOut', FadeOut);
//-----------------------------------------------------------------------------
/**
 * @description screen fade in return with callback
 * @param {function()} callback
 */
function FadeIn(callback) {
   var t0 = new Date();
   var t1;
   var _fadeIn = function () {
      t1 = new Date();
      var delta = t1.valueOf() - t0.valueOf();
      var alpha = 0.0 + (delta / 1000);
      if (alpha < 1.0) {
         m_ui.setOpacity(alpha);
      }
      else {
         m_ui.setOpacity(1.0);
         m_globeGame.UnregisterCycleCallback("fadein");
         callback();
      }
   };
   m_globeGame.RegisterCycleCallback("fadein", _fadeIn);
}
goog.exportSymbol('FadeIn', FadeIn);//-----------------------------------------------------------------------------
/**
 * @description Fading Blackscreen
 * @param {number} duration
 * @param {function()} callback
 */
function BlackScreen(duration, callback) {

   var blackScreen = new Kinetic.Rect({
      x: 0,
      y: 0,
      width: window.innerWidth,
      height: window.innerHeight,
      fill: "#000000",
      opacity: 0.0
   });
   m_static.add(blackScreen);
   blackScreen.setZIndex(-100);
   var t0 = new Date();
   var t1;

   var recurOut = function () {
      t1 = new Date();
      var delta = t1.valueOf() - t0.valueOf();
      var alpha = 2.0 - (delta / (duration / 2));
      if (alpha > 0.0) {
         if (alpha <= 1.0) {
            blackScreen.setOpacity(alpha);
         }
         else {
            blackScreen.setOpacity(1.0);
         }
      } else {
         blackScreen.setOpacity(0.0);
         m_globeGame.UnregisterCycleCallback("blackFadeOut");
         blackScreen.remove();
         callback();
      }
   };

   var recurIn = function () {
      t1 = new Date();
      var delta = t1.valueOf() - t0.valueOf();
      var alpha = 0.0 + (delta / (duration / 2));
      if (alpha < 2.0) {
         //setTimeout(function(){recurIn();},0);
         if (alpha <= 1.0) {
            blackScreen.setOpacity(alpha);
         }
         else {
            blackScreen.setOpacity(1.0);
         }
      } else {

         t0 = new Date();
         m_globeGame.UnregisterCycleCallback("blackFadeIn");
         m_globeGame.RegisterCycleCallback("blackFadeOut", recurOut);

      }
   };

   m_globeGame.RegisterCycleCallback("blackFadeIn", recurIn);
}
goog.exportSymbol('FadeIn', FadeIn);
//-----------------------------------------------------------------------------
/**
 * @description more accurate timeout function
 * @param {function()} callback
 * @param {number} timeout
 */
function Timeout(callback, timeout) {
   var tt0 = new Date();
   var timeoutFunction = function (t0, t1, cback) {
      if ((t1.valueOf() - t0.valueOf()) >= timeout) {
         cback();
      } else {
         setTimeout(function () {
            timeoutFunction(t0, new Date(), cback)
         }, 0);
      }
   };
   setTimeout(function () {
      timeoutFunction(tt0, new Date(), callback)
   }, 0);
}
goog.exportSymbol('Timeout', Timeout);


goog.provide('owg.gg.SoundHandler');
//-----------------------------------------------------------------------------
/**
 * @class SoundHandler
 * @constructor
 *
 * @description sound data I/O handler
 *
 * @author Robert Wüest robert.wst@gmail.ch
 */
function SoundHandler() {
   this.sounds = {};
}
//-----------------------------------------------------------------------------
/**
 * @description play soundfile
 * @param {string} id sound id
 */
SoundHandler.prototype.Play = function (id) {
   if (m_soundenabled) {
      try
      {
         this.sounds[id].play();
      }
      catch(err)
      {
         m_soundenabled = false;
      }
   }
};


goog.exportSymbol('SoundHandler', SoundHandler);
goog.exportProperty(SoundHandler.prototype, 'Play', SoundHandler.prototype.Play);