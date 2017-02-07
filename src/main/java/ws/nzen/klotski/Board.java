
/* copyright Nicholas Prado
released under terms of ../../../../../../LICENSE (x11 style) */

package ws.nzen.klotski;

import ws.nzen.webIo.KlotBoardReply;

public class Board
{

	private BlockCorner[][] layout;
	private int cursorXx = 3;
	private int cursorYy = 3;
	private int moves = 0;

	public Board()
	{
		layout = initialConfiguration();
	} // IMPROVE add a restoration constructor


	/** swaps two adjacent cells within the board;
	 * caller responsible for related cell integrity */
	boolean swap( int xx, int yy, Direction headed )
	{
		final boolean worked = true;
		// initial is out of bounds
		if ( withinBounds( xx, yy ) )
		{
			return ! worked;
		}
		boolean isX = true;
		int targXx = coordinateFrom( headed, xx, isX );
		int targYy = coordinateFrom( headed, yy, ! isX );
		// target is out of bounds
		if ( withinBounds( targXx, targYy ) )
		{
			return ! worked;
		}
		else
		{
			BlockCorner hook = layout[ xx ][ yy ];
			layout[ xx ][ yy ] = layout[ targXx ][ targYy ];
			layout[ targXx ][ targYy ] = hook;
			return worked;
		}
	}


	private BlockCorner[][] initialConfiguration()
	{
		return new BlockCorner[][]
			{
				new BlockCorner[]
					{
						BlockCorner.tallTop,
						BlockCorner.tallBottom,
						BlockCorner.tallTop,
						BlockCorner.tallBottom,
						BlockCorner.single
					},
				new BlockCorner[]
					{
						BlockCorner.bigTopLeft,
						BlockCorner.bigBottomLeft,
						BlockCorner.wideLeft,
						BlockCorner.single,
						BlockCorner.empty
					},
				new BlockCorner[]
					{
						BlockCorner.bigTopRight,
						BlockCorner.bigBottomRight,
						BlockCorner.wideRight,
						BlockCorner.single,
						BlockCorner.empty
					},
				new BlockCorner[]
					{
						BlockCorner.tallTop,
						BlockCorner.tallBottom,
						BlockCorner.tallTop,
						BlockCorner.tallBottom,
						BlockCorner.single
					}
			};
	}


	BlockCorner cellIs( int xx, int yy )
	{
		if ( withinBounds( xx, yy ) )
		{
			return layout[ xx ][ yy ];
		}
		else
		{
			return BlockCorner.border;
		}
	}


	//public boolean haveWon()


	public KlotBoardReply prepForWire()
	{
		KlotBoardReply format = new KlotBoardReply();
		format.setMoves( moves );
		format.setCursorCoordinates( cursorXx, cursorYy );
		format.setRestoreError( false );
		format.setHaveWon( false );
		int[][] asJs = new int[ layout.length ][ layout[ 0 ].length ];
		for ( int yyInd = 0; yyInd < layout.length; yyInd++ )
		{
			for ( int xxInd = 0; xxInd < layout[ 0 ].length; xxInd++ )
			{
				asJs[ yyInd ][ xxInd ] = layout[ yyInd ][ xxInd ].getJsVal();
			}
		}
		format.setTiles( asJs );
		return format;
	}


	int coordinateFrom( Direction pointing, int coordinate, boolean isX )
	{
		switch ( pointing )
		{
			case above :
			{
				if ( isX )
				{
					return coordinate;
				}
				else
				{
					return coordinate -1;
				}
			}
			case left :
			{
				if ( isX )
				{
					return coordinate -1;
				}
				else
				{
					return coordinate;
				}
			}
			case below :
			{
				if ( isX )
				{
					return coordinate;
				}
				else
				{
					return coordinate +1;
				}
			}
			case right :
			{
				if ( isX )
				{
					return coordinate +1;
				}
				else
				{
					return coordinate;
				}
			}
			default :
			{
				return coordinate;
			}
		}
	}


	private boolean withinBounds( int xx, int yy )
	{
		return xx < 0 || xx >= layout.length
				|| yy < 0 || yy > layout[ 0 ].length;
	}

}



















