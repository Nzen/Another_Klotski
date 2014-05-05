
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
		canvasApp();
}

function canvasApp()
{
	var dom_canvas = document.getElementById( "canvas_here" );
	var canv = dom_canvas.getContext( "2d" );
	redraw();

	function stub()
	{
		canv.fillStyle = "#FF0330";
		canv.font = "32px _sans";
		canv.fillText( "not implemented", 20, 150 );
		termin.log( "that feature isn't implemented :P" );
	}

	function dr_edge()
	{
		canv.rect( 25, 25, 200, 300 ); // x y
		canv.lineWidth="2";
		canv.strokeStyle="grey";
		canv.stroke();
	}

	function redraw()
	{
		stub();
		dr_edge();
		return;
	}
}

















