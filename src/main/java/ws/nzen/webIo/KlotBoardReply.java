
/* copyright Nicholas Prado
released under terms of ../../../../../../LICENSE (x11 style) */

package ws.nzen.webIo;

public class KlotBoardReply
{
	private String replyType = "board";
	private int moves = 0;
	private CursorCoordinates cursor = new CursorCoordinates();
	private boolean restoreError = false;
	private boolean haveWon = false;
	private int[][] tiles;


	public String getReplyType()
	{
		return replyType;
	}


	public int getMoves()
	{
		return moves;
	}

	public void setMoves( int moves )
	{
		this.moves = moves;
	}


	// caller handles validity
	public void setCursorCoordinates( int xx, int yy )
	{
		cursor.xC = xx;
		cursor.yC = yy;
	}

	public CursorCoordinates getCursor() {
		return cursor;
	}

	public void setCursor( CursorCoordinates cursor )
	{
		this.cursor = cursor;
	}


	public boolean isRestoreError() {
		return restoreError;
	}

	public void setRestoreError( boolean restoreError )
	{
		this.restoreError = restoreError;
	}


	public boolean isHaveWon() {
		return haveWon;
	}

	public void setHaveWon( boolean haveWon )
	{
		this.haveWon = haveWon;
	}


	public int[][] getTiles() {
		return tiles;
	}

	public void setTiles( int[][] tiles )
	{
		this.tiles = tiles;
	}


	public static class CursorCoordinates
	{
		int xC;
		int yC;
	}

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
