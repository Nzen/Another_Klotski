
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


	public boolean applyInput( String moveInput )
	{
		if ( moveInput == null || moveInput.isEmpty() )
		{
			return false;
		}
		char moveFlag = moveInput.charAt( 0 );
		Direction heading = Direction.fromLetter( moveInput );
		if ( Character.isUpperCase( moveFlag ) )
		{
			return movePiece( heading );
		}
		else
		{
			return moveCursor( heading );
		}
	}


	private boolean moveCursor( Direction heading )
	{
		boolean forHoriz = true;
		int targXx = coordinateFrom( heading, cursorXx, forHoriz );
		int targYy = coordinateFrom( heading, cursorYy, ! forHoriz );
		boolean validness = cellIs( targXx, targYy ) != BlockCorner.border;
		if ( validness )
		{
			cursorXx = targXx;
			cursorYy = targYy;
		}
		return validness;
	}


	private boolean movePiece( Direction heading )
	{
		boolean forHoriz = true;
		int targXx = coordinateFrom( heading, cursorXx, forHoriz );
		int targYy = coordinateFrom( heading, cursorYy, ! forHoriz );
		BlockCorner currentFocus = cellIs( cursorXx, cursorYy );
		BlockCorner targetType = cellIs( targXx, targYy );
		if ( targetType != BlockCorner.empty )
		{
			return false;
		}
		Move pieceAwareness = Move.factoryOrWhatever( heading,
				cursorXx, cursorYy, currentFocus );
		if ( pieceAwareness == null )
		{
			return false;
		}
		boolean worked = pieceAwareness.applyTo( this );
		if ( worked )
		{
			worked &= moveCursor( heading );
			moves++; // IMPROVE legacy decrements if it was the reverse of previous direction
		}
		return worked;
	}


	/** swaps two adjacent cells within the board;
	 * caller responsible for related cell integrity */
	boolean swap( int xx, int yy, Direction headed )
	{
		final boolean worked = true;
		// initial is out of bounds
		if ( ! withinBounds( xx, yy ) )
		{
			return ! worked;
		}
		boolean isX = true;
		int targXx = coordinateFrom( headed, xx, isX );
		int targYy = coordinateFrom( headed, yy, ! isX );
		// target is out of bounds
		if ( ! withinBounds( targXx, targYy ) )
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
		return xx >= 0 || xx < layout.length
				|| yy >= 0 || yy < layout[ 0 ].length;
	}

}



















