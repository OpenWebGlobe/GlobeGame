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
function FlyingText(layer, text, fontcolor)
{
    this.text = text;
    this.fontcolor = fontcolor;
    this.scalefactor = 1.0;
    this.alpha = 1.0;
    this.layer = layer;
    var that = this;
    var rY = m_hInc*45;
    m_hInc += 1;
    if(m_hInc >= 3)
        m_hInc = 0;

    this.Step = function(step)
    {
        step += 1;
        that.alpha = that.alpha -0.01;
        that.scalefactor = that.scalefactor + 0.01;
        if(that.alpha <= 0.0)
        {
            that.layer.remove(that.shape);
        }
        else
        {
            Timeout(function(){
                that.Step(step);
            }, 5);
        }
    };

    this.shape = new Kinetic.Shape({drawFunc:function(){
        var ctx = this.getContext();
        ctx.beginPath(); // !!!
        ctx.font = "28pt LuckiestGuy";
        ctx.fillStyle = that.fontcolor;
        var tX = (window.innerWidth/2)/that.scalefactor;
        var tY = (window.innerHeight/2-200+rY)/that.scalefactor;
        ctx.textAlign = "center";
        ctx.fillText(that.text, tX, tY);
        ctx.lineWidth = 3;
        ctx.strokeStyle = "#000"; // stroke color
        ctx.strokeText(that.text, tX, tY);
        this.setScale(that.scalefactor,that.scalefactor);
        this.setAlpha(that.alpha);
    }});
    layer.add(this.shape);
    that.Step(0);
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
function Coins(layer, score)
{
    this.score = score;
    this.alpha = 1.0;
    this.layer = layer;
    var that = this;
    m_sounds["coins"].play();

    this.Step = function(step)
    {
        step += 1;
        that.alpha = that.alpha -0.02;
        if(that.alpha <= 0.0)
        {
            that.layer.remove(that.shape);
        }
        else
        {
            Timeout(function(){
                that.Step(step);
            }, 5);
        }
    };

    this.shape = new Kinetic.Shape({drawFunc:function(){
        var ctx = this.getContext();
        ctx.beginPath(); // !!!
        ctx.font = "35pt LuckiestGuy";
        ctx.fillStyle = "#FE3";
        var tX = 35;
        var tY = 70;
        ctx.textAlign = "left";
        ctx.fillText("+"+that.score, tX, tY);
        ctx.lineWidth = 3;
        ctx.strokeStyle = "#000"; // stroke color
        ctx.strokeText("+"+that.score, tX, tY);
        ctx.drawImage(m_images["coins"], 122, 10, 80, 100);
        this.setAlpha(that.alpha);
    }});
    layer.add(this.shape);
    that.Step(0);
}
goog.exportSymbol('Coins', Coins);
//-----------------------------------------------------------------------------
/**
 * @description screen fade out return with callback
 * @param {function()} callback
 */
function FadeOut(callback)
{
    Timeout(function(){
        m_ui.setAlpha(m_ui.getAlpha()-0.1);
        if(m_ui.getAlpha() > 0.0)
        { FadeOut(callback);} else { m_ui.setAlpha(0.0); callback();}
    }, 1);
}
goog.exportSymbol('FadeOut', FadeOut);
//-----------------------------------------------------------------------------
/**
 * @description screen fade in return with callback
 * @param {function()} callback
 */
function FadeIn(callback)
{
    Timeout(function(){
        m_ui.setAlpha(m_ui.getAlpha()+0.1);
        if(m_ui.getAlpha() < 1.0)
        { FadeIn(callback);} else { m_ui.setAlpha(1.0); callback();}
    }, 1);
}
goog.exportSymbol('FadeIn', FadeIn);//-----------------------------------------------------------------------------
/**
 * @description Fading Blackscreen
 * @param {number} duration
 * @param {function()} callback
 */
function BlackScreen(duration, callback)
{
    var blackScreen = new Kinetic.Rect({
        x: 0,
        y: 0,
        width: window.innerWidth,
        height: window.innerHeight,
        fill: "#000000",
        alpha: 0.0
    });
    m_static.add(blackScreen);
    blackScreen.setZIndex(-100);
    var recurIn = function(cback){
        blackScreen.setAlpha(blackScreen.getAlpha()+0.2);
        if(blackScreen.getAlpha() < 1.0)
        {
            Timeout(function(){recurIn(cback);},1);
        } else
        {
            blackScreen.setAlpha(1.0); cback();
        }
    };
    var recurOut = function(cback){
        blackScreen.setAlpha(blackScreen.getAlpha()-0.1);
        if(blackScreen.getAlpha() > 0.0)
        {
            Timeout(function(){recurOut(cback);},1);
        } else
        {
            blackScreen.setAlpha(1.0); cback();
        }
    };
    recurIn(function(){

    });
    Timeout(function(){
        recurOut(function(){
            m_static.remove(blackScreen);
            callback();
        });
    }, duration);
}
goog.exportSymbol('FadeIn', FadeIn);
//-----------------------------------------------------------------------------
/**
 * @description more accurate timeout function
 * @param {function()} callback
 * @param {number} timeout
 */
function Timeout(callback,timeout)
{
    var tt0 = new Date();
    var timeoutFunction = function(t0, t1, cback){
        if((t1.valueOf() - t0.valueOf()) >= timeout)
        {
            cback();
        }else
        {
            setTimeout(function(){timeoutFunction(t0,new Date(),cback)},0);
        }
    };
    setTimeout(function(){timeoutFunction(tt0,new Date(), callback)},0);
}
goog.exportSymbol('Timeout', Timeout);