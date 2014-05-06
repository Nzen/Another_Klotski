
// Nicholas Prado
// a reimplementation of the sliding block puzzle called Klotski

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
	//init();
	redraw();

	/* function init()
	{
	} */

	function redraw()
	{
		bound.render();
		//vis_test_blocks();
		//vis_test_bigger();
		return;
	}

	function Cflag()
	{
		this.o_ = 0;
		this.s_ = 1
		this.tt = 12; this.tb = 13;
		this.wl = 24; this.wr = 25;
		this.nw = 36; this.ne = 37; this.sw = 38; this.se = 39;
	}

	function Board( width, depth ) // hm doesn't use wid;depth
	{
		// interpretation order demands this be first :\
		this.fill_board = function()
		{
			var p = new Cflag();
			var grid = new Array(
				[p.tt, p.nw, p.ne, p.tt],
				[p.tb, p.sw, p.se, p.tb],
				[p.tt, p.wl, p.wr, p.tt],
				[p.tb, p.s_, p.s_, p.tb],
				[p.s_, p.o_, p.o_, p.s_]
			);
			return grid;
		}

		// properties
		this.cursor = { x:0, y:0 };
		this.tiles = this.fill_board()

		this.render = function()
		{
			pix.dr_edge();
			pix.dr_goal_area();
			pix.dr_cursor( pix.cur2_p(2), pix.cur2_p(1) );
			this.dr_all_blocks();
		}

		this.dr_all_blocks = function()
		{
			var small = true;
			var p = new Cflag();
			var currT = 0;
			for ( var ro = 0; ro < this.tiles.length; ro++ )
			{
				for ( var cl = 0; cl < this.tiles[ro].length; cl++ )
				{
					currT = this.tiles[ro][cl];
					switch( currT )
					{
					default:
						continue;
					case p.s_:
						pix.dr_block( pix.c2p( cl ), pix.c2p( ro ), small, small, "purple" )
						break;
					
					case p.tt:
						pix.dr_block( pix.c2p( cl ), pix.c2p( ro ), small, !small, "green" )
						break;
					case p.wl:
						pix.dr_block( pix.c2p( cl ), pix.c2p( ro ), !small, small, "blue" )
						break;
					case p.nw:
						pix.dr_block( pix.c2p( cl ), pix.c2p( ro ), !small, !small, "red" )
					}
				}
			}
		}
	}

	function Screen( width, height )
	{
		this.w = width; // probably don't need these
		this.h = height;

		this.dr_block = function( x_p, y_p, x_small, y_small, color )
		{
			var defaultSide = 40;
			var x_l = ( x_small ) ? defaultSide : defaultSide * 2 + 11;
			var y_l = ( y_small ) ? defaultSide : defaultSide * 2 + 11;
			canv.beginPath();
			canv.rect( x_p, y_p, x_l, y_l ); // x y
			canv.lineWidth = "3";
			//canv.strokeStyle = color;
			canv.fillStyle = color;
			canv.fill();
		}

		this.dr_cursor = function( xP, yP )
		{
			var defaultSide = 49;
			canv.beginPath();
			canv.rect( xP, yP, defaultSide, defaultSide ); // x y
			canv.lineWidth = "2";
			canv.strokeStyle = "cyan";
			canv.stroke();
		}

		this.dr_edge = function()
		{
			// background-color:#0A0A29;
			canv.beginPath();
			canv.rect( 25, 25, 218, 270 ); // x y
			canv.lineWidth="2";
			canv.strokeStyle="grey";
			canv.stroke();
		}
		
		this.dr_gline = function( sX, sY, eX, eY )
		{
			canv.beginPath();
			canv.lineWidth="1";
			canv.strokeStyle="red";
			canv.moveTo(sX, sY);
			canv.lineTo(eX, eY);
			canv.stroke();
		}

		this.dr_goal_area = function()
		{
			// lower triangle
			var eX = 179;
			var sY = 282;
			var eY = 191;
			for ( sX = 88; sX < eX; sX += 10 )
			{
				this.dr_gline( sX, sY, eX, eY );
				eY += 10;
			}
			// upper triangle
			sX = 88;
			sY = 270;
			eY = 191;
			for ( eX = 169; sX < eX; eX -= 10 )
			{
				this.dr_gline( sX, sY, eX, eY );
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
		
		this.cur2_p = function( coord )
		{
			return this.c2p( coord ) - 5;
		}
	}

}







