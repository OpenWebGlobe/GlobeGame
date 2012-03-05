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
function Button01(layer, name, x, y, width, height, caption, fontsize)
{
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.state = 0;
    this.caption = caption;
    this.fontsize = fontsize;
    this.name = name;
    this.enabled = true;
    this.layer = layer;

    this.onClickEvent = function() {};
    this.onMouseOverEvent = function() {};
    this.onMouseOutEvent = function() {};
    this.onMouseDownEvent = function() {};
    this.onMouseUpEvent = function() {};
    var that = this;

    this.shape = new Kinetic.Shape(function(){
        var ctx = this.getContext();
        var clickOffset = 0;
        if(that.enabled == false)
        {
            ctx.drawImage(m_images.btn_01_d, x, y, width, height);
        }
        else if(that.state == 0)
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
        else if(that.state == 3)
        {
            ctx.drawImage(m_images.btn_01_t, x, y, width, height);
        }
        else if(that.state == 4)
        {
            ctx.drawImage(m_images.btn_01_f, x, y, width, height);
        }
        else if(that.state == 5)
        {
            ctx.drawImage(m_images.btn_01_o, x, y, width, height);
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
        that.onMouseOutEvent();
        if(that.state < 3)
        {that.state = 0;}
    });
    this.shape.on("mouseover", function(){
        that.onMouseOverEvent();
        if(that.state < 3)
        {that.state = 1;}
    });
    this.shape.on("mousedown", function(){
        that.onMouseDownEvent();
        if(that.state < 3)
        {that.state = 2;}

    });
    this.shape.on("mouseup", function(){
        that.onMouseUpEvent();
        if(that.state < 3)
        {that.state = 1;
        that.onClickEvent();
        }
    });
    this.shape.name = name;
    layer.add(this.shape);
}

Button01.prototype.setEnabled = function(enabled)
{
    this.enabled = enabled;
}

Button01.prototype.setState = function(state)
{
    this.state = state;
}

Button01.prototype.Destroy = function()
{
    this.layer.remove(this.shape);
}

//-----------------------------------------------------------------------------
/** @constructor */
function Clock(layer, x, y, seconds)
{
    this.layer = layer;
    this.x = x;
    this.y = y;
    this.seconds = seconds;
    this.visible = true;
    this.obsolete = false;
    var unit = 2.0/60;
    var that = this;
    this.running = false;
    this.onTimeoutEvent = function() {};

    this.shape = new Kinetic.Shape(function(){

        if(that.visible == true)
        {
            var ctx = this.getContext();
            var pos = unit*that.seconds-0.5;
            ctx.drawImage(m_images.clock, x, y, 220, 260);
            ctx.beginPath();
            ctx.arc(x+110, y+153, 84, pos*Math.PI, 1.5*Math.PI, false);
            ctx.lineTo(x+110, y+153);
            ctx.closePath();
            var pattern = ctx.createPattern(m_images.dial, "no-repeat");
            ctx.fillStyle = pattern;
            ctx.translate(x+25, y+65);
            ctx.fill();
            if(that.seconds > 10) {ctx.fillStyle = "#FFF";} else {ctx.fillStyle = "#F00";}
            ctx.font = "40pt TitanOne";
            ctx.textAlign = "center";
            var secs = "" +that.seconds;
            ctx.fillText(secs, 85, 110);
            ctx.lineWidth = 3;
            ctx.strokeStyle = "#000"; // stroke color
            ctx.strokeText(secs, 85, 110);
        }
    });
    layer.add(this.shape);
}

Clock.prototype.Start = function()
{
    this.running = true;
    this.Countdown();
}

Clock.prototype.Pause = function()
{
    this.running = false;
}

Clock.prototype.Resume = function()
{
    this.running = true;
}

Clock.prototype.Countdown = function()
{
    var that = this;
    setTimeout(function(){
        if(that.obsolete == true)
        {

        }
        else if(that.seconds > 0)
        {that.Countdown();}
        else
        {
            that.running = false;
            that.onTimeoutEvent(); }
    }, 1000);
    if(this.running)
    {
        this.seconds = this.seconds -1;
    }
};

Clock.prototype.Destroy = function()
{
    this.obsolete = true;
    this.OnDestroy();
}

Clock.prototype.OnDestroy = function()
{
    this.layer.remove(this.shape);
}

Clock.prototype.SetVisible = function(visible)
{
    this.visible = visible;
}


//-----------------------------------------------------------------------------
/** @constructor */
function ScreenText(layer, text, x, y, size, align)
{
    this.text = text;
    this.x = x;
    this.y = y;
    this.size = size;
    this.align = align;
    this.layer = layer;
    var that = this;

    this.shape = new Kinetic.Shape(function(){
        var ctx = this.getContext();
        ctx.textAlign = that.align;
        ctx.fillStyle = "#FFF";
        ctx.font = that.size+"pt TitanOne";
        ctx.textAlign = that.align;
        ctx.fillText(that.text, that.x, that.y);
        ctx.lineWidth = 2;
        ctx.strokeStyle = "#000"; // stroke color
        ctx.strokeText(that.text,  that.x, that.y);
    });
    layer.add(this.shape);
}

ScreenText.prototype.Destroy = function()
{
    this.layer.remove(this.shape);
}

//-----------------------------------------------------------------------------
/** @constructor */
function MessageDialog(layer, message, width, height)
{
    this.message = message;
    this.layer = layer;
    var that = this;
    this.callback = function(){};

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
        that.callback();
    }
    layer.add(this.shape);
    okayButton = new Button01(m_ui, "dialog", window.innerWidth/2-150, window.innerHeight/2+(height/2)-100, 300, 69, "OK", 15);
    okayButton.onClickEvent = OnOkay;
}

MessageDialog.prototype.RegisterCallback = function(callback)
{
    this.callback = callback;
}

//-----------------------------------------------------------------------------
/** @constructor */
function ScoreCount(layer)
{
    this.layer = layer;
    var that = this;

    this.shape = new Kinetic.Shape(function(){
        var ctx = this.getContext();
        ctx.beginPath();
        ctx.rect(10, 10, 225, 50);
        var grad = ctx.createLinearGradient(10, 10, 10, 50);
        grad.addColorStop(0, "#555");
        grad.addColorStop(1, "#CCC");
        ctx.fillStyle = grad;
        ctx.fill();
        ctx.lineWidth = 3;
        ctx.strokeStyle = "#FFF";
        ctx.stroke();
        ctx.textAlign = "center";
        ctx.fillStyle = "#FFF";
        ctx.font = "16pt TitanOne";
        ctx.textAlign = "left";
        ctx.fillText(m_locale.score+": "+m_player.playerScore, 25, 45);
        ctx.lineWidth = 2;
        ctx.strokeStyle = "#000"; // stroke color
        ctx.strokeText(m_locale.score+": "+m_player.playerScore, 25, 45);

    });
    layer.add(this.shape);
}

//-----------------------------------------------------------------------------
/** @constructor */
function Pin(layer, image, x, y)
{
    this.layer = layer;
    var that = this;
    this.x = x;
    this.y = y;
    this.visible = true;

    this.shape = new Kinetic.Shape(function(){
        if(that.visible == true)
        {
            var ctx = this.getContext();
            ctx.beginPath();
            ctx.drawImage(image, that.x-74, that.y-132, 86, 144);
        }

    });
    layer.add(this.shape);
}

Pin.prototype.SetPos = function(x,y)
{
    this.x = x;
    this.y = y;
}

Pin.prototype.SetVisible = function(visible)
{
    this.visible = visible;
}


Pin.prototype.Destroy = function()
{
    this.layer.remove(this.shape);
}
