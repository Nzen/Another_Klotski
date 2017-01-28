
/*
&copy; Nicholas Prado ; released under terms of ../LICENSE
Graphics client that draws a Klotski game
*/

// page utilities

window.addEventListener( "load", pageReady, false );

var termin = function() {};
termin.log = function( message )
{
	try
	{ console.log( message ); }
	catch ( exception )
	{ return; } // IE reputedly has no console.
}


function canvasSupported() // doesn't catch all mobile exceptions
{
	return ! window.CanvasRenderingContext2D;
}


function socketSupported()
{
	return "WebSocket" in window;
}


function pageReady()
{
	if ( ! ( canvasSupported() || socketSupported() ) )
	{
		termin.log( "prerequisites unsupported, sorree" );
		return;
	}
	else
		klotski();
}


function klotski()
{
	termin.log( "Change to real" ); // FIX
}

// drawing

function drawTesting( letter )
{
	var dom_canvas = document.getElementById( "canvas_here" );
	var canv = dom_canvas.getContext( "2d" );
	canv.fillStyle = "gray";
	canv.font = "bold 13px monospace";
	canv.fillText( letter, 15, 15 );
}


// input

	function letter_pressed( ev ) // FIX
	{
		var keyPressed = String.fromCharCode( ev.keyCode );
		drawTesting( keyPressed ); // 4TESTS
		switch( keyPressed )
		{
		// cursor & shape
		case 'A':
			termin.log( "bound.try_block( ky.L ");
			break;
		case 'W':
			termin.log( "bound.try_block( ky.U ");
			break;
		case 'D':
			termin.log( "bound.try_block( ky.R ");
			break;
		case 'S':
			termin.log( "bound.try_block( ky.D ");
			break;
		// cursor only
		case 'a':
			termin.log( "bound.try_cursor( ky.l ");
			break;
		case 'w':
			termin.log( "bound.try_cursor( ky.u ");
			break;
		case 'd':
			termin.log( "bound.try_cursor( ky.r ");
			break;
		case 's':
			termin.log( "bound.try_cursor( ky.d ");
			break;
		case '~':
			termin.log( "save_game("); // make it work, then make it good.
			break;
		case '%':
			 termin.log( "restore_game(");
			break;
		default:
			return;
		}
	}


// networking


	function changeName()
	{
		var channel = new WebSocket( "ws://localhost:9998" );

		channel.onopen = function coo()
		{
			channel.send( JSON.stringify(getInput()) );
		};
		channel.onclose = function coc()
		{
			termin.log( "glad that's over" );
		};
		channel.onmessage = function com( msg )
		{
			applyResponse( msg.data );
			channel.close();
		};
	}
/*
 requests
move cursor
drag shape
save
restore
restart
have I won?
undo
hint

 replies
board (as rows,2d array, string ?)
cursor location
(bad move line ?)
move count
error
(hint lines)
*/


// game state and loop

	var background = "#0A0A29";

window.addEventListener( "keypress", letter_pressed, true ); // won't work with IE < 9, but neither will canvas




























