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
/**
 * Members
 * */
var m_images = {};
var m_loadedImages = 0;
var m_numImages = 0;
var m_context = null;
var m_globe = null;
var m_stage = null;
var m_ui =     null;
var m_static = null;
var m_centerX = window.innerWidth/2;
var m_centerY = window.innerHeight/2;
var m_lang = "de";
var m_locale = [];
var m_player = null;
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
 */
function GlobeGame(canvasDiv)
{
    /* State definitions
     0: Idle Mode intro
     1: Configuring Player
     2: Challenge
     3: Terminate show highscore
     */
    this.state = 0;
    this.qCount = 0;
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
 * @description initialize player and pick first challenge
 */
GlobeGame.prototype.OnLoaded = function()
{
    this.state = 1;
    var name = prompt(m_locale["entername"], "Name");
    m_player = new Player(name);
    m_score = new ScoreCount(m_ui);
    this.currentChallenge = m_gameData.PickChallenge();
    this.InitQuiz();
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
    this.state = 2;
};
//-----------------------------------------------------------------------------
/**
 * @description move on to next available challenge
 */
GlobeGame.prototype.NextChallenge = function()
{
    if(m_gameData.questions.length > 0){
        this.currentChallenge = m_gameData.PickChallenge();
        this.InitQuiz();
    }
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
}
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
}

//-----------------------------------------------------------------------------
/**
 * @description init game and preload data
 * @param {function({number})} renderCallback
 */
GlobeGame.prototype.Init = function(renderCallback)
{
    var that = this;

    // load gamedata
    m_gameData = new GameData();
    // Preload images
    var sources = {
        btn_01: "art/btn_01.png",
        btn_01_c: "art/btn_01_c.png",
        btn_01_h: "art/btn_01_h.png",
        btn_01_d: "art/btn_01_d.png",
        btn_01_f: "art/btn_01_f.png",
        btn_01_t: "art/btn_01_t.png",
        btn_01_o: "art/btn_01_o.png",
        clock: "art/clock.png",
        dial: "art/dial.png",
        pin_blue: "art/pin_blue.png",
        pin_red: "art/pin_red.png",
        pin_green: "art/pin_green.png",
        pin_yellow: "art/pin_yellow.png"
    };
    this.LoadImages(sources, null);
    this.LoadLanguage(function()
    {
        var startMessage = new MessageDialog(m_ui, m_locale.start, 500, 250);
        startMessage.RegisterCallback(function(){
            m_ui.setAlpha(0.0);
            that.OnLoaded();
        });
    });
    m_context = ogCreateContextFromCanvas("canvas", true);
    m_globe = ogCreateGlobe(m_context);
    // Add OWG Data
    ogAddImageLayer(m_globe, {
        url: ["http://www.openwebglobe.org/data/img"],
        layer: "World500",
        service: "i3d"
    });
    ogAddImageLayer(m_globe, {
        url: ["http://10.42.2.37"],
        layer: "swissimage",
        service: "owg"
    });

    ogAddElevationLayer(m_globe, {
        url: ["http://10.42.2.37"],
        layer: "DHM25",
        service: "owg"
    });
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
//-----------------------------------------------------------------------------
/**
 * @description initialize game
 * @param {function()} renderCallback
 * @param {string} canvasDiv
 */
/*
function InitGlobeGame(renderCallback, canvasDiv)
{
    m_globeGame = new GlobeGame();
    m_globeGame.Init(renderCallback, canvasDiv);
}
*/

goog.exportSymbol('GlobeGame', GlobeGame);
goog.exportProperty(GlobeGame.prototype, 'OnLoaded', GlobeGame.prototype.OnLoaded);
goog.exportProperty(GlobeGame.prototype, 'CycleCallback', GlobeGame.prototype.CycleCallback);
goog.exportProperty(GlobeGame.prototype, 'InitQuiz', GlobeGame.prototype.InitQuiz);
goog.exportProperty(GlobeGame.prototype, 'NextChallenge', GlobeGame.prototype.NextChallenge);
goog.exportProperty(GlobeGame.prototype, 'RegisterCycleCallback', GlobeGame.prototype.RegisterCycleCallback);
goog.exportProperty(GlobeGame.prototype, 'UnregisterCycleCallback', GlobeGame.prototype.UnregisterCycleCallback);
goog.exportProperty(GlobeGame.prototype, 'LoadImages', GlobeGame.prototype.LoadImages);
goog.exportProperty(GlobeGame.prototype, 'LoadLanguage', GlobeGame.prototype.LoadLanguage);
goog.exportProperty(GlobeGame.prototype, 'Init', GlobeGame.prototype.Init);
goog.exportProperty(GlobeGame.prototype, 'OnOGResize', GlobeGame.prototype.OnOGResize);
goog.exportProperty(GlobeGame.prototype, 'OnOGRender', GlobeGame.prototype.OnOGRender);
goog.exportProperty(GlobeGame.prototype, 'OnCanvasRender', GlobeGame.prototype.OnCanvasRender);
//goog.exportSymbol('InitGlobeGame', InitGlobeGame);
