
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


	private class Move
	{
		boolean endsGame()
		{
			return false;
		}


		boolean valid()
		{
			return true;
		}
	}

}



















