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
//-----------------------------------------------------------------------------
goog.provide('owg.gg.GlobeGame');
goog.require('owg.OpenWebGlobe');
goog.require('owg.gg.Button01');
goog.require('owg.gg.Button02');
goog.require('owg.gg.TouchKeyboard');
goog.require('owg.gg.MessageDialog');
goog.require('owg.gg.ScreenText');
goog.require('owg.gg.Clock');
goog.require('owg.gg.ScoreCount');
goog.require('owg.gg.Pin');
goog.require('owg.gg.FlyingText');
goog.require('owg.gg.Player');
goog.require('owg.gg.Challenge');
goog.require('owg.gg.LandmarkChallenge');
goog.require('owg.gg.PickingChallenge');
goog.require('owg.gg.DistrictChallenge');
goog.require('owg.gg.GameData');
//-----------------------------------------------------------------------------
/**
 * @enum {number}
 */
GlobeGame.STATE = {
   IDLE: 0,
   CHALLENGE: 1,
   HIGHSCORE: 2
};

GlobeGame.FLYSTATE =
{
   IDLE: 0,
   FLYAROUND: 1
}
/**
 * Members
 * */
var gg = {};
goog.exportSymbol('gg', gg);
gg["images"] = {};
gg["containerObject"] = null;
gg["loadedImages"] = 0;
gg["numImages"] = 0;
gg["loadedSounds"] = 0;
gg["numSounds"] = 0;
gg["context"] = null;
gg["globe"] = null;
gg["scene"] = null;
gg["stage"] = null;
gg["ui"] = null;
gg["static"] = null;
gg["camera"] = null;
gg["centerX"] = window.innerWidth / 2;
gg["centerY"] = window.innerHeight / 2;
gg["lang"] = "none";
gg["datahost"] = "http://localhost";
gg["locale"] = [];
gg["player"] = null;
gg["qCount"] = 0;
gg["qMax"] = 10;
gg["progress"] = null;
gg["soundhandler"] = new SoundHandler();
gg["soundenabled"] = true;
gg["showhash"] = false;
/** @type {GlobeGame.STATE} */
gg["state"] = GlobeGame.STATE.IDLE;
gg["flystate"] = GlobeGame.FLYSTATE.IDLE;
gg["score"] = null;
/** @type {GameData} */
gg["gameData"] = null;
/** @type {GlobeGame} */
gg["globeGame"] = null;
gg["debug"] = false;
gg["loaded"] = false;
gg["minimode"] = false;
gg["onlinemode"] = true;
gg["chooselang"] = false;
gg["rootPath"] = "";

/**
 * @class GlobeGame
 * @constructor
 *
 * @description main class of globe game
 *
 * @author Robert Wüest robert.wst@gmail.ch
 * @param {string} canvasDiv
 * @param {(string|null)} datapath
 * @param {boolean} soundenabled
 * @param {boolean} showhash
 * @param {boolean} chooselang
 */
function GlobeGame(canvasDiv, datapath, soundenabled, showhash, minimode, chooselang) {
   gg["containerObject"] = canvasDiv;

   var loc = window.location+"";
   gg["rootPath"] = loc.substr(0,loc.lastIndexOf("/")+1);
   if (datapath) {
      gg["datahost"] = datapath;
   }
   gg["qCount"] = 0;
   this.currentChallenge = null;
   this.callbacks = [];
   this.resizeCallbacks = [];
   var that = this;
   gg["globeGame"] = this;

   gg["stage"] = new Kinetic.Stage({
      "container": canvasDiv,
      "width": window.innerWidth,
      "height": window.innerHeight,
      "x": 0,
      "y": 0
   });

   gg["ui"] = new Kinetic.Layer();
   gg["static"] = new Kinetic.Layer();
   gg["soundenabled"] = soundenabled;
   gg["showhash"] = showhash;
   gg["minimode"] = minimode;
   gg["chooselang"] = chooselang;
}

//-----------------------------------------------------------------------------
/**
 * @description init game and preload data
 * @param {function({number})} renderCallback
 * @param {({number}|null)} renderQuality
 */
GlobeGame.prototype.Init = function (renderCallback, renderQuality) {
   var that = this;

   /* Preload */

   // Preload images
   var sources = {
      "btn_01": "art/btn_01.png",
      "btn_01_c": "art/btn_01_c.png",
      "btn_01_h": "art/btn_01_h.png",
      "btn_01_d": "art/btn_01_d.png",
      "btn_01_f": "art/btn_01_f.png",
      "btn_01_t": "art/btn_01_t.png",
      "btn_01_o": "art/btn_01_o.png",
      "btn_02": "art/btn_02.png",
      "btn_02_c": "art/btn_02_c.png",
      "btn_02_h": "art/btn_02_h.png",
      "clock": "art/clock.png",
      "dial": "art/dial.png",
      "pin_blue": "art/pin_blue.png",
      "pin_red": "art/pin_red.png",
      "pin_green": "art/pin_green.png",
      "pin_yellow": "art/pin_yellow.png",
      "nw_logo": "art/nw_logo.png",
      "logo": "art/logo.png",
      "logo_sm": "art/logo_sm.png",
      "coins": "art/coins.png",
      "logo_owg": "art/logo_owg.png",
      "screenshot": "art/screen.png",
      "twitter": "art/twitter.png",
      "facebook": "art/facebook.png",
      "silver_medal" : "art/silver_medal.png",
      "bronze_medal": "art/bronze_medal.png",
      "gold_medal": "art/gold_medal.png"
   };
   // Preload sounds
   var sounds = {
      "pick": "sfx/pick.wav",
      "correct": "sfx/correct.wav",
      "wrong": "sfx/wrong.wav",
      "coins": "sfx/coins.wav",
      "highscores": "sfx/highscores.mp3",
      "track01": "sfx/track01.mp3",
      "track02": "sfx/track02.mp3",
      "track03": "sfx/track03.mp3",
      "track04": "sfx/track04.mp3",
      "swoosh": "sfx/swoosh.wav",
      "ping1": "sfx/ping1.wav",
      "ping2": "sfx/ping2.wav"
   };

   gg["context"] = ogCreateContextFromCanvas("canvas", true);
   gg["scene"] = ogCreateScene(gg["context"], OG_SCENE_3D_ELLIPSOID_WGS84, {
         "rendertotexture": false
      }
   );
   gg["globe"] = ogCreateWorld(gg["scene"]);
   gg["camera"] = ogGetActiveCamera(gg["scene"]);
   // Add OWG Data
   ogAddImageLayer(gg["globe"], {
      "url": ["http://geoapp.openwebglobe.org/mapcache/owg"],
      "layer": "world3",
      "service": "owg"
   });

   ogAddElevationLayer(gg["globe"], {
      "url": ["http://tile1.openwebglobe.org/mapcache/owg",
         "http://tile2.openwebglobe.org/mapcache/owg",
         "http://tile3.openwebglobe.org/mapcache/owg"],
      "layer": "aster",
      "service": "owg"
   });

   if (renderQuality != null) {
      ogSetRenderQuality(gg["globe"], renderQuality);
   }
   ogSetRenderFunction(gg["context"], this.OnOGRender);
   ogSetResizeFunction(gg["context"], this.OnOGResize);


   gg["stage"].add(gg["static"]);
   gg["stage"].add(gg["ui"]);
   /*  var c = document.getElementById('canvas');
    c.addEventListener("touchstart", this.TouchHandler, true);
    c.addEventListener("touchmove", this.TouchHandler, true);
    c.addEventListener("touchend", this.TouchHandler, true);
    c.addEventListener("touchcancel", this.TouchHandler, true);*/
   var loadingText = new ScreenText(gg["ui"], "Loading sounds...", gg["centerX"], gg["centerY"], 25, "center");
   that.LoadSounds(sounds, function () {
      loadingText.text = "Loading images...";
      that.LoadImages(sources, function () {
         loadingText.text = "Choose language";

         var doInit = function () {
            loadingText.text = "Loading language...";

            that.LoadLanguage(function () {
               if (!gg["loaded"]) {
                  gg["loaded"] = true;
                  loadingText.Destroy();

                  /* nw logo & swisstopo copyright */
                  var statics = new Kinetic.Shape({"drawFunc": function (canvas) {
                     var ctx = canvas.getContext();
                     if (gg["state"] != GlobeGame.STATE.CHALLENGE) {
                        ctx.drawImage(gg["images"]["logo"], window.innerWidth / 2 - 352, 30, 705, 206);
                     }
                     else {
                        ctx.drawImage(gg["images"]["logo_sm"], window.innerWidth - 260, 4, 254, 50);
                     }
                     ctx.fillStyle = "#FFF";
                     ctx.font = "11pt TitanOne";
                     ctx.fillText("Image data © MAPPULS", (window.innerWidth / 2)-100, window.innerHeight - 5);
                     ctx.lineWidth = 1;
                     ctx.strokeStyle = "#000"; // stroke color
                     ctx.strokeText("Image data © MAPPULS", (window.innerWidth / 2)-100, window.innerHeight - 5);
                     ctx.drawImage(gg["images"]["logo_owg"], 0, window.innerHeight - 120, 240, 86);
                     if (gg["debug"]) {
                        ctx.fillStyle = "#F00";
                        ctx.font = "8pt TitanOne";
                        ctx.textAlign = "left";
                        ctx.fillText("State:" + gg["state"], 5, 80);
                        ctx.fillText("Flystate:" + gg["flystate"], 5, 90);
                     }
                     canvas.fillStroke(this);
                  }});
                  gg["static"].add(statics);


                  var nw_logo = new Kinetic.Shape({"drawFunc": function (canvas) {
                     var ctx = canvas.getContext();
                     ctx.drawImage(gg["images"]["nw_logo"], window.innerWidth - 365, window.innerHeight - 40, 360, 44);
                     ctx.beginPath();
                     ctx.rect(window.innerWidth - 365, window.innerHeight - 40, 360, 44);
                     ctx.closePath();
                     canvas.fillStroke(this);
                  }});
                  nw_logo.on("mouseup", function () {
                     window.open("http://www.fhnw.ch/habg/ivgi");
                  });
                  nw_logo.on("touchend", function () {
                     window.open("http://www.fhnw.ch/habg/ivgi");
                  });
                  gg["static"].add(nw_logo);

                  var owg_link = new Kinetic.Shape({"drawFunc": function (canvas) {
                     var ctx = canvas.getContext();
                     ctx.textAlign = "left";
                     ctx.fillStyle = "#FFF";
                     ctx.font = "14pt TitanOne";
                     ctx.fillText("www.openwebglobe.org",8, window.innerHeight - 15);
                     ctx.lineWidth = 1;
                     ctx.strokeStyle = "#000"; // stroke color
                     ctx.strokeText("www.openwebglobe.org", 8, window.innerHeight - 15);
                     var textWidth = ctx.measureText("www.openwebglobe.org").width;
                     ctx.beginPath();
                     ctx.rect( 8, window.innerHeight - 35, textWidth, 30);
                     ctx.closePath();
                     canvas.fillStroke(this);
                  }});
                  owg_link.on("mouseup", function () {
                     window.open("http://www.openwebglobe.org");
                  });
                  owg_link.on("touchend", function () {
                     window.open("http://www.openwebglobe.org");
                  });
                  gg["static"].add(owg_link);

                  if (gg["soundenabled"]) {
                     try
                     {
                     gg["soundhandler"].sounds["track01"].volume = 0.25;
                     gg["soundhandler"].sounds["track01"].addEventListener("ended", function () {
                        gg["soundhandler"].sounds["track02"].play();
                     }, true);
                     gg["soundhandler"].sounds["track02"].volume = 0.25;
                     gg["soundhandler"].sounds["track02"].addEventListener("ended", function () {
                        gg["soundhandler"].sounds["track03"].play();
                     }, true);
                     gg["soundhandler"].sounds["track03"].volume = 0.25;
                     gg["soundhandler"].sounds["track03"].addEventListener("ended", function () {
                        gg["soundhandler"].sounds["track04"].play();
                     }, true);
                     gg["soundhandler"].sounds["track04"].volume = 0.25;
                     gg["soundhandler"].sounds["track04"].addEventListener("ended", function () {
                        gg["soundhandler"].sounds["track01"].play();
                     }, true);
                     var index = Math.floor(Math.random() * 4 + 1);
                     gg["soundhandler"].sounds["track0" + index].play();
                     }
                     catch(err)
                     {
                        gg["soundenabled"] = false;
                     }
                  }
                  // load gamedata
                  gg["gameData"] = new GameData(function () {
                     that.EnterIdle();
                  });
               }
            });
         }
         if(gg["chooselang"] == true)
         {
            var btn_de = new Button02(gg["ui"], "btn_de", (window.innerWidth / 2) - 120, 300, 76, 69, "DEU", 15, function () {
               gg["lang"] = "de";
               btn_de.Destroy();
               btn_fr.Destroy();
               btn_en.Destroy();
               doInit();
            });
            var btn_fr = new Button02(gg["ui"], "btn_fr", (window.innerWidth / 2) - 40, 300, 76, 69, "FRA", 15, function () {
               gg["lang"] = "fr";
               btn_de.Destroy();
               btn_fr.Destroy();
               btn_en.Destroy();
               doInit();
            });
            var btn_en = new Button02(gg["ui"], "btn_en", (window.innerWidth / 2) + 40, 300, 76, 69, "ENG", 15, function () {
               gg["lang"] = "en";
               btn_de.Destroy();
               btn_fr.Destroy();
               btn_en.Destroy();
               doInit();
            });
         }
         else
         {
            gg["lang"] = "de";
            doInit();
         }
      });
   });

};
//-----------------------------------------------------------------------------
/**
 * @description STATE function enter idle mode
 */
GlobeGame.prototype.EnterIdle = function () {
   var that = this;
   gg["state"] = GlobeGame.STATE.IDLE;
   var startMessage = new MessageDialog(gg["ui"], gg["locale"]["start"], window.innerWidth / 2, window.innerHeight - 200, 500, 220);
   startMessage.RegisterCallback(function () {
      that.StopFlyTo();
      gg["ui"].setOpacity(0.0);
      that.EnterChallenge();
   });
   if(gg["flystate"] != GlobeGame.FLYSTATE.FLYAROUND)
   {
      this.FlyAround();
   }
};
//-----------------------------------------------------------------------------
/**
 * @description STATE function enter challenge mode
 */
GlobeGame.prototype.EnterChallenge = function () {
   gg["state"] = GlobeGame.STATE.CHALLENGE;
   gg["player"] = new Player("");
   gg["score"] = new ScoreCount(gg["ui"]);
   gg["progress"] = new ProgressCount(gg["ui"], gg["qMax"]);
   this.ProcessChallenge();

};
//-----------------------------------------------------------------------------
/**
 * @description STATE function enter highscore
 */
GlobeGame.prototype.EnterHighscore = function () {

   var that = this;
   if (gg["progress"])
      gg["progress"].Destroy();
   gg["ui"].setOpacity(1.0);
   gg["state"] = GlobeGame.STATE.HIGHSCORE;
   this.FlyAround();
   if(gg["minimode"] == false)
   {
      var keyboard = new TouchKeyboard(gg["ui"], "keys", (window.innerWidth / 2) - 426, (window.innerHeight / 2) - 195, gg["locale"]["entername"],
         function (name) {
            gg["player"].playerName = name;
            keyboard.Destroy();
            gg["soundhandler"].Play("highscores");
            jQuery.get('hash.php', function (data1) {
               jQuery.get('db.php?action=append&name=' + gg["player"].playerName + '&score=' + gg["player"].playerScore + "&hash=" + data1, function (data2) {

                  var hash = data1;
                  var list = /** @type {Array} */eval(data2);

                  if (gg["onlinemode"])
                  {
                     var shareDialog = new ShareDialog(gg["ui"], hash, 700, 700, gg["player"]);

                     var pointLayer = new Kinetic.Layer();

                     gg["stage"].add(pointLayer);
                     pointLayer.setSize(640,480);
                     pointLayer.setPosition(Math.floor((window.innerWidth-640)/2), Math.floor((window.innerHeight-450)/2)-88);
                     var pointShape = new Kinetic.Shape({"drawFunc": function (canvas) {
                        var ctx = canvas.getContext();
                        ctx.drawImage(gg["images"]["screenshot"], 0, 0, 640, 480);
                        ctx.drawImage(gg["images"]["logo"], 80, 20, 480, 150);
                        ctx.fillStyle = "#FD6";
                        ctx.font = "40pt TitanOne";
                        ctx.textAlign = "left";
                        var textWidth = ctx.measureText(gg["player"].playerName).width;
                        var tX = (640 - textWidth) / 2;
                        ctx.fillText(gg["player"].playerName, tX+40, 260);
                        ctx.lineWidth = 2;
                        ctx.strokeStyle = "#000"; // stroke color
                        ctx.strokeText(gg["player"].playerName, tX+40, 260);
                        ctx.fillStyle = "#8FF";
                        ctx.font = "42pt TitanOne";
                        textWidth = ctx.measureText(gg["player"].playerScore+ " " + gg["locale"]["points"]).width;
                        tX = (640 - textWidth) / 2;
                        ctx.fillText(gg["player"].playerScore+ " " + gg["locale"]["points"], tX+40, 330);
                        ctx.lineWidth = 2;
                        ctx.strokeStyle = "#000"; // stroke color
                        ctx.strokeText(gg["player"].playerScore+ " " + gg["locale"]["points"], tX+40, 330);
                        ctx.fillStyle = "#FFF";
                        ctx.font = "14pt TitanOne";
                        ctx.fillText("www.openwebglobe.org",8, 470);
                        ctx.lineWidth = 1;
                        ctx.strokeStyle = "#000"; // stroke color
                        ctx.strokeText("www.openwebglobe.org", 8, 470);
                        ctx.drawImage(gg["images"]["logo_owg"], 0, 370, 240, 86);
                        ctx.drawImage(gg["images"]["nw_logo"], 280, 435, 360, 44);
                        if(gg["player"].playerScore >= 1100)
                        {
                           ctx.drawImage(gg["images"]["gold_medal"], 10, 185, 148, 180);
                        }
                        else if(gg["player"].playerScore >= 900)
                        {
                           ctx.drawImage(gg["images"]["silver_medal"], 10, 185, 132, 180);
                        }
                        else if(gg["player"].playerScore >= 700)
                        {
                           ctx.drawImage(gg["images"]["bronze_medal"], 10, 185, 132, 180);
                        }
                        ctx.closePath();
                     }});

                     var facebook_share = new Kinetic.Shape({"drawFunc": function (canvas) {
                        var ctx = canvas.getContext();
                        ctx.drawImage(gg["images"]["facebook"], 25, 485, 75, 75);
                        ctx.font = "18pt TitanOne";
                        ctx.fillStyle = "#FFF";
                        ctx.fillText("Share",110, 528);
                        ctx.lineWidth = 2;
                        ctx.strokeStyle = "#000"; // stroke color
                        ctx.strokeText("Share", 110, 528);
                        ctx.beginPath();
                        ctx.rect(25, 485, 250, 75);
                        ctx.closePath();
                        canvas.fillStroke(this);
                     }});

                     var twitter_share = new Kinetic.Shape({"drawFunc": function (canvas) {
                        var ctx = canvas.getContext();
                        ctx.drawImage(gg["images"]["twitter"], 400, 485, 75, 75);
                        ctx.font = "18pt TitanOne";
                        ctx.fillStyle = "#FFF";
                        ctx.fillText("Tweet",490, 528);
                        ctx.lineWidth = 2;
                        ctx.strokeStyle = "#000"; // stroke color
                        ctx.strokeText("Tweet", 490, 528);
                        ctx.beginPath();
                        ctx.rect(400, 485, 250, 75);
                        ctx.closePath();
                        canvas.fillStroke(this);
                     }});

                     pointLayer.add(pointShape);
                     pointLayer.add(facebook_share);
                     pointLayer.add(twitter_share);
                     setTimeout(function(){
                        var dataUrl = pointLayer.toDataURL();
                        var dynamicCanvas = document.createElement("canvas");
                        var dynamicContext = dynamicCanvas.getContext("2d");
                        dynamicCanvas.height="480";
                        dynamicCanvas.width="640";
                        var imageObj = new Image();
                        imageObj.src = dataUrl;
                        imageObj.onload = function() {
                           dynamicContext.drawImage(imageObj, -Math.floor((window.innerWidth-640)/2), -Math.floor((window.innerHeight-450)/2)+88);
                           jQuery.ajax({
                              "type": "POST",
                              "url": "ul.php",
                              "data": { "data" : dynamicCanvas.toDataURL("image/jpeg", 0.65)},
                              "success": function(response){ /*window.open(response);*/
                                 var linkFB = "http://www.facebook.com/sharer/sharer.php?s=100&p[title]="+encodeURIComponent(gg["player"].playerName + " reached " + gg["player"].playerScore + " points in SwissQuiz")+"&p[url]="+encodeURIComponent("http://www.swizzquiz.ch")+"&p[summary]="+encodeURIComponent("SwizzQuiz")+"&p[images][0]="+encodeURIComponent(gg["rootPath"]+response);
                                 var linkTW = "https://twitter.com/share?url="+encodeURIComponent(gg["rootPath"]+response)+"&text="+encodeURIComponent("Just played SwizzQuiz and earned "+ gg["player"].playerScore+ " points. See http://www.swizzquiz.ch for more");
                                 facebook_share.on("mouseup", function () {
                                    window.open(linkFB);
                                 });
                                 facebook_share.on("touchend", function () {
                                   window.open(linkFB);
                                 });
                                 twitter_share.on("mouseup", function () {
                                    window.open(linkTW);
                                 });
                                 twitter_share.on("touchend", function () {
                                    window.open(linkTW);
                                 });
                              },
                              "cache": false
                           });
                        };
                     }, 10);
                     shareDialog.RegisterCallback(function () {
                        if (gg["score"])
                           gg["score"].Destroy();
                        pointShape.remove();
                        pointLayer.remove();
                        gg["qCount"] = 0;
                        gg["gameData"] = new GameData(function () {
                           that.StopFlyTo();
                           gg["ui"].setOpacity(0.0);
                           that.EnterChallenge();
                        });
                     });
                  }
                  else
                  {
                     var highscore = new HighScoreDialog(gg["ui"], list, hash, 500, 650, gg["player"]);
                     setTimeout(function(){
                        if(gg["state"] == GlobeGame.STATE.HIGHSCORE)
                        {
                           if (gg["score"])
                              gg["score"].Destroy();
                           gg["qCount"] = 0;
                           highscore.Destroy();
                           gg["gameData"] = new GameData(function () {
                              that.EnterIdle();
                           });
                        }
                     },20000);

                     highscore.RegisterCallback(function () {
                        if (gg["score"])
                           gg["score"].Destroy();
                        gg["qCount"] = 0;
                        gg["gameData"] = new GameData(function () {
                           that.StopFlyTo();
                           gg["ui"].setOpacity(0.0);
                           that.EnterChallenge();
                        });
                     });
                  }
               });
            });
         });
      jQuery(document).keypress(function(e) {
            keyboard.AppendKeyCode(e.which);
      });
      jQuery(document).keydown(function(e) {
         var nodeName = e.target.nodeName.toLowerCase();

         if (e.which === 8) {
            if ((nodeName === 'input' && e.target.type === 'text') ||
               nodeName === 'textarea') {
               // do nothing
            } else {
               if(!keyboard.destroyed)
               {
                  keyboard.Backspace();
                  e.preventDefault();
               }
            }
         }
         if (e.which === 13) {
            if ((nodeName === 'input' && e.target.type === 'text') ||
               nodeName === 'textarea') {
               // do nothing
            } else {
               if(!keyboard.destroyed)
               {
                  keyboard.OnOkay();
                  e.preventDefault();
               }
            }
         }

      });
   }
   else
   {
      var message = gg["locale"]["yourscore"] + gg["player"].playerScore.toString() + " "+ gg["locale"]["of"] + " " + gg["qMax"].toString();
      var pointMessage = new MessageDialog(gg["ui"], message, window.innerWidth / 2, (window.innerHeight / 2)-110, 500, 220);
      pointMessage.RegisterCallback(function () {
         if (gg["score"])
            gg["score"].Destroy();
         gg["qCount"] = 0;
         gg["gameData"] = new GameData(function () {
            that.StopFlyTo();
            gg["ui"].setOpacity(0.0);
            that.EnterChallenge();
         });
      });
      setTimeout(function(){
         if(gg["state"] == GlobeGame.STATE.HIGHSCORE)
         {
            if (gg["score"])
               gg["score"].Destroy();
            pointMessage.Destroy();
            gg["qCount"] = 0;
            gg["gameData"] = new GameData(function () {
               that.EnterIdle();
            });
         }
      },20000);
   }
};
//-----------------------------------------------------------------------------
/**
 * @description flying around the terrain
 */
GlobeGame.prototype.FlyAround = function () {
   gg["flystate"] = GlobeGame.FLYSTATE.FLYAROUND;
   ogSetPosition(gg["camera"], 8.006896018981934, 46.27399444580078, 10000000);
   ogSetOrientation(gg["camera"], 0, -90, 0);
   var views = [

      { "longitude": 8.006896018981934,
         "latitude": 46.27399444580078,
         "elevation": 6440.3505859375,
         "yaw": 0.6147540983606554,
         "pitch": -17.74590163934426,
         "roll": 0
      },
      { "longitude": 8.078167915344238,
         "latitude": 46.43217849731445,
         "elevation": 3730.73583984375,
         "yaw": -12.663934426229508,
         "pitch": -5.737704918032784,
         "roll": 0
      },
      { "longitude": 8.09277629852295,
         "latitude": 46.60940170288086,
         "elevation": 7909.09912109375,
         "yaw": -50.9016393442623,
         "pitch": -28.442622950819672,
         "roll": 0
      },
      { "longitude": 7.97355318069458,
         "latitude": 46.78914260864258,
         "elevation": 1968.3804931640625,
         "yaw": -108.60655737704916,
         "pitch": -18.360655737704917,
         "roll": 0
      },
      { "longitude": 8.006896018981934,
         "latitude": 46.27399444580078,
         "elevation": 10000000,
         "yaw": 0.0,
         "pitch": -90.0,
         "roll": 0.0
      }
   ];
   var pos = 0;
   ogSetFlightDuration(gg["scene"], 20000);
   var introFlyTo = function () {
      var oView = views[pos];
      ogFlyTo(gg["scene"], oView["longitude"], oView["latitude"], oView["elevation"], oView["yaw"], oView["pitch"], oView["roll"]);
      if (pos >= 4) {
         pos = 0;
      } else {
         pos += 1;
      }
   };
   ogSetInPositionFunction(gg["context"], introFlyTo);
   introFlyTo();
};
//-----------------------------------------------------------------------------
/**
 * @description process registered callbacks
 */
GlobeGame.prototype.CycleCallback = function () {
   for (var i = 0; i < this.callbacks.length; i++) {
      this.callbacks[i][1]();
   }
};
//-----------------------------------------------------------------------------
/**
 * @description process registered resize callbacks
 */
GlobeGame.prototype.ResizeCallback = function () {
   for (var i = 0; i < this.resizeCallbacks.length; i++) {
      this.resizeCallbacks[i][1]();
   }
};
//-----------------------------------------------------------------------------
/**
 * @description start challenge
 */
GlobeGame.prototype.InitQuiz = function () {
   this.currentChallenge.Activate();
};
//-----------------------------------------------------------------------------
/**
 * @description hook in functions to the game cycle if needed
 * @param {string} id
 * @param {function()} callback
 */
GlobeGame.prototype.RegisterCycleCallback = function (id, callback) {
   this.callbacks.push([id, callback]);
};
//-----------------------------------------------------------------------------
/**
 * @description remove callback functions from game cycle
 * @param {string} id
 */
GlobeGame.prototype.UnregisterCycleCallback = function (id) {
   for (var i = 0; i < this.callbacks.length; i++) {
      if (this.callbacks[i][0] == id) {
         this.callbacks.splice(i, 1);
      }
   }
};
//-----------------------------------------------------------------------------
/**
 * @description hook in functions to the window resize event if needed
 * @param {string} id
 * @param {function()} callback
 */
GlobeGame.prototype.RegisterResizeCallback = function (id, callback) {
   this.resizeCallbacks.push([id, callback]);
};
//-----------------------------------------------------------------------------
/**
 * @description remove callback functions from window resize
 * @param {string} id
 */
GlobeGame.prototype.UnregisterResizeCallback = function (id) {
   for (var i = 0; i < this.resizeCallbacks.length; i++) {
      if (this.resizeCallbacks[i][0] == id) {
         this.resizeCallbacks.splice(i, 1);
      }
   }
};
//-----------------------------------------------------------------------------
/**
 * @description preload art
 * @param {Object.<string>} sources
 * @param {(function()|null)} callback
 */
GlobeGame.prototype.LoadImages = function (sources, callback) {
   // get num of sources
   var that = this;
   for (var src in sources) {
      gg["numImages"]++;
   }
   for (var src in sources) {
      gg["images"][src] = new Image();
      gg["images"][src].onload = function () {
         if (++gg["loadedImages"] >= gg["numImages"]) {
            if (callback != null)
               callback();
         }
      };
      gg["images"][src].src = sources[src];
   }
};

//-----------------------------------------------------------------------------
/**
 * @description preload sounds
 * @param {Object.<string>} sounds
 * @param {(function()|null)} callback
 */
GlobeGame.prototype.LoadSounds = function (sounds, callback) {
   // get num of sources
   if (gg["soundenabled"]) {
      var that = this;
      for (var src in sounds) {
         gg["numSounds"]++;
      }
      try
      {
         for (var src in sounds) {
            gg["soundhandler"].sounds[src] = document.createElement('audio');
            gg["soundhandler"].sounds[src].setAttribute('src', sounds[src]);
            gg["soundhandler"].sounds[src].load();
            gg["soundhandler"].sounds[src].addEventListener("canplay", function () {
               if (++gg["loadedSounds"] >= gg["numSounds"]) {
                  if (callback != null)
                     callback();
               }
            }, true);
         }
      }
      catch(err)
      {
         gg["soundenabled"] = false;
      }
   } else {
      callback();
   }
};


//-----------------------------------------------------------------------------
/**
 * @description load languages
 * @param {function()} callback
 */
GlobeGame.prototype.LoadLanguage = function (callback) {
   jQuery.getJSON('data/lang_' + gg["lang"] + '.json', function (data) {
      gg["locale"] = data;
      if (callback != null)
         callback();
   });
};
//-----------------------------------------------------------------------------
/**
 * @description ProcessChallenge
 */
GlobeGame.prototype.ProcessChallenge = function () {
   if (gg["globeGame"]) {
      // evaluate past challenge
      if (gg["globeGame"].currentChallenge && !gg["globeGame"].currentChallenge.destroyed) {
         gg["globeGame"].currentChallenge.Destroy(gg["globeGame"].NextChallenge);
      }
      else {
         gg["globeGame"].NextChallenge();
      }
   }
};
//-----------------------------------------------------------------------------
/**
 * @description NextChallenge
 */
GlobeGame.prototype.NextChallenge = function () {
   gg["qCount"] += 1;
   gg["progress"].Inc();
   if (gg["qCount"] <= gg["qMax"]) {
      gg["globeGame"].currentChallenge = gg["gameData"].PickChallenge();
      gg["globeGame"].currentChallenge.RegisterCallback(gg["globeGame"].ProcessChallenge);
      gg["globeGame"].currentChallenge.Prepare(1200);
      BlackScreen(2500, function () {
         gg["globeGame"].InitQuiz();
      });
   }
   else {
      setTimeout(function () {
         gg["globeGame"].EnterHighscore()
      }, 1200);
      BlackScreen(2500, function () {
      });
   }
};
//-----------------------------------------------------------------------------
/**
 * @description NextChallenge
 */
GlobeGame.prototype.StopFlyTo = function () {
   ogSetInPositionFunction(gg["context"], function () {
   });
   ogStopFlyTo(gg["scene"]);
   gg["flystate"] = GlobeGame.FLYSTATE.IDLE;
};
//-----------------------------------------------------------------------------
/**
 * @description resize context event
 * @param {number} frame
 */
GlobeGame.prototype.OnCanvasRender = function (frame) {

};
//-----------------------------------------------------------------------------
/**
 * @description resize context event
 * @param {number} context
 */
GlobeGame.prototype.OnOGRender = function (context) {
   gg["globeGame"].CycleCallback();
   gg["stage"].draw();
};
//----------------------------------------------------------------------------
/**
 * @description resize context event
 * @param {number} context
 */
GlobeGame.prototype.OnOGResize = function (context) {
   gg["stage"].setSize(window.innerWidth, window.innerHeight);
   gg["centerX"] = window.innerWidth / 2;
   gg["centerY"] = window.innerHeight / 2;
   gg["globeGame"].ResizeCallback();
};

GlobeGame.prototype.GenerateUniqueId = function () {
   var s4 = function () {
      return Math.floor((1 + Math.random()) * 0x10000)
         .toString(16)
         .substring(1);
   };
   return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
};

goog.exportSymbol('GlobeGame', GlobeGame);
goog.exportProperty(GlobeGame.prototype, 'EnterIdle', GlobeGame.prototype.EnterIdle);
goog.exportProperty(GlobeGame.prototype, 'EnterChallenge', GlobeGame.prototype.EnterChallenge);
goog.exportProperty(GlobeGame.prototype, 'EnterHighscore', GlobeGame.prototype.EnterHighscore);
goog.exportProperty(GlobeGame.prototype, 'CycleCallback', GlobeGame.prototype.CycleCallback);
goog.exportProperty(GlobeGame.prototype, 'InitQuiz', GlobeGame.prototype.InitQuiz);
goog.exportProperty(GlobeGame.prototype, 'ProcessChallenge', GlobeGame.prototype.ProcessChallenge);
goog.exportProperty(GlobeGame.prototype, 'NextChallenge', GlobeGame.prototype.NextChallenge);
goog.exportProperty(GlobeGame.prototype, 'GenerateUniqueId', GlobeGame.prototype.GenerateUniqueId);
goog.exportProperty(GlobeGame.prototype, 'RegisterCycleCallback', GlobeGame.prototype.RegisterCycleCallback);
goog.exportProperty(GlobeGame.prototype, 'UnregisterCycleCallback', GlobeGame.prototype.UnregisterCycleCallback);
goog.exportProperty(GlobeGame.prototype, 'RegisterResizeCallback', GlobeGame.prototype.RegisterResizeCallback);
goog.exportProperty(GlobeGame.prototype, 'UnregisterResizeCallback', GlobeGame.prototype.UnregisterResizeCallback);
goog.exportProperty(GlobeGame.prototype, 'LoadImages', GlobeGame.prototype.LoadImages);
goog.exportProperty(GlobeGame.prototype, 'LoadLanguage', GlobeGame.prototype.LoadLanguage);
goog.exportProperty(GlobeGame.prototype, 'Init', GlobeGame.prototype.Init);
goog.exportProperty(GlobeGame.prototype, 'StopFlyTo', GlobeGame.prototype.StopFlyTo);
goog.exportProperty(GlobeGame.prototype, 'OnOGResize', GlobeGame.prototype.OnOGResize);
goog.exportProperty(GlobeGame.prototype, 'OnOGRender', GlobeGame.prototype.OnOGRender);
goog.exportProperty(GlobeGame.prototype, 'OnCanvasRender', GlobeGame.prototype.OnCanvasRender);