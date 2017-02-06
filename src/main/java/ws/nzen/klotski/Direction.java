
/* copyright Nicholas Prado
released under terms of ../../../../../../LICENSE (x11 style) */

package ws.nzen.klotski;

/** Common values with webpage to represent pieces of blocks on the board */
public enum Direction
{
	above, below, left, right, inapplicable;

	public Direction fromLetter( String letter )
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
}

















