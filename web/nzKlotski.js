
/*
&copy; Nicholas Prado ; released under terms of ../LICENSE
Draws a Klotski game to the canvas
*/


function drawTesting( letter )
{
	const dom_canvas = document.getElementById( "canvas_here" );
	const canv = dom_canvas.getContext( "2d" );
	canv.fillStyle = "gray";
	canv.font = "bold 25px monospace";
	canv.fillText( letter, 30, 30 );
}


function Cflag()
{
	this.o_ = 0;
	this.s_ = 1
	this.tt = 12; this.tb = 13;
	this.wl = 24; this.wr = 25;
	this.nw = 36; this.ne = 37; this.sw = 38; this.se = 39;
}


function drawBoard( boardState )
{
	const w = 218
	const h = 270;
	const background = "#0A0A29";
	const corner = new Cflag();
	const dom_canvas = document.getElementById( "canvas_here" );
	const canv = dom_canvas.getContext( "2d" );

	function c2p( coord )
	{
		switch( coord )
		{
		default:
		case 0:
			return 35;
		case 1:
			return 87;
		case 2:
			return 139;
		case 3:
			return 191;
		case 4:
			return 243;
		}
		return 5;
		/*
		35:35 87:35 139:35 191:35
		35:87 87:87 139:87 191:87
		35:139 87:139 139:139 191:139
		35:191 87:191 139:191 191:191
		35:243 87:243 139:243 191:243
		*/
	}

	function cursor2Pixel( coord )
	{
		return c2p( coord ) - 5;
	}

	function blank_board()
	{
		canv.beginPath();
		canv.rect( 25, 25, w +70, h +30 );
		//canv.lineWidth = "3";
		canv.fillStyle =background;
		canv.fill();
	}

	function dr_edge()
	{
		canv.beginPath();
		canv.rect( 25, 25, w, h );
		canv.lineWidth="2";
		canv.strokeStyle="grey";
		canv.stroke();
	}

	function winner_banner()
	{
		canv.fillStyle = "paleturquoise";
		canv.font = "bold 20px monospace";
		canv.fillText( "winner winner", 10,210);//1, 210 );
		canv.fillText( "chicken dinner", 75,240);//100, 240 );
	}

	function show_moves( moves )
	{
		canv.fillStyle = "silver";
		canv.font = "bold 15px monospace";
		canv.fillText( "moves", 255, 260 );
		canv.fillText( moves, 260, 280 );
	}

	function bad_restore()
	{
		canv.fillStyle = "paleturquoise";
		canv.font = "bold 20px monospace";
		canv.fillText( "COULD NOT RESTORE", 40,210);//1, 210 );
	}

	function dr_goal_area()
	{
		function dr_gline( sX_, sY_, eX_, eY_ )
		{
			canv.beginPath();
			canv.lineWidth="1";
			canv.strokeStyle="red";
			canv.moveTo(sX_, sY_);
			canv.lineTo(eX_, eY_);
			canv.stroke();
		}
		// lower triangle
		var eX = 179; // fix to c2p ratio?
		var sY = 282;
		var eY = 191;
		for ( sX = 88; sX < eX; sX += 10 )
		{
			dr_gline( sX, sY, eX, eY );
			eY += 10;
		}
		// upper triangle
		sX = 88;
		sY = 270;
		eY = 191;
		for ( eX = 169; sX < eX; eX -= 10 )
		{
			dr_gline( sX, sY, eX, eY );
			sY -= 10;
		}
	}

	function in_goal_area( cX, cY )
	{	return ( cX > 0 && cX < 3 ) && ( cY > 2 ); }

	function dr_cursor( xC, yC )
	{
		var xP = cursor2Pixel( xC );
		var yP = cursor2Pixel( yC );
		var defaultSide = 49;
		canv.beginPath();
		canv.rect( xP, yP, defaultSide, defaultSide ); // x y
		canv.lineWidth = "2";
		canv.strokeStyle = "cyan";
		canv.stroke();
	}

	function erase_cursor( xC, yC )
	{
		var xP = cur2p( xC );
		var yP = cur2p( yC );
		var defaultSide = 49;
		dr_edge();
		canv.beginPath();
		canv.rect( xP, yP, defaultSide, defaultSide ); // x y
		canv.lineWidth = "3";
		canv.strokeStyle = background;
		canv.stroke();
	}

		function dr_block( xC, yC, xSmall, ySmall, color )
		{
			var xP = c2p( xC );
			var yP = c2p( yC );
			var defaultSide = 40;
			var xL = ( xSmall ) ? defaultSide : defaultSide * 2 + 11;
			var yL = ( ySmall ) ? defaultSide : defaultSide * 2 + 11;
			canv.beginPath();
			canv.rect( xP, yP, xL, yL ); // x y
			canv.lineWidth = "3";
			canv.fillStyle = color;
			canv.fill();
		}

		// debugging style output
		function dr_bk_txt( xC, yC, color, txt )
		{
			var xP = c2p( xC );
			var yP = c2p( yC );
			var xL = 40, yL = xL;
			canv.beginPath();
			canv.rect( xP, yP, xL, yL ); // x y
			canv.lineWidth = "3";
			canv.strokeStyle = color;
			canv.stroke();
			//
			canv.beginPath();
			canv.fillStyle = "gray";
			canv.font = "bold 13px monospace";
			canv.fillText( txt, xP + 15, yP + 15 );
		}

		function blockwise_dr( type, xx, yy ) // outlines
		{
			switch( type )
			{
			default:
			case corner.o_:
				if ( in_goal_area( xx, yy ) )
					return; // drawn in goal_area() already
				else
					dr_bk_txt( xx, yy, background, corner.str(type) );
				break;
			case corner.s_:
				dr_bk_txt( xx, yy, "purple", corner.str(type) );
				break;
			case corner.tt:
			case corner.tb:
				dr_bk_txt( xx, yy, "green", corner.str(type) );
				break;
			case corner.wl:
			case corner.wr:
				dr_bk_txt( xx, yy, "blue", corner.str(type) );
				break;
			case corner.nw:
			case corner.ne:
			case corner.sw:
			case corner.se:
				dr_bk_txt( xx, yy, "red", corner.str(type) );
			}
		}

	function top_corner_dr( type, xx, yy )
	{
		var small = true;
		switch( type )
		{
		default:
			return;
		case corner.o_:
			if ( in_goal_area( xx, yy ) )
				return;
			else
				dr_block( xx, yy, small, small, background );
			break;
		case corner.s_:
			dr_block( xx, yy, small, small, "purple" );
			break;
		case corner.tt:
			dr_block( xx, yy, small, !small, "green" );
			break;
		case corner.wl:
			dr_block( xx, yy, !small, small, "blue" );
			break;
		case corner.nw:
			dr_block( xx, yy, !small, !small, "red" );
		}
	}

	function all_blocks_dr( tiles )
	{
		var currT = 0;
		for ( var xx = 0; xx < tiles.length; xx++ )
		{
			for ( var yy = 0; yy < tiles[xx].length; yy++ )
			{
				currT = tiles[xx][yy];
				top_corner_dr( currT, xx, yy ); // for clients
				//blockwise_dr( currT, xx, yy ); // for testing
			}
		}
	}

	blank_board();
	dr_edge();
	show_moves( boardState.moves );
	dr_goal_area();
	dr_cursor( boardState.cursor.xC, boardState.cursor.yC );
	all_blocks_dr( boardState.tiles );
}





























