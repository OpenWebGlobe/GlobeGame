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
 *
 */
function DistrictChallenge(baseScore, correctPick, baseData, view, title, extent) {
   this.correctPick = correctPick;
   this.data = baseData;
   this.baseScore = baseScore;
   this.view = view;
   this.flystate = 1;
   this.text = title;
   this.stop = false;
   this.clock = null;
   this.pathArray = [];
   this.screenText = null;
   this.clickState = 0;
   this.extent = extent;


   /* Inline functions*/
   /* this.onOption1 = function(){
    that.PickOption(1, that.clock.GetSeconds());
    };
    this.onOption2 = function(){
    that.PickOption(2, that.clock.GetSeconds());
    };
    this.onOption3 = function(){
    that.PickOption(3, that.clock.GetSeconds());
    };
    this.onOption4 = function(){
    that.PickOption(4, that.clock.GetSeconds());
    };
    this.FlightCallback = function()
    {
    if(that.stop != true && that.flystate < that.views.length)
    {
    var oView = that.views[that.flystate];
    that.flystate +=1;
    ogFlyTo(m_scene,oView["longitude"],oView["latitude"], oView["elevation"],oView["yaw"],oView["pitch"],oView["roll"]);
    m_flystate = GlobeGame.FLYSTATE.FLYAROUND;
    }
    };*/
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
         var clickOption = function(){

         };
      }
      that.screenText = new ScreenText(m_ui, that.text,m_centerX, window.innerHeight-255, 26, "center");
      that.clock = new Clock(m_ui, 50, 75, 60);
      ogSetPosition(m_camera,that.view.longitude,that.view.latitude, that.view.elevation);
      ogSetOrientation(m_camera,that.view["yaw"],that.view["pitch"], that.view["roll"]);
      /* btn1 = new Button01(m_ui, "btn1", m_centerX-310, window.innerHeight-239, 300, 69, that.options[0], 15);
       btn1.onClickEvent = that.onOption1;
       btn2 = new Button01(m_ui, "btn2", m_centerX+10, window.innerHeight-239, 300, 69, that.options[1], 15);
       btn2.onClickEvent = that.onOption2;
       btn3 = new Button01(m_ui, "btn3", m_centerX-310, window.innerHeight-150, 300, 69, that.options[2], 15);
       btn3.onClickEvent = that.onOption3;
       btn4 = new Button01(m_ui, "btn4", m_centerX+10, window.innerHeight-150, 300, 69, that.options[3], 15);
       btn4.onClickEvent = that.onOption4;
       that.buttonArray.push(btn1);
       that.buttonArray.push(btn2);
       that.buttonArray.push(btn3);
       that.buttonArray.push(btn4);
       that.screenText = new ScreenText(m_ui, that.text,m_centerX, window.innerHeight-255, 26, "center");
       that.clock = new Clock(m_ui, 50, 75, 60);
       var flightduration = Math.floor(40/(that.views.length-1))*1000;
       ogSetFlightDuration(m_scene,flightduration);
       ogSetPosition(m_camera,that.views[0].longitude,that.views[0].latitude, that.views[0].elevation);
       ogSetOrientation(m_camera,that.views[0]["yaw"],that.views[0]["pitch"], that.views[0]["roll"]);
       ogSetInPositionFunction(m_context,that.FlightCallback);*/
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

      //that.FlightCallback();
   });
};
//-----------------------------------------------------------------------------
/**
 * @description destroy challenge
 */
DistrictChallenge.prototype.Destroy = function (event) {
   if (!this.destroyed) {
      this.eventDestroyed = event;
      this.clock.Pause();
      ogSetInPositionFunction(m_context, function () {
      });
      this.stop = true;
      ogStopFlyTo(m_scene);
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
   if (!this.draftmode) {
      FadeOut(function () {
         /*that.buttonArray[0].Destroy();
         that.buttonArray[1].Destroy();
         that.buttonArray[2].Destroy();
         that.buttonArray[3].Destroy();
         that.screenText.Destroy();*/
         that.eventDestroyed();
      });
   }
   else
   {
      /*that.buttonArray[0].Destroy();
      that.buttonArray[1].Destroy();
      that.buttonArray[2].Destroy();
      that.buttonArray[3].Destroy();
      that.screenText.Destroy();*/
      that.eventDestroyed();
   }
};
//-----------------------------------------------------------------------------
/**
 * @description pick solution
 * @param {number} id
 * @param {number} timeleft
 */
DistrictChallenge.prototype.Pick = function (id, timeleft) {
   /*this.buttonArray[0].SetEnabled(false);
    this.buttonArray[1].SetEnabled(false);
    this.buttonArray[2].SetEnabled(false);
    this.buttonArray[3].SetEnabled(false);
    var that = this;
    if (this.correctOption == id) {
    m_soundhandler.Play("correct");
    if(m_player)
    {
    var score = 0;
    m_player.ScorePoints(this.baseScore, ""); score += this.baseScore;
    m_player.ScorePoints(Math.floor(timeleft / 5), m_locale["timebonus"]);score +=Math.floor(timeleft / 5);
    if (timeleft > 50) {
    m_player.ScorePoints(20, m_locale["speedbonus"]);
    score += 20;
    }
    Timeout(function(){
    var coins = new Coins(m_ui, score);
    }, 1000);
    }
    this.buttonArray[option - 1].SetEnabled(true);
    this.buttonArray[option - 1].SetState(3);
    setTimeout(function () {
    that.callback();
    }, 2000);
    } else {
    m_soundhandler.Play("wrong");
    this.buttonArray[option - 1].SetEnabled(true);
    this.buttonArray[this.correctOption - 1].SetEnabled(true);
    this.buttonArray[option - 1].SetState(4);
    this.buttonArray[this.correctOption - 1].SetState(5);
    setTimeout(function () {
    that.callback();
    }, 2000);
    }*/
};

DistrictChallenge.prototype.CreateInteractiveSurface = function(fieldData)
{
   var that = this;



   var shape = new Kinetic.Path({
      x: ((window.innerWidth-(that.extent[0]*(window.innerHeight/that.extent[1])))/2),
      y: 0,
      data: fieldData["path"],
      fill: '#FFFFFF',
      stroke: '#FFFFFF',
      opacity: 0.5,
      scale: (window.innerHeight/that.extent[1])
   });

   var updateShape = function()
   {
      shape.setPosition(((window.innerWidth-(that.extent[0]*(window.innerHeight/that.extent[1])))/2), 0);
      shape.setScale((window.innerHeight/that.extent[1]));
      shape.draw();
   };

   var onClickEvent = function() {
      if (that.correctPick == shape.name)
      {
         shape.setFill("#00FF00");
      }
      else
      {
         shape.setFill("#FF0000");
         var text = new FlyingText(m_static, "Nochmal versuchen!", "#FF6600");
      }
      m_ui.draw();
   };
   var onMouseOverEvent = function() {};
   var onMouseOutEvent = function() {};
   var onMouseDownEvent = function() {};
   var onMouseUpEvent = function() {};

   m_globeGame.RegisterResizeCallback(fieldData["label"]["text"], updateShape);

   shape.on("mouseout", function(){
         onMouseOutEvent();
         if(that.clickState < 3)
         {that.clickState = 0;}
   });
   shape.on("mouseover", function(){
         onMouseOverEvent();
         if(that.clickState < 3)
         {that.clickState = 1;}
   });
   shape.on("mousedown", function(){
         onMouseDownEvent();
         if(that.clickState < 3)
         {that.clickState = 2;}

   });
   shape.on("mouseup", function(){
         onMouseUpEvent();
         if(that.clickState < 3)
         {that.clickState = 1;
            onClickEvent();
         }
   });
   shape.on("touchstart", function(){
         onMouseDownEvent();
         if(that.clickState < 3)
         {that.clickState = 2;}
   });
   shape.on("touchend", function(){
         onMouseUpEvent();
         if(that.clickState < 3)
         {that.clickState = 1;
            onClickEvent();
         }
   });
   shape.name = fieldData["label"]["text"];
   m_ui.add(shape);
   m_ui.draw();
};

goog.exportSymbol('DistrictChallenge', DistrictChallenge);
goog.exportProperty(DistrictChallenge.prototype, 'Prepare', DistrictChallenge.prototype.Prepare);
goog.exportProperty(DistrictChallenge.prototype, 'Activate', DistrictChallenge.prototype.Activate);
goog.exportProperty(DistrictChallenge.prototype, 'Destroy', DistrictChallenge.prototype.Destroy);
goog.exportProperty(DistrictChallenge.prototype, 'OnDestroy', DistrictChallenge.prototype.OnDestroy);
goog.exportProperty(DistrictChallenge.prototype, 'Pick', DistrictChallenge.prototype.Pick);
goog.exportProperty(DistrictChallenge.prototype, 'RegisterCallback', DistrictChallenge.prototype.RegisterCallback);