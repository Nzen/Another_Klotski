
// Nicholas Prado
// a reimplementation of the sliding block puzzle called Klotski
// MIT license as described at http://choosealicense.com/licenses/mit/

/* intended evolution
	~~draw board & pieces~~
	~~draw cursor~~
	~~move cursor with keys~~
	~~move piece according to rules~~
	~~check win condition~~
	~~move cursor with ijkl~~
	tests
	move count? smarter move count?
	solver for hints?
	win sound? piece sounds :? // separate branch?
	draw bounds / blocked detection bar
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
	var isX = true;
	var bound = new Board( 4, 5 );
	var pix = new Screen( 218, 270 );
	var ky = new KeyValues();
	var corner = new Cflag(); // determining shape
	var moves = 0;
	var background = "#0A0A29";
	bound.test_all();
	bound.render();
	//window.addEventListener( "keydown", arrow_pressed, true );
	window.addEventListener( "keypress", letter_pressed, true );

	function arrow_pressed( ev ) // FIX refactor to using ijkl for cursor moves so it doesn't alter a tall/wide page
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

	function letter_pressed( ev )
	{
		var keyPressed = String.fromCharCode( ev.keyCode );
		// cursor & shape
		if ( keyPressed === 'a' )
			bound.try_block( ky.L );
		else if ( keyPressed === 'w' )
			bound.try_block( ky.U );
		else if ( keyPressed === 'd' )
			bound.try_block( ky.R );
		else if ( keyPressed === 's' )
			bound.try_block( ky.D );
		// cursor only
		else if ( keyPressed === 'j' )
			bound.try_cursor( ky.l );
		else if ( keyPressed === 'i' )
			bound.try_cursor( ky.u );
		else if ( keyPressed === 'l' )
			bound.try_cursor( ky.r );
		else if ( keyPressed === 'k' )
			bound.try_cursor( ky.d );
		else
			return; // irrelevant key
	}

	function KeyValues()
	{
		this.l = 37; this.u = 38;
		this.r = 39; this.d = 40;
		this.L = 0; this.U = 1;
		this.R = 2; this.D = 3;

		this.reverse = function( dir )
		{
			if ( dir === this.l || dir === this.L)
				return this.r;
			else if ( dir === this.r || dir === this.R )
				return this.l;
			else if ( dir === this.u || dir === this.U )
				return this.d;
			else if ( dir === this.d || dir === this.D )
				return this.u;
		}
		this.str = function( some )
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
			default:
				return "???";
			}
		}
	}

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
					this.top_corner_dr( currT, xx, yy ); // for clients
					//this.blockwise_dr( currT, xx, yy ); // for testing
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
					return;
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
			function swap_square( dir, prevType ) // fix to dry
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
				default:
					return;//termin.log("wtf?");
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
				var nextType = this.tiles[bound.next_coord(dir, bound.cursor.x, isX)][bound.next_coord(dir, bound.cursor.y, !isX)];
				if ( bound.same_shape( crsType, nextType ) )
				{
					this.apply_cursor_move( dir );
					crsType = nextType;
					this.swap_block( this.cursor.x, this.cursor.y, dir );
					if ( crsType != corner.s_ )
						swap_rest_of_shape( dir, crsType );
					//this.apply_cursor_move( ky.reverse(dir) );
				}
				else
				{
					this.swap_block( this.cursor.x, this.cursor.y, dir );
					if ( crsType != corner.s_ )
						swap_rest_of_shape( dir, crsType );
					this.apply_cursor_move( dir );
				}
				moves++;
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
				return ( typeZ === corner.nw || typeZ === corner.ne || typeZ === corner.sw || typeZ === corner.se );
			case corner.s_:
			default:
				return false;
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
			function topCorner( type, sideCoor, isX )
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
			function redraw( which, cX, cY )
			{
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
				var oldX = bound.cursor.x;
				var oldY = bound.cursor.y;
				bound.cursor.x = 2;
				bound.cursor.y = 2;
				bound.apply_cursor_move( ky.U );
				if ( ! new_cursor_right( 2,1 ) )
					termin.log( "tacm didn't move U" );
				bound.apply_cursor_move( ky.u );
				if ( ! new_cursor_right( 2,0 ) )
					termin.log( "tacm didn't move u" );
				bound.apply_cursor_move( ky.l );
				if ( ! new_cursor_right( 1,0 ) )
					termin.log( "tacm didn't move l" );
				bound.apply_cursor_move( ky.L );
				if ( ! new_cursor_right( 0,0 ) )
					termin.log( "tacm didn't move L" );
				bound.apply_cursor_move( ky.d );
				if ( ! new_cursor_right( 0,1 ) )
					termin.log( "tacm didn't move d" );
				bound.apply_cursor_move( ky.D );
				if ( ! new_cursor_right( 0,2 ) )
					termin.log( "tacm didn't move D" );
				bound.apply_cursor_move( ky.r );
				if ( ! new_cursor_right( 1,2 ) )
					termin.log( "tacm didn't move r" );
				bound.apply_cursor_move( ky.R );
				if ( ! new_cursor_right( 2,2 ) )
					termin.log( "tacm didn't move R" );
				bound.cursor.x = oldX;
				bound.cursor.y = oldY;
			}
			/*grid = new Array(
				[p.tt, p.tb, p.tt, p.tb, p.s_],
				[p.nw, p.sw, p.wl, p.s_, p.o_],
				[p.ne, p.se, p.wr, p.s_, p.o_],
				[p.tt, p.tb, p.tt, p.tb, p.s_]
			);*/
			test_apply_cursor_move();
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
			//canv.rotate( Math.PI * 1.5 );
			canv.fillText( "winner winner", 10,210);//1, 210 );
			canv.fillText( "chicken dinner", 75,240);//100, 240 );
		}

		this.show_moves = function()
		{
			canv.fillStyle = "white";
			canv.font = "bold 15px monospace";
			//canv.rotate( Math.PI * 1.5 );
			canv.fillText( "moves", 255, 260 );
			canv.fillText( moves, 260, 280 );
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