
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


	private void fillOtherPieces()
	{

	}


	/** check that the way is clear, then swap relevant corners */
	public boolean applyTo( Board landscape )
	{
		final boolean isXx = true;
		BlockCorner cellPeek = landscape.cellIs( startXx, startYy );
		if ( cellPeek == BlockCorner.empty || cellPeek == BlockCorner.border )
		{
			return false;
		}
		cellPeek = landscape.cellIs(
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














