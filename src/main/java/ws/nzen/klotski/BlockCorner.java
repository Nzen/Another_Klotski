
/* copyright Nicholas Prado
released uncer terms of ../../../../../../LICENSE (x11 style) */

package ws.nzen.klotski;

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
	Values chosen to group shape by 10 and have distinct lowest digit
	*/
	empty( 0 ),
	single( 1 ),
	tallTop( 12 ),
	tallBottom( 13 ),
	wideLeft( 24 ),
	wideRight( 25 ),
	bigTopLeft( 36 ),
	bigTopRight( 37 ),
	bigBottomLeft( 38 ),
	bigBottomRight( 39 );


	private int notOrdinal; // since it is shared across the lang boundary


	BlockCorner( int jsEnumVal )
	{
		notOrdinal = jsEnumVal;
	}


	public int getJsVal()
	{
		return notOrdinal;
	}

}

















