
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
		return; // IE reputedly has no console.
	}
}


// drawing is in klotCanvas.js


// input

function letterPressed( ev )
{
	function isMovementInput( letter )
	{
		return "wasdWASD".indexOf( letter ) >= 0;
	}

	function isUtilityInput( letter )
	{
		return "~%".indexOf( letter ) >= 0;
	}

	function isInterestingInput( letter )
	{
		return isMovementInput( letter ) || isUtilityInput( letter );
	}

	var keyPressed = ev.key; // IMPROVE handle arrow keys too, eventually
	if ( isInterestingInput( keyPressed ) )
	{
		channel.send( JSON.stringify( { 'requestType' : 'key',
			'buttonVal': '', 'moveVal': keyPressed } ) );
	}
	else
	{
		termin.log( "not interested in "+ keyPressed );
	}
}


function clickedSaveStateBtn( which )
{
	channel.send( JSON.stringify( { 'requestType' : 'button',
			'buttonVal': which, 'moveVal': '' } ) );
}


// networking
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
	return window.CanvasRenderingContext2D;
}


function socketSupported()
{
	return "WebSocket" in window;
}


var channel;

function prepSocket()
{
	channel = new WebSocket( "ws://localhost:9998" );
	channel.onopen = function coo()
	{
		termin.log( 'server says it\'s listening, but for how long?' );
	};
	channel.onclose = function coc()
	{
		termin.log( 'glad that\'s over' );
	};
	channel.onmessage = function com( msg )
	{
		termin.log( msg );
		var response = JSON.parse( msg.data );
		if ( response.replyType == 'board' )
		{
			drawBoard( response.boardState );
		}
		else
		{
			termin.log( response ); // FIX to the canvas, if appropriate
		}
	};
}



function pageReady()
{
	if ( ! ( canvasSupported() && socketSupported() ) )
	{
		termin.log( "prerequisites unsupported, sorree"
				+"\ncanv "+ canvasSupported() +" * sock "+ socketSupported() );
		return;
	}
	else
	{
		window.addEventListener( "keypress", letterPressed, true );
		 	// NOTE won't work with IE < 9, but neither will canvas
		prepSocket();
	}
}


window.addEventListener( "load", pageReady, false );





























