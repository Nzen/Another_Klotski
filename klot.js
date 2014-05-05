
// Nicholas Prado
// a reimplementation of the sliding block puzzle called Klotski

/* intended evolution
draw board & pieces
draw cursor
move cursor with keys
move piece according to rules
check win condition
move count? smarter move count?
solver for hints?
win sound?
*/

window.addEventListener( "load", pageReady, false );

var termin = function() {};
termin.log = function( message )
{ try
	{ console.log( message ); }
catch ( exception )
	{ return; } // IE reputedly has no console.
}

function canvasUnsupported() // doesn't catch all mobile exceptions
{	return !window.CanvasRenderingContext2D;	}

function pageReady()
{
	if ( canvasUnsupported() )
	{
		termin.log( "canvas unsupported, sorree" );
		return;
	}
	else
		klotski();
}

function klotski()
{
	var dom_canvas = document.getElementById( "canvas_here" );
	var canv = dom_canvas.getContext( "2d" );
	//init();
	redraw();

	/* function init()
	{
		I already want to extract edge knowledge
	} */

	function stub( what, pos )
	{
		canv.fillStyle = "#FF0330";
		canv.font = "32px _sans";
		canv.fillText( what, 20, 150 + pos * 2 );
		termin.log( what + " isn't implemented :P" );
	}

	function dr_edge()
	{
		// background-color:#0A0A29;
		canv.beginPath();
		canv.rect( 25, 25, 218, 270 ); // x y
		canv.lineWidth="2";
		canv.strokeStyle="grey";
		canv.stroke();
	}

	function dr_goal_area()
	{
		stub( "goal area", 10 );
	}

	function dr_block( x_p, y_p, x_small, y_small, color )
	{
		//stub( "block drawing", 20 );
		var defaultSide = 40;
		var x_l = ( x_small ) ? defaultSide : defaultSide * 2 + 11;
		var y_l = ( y_small ) ? defaultSide : defaultSide * 2 + 11;
		canv.beginPath();
		canv.rect( x_p, y_p, x_l, y_l ); // x y
		canv.lineWidth = "3";
		canv.strokeStyle = color;
		canv.stroke();
	}

	function vis_test_blocks()
	{
		//var coord = "";
		var small = true;
		var startP = 35;
		var dist = 52;
		var currY = startP;
		for ( var row = 1; row <= 5; row++ )
		{
			var currX = startP;
			for ( var col = 1; col <= 4; col++ )
			{
				dr_block( currX, currY, small, small, "purple" );
				currX += dist
				//coord += currX + ":" + currY + " ";
			}
			currY += dist;
		}
		//termin.log( coord );
		/*
		87:35 139:35 191:35 243:35
		87:87 139:87 191:87 243:87
		87:139 139:139 191:139 243:139
		87:191 139:191 191:191 243:191
		87:243 139:243 191:243 243:243
		*/
	}

	function vis_test_bigger()
	{
		var small = true;
		dr_block( 87, 35, !small, small, "red" ); // dr_tall(  );
		dr_block( 139, 139, small, !small, "white" ); //dr_wide(  );
		dr_block( 87, 191, !small, !small, "green" ); //dr_big(  );
	}

	function redraw()
	{
		//stub( "all redrawing", 0 );
		dr_edge();
		//dr_goal_area();
		vis_test_blocks();
		vis_test_bigger();
		return;
	}

function board( width, depth )
{
this.de = depth; // in case I need to recover the bounds
this.spots = new Array( width * depth );
}
}

















