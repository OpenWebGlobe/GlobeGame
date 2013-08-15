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
 #                              (c) 2011-2013 by                                #
 #           University of Applied Sciences Northwestern Switzerland            #
 #                     Institute of Geomatics Engineering                       #
 #                          Author:robert.wst@gmail.com                         #
 ********************************************************************************
 *     Licensed under MIT License. Read the file LICENSE for more information   *
 *******************************************************************************/
goog.provide('owg.gg.DistrictChallenge');
goog.require('owg.gg.Challenge');
goog.require('owg.gg.Button01');
goog.require('owg.gg.FlyingText');
goog.require('owg.gg.ScreenText');
goog.require('owg.gg.Clock');

//-----------------------------------------------------------------------------
/**
 * @class DistrictChallenge
 * @constructor
 *
 * @description pick correct district challenge
 *
 * @author Robert Wüest robert.wst@gmail.ch
 *
 * @param {number} baseScore
 * @param {string} correctPick
 * @param {Array.<Object>} baseData
 * @param {Object} view
 * @param {string} title
 * @param {Array.<number>} extent
 * @param {Array.<number>} offset
 *
 */
function DistrictChallenge(baseScore, correctPick, baseData, view, title, extent, offset) {
   this.correctPick = correctPick;
   this.data = baseData;
   this.baseScore = baseScore;
   this.view = view;
   this.flystate = 1;
   this.text = title;
   this.stop = false;
   this.clock = null;
   this.shapes = [];
   this.screenText = null;
   this.clickState = 0;
   this.extent = extent;
   this.trials = 0;
   this.locked = false;
   this.offset = offset;
}
DistrictChallenge.prototype = new Challenge(0);
DistrictChallenge.prototype.constructor = DistrictChallenge;
//-----------------------------------------------------------------------------
/**
 * @description activate challenge
 */
DistrictChallenge.prototype.Prepare = function (delay) {

   var that = this;
   var prepFunc = function () {
      for (var i = 0; i < that.data.length; i++) {
         that.CreateInteractiveSurface(that.data[i]);
      }
      that.screenText = new ScreenText(gg["ui"], that.text, gg["centerX"], window.innerHeight - 180, 26, "center");
      that.clock = new Clock(gg["ui"], 50, 82, 60);
      ogSetPosition(gg["camera"], that.view.longitude, that.view.latitude, that.view.elevation);
      ogSetOrientation(gg["camera"], that.view["yaw"], that.view["pitch"], that.view["roll"]);
   };
   if (delay > 0) {
      setTimeout(prepFunc, delay);
   } else {
      prepFunc();
   }
};
//-----------------------------------------------------------------------------
/**
 * @description activate challenge
 */
DistrictChallenge.prototype.Activate = function () {
   var that = this;
   FadeIn(function () {
      that.clock.onTimeoutEvent = function () {
         that.callback()
      };
      that.clock.Start();
   });
};
//-----------------------------------------------------------------------------
/**
 * @description destroy challenge
 */
DistrictChallenge.prototype.Destroy = function (event) {
   if (!this.destroyed) {
      this.eventDestroyed = event;
      ogSetInPositionFunction(gg["context"], function () {
      });
      this.clock.Pause();
      this.OnDestroy();
      this.destroyed = true;
   }
};
//-----------------------------------------------------------------------------
/**
 * @description on destroy function
 */
DistrictChallenge.prototype.OnDestroy = function () {
   this.clock.Destroy();

   var that = this;
   if (this.hint) {
      this.hint.remove();
   }
   if (!this.draftmode) {
      FadeOut(function () {
         that.RemoveAllSurfaces();
         that.screenText.Destroy();
         that.eventDestroyed();
      });
   } else {
      that.RemoveAllSurfaces();
      that.screenText.Destroy();
      that.eventDestroyed();
   }
};
//-----------------------------------------------------------------------------
/**
 * @description Score
 * @param {number} timeleft
 */
DistrictChallenge.prototype.Score = function (timeleft) {
   var that = this;
   gg["soundhandler"].Play("correct");
   if (gg["player"]) {
      var score = 0;
      if(gg["minimode"])
      {
         gg["player"].ScorePoints(1, " ");
         score = 1;
      }else
      {
         score += Math.floor(this.baseScore / this.trials);
         gg["player"].ScorePoints(score, "");
         gg["player"].ScorePoints(Math.floor(timeleft / 5), gg["locale"]["timebonus"]);
         score += Math.floor(timeleft / 5);
         if (timeleft > 50) {
            gg["player"].ScorePoints(20, gg["locale"]["speedbonus"]);
            score += 20;
         }
      }
      Timeout(function () {
         var coins = new Coins(gg["ui"], score);
      }, 800);
   }
   setTimeout(function () {
      that.callback();
   }, 2000);
};

DistrictChallenge.prototype.CreateInteractiveSurface = function (fieldData) {
   var that = this;

   var shape = new Kinetic.Path({
      x: ((window.innerWidth - (that.extent[0] * (window.innerHeight / that.extent[1]))) / 2)+that.offset[0],
      y: 0+(that.offset[1]* (window.innerHeight / that.extent[1])),
      data: fieldData["path"],
      fill: '#FFFFFF',
      stroke: '#FFFFFF',
      opacity: 0.5,
      scale: (window.innerHeight / that.extent[1])
   });

   var updateShape = function () {
      shape.setPosition(((window.innerWidth - (that.extent[0] * (window.innerHeight / that.extent[1]))) / 2)+that.offset[0], (that.offset[1]* (window.innerHeight / that.extent[1])));
      shape.setScale((window.innerHeight / that.extent[1]));
   };

   var onClickEvent = function () {
      if(that.locked == false && shape.getFill() == "#FFFFFF")
      {
         that.trials += 1;
         if (that.correctPick == shape.name) {
            shape.setFill("#00FF00");
            that.locked = true;
            that.Score(that.clock.GetSeconds());
         }
         else if (that.trials >= 8) {
            that.locked = true;
            gg["soundhandler"].Play("wrong");
            for (var i = 0; i < that.shapes.length; i++) {
               if (that.shapes[i]["name"] == that.correctPick) {
                  that.shapes[i].setFill("#FFFF00");
                  break;
               }
            }
            setTimeout(function () {
               that.callback();
            }, 2500);
         }
         else {
            shape.setFill("#FF0000");
            //var text = new FlyingText(gg["static"], "Nochmal versuchen!", "#FF6600");
         }
      }
   };
   var onMouseOverEvent = function () {
   };
   var onMouseOutEvent = function () {
   };
   var onMouseDownEvent = function () {
   };
   var onMouseUpEvent = function () {
   };

   gg["globeGame"].RegisterResizeCallback(fieldData["label"]["text"], updateShape);

   shape.on("mouseout", function () {
      onMouseOutEvent();
      if (that.clickState < 3) {
         that.clickState = 0;
      }
   });
   shape.on("mouseover", function () {
      onMouseOverEvent();
      if (that.clickState < 3) {
         that.clickState = 1;
      }
   });
   shape.on("mousedown", function () {
      onMouseDownEvent();
      if (that.clickState < 3) {
         that.clickState = 2;
      }

   });
   shape.on("mouseup", function () {
      onMouseUpEvent();
      if (that.clickState < 3) {
         that.clickState = 1;
         onClickEvent();
      }
   });
   shape.on("touchstart", function () {
      onMouseDownEvent();
      if (that.clickState < 3) {
         that.clickState = 2;
      }
   });
   shape.on("touchend", function () {
      onMouseUpEvent();
      if (that.clickState < 3) {
         that.clickState = 1;
         onClickEvent();
      }
   });
   shape.name = fieldData["label"]["text"];
   this.shapes.push(shape);
   gg["ui"].add(shape);
};

DistrictChallenge.prototype.RemoveAllSurfaces = function () {
   for (var i = 0; i < this.shapes.length; i++) {
      gg["globeGame"].UnregisterResizeCallback(this.shapes[i].name);
      this.shapes[i].remove();
   }
};

goog.exportSymbol('DistrictChallenge', DistrictChallenge);
goog.exportProperty(DistrictChallenge.prototype, 'Prepare', DistrictChallenge.prototype.Prepare);
goog.exportProperty(DistrictChallenge.prototype, 'Activate', DistrictChallenge.prototype.Activate);
goog.exportProperty(DistrictChallenge.prototype, 'Destroy', DistrictChallenge.prototype.Destroy);
goog.exportProperty(DistrictChallenge.prototype, 'OnDestroy', DistrictChallenge.prototype.OnDestroy);
goog.exportProperty(DistrictChallenge.prototype, 'Score', DistrictChallenge.prototype.Score);
goog.exportProperty(DistrictChallenge.prototype, 'RegisterCallback', DistrictChallenge.prototype.RegisterCallback);