
/*
&copy; Nicholas Prado ; released under terms of ../LICENSE
Simple keyboard mapper
*/

function letterPressed( ev )
{
	function isMovementInput( letter )
	{
		return "wasdWASD".indexOf( letter ) >= 0;
	}

	function isUtilityInput( letter )
	{
		return "~%".indexOf( letter ) >= 0;
	}

	function isInterestingInput( letter )
	{
		return isMovementInput( letter ) || isUtilityInput( letter );
	}

	function isArrowInput( buttonPress )
	{
		return [ 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowUp' ]
				.indexOf( buttonPress ) >= 0;
	}

	function arrowToLetter( arrowType, shiftHeld )
	{
		var letter;
		switch ( arrowType )
		{
		case 'ArrowDown' :
		{
			letter = 's';
		}
			break;
		case 'ArrowLeft' :
		{
			letter = 'a';
		}
			break;
		case 'ArrowRight' :
		{
			letter = 'd';
		}
			break;
		case 'ArrowUp' :
		{
			letter = 'w';
		}
			break;
		default :
			{
				letter = "";
			}
		}
		if ( shiftHeld )
		{
			letter.toUpperCase();
		}
		return letter;
	}

	const buttonPress = ev.key;
	if ( isInterestingInput( buttonPress ) )
	{
		// termin.log( "wasd "+ buttonPress );
		return buttonPress;
	}
	else if ( isArrowInput( buttonPress ) )
	{
		// termin.log( "arrow "+ buttonPress );
		return arrowToLetter( buttonPress, ev.shiftKey );
	}
	else
	{
		// termin.log( "not interested in "+ buttonPress );
		return null;
	}
	
}


















