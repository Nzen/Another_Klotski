
// Nicholas Prado
// a reimplementation of the sliding block puzzle called Klotski
// MIT license as described at http://choosealicense.com/licenses/mit/

/* intended evolution
draw board & pieces
draw cursor
move cursor with keys
move piece according to rules
check win condition
move count? smarter move count?
solver for hints?
win sound?
*/

window.addEventListener( "load", pageReady, false );

var termin = function() {};
termin.log = function( message )
{ try
	{ console.log( message ); }
catch ( exception )
	{ return; } // IE reputedly has no console.
}

function canvasUnsupported() // doesn't catch all mobile exceptions
{	return !window.CanvasRenderingContext2D;	}

function pageReady()
{
	if ( canvasUnsupported() )
	{
		termin.log( "canvas unsupported, sorree" );
		return;
	}
	else
		klotski();
}

function klotski()
{
	var dom_canvas = document.getElementById( "canvas_here" );
	var canv = dom_canvas.getContext( "2d" );
	var bound = new Board( 4, 5 );
	var pix = new Screen( 218, 270 );
	var ky = new KeyValues();
	var cornr = new Cflag(); // determining shape
	bound.render();//redraw();
	window.addEventListener( "keydown", arrow_pressed, true );
	window.addEventListener( "keypress", wasd_pressed, true );

	function KeyValues()
	{
		this.l = 37; this.u = 38;
		this.r = 39; this.d = 40;
		this.L = 0; this.U = 1;
		this.R = 2; this.D = 3;
	}

	function arrow_pressed( ev )
	{
		var press = ev || window.event;
		var keyCode = press.keyCode;
		switch( keyCode )
		{
			// http://unixpapa.com/js/key.html
			// left 37, up 38, right 39, down 40
			case 37:
				bound.try_cursor( ky.l );
				break;
			case 38:
				bound.try_cursor( ky.u );
				break;
			case 39:
				bound.try_cursor( ky.r );
				break;
			case 40:
				bound.try_cursor( ky.d );
				break;
		}
	}

	function wasd_pressed( ev )
	{
		var keyPressed = String.fromCharCode( ev.keyCode );
		//termin.log("key=" + keyPressed);
		if ( keyPressed === 'a' )
			bound.try_block( ky.L );
		else if ( keyPressed === 'w' )
			bound.try_block( ky.U );
		else if ( keyPressed === 'd' )
			bound.try_block( ky.R );
		else if ( keyPressed === 's' )
			bound.try_block( ky.D );
		else
			termin.log("another pressed");
	}

	function Cflag()
	{
		this.o_ = 0;
		this.s_ = 1
		this.tt = 12; this.tb = 13;
		this.wl = 24; this.wr = 25;
		this.nw = 36; this.ne = 37; this.sw = 38; this.se = 39;
		this.str = function( some )
		{
			switch( some )
			{
			case this.o_:
				return "__";
			case this.s_:
				return "s_";
			case this.tt:
				return "tt";
			case this.tb:
				return "tb";
			case this.wl:
				return "wl";
			case this.wr:
				return "wr";
			case this.nw:
				return "nw";
			case this.ne:
				return "ne";
			case this.sw:
				return "sw";
			case this.se:
				return "se";
			}
		}
	}

	function Board( width, depth ) // hm doesn't use wid;depth
	{
		// interpretation order demands this be first :\
		this.fill_board = function()
		{
			var p = new Cflag();
			var grid = new Array( 	// transpose permits tiles[x][y]
				[p.tt, p.tb, p.tt, p.tb, p.s_],
				[p.nw, p.sw, p.wl, p.s_, p.o_],
				[p.ne, p.se, p.wr, p.s_, p.o_],
				[p.tt, p.tb, p.tt, p.tb, p.s_]
			);
			return grid;
		}

		// properties
		this.cursor = { x:0, y:0 };
		this.tiles = this.fill_board()

		this.render = function()
		{
			pix.blank_board();
			pix.dr_edge();
			pix.dr_goal_area();
			pix.dr_cursor( this.cursor.x, this.cursor.y );
			this.all_blocks_dr();
		}

		this.all_blocks_dr = function()
		{
			var currT = 0;
			for ( var xx = 0; xx < this.tiles.length; xx++ )
			{
				for ( var yy = 0; yy < this.tiles[xx].length; yy++ )
				{
					currT = this.tiles[xx][yy];
					this.top_corner_dr( currT, xx, yy );
				}
			}
		}

		this.top_corner_dr = function( type, xx, yy )
		{
			var small = true;
			var p = new Cflag();
			switch( type )
			{
			default:
				return;
			case p.o_:
				if ( this.in_goal_area( xx, yy ) )
					return;
				else
					pix.dr_block( xx, yy, small, small, "#0A0A29" );// background-color
				break;
			case p.s_:
				pix.dr_block( xx, yy, small, small, "purple" );
				break;
			case p.tt:
				pix.dr_block( xx, yy, small, !small, "green" );
				break;
			case p.wl:
				pix.dr_block( xx, yy, !small, small, "blue" );
				break;
			case p.nw:
				pix.dr_block( xx, yy, !small, !small, "red" );
			}
		}

		this.try_cursor = function( arrow )
		{
			if ( this.move_valid( arrow ) )
			{
				var justCursor = true, isX = true;
				var oldX = this.cursor.x, oldY = this.cursor.y;
				this.cursor.x = this.moved_coord( arrow, this.cursor.x, isX );
				this.cursor.y = this.moved_coord( arrow, this.cursor.y, !isX );
				//this.apply_cursor_move( arrow );
				this.render_change( justCursor, oldX, oldY );
			}
			//else
				//termin.log( " cursor hit edge" ); // or fading red line?
		}

		this.try_block = function( dir )
		{
				// FIX, assumes that cursor is on the leading edge of the shape
			function one_block_wide_in( dir, type )
			{
				switch( type )
				{
				case cornr.s_:
					return true;
				case cornr.tt:
				case cornr.tb:
					return ( dir === ky.U || dir === ky.D );
				case cornr.wl:
				case cornr.wr:
					return ( dir === ky.L || dir === ky.R );
				default: // ie square
					return false;
				}
			}
			function second_unblocked( dir, type )
			{
				return false; // FIX from stub
			}
			function unblocked( dir )
			{
				// sq ta wi s o
				var xxx = true;
				var anX = bound.moved_coord(dir, bound.cursor.x, xxx);
				var anY = bound.moved_coord(dir, bound.cursor.y, !xxx);
				var startType = bound.tiles[ bound.cursor.x ][ bound.cursor.y ];
				var endType = bound.tiles[ anX ][ anY ];
				termin.log( cornr.str(endType) );
				if ( endType == cornr.o_ )
					if ( one_block_wide_in( dir, startType ) )
						return true;
					else
						return second_unblocked( dir, startType );
				else
					return false;
			}
			function swap_rest_of_shape( dir, crsType )
			{
				var _x = bound.cursor.x;
				var _y = bound.cursor.y;
				switch( crsType )
				{
				case cornr.tt:
					_y++;
					break;
				case cornr.tb:
					_y--;
					break;
				case cornr.wl:
					_x++;
					break;
				case cornr.wr:
					_x--;
					break;
				default:
					return swap_square( dir ); // early exit :B
				}
				bound.swap_block( _x, _y, dir );
			}
			// BEGINS
			//termin.log("trying block");
			if ( !this.move_valid( dir ) ){termin.log("invalid cursor");
				return;}termin.log("valid cursor");
			if ( unblocked( dir ) )
			{
			termin.log("unblocked");
				var crsType = this.tiles[ this.cursor.x ][ this.cursor.y ];
				this.swap_block( this.cursor.x, this.cursor.y, dir );
				if ( crsType != cornr.s_ )
					swap_rest_of_shape( dir, crsType );
				this.apply_cursor_move( dir );
				this.render(); //_change();
			}
		}

		this.move_valid = function( arrow )
		{
			if ( arrow === ky.l || arrow === ky.L ){termin.log("curs > 0 :: " + (this.cursor.x > 0));
				return this.cursor.x > 0;}
			else if ( arrow === ky.u || arrow === ky.U )
				return this.cursor.y > 0;
			else if ( arrow === ky.r || arrow === ky.R )
				return this.cursor.x < this.tiles.length - 1;
			else if ( arrow === ky.d || arrow === ky.D )
				return this.cursor.y < this.tiles[0].length - 1;
		}

		this.moved_coord = function( dir, coor, isX )
		{
			if ( isX )
			{
				if ( dir === ky.l || dir === ky.L)
					return coor - 1;
				else if ( dir === ky.r || dir === ky.R )
					return coor + 1;
				else
					return coor;
			}
			else
			{
				if ( dir === ky.u || dir === ky.U )
					return coor - 1;
				else if ( dir === ky.d || dir === ky.D )
					return coor + 1;
				else
					return coor;
			}
		}

		this.apply_cursor_move = function( arrow )
		{
			if ( arrow === ky.l || arrow === ky.L )
				this.cursor.x -= 1;
			else if ( arrow === ky.u || arrow === ky.U )
				this.cursor.y -= 1;
			else if ( arrow === ky.r || arrow === ky.R )
				this.cursor.x += 1;
			else if ( arrow === ky.d || arrow === ky.D )
				this.cursor.y += 1;
		}

		this.swap_block = function( thX, thY, dir )
		{
			var yesX = true;
			var nxX = this.moved_coord( dir, thX, yesX );
			var nxY = this.moved_coord( dir, thY, !yesX );
			var tempType = this.tiles[thX][thY];
			this.tiles[thX][thY] = this.tiles[nxX][nxY];
			this.tiles[nxX][nxY] = tempType;
		}

		this.render_change = function( justCursor, oldX, oldY )
		{
			if ( justCursor )
			{
				pix.erase_cursor( oldX, oldY );
				pix.dr_cursor( this.cursor.x, this.cursor.y );
				this.redraw_affected( oldX, oldY );
			}
			// else it will be the whole block
		}

		this.in_goal_area = function( cX, cY )
			{	return ( cX > 0 && cX < 3 ) && ( cY > 2 ); }

		this.redraw_affected = function( coorX, coorY )
		{
			function same_shape( a, b ) // later optimization
			{	return a === b; }
			function s_type( part )
			{
				switch( part )
				{
				default:
				case cornr.o_:
				case cornr.s_:
				case cornr.tt:
				case cornr.wl:
				case cornr.nw:
					return part;
				case cornr.tb:
					return cornr.tt;
				case cornr.wr:
					return cornr.wl;
				case cornr.ne:
				case cornr.sw:
				case cornr.se:
					return cornr.nw;
				}
			}
			function topCorner( type, sideCoor, isX )
			{
				switch( type )
				{
				default:
				case cornr.o_:
				case cornr.s_:
				case cornr.tt:
				case cornr.wl:
				case cornr.nw:
					return sideCoor;
				case cornr.tb:
				case cornr.sw:
					return ( !isX ) ? sideCoor - 1 : sideCoor;
				case cornr.wr:
				case cornr.ne:
					return ( isX ) ? sideCoor - 1 : sideCoor;
				case cornr.se:
					return sideCoor - 1;
				}
			}
			function redraw( which, cX, cY )
			{
				var isX = true;
				var cX = topCorner( which, cX, isX );
				var cY = topCorner( which, cY, !isX );
				which = s_type( which );
				var small = true;
				bound.top_corner_dr( which, cX, cY );
			}
			function redraw_goal_blocks()
			{
				// unrolled loop
				bound.top_corner_dr( bound.tiles[1][3], 1, 3 ); // we've left Board-space
				bound.top_corner_dr( bound.tiles[2][3], 2, 3 );
				bound.top_corner_dr( bound.tiles[1][4], 1, 4 );
				bound.top_corner_dr( bound.tiles[2][4], 2, 4 );
			}
			//
			// redraw_affected() BEGINS
			var prevShape = this.tiles[coorX][coorY];
			var currShape = this.tiles[this.cursor.x][this.cursor.y];
			if ( bound.in_goal_area( coorX, coorY ) || bound.in_goal_area( this.cursor.x, this.cursor.y ) )
			{
				// redraw the whole goal area
				pix.dr_block( 1, 3, false, false, "#0A0A29" );// blank out goal
				pix.dr_goal_area();
				redraw_goal_blocks();
				if ( !bound.in_goal_area( coorX, coorY ) ) // sigh
					redraw( prevShape, coorX, coorY );
				else if ( !bound.in_goal_area( coorX, coorY ) )
					redraw( currShape, this.cursor.x, this.cursor.y );
			}
			else
			{
				redraw( prevShape, coorX, coorY );
				redraw( currShape, this.cursor.x, this.cursor.y );
			}
		}
	}

	function Screen( width, height)
	{
		this.w = width;
		this.h = height;

		this.dr_block = function( xC, yC, xSmall, ySmall, color )
		{
			var xP = this.c2p( xC );
			var yP = this.c2p( yC );
			var defaultSide = 40;
			var xL = ( xSmall ) ? defaultSide : defaultSide * 2 + 11;
			var yL = ( ySmall ) ? defaultSide : defaultSide * 2 + 11;
			canv.beginPath();
			canv.rect( xP, yP, xL, yL ); // x y
			canv.lineWidth = "3";
			canv.fillStyle = color;
			canv.fill();
		}

		this.dr_cursor = function( xC, yC )
		{
			var xP = this.cur2p( xC );
			var yP = this.cur2p( yC );
			var defaultSide = 49;
			canv.beginPath();
			canv.rect( xP, yP, defaultSide, defaultSide ); // x y
			canv.lineWidth = "2";
			canv.strokeStyle = "cyan";
			canv.stroke();
		}

		this.erase_cursor = function( xC, yC )
		{
			var xP = this.cur2p( xC );
			var yP = this.cur2p( yC );
			var defaultSide = 49;
			canv.beginPath();
			canv.rect( xP, yP, defaultSide, defaultSide ); // x y
			canv.lineWidth = "3";
			canv.strokeStyle = "#0A0A29"; // is background-color
			canv.stroke();
		}

		this.dr_edge = function()
		{
			canv.beginPath();
			canv.rect( 25, 25, this.w, this.h );
			canv.lineWidth="2";
			canv.strokeStyle="grey";
			canv.stroke();
		}

		this.blank_board = function()
		{
			canv.beginPath();
			canv.rect( 25, 25, this.w, this.h );
			//canv.lineWidth = "3";
			canv.fillStyle ="#0A0A29";// background-color
			canv.fill();
		}

		this.dr_goal_area = function()
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

		this.c2p = function( coord )
		{
			switch( coord )		// these will move to a rendering thing probably
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
		
		this.cur2p = function( coord )
		{
			return this.c2p( coord ) - 5;
		}
	}

}