
/* copyright Nicholas Prado
released under terms of ../../../../../../LICENSE (x11 style) */

package ws.nzen.klotski;

/** Common values with webpage to represent pieces of blocks on the board */
public enum Direction
{
	above( false ),
	below( false ),
	left( true ),
	right( true ),
	inapplicable( false );

	private boolean isHorizontal;

	private Direction( boolean sideToSide )
	{
		isHorizontal = sideToSide;
	}

	public static Direction fromLetter( String letter )
	{
		switch ( letter.toLowerCase() )
		{
		case "w" :
		{
			return above;
		}
		case "a" :
		{
			return left;
		}
		case "s" :
		{
			return below;
		}
		case "d" :
		{
			return right;
		}
		default :
		{
			return inapplicable;
		}
		}
	}


	public static Direction reverse( Direction initial )
	{
		switch ( initial )
		{
		case below :
		{
			return above;
		}
		case left :
		{
			return right;
		}
		case above :
		{
			return below;
		}
		case right :
		{
			return left;
		}
		default :
		{
			return inapplicable;
		}
		}
	}


	public boolean isHorizontal()
	{
		return isHorizontal;
	}

}

















