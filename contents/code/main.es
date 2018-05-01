/***************************************************************************
 *   Copyright (C) 2008 Matthias Fuchs <mat69@gmx.net>                     *
 *   Copyright (C) 2017-2018 Luca Weiss <luca@z3ntu.xyz>                   *
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

// You can debug the code with "plasmoidviewer -a org.kde.plasma.comic"
// Package: zip -r cyanide_and_happiness.comic contents/code/main.es metadata.desktop icon.png
// Install: kpackagetool5 -i cyanide_and_happiness.comic
// Uninstall: kpackagetool5 -r cyanide_and_happiness

function init() {
    comic.shopUrl = "http://store.explosm.net/";
    comic.isAuthorPerStrip = true;
    comic.firstIdentifier = 15;

    var url = "http://explosm.net/comics/latest";

    comic.requestPage(url, comic.User);
}

function pageRetrieved(id, data) {
    // comic.Page: 0
    // comic.Image: 1
    // comic.User: 2
    print(id);

    //find lastIdentifier
    if (id == comic.User) {
        // Get comic ID from the <meta property="og:url" ... >
        const expLast = new RegExp('property="og:url" content="http://explosm.net/comics/(\\d+)/"');
        const matchLast = expLast.exec(data);
        if (matchLast != null) {
            comic.lastIdentifier = matchLast[1];
            comic.websiteUrl = "http://www.explosm.net/comics/" + comic.identifier + "/";

            comic.requestPage(comic.websiteUrl, comic.Page);
        } else {
            print("Failed to parse comic.lastIdentifier.");
            comic.error();
        }
    }
    if (id == comic.Page) {
        const expImage = new RegExp("src=\"(//files.explosm.net/comics/[^\"]+)\"");
        const matchImage = expImage.exec(data);
        if (matchImage != null) {
            const imageUrl = "http:" + matchImage[1];
            print(imageUrl);
            comic.requestPage(imageUrl, comic.Image);
        } else {
            print("Failed to parse image url.");
            comic.error();
        }

        const expAuthor = new RegExp("author-credit-name\">by ([^<]+)+</small>");
        const matchAuthor = expAuthor.exec(data);
        if (matchAuthor != null) {
            comic.comicAuthor = matchAuthor[1];
        } else {
            print("Failed to parse the author.");
        }

        const expPrev = new RegExp("<a href=\"/comics/(\\d+)/\" class=\"previous-comic");
        const matchPrev = expPrev.exec(data);
        if (matchPrev != null) {
            print("Previous identifier: " + matchPrev[1]);
            comic.previousIdentifier = matchPrev[1];
        } else {
            print("Failed to parse previous identifier.");
        }

        const expNext = new RegExp("<a href=\"/comics/(\\d+)/\" class=\"next-comic");
        const matchNext = expNext.exec(data);
        if (matchNext != null) {
            print("Next identifier: " + matchNext[1]);
            comic.nextIdentifier = matchNext[1];
        } else {
            print("Failed to parse next identifier.");
        }
    }
}
