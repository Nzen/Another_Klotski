
/* copyright Nicholas Prado
released under terms of ../../../../../../LICENSE (x11 style) */

package ws.nzen.webIo;

import java.net.InetSocketAddress;
import java.net.UnknownHostException;

import org.java_websocket.WebSocket;
import org.java_websocket.handshake.ClientHandshake;
import org.java_websocket.server.WebSocketServer;

import com.google.gson.Gson;

/**
 * @author nzen
 * Listens for interpreted user input and provides updated board
 */
public class RunsKlotski extends WebSocketServer
{
	private Gson jsParser = new Gson();

	public static void main( String[] args ) throws UnknownHostException
	{
		int suggestedPort = 9998;
		if ( args.length > 0 )
		{
			try
			{
				int userPort = Integer.valueOf( args[ 0 ] );
				if ( userPort > 1024 && userPort < 49151 )
				{
					suggestedPort = userPort;
				}
			}
			catch ( NumberFormatException nfe )
			{
				System.out.println( "startup err "+ args[ 0 ]
						+" is not a valid number for a port" );
			}
		}
		RunsKlotski gameBox = new RunsKlotski( suggestedPort );
		gameBox.start();
	}


	public RunsKlotski( int suggestedPort ) throws UnknownHostException
	{
		super( new InetSocketAddress( suggestedPort ) );
		System.out.println( "server awaits a partner" );
	}


	@Override
	public void onOpen( WebSocket conn, ClientHandshake handshake )
	{
		System.out.println( "began with "+ conn.getLocalSocketAddress() );
	}


	@Override
	public void onMessage( WebSocket conn, String message )
	{
		System.out.println( "received "+ message +" "+ conn.getLocalSocketAddress() );
		conn.send( genMessageReply( message ) );
	}


	@Override
	public void onClose( WebSocket conn, int code, String reason, boolean remote )
	{
		System.out.println( "finished with "+ conn.getLocalSocketAddress() );
	}


	@Override
	public void onError( WebSocket conn, Exception ex )
	{
		System.err.println( "failed with "+ conn.getLocalSocketAddress() +"\n"+ ex );
	}


	private String genMessageReply( String json )
	{
		KlientskiRequest msgInAmber = jsParser.fromJson( json, KlientskiRequest.class );
		String reply = "";
		switch ( msgInAmber.getRequestType() )
		{
			case "button" :
			{
				break;
			}
			case "key" :
			{
				break;
			}
			case "echo" :
			default :
			{
				break;
			}
		}
		if ( msgInAmber.getRequestType().equals( "echo" ) )
		{
			reply = echoJsonMsg( json );
		}
		if ( msgInAmber.getRequestType().equals( "echo" ) )
		{
			reply = echoJsonMsg( json );
		}
		return reply;
	}


	private String echoJsonMsg( String json )
	{
		return json;
	}


	/*
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
*/

}
