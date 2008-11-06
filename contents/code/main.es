/***************************************************************************
 *   Copyright (C) 2008 Matthias Fuchs <mat69@gmx.net>                     *
 *                                                                         *
 *   This program is free software; you can redistribute it and/or modify  *
 *   it under the terms of the GNU General Public License as published by  *
 *   the Free Software Foundation; either version 2 of the License, or     *
 *   (at your option) any later version.                                   *
 *                                                                         *
 *   This program is distributed in the hope that it will be useful,       *
 *   but WITHOUT ANY WARRANTY; without even the implied warranty of        *
 *   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the         *
 *   GNU General Public License for more details.                          *
 *                                                                         *
 *   You should have received a copy of the GNU General Public License     *
 *   along with this program; if not, write to the                         *
 *   Free Software Foundation, Inc.,                                       *
 *   51 Franklin Street, Fifth Floor, Boston, MA  02110-1301  USA .        *
 ***************************************************************************/

function init()
{
    comic.isAuthorPerStrip = true;
    comic.firstIdentifier = 15;

    var url = "http://www.explosm.net/comics/new/";

    comic.requestPage( url, comic.User );
}

function pageRetrieved( id, data ) {
    //find lastIdentifier
    if ( id == comic.User ) {
        const expLast = new RegExp( "URL=\"http://www.explosm.net/comics/(\\d+)/\"" );
        const matchLast = expLast.exec( data );
        if ( matchLast != null ) {
            comic.lastIdentifier = matchLast[1];
            comic.websiteUrl = "http://www.explosm.net/comics/" + comic.identifier + "/";
            comic.requestPage( comic.websiteUrl, comic.Page );
        } else {
            comic.error();
        }
    }
    if ( id == comic.Page ) {
        const expImage = new RegExp( "src=\"(http://www.explosm.net/db/files/[^\"]+)\"" );
        const matchImage = expImage.exec( data );
        if ( matchImage != null ) {
            comic.requestPage( matchImage[1], comic.Image );
        } else {
            comic.error();
        }

        const expAuthor = new RegExp( "<b>by <a href=\"[^\"]+\">([^<]+)</a></b>" );
        const matchAuthor = expAuthor.exec( data );
        if ( matchAuthor != null ) {
            var authors = new Array();
            authors[ "Dave" ] = "Dave McElfatrick";
            authors[ "Kris" ] = "Kris Wilson";
            authors[ "Matt" ] = "Matt Melvin";
            authors[ "Rob" ] = "Rob DenBleyker";
            comic.comicAuthor = authors[ matchAuthor[1] ];
        }

        const expPrev = new RegExp( "<a href=\"/comics/(\\d+)/\">< Previous</a>" );
        const matchPrev = expPrev.exec( data );
        if ( matchPrev != null ) {
            comic.previousIdentifier = matchPrev[1];
        }

        const expNext = new RegExp( "<a href=\"/comics/(\\d+)/\">Next ></a>" );
        const matchNext = expNext.exec( data );
        if ( matchNext != null ) {
            comic.nextIdentifier = matchNext[1];
        }
    }
}
