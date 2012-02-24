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

/** @constructor */
function FlyingText(layer, text, fontcolor)
{
    this.text = text;
    this.fontcolor = fontcolor;
    this.scalefactor = 1.0;
    this.alpha = 1.0;
    this.layer = layer;
    var that = this;

    this.shape = new Kinetic.Shape(function(){
        var ctx = this.getContext();
        ctx.beginPath(); // !!!
        ctx.font = "40pt LuckiestGuy";
        ctx.fillStyle = that.fontcolor;
        var tX = (window.innerWidth/2)/that.scalefactor;
        var tY = (window.innerHeight/2)/that.scalefactor;
        ctx.textAlign = "center";
        ctx.fillText(that.text, tX, tY);
        ctx.lineWidth = 3;
        ctx.strokeStyle = "#000"; // stroke color
        ctx.strokeText(that.text, tX, tY);
        this.setScale(that.scalefactor,that.scalefactor);
        that.scalefactor = that.scalefactor + 0.15;
        this.setAlpha(that.alpha);
        that.alpha = that.alpha -0.05;

        if(that.alpha <= 0.0)
        {
            that.layer.remove(that.shape);
        }
    });
    layer.add(this.shape);
}

