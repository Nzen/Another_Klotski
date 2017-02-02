
/* copyright Nicholas Prado
released uncer terms of ../../../../../../LICENSE (x11 style) */

package ws.nzen.webIo;

import java.util.Map;
import java.util.TreeMap;

public class KlotResponse
{
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
	private boolean haveWon = false;
	private boolean restoreError = false;
	private int moves = 0;
	private Map<String, Integer> cursor = new TreeMap<>();
	private int[][] tiles;


	// caller handles validity
	public void setCursorCoordinates( int xx, int yy )
	{
		cursor.put( "xC", xx );
		cursor.put( "yC", yy );
	}


}







