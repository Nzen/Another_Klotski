
// Nicholas Prado
// a reimplementation of the sliding block puzzle called Klotski
// MIT license as described at http://opensource.org/licenses/MIT

/* intended evolution
	~~draw board & pieces~~
	~~draw cursor~~
	~~move cursor with keys~~
	~~move piece according to rules~~
	~~check win condition~~
	~~move cursor with ijkl~~
	tests
	~~move count~~smarter move count~~
	save / restore game (with anticheating)?
	solver for hints? or just statically solve it & draw hints from that?
	win sound? piece sounds :? // separate branch?
	draw blocked direction bar?
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
	function arrow_pressed( ev ) // no longer used, left for posterity
	{
		var press = ev || window.event;
		var keyCode = press.keyCode;
		switch( keyCode )
		{
			// http://unixpapa.com/js/key.html	javascript-keypress resource
			case 37: // "left"
				bound.try_cursor( ky.l );
				break;
			case 38: // "up"
				bound.try_cursor( ky.u );
				break;
			case 39: // "right"
				bound.try_cursor( ky.r );
				break;
			case 40: // "down"
				bound.try_cursor( ky.d );
				break;
		}
	}

	function letter_pressed( ev )
	{
		var keyPressed = String.fromCharCode( ev.keyCode );
		switch( keyPressed )
		{
		// cursor & shape
		case 'A':
			bound.try_block( ky.L );
			break;
		case 'W':
			bound.try_block( ky.U );
			break;
		case 'D':
			bound.try_block( ky.R );
			break;
		case 'S':
			bound.try_block( ky.D );
			break;
		// cursor only
		case 'a':
			bound.try_cursor( ky.l );
			break;
		case 'w':
			bound.try_cursor( ky.u );
			break;
		case 'd':
			bound.try_cursor( ky.r );
			break;
		case 's':
			bound.try_cursor( ky.d );
			break;
		case '~':
			save_game(); // make it work, then make it good.
			break;
		case '%':
			restore_game();
			break;
		default:
			return;
		}
	}

	function KeyValues()
	{
		this.l = 37; this.u = 38;
		this.r = 39; this.d = 40;
		this.L = 0; this.U = 1;
		this.R = 2; this.D = 3;
	}
	KeyValues.prototype =
	{
		reverse : function( dir )
		{
			if ( dir === this.l || dir === this.L)
				return this.R;
			else if ( dir === this.r || dir === this.R )
				return this.L;
			else if ( dir === this.u || dir === this.U )
				return this.D;
			else if ( dir === this.d || dir === this.D )
				return this.U;
		},
		str : function( some )
		{
			switch( some )
			{
			case this.l:
			case this.L:
				return "lL";
			case this.u:
			case this.U:
				return "uU";
			case this.r:
			case this.R:
				return "rR";
			case this.d:
			case this.D:
				return "dD";
			}
		}
	};

	function Cflag()
	{
		this.o_ = 0;
		this.s_ = 1
		this.tt = 12; this.tb = 13;
		this.wl = 24; this.wr = 25;
		this.nw = 36; this.ne = 37; this.sw = 38; this.se = 39;
	}
  Cflag.prototype =
  {
    str : function( some )
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
			default:
				return "??";
			}
		},
      is_square : function( type )
		{
			return ( type === this.nw || type === this.sw || type === this.se || type === this.ne );
		}
  };

	function Board( width, depth )
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
			/*var grid = new Array( 	// sparse for testing // fix before using
				[corner.tt, corner.tb, corner.o_, corner.o_, corner.s_],
				[corner.nw, corner.sw, corner.wl, corner.o_, corner.o_],
				[corner.ne, corner.se, corner.wr, corner.o_, corner.o_],
				[corner.o_, corner.o_, p.o_, p.o_, p.s_]
			);*/
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
			this.check_if_won();
			pix.show_moves();
		}

		this.all_blocks_dr = function()
		{
			var currT = 0;
			for ( var xx = 0; xx < this.tiles.length; xx++ )
			{
				for ( var yy = 0; yy < this.tiles[xx].length; yy++ )
				{
					currT = this.tiles[xx][yy];
					//this.top_corner_dr( currT, xx, yy ); // for clients
					this.blockwise_dr( currT, xx, yy ); // for testing
				}
			}
		}

		this.blockwise_dr = function( type, xx, yy ) // outlines
		{
			switch( type )
			{
			default:
			case corner.o_:
				if ( this.in_goal_area( xx, yy ) )
					return; // drawn in goal_area() already
				else
					pix.dr_bk_txt( xx, yy, background, corner.str(type) );
				break;
			case corner.s_:
				pix.dr_bk_txt( xx, yy, "purple", corner.str(type) );
				break;
			case corner.tt:
			case corner.tb:
				pix.dr_bk_txt( xx, yy, "green", corner.str(type) );
				break;
			case corner.wl:
			case corner.wr:
				pix.dr_bk_txt( xx, yy, "blue", corner.str(type) );
				break;
			case corner.nw:
			case corner.ne:
			case corner.sw:
			case corner.se:
				pix.dr_bk_txt( xx, yy, "red", corner.str(type) );
			}
		}

		this.top_corner_dr = function( type, xx, yy )
		{
			var small = true;
			switch( type )
			{
			default:
				return;
			case corner.o_:
				if ( this.in_goal_area( xx, yy ) )
					return;
				else
					pix.dr_block( xx, yy, small, small, background );
				break;
			case corner.s_:
				pix.dr_block( xx, yy, small, small, "purple" );
				break;
			case corner.tt:
				pix.dr_block( xx, yy, small, !small, "green" );
				break;
			case corner.wl:
				pix.dr_block( xx, yy, !small, small, "blue" );
				break;
			case corner.nw:
				pix.dr_block( xx, yy, !small, !small, "red" );
			}
		}

		this.try_cursor = function( arrow )
		{
			if ( this.within_bounds( arrow ) )
			{
				var oldX = this.cursor.x, oldY = this.cursor.y;
				this.apply_cursor_move( arrow );
				this.render();
			}
			//else
				//termin.log( " cursor hit edge" ); // or fading red line?
		}

		this.try_block = function( dir )
		{
			function dir_to_check( thType )
			{
				switch( thType )
				{
				case corner.tt:
					return ky.d;
				case corner.tb:
					return ky.u;
				case corner.wl:
					return ky.r;
				case corner.wr:
					return ky.l;
				case corner.nw:
					return ky.r;
				case corner.ne:
					return ky.l;
				case corner.sw:
					return ky.r;
				case corner.se:
					return ky.l;
				default:
					return -1;
				}
			}
			function update_move_counter( dir ) // fix: refactor
			{
				function was_different( dir )
				{
					moves++;
					lastCurs.x = bound.cursor.x;
					lastCurs.y = bound.cursor.y;
					lastCurs.d = dir;
				}
				function square_checks(  )
				{
					var there = bound.tiles[ lastCurs.x ][ lastCurs.y ];
					if ( corner.is_square( there ) )
					{	// ie is currently inside the square, then must have been next to square last time
						moves--;
						return;
					}
					var oldX = bound.next_coord( dir, lastCurs.x, isX );
					var oldY = bound.next_coord( dir, lastCurs.y, !isX );
					var there = bound.tiles[ oldX ][ oldY ];
					if ( corner.is_square( there ) )
					{ // ie used to be where square is now, so must have been in square before
						moves--;
					}
					else
					{
						was_different( dir );
					}
				}
				// BEGIN update_move_counter()
				if ( lastCurs.d === ky.reverse( dir ) )
				{
					var oldX = bound.next_coord( lastCurs.d, bound.cursor.x, isX );
					var oldY = bound.next_coord( lastCurs.d, bound.cursor.y, !isX );
					if ( lastCurs.x === oldX && lastCurs.y === oldY )
						moves--;
					else // not the same cursor position
					{
						var here = bound.tiles[ bound.cursor.x ][ bound.cursor.y ];
						if ( here === corner.s_ )
						{
							was_different( dir );
							return;
						}
						else if ( corner.is_square(here) )
							square_checks();
						else // not a square
						{
							var ddiirr = dir_to_check( here );
							oldX = bound.next_coord( ddiirr, oldX, isX );
							oldY = bound.next_coord( ddiirr, oldY, !isX );
							if ( lastCurs.x === oldX && lastCurs.y === oldY )
								moves--;
							else
								was_different( dir );
						}
					}
				}
				else // different direction
					was_different( dir );
			}
			function one_block_wide_in( dir, type )
			{
				switch( type )
				{
				case corner.s_:
					return true;
				case corner.tt:
				case corner.tb:
					return ( dir === ky.U || dir === ky.D );
				case corner.wl:
				case corner.wr:
					return ( dir === ky.L || dir === ky.R );
				default: // ie square
					return false;
				}
			}
			function second_unblocked( dir, startType, _x, _y )
			{
				switch( startType )
				{
				case corner.tt:
					dir = ky.D; // direction to check for shape
					break;
				case corner.tb:
					dir = ky.U;
					break;
				case corner.wl:
					dir = ky.R;
					break;
				case corner.wr:
					dir = ky.L;
					break;
				case corner.nw:
					dir = (( dir === ky.U ) ? ky.R : ky.D);
					break;
				case corner.ne:
					dir = (( dir === ky.U ) ? ky.L : ky.D);
					break;
				case corner.sw:
					dir = (( dir === ky.D ) ? ky.R : ky.U);
					break;
				case corner.se:
					dir = (( dir === ky.D ) ? ky.L : ky.U);
				}
				_x = bound.next_coord(dir, _x, isX);
				_y = bound.next_coord(dir, _y, !isX);
				return ( bound.tiles[ _x ][ _y ] === corner.o_ );
			}
			function rest_unblocked( dir, startType, anX, anY )
			{
				return one_block_wide_in( dir, startType ) || second_unblocked( dir, startType, anX, anY );
			}
			function unblocked( dir )
			{
				// sq ta wi s o
				var anX = bound.next_coord(dir, bound.cursor.x, isX);
				var anY = bound.next_coord(dir, bound.cursor.y, !isX);
				var startType = bound.tiles[ bound.cursor.x ][ bound.cursor.y ];
				var endType = bound.tiles[ anX ][ anY ];
				if ( endType === corner.o_ )
				{
					return rest_unblocked( dir, startType, anX, anY );
				}
				else if ( bound.same_shape( startType, endType ) )
				{
					anX = bound.next_coord(dir, anX, isX);
					anY = bound.next_coord(dir, anY, !isX);
					startType = endType;
					endType = bound.tiles[ anX ][ anY ];
					return ( endType === corner.o_ && rest_unblocked(dir, startType, anX, anY) );
				}
				else
					return false;
			}
			function swap_square( dir, prevType ) // fix: dry?
			{
				var _x = bound.cursor.x;
				var _y = bound.cursor.y;
				switch( prevType )
				{
				case corner.nw:
					bound.swap_block( _x+1, _y, dir );
					bound.swap_block( _x, _y+1, dir );
					bound.swap_block( _x+1, _y+1, dir );
					break;
				case corner.ne:
					bound.swap_block( _x-1, _y, dir );
					bound.swap_block( _x, _y+1, dir );
					bound.swap_block( _x-1, _y+1, dir );
					break;
				case corner.sw:
					bound.swap_block( _x+1, _y, dir );
					bound.swap_block( _x, _y-1, dir );
					bound.swap_block( _x+1, _y-1, dir );
					break;
				case corner.se:
					bound.swap_block( _x-1, _y, dir );
					bound.swap_block( _x, _y-1, dir );
					bound.swap_block( _x-1, _y-1, dir );
					break;
				}
			}
			function swap_rest_of_shape( dir, crsType )
			{
				var _x = bound.cursor.x;
				var _y = bound.cursor.y;
				switch( crsType )
				{
				case corner.tt:
					_y++;
					break;
				case corner.tb:
					_y--;
					break;
				case corner.wl:
					_x++;
					break;
				case corner.wr:
					_x--;
					break;
				default:
					swap_square( dir, crsType );
					return;
				}
				bound.swap_block( _x, _y, dir );
			}
			// try_block() BEGINS
			if ( !this.within_bounds( dir ) )
				return;
			if ( unblocked( dir ) )
			{
				var crsType = this.tiles[ this.cursor.x ][ this.cursor.y ];
				var nnX = bound.next_coord( dir, bound.cursor.x, isX );
				var nnY = bound.next_coord( dir, bound.cursor.y, !isX );
				var nextType = this.tiles[ nnX ][ nnY ];
				if ( bound.same_shape( crsType, nextType ) )
				{
					this.apply_cursor_move( dir );
					crsType = nextType;
					this.swap_block( this.cursor.x, this.cursor.y, dir );
					if ( crsType != corner.s_ )
						swap_rest_of_shape( dir, crsType );
				}
				else
				{
					this.swap_block( this.cursor.x, this.cursor.y, dir );
					if ( crsType != corner.s_ )
						swap_rest_of_shape( dir, crsType );
					this.apply_cursor_move( dir );
				}
				update_move_counter( dir );
				this.render(); //_change();
			}
		}

		this.within_bounds = function( arrow )
		{
			if ( arrow === ky.l || arrow === ky.L )
				return this.cursor.x > 0;
			else if ( arrow === ky.u || arrow === ky.U )
				return this.cursor.y > 0;
			else if ( arrow === ky.r || arrow === ky.R )
				return this.cursor.x < this.tiles.length - 1;
			else if ( arrow === ky.d || arrow === ky.D )
				return this.cursor.y < this.tiles[0].length - 1;
		}

		this.next_coord = function( dir, coor, isX )
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

		this.same_shape = function( typeA, typeZ )
		{
			switch( typeA )
			{
			case corner.tt:
				return ( typeZ === corner.tb );
			case corner.tb:
				return ( typeZ === corner.tt );
			case corner.wl:
			case corner.wr:
				return ( typeZ === corner.wl || typeZ === corner.wr );
			case corner.nw:
			case corner.ne:
			case corner.sw:
			case corner.se:
				return corner.is_square( typeZ );
			case corner.s_:
			default:
				return false;
			}
		}

		this.apply_cursor_move = function( arrow )
		{
			switch( arrow )
			{
			case ky.l:
			case ky.L:
				this.cursor.x -= 1;
				break;
			case ky.u:
			case ky.U:
				this.cursor.y -= 1;
				break;
			case ky.r:
			case ky.R:
				this.cursor.x += 1;
				break;
			case ky.d:
			case ky.D:
				this.cursor.y += 1;
				break;
			}
		}

		this.swap_block = function( thX, thY, dir )
		{
			var nxX = this.next_coord( dir, thX, isX );
			var nxY = this.next_coord( dir, thY, !isX );
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
			function s_type( part )
			{
				switch( part )
				{
				default:
				case corner.o_:
				case corner.s_:
				case corner.tt:
				case corner.wl:
				case corner.nw:
					return part;
				case corner.tb:
					return corner.tt;
				case corner.wr:
					return corner.wl;
				case corner.ne:
				case corner.sw:
				case corner.se:
					return corner.nw;
				}
			}
			function top_corner( type, sideCoor, isX )
			{
				switch( type )
				{
				default:
				case corner.o_:
				case corner.s_:
				case corner.tt:
				case corner.wl:
				case corner.nw:
					return sideCoor;
				case corner.tb:
				case corner.sw:
					return ( !isX ) ? sideCoor - 1 : sideCoor;
				case corner.wr:
				case corner.ne:
					return ( isX ) ? sideCoor - 1 : sideCoor;
				case corner.se:
					return sideCoor - 1;
				}
			}
			function test_top_corner() // ugh?
			{
				var failed = 0;
				var answer = bound.top_corner( corner.o_, 2, isX );
				if ( answer != 2 )
				{
					termin.log( "ttc o_-x should 2, is " + answer );
					failed++;
				}
				answer = bound.top_corner( corner.o_, 2, !isX );
				if ( answer != 2 )
				{
					termin.log( "ttc o_-y should 2, is " + answer );
					failed++;
				}
				answer = bound.top_corner( corner.s_, 2, isX );
				if ( answer != 2 )
				{
					termin.log( "ttc s_-x should 2, is " + answer );
					failed++;
				}
				answer = bound.top_corner( corner.s_, 2, !isX );
				if ( answer != 2 )
				{
					termin.log( "ttc s_-y should 2, is " + answer );
					failed++;
				}
				answer = bound.top_corner( corner.tt, 2, isX );
				if ( answer != 2 )
				{
					termin.log( "ttc tt-x should 2, is " + answer );
					failed++;
				}
				answer = bound.top_corner( corner.tt, 2, !isX );
				if ( answer != 2 )
				{
					termin.log( "ttc tt-y should 2, is " + answer );
					failed++;
				}
				answer = bound.top_corner( corner.tb, 2, isX );
				if ( answer != 2 )
				{
					termin.log( "ttc tb-x should 2, is " + answer );
					failed++;
				}
				answer = bound.top_corner( corner.tb, 2, !isX );
				if ( answer != 1 )
				{
					termin.log( "ttc tb-y should 2, is " + answer );
					failed++;
				}
				answer = bound.top_corner( corner.wr, 2, isX );
				if ( answer != 1 )
				{
					termin.log( "ttc wr-x should 1, is " + answer );
					failed++;
				}
				answer = bound.top_corner( corner.wr, 2, !isX );
				if ( answer != 2 )
				{
					termin.log( "ttc wr-y should 2, is " + answer );
					failed++;
				}
				answer = bound.top_corner( corner.wl, 2, isX );
				if ( answer != 2 )
				{
					termin.log( "ttc wl-x should 2, is " + answer );
					failed++;
				}
				/*top_corner( type, sideCoor, isX )
			{
				switch( type )
				{
				default:
				case corner.o_:
				case corner.s_:
				case corner.tt:
				case corner.wl:
				case corner.nw:
					return sideCoor;
				case corner.tb:
				case corner.sw:
					return ( !isX ) ? sideCoor - 1 : sideCoor;
				case corner.wr:
				case corner.ne:
					return ( isX ) ? sideCoor - 1 : sideCoor;
				case corner.se:
					return sideCoor - 1;
				}*/
				return failed;
			}
			function redraw( which, cX, cY )
			{
				var cX = top_corner( which, cX, isX );
				var cY = top_corner( which, cY, !isX );
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
				else if ( !bound.in_goal_area( this.cursor.x, this.cursor.y ) )
					redraw( currShape, this.cursor.x, this.cursor.y );
			}
			else
			{
				redraw( prevShape, coorX, coorY );
				redraw( currShape, this.cursor.x, this.cursor.y );
			}
		}

		this.check_if_won = function()
		{
			if ( this.tiles[1][3] === corner.nw ) // assuming no bugs :p
				pix.winner_banner();
		}

		this.test_all = function()
		{
			function test_apply_cursor_move()
			{
				function new_cursor_right( _x, _y )
				{	return ( bound.cursor.x == _x && bound.cursor.y == _y )
				}
				var failed = 0;
				var oldX = bound.cursor.x;
				var oldY = bound.cursor.y;
				bound.cursor.x = 2;
				bound.cursor.y = 2;
				bound.apply_cursor_move( ky.U );
				if ( ! new_cursor_right( 2,1 ) )
				{
					termin.log( "tacm error key U, want 2,1 got " +bound.cursor.x+","+bound.cursor.y );
					failed++;
				}
				bound.apply_cursor_move( ky.u );
				if ( ! new_cursor_right( 2,0 ) )
				{
					termin.log( "tacm error key u, want 2,0 got " +bound.cursor.x+","+bound.cursor.y );
					failed++;
				}
				bound.apply_cursor_move( ky.l );
				if ( ! new_cursor_right( 1,0 ) )
				{
					termin.log( "tacm error key l, want 1,0 got " +bound.cursor.x+","+bound.cursor.y );
					failed++;
				}
				bound.apply_cursor_move( ky.L );
				if ( ! new_cursor_right( 0,0 ) )
				{
					termin.log( "tacm error key L, want 0,0 got " +bound.cursor.x+","+bound.cursor.y );
					failed++;
				}
				bound.apply_cursor_move( ky.d );
				if ( ! new_cursor_right( 0,1 ) )
				{
					termin.log( "tacm error key d, want 0,1 got " +bound.cursor.x+","+bound.cursor.y );
					failed++;
				}
				bound.apply_cursor_move( ky.D );
				if ( ! new_cursor_right( 0,2 ) )
				{
					termin.log( "tacm error key D, want 0,2 got " +bound.cursor.x+","+bound.cursor.y );
					failed++;
				}
				bound.apply_cursor_move( ky.r );
				if ( ! new_cursor_right( 1,2 ) )
				{
					termin.log( "tacm error key r, want 1,2 got " +bound.cursor.x+","+bound.cursor.y );
					failed++;
				}
				bound.apply_cursor_move( ky.R );
				if ( ! new_cursor_right( 2,2 ) )
				{
					termin.log( "tacm error key R, want 2,2 got " +bound.cursor.x+","+bound.cursor.y );
					failed++;
				}
				bound.cursor.x = oldX;
				bound.cursor.y = oldY;
				return failed;
			}
			function test_next_coord()
			{
				var failed = 0;
				var thX = 2;
				var thY = 2;
				var answer = bound.next_coord( ky.l, thX, isX );
				if ( answer != 1 )
				{
					termin.log( "tnc: didn't calc l-x" );
					failed++;
				}
				answer = bound.next_coord( ky.l, thY, !isX );
				if ( answer != 2 )
				{
					termin.log( "tnc: didn't calc l-y" );
					failed++;
				}
				answer = bound.next_coord( ky.d, thX, isX );
				if ( answer != 2 )
				{
					termin.log( "tnc: didn't calc d-x" );
					failed++;
				}
				answer = bound.next_coord( ky.d, thY, !isX );
				if ( answer != 3 )
				{
					termin.log( "tnc: didn't calc d-y" );
					failed++;
				}
				answer = bound.next_coord( ky.r, thX, isX );
				if ( answer != 3 )
				{
					termin.log( "tnc: didn't calc r-x" );
					failed++;
				}
				answer = bound.next_coord( ky.r, thY, !isX );
				if ( answer != 2 )
				{
					termin.log( "tnc: didn't calc r-y" );
					failed++;
				}
				answer = bound.next_coord( ky.u, thX, isX );
				if ( answer != 2 )
				{
					termin.log( "tnc: didn't calc u-x" );
					failed++;
				}
				answer = bound.next_coord( ky.u, thY, !isX );
				if ( answer != 1 )
				{
					termin.log( "tnc: didn't calc u-y" );
					failed++;
				}
				return failed;
			}
			function test_within_bounds()
			{
				var failed = 0;
				var oldX = bound.cursor.x;
				var oldY = bound.cursor.y;
				bound.cursor.x = 0;
				bound.cursor.y = 0;
				if ( bound.within_bounds( ky.l ) || bound.within_bounds( ky.L ) )
				{
					termin.log( "twb out at 0,0 with lL" );
					failed++;
				}
				if ( bound.within_bounds( ky.u ) || bound.within_bounds( ky.U ) )
				{
					termin.log( "twb out at 0,0 with uU" );
					failed++;
				}
				bound.cursor.x = bound.tiles.length - 1;
				bound.cursor.y = bound.tiles[0].length - 1;
				if ( bound.within_bounds( ky.r ) || bound.within_bounds( ky.R ) )
				{
					termin.log( "twb out at 4,5 with rR" );
					failed++;
				}
				if ( bound.within_bounds( ky.d ) || bound.within_bounds( ky.D ) )
				{
					termin.log( "twb out at 4,5 with dD" );
					failed++;
				}
				bound.cursor.x = oldX;
				bound.cursor.y = oldY;
				return failed;
			}
			// in_goal_area
			// swap_block
			// try_cursor
			// try_block
			// test internal functions somehow?
			/*grid = new Array(
				[p.tt, p.tb, p.tt, p.tb, p.s_],
				[p.nw, p.sw, p.wl, p.s_, p.o_],
				[p.ne, p.se, p.wr, p.s_, p.o_],
				[p.tt, p.tb, p.tt, p.tb, p.s_]
			);*/
			var failed = test_next_coord();
			failed += test_apply_cursor_move();
			failed += test_within_bounds();
			termin.log( (( failed < 1 ) ? "didn't trip tests" : ( failed + " tests failed" )) );
		}
	}
	Board.prototype.serialize_tiles = function()
	{
		// current plan, use the printing strings. maybe enum vals later. why not now? delimiters irrelevate padding idea
		var stream = moves + "-";
		for ( var ind_x = 0; ind_x < bound.tiles.length; ind_x++ )
		{
			for ( var ind_y = 0; ind_y < bound.tiles[0].length; ind_y++ )
			{
				stream += corner.str( bound.tiles[ ind_x ][ ind_y ] ) + "*";
			}
			stream = stream.substr( 0, stream.length - 1 ); // cut the hanging *
			stream += "/";
		}
		stream = stream.substr( 0, stream.length - 1 ); // cut the hanging '/'
		return stream;
	}
	Board.prototype.deserialize_tiles = function( userInput )
	{
		function de_str( typeStr )
		{
			switch( typeStr )
			{
			case "__":
				return corner.o_;
			case "s_":
				return corner.s_;
			case "tt":
				return corner.tt;
			case "tb":
				return corner.tb;
			case "wl":
				return corner.wl;
			case "wr":
				return corner.wr;
			case "nw":
				return corner.nw;
			case "ne":
				return corner.ne;
			case "sw":
				return corner.sw;
			case "se":
				return corner.se;
			default:
				return -1;
			}
		}
		function lex_stream( userInput )
		{
			termin.log( "outset uI = " + userInput );
			var pastMoveI = userInput.indexOf( '-' );
			if ( pastMoveI < 0 )
			{
				termin.log( "illegit: moves not separated from game state" );
				return { status: "broken" };
			}
			var mmoves = userInput.substr( 0, pastMoveI );
			mmoves = parseInt( mmoves, 10 );
			if ( mmoves === NaN )
			{
				termin.log( "illegit: moves isn't a number" );
				return { status: "broken" };
			}
			userInput = userInput.substr( pastMoveI + 1, userInput.length - 2 );
			termin.log( "ds mm=" + mmoves + " uI=" + userInput ); // + " pmi-" + pastMoveI
			var outer = userInput.split( '/' );
			for ( var lis = 0; lis < outer.length; lis++ )
			{
				outer[ lis ] = outer[ lis ].split( '*' );
			}
			var failed = false;
			var p = corner;
			for ( var ind = 0; ind < outer.length; ind++ )
			{
				for ( var dni = 0; dni < outer[0].length; dni++ )
				{
					outer[ ind ][ dni ] = de_str( outer[ind][dni] );
					if ( outer[ ind ][ dni ] < 0 )
					{
						termin.log( "illegit: negative corner type" );
						return { status: "broken" };
					}
				}
			}
			return { arra:outer, status:failed };
		}
		function parse_grid( typeCrate )
		{
			function isnt_rectangular( grid )
			{
				var len = grid[0].length;
				var row_l = 0;
				for ( var ro = 0; ro < grid.length; ro++ )
				{
					row_l = grid[ ro ].length;
					if ( row_l != len )
						return true;
				} // else
				return false; // is square
			}

			function square_broken( grid, rr, cc ) // FIX
			{
				var first = grid[rr][cc];
				var second, third, fourth = first;
				var min = 1;
				var sides_broken = false;
				var r_lim = grid.length - 1;
				var c_lim = grid[0].length - 1;
				//switch ( grid[rr][cc] )
				if ( first === corner.nw )
				{
					sides_broken = ( rr >= r_lim || cc >= c_lim );
					if ( sides_broken ) return sides_broken;
					second = grid[ rr + 1 ][ cc ];
					third = grid[ rr ][ cc + 1 ];
					fourth = grid[ rr + 1 ][ cc + 1 ];
					return ( second != corner.ne || third != corner.sw || fourth != corner.se );
				}
				else if ( first === corner.ne )
				{
					sides_broken = ( rr >= r_lim || cc < min );
					if ( sides_broken ) return sides_broken;
					second = grid[ rr - 1 ][ cc ];
					third = grid[ rr - 1 ][ cc + 1 ];
					fourth = grid[ rr ][ cc + 1 ];
					return ( second != corner.nw || third != corner.sw || fourth != corner.se );
				}
				else if ( first === corner.sw ) // 4-tt*tb*tt*tb*s_/__*nw*sw*wl*s_/__*ne*se*wr*s_/tt*tb*tt*tb*s_ 
				{
					sides_broken = ( rr < min || cc >= c_lim );
					if ( sides_broken ) return sides_broken;
					second = grid[ rr ][ cc - 1 ];
					third = grid[ rr - 1 ][ cc - 1 ];
					fourth = grid[ rr ][ cc + 1 ];
					return ( second != corner.nw || third != corner.ne || fourth != corner.se );
				}
				else if ( first === corner.se )
				{
					sides_broken = ( rr < min || cc < min );
					if ( sides_broken ) return sides_broken;
					second = grid[ rr - 1 ][ cc - 1 ];
					third = grid[ rr ][ cc - 1 ];
					fourth = grid[ rr - 1 ][ cc ];
					return ( second != corner.nw || third != corner.ne || fourth != corner.sw );
				}
				else
					termin.log("what");
			}

			function broken_shape( grid, rr, cc )
			{
			//termin.log( corner.str(grid[rr][cc]) );
				var not_broken = false;
				switch ( grid[rr][cc] )
				{
				case corner.o_:
				case corner.s_:
					return not_broken; // FIX, below needs to be flipped: transpose
				case corner.tt:
					return ( rr + 1 >= grid[rr].length || grid[rr][ cc + 1 ] != corner.tb );
				case corner.tb:
					return ( cc <= 0 || grid[rr][ cc - 1 ] != corner.tt );
				case corner.wl:
					return ( cc + 1 >= grid[rr][cc].length || grid[ rr + 1 ][cc] != corner.wr );
				case corner.wr:
					return ( cc < 1 || grid[ rr - 1 ][cc] != corner.wl );
				case corner.nw:
				case corner.ne:
				case corner.sw:
				case corner.se:
					if ( checked_square )
						return not_broken; // else would have exited
					else
					{
						var broke = square_broken( grid, rr, cc );
						checked_square = true; // put a fifth piece and this short circuited it ...
						return broke;
					}
				}
			}
			/*var arr = new Array(           CUT when through
				[p.tt, p.tb, p.tt, p.tb, p.s_],
				[p.nw, p.sw, p.wl, p.s_, p.o_],
				[p.ne, p.se, p.wr, p.s_, p.o_],
				[p.tt, p.tb, p.tt, p.tb, p.s_]
			);*/
			// BEGIN parse_grid()
			var failed = true;
			// test that the inner lists are of equal length
			if ( isnt_rectangular(typeCrate.arra) )
			{
				typeCrate.status = true;
				termin.log( " isn't a rectangular input " );
				return typeCrate;
			}
			var checked_square = false; // optimization concession, the others are no good
			var lim = typeCrate.arra.length;
			var c_lim = typeCrate.arra[ 0 ].length; // assuming they are the same
			for ( var ro = 0; ro < lim; ro++ )
			{
				for ( var col = 0; col < c_lim; col++ )
				{
					if ( broken_shape( typeCrate.arra, ro, col ) )
					{
						typeCrate.status = true;
						termin.log( "broken shape @ " + ro + " " + col + " " + corner.str(typeCrate.arra[ro][col]) );
						return typeCrate;
					}
				}
				termin.log( "row " + ro + " done" );
			}
			typeCrate.status = false;
			return typeCrate;
		}
		// BEGIN deserialize_tiles()
		var typeCrate = lex_stream( userInput );
		if ( typeCrate.status ) // failed lex
		{
			typeCrate.status = ( (typeCrate.status) ? "broken" : "okay" );
			return typeCrate; // turned bool to str
		}
		typeCrate = parse_grid( typeCrate );
		typeCrate.status = ( (typeCrate.status) ? "broken" : "okay" );
		return typeCrate;
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

		// debugging style output
		this.dr_bk_txt = function( xC, yC, color, txt )
		{
			var xP = this.c2p( xC );
			var yP = this.c2p( yC );
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
			canv.strokeStyle = background;
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
			canv.rect( 25, 25, this.w+70, this.h+30 );
			//canv.lineWidth = "3";
			canv.fillStyle =background;
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

		this.winner_banner = function()
		{
			canv.fillStyle = "paleturquoise";
			canv.font = "bold 20px monospace";
			canv.fillText( "winner winner", 10,210);//1, 210 );
			canv.fillText( "chicken dinner", 75,240);//100, 240 );
		}

		this.show_moves = function()
		{
			canv.fillStyle = "silver";
			canv.font = "bold 15px monospace";
			canv.fillText( "moves", 255, 260 );
			canv.fillText( moves, 260, 280 );
		}

		this.bad_restore = function()
		{
			canv.fillStyle = "paleturquoise";
			canv.font = "bold 20px monospace";
			canv.fillText( "COULD NOT RESTORE", 40,210);//1, 210 );
		}

		this.c2p = function( coord )
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

		this.cur2p = function( coord )
		{
			return this.c2p( coord ) - 5;
		}
	}

	function save_game()
	{
		//termin.log( ky.str( ky.l) );
		//termin.log( bound.serialize_tiles() );//serialize_tiles() );
		document.getElementById("raw").value = bound.serialize_tiles();
		// alert("sudaved"); // :B
	}

	function restore_game()
	{
		termin.log( "I don't restore correctly yet" );
		var newGrid = bound.deserialize_tiles( document.getElementById("raw").value );
		if ( newGrid.status === "okay" )
		{
			bound.tiles = newGrid.arra;
			if ( bound.tiles[1][3] === corner.nw ) // unless I put that in parse
			{
				document.getElementById("raw").value = "Nice try cheater.";
				return;
			}
			bound.render();
			termin.log( "game restored" );
		}
		else
			pix.bad_restore();
	}
	// BEGIN klotski()
	//var sssave = document.getElementById("save"); // because this scope is closed to the outside world for namespace
	//sssave.addEventListener("onclick", save_game, true);
	var dom_canvas = document.getElementById( "canvas_here" );
	var canv = dom_canvas.getContext( "2d" );
	var isX = true;
	var bound = new Board( 4, 5 );
	var pix = new Screen( 218, 270 );
	var ky = new KeyValues();
	var corner = new Cflag(); // determining shape
	var moves = 0;
	var lastCurs = { x:0, y:0, d:ky.D };
	var background = "#0A0A29";
	bound.test_all();
	bound.render();
	//window.addEventListener( "keydown", arrow_pressed, true ); // ah, false here would cut movement
	window.addEventListener( "keypress", letter_pressed, true ); // won't work with IE < 9, but neither will canvas

}
