# WikiTableOfContentsJS
The WikiTableOfContentsJS widget is a js widget that creates individual Table-of-contents on the fly.
It does that by analyzing the HTML Code of your site and calculating the table of content, according to your headers.

# Features
- Headings get their chapternumbers written into their texts automatically.
- To long heading texts get automatically cut in the table of contents.
- The entries in the toc get html-title-attributes with their text so even when the name is to long there is still a way to read it.
- Every heading beneath h1 in default non-displayed and can be displayed by the user with one click.
- Automatically updates Chapternumbers when a new heading is added anywhere.
- Different Styles for the toc available.

# How to use it
To use the WikiTableOfContentsJS-widget, just add the wanted Files to your code, and make some slight changes to your code.

## Step 1. Download the widget
Download the widget from its original GitHub-Repository.

## Step 2. Add the JS File to your source-code
Choose the version, you want to use and load its File into your Code with:
```
<script src="WikiTableOfContentsJS.js"></script>
```
You can choose between the different versions:

- "WikiTableOfContentsJS - lenient.js": The code uses every heading.
- "WikiTableOfContentsJS - strict.js": The code uses only headings that have the class toc-heading.
- "WikiTableOfContentsJS - lenient.min.js": The lenient version but minified.
- "WikiTableOfContentsJS - strict.min.js": The strict version but minified.

## Step 3. Add the CSS File to your source-code
Choose the version, you want to use and load its File into your Code with:
```
<link rel="stylesheet" href="WikiTableOfContentsJS.css">
```
You can choose between the different versions:

- "WikiTableOfContentsJS.css": The normal readable style
- "WikiTableOfContentsJS.min.css": The minified style

## Step 4. Add a bit of customized code
### Create the toc-container
Add the div into your file where you want the table of content to be loaded.

Do this by adding the following code to that position:
```
<div class="toc list-with-sublist toc-light-theme"></div>
```
You can use eighter the light themed toc by using the class `toc-light-theme` or you can use the dark theme with the class `toc-dark-theme`.
If none of them is to your liking you can create your own class with the attributes `background-color`, `border-color` and `color` to customice the color-theme to your needs.

You can also give the toc a fixed width. for that add one of these classes to the toc-div:
`toc-dimensions-default`, `toc-dimensions-30-percent`, `toc-dimensions-50-percent` or `toc-dimensions-100-percent`.
Of course you can make your customized class for the dimensions which you can also make responsive.

### Adjust the headings
If you chose the strict version you have to add the class `toc-heading` to each header you want to use.

### Call the toc-creation
After your toc-container is ready, use the following code to start the toc creation at site-load:
```
<script>
    window.onload = function () {
        goThroughHeadings();
    }
</script>
```
Of course you can start the `goThroughHeadings()` function any other way as well.

# Different Styles
The toc has two possible styles:
- Dark-Theme: `#141414`
- Light-Theme: `#f9f9f9`

# Problem avoidance
Consider the following points so you make sure not to run into some known problems.

## Long headings
When your heading texts are to long, normaly that's no problem because in the toc we cut them and add a ... at the end while the user can hover the heading in the toc to see the full text.
But the problem lies where your h1 title is to long. When it is long enough to get cut there will be no extention plus for that heading. So the user can't see the headings beneath it.

## Forgetting the headingclass
If you use the strict version of the js file, don't forget to add the class `toc-heading` to the headings you want to show in the table of content.

## Wrong heading hierachy
If you use a wrong hierachy of headings the system will break. For example if you use `h1, h3, h6, h4` in that order, the widget will not work correctly.
Remember, that you have to go one-by-one when the numbers get larger.
On the other hand you can use `h1, h2, h3, h4, h5, h2, h3, h1`



