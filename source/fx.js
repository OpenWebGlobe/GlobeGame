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
var m_ftinternal = 0;
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
    var rY = m_ftinternal*45;
    m_ftinternal +=1;
    if(m_ftinternal > 3)
    {
        m_ftinternal = 0;
    }

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
        that.scalefactor = that.scalefactor + 0.05;
        this.setAlpha(that.alpha);
        that.alpha = that.alpha -0.05;

        if(that.alpha <= 0.0)
        {
            that.layer.remove(that.shape);
        }
    }});
    layer.add(this.shape);

}
goog.exportSymbol('FlyingText', FlyingText);
//-----------------------------------------------------------------------------
/**
 * @description screen fade out return with callback
 * @param {function()} callback
 */
function FadeOut(callback)
{
    setTimeout(function(){
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
    setTimeout(function(){
        m_ui.setAlpha(m_ui.getAlpha()+0.1);
        if(m_ui.getAlpha() < 1.0)
        { FadeIn(callback);} else { m_ui.setAlpha(1.0); callback();}
    }, 1);
}
goog.exportSymbol('FadeIn', FadeIn);