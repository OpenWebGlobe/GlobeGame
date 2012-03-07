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
goog.provide('owg.gg.LandmarkChallenge');

goog.require('owg.gg.Challenge');
goog.require('owg.gg.Button01');
goog.require('owg.gg.FlyingText');
goog.require('owg.gg.ScreenText');
goog.require('owg.gg.Clock');

//-----------------------------------------------------------------------------
/**
 * @class LandmarkChallenge
 * @constructor
 *
 * @description 4 option challenge with various camera movements
 *
 * @author Robert Wüest robert.wst@gmail.ch
 *
 * @param {number} baseScore
 * @param {Array.<string>} options
 * @param {number} correctOption
 * @param {Array.<Object>} views
 * @param {string} title
 *
 */
function LandmarkChallenge(baseScore, options, correctOption, views, title)
{
    this.correctOption = correctOption;
    this.options = options;
    this.baseScore = baseScore;
    this.views = views;
    this.flystate = 1;
    this.text = title;
    this.stop = false;
    this.clock = null;
    this.buttonArray = [];
    this.screenText = null;

    var that = this;

    /* Inline functions*/
    this.onOption1 = function(){
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
        if(that.stop != true && that.flystate-1 < that.views.length)
        {
            var oView = that.views[that.flystate];
            var scene = ogGetScene(m_context);
            that.flystate +=1;
            ogFlyTo(scene,oView["longitude"],oView["latitude"], oView["elevation"],oView["yaw"],oView["pitch"],oView["roll"]);
        }
    };
}
LandmarkChallenge.prototype = new Challenge(0);
LandmarkChallenge.prototype.constructor=LandmarkChallenge;
//-----------------------------------------------------------------------------
/**
 * @description activate challenge
 */
LandmarkChallenge.prototype.Activate = function()
{
    var btn1 = null;
    var btn2 = null;
    var btn3 = null;
    var btn4 = null;
    btn1 = new Button01(m_ui, "btn1", m_centerX-310, window.innerHeight-239, 300, 69, this.options[0], 15);
    btn1.onClickEvent = this.onOption1;
    btn2 = new Button01(m_ui, "btn2", m_centerX+10, window.innerHeight-239, 300, 69, this.options[1], 15);
    btn2.onClickEvent = this.onOption2;
    btn3 = new Button01(m_ui, "btn3", m_centerX-310, window.innerHeight-150, 300, 69, this.options[2], 15);
    btn3.onClickEvent = this.onOption3;
    btn4 = new Button01(m_ui, "btn4", m_centerX+10, window.innerHeight-150, 300, 69, this.options[3], 15);
    btn4.onClickEvent = this.onOption4;
    this.buttonArray.push(btn1);
    this.buttonArray.push(btn2);
    this.buttonArray.push(btn3);
    this.buttonArray.push(btn4);
    this.screenText = new ScreenText(m_ui, this.text,m_centerX, window.innerHeight-255, 20, "center");
    this.clock = new Clock(m_ui, 50, 75, 60);
    this.clock.Start();
    FadeIn(function() {});
    var flightduration = Math.floor(40/(this.views.length-1))*1000;
    var scene = ogGetScene(m_context);
    ogSetFlightDuration(scene,flightduration);
    var camId = ogGetActiveCamera(scene);
    ogSetPosition(camId,this.views[0].longitude,this.views[0].latitude, this.views[0].elevation);
    ogSetOrientation(camId,this.views[0]["yaw"],this.views[0]["pitch"], this.views[0]["roll"]);
    ogSetInPositionFunction(m_context,this.FlightCallback);
    this.FlightCallback();
};
//-----------------------------------------------------------------------------
/**
 * @description destroy challenge
 */
LandmarkChallenge.prototype.Destroy = function()
{
    if(!this.destroyed)
    {
        this.clock.Pause();
        this.stop = true;
        var scene = ogGetScene(m_context);
        ogStopFlyTo(scene);
        this.OnDestroy();
        this.destroyed = true;
    }
};
//-----------------------------------------------------------------------------
/**
 * @description on destroy function
 */
LandmarkChallenge.prototype.OnDestroy = function()
{
    this.clock.Destroy();
    var that = this;
    if(!this.editormode)
    {
        FadeOut(function(){
            that.buttonArray[0].Destroy();
            that.buttonArray[1].Destroy();
            that.buttonArray[2].Destroy();
            that.buttonArray[3].Destroy();
            that.screenText.Destroy();
            if(m_globeGame)
                m_globeGame.NextChallenge();
        });
    }
    else
    {
        that.buttonArray[0].Destroy();
        that.buttonArray[1].Destroy();
        that.buttonArray[2].Destroy();
        that.buttonArray[3].Destroy();
        that.screenText.Destroy();
    }
};
//-----------------------------------------------------------------------------
/**
 * @description pick solution option
 * @param {number} option
 * @param {number} timeleft
 */
LandmarkChallenge.prototype.PickOption = function(option, timeleft) {
    this.buttonArray[0].SetEnabled(false);
    this.buttonArray[1].SetEnabled(false);
    this.buttonArray[2].SetEnabled(false);
    this.buttonArray[3].SetEnabled(false);
    var that = this;
    if (this.correctOption == option) {
        if(m_player)
        {
            m_player.ScorePoints(this.baseScore, "");
            m_player.ScorePoints(Math.floor(timeleft / 5), m_locale["timebonus"]);
            if (timeleft > 50) {
                m_player.ScorePoints(20, m_locale["speedbonus"]);
            }
        }
        this.buttonArray[option - 1].SetEnabled(true);
        this.buttonArray[option - 1].SetState(3);
        setTimeout(function () {
            if(!that.editormode)
                that.Destroy();
        }, 2000);
    } else {
        this.buttonArray[option - 1].SetEnabled(true);
        this.buttonArray[this.correctOption - 1].SetEnabled(true);
        this.buttonArray[option - 1].SetState(4);
        this.buttonArray[this.correctOption - 1].SetState(5);
        setTimeout(function () {
            if(!that.editormode)
                that.Destroy();
        }, 2000);
    }
};

goog.exportSymbol('LandmarkChallenge', LandmarkChallenge);
goog.exportProperty(LandmarkChallenge.prototype, 'Activate', LandmarkChallenge.prototype.Activate);
goog.exportProperty(LandmarkChallenge.prototype, 'Destroy', LandmarkChallenge.prototype.Destroy);
goog.exportProperty(LandmarkChallenge.prototype, 'OnDestroy', LandmarkChallenge.prototype.OnDestroy);
goog.exportProperty(LandmarkChallenge.prototype, 'PickOption', LandmarkChallenge.prototype.PickOption);