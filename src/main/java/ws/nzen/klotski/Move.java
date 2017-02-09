
/* copyright Nicholas Prado
released under terms of ../../../../../../LICENSE (x11 style) */

package ws.nzen.klotski;

public class Move
{

	private Direction headed;
	private int startXx;
	private int startYy;
	private BlockCorner startPiece;
	private BlockCorner facePiece;
	private Direction faceDirFromStart;
	private BlockCorner[] occludedPieces; // assumes start and then face piece
	// IMPROVE didn't I already put this info in BlockCorner.relatedPieces ?


	public Move( Direction going, int xx, int yy, BlockCorner corner,
				 BlockCorner alsoFacingDir, Direction relation,
				 BlockCorner[] otherPieces )
	{
		headed = going;
		startXx = xx;
		startYy = yy;
		startPiece = corner; // does caller provide or self init with fillOtherPieces()?
		facePiece = alsoFacingDir;
		faceDirFromStart = relation;
		occludedPieces = otherPieces;
	}


	public static Move factoryOrWhatever( Direction going,
			int xx, int yy, BlockCorner pieceInFocus )
	{
		switch( pieceInFocus )
		{
			case single :
			{
				return new Move( going, xx, yy, pieceInFocus,
						null, null, new BlockCorner[0] );
			}
			case tallTop :
			{
				if ( going.isHorizontal() )
				{
					return new Move( going, xx, yy, pieceInFocus,
							BlockCorner.tallBottom, Direction.below,
							new BlockCorner[0] );
				}
				else
				{
					return new Move( going, xx, yy, pieceInFocus, null, null,
							new BlockCorner[]{ BlockCorner.tallBottom } );
					// ASK legacy may have computed move even from the rear piece
				}
			}
			case tallBottom :
			{
				if ( going.isHorizontal() )
				{
					return new Move( going, xx, yy, pieceInFocus,
							BlockCorner.tallTop, Direction.above,
							new BlockCorner[0] );
				}
				else
				{
					return new Move( going, xx, yy, pieceInFocus, null, null,
							new BlockCorner[]{ BlockCorner.tallTop } );
				}
			}
			case wideLeft :
			{
				if ( going.isHorizontal() )
				{
					return new Move( going, xx, yy, pieceInFocus, null, null,
							new BlockCorner[]{ BlockCorner.wideRight } );
				}
				else
				{
					return new Move( going, xx, yy, pieceInFocus,
							BlockCorner.wideRight, Direction.right,
							new BlockCorner[0] );
				}
			}
			case wideRight :
			{
				if ( going.isHorizontal() )
				{
					return new Move( going, xx, yy, pieceInFocus, null, null,
							new BlockCorner[]{ BlockCorner.wideLeft } );
				}
				else
				{
					return new Move( going, xx, yy, pieceInFocus,
							BlockCorner.wideLeft, Direction.left,
							new BlockCorner[0] );
				}
			}
			case bigTopLeft :
			{
				if ( going.isHorizontal() )
				{
					return new Move( going, xx, yy, pieceInFocus, 
							BlockCorner.bigBottomLeft, Direction.below,
							new BlockCorner[]{ BlockCorner.bigTopRight,
									BlockCorner.bigBottomRight } ); // ASK is that going to pull it correctly ?
				}
				else
				{
					return new Move( going, xx, yy, pieceInFocus, 
							BlockCorner.bigTopRight, Direction.right,
							new BlockCorner[]{ BlockCorner.bigBottomLeft,
									BlockCorner.bigBottomRight } );
				}
			}
			case bigTopRight :
			{
				if ( going.isHorizontal() )
				{
					return new Move( going, xx, yy, pieceInFocus, 
							BlockCorner.bigBottomRight, Direction.below,
							new BlockCorner[]{ BlockCorner.bigTopLeft,
									BlockCorner.bigBottomLeft } ); // ASK is that going to pull it correctly ?
				}
				else
				{
					return new Move( going, xx, yy, pieceInFocus, 
							BlockCorner.bigTopRight, Direction.left,
							new BlockCorner[]{ BlockCorner.bigBottomLeft,
									BlockCorner.bigBottomRight } );
				}
			}
			case bigBottomLeft :
			{
				if ( going.isHorizontal() )
				{
					return new Move( going, xx, yy, pieceInFocus, 
							BlockCorner.bigTopLeft, Direction.above,
							new BlockCorner[]{ BlockCorner.bigBottomLeft,
									BlockCorner.bigBottomRight } ); // ASK is that going to pull it correctly ?
				}
				else
				{
					return new Move( going, xx, yy, pieceInFocus, 
							BlockCorner.bigBottomRight, Direction.right,
							new BlockCorner[]{ BlockCorner.bigTopLeft,
									BlockCorner.bigTopRight } );
				}
			}
			case bigBottomRight :
			{
				if ( going.isHorizontal() )
				{
					return new Move( going, xx, yy, pieceInFocus, 
							BlockCorner.bigTopRight, Direction.above,
							new BlockCorner[]{ BlockCorner.bigBottomRight,
									BlockCorner.bigBottomRight } ); // ASK is that going to pull it correctly ?
				}
				else
				{
					return new Move( going, xx, yy, pieceInFocus, 
							BlockCorner.bigBottomLeft, Direction.left,
							new BlockCorner[]{ BlockCorner.bigBottomRight,
									BlockCorner.bigTopLeft } );
				}
			}
			case empty :
			case border :
			default :
			{
				return null;
			}
		}
	}


	/** check that the way is clear, then swap relevant corners */
	public boolean applyTo( Board landscape )
	{
		final boolean isXx = true;
		if ( startPiece == BlockCorner.empty
				|| startPiece == BlockCorner.border )
		{
			return false;
		}
		BlockCorner cellPeek = landscape.cellIs(
				landscape.coordinateFrom( headed, startXx, isXx ),
				landscape.coordinateFrom( headed, startYy, ! isXx ) );
		if ( cellPeek != BlockCorner.empty )
		{
			return false;
		}
		if ( facePiece != null )
		{
			int faceXx = landscape.coordinateFrom( faceDirFromStart, startXx, isXx );
			int faceYy = landscape.coordinateFrom( faceDirFromStart, startYy, ! isXx );
			// ASK is it calc faceDir then headed or headed then faceDir?
			cellPeek = landscape.cellIs(
					landscape.coordinateFrom( headed, faceXx, isXx ),
					landscape.coordinateFrom( headed, faceYy, ! isXx ) );
			if ( cellPeek != BlockCorner.empty )
			{
				return false;
			}
			landscape.swap( faceXx, faceYy, headed );
			if ( occludedPieces.length > 1 )
			{
				landscape.swap( faceXx, faceYy, Direction.reverse( headed ) );
			}
		}
		landscape.swap( startXx, startYy, headed );
		if ( occludedPieces.length > 0 )
		{
			landscape.swap( startXx, startYy, Direction.reverse( headed ) );
		}
		return true;
	}

}














