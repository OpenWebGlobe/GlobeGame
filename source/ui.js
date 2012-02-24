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
/* GUI Elements */
//-----------------------------------------------------------------------------
/** @constructor */
function Button01(layer, x, y, width, height, caption, fontsize)
{
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.state = 0;
    this.caption = caption;
    this.fontsize = fontsize;

    this.onClickEvent = function() {};
    var that = this;

    this.shape = new Kinetic.Shape(function(){
        var ctx = this.getContext();
        var clickOffset = 0;
        if(that.state == 0)
        {
            ctx.drawImage(m_images.btn_01, x, y, width, height);
        }
        else if(that.state == 1)
        {
            ctx.drawImage(m_images.btn_01_h, x, y, width, height);
        }
        else if(that.state == 2)
        {
            ctx.drawImage(m_images.btn_01_c, x, y, width, height);
            clickOffset = 2;
        }
        ctx.beginPath();
        ctx.rect(x, y, width, height);
        ctx.closePath();
        ctx.font = fontsize+"pt TitanOne";
        ctx.fillStyle = "#FFF";
        var textWidth = ctx.measureText(that.caption).width;
        var textHeight = ctx.measureText(that.caption).height;
        var tX = x+clickOffset;
        var tY = y+ 3*(height/5)+clickOffset;
        if(textWidth <= width)
        {
            tX = x + ((width-textWidth)/2);
        }
        ctx.fillText(that.caption, tX, tY);
        ctx.lineWidth = 1;
        ctx.strokeStyle = "#000"; // stroke color
        ctx.strokeText(that.caption, tX, tY);
    });

    this.shape.on("mouseout", function(){
        that.state = 0;
    });
    this.shape.on("mouseover", function(){
        that.state = 1;
    });
    this.shape.on("mousedown", function(){
        that.state = 2;

    });
    this.shape.on("mouseup", function(){
        that.state = 1;
        that.onClickEvent();
    });
    layer.add(this.shape);
}

//-----------------------------------------------------------------------------
/** @constructor */
function Clock(layer, x, y, seconds)
{
    this.layer = layer;
    this.x = x;
    this.y = y;
    this.seconds = seconds;
    var unit = 2.0/60;
    var that = this;
    this.onTimeoutEvent = function() {};

    this.shape = new Kinetic.Shape(function(){
        var ctx = this.getContext();
        var pos = unit*that.seconds-0.5;
        ctx.drawImage(m_images.clock, x, y, 220, 260);
        ctx.beginPath();
        ctx.arc(x+110, y+153, 84, pos*Math.PI, 1.5*Math.PI, false);
        ctx.lineTo(x+110, y+153);
        ctx.closePath();
        var pattern = ctx.createPattern(m_images.dial, "no-repeat");
        ctx.fillStyle = pattern;
        ctx.translate(75, 115);
        ctx.fill();
        if(that.seconds > 10) {ctx.fillStyle = "#FFF";} else {ctx.fillStyle = "#F00";}
        ctx.font = "40pt TitanOne";
        ctx.textAlign = "center";
        var secs = "" +that.seconds;
        ctx.fillText(secs, x+37, y+53);
        ctx.lineWidth = 3;
        ctx.strokeStyle = "#000"; // stroke color
        ctx.strokeText(secs, x+37, y+53);
    });
    layer.add(this.shape);
}

Clock.prototype.countdown = function()
{
    var that = this;
    setTimeout(function(){
        if(that.seconds > 0)
        {that.countdown();}
        else
        { that.onTimeoutEvent(); }
    }, 1000);
    this.seconds = this.seconds -1;
};

Clock.prototype.reset = function(seconds)
{
    this.seconds = seconds;
}

//-----------------------------------------------------------------------------
/** @constructor */
function MessageDialog(layer, message, width, height)
{
    this.message = message;
    this.layer = layer;
    var that = this;

    this.shape = new Kinetic.Shape(function(){
        var ctx = this.getContext();
        ctx.beginPath();
        ctx.rect((window.innerWidth/2)-(width/2), (window.innerHeight/2)-(height/2), width, height);
        var grad = ctx.createLinearGradient(window.innerWidth/2, (window.innerHeight/2)-(height/2), window.innerWidth/2, (window.innerHeight/2)+(height/2));
        grad.addColorStop(0, "#555"); // light blue
        grad.addColorStop(1, "#CCC"); // dark blue
        ctx.fillStyle = grad;
        ctx.fill();
        ctx.lineWidth = 3;
        ctx.strokeStyle = "#FFF";
        ctx.stroke();
        ctx.textAlign = "center";
        ctx.fillStyle = "#FFF";
        ctx.font = "18pt TitanOne";
        ctx.textAlign = "center";
        var secs = "" +that.seconds;
        ctx.fillText(that.message, window.innerWidth/2, window.innerHeight/2-(height/2)+80);
        ctx.lineWidth = 2;
        ctx.strokeStyle = "#000"; // stroke color
        ctx.strokeText(that.message, window.innerWidth/2, window.innerHeight/2-(height/2)+80);

    });


    function OnOkay()
    {
        that.layer.remove(that.shape);
        that.layer.remove(okayButton.shape);
    }
    layer.add(this.shape);
    okayButton = new Button01(m_ui, window.innerWidth/2-150, window.innerHeight/2+(height/2)-100, 300, 69, "OK", 15);
    okayButton.onClickEvent = OnOkay;
}