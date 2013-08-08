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
var m_images = {};
var m_containerObject = null;
var m_loadedImages = 0;
var m_numImages = 0;
var m_loadedSounds = 0;
var m_numSounds = 0;
var m_context = null;
var m_globe = null;
var m_scene = null;
var m_stage = null;
var m_ui = null;
var m_static = null;
var m_camera = null;
var m_centerX = window.innerWidth / 2;
var m_centerY = window.innerHeight / 2;
var m_lang = "none";
var m_datahost = "http://localhost";
var m_locale = [];
var m_player = null;
var m_qCount = 0;
var m_qMax = 1;
var m_progress = null;
var m_soundhandler = new SoundHandler();
var m_soundenabled = true;
var m_showhash = false;
/** @type {GlobeGame.STATE} */
var m_state = GlobeGame.STATE.IDLE;
var m_flystate = GlobeGame.FLYSTATE.IDLE;
var m_score = null;
/** @type {GameData} */
var m_gameData = null;
/** @type {GlobeGame} */
var m_globeGame = null;
var m_debug = false;
var m_loaded = false;
var m_minimode = false;
var m_onlinemode = true;
var m_chooselang = false;
var m_rootPath = "";

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
   m_containerObject = canvasDiv;
   var loc = location+"";
   m_rootPath = loc.substr(0,loc.lastIndexOf("/")+1);
   if (datapath) {
      m_datahost = datapath;
   }
   m_qCount = 0;
   this.currentChallenge = null;
   this.callbacks = [];
   this.resizeCallbacks = [];
   var that = this;
   m_globeGame = this;
   m_stage = new Kinetic.Stage({
      container: canvasDiv,
      width: window.innerWidth,
      height: window.innerHeight,
      x: 0,
      y: 0
   });
   m_ui = new Kinetic.Layer();
   m_static = new Kinetic.Layer();
   m_soundenabled = soundenabled;
   m_showhash = showhash;
   m_minimode = minimode;
   m_chooselang = chooselang;
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
      btn_01: "art/btn_01.png",
      btn_01_c: "art/btn_01_c.png",
      btn_01_h: "art/btn_01_h.png",
      btn_01_d: "art/btn_01_d.png",
      btn_01_f: "art/btn_01_f.png",
      btn_01_t: "art/btn_01_t.png",
      btn_01_o: "art/btn_01_o.png",
      btn_02: "art/btn_02.png",
      btn_02_c: "art/btn_02_c.png",
      btn_02_h: "art/btn_02_h.png",
      clock: "art/clock.png",
      dial: "art/dial.png",
      pin_blue: "art/pin_blue.png",
      pin_red: "art/pin_red.png",
      pin_green: "art/pin_green.png",
      pin_yellow: "art/pin_yellow.png",
      nw_logo: "art/nw_logo.png",
      logo: "art/logo.png",
      logo_sm: "art/logo_sm.png",
      coins: "art/coins.png",
      logo_owg: "art/logo_owg.png",
      screenshot: "art/screen.png",
      twitter: "art/twitter.png",
      facebook: "art/facebook.png"
   };
   // Preload sounds
   var sounds = {
      pick: "sfx/pick.wav",
      correct: "sfx/correct.wav",
      wrong: "sfx/wrong.wav",
      coins: "sfx/coins.wav",
      highscores: "sfx/highscores.mp3",
      track01: "sfx/track01.mp3",
      track02: "sfx/track02.mp3",
      track03: "sfx/track03.mp3",
      track04: "sfx/track04.mp3",
      swoosh: "sfx/swoosh.wav",
      ping1: "sfx/ping1.wav",
      ping2: "sfx/ping2.wav"
   };

   /*  var c = document.getElementById('canvas');
    c.addEventListener("touchstart", this.TouchHandler, true);
    c.addEventListener("touchmove", this.TouchHandler, true);
    c.addEventListener("touchend", this.TouchHandler, true);
    c.addEventListener("touchcancel", this.TouchHandler, true);*/
   var loadingText = new ScreenText(m_ui, "Loading sounds...", m_centerX, m_centerY, 25, "center");
   that.LoadSounds(sounds, function () {
      loadingText.text = "Loading images...";
      that.LoadImages(sources, function () {
         loadingText.text = "Choose language";

         var doInit = function () {
            loadingText.text = "Loading language...";

            that.LoadLanguage(function () {
               if (!m_loaded) {
                  m_loaded = true;
                  loadingText.Destroy();

                  /* nw logo & swisstopo copyright */
                  var statics = new Kinetic.Shape({drawFunc: function (canvas) {
                     var ctx = canvas.getContext();
                     if (m_state != GlobeGame.STATE.CHALLENGE) {
                        ctx.drawImage(m_images["logo"], window.innerWidth / 2 - 352, 30, 705, 206);
                     }
                     else {
                        ctx.drawImage(m_images["logo_sm"], window.innerWidth - 260, 4, 254, 50);
                     }
                     ctx.fillStyle = "#FFF";
                     ctx.font = "11pt TitanOne";
                     ctx.fillText("Image data © MAPPULS", (window.innerWidth / 2)-100, window.innerHeight - 5);
                     ctx.lineWidth = 1;
                     ctx.strokeStyle = "#000"; // stroke color
                     ctx.strokeText("Image data © MAPPULS", (window.innerWidth / 2)-100, window.innerHeight - 5);
                     ctx.drawImage(m_images["logo_owg"], 0, window.innerHeight - 120, 240, 86);
                     if (m_debug) {
                        ctx.fillStyle = "#F00";
                        ctx.font = "8pt TitanOne";
                        ctx.textAlign = "left";
                        ctx.fillText("State:" + m_state, 5, 80);
                        ctx.fillText("Flystate:" + m_flystate, 5, 90);
                     }
                     canvas.fillStroke(this);
                  }});
                  m_static.add(statics);


                  var nw_logo = new Kinetic.Shape({drawFunc: function (canvas) {
                     var ctx = canvas.getContext();
                     ctx.drawImage(m_images["nw_logo"], window.innerWidth - 365, window.innerHeight - 40, 360, 44);
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
                  m_static.add(nw_logo);

                  var owg_link = new Kinetic.Shape({drawFunc: function (canvas) {
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
                  m_static.add(owg_link);

                  if (m_soundenabled) {
                     try
                     {
                     m_soundhandler.sounds["track01"].volume = 0.25;
                     m_soundhandler.sounds["track01"].addEventListener("ended", function () {
                        m_soundhandler.sounds["track02"].play();
                     }, true);
                     m_soundhandler.sounds["track02"].volume = 0.25;
                     m_soundhandler.sounds["track02"].addEventListener("ended", function () {
                        m_soundhandler.sounds["track03"].play();
                     }, true);
                     m_soundhandler.sounds["track03"].volume = 0.25;
                     m_soundhandler.sounds["track03"].addEventListener("ended", function () {
                        m_soundhandler.sounds["track04"].play();
                     }, true);
                     m_soundhandler.sounds["track04"].volume = 0.25;
                     m_soundhandler.sounds["track04"].addEventListener("ended", function () {
                        m_soundhandler.sounds["track01"].play();
                     }, true);
                     var index = Math.floor(Math.random() * 4 + 1);
                     m_soundhandler.sounds["track0" + index].play();
                     }
                     catch(err)
                     {
                        m_soundenabled = false;
                     }
                  }
                  // load gamedata
                  m_gameData = new GameData(function () {
                     that.EnterIdle();
                  });
               }
            });
         }
         if(m_chooselang == true)
         {
            var btn_de = new Button02(m_ui, "btn_de", (window.innerWidth / 2) - 120, 300, 76, 69, "DEU", 15, function () {
               m_lang = "de";
               btn_de.Destroy();
               btn_fr.Destroy();
               btn_en.Destroy();
               doInit();
            });
            var btn_fr = new Button02(m_ui, "btn_fr", (window.innerWidth / 2) - 40, 300, 76, 69, "FRA", 15, function () {
               m_lang = "fr";
               btn_de.Destroy();
               btn_fr.Destroy();
               btn_en.Destroy();
               doInit();
            });
            var btn_en = new Button02(m_ui, "btn_en", (window.innerWidth / 2) + 40, 300, 76, 69, "ENG", 15, function () {
               m_lang = "en";
               btn_de.Destroy();
               btn_fr.Destroy();
               btn_en.Destroy();
               doInit();
            });
         }
         else
         {
            m_lang = "de";
            doInit();
         }
      });
   });
   m_context = ogCreateContext({canvas: "canvas",
         fullscreen: true
      }
   );
   m_scene = ogCreateScene(m_context, OG_SCENE_3D_ELLIPSOID_WGS84, {
         rendertotexture: false
      }
   );
   m_globe = ogCreateWorld(m_scene);
   m_camera = ogGetActiveCamera(m_scene);
   // Add OWG Data



      ogAddImageLayer(m_globe, {
      url: ["http://geoapp.openwebglobe.org/mapcache/owg"],
      layer: "world3",
      service: "owg"
   });

   ogAddElevationLayer(m_globe, {
      url: ["http://tile1.openwebglobe.org/mapcache/owg",
         "http://tile2.openwebglobe.org/mapcache/owg",
         "http://tile3.openwebglobe.org/mapcache/owg"],
      layer: "aster",
      service: "owg"
   });

   if (renderQuality != null) {
      ogSetRenderQuality(m_globe, renderQuality);
   }
   ogSetRenderFunction(m_context, this.OnOGRender);
   ogSetResizeFunction(m_context, this.OnOGResize);


   m_stage.add(m_static);
   m_stage.add(m_ui);
};
//-----------------------------------------------------------------------------
/**
 * @description STATE function enter idle mode
 */
GlobeGame.prototype.EnterIdle = function () {
   var that = this;
   m_state = GlobeGame.STATE.IDLE;

   var startMessage = new MessageDialog(m_ui, m_locale.start, window.innerWidth / 2, window.innerHeight - 200, 500, 220);
   startMessage.RegisterCallback(function () {
      that.StopFlyTo();
      m_ui.setOpacity(0.0);
      that.EnterChallenge();
   });
   if(m_flystate != GlobeGame.FLYSTATE.FLYAROUND)
   {
      this.FlyAround();
   }
};
//-----------------------------------------------------------------------------
/**
 * @description STATE function enter challenge mode
 */
GlobeGame.prototype.EnterChallenge = function () {
   m_state = GlobeGame.STATE.CHALLENGE;
   m_player = new Player("");
   m_score = new ScoreCount(m_ui);
   m_progress = new ProgressCount(m_ui, m_qMax);
   this.ProcessChallenge();

};
//-----------------------------------------------------------------------------
/**
 * @description STATE function enter highscore
 */
GlobeGame.prototype.EnterHighscore = function () {

   var that = this;
   if (m_progress)
      m_progress.Destroy();
   m_ui.setOpacity(1.0);
   m_state = GlobeGame.STATE.HIGHSCORE;
   this.FlyAround();
   if(m_minimode == false)
   {
      var keyboard = new TouchKeyboard(m_ui, "keys", (window.innerWidth / 2) - 426, (window.innerHeight / 2) - 195, m_locale["entername"],
         function (name) {
            m_player.playerName = name;
            keyboard.Destroy();
            m_soundhandler.Play("highscores");
            jQuery.get('hash.php', function (data1) {
               jQuery.get('db.php?action=append&name=' + m_player.playerName + '&score=' + m_player.playerScore + "&hash=" + data1, function (data2) {

                  var hash = data1;
                  var list = /** @type {Array} */eval(data2);

                  if (m_onlinemode)
                  {
                     var shareDialog = new ShareDialog(m_ui, hash, 700, 700, m_player);

                     var pointLayer = new Kinetic.Layer();

                     m_stage.add(pointLayer);
                     pointLayer.setSize(640,480);
                     pointLayer.setPosition(Math.floor((window.innerWidth-640)/2), Math.floor((window.innerHeight-450)/2)-88);
                     var pointShape = new Kinetic.Shape({drawFunc: function (canvas) {
                        var ctx = canvas.getContext();
                        ctx.drawImage(m_images["screenshot"], 0, 0, 640, 480);
                        ctx.drawImage(m_images["logo"], 80, 20, 480, 150);
                        ctx.fillStyle = "#FD6";
                        ctx.font = "40pt TitanOne";
                        ctx.textAlign = "left";
                        var textWidth = ctx.measureText(m_player.playerName).width;
                        var tX = (640 - textWidth) / 2;
                        ctx.fillText(m_player.playerName, tX, 260);
                        ctx.lineWidth = 2;
                        ctx.strokeStyle = "#000"; // stroke color
                        ctx.strokeText(m_player.playerName, tX, 260);
                        ctx.fillStyle = "#8FF";
                        ctx.font = "42pt TitanOne";
                        textWidth = ctx.measureText(m_player.playerScore+ " " + m_locale["points"]).width;
                        tX = (640 - textWidth) / 2;
                        ctx.fillText(m_player.playerScore+ " " + m_locale["points"], tX, 330);
                        ctx.lineWidth = 2;
                        ctx.strokeStyle = "#000"; // stroke color
                        ctx.strokeText(m_player.playerScore+ " " + m_locale["points"], tX, 330);
                        ctx.fillStyle = "#FFF";
                        ctx.font = "14pt TitanOne";
                        ctx.fillText("www.openwebglobe.org",8, 470);
                        ctx.lineWidth = 1;
                        ctx.strokeStyle = "#000"; // stroke color
                        ctx.strokeText("www.openwebglobe.org", 8, 470);
                        ctx.drawImage(m_images["logo_owg"], 0, 370, 240, 86);
                        ctx.drawImage(m_images["nw_logo"], 280, 435, 360, 44);
                        ctx.closePath();
                     }});

                     var facebook_share = new Kinetic.Shape({drawFunc: function (canvas) {
                        var ctx = canvas.getContext();
                        ctx.drawImage(m_images["facebook"], 25, 485, 75, 75);
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

                     var twitter_share = new Kinetic.Shape({drawFunc: function (canvas) {
                        var ctx = canvas.getContext();
                        ctx.drawImage(m_images["twitter"], 400, 485, 75, 75);
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
                              type: "POST",
                              url: "ul.php",
                              data: { "data" : dynamicCanvas.toDataURL("image/jpeg", 0.65)},
                              success: function(response){ /*window.open(response);*/
                                 var linkFB = "http://www.facebook.com/sharer/sharer.php?s=100&p[title]="+encodeURIComponent(m_player.playerName + " reached " + m_player.playerScore + " points in SwissQuiz")+"&p[url]="+encodeURIComponent("http://www.swizzquiz.ch")+"&p[summary]="+encodeURIComponent("SwizzQuiz")+"&p[images][0]="+encodeURIComponent(m_rootPath+response);
                                 var linkTW = "https://twitter.com/share?url="+encodeURIComponent(m_rootPath+response)+"&text="+encodeURIComponent("Just played SwizzQuiz and earned "+ m_player.playerScore+ " points. See http://www.swizzquiz.ch for more");
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
                              cache: false
                           });
                        };
                     }, 10);
                     shareDialog.RegisterCallback(function () {
                        if (m_score)
                           m_score.Destroy();
                        pointShape.remove();
                        pointLayer.remove();
                        m_qCount = 0;
                        m_gameData = new GameData(function () {
                           that.StopFlyTo();
                           m_ui.setOpacity(0.0);
                           that.EnterChallenge();
                        });
                     });
                  }
                  else
                  {
                     var highscore = new HighScoreDialog(m_ui, list, hash, 500, 650, m_player);
                     setTimeout(function(){
                        if(m_state == GlobeGame.STATE.HIGHSCORE)
                        {
                           if (m_score)
                              m_score.Destroy();
                           m_qCount = 0;
                           highscore.Destroy();
                           m_gameData = new GameData(function () {
                              that.EnterIdle();
                           });
                        }
                     },20000);

                     highscore.RegisterCallback(function () {
                        if (m_score)
                           m_score.Destroy();
                        m_qCount = 0;
                        m_gameData = new GameData(function () {
                           that.StopFlyTo();
                           m_ui.setOpacity(0.0);
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
      $(document).keydown(function(e) {
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
      });
   }
   else
   {
      var message = m_locale["yourscore"] + m_player.playerScore.toString() + " "+ m_locale["of"] + " " + m_qMax.toString();
      var pointMessage = new MessageDialog(m_ui, message, window.innerWidth / 2, (window.innerHeight / 2)-110, 500, 220);
      pointMessage.RegisterCallback(function () {
         if (m_score)
            m_score.Destroy();
         m_qCount = 0;
         m_gameData = new GameData(function () {
            that.StopFlyTo();
            m_ui.setOpacity(0.0);
            that.EnterChallenge();
         });
      });
      setTimeout(function(){
         if(m_state == GlobeGame.STATE.HIGHSCORE)
         {
            if (m_score)
               m_score.Destroy();
            pointMessage.Destroy();
            m_qCount = 0;
            m_gameData = new GameData(function () {
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
   m_flystate = GlobeGame.FLYSTATE.FLYAROUND;
   ogSetPosition(m_camera, 8.006896018981934, 46.27399444580078, 10000000);
   ogSetOrientation(m_camera, 0, -90, 0);
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
   ogSetFlightDuration(m_scene, 20000);
   var introFlyTo = function () {
      var oView = views[pos];
      ogFlyTo(m_scene, oView["longitude"], oView["latitude"], oView["elevation"], oView["yaw"], oView["pitch"], oView["roll"]);
      if (pos >= 4) {
         pos = 0;
      } else {
         pos += 1;
      }
   };
   ogSetInPositionFunction(m_context, introFlyTo);
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
      m_numImages++;
   }
   for (var src in sources) {
      m_images[src] = new Image();
      m_images[src].onload = function () {
         if (++m_loadedImages >= m_numImages) {
            if (callback != null)
               callback();
         }
      };
      m_images[src].src = sources[src];
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
   if (m_soundenabled) {
      var that = this;
      for (var src in sounds) {
         m_numSounds++;
      }
      try
      {
         for (var src in sounds) {
            m_soundhandler.sounds[src] = document.createElement('audio');
            m_soundhandler.sounds[src].setAttribute('src', sounds[src]);
            m_soundhandler.sounds[src].load();
            m_soundhandler.sounds[src].addEventListener("canplay", function () {
               if (++m_loadedSounds >= m_numSounds) {
                  if (callback != null)
                     callback();
               }
            }, true);
         }
      }
      catch(err)
      {
         m_soundenabled = false;
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
   jQuery.getJSON('data/lang_' + m_lang + '.json', function (data) {
      m_locale = data;
      if (callback != null)
         callback();
   });
};
//-----------------------------------------------------------------------------
/**
 * @description ProcessChallenge
 */
GlobeGame.prototype.ProcessChallenge = function () {
   if (m_globeGame) {
      // evaluate past challenge
      if (m_globeGame.currentChallenge && !m_globeGame.currentChallenge.destroyed) {
         m_globeGame.currentChallenge.Destroy(m_globeGame.NextChallenge);
      }
      else {
         m_globeGame.NextChallenge();
      }
   }
};
//-----------------------------------------------------------------------------
/**
 * @description NextChallenge
 */
GlobeGame.prototype.NextChallenge = function () {
   m_qCount += 1;
   m_progress.Inc();
   if (m_qCount <= m_qMax) {
      m_globeGame.currentChallenge = m_gameData.PickChallenge();
      m_globeGame.currentChallenge.RegisterCallback(m_globeGame.ProcessChallenge);
      m_globeGame.currentChallenge.Prepare(1200);
      BlackScreen(2500, function () {
         m_globeGame.InitQuiz();
      });
   }
   else {
      setTimeout(function () {
         m_globeGame.EnterHighscore()
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
   ogSetInPositionFunction(m_context, function () {
   });
   ogStopFlyTo(m_scene);
   m_flystate = GlobeGame.FLYSTATE.IDLE;
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
   m_globeGame.CycleCallback();
   m_stage.draw();
};
//----------------------------------------------------------------------------
/**
 * @description resize context event
 * @param {number} context
 */
GlobeGame.prototype.OnOGResize = function (context) {
   m_stage.setSize(window.innerWidth, window.innerHeight);
   m_centerX = window.innerWidth / 2;
   m_centerY = window.innerHeight / 2;
   m_globeGame.ResizeCallback();
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