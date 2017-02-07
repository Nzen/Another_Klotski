
/* copyright Nicholas Prado
released under terms of ../../../../../../LICENSE (x11 style) */

package ws.nzen.klotski;

import ws.nzen.klotski.Direction;

/** Common values with webpage to represent pieces of blocks on the board */
public enum BlockCorner
{
	/*
	function Cflag()
	{
		this.o_ = 0;
		this.s_ = 1
		this.tt = 12; this.tb = 13;
		this.wl = 24; this.wr = 25;
		this.nw = 36; this.ne = 37; this.sw = 38; this.se = 39;
	}
	Values chosen to group shape by 10 and have a distinct lowest digit
	*/
	empty( 0, false, new boolean[]{ false, false, false, false } ),
	single( 1, false, new boolean[]{ false, false, false, false } ),
	tallTop( 12, false, new boolean[]{ false, false, true, false } ),
	tallBottom( 13, false, new boolean[]{ true, false, false, false } ),
	wideLeft( 24, false, new boolean[]{ false, false, false, true } ),
	wideRight( 25, false, new boolean[]{ false, true, false, false } ),
	bigTopLeft( 36, true, new boolean[]{ false, false, true, true } ),
	bigTopRight( 37, true, new boolean[]{ false, true, true, false } ),
	bigBottomLeft( 38, true, new boolean[]{ true, false, false, true } ),
	bigBottomRight( 39, true, new boolean[]{ true, true, false, false } ),
	border( -1, false, new boolean[]{ false, false, false, false } );


	private int notOrdinal; // since it is shared across the lang boundary
	private boolean square;
	private boolean[] relatedNeighbors; // NOTE order is wasd


	BlockCorner( int jsEnumVal, boolean twoSided, boolean[] wasdAdjacency )
	{
		notOrdinal = jsEnumVal;
		square = twoSided;
		relatedNeighbors = wasdAdjacency;
	}


	public int getJsVal()
	{
		return notOrdinal;
	}


	/*
	likely provisional until I decide who determines piece adjacency
	*/
	public boolean oneBlockWideIn( Direction movement )
	{
		int indOf = indFrom( movement );
		if ( indOf < 0 )
		{
			return true;
		}
		else
		{
			return ! relatedNeighbors[ indOf ];
		}
	}


	private int indFrom( Direction movement )
	{
		switch ( movement )
		{
			case above :
			{
				return 0;
			}
			case left :
			{
				return 1;
			}
			case below :
			{
				return 2;
			}
			case right :
			{
				return 3;
			}
			default :
			{
				return -1;
			}
		}
	}


	// hopefully I don;t need this
	public boolean isSquarePiece()
	{
		return square;
	}


	public BlockCorner fromJsVal( String persisted ) // int? is this for persisted or json? one each?
	{
		return null; // FIX
	}

}

















