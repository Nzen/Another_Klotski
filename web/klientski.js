
/*
&copy; Nicholas Prado ; released under terms of ../LICENSE
Graphics client that draws a Klotski game
*/


const termin = function() {};
termin.log = function( message )
{
	try
	{
		console.log( message );
	}
	catch ( exception )
	{
		return;
	} // IE reputedly has no console.
}


// drawing


	const background = "#0A0A29";

function drawTesting( letter )
{
	const dom_canvas = document.getElementById( "canvas_here" );
	const canv = dom_canvas.getContext( "2d" );
	canv.fillStyle = "gray";
	canv.font = "bold 25px monospace";
	canv.fillText( letter, 30, 30 );
}


// input

function KlInput()
{}

KlInput.prototype =
{

	isInterestingInput : function( letter )
	{
		return isMovementInput( letter ) || isUtilityInput( letter );
	},


	isMovementInput : function ( letter )
	{
		return "wasdWASD".indexOf( letter ) >= 0;
	},


	isUtilityInput : function( letter )
	{
		return "~%".indexOf( letter ) >= 0;
	},


	letterPressed : function ( ev ) // FIX
	{
		var keyPressed = String.fromCharCode( ev.keyCode );
		if ( interestingInput( keyPressed ) )
		{
			drawTesting( keyPressed ); // 4TESTS
		}
		else
		{
			termin.log( "not interested in "+ keyPressed );
		}
	}
};


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


// page utilities

function canvasSupported() // doesn't catch all mobile exceptions
{
	return ! window.CanvasRenderingContext2D;
}


function socketSupported()
{
	return "WebSocket" in window;
}


// var channel;


function pageReady()
{
	if ( ! ( canvasSupported() || socketSupported() ) )
	{
		termin.log( "prerequisites unsupported, sorree" );
		return;
	}
	else
	{
		var listensForKlotski = KlInput();
		termin.log( listensForKlotski.isInterestingInput( 'f' ) );
		window.addEventListener( "keypress", listensForKlotski.letterPressed, true );
		 	// NOTE won't work with IE < 9, but neither will canvas
		// channel = new WebSocket( "ws://localhost:9998" );
	}
}


window.addEventListener( "load", pageReady, false );





























