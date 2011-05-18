// NOTICE:  © [1999-2001] Adobe Systems Incorporated.  Adobe hereby grants you the rights to 
// reproduce, modify and distribute this file and its contents, not including any fonts, audio // files or raster images included or embedded in or linked to this file, (the "Software"), and
// to grant such rights to other parties subject to the following:  This notice shall be 
// included in any copy of the Software or any portion thereof.  THE SOFTWARE IS PROVIDED TO YOU
// AS-IS, WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO 
// WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NON-INFRINGEMENT.  IN NO 
// EVENT SHALL ADOBE BE LIABLE TO YOU OR ANY OTHER PARTY FOR ANY CLAIM, DAMAGES OR OTHER 
// LIABILITY ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE.

function Matrix()
{
	this.a = 1;
	this.b = 0;
	this.c = 0;
	this.d = 1;
	this.x = 0;
	this.y = 0;
}

function splitParams( str )
{
	var res = new Array();
	var length = str.length;
	var k = 0;
	var i = 0;
	while( k < length )
	{
		var p1 = str.indexOf( " ", k );
		var p2 = str.indexOf( ",", k );
		var p3 = str.indexOf( "\t", k );
		if( p1 < k )
			p1 = length;
		if( p2 < k )
			p2 = length;
		if( p3 < k )
			p3 = length;
		var p = Math.min( p1, Math.min( p2, p3 ) );
		if( p > k )
			res[i++] = str.substring( k, p );
		k = p+1;
	}
	return res;
}

function Matrix_initFromString( str )
{
	this.makeIdentity();
	var k = 0;
	while( true )
	{
		var p = str.indexOf( ")", k ) + 1;
		if( p <= 0 )
			break;
		var m = new Matrix();
		m.parseTransform( str.substr(k,p-k) );
		k = p;
		this.concat( m );
	}	
}

function Matrix_parseTransform( str )
{
	var p = 0;
	var c;
	while( p < str.length && ((c = str.charAt(p)) == " " || c == "\t" || c == "\n" || c == "\r" || c == "," ))
		p++;
	str = str.substr( p );

	var fin = str.indexOf( ")" );
	if( fin <= 0 )
	{
		this.makeIdentity();
		return;
	}
	var k = str.indexOf( "(" );
	var c = str.indexOf( ")" );
	if( k == 6 && str.substring(0,6) == "matrix" )
	{
		var vals = splitParams(str.substring(k+1,c));
		if( vals.length != 6 )
			this.makeIdentity();
		else
		{
			this.a = vals[0] - 0;
			this.b = vals[1] - 0;
			this.c = vals[2] - 0;
			this.d = vals[3] - 0;
			this.x = vals[4] - 0;
			this.y = vals[5] - 0;
		}
	}
	else if( k == 9 && str.substring(0,9) == "translate" )
	{
		var vals = splitParams(str.substring(k+1,c));
		if( vals.length != 2 )
			this.makeIdentity();
		else
		{
			this.a = 1;
			this.b = 0;
			this.c = 0;
			this.d = 1;
			this.x = vals[0] - 0;
			this.y = vals[1] - 0;
		}
	}
	else if( k == 5 && str.substring(0,5) == "scale" )
	{
		var vals = splitParams(str.substring(k+1,c));
		if( vals.length == 1 || vals.length == 2 )
		{
			this.a = vals[0] - 0;
			if( vals.length == 1 )
				this.d = this.a;
			else
				this.d = vals[1] - 0;
			this.b = 0;
			this.c = 0;
			this.x = 0;
			this.y = 0;
		}
		else
			makeIdentity();
	}
	else if( k == 6 && str.substring(0,6) == "rotate" )
	{
		var v = str.substring(k+1,c)*0.017453293;
		this.a = Math.cos(v);
		this.b = Math.sin(v);
		this.c = -this.b;;
		this.d = this.a;
		this.x = 0;
		this.y = 0;
	}
	else if( k == 5 && str.substring(0,5) == "skewX" )
	{
		var v = str.substring(k+1,c)*0.017453293;
		this.a = 1;
		this.b = 0;
		this.c = Math.tan(v);
		this.d = 1;
		this.x = 0;
		this.y = 0;
	}
	else if( k == 5 && str.substring(0,5) == "skewY" )
	{
		var v = str.substring(k+1,c)*0.017453293;
		this.a = 1;
		this.b = Math.tan(v);
		this.c = 0;
		this.d = 1;
		this.x = 0;
		this.y = 0;
	}
	else
		this.makeIndentity();
}

function Matrix_toString()
{
	return "matrix(" + this.a + " " + this.b + " " + this.c + " " + this.d + " " + this.x + " " + this.y + ")";
}

function Matrix_toReadableString()
{
	return "matrix(" + Math.round(this.a*10000)/10000 + " " + Math.round(this.b*10000)/10000 + " " +
                   	Math.round(this.c*10000)/10000 + " " + Math.round(this.d*10000)/10000 + " " + 
		Math.round(this.x*100)/100 + " " + Math.round(this.y*100)/100 + ")";
}

function Matrix_concat( m )
{
	var A = m.a * this.a + m.b * this.c;
	var B = m.a * this.b + m.b * this.d;
	var C = m.c * this.a + m.d * this.c;
	var D = m.c * this.b + m.d * this.d;
	this.x += m.x * this.a + m.y * this.c;
	this.y += m.x * this.b + m.y * this.d;
	this.a = A;
	this.b = B;
	this.c = C;
	this.d = D;
}

function Matrix_concatRight( m )
{
	var A = this.a * m.a + this.b * m.c;
	var B = this.a * m.b + this.b * m.d;
	var C = this.c * m.a + this.d * m.c;
	var D = this.c * m.b + this.d * m.d;
	var X = this.x * m.a + this.y * m.c + m.x;
	var Y = this.x * m.b + this.y * m.d + m.y;
	this.a = A;
	this.b = B;
	this.c = C;
	this.d = D;
	this.x = X;
	this.y = Y;
}

function Matrix_invert()
{
	var detInv = 1 / (this.a * this.d - this.b * this.c);
	var X = (this.y * this.c - this.x * this.d) * detInv;
	this.y = (this.x * this.b - this.y * this.a) * detInv;
	this.x = X;
	var A = this.d * detInv;
	this.d = this.a * detInv;
	this.a = A;
	detInv = -detInv;
	this.b *= detInv;
	this.c *= detInv;
}

function Matrix_translate( x, y )
{
	if( x == null || x == "" )
		x = 0;
	if( y == null || y == "" )
		y = 0;
	this.x += x * this.a + y * this.c;
	this.y += x * this.b + y * this.d;
}

function Matrix_translateRight( x, y )
{
	if( x == null || x == "" )
		x = 0;
	if( y == null || y == "" )
		y = 0;
	this.x += x - 0;
	this.y += y - 0;
}

Matrix.prototype.makeIdentity = Matrix;
Matrix.prototype.initFromString = Matrix_initFromString;
Matrix.prototype.parseTransform = Matrix_parseTransform;
Matrix.prototype.toString = Matrix_toString;
Matrix.prototype.toReadableString = Matrix_toReadableString;
Matrix.prototype.concat = Matrix_concat;
Matrix.prototype.concatRight = Matrix_concatRight;
Matrix.prototype.translate = Matrix_translate;
Matrix.prototype.translateRight = Matrix_translateRight;
Matrix.prototype.invert = Matrix_invert;

function getStringAttribute( obj, name )
{
	if( obj == null )
		return null;
	var res = obj.getAttribute( name );
	if( res != null )
		return res + "";
	else
		return res;
}

function getNumericalAttribute( obj, name, def )
{
	if( obj == null )
		return def;
	var res = obj.getAttribute( name );
	if( res == null || res == "" )
		return def;
	else
		return (res + "") - 0;
}

function totalTransform( e, parent )
{
	if( parent == null )
		parent = e.getOwnerDocument();
	var xform = new Matrix();

	while( e != parent )
	{
		if( e.getNodeType() == 1 )
		{
			var nodeName = e.getNodeName() + "";
			if( nodeName == "svg" )
				xform.translateRight( getNumericalAttribute( e, "x", 0 ), getNumericalAttribute( e, "y", 0 ) );
			else
			{
				var t = getStringAttribute( e, "transform" );
				if( t != "" && t != null )
				{
					var m = new Matrix();
					m.initFromString( t );
					xform.concatRight( m );
				}
			}
		}
		e = e.getParentNode();
	}
	return xform;
}
