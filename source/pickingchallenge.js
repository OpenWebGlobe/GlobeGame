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
goog.provide('owg.gg.PickingChallenge');

goog.require('owg.gg.Challenge');
goog.require('owg.gg.Button01');
goog.require('owg.gg.FlyingText');
goog.require('owg.gg.ScreenText');
goog.require('owg.gg.Clock');
goog.require('owg.gg.Pin');
//-----------------------------------------------------------------------------
/**
 * @class PickingChallenge
 * @constructor
 *
 * @description pick location challenge
 *
 * @author Robert Wüest robert.wst@gmail.ch
 *
 * @param {number} baseScore
 * @param {string} title
 * @param {Array.<number>} pos
 *
 */
function PickingChallenge(baseScore, title, pos) {
   this.screenText = null;
   this.baseScore = baseScore;
   this.text = title;
   var that = this;
   this.flystate = false;
   this.zoomState = false;
   this.pickPos = [null, 0, 0, 0];
   this.solutionPos = pos;
   this.posPin = null;
   this.resultPin = null;
   this.line = null;
   this.distancText = null;
   this.okayBtn = null;
   this.pickOverlay = null;
   this.mouseLock = false;
   this.clock = null;
   this.ogFrameLayer = null;
   this.distanceLine = null;
   this.hint = null;

   /* Inline functions */
   //-----------------------------------------------------------------------------
   /**
    * @description ok okay button event
    */
   this.OnOkay = () => {
      that.okayBtn.SetEnabled(false);
      var cartesian = ogToCartesian(gg["scene"], that.solutionPos[0], that.solutionPos[1], that.solutionPos[2]);
      var screenPos = ogWorldToWindow(gg["scene"], cartesian[0], cartesian[1], cartesian[2]);
      var distance = ogCalcDistanceWGS84(that.solutionPos[0], that.solutionPos[1], that.pickPos[1], that.pickPos[2]);
      distance = Math.round((distance / 1000) * (10 ** 1)) / (10 ** 1);
      that.resultPin.SetPos(screenPos[0], screenPos[1]);
      gg["soundhandler"].Play("ping1");
      if (that.posPin) {
         that.distanceLine = new Kinetic.Shape({"drawFunc": function (canvas) {
            var ctx = canvas.getContext();
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
            ctx.strokeStyle = "#000"; // stroke color
            ctx.strokeText(distance + "km", screenPos[0], screenPos[1]);
            canvas.fillStroke(this);
         }});
         gg["ui"].add(that.distanceLine);
      }
      if (gg["player"]) {
         if (distance < 50.0) {
            var score = 0;
            if(gg["minimode"])
            {
               if (distance < 20.0) {
                  score = 1;
                  gg["player"].ScorePoints(1, " ");
               }
            }else
            {
               gg["player"].ScorePoints(Math.floor((that.baseScore / 50.0) * (50.0 - distance)), gg["locale"]["estimation"]);
               score += Math.floor((that.baseScore / 50.0) * (50.0 - distance));
               gg["player"].ScorePoints(Math.floor(that.clock.seconds / 5), gg["locale"]["timebonus"]);
               score += Math.floor(that.clock.seconds / 5);
               if (that.clock.seconds > 50) {
                  gg["player"].ScorePoints(20, gg["locale"]["speedbonus"]);
                  score += 20;
               }
            }
            Timeout(() => {
               var coins = new Coins(gg["ui"], score);
            }, 800);
         }
      }
      setTimeout(() => {
         that.callback();
      }, 2500);
   };
   //-----------------------------------------------------------------------------
   /**
    * @description mouse over okay button
    */
   this.MouseOverOkBtn = () => {
      that.mouseLock = true;
   };
   //-----------------------------------------------------------------------------
   /**
    * @description mouse out okay button
    */
   this.MouseOutOkBtn = () => {
      that.mouseLock = false;
   };
   //-----------------------------------------------------------------------------
   /**
    * @description mouse down on map
    */
   this.OnMouseDown = () => {
      if (that.hint) {
         that.hint.remove();
         that.hint = null;
      }
      if (that.mouseLock == false) {
         var pos = gg["stage"].getMousePosition();
         if (that.posPin)
            that.posPin.SetPos(pos.x, pos.y);
         if (that.flystate == true) {
            ogStopFlyTo(gg["scene"]);
         }
         var ori = ogGetOrientation(gg["scene"]);
         var result = ogPickGlobe(gg["scene"], pos.x, pos.y);
         if(result[0] > 0)
         {
            that.ZoomIn(result, ori);
            gg["soundhandler"].Play("swoosh");
            if (that.posPin == null) {
               that.posPin = new Pin(gg["ui"], gg["images"]["pin_blue"], pos.x, pos.y);
            }
            that.zoomState = true;
         }
      }
   };
   //-----------------------------------------------------------------------------
   /**
    * @description mouse up on map
    */
   this.OnMouseUp = () => {
      if (that.mouseLock == false) {
         that.zoomState = false;
         var pos = gg["stage"].getMousePosition();
         var mx = pos.x - 10;
         var my = pos.y - 10;
         that.pickPos = ogPickGlobe(gg["scene"], pos.x, pos.y);
         var Repick = () => {
            if(!(that.pickPos[0] > 0))
            {
               var min = -20;
               var max = 20;
               var addX = Math.floor(Math.random() * (max - min + 1)) + min;
               var addY = Math.floor(Math.random() * (max - min + 1)) + min;
               that.pickPos = ogPickGlobe(gg["scene"], pos.x+addX, pos.y+addY);
               Repick();
            }
         }
         Repick();

         gg["soundhandler"].Play("pick");
         if (that.posPin != null)
            that.posPin.SetVisible(false);
         if (that.flystate == true) {
            ogStopFlyTo(gg["scene"]);
         }

         that.ZoomOut();
      }
   };
   //-----------------------------------------------------------------------------
   /**
    * @description mouse move over map
    */
   this.OnMouseMove = () => {
      if (that.zoomState == true) {
         var pos = gg["stage"].getMousePosition();
         if (that.posPin != null)
            that.posPin.SetPos(pos.x, pos.y);

      }
   };
   //-----------------------------------------------------------------------------
   /**
    * @description camera flight callback function
    */
   this.FlightCallback = () => {
      that.flystate = false;
      var pos = ogWorldToWindow(gg["scene"], that.pickPos[4], that.pickPos[5], that.pickPos[6]);
      if (that.posPin != null && that.zoomState == false) {
         that.posPin.SetVisible(true);
         that.posPin.SetPos(pos[0], pos[1]);
      }
   };
}
PickingChallenge.prototype = new Challenge(1);
PickingChallenge.prototype.constructor = PickingChallenge;
//-----------------------------------------------------------------------------
/**
 * @description preare this challenge
 */
PickingChallenge.prototype.Prepare = function (delay) {
   var that = this;
   var prepFunc = () => {
      that.screenText = new ScreenText(gg["ui"], that.text, gg["centerX"], window.innerHeight - 255, 26, "center");
      that.pickOverlay = new Kinetic.Rect({
         x: 0,
         y: 0,
         width: window.innerWidth,
         height: window.innerHeight
      });
      that.pickOverlay.on("mousedown", that.OnMouseDown);
      that.pickOverlay.on("mouseup", that.OnMouseUp);
      that.pickOverlay.on("mousemove", that.OnMouseMove);
      gg["ui"].add(that.pickOverlay);
      that.okayBtn = new Button01(gg["ui"], "okbtn1", gg["centerX"] - 150, window.innerHeight - 180, 300, 69, "OK", 15);
      that.resultPin = new Pin(gg["ui"], gg["images"]["pin_green"], -1, -1);
      that.okayBtn.onClickEvent = that.OnOkay;
      that.okayBtn.onMouseOverEvent = that.MouseOverOkBtn;
      that.okayBtn.onMouseOutEvent = that.MouseOutOkBtn;
      that.hint = new Kinetic.Shape({"drawFunc": function (canvas) {
         var ctx = canvas.getContext();
         ctx.beginPath(); // !!!
         ctx.font = "22pt TitanOne";
         ctx.fillStyle = "#0FF";
         ctx.textAlign = "center";
         ctx.fillText(gg["locale"]["pickhint"], window.innerWidth / 2, window.innerHeight / 2);
         ctx.lineWidth = 3;
         ctx.strokeStyle = "#000"; // stroke color
         ctx.strokeText(gg["locale"]["pickhint"], window.innerWidth / 2, window.innerHeight / 2);
      }});


      that.clock = new Clock(gg["ui"], 50, 82, 60);

      ogSetPosition(gg["camera"], 8.225578, 46.8248707, 280000.0);
      ogSetOrientation(gg["camera"], 0.0, -90.0, 0.0);

      ogSetInPositionFunction(gg["context"], that.FlightCallback);
      that.ogFrameLayer = ogAddImageLayer(gg["globe"], {
         "url": ["http://www.openwebglobe.org/data/img"],
         "layer": "ch_boundaries",
         "service": "owg"
      });
   };
   if (delay > 0) {
      setTimeout(() => {
         prepFunc();
      }, delay);
   } else {
      prepFunc();
   }
};
//-----------------------------------------------------------------------------
/**
 * @description activate this challenge
 */
PickingChallenge.prototype.Activate = function () {
   var that = this;
   FadeIn(() => {
      that.clock.onTimeoutEvent = () => {
         that.callback()
      };
      that.clock.Start();
      gg["static"].add(that.hint);
   });
};
//-----------------------------------------------------------------------------
/**
 * @description destroy challenge
 */
PickingChallenge.prototype.Destroy = function (event) {
   if (!this.destroyed) {
      this.eventDestroyed = event;
      ogSetInPositionFunction(gg["context"], () => {
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
PickingChallenge.prototype.OnDestroy = function () {
   this.clock.Destroy();
   var that = this;
   if (this.hint) {
      this.hint.remove();
   }
   if (!this.draftmode) {
      FadeOut(() => {
         that.screenText.Destroy();
         that.resultPin.Destroy();
         if (that.posPin) {
            that.posPin.Destroy();
            if (that.distanceLine)
               that.distanceLine.remove();
         }
         that.okayBtn.Destroy();

         that.pickOverlay.remove();
         setTimeout(() => {
            ogRemoveImageLayer(that.ogFrameLayer);
         }, 1200);
         that.eventDestroyed();
      });
   } else {
      that.screenText.Destroy();
      that.resultPin.Destroy();
      if (that.posPin) {
         that.posPin.Destroy();
         if (that.distanceLine)
            that.distanceLine.remove();
      }
      that.okayBtn.Destroy();

      that.pickOverlay.remove();
      ogRemoveImageLayer(that.ogFrameLayer);
      that.eventDestroyed();
   }
};
//-----------------------------------------------------------------------------
/**
 * @description zoom in map
 * @param {Array.<number>} pos
 * @param {Array.<number>} ori
 */
PickingChallenge.prototype.ZoomIn = function (pos, ori) {
   this.flystate = true;
   ogSetFlightDuration(gg["scene"], 500);
   ogFlyToLookAtPosition(gg["scene"], pos[1], pos[2], pos[3], 26000, 0.00, -90.0, 0.0);
   gg["flystate"] = GlobeGame.FLYSTATE.FLYAROUND;
};
//-----------------------------------------------------------------------------
/**
 * @description zoom out map
 * @param {Array.<number>} ori reset orientation
 */
PickingChallenge.prototype.ZoomOut = function (ori) {
   this.flystate = true;
   //this.posPin.SetVisible(false);
   ogSetFlightDuration(gg["scene"], 350);
   ogFlyTo(gg["scene"], 8.225578, 46.8248707, 280000.0, 0.00, -90.0, 0.0);
   gg["flystate"] = GlobeGame.FLYSTATE.FLYAROUND;
};

goog.exportSymbol('PickingChallenge', PickingChallenge);
goog.exportProperty(PickingChallenge.prototype, 'Prepare', PickingChallenge.prototype.Prepare);
goog.exportProperty(PickingChallenge.prototype, 'Activate', PickingChallenge.prototype.Activate);
goog.exportProperty(PickingChallenge.prototype, 'Destroy', PickingChallenge.prototype.Destroy);
goog.exportProperty(PickingChallenge.prototype, 'OnDestroy', PickingChallenge.prototype.OnDestroy);
goog.exportProperty(PickingChallenge.prototype, 'ZoomIn', PickingChallenge.prototype.ZoomIn);
goog.exportProperty(PickingChallenge.prototype, 'ZoomOut', PickingChallenge.prototype.ZoomOut);
goog.exportProperty(PickingChallenge.prototype, 'RegisterCallback', PickingChallenge.prototype.RegisterCallback);

