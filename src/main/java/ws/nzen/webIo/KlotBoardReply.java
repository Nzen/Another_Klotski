package ws.nzen.webIo;

public class KlotBoardReply
{
	private int moves;
	private Map<String, Integer> cursor;
	private boolean restoreError;
	private boolean haveWon;
	private int[][] tiles;

	public int getMoves() {
		return moves;
	}

	public void setMoves( int moves ) {
		this.moves = moves;
	}

	public Map<String, Integer> getCursor() {
		return cursor;
	}

	public void setCursor( Map<String, Integer> cursor ) {
		this.cursor = cursor;
	}

	public boolean isRestoreError() {
		return restoreError;
	}

	public void setRestoreError( boolean restoreError ) {
		this.restoreError = restoreError;
	}

	public boolean isHaveWon() {
		return haveWon;
	}

	public void setHaveWon( boolean haveWon ) {
		this.haveWon = haveWon;
	}

	public int[][] getTiles() {
		return tiles;
	}

	public void setTiles( int[][] tiles ) {
		this.tiles = tiles;
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