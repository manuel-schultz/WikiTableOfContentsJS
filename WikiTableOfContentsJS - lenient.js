/**
 * Function to return every heading from H1 to H6 with the strict-class.
 * @returns {NodeList}
 */
function getAllHeadings() {
    return document.querySelectorAll( 'h1, h2, h3, h4, h5, h6' );
}

/**
 * Function to receive a heading and return the heading that is the one before,
 * hierachy is unimportent. When the given heading is the first one, the
 * function returns null instead.
 * @param {object} heading An object representing the heading
 * @returns {object|null}
 */
function getHeadingBefore( heading ) {
    let allHeadings = Array.from( getAllHeadings() );
    index = allHeadings.indexOf( heading );

    if ( index >= 1 ) {
        return allHeadings[index - 1];
    } else {
        return null;
    }
}

/**
 * Function to take the chapternumber from the headings dataset and 
 * write it before the headings text. This has nothing to do
 * with the toc. The function doesn't clear the number before,
 * so don't call this function multiple times.
 * @param {object} heading The heading-object you want to edit
 * @returns {undefined}
 */
function displayChapterNumber( heading ) {
    heading.innerText = heading.dataset.number + " " + heading.innerText;
}

/**
 * Function to add a single entry in the toc container for one heading.
 * @param {object} heading The heading-object that should be written into toc
 * @returns {undefined}
 */
function displayChapterInTOC( heading ) {
    let toc = document.getElementsByClassName( 'list-with-sublist' )[0];

    // Decide if it is a H1 or not and prepare parts for the HTML accordingly.
    if ( heading.tagName[1] === '1' ) {
        var expander = '<b class=\'toc-expand-chapter\' onclick=\'tocExpandChapter(this)\'>+</b>';
        var mainChapter = '';
        var displayClass = '';
    } else {
        var expander = '';
        var mainChapter = heading.dataset.number.split( '.' )[0];
        var displayClass = 'non-displayed-toc-chapter';
    }

    // Getting rid of all the singlequotes and doublequotes.
    sanitizedTitle = heading.dataset.title.replaceAll("'", "&apos;").replaceAll("\"", "&quot;");

    // Write HTML line to the table of SVGTextContentElement.
    toc.innerHTML += "<div class='toc-chapter toc-h" + heading.tagName[1] + " " + displayClass + "' data-mainChapter='" + mainChapter + "\'>" +
        "<span class='toc-chapter-number'>" + heading.dataset.number + "</span>" +
        "<a class='toc-move-to-header' title='" + sanitizedTitle + "' onclick='tocGoTo( this )'>" + heading.dataset.title + "</a>" +
        expander +
        "</div>";
}

/**
 * Function to go through the headings on the site and manipulate them
 * so they are ready for the toc. Then write them one by one
 * to the toc. The function doesn't clear the toc before, 
 * so don't call this function multiple times.
 * @returns {undefined}
 */
function goThroughHeadings() {
    // Go through each and every heading on this site.
    Array.from( getAllHeadings() ).forEach( ( heading, index ) => {
        // Get the headings chapternumber.
        let chapternumber = calculateChapterNumber( heading, index );
        
        // Write the chapternumber and the headingname into the headings dataset.
        heading.dataset.number = chapternumber;
        heading.dataset.title = heading.innerText;

        // Write the chapternumber at the beginning of the heading. 
        displayChapterNumber( heading );

        // Insert the heading into the table of content.
        displayChapterInTOC( heading );
    });
    displayChapterTocExpander();
}

/**
 * Function to calculate the chapternumber for one heading to get the hierachy right.
 * 
 * @param {object} heading The heading object we want the number from.
 * @param {int} index The number of times we already went through one heading.
 * @returns {string} The chapternumber of the heading like "7.18.4"
 */
function calculateChapterNumber( heading, index ) {
    // Get the heading right before this one.
    let formerheading = getHeadingBefore( heading );
    let number = '';

    // If there is no heading before this one, we know, that the number must be "1".
    if ( formerheading === null ) {
        number = '1';
    }
    // If the heading before this one is hierachicly the same as this one ...
    else if ( formerheading.tagName === heading.tagName ) {
        //  ... we add one to the last number of the heading before to get the number for this heading.
        let numbers = formerheading.dataset.number.split( '.' );
        numbers = numbers.map( el => parseInt( el ) );
        numbers[numbers.length - 1] += 1;
        number = numbers.join( '.' );
    }
    // If the heading before this one is hierachicly above this one ...
    else if ( parseInt( formerheading.tagName.charAt( 1 ) ) < parseInt( heading.tagName.charAt( 1 ) ) ) {
        // ... this one is the first underlying heading so it gets the number of the one before it plus an additional 1 at the end.
        number = formerheading.dataset.number + '.1';
    }
    // If the heading before this one is hierachicly beneath this one ...
    else if ( parseInt( formerheading.tagName.charAt( 1 ) ) > parseInt( heading.tagName.charAt( 1 ) ) ) {
        //  ... we need to find the last heading that was the same levellike this one and add 1 to its last number.

        // Find the last heading, that is hierachicaly equal to this heading. 
        let allHeadings = Array.from( getAllHeadings() );
        let allHeadingsBefore = allHeadings.slice( 0, index );
        let indexOfLastEqualHeading = allHeadingsBefore.map( el => el.tagName ).lastIndexOf( heading.tagName );

        // Add one to the last digit
        let numbers = allHeadings[indexOfLastEqualHeading].dataset.number.split( '.' );
        numbers = numbers.map( el => parseInt( el ) );
        numbers[numbers.length - 1] += 1;
        number = numbers.join( '.' );
    }

    // In case the number has a dot at the end, remove it.
    if ( number[0] === '.' ) {
        number = number.substring( 1 );
    }

    // Return the chapternumber string
    return number;
}

/**
 * Function to hide all expander pluses where there are  no headings beneath that h1.
 * @returns {undefined}
 */
function displayChapterTocExpander() {
    // Go through each expanderPlus for every H1 ...
    Array.from( document.getElementsByClassName( 'toc-expand-chapter' ) ).map( function ( plusTag ) {
        let h1Number = plusTag.parentElement.children[0].innerText;
        let headingsBeneath = document.querySelectorAll( ".toc-chapter[data-mainChapter='" + h1Number + "']" );
        
        // ... and if it has no headings beneath it, hide the plus sign.
        if ( headingsBeneath.length === 0 ) {
            plusTag.style.display = 'none';
        }
    });
}

/**
 * Function to let user go to the heading when he clicks on it in the toc.
 * @param {object} link The "a"-tag that was clicked
 * @returns {undefined}
 */
function tocGoTo( link ) {
    // Get the distance from the top in pixels.
    let dataNumberQuery = "[data-number='" + link.previousElementSibling.innerText + "']";
    let topPosition = parseInt( document.querySelectorAll( dataNumberQuery )[0].offsetTop );

    // Scroll the distance from the top.
    window.scrollTo({
        top: topPosition,
        behavior: 'smooth'
    });
}


/**
 * Function to show or hide the headings beneath a h1 in the toc when the expander is clicked.
 * @param {object} expander The expender-tag that is eighter a plus or minus
 * @returns {undefined}
 */
function tocExpandChapter( expander ) {
    let h1Number = expander.parentElement.children[0].innerText;
    let tocLineQuery = ".toc-chapter[data-mainChapter='" + h1Number + "']";
    let tocHeadingsBeneath = Array.from( document.querySelectorAll( tocLineQuery ) )

    if ( expander.innerText === '+' ) {
        tocHeadingsBeneath.map( x => x.classList.add( 'displayed-toc-chapter' ) );
        tocHeadingsBeneath.map( x => x.classList.remove( 'non-displayed-toc-chapter' ) );
        expander.innerText = '-';
    } else if ( expander.innerText === '-' ) {
        tocHeadingsBeneath.map( x => x.classList.remove( 'displayed-toc-chapter' ) );
        tocHeadingsBeneath.map( x => x.classList.add( 'non-displayed-toc-chapter' ) );
        expander.innerText = '+';
    }
}