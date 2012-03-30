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
/**
 * Members
 * */
 var m_images = {};
var m_loadedImages = 0;
var m_numImages = 0;
var m_sounds = {};
var m_loadedSounds = 0;
var m_numSounds = 0;
var m_context = null;
var m_globe = null;
var m_stage = null;
var m_ui =     null;
var m_static = null;
var m_centerX = window.innerWidth/2;
var m_centerY = window.innerHeight/2;
var m_lang = "de";
var m_datahost = "http://localhost";
var m_locale = [];
var m_player = null;
var m_qCount = 0;
var m_qMax = 10;
var m_progress = null;
/** @type {GlobeGame.STATE} */
var m_state = GlobeGame.STATE.IDLE;
var m_score = null;
/** @type {GameData} */
var m_gameData = null;
/** @type {GlobeGame} */
var m_globeGame = null;

/**
 * @class GlobeGame
 * @constructor
 *
 * @description main class of globe game
 *
 * @author Robert Wüest robert.wst@gmail.ch
 * @param {string} canvasDiv
 * @param {(string|null)} datapath
 */
function GlobeGame(canvasDiv, datapath)
{
    if(datapath)
    {
        m_datahost = datapath;
    }
    m_qCount = 0;
    this.currentChallenge = null;
    this.callbacks = [];
    var that = this;
    m_globeGame = this;
    m_stage = new Kinetic.Stage(canvasDiv, window.innerWidth, window.innerHeight);
    m_ui = new Kinetic.Layer();
    m_static = new Kinetic.Layer();
}

//-----------------------------------------------------------------------------
/**
 * @description init game and preload data
 * @param {function({number})} renderCallback
 * @param {({number}|null)} renderQuality
 */
GlobeGame.prototype.Init = function(renderCallback, renderQuality)
{
    var that = this;

    /* Preload */
    // load gamedata
    m_gameData = new GameData(function()
    {
        // Preload images
        var sources = {
            btn_01: "art/btn_01.png",
            btn_01_c: "art/btn_01_c.png",
            btn_01_h: "art/btn_01_h.png",
            btn_01_d: "art/btn_01_d.png",
            btn_01_f: "art/btn_01_f.png",
            btn_01_t: "art/btn_01_t.png",
            btn_01_o: "art/btn_01_o.png",
            btn_02:   "art/btn_02.png",
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
            coins: "art/coins.png"
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

        var loadingText = new ScreenText(m_ui, "Loading language...",m_centerX, m_centerY, 25, "center");
        that.LoadLanguage(function()
        {
            loadingText.text = "Loading sounds...";
            that.LoadSounds(sounds, function(){
                loadingText.text = "Loading images...";
                that.LoadImages(sources, function(){
                    loadingText.Destroy();
                    /* nw logo */
                    var statics = new Kinetic.Shape({drawFunc:function(){
                        var ctx = this.getContext();
                        ctx.drawImage(m_images["nw_logo"], 1, window.innerHeight-58, 469, 57);
                        if(m_state != GlobeGame.STATE.CHALLENGE)
                        {
                            ctx.drawImage(m_images["logo"], window.innerWidth/2-352, 30, 705, 206);
                        }
                        else
                        {
                            ctx.drawImage(m_images["logo_sm"], window.innerWidth-260, 4, 254, 50);
                        }
                        ctx.textAlign = "right";
                        ctx.fillStyle = "#FFF";
                        ctx.font = "18pt TitanOne";
                        ctx.fillText("www.openwebglobe.org", window.innerWidth-13, window.innerHeight-20);
                        ctx.lineWidth = 1;
                        ctx.strokeStyle = "#000"; // stroke color
                        ctx.strokeText("www.openwebglobe.org", window.innerWidth-13, window.innerHeight-20);
                    }});
                    m_static.add(statics);
                    m_sounds["track01"].volume = 0.25;
                    m_sounds["track01"].addEventListener("ended", function() {
                        m_sounds["track02"].play();
                    },true);
                    m_sounds["track02"].volume = 0.25;
                    m_sounds["track02"].addEventListener("ended", function() {
                        m_sounds["track03"].play();
                    },true);
                    m_sounds["track03"].volume = 0.25;
                    m_sounds["track03"].addEventListener("ended", function() {
                        m_sounds["track04"].play();
                    },true);
                    m_sounds["track04"].volume = 0.25;
                    m_sounds["track04"].addEventListener("ended", function() {
                        m_sounds["track01"].play();
                    },true);
                    var index = Math.floor(Math.random()*4+1);
                    m_sounds["track0"+index].play();
                    that.EnterIdle();
                });
            });
        });
    });
    m_context = ogCreateContextFromCanvas("canvas", true);
    m_globe = ogCreateGlobe(m_context);
    // Add OWG Data
    ogAddImageLayer(m_globe, {
        url: [m_datahost],
        layer: "bluemarble",
        service: "owg"
    });
    ogAddImageLayer(m_globe, {
        url: [m_datahost],
        layer: "swissimage",
        service: "owg"
    });

    ogAddElevationLayer(m_globe, {
        url: [m_datahost],
        layer: "DHM25",
        service: "owg"
    });
    if(renderQuality != null)
    {
        ogSetRenderQuality(m_globe,renderQuality);
    }
    ogSetRenderFunction(m_context, this.OnOGRender);
    ogSetResizeFunction(m_context, this.OnOGResize);


    m_stage.add(m_static);
    m_stage.add(m_ui);

    m_stage.onFrame(function(frame){
        that.OnCanvasRender(frame);
        renderCallback(frame);
    });
    m_stage.start();
};
//-----------------------------------------------------------------------------
/**
 * @description STATE function enter idle mode
 */
GlobeGame.prototype.EnterIdle = function()
{
    var that = this;
    m_state = GlobeGame.STATE.IDLE;
    var startMessage = new MessageDialog(m_ui, m_locale.start, window.innerWidth/2, window.innerHeight-200, 500, 220);
    startMessage.RegisterCallback(function(){
        that.StopFlyTo();
        m_ui.setAlpha(0.0);
        that.EnterChallenge();
    });
    this.FlyAround();
};
//-----------------------------------------------------------------------------
/**
 * @description STATE function enter challenge mode
 */
GlobeGame.prototype.EnterChallenge = function()
{
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
GlobeGame.prototype.EnterHighscore = function()
{
    var that = this;
    if(m_progress)
        m_progress.Destroy();
    m_ui.setAlpha(1.0);
    m_state = GlobeGame.STATE.HIGHSCORE;
    this.FlyAround();
    var keyboard = new TouchKeyboard(m_ui,"keys",(window.innerWidth/2)-426,(window.innerHeight/2)-195, m_locale["entername"],
        function(name){
            m_player.playerName = name;
            keyboard.Destroy();
            m_sounds["highscores"].play();

            jQuery.get('db.php?action=append&name='+m_player.playerName+'&score='+m_player.playerScore, function(data) {

                var list = /** @type {Array} */eval(data);

                var highscore = new HighScoreDialog(m_ui, list, 500, 650, m_player);

                highscore.RegisterCallback(function(){
                    if(m_score)
                        m_score.Destroy();
                    m_qCount = 0;
                    m_gameData = new GameData(function()
                    {
                        that.StopFlyTo();
                        m_ui.setAlpha(0.0);
                        that.EnterChallenge();
                    });
                });
            });
        });
};
//-----------------------------------------------------------------------------
/**
 * @description flying around the terrain
 */
GlobeGame.prototype.FlyAround = function()
{
    var scene = ogGetScene(m_context);
    var cam = ogGetActiveCamera(scene);
    ogSetPosition(cam,8.006896018981934,46.27399444580078,10000000);
    ogSetOrientation(cam,0,-90,0);
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
            "elevation":10000000,
            "yaw": 0.0,
            "pitch": -90.0,
            "roll": 0.0
        }
    ];
    var pos = 0;
    ogSetFlightDuration(scene,20000);
    var introFlyTo = function()
    {
        var oView = views[pos];
        ogFlyTo(scene,oView["longitude"],oView["latitude"], oView["elevation"],oView["yaw"],oView["pitch"],oView["roll"]);
        if(pos >= 4) {pos = 0;} else{ pos += 1; }
    };
    ogSetInPositionFunction(m_context,introFlyTo);
    introFlyTo();
};
//-----------------------------------------------------------------------------
/**
 * @description process registered callbacks
 */
GlobeGame.prototype.CycleCallback = function()
{
    for(var i = 0; i < this.callbacks.length; i++)
    {
        this.callbacks[i][1]();
    }
};
//-----------------------------------------------------------------------------
/**
 * @description start challenge
 */
GlobeGame.prototype.InitQuiz = function()
{
    this.currentChallenge.Activate();
};
//-----------------------------------------------------------------------------
/**
 * @description hook in functions to the game cycle if needed
 * @param {number} id
 * @param {function()} callback
 */
GlobeGame.prototype.RegisterCycleCallback = function(id, callback)
{
    this.callbacks.push([id,callback]);
};
//-----------------------------------------------------------------------------
/**
 * @description remove callback functions from game cycle
 * @param {number} id
 */
GlobeGame.prototype.UnregisterCycleCallback = function(id)
{
    for(var i = 0; i < this.callbacks.length; i++)
    {
        if(this.callbacks[i][0] == id)
        {
            this.callbacks.splice(i,1);
        }
    }
};
//-----------------------------------------------------------------------------
/**
 * @description preload art
 * @param {Object.<string>} sources
 * @param {(function()|null)} callback
 */
GlobeGame.prototype.LoadImages = function(sources, callback){
    // get num of sources
    var that = this;
    for (var src in sources) {
        m_numImages++;
    }
    for (var src in sources) {
        m_images[src] = new Image();
        m_images[src].onload = function(){
         if (++m_loadedImages >= m_numImages) {
             if(callback != null)
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
GlobeGame.prototype.LoadSounds = function(sounds, callback){
    // get num of sources
    var that = this;
    for (var src in sounds) {
        m_numSounds++;
    }
    for (var src in sounds) {
        m_sounds[src] = document.createElement('audio');
        m_sounds[src].setAttribute('src', sounds[src]);
        m_sounds[src].load();
        m_sounds[src].addEventListener("canplay", function() {
            if (++m_loadedSounds >= m_numSounds) {
                if(callback != null)
                    callback();
            }
        },true);
    }
};

//-----------------------------------------------------------------------------
/**
 * @description load languages
 * @param {function()} callback
 */
GlobeGame.prototype.LoadLanguage = function(callback)
{
    jQuery.getJSON('data/lang_'+m_lang+'.json', function(data) {
        m_locale = data;
        if(callback != null)
        callback();
    });
};
//-----------------------------------------------------------------------------
/**
 * @description ProcessChallenge
 */
GlobeGame.prototype.ProcessChallenge = function()
{
    if(m_globeGame)
    {
        // evaluate past challenge
        if(m_globeGame.currentChallenge && !m_globeGame.currentChallenge.destroyed)
        {
            m_globeGame.currentChallenge.Destroy(m_globeGame.NextChallenge);
        }
        else
        {
            m_globeGame.NextChallenge();
        }
    }
};
//-----------------------------------------------------------------------------
/**
 * @description NextChallenge
 */
GlobeGame.prototype.NextChallenge = function()
{
    m_qCount += 1;
    m_progress.Inc();
    if(m_qCount <= m_qMax){
        m_globeGame.currentChallenge = m_gameData.PickChallenge();
        m_globeGame.currentChallenge.RegisterCallback(m_globeGame.ProcessChallenge);
        m_globeGame.currentChallenge.Prepare(1000);
        BlackScreen(3500, function(){
            m_globeGame.InitQuiz();
        });
    }
    else
    {
        setTimeout(function(){m_globeGame.EnterHighscore()}, 1500);
        BlackScreen(3500, function(){
        });
    }
};
//-----------------------------------------------------------------------------
/**
 * @description NextChallenge
 */
GlobeGame.prototype.StopFlyTo = function()
{
    var scene = ogGetScene(m_context);
    ogSetInPositionFunction(m_context,function(){});
    ogStopFlyTo(scene);
};
//-----------------------------------------------------------------------------
/**
 * @description resize context event
 * @param {number} frame
 */
GlobeGame.prototype.OnCanvasRender = function(frame)
{
    m_stage.draw();
    this.CycleCallback();
};
//-----------------------------------------------------------------------------
/**
 * @description resize context event
 * @param {number} context
 */
GlobeGame.prototype.OnOGRender = function(context)
{

};
//-----------------------------------------------------------------------------
/**
 * @description resize context event
 * @param {number} context
 */
GlobeGame.prototype.OnOGResize = function(context)
{
    m_stage.setSize(window.innerWidth, window.innerHeight);
    m_centerX = window.innerWidth/2;
    m_centerY = window.innerHeight/2;
};

goog.exportSymbol('GlobeGame', GlobeGame);
goog.exportProperty(GlobeGame.prototype, 'EnterIdle', GlobeGame.prototype.EnterIdle);
goog.exportProperty(GlobeGame.prototype, 'EnterChallenge', GlobeGame.prototype.EnterChallenge);
goog.exportProperty(GlobeGame.prototype, 'EnterHighscore', GlobeGame.prototype.EnterHighscore);
goog.exportProperty(GlobeGame.prototype, 'CycleCallback', GlobeGame.prototype.CycleCallback);
goog.exportProperty(GlobeGame.prototype, 'InitQuiz', GlobeGame.prototype.InitQuiz);
goog.exportProperty(GlobeGame.prototype, 'ProcessChallenge', GlobeGame.prototype.ProcessChallenge);
goog.exportProperty(GlobeGame.prototype, 'NextChallenge', GlobeGame.prototype.NextChallenge);
goog.exportProperty(GlobeGame.prototype, 'RegisterCycleCallback', GlobeGame.prototype.RegisterCycleCallback);
goog.exportProperty(GlobeGame.prototype, 'UnregisterCycleCallback', GlobeGame.prototype.UnregisterCycleCallback);
goog.exportProperty(GlobeGame.prototype, 'LoadImages', GlobeGame.prototype.LoadImages);
goog.exportProperty(GlobeGame.prototype, 'LoadLanguage', GlobeGame.prototype.LoadLanguage);
goog.exportProperty(GlobeGame.prototype, 'Init', GlobeGame.prototype.Init);
goog.exportProperty(GlobeGame.prototype, 'StopFlyTo', GlobeGame.prototype.StopFlyTo);
goog.exportProperty(GlobeGame.prototype, 'OnOGResize', GlobeGame.prototype.OnOGResize);
goog.exportProperty(GlobeGame.prototype, 'OnOGRender', GlobeGame.prototype.OnOGRender);
goog.exportProperty(GlobeGame.prototype, 'OnCanvasRender', GlobeGame.prototype.OnCanvasRender);