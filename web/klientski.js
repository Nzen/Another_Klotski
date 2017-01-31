
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


// drawing is in nzKlotski.js


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


	var keyPressed = ev.key;//String.fromCharCode( ev.key );
	if ( isInterestingInput( keyPressed ) )
	{
		drawTesting( keyPressed ); // 4TESTS
		const small = true;
		if ( isUtilityInput( keyPressed ) )
		{
			var p = new Cflag();
			drawBoard( { "moves": 2,
				"cursor": { "xC": 1, "yC": 0 },
				"restoreError": false,
				"haveWon": false,
				"tiles": new Array( 	// transpose permits tiles[x][y]
					[p.tt, p.tb, p.tt, p.tb, p.s_],
					[p.nw, p.sw, p.wl, p.s_, p.o_],
					[p.ne, p.se, p.wr, p.s_, p.o_],
					[p.tt, p.tb, p.tt, p.tb, p.s_]
				)
			} );
		}
		else
		{
			channel.send( JSON.stringify( { 'requestType' : 'echo',
				'buttonVal': '', 'moveVal': keyPressed } ) );
		}
	}
	else
	{
		termin.log( "not interested in "+ keyPressed );
	}
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
		termin.log( response );
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





























