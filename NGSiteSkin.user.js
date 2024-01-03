// ==UserScript==
// @name         Newgrounds Site Skin Swapper
// @namespace    http://tampermonkey.net/
// @version      3.2.1
// @description  Lets you change the Newgrounds site skin to whatever you want
// @author       sebulant
// @match        https://www.newgrounds.com/*
// @icon         https://www.google.com/s2/favicons?sz=256&domain=newgrounds.com
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_listValues
// @grant        GM_deleteValue
// @grant        GM_addStyle
// @run-at       document-start
// @require      https://cdn.jsdelivr.net/npm/jszip@3.6.0/dist/jszip.min.js
// ==/UserScript==

(function() {
    'use strict';

    // List of all the backgrounds used by newgrounds since the newest layout
    var backgrounds = [
    	{name: "- Default -", url: "", artist: ""},
    	{name: "A Long Way Home", url: "https://img.ngfiles.com/themes/000/skin-keepwalking-longwayh.jpg?1598384315", artist: "keepwalking"},
    	{name: "Alien Hominid HD", url: "https://img.ngfiles.com/themes/000/206d33761698702672.webp?1698702703", artist: "Behemoth"},
    	{name: "Bad Dream Animation Jam", url: "https://img.ngfiles.com/bg-skins/skin-baddreamjam.jpg", artist: "FuShark"},
    	{name: "Barrier City - Night", url: "https://img.ngfiles.com/themes/000/skin-kamikaye-barriercit.webp?1622294779", artist: "Kamikaye"},
    	{name: "Before The Mission", url: "https://img.ngfiles.com/themes/000/lde-newgrounds-skin-1.png?1629466511", artist: "Ioruko"},
    	{name: "Boxcar City Rush", url: "https://img.ngfiles.com/themes/000/7cc4f37a1673005939.webp?1673005954", artist: "GENC"},
    	{name: "BrokenSketch", url: "https://img.ngfiles.com/themes/000/skin-brokensketch-webp.webp?1636118879", artist: "BrokenSketch"},
    	{name: "Christmas 2020", url: "https://img.ngfiles.com/themes/000/skin-shamfoo-winter2020.jpg?1607280335", artist: "Shamfoo"},
    	{name: "Christmas 2022", url: "https://img.ngfiles.com/themes/000/image.webp?1670353319", artist: "PhantomArcade"}, // Love the file name on this one
        {name: "Christmas 2023", url: "https://img.ngfiles.com/themes/000/71684ad81702124330.webp?1702124351", artist: "Casanova"},
    	{name: "Clock Day 2020", url: "https://img.ngfiles.com/themes/000/skin-clockday2020.jpg?1596721325", artist: "SuccubusClock"},
    	{name: "Clock Day 2021", url: "https://img.ngfiles.com/themes/000/clockday-ng-skin-4.webp?1629048433", artist: "Topcatyo"},
    	{name: "Clock Day 2023", url: "https://img.ngfiles.com/themes/000/70588c641692024176.webp?1692024178", artist: "ClockCrew"},
    	{name: "Dankmen April Fools", url: "https://img.ngfiles.com/themes/000/dankmen-webp.webp?1648729643", artist: "Potatoman"},
    	{name: "Evangelion Collab", url: "https://img.ngfiles.com/themes/000/skin-evacollab.webp?1647287392", artist: "arkoirisangel"},
    	{name: "Everything By Everyone", url: "https://img.ngfiles.com/themes/000/skin-cortat-g-2-webp.webp?1635948385", artist: "CorTat-G"},
    	{name: "Fall 2022", url: "https://img.ngfiles.com/themes/000/skin-fall2022-resized-ir.webp?1662735576", artist: "Irischroma"},
    	{name: "Final Fantasy 7 Collab", url: "https://img.ngfiles.com/themes/000/skin-ff7collab.jpg?1599671200", artist: ""},
    	{name: "FNF Animation Contest", url: "https://img.ngfiles.com/themes/000/skin-funkin-cardbordtoast.jpg?1605135609", artist: "Cardbordtoaster"},
    	{name: "FNF Week 7", url: "https://img.ngfiles.com/themes/000/tankmen-md00dles-fixed.webp?1619718076", artist: "MD00dles"},
    	{name: "Gone Fishin'", url: "https://img.ngfiles.com/themes/000/skin-gris9.jpg?1591116061", artist: "GRIS9"},
    	{name: "Halloween 2018", url: "https://img.ngfiles.com/bg-skins/2018/Halloween2018-MisMash-Desat.jpg", artist: "MisMash"},
    	{name: "Halloween 2019", url: "https://img.ngfiles.com/themes/000/halloween2019-vongrimswor.jpg?1569862128", artist: "VonKreepula"},
    	{name: "Halloween 2020", url: "https://img.ngfiles.com/themes/000/skin-halloween2020-ashley.jpg?1599932541", artist: "zombi3guts"},
    	{name: "Halloween 2021", url: "https://img.ngfiles.com/themes/000/halloween2021-vongrimswo.webp?1633116248", artist: "VonKreepula"},
    	{name: "Halloween 2022", url: "https://img.ngfiles.com/themes/000/skin-halloween2022-vongr.webp?1663636150", artist: "VonKreepula"},
    	{name: "Halloween 2023", url: "https://img.ngfiles.com/themes/000/3aae7ea81692620421.webp?1692620478", artist: "VonKreepula"},
    	{name: "Ikualdena", url: "https://img.ngfiles.com/themes/000/newgrounds-ikualdena-sit.webp?1627475138", artist: "Ikualdena"},
    	{name: "Madness Day 2019", url: "https://img.ngfiles.com/themes/000/skin-madnessday2019b.jpg?1569111848", artist: "deathink"},
    	{name: "Madness Day 2020", url: "https://img.ngfiles.com/themes/000/skin-madnessday2020.jpg?1600719860", artist: "Krinkels"},
    	{name: "Madness Day 2021 (AmOddysey)", url: "https://img.ngfiles.com/themes/000/img-2551-1.webp?1631992160", artist: "AmOddysey"},
    	{name: "Madness Day 2021 (DeimosArt)", url: "https://img.ngfiles.com/themes/000/skin-madness-deimos.webp?1632141203", artist: "DeimosArt"},
    	{name: "Madness Day 2021 (DeVillefort)", url: "https://img.ngfiles.com/themes/000/devillefort-cover-11.webp?1632250889", artist: "DeVillefort"},
    	{name: "Madness Day 2021 (GlitchArtTV)", url: "https://img.ngfiles.com/themes/000/madnessday2021-glitchart.webp?1631628005", artist: "GlitchArtTV"},
    	{name: "Madness Day 2021 (KitsuneYuki476)", url: "https://img.ngfiles.com/themes/000/skin-2021-madnessday-ren.webp?1632246261", artist: "KitsuneYuki476"},
    	{name: "Madness Day 2022", url: "https://img.ngfiles.com/themes/000/madnessday2022-deimosart.webp?1663793370", artist: "DeimosArt"},
    	{name: "Madness Day 2023", url: "https://img.ngfiles.com/themes/000/e2cb01b61693679269.webp?1693679296", artist: "DeimosArt"},
    	{name: "MLeth", url: "https://img.ngfiles.com/bg-skins/skin-mleth-2018.jpg", artist: "MLeth"},
    	{name: "New Years 2023", url: "https://img.ngfiles.com/themes/000/c5baaba01672545346.webp?1672545372", artist: "EverythingGarbo"},
    	{name: "Newgrounds Audio Deathmatch 2019", url: "https://img.ngfiles.com/themes/000/audiodeathmatch2019.jpg?1559768840", artist: "Troisnyx"},
    	{name: "Nightmare Cops Teaser", url: "https://img.ngfiles.com/bg-skins/nightmare-cops-1.jpg", artist: "JohnnyUtah"},
    	{name: "Peter The Ant Day 2021", url: "https://img.ngfiles.com/themes/000/siteskin.webp?1640008643", artist: "plufmot"},
    	{name: "Pico Day 2018", url: "https://img.ngfiles.com/bg-skins/picoday2018-new.jpg", artist: "Ephyse"},
    	{name: "Pico Day 2019", url: "https://img.ngfiles.com/themes/000/ng-skin-pico-day-2019-fin.jpg?1557411671", artist: "Dreaminerryday"},
    	{name: "Pico Day 2021", url: "https://img.ngfiles.com/themes/000/pico-day-2021-skin-slyve.webp?1618354121", artist: "cynicallysly"},
    	{name: "Pico Day 2022", url: "https://img.ngfiles.com/themes/000/picoday2022-webp.webp?1654914956", artist: "Potatoman"},
    	{name: "Pico Day 2023", url: "https://img.ngfiles.com/themes/000/01c01c641683377427.webp?1683377450", artist: "IvanAlmighty"},
    	{name: "Piconjo Day 2021", url: "https://img.ngfiles.com/themes/000/piconjodayskin-2021-big.webp?1623236501", artist: "Piconjo"},
    	{name: "Pixel Day 2019", url: "https://img.ngfiles.com/themes/000/skin-pixelday-2019-4.png?1548775735", artist: "moawling"},
    	{name: "Pixel Day 2020", url: "https://img.ngfiles.com/themes/000/pixel-day-2020-site-skin.png?1579777696", artist: "moawling"},
    	{name: "Pixel Day 2021", url: "https://img.ngfiles.com/themes/000/pixelday2021-sorapoi-size.png?1610318192", artist: "Sorapoi"},
    	{name: "Pixel Day 2022", url: "https://img.ngfiles.com/themes/000/pixelday2022-png.png?1642619493", artist: "JohnnyUtah"},
    	{name: "Pixel Day 2023", url: "https://img.ngfiles.com/themes/000/6a213e101674426277.png?1674426329", artist: "moawling"},
    	{name: "Robot Day 2019", url: "https://img.ngfiles.com/themes/000/skin-robotday2019-thepsyc.jpg?1566843215", artist: "ThePsychoSheep"},
    	{name: "Robot Day 2020", url: "https://img.ngfiles.com/themes/000/skin-robotday-keepwalking.jpg?1598383355", artist: "keepwalking"},
    	{name: "Robot Day 2023", url: "https://img.ngfiles.com/themes/000/d8c1b1ab1692708936.webp?1692708964", artist: "CaioAdriel2006"},
    	{name: "Shamfoo", url: "https://img.ngfiles.com/themes/000/skin-shamfooowinter.jpg?1607280259", artist: "Shamfoo"},
    	{name: "Smash Bros Collab", url: "https://img.ngfiles.com/bg-skins/2018/skin-smashcollab.jpg", artist: ""},
    	{name: "Spring 2020", url: "https://img.ngfiles.com/themes/000/skin-sabtastic2020.jpg?1585862149", artist: "Sabtastic"},
    	{name: "Summer 2019", url: "https://img.ngfiles.com/themes/000/matthewlopz-summer2019-2.jpg?1560794387", artist: "MatthewLopz"},
    	{name: "Talking Pet Animation Jam", url: "https://img.ngfiles.com/themes/000/skin-petjam-desaturated.jpg?1589203518", artist: "DreaminErryDay"},
    	{name: "TSIOQUE", url: "https://img.ngfiles.com/bg-skins/tsioque3.jpg", artist: "Sarkazm"},
        {name: "Winter 2024", url: "https://img.ngfiles.com/themes/000/5017db751704288916.webp?1704288924", artist: "PKettles"}
    ];

	// List of all themes that can be used on user profiles
	var themes = [
        {colour: "#ff0000", visited: "#990000", hover: "#fff", hue: "-39.25", saturate: "500", brightness: "96"},
        {colour: "#ff2200", visited: "#c7151e", hover: "#fff", hue: "-41.5", saturate: "500", brightness: "117"},
        {colour: "#ff5500", visited: "#cc4400", hover: "#fff", hue: "-34.25", saturate: "339", brightness: "107"},
        {colour: "#fda238", visited: "#d36c36", hover: "#fff", hue: "0", saturate: "100", brightness: "100"}, // this is just the default site theme
        {colour: "#ffcc00", visited: "#e29500", hover: "#fff", hue: "16.75", saturate: "179", brightness: "119"},
        {colour: "#ffee00", visited: "#deb144", hover: "#fff", hue: "18.75", saturate: "116", brightness: "134"},
        {colour: "#d6fd42", visited: "#add417", hover: "#fff", hue: "49.5", saturate: "100", brightness: "162"},
        {colour: "#93fd39", visited: "#66d20a", hover: "#fff", hue: "64", saturate: "93", brightness: "154"},
        {colour: "#39fc60", visited: "#06c02b", hover: "#fff", hue: "72.75", saturate: "68", brightness: "126"},
        {colour: "#36f6fb", visited: "#13c3c8", hover: "#fff", hue: "-180", saturate: "103", brightness: "135"},
        {colour: "#0080a1", visited: "#005e75", hover: "#fff", hue: "163.25", saturate: "68", brightness: "101"},
        {colour: "#3bb4fd", visited: "#1995e0", hover: "#fff", hue: "-180", saturate: "109", brightness: "108"},
        {colour: "#3994fd", visited: "#165eb2", hover: "#fff", hue: "-168.25", saturate: "153", brightness: "92"},
        {colour: "#3872fd", visited: "#2254c9", hover: "#fff", hue: "-156", saturate: "500", brightness: "109"},
        {colour: "#9944ff", visited: "#9900ff", hover: "#fff", hue: "-149.5", saturate: "466", brightness: "107"},
        {colour: "#e239f8", visited: "#ac26be", hover: "#fff", hue: "-115.25", saturate: "315", brightness: "109"},
        {colour: "#ff33aa", visited: "#cc2277", hover: "#fff", hue: "-49.75", saturate: "390", brightness: "118"},
        {colour: "#f6a3cf", visited: "#e66fb3", hover: "#fff", hue: "-65", saturate: "58", brightness: "114"},
        {colour: "#ff0077", visited: "#cc0055", hover: "#fff", hue: "-49", saturate: "500", brightness: "124"},
        {colour: "#ff477b", visited: "#b4224b", hover: "#fff", hue: "-47.75", saturate: "286", brightness: "96"},
        {colour: "#bbbbbb", visited: "#777777", hover: "#fff", hue: "-29", saturate: "0", brightness: "111"}
    ];

    // List containing all the users site skin presets
    if (GM_getValue("sitePresets") == undefined) GM_setValue("sitePresets", [{name: "Default", url: "", fade: "", theme: -1, opacity: 255, resize: false, pixel: false}]); // If no presets are saved create default one
    var skinPresets = GM_getValue("sitePresets");

	// How colour should be spelled in the settings UI. 
    var colour = GM_getValue("britishEnglish") ? "colour" : "color";
    var Colour = GM_getValue("britishEnglish") ? "Colour" : "Color";

    // Popups
    var popup; // Variable that holds current popup (advanced settings or preset manager)
    var popupActive = false;

    // Default background image url. This changes to what the current default site background is once the page loads, but as a fallback it is Pico Day 2023's skin
    var defaultSkinURL = "https://img.ngfiles.com/themes/000/01c01c641683377427.webp?1683377450";

    // Default background fade colour.
    const defaultFadeColour = "#22252a";

    // Load in the users chosen site skin
    // Since this is being called before the page loads everything here is given a !important rule
    // This prevents Newgrounds' default CSS from completely overwriting this script's custom CSS styles
	// Background
	var loadCustomBackground = false;
    if (GM_getValue("customSkinURL") != undefined && GM_getValue("customSkinURL") != "") {
    	loadCustomBackground = true;
	    GM_addStyle(`
	    	.background {
	    		background-image: url(${GM_getValue("customSkinURL")}) !important;
	    	}
	    	.background img {
	    		height: auto !important;
	    	}
	    `);
    }

    // Background Fade Colour
    if (GM_getValue("customFadeColour") != "" && GM_getValue("customFadeColour") != undefined) { // Checking if the user has a custom skin set
        changeFadeColour(GM_getValue("customFadeColour")); // Change skin to custom one
    }

    // Background Resize
    if (GM_getValue("backgroundResize")) changeSkinResize(true);

    // Background Aliasing
    if (GM_getValue("pixelScaling")) changePixelScaling(true);

	// Colour Theme
    if (GM_getValue("customThemeId") >= 0) changeTheme(themes[GM_getValue("customThemeId")]);
    else if (GM_getValue("customThemeId") == -2) changeTheme(themes[Math.floor(Math.random() * themes.length)]);
    else if (GM_getValue("customThemeId") == -3 && GM_getValue("customThemeColour") != undefined) changeTheme(GM_getValue("customThemeColour"));

	// Site Opacity
	if (GM_getValue("siteOpacity") < 255) { changeOpacity(GM_getValue("siteOpacity")); }

    // Light mode
    if (GM_getValue("lightmode") == true) lightMode();

    // Code in here runs after the page has loaded
    document.addEventListener("DOMContentLoaded", function(event){
        // Check if background is on page
  		if (document.getElementsByClassName("background")[0].childNodes[0] != undefined) {
            // Get default background image URL
            defaultSkinURL = document.getElementsByClassName("background")[0].childNodes[0].src;

            // Check if the site theme has changed
            if (document.getElementsByClassName("background")[0].childNodes[0].src != GM_getValue("lastDefaultSkinURL")) {
                // Reset currently saved site skin variables
                resetCurrentSkin();
                // Refresh the page so the skin updates. Yes this is annoying but changing the styles immediately doesn't work for some reason.
                location.reload();
            }

            // Update last seen background image URL, this is so the skin can reset when it changes if the user wants
            GM_setValue("lastDefaultSkinURL", defaultSkinURL);

            // Extra change related to background images so that it scales properly
            if (loadCustomBackground) {
                document.getElementsByClassName("background")[0].childNodes[0].src = GM_getValue("customSkinURL");
            }
  		}

        // Loading the colour theme for a second time cause sometimes it doesn't work the first time lol
        if (GM_getValue("customThemeId") >= 0) changeTheme(themes[GM_getValue("customThemeId")]);
        else if (GM_getValue("customThemeId") == -2) changeTheme(themes[Math.floor(Math.random() * themes.length)]);
        else if (GM_getValue("customThemeId") == -3 && GM_getValue("customThemeColour") != undefined) changeTheme(GM_getValue("customThemeColour"));

	    // Account settings page, for changing the custom site skin
        if (document.URL == "https://www.newgrounds.com/account" || document.URL == "https://www.newgrounds.com/account#") {
            // Create settings page
            let settingsPage = document.createElement("div");
            settingsPage.innerHTML = `
                <h4 class="highlight">Site Customization</h4>
                <div class="fixed-form">
                    <div class="form-row no-break thin-row">
                        <label>Site Background</label>
                        <div class="select-wrapper">
                            <select id="skindropdown"></select>
                        </div>
                        <span>Choose a background from a list of previously used ones.</span>
                    </div>
                    <div class="form-row no-break thin-row">
                        <label id="skinartist-label" style="font-size:10px;padding-top:0px;"></label>
                        <input type="url" placeholder="URL" id="skinurl">
                        <span>Enter a URL to an image.</span>
                    </div>
                    <div class="form-row no-break thin-row">
                        <label></label>
                        <button id="skinurl-button">Submit URL</button>
                        <button id="skinfile-button">
                            File Upload
                            <input style="display:none" type="file" accept="image/*" id="skinfile-input">
                        </button>
                        <button id="fadecolour-button">
                            Fade ${Colour}
                            <input style="display:none" type="color" id="fadecolour-input">
                        </button>
                        <span>Submit the image URL. Upload an image for a background. Choose a background fade ${colour}.</span>
                    </div>
                    <div class="form-row no-break thin-row checkboxes">
                        <label></label>
                        <input id="skinresize" type="checkbox">
                        <label for="skinresize">Resize background image to fit site.</label>
                    </div>
                    <div class="form-row" style="padding-top: 4px;">
                        <label></label>
                        <span style="width:100%">File uploads may take longer to load if their file size is too big. It is recommended to upload backgrounds to <a href='https://www.newgrounds.com/dump'>your file dump</a> or another image host and then use their URLs instead.</span>
                    </div>
                    <div class="form-row">
                        <label>${Colour} Themes</label>
                        <div id="themesdiv" style="display:grid; grid-template-columns:repeat(${themes.length + 3},1fr);"></div>
                    </div>
                    <div class="form-row">
                        <label>Background Opacity</label>
                        <div class="slider" style="padding-top:4px;">
                            <input id="opacityslider" class="opacityslider" type="range" min="0" max="255">
                        </div>
                        <span>Change the opacity of the site's black boxes.</span>
                    </div>
                    <div class="form-row no-break thin-row">
                        <label>Presets</label>
                        <div class="select-wrapper">
                            <select id="presetdropdown">
                                <option selected disabled>Select a preset</option>
                            </select>
                        </div>
                        <span>Choose a preset from the list.</span>
                    </div>
                    <div class="form-row">
                        <label></label>
                        <button id="presetcreate">Save</button>
                        <button id="presetdelete">Delete</button>
                        <button id="presetshare">Share</button>
                        <span>Save, delete or share presets.</span>
                    </div>
                    <div class="form-row no-break thin-row checkboxes">
                        <label>Settings</label>
                        <input id="resetsite" type="checkbox">
                        <label for="resetsite">Reset currently chosen site skin whenever the default site skin updates.</label>
                    </div>
                    <div class="form-row no-break thin-row checkboxes">
                        <label></label>
                        <input id="aliasing" type="checkbox">
                        <label for="aliasing">Disable anti-aliasing when resizing images. Best for pixel art.</label>
                    </div>
                    <div class="form-row no-break thin-row">
                        <label></label>
                        <button id="advancedsettings">Advanced Settings</button>
                        <span>Direct editing of site skins and more settings.</span>
                    </div>
                    <div class="form-row no-break thin-row">
                        <label></label>
                        <span style="width:100%">Newgrounds Site Skin Customizer v${GM_info.script.version} by <a href="https://sebulant.newgrounds.com">@sebulant</a></span>
                        <br>
                    </div>
                    <div class="form-row no-break thin-row" style="display:none;">
                        <label>Test</label>
                        <button id="ngssdebugbutton">Test Button</button>
                        <span>Test button for testing things.</span>
                    </div>
                </div>
            `;
            let settings = document.getElementsByClassName("account-grouping"); // Append site skin settings into the top part of the normal settings
            settings[0].after(settingsPage);
            settings[0].after(document.createElement("hr"));

            // Styles
            GM_addStyle(`
                button + span, div.themesdiv + span, div.slider + span { margin-left: 1.1em; }
                .form-row button { min-width:89px; }
                .thin-row { padding: 8px 0px 0px 0px !important; }
                .thin-row.checkboxes { padding-top: 4px !important; }
                .themebutton {
                    width: 21px;
                    height: 16px;
                    cursor: pointer;
                    margin-left: 2px;
                    text-align: center;
                }
                .themebutton span {
                    color: #fff !important;
                    font-weight: 800;
                    font-size: 0.9em !important;
                    margin-right: 0px !important;
                    line-height: 0px !important;
                }
                .opacityslider {
                    -webkit-appearance: none;
                    width: 269px !important;
                    height: 0.6em !important;
                    min-height: 0px !important;
                    background: none !important;
                    background-color: #34393D99 !important;
                    border: 1px solid #4E575E !important;
                    border-radius: 4px;
                    box-shadow: none !important;
                    padding: 0px;
                    cursor: grab;
                }
                input[type="range"]::-webkit-slider-thumb, input[type="range"]::-moz-range-thumb {
                    width: 1em;
                    height: 1em;
                    background-color: #7d7575;
                    border: 1px solid #c9bebe;
                    border-radius: 4px;
                }
                .checkboxes input[type="checkbox"]:not(.switch) + label { padding-top: 4px; }
                .presetoption {
                    background-position: center;
                    background-size: cover
                }
                .presetoption label:first-child {
                    color: #fff;
                    font-weight:bold;
                    text-shadow:0px 0px 15px #00000090;
                }
            `);

            // Adding skin dropdown options and artist credit
            let selectedSkinID = -1;
            for (const skin in backgrounds) { // Create all options in the dropdown and auto select one if possible
                let bgoption = document.createElement("option");
                bgoption.innerText = backgrounds[skin].name;
                bgoption.value = skin;
                if (GM_getValue("customSkinURL") == backgrounds[skin].url) { // Auto select an item from the dropdown if the skin is currently in use
                    bgoption.selected = true;
                    if (skin != 0) { selectedSkinID = skin; }
                }
                document.getElementById("skindropdown").appendChild(bgoption);
            }
            if (selectedSkinID != -1) {
                changeWallArtist(backgrounds[selectedSkinID].artist);
            }

            // Setting the fade colour button's current value
            document.getElementById("fadecolour-input").value = GM_getValue("customFadeColour") != undefined && GM_getValue("customFadeColour") != "" ? GM_getValue("customFadeColour") : defaultFadeColour;

            // Adding theme colour buttons
            // Generic themes
            for (const theme in themes) {
                let themeButton = document.createElement("a");
                themeButton.className = "themebutton";
                themeButton.id = `themebutton${theme}`;
                themeButton.style.background = `linear-gradient(to bottom, ${themes[theme].colour} 20%, ${themes[theme].visited} 100%)`;
                themeButton.style.border = `2px solid ${themes[theme].visited}`;
                if (theme == GM_getValue("customThemeId")) themeButton.style.outline = "1px solid #fff";
                themeButton.addEventListener('click', function(){ 
                    updateChosenTheme(theme);
                });
                document.getElementById("themesdiv").appendChild(themeButton);
            }
            // Default, random and custom theme
            for (let i = -3; i < 0; i++) {
                let themeButton = document.createElement("a");
                themeButton.className = "themebutton";
                themeButton.id = `themebutton${i}`;
                if (i == GM_getValue("customThemeId")) themeButton.style.outline = "1px solid #fff";
                if (i == -3) {
                    let colourText = GM_getValue("customThemeColour") == undefined ? "#fda238" : GM_getValue("customThemeColour").colour;
                    let visitedText = GM_getValue("customThemeColour") == undefined ? "#fe3942" : GM_getValue("customThemeColour").visited;
                    themeButton.style.background = `linear-gradient(to bottom, ${colourText} 20%, ${visitedText} 100%)`;
                    themeButton.style.border = `2px solid ${visitedText}`;
                    themeButton.innerHTML = `<span>C</span><input style="display:none" type="color" id="customthemecolour">`;
                    themeButton.addEventListener('click', function(){ document.getElementById("customthemecolour").click(); });
                }
                else if (i == -2) {
                    themeButton.style.background = `linear-gradient(to bottom, #fda238 20%, #fe3942 100%)`;
                    themeButton.style.border = `2px solid #fe3942`;
                    themeButton.innerHTML = `<span>?</span>`;
                    themeButton.addEventListener('click', function(){ updateChosenTheme(-2); });
                }
                else if (i == -1) {
                    themeButton.style.background = `linear-gradient(to bottom, #fda238 20%, #fe3942 100%)`;
                    themeButton.style.border = `2px solid #fe3942`;
                    themeButton.innerHTML = `<span>X</span>`;
                    themeButton.addEventListener('click', function(){ updateChosenTheme(-1); });
                }
                document.getElementById("themesdiv").appendChild(themeButton);
            }

            // Default custom colour theme value
            document.getElementById("customthemecolour").value = GM_getValue("customThemeColour") == undefined ? "#fda238" : GM_getValue("customThemeColour").colour;

            // Move slider to correct position
            document.getElementById("opacityslider").value = GM_getValue("siteOpacity") == undefined ? 255 : GM_getValue("siteOpacity");

            // Adding preset dropdown options
            for (let preset in skinPresets) {
                let presetOption = document.createElement("option");
                presetOption.innerText = skinPresets[preset].name;
                presetOption.value = preset;
                document.getElementById("presetdropdown").appendChild(presetOption);
            }

            // Setting checkbox values
            if (GM_getValue("allowSkinReset") != false) { // Can be either true or undefined in order to be ticked
                document.getElementById("resetsite").checked = true;
            }
            if (GM_getValue("backgroundResize")) document.getElementById("skinresize").checked = true;
            if (GM_getValue("pixelScaling")) document.getElementById("aliasing").checked = true;

            // Event listeners
            document.getElementById("skindropdown").addEventListener('change', updateChosenSkinDropdown);
            document.getElementById("skinurl-button").addEventListener('click', updateChosenSkinText);
            document.getElementById("skinfile-button").addEventListener('click', function(){ document.getElementById("skinfile-input").click(); });
            document.getElementById("skinfile-input").addEventListener('change', updateChosenSkinFile);
            document.getElementById("skinresize").addEventListener('click', updateSkinResize);
            document.getElementById("fadecolour-button").addEventListener('click', function(){ document.getElementById("fadecolour-input").click(); });
            document.getElementById("fadecolour-input").addEventListener('change', updateChosenFadeColour);
            document.getElementById("customthemecolour").addEventListener('change', function(){ updateChosenTheme(-3); })
            document.getElementById("opacityslider").addEventListener(GM_getValue("realtimeOpacity") ? "input" : "change", updateSiteOpacity);
            document.getElementById("presetdropdown").addEventListener('change', updateSitePreset);
            document.getElementById("presetcreate").addEventListener('click', createSitePreset);
            document.getElementById("presetdelete").addEventListener('click', deleteSitePreset);
            document.getElementById("presetshare").addEventListener('click', sharePresetPopup);
            document.getElementById("resetsite").addEventListener('click', updateSkinReset);
            document.getElementById("aliasing").addEventListener('click', updatePixelScaling);
            document.getElementById("advancedsettings").addEventListener('click', advancedSettingsPopup);
            //document.getElementById("ngssdebugbutton").addEventListener('click', testFunction);
        }

        // Preset manager page (WIP) - Will allow for easier renaming, reordering and stuff
        if (document.URL == "https://www.newgrounds.com/skin/presets" || document.URL == "https://www.newgrounds.com/skin/presets#") {
            // Page titles
            document.title = "Skin Presets";
            let title = document.getElementsByClassName("pod-head");
            title[0].innerHTML = `
                <h2 class="settings">Skin Presets</h2>
                <span><label id="savedpresettext"></label></span>
                <span><a href="#" id="presetsave">Save Changes</a></span>
                <span><a href="#" id="presetexport">Export Presets</a></span>
                <span><a href="#" id="presetimport">Import Presets</a></span>
            `;

            // Save preset box
            let headerBody = `
                <span>Create, overwrite or delete presets.</span>
            `;
            let body = document.getElementsByClassName("pod-body");
            body[0].innerHTML = headerBody;

            // Add preset options
            let presetHolder = document.createElement("div");
            body[0].insertAdjacentElement('afterend', presetHolder);
            for (let preset in skinPresets) {
                let presetOption = document.createElement("div");
                presetOption.className = "pod-body text-content presetoption";
                presetOption.style.backgroundImage = `url(${skinPresets[preset].url == "" ? GM_getValue("lastDefaultSkinURL") : skinPresets[preset].url})`;
                presetOption.style.imageRendering = skinPresets[preset].pixel ? "crisp-edges" : "auto";
                presetOption.innerHTML = `
                    <input id="presetname${preset}" type="text" value="${skinPresets[preset].name}"></input>
                    <div style="float:right;">
                        <button id="presetup${preset}" ${preset == 0 ? "disabled" : ""}><i class="fa fa-chevron-up"></i></button>
                        <button id="presetdown${preset}" ${preset == skinPresets.length - 1 ? "disabled" : ""}><i class="fa fa-chevron-down"></i></button>
                        <button id="presetdelete${preset}">Delete</button>
                    </div>
                `;
                presetHolder.appendChild(presetOption);
                document.getElementById(`presetdelete${preset}`).addEventListener("click", pmDeletePreset);
            }

            // Styles
            GM_addStyle(`
                .presetoption {
                    background-position: center;
                    background-size: cover;
                }
                #savedpresettext {
                    font-size: 11px;
                    color: #fff !important;
                }
            `);

            // Event listeners
            document.getElementById("presetsave").addEventListener("click", pmSavePresets);
        }
	});

    // Called when the user chooses a value in the background dropdown
    function updateChosenSkinDropdown() {
        GM_setValue("customSkinURL", backgrounds[this.value].url); // Save chosen skin
        changeSkin(backgrounds[this.value].url); // Change skin to dropdown value

        // Update background artist
        changeWallArtist(backgrounds[this.value].artist);
    }

    // Called when the user uploads a file to use as a site skin
    function updateChosenSkinFile() {
        if (!this.files[0]) return;

        let fileReader = new FileReader();
        let base64String;
        fileReader.onload = function() {
            base64String = fileReader.result;
            changeSkin(base64String); // Change skin
            GM_setValue("customSkinURL", base64String); // Save chosen skin
            changeWallArtist(""); // Wall artist
        }
        fileReader.readAsDataURL(this.files[0]);
    }

    // Called when the user presses the button for a custom skin url
    function updateChosenSkinText() {
        let textbox = document.getElementById("skinurl"); // Find textbox
        GM_setValue("customSkinURL", textbox.value); // Save chosen skin
        changeSkin(textbox.value); // Change skin to dropdown value

        // Update background artist
        changeWallArtist("");
    }

    // Called when the user changes their background fade colour
    function updateChosenFadeColour() {
        GM_setValue("customFadeColour", this.value);
        changeFadeColour(GM_getValue("customFadeColour"));
        updateSettingsPage();
    }

    function updateSkinResize() {
        GM_setValue("backgroundResize", this.checked);
        changeSkinResize(this.checked);
        updateSettingsPage();
    }

    // Called when the user changes their site theme
    function updateChosenTheme(themeid) {
        GM_setValue("customThemeId", themeid);

        // Custom colours
        if (themeid == -3) {
            let rgbColour = document.getElementById("customthemecolour").value;
            let hslColour = RGB2HSL(rgbColour); // HSL of new colour
            let hslOriginal = RGB2HSL("#fa9a2b"); // HSL of default site theme
            let customTheme = {colour: rgbColour, visited: HSL2HEX(hslColour[0],hslColour[1],Math.max(0,hslColour[2]-15)), hover: "#fff", hue: Math.round(hslColour[0]-hslOriginal[0]), saturate: Math.round(100+hslColour[1]-hslOriginal[1]), brightness: Math.round(Math.max(100,100+hslColour[2]-hslOriginal[2]))}
            GM_setValue("customThemeColour", customTheme);
        }

        // Change theme
        if (themeid >= 0) changeTheme(themes[themeid]); // chosen colour
        else if (themeid == -2) changeTheme(themes[[Math.floor(Math.random() * themes.length)]]); // random
        else if (themeid == -3) changeTheme(GM_getValue("customThemeColour")); // custom theme
        else resetTheme(); // default theme

        // Update selected colour on settings
        updateSettingsPage();
    }

    // Called when the user changes the site opacity
    function updateSiteOpacity() {
        GM_setValue("siteOpacity", this.value)
        changeOpacity(this.value)
        //document.getElementById("opacitylabel").innerHTML = Math.floor(this.value * 100 / 255) + "%";
    }

    // Called when the user selects a preset
    function updateSitePreset() {
        // Get selected preset
        let preset = skinPresets[this.value];

        // Fixing broken fade colours
        if (preset.fade == undefined || preset.fade == "") preset.fade = defaultFadeColour;

        // Save site skin
        GM_setValue("customSkinURL", preset.url);
        GM_setValue("customFadeColour", preset.fade);
        GM_setValue("customThemeId", preset.theme);
        GM_setValue("siteOpacity", preset.opacity);
        GM_setValue("backgroundResize", preset.resize);
        GM_setValue("pixelScaling", preset.pixel);
        if (preset.theme == -3) GM_setValue("customThemeColour", preset.themeColour);

        //Change to new theme
        changeSkin(preset.url);
        changeSkinResize(preset.resize);
        changePixelScaling(preset.pixel);
        changeFadeColour(preset.fade);
        if (preset.theme > 0) changeTheme(themes[preset.theme]); // chosen colour
        else if (preset.theme == -2) changeTheme(themes[[Math.floor(Math.random() * themes.length)]]); // random
        else if (preset.theme == -3) changeTheme(GM_getValue("customThemeColour")); // custom theme
        else resetTheme(); // default theme
        changeOpacity(preset.opacity);

        // Update settings page to reflect changes
        updateSettingsPage();
    }

    // Creates a new site preset
    function createSitePreset() {
        // Prompt user for preset name
        let presetName = prompt("Enter preset name:");
        if (presetName == null || presetName == "") return;

        // Create preset
        let newPreset = {
            name: presetName,
            url: GM_getValue("customSkinURL"),
            fade: GM_getValue("customFadeColour"),
            theme: GM_getValue("customThemeId"),
            opacity: GM_getValue("siteOpacity"),
            resize: GM_getValue("backgroundResize"),
            pixel: GM_getValue("pixelScaling"),
        }
        if (newPreset.theme == -3) newPreset.themeColour = GM_getValue("customThemeColour");

        // Check if name is already in use
        for (let preset in skinPresets) {
            if (skinPresets[preset].name.toLowerCase() == presetName.toLowerCase()) {
                // Overwrite existing preset
                if (confirm("There is already a preset with this name. Overwrite the existing one?")) {
                    // Overwrite preset
                    skinPresets[preset] = newPreset;
                    GM_setValue("sitePresets", skinPresets);
                    updatePresetDropdown();
                }
                return;
            }
        }

        // Save new preset
        skinPresets.push(newPreset);
        GM_setValue("sitePresets", skinPresets);
        updatePresetDropdown();
    }

    // Deletes a site preset
    function deleteSitePreset() {
        // Prompt user for preset name
        let presetName = prompt("Enter name of preset to delete (not case sensitive):");
        if (presetName == null || presetName == "") return;

        // Attempt to delete
        let skinFound = false;
        for (let preset in skinPresets) {
            if (skinPresets[preset].name.toLowerCase() == presetName.toLowerCase()) {
                if (confirm(`This will delete the preset "${skinPresets[preset].name}". This cannot be undone. Are you sure you want to do this?`)) {
                    skinFound = true;
                    skinPresets.splice(preset, 1); // Remove item from array
                    GM_setValue("sitePresets", skinPresets);
                    updatePresetDropdown(); // Reload site
                }
                return;
            }
        }

        // If code reaches here it means the preset was not found
        if (!skinFound) alert("Preset could not be found. Check the spelling and try again.");
    }

    // Updates preset dropdown to reflect user changes (creating/overwriting/deleting presets)
    function updatePresetDropdown() {
        document.getElementById("presetdropdown").innerHTML = "<option selected disabled>Select a preset</option>"; // eliminate the children
        for (let preset in skinPresets) {
            let presetOption = document.createElement("option");
            presetOption.innerText = skinPresets[preset].name;
            presetOption.value = preset;
            document.getElementById("presetdropdown").appendChild(presetOption);
        }
    }

    // Called when the user changes whether they want to change the skin when newgrounds does
    function updateSkinReset() {
        GM_setValue("allowSkinReset", this.checked);
    }

    // Called when changing aliasing settings for rescaling backgrounds
    function updatePixelScaling() {
        GM_setValue("pixelScaling", this.checked);
        changePixelScaling(this.checked);
    }

    // Popup for preset sharing
    function sharePresetPopup() {
        if (popupActive) return;
        popupActive = true;

        let text = `
            <div class="blackout" style="z-index: 11002; display: block;"></div>
            <div class="blackout-hover" style="z-index:11003;">
                <div class="page-dimmer"></div>
                <div class="blackout-inner" style="height:100%;">
                    <div class="blackout-bookend"></div>
                    <div class="blackout-bookshelf">
                        <div class="blackout-bookend shimmed"></div>
                        <div class="blackout-center" style="">
                            <div class="column">
                                <div class="pod-head">
                                    <h2>Share Presets</h2>
                                    <span><a class="icon-close" id="presetclose"></a></span>
                                </div>
                                <div class="pod-body">
                                    <span>Share your site skin presets with other users of this extension.</span>
                                </div>
                                <div class="pod-body text-content">
                                    <div class="fixed-form">
                                        <div class="form-row no-break">
                                            <label>Export</label>
                                            <div class="select-wrapper">
                                                <select id="presetexportdropdown">
                                                    <option selected disabled value=-1>Select a preset</option>
                                                </select>
                                            </div>
                                            <button id="presetexportone" style="margin-left: 1.1em;">Export Preset</button>
                                            <span>Export single preset.</span>
                                        </div>
                                        <div class="form-row" style="padding-top: 0px;">
                                            <label></label>
                                            <button id="presetexportall">Export All</button>
                                            <span>Export all saved presets.</span>
                                        </div>
                                        <div class="form-row thin-row no-break">
                                            <label>Import</label>
                                            <button id="presetimport">
                                                Import Preset(s)
                                                <input style="display:none" type="file" accept=".json, .zip" id="presetimportinput">
                                            </button>
                                            <span>Import preset .json files. You can also upload a .zip containg multiple .json presets too.</span>
                                        </div>
                                        <div class="form-row no-break thin-row checkboxes">
                                            <label></label>
                                            <input id="replacepresets" type="checkbox">
                                            <label for="replacepresets">Delete all existing presets and replace them with newly imported presets.</label>
                                        </div>
                                        <div class="form-row no-break thin-row checkboxes">
                                            <label></label>
                                            <input id="overwritepresets" type="checkbox">
                                            <label for="overwritepresets">Overwrite exisiting presets that share the same name as newly imported presets.</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="blackout-bookend shimmed"></div>
                    </div>
                    <div class="blackout-bookend"></div>
                </div>
            </div>
        `;
        popup = document.createElement("div");
        popup.innerHTML = text;
        document.body.appendChild(popup);

        // Adding presets to single export dropdown
        for (let preset in skinPresets) {
            let presetOption = document.createElement("option");
            presetOption.value = preset;
            presetOption.innerText = skinPresets[preset].name;
            document.getElementById("presetexportdropdown").appendChild(presetOption);
        }

        // Event listeners
        document.getElementById("presetclose").addEventListener("click", removePopup);
        document.getElementById("presetexportone").addEventListener("click", presetExportOne);
        document.getElementById("presetexportall").addEventListener("click", presetExportAll);
        document.getElementById("presetimport").addEventListener("click", function(){ document.getElementById("presetimportinput").click(); });
        document.getElementById("presetimportinput").addEventListener("change", presetImport);
    }

    // Exports a single preset as a .json file
    function presetExportOne() {
        // Get preset
        let presetId = document.getElementById("presetexportdropdown").value;
        if (presetId == -1) return;
        let preset = skinPresets[presetId];

        // Create download link
        let downloadLink = document.createElement("a");
        downloadLink.href = URL.createObjectURL(new Blob([JSON.stringify(preset, null, 4)], {type: 'application/json'}));
        downloadLink.download = `${preset.name}.json`;

        // Download .json file
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    }

    // Exports all presets as .json files bundled in a .zip
    function presetExportAll() {
        // Create zip file
        let presetZip = new JSZip();
        for (let preset in skinPresets) {
            presetZip.file(`${(Number(preset) + 1).toString().padStart(2, "0")} - ${skinPresets[preset].name}.json`, JSON.stringify(skinPresets[preset], null, 4));
        }

        // Download zip file
        presetZip.generateAsync({type: "blob"})
            .then(function(content) {
                // Create download link
                let downloadLink = document.createElement("a");
                downloadLink.href = URL.createObjectURL(content);
                downloadLink.download = `allpresets.zip`;

                // Paste download link into body and auto click it
                document.body.appendChild(downloadLink);
                downloadLink.click();
                document.body.removeChild(downloadLink);
            });
    }

    // Imports a single .json preset or a .zip containing multiple .json files
    function presetImport() {
        if (!this.files[0]) return;

        // Import settings
        let deletePresets = document.getElementById("replacepresets").checked;
        let overwritePresets = document.getElementById("overwritepresets").checked;

        // Single .json file
        if (this.files[0].type.includes("json")) {
            let fileReader = new FileReader();
            fileReader.onloadend = function() {
                try {
                    // Get preset
                    let newPreset = JSON.parse(fileReader.result);

                    // Check if user wants to delete all their presets and replace it with this single one... lol
                    if (deletePresets && confirm("Do you want to delete ALL your presets and replace them with this single one? This cannot be undone!")) {
                        skinPresets = [newPreset];
                        GM_setValue("sitePresets", skinPresets);
                        presetUpdateDropdown();
                        return;
                    }

                    // Check if preset already exists and request overwrite
                    for (let preset in skinPresets) {
                        if (skinPresets[preset].name.toLowerCase() == newPreset.name.toLowerCase()) {
                            if (overwritePresets || confirm("There is already a preset with this name. Overwrite the existing one?")) {
                                skinPresets[preset] = newPreset;
                                GM_setValue("sitePresets", skinPresets);
                                presetUpdateDropdown();
                            }
                            return;
                        }
                    }

                    // Preset does not exist already, save it as new
                    skinPresets.push(newPreset);
                    GM_setValue("sitePresets", skinPresets);
                    presetUpdateDropdown();
                }
                catch (error) {
                    console.error("Error importing JSON preset: ", error);
                    alert("Failed to import preset. Check the console for more details.");
                }
            }
            fileReader.readAsText(this.files[0]);
        }

        // Multiple .json files in .zip
        else if (this.files[0].type.includes("zip")) {
            let presetZip = new JSZip();

            // Load zip file
            presetZip.loadAsync(this.files[0])
                .then(function(content) {
                    // Check if user wants to replace all their presets with new ones
                    if (deletePresets && confirm("Are you sure you want to delete ALL your presets and replace them with the ones you are importing? This cannot be undone")) {
                        skinPresets = [];
                        GM_setValue("sitePresets", skinPresets);
                        presetUpdateDropdown();
                    }

                    // Go through each entry in the zip
                    presetZip.forEach(function (path, file) {
                        // Ignore directories
                        if (!file.dir) {
                            // Read file
                            presetZip.file(path).async("string")
                                .then(function(content) {
                                    // Get preset json
                                    let newPreset = JSON.parse(content);
                                    
                                    // Check if preset already exists
                                    let presetId = -1;
                                    for (let preset in skinPresets) {
                                        if (skinPresets[preset].name.toLowerCase() == newPreset.name.toLowerCase()) {
                                            presetId = preset;
                                        }
                                    }

                                    // Save preset
                                    if (presetId != -1) { // Overwrite existing preset
                                        if (overwritePresets) {
                                            skinPresets[presetId] = newPreset;
                                        }
                                    }
                                    else { // Save as new preset
                                        if (skinPresets == []) { skinPresets = [newPreset]; }
                                        else { skinPresets.push(newPreset); }
                                    }
                                    GM_setValue("sitePresets", skinPresets);
                                    presetUpdateDropdown();
                                });
                        }
                    });
                })
                .catch(function(error) {
                    console.error("Error importing JSON presets: ", error);
                    alert("Failed to import presets. Check the console for more details.");
                });
        }
    }

    // Updates the preset dropdown in preset popup
    function presetUpdateDropdown() {
        let dropdown = document.getElementById("presetexportdropdown");
        if (dropdown == undefined) return;

        dropdown.innerHTML = "<option selected disabled value=-1>Select a preset</option>";
        for (let preset in skinPresets) {
            let presetOption = document.createElement("option");
            presetOption.value = preset;
            presetOption.innerText = skinPresets[preset].name;
            dropdown.appendChild(presetOption);
        }
        updatePresetDropdown(); // update preset dropdown on the main settings page too
    }

    // Advanced settings popup
    function advancedSettingsPopup() {
        if (popupActive) return;
        popupActive = true;

        let text = `
            <div class="blackout" style="z-index: 11002; display: block;"></div>
            <div class="blackout-hover" style="z-index:11003;">
                <div class="page-dimmer"></div>
                <div class="blackout-inner" style="height:100%;">
                    <div class="blackout-bookend"></div>
                    <div class="blackout-bookshelf">
                        <div class="blackout-bookend shimmed"></div>
                        <div class="blackout-center" style="">
                            <div class="column">
                                <div class="pod-head">
                                    <h2>Advanced Settings</h2>
                                    <span><a class="icon-close" id="advclose"></a></span>
                                </div>
                                <div class="pod-body">
                                    <p>Advanced settings for site customization.</p>
                                </div>
                                <div class="pod-body text-content">
                                    <div class="fixed-form">
                                        <div class="form-row thin-row no-break"><em class="strong">Site Theme:</em></div>
                                        <div class="form-row thin-row no-break">
                                            <label style="font-weight:normal;">Background URL</label>
                                            <input id="advbgtextbox" type="url" placeholder="Image">
                                            <span>Enter direct link to image or base 64 image</span>
                                        </div>
                                        <div class="form-row thin-row no-break">
                                            <label style="font-weight:normal;">Background Fade ${Colour}</label>
                                            <input id="advbgfade" type="text" placeholder="Fade ${Colour}" style="width:100px;">
                                            <span>Hex code for ${colour} that the background will fade to at the bottom of the page</span>
                                        </div>
                                        <div class="form-row thin-row no-break">
                                            <label style="font-weight:normal;">Link ${Colour}</label>
                                            <input id="advthemecolour" type="text" placeholder="Link ${Colour}" style="width:100px;">
                                            <span>Hex code for ${colour}ed text and links</span>
                                        </div>
                                        <div class="form-row thin-row no-break">
                                            <label style="font-weight:normal;">Visited Link ${Colour}</label>
                                            <input id="advthemevisited" type="text" placeholder="Visited ${Colour}" style="width:100px;">
                                            <span>Hex code for visited link ${colour}</span>
                                        </div>
                                        <div class="form-row thin-row no-break">
                                            <label style="font-weight:normal;">Hovered Link ${Colour}</label>
                                            <input id="advthemehover" type="text" placeholder="Hover ${Colour}" style="width:100px;">
                                            <span>Hex code for mouse hovered links. This is usually just left white (#fff)</span>
                                        </div>
                                        <div class="form-row thin-row no-break">
                                            <label style="font-weight:normal;">Icon Hue Shift</label>
                                            <input id="advthemehue" type="text" placeholder="Hue" style="width:100px;margin-right:4px;">
                                            <input id="advthemesaturation" type="text" placeholder="Saturation" style="width:100px;margin-right:4px;">
                                            <input id="advthemebrightness" type="text" placeholder="Brightness" style="width:100px;">
                                            <span>HSL hue shift for icons and logos (ng logo, star reviews, etc.)</span>
                                        </div>
                                        <div class="form-row thin-row no-break">
                                            <label style="font-weight:normal;">Background Opacity</label>
                                            <input id="advopacity" type="text" placeholder="Opacity" style="width:100px;">
                                            <span>Background opacity for menus and popups (0-255)</span>
                                        </div>
                                        <div class="thin-row">
                                            <button id="advthemeupdate">Update Theme</button>
                                            <button id="advthemefill">Fill Boxes</button>
                                            <button id="advthemeclear">Clear Boxes</button>
                                        </div>
                                    </div>
                                    <hr>

                                    <div class="fixed-form">
                                        <div class="form-row thin-row no-break"><em class="strong">Other Settings:</em></div>
                                        <div class="form-row thin-row no-break checkboxes" style="display:none;">
                                            <label style="font-weight:normal;">No Site Refresh</label>
                                            <input id="advsiterefresh" type="checkbox">
                                            <label for="advsiterefresh" style="margin-top:4px;">Don't refresh the site when changing theme/preset. Can cause visual issues when changing settings.</label>
                                        </div>
                                        <div class="form-row thin-row no-break checkboxes">
                                            <label style="font-weight:normal;">Opacity Slider</label>
                                            <input id="advrealtimeopacity" type="checkbox">
                                            <label for="advrealtimeopacity" style="margin-top:4px;">Update opacity slider in real time (heavy on CPU). Requires refresh.</label>
                                        </div>
                                        <div class="form-row thin-row no-break checkboxes">
                                            <label style="font-weight:normal;">British English</label>
                                            <input id="advbritish" type="checkbox">
                                            <label for="advbritish" style="margin-top:4px;">Spell colour the way it was meant to be spelled. Requires refresh.</label>
                                        </div>
                                        <div class="form-row thin-row no-break checkboxes">
                                            <label style="font-weight:normal;">Light Mode</label>
                                            <input id="advlightmode" type="checkbox">
                                            <label for="advlightmode" style="margin-top:4px;">Experimental, very unfinished, and looks terrible. Not compatible with most other settings. Requires refresh.</label>
                                        </div>
                                        <div class="thin-row">
                                            <button id="advimportsettings">
                                                Import Settings
                                                <input id="advimportupload" accept=".json" type="file" style="display:none;">
                                            </button>
                                            <button id="advexportsettings">Export Settings</button>
                                            <button id="advresetsettings">Reset Settings</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="blackout-bookend shimmed"></div>
                    </div>
                    <div class="blackout-bookend"></div>
                </div>
            </div>`
        popup = document.createElement("div");
        popup.innerHTML = text;
        document.body.appendChild(popup);

        // Updating settings to show current states
        document.getElementById("advsiterefresh").checked = GM_getValue("noRefresh");
        document.getElementById("advrealtimeopacity").checked = GM_getValue("realtimeOpacity");
        document.getElementById("advbritish").checked = GM_getValue("britishEnglish");
        document.getElementById("advlightmode").checked = GM_getValue("lightmode");

        // Event Listeners
        document.getElementById("advclose").addEventListener("click", removePopup) // Close Menu

        document.getElementById("advthemeupdate").addEventListener("click", advUpdateTheme); // Update current theme
        document.getElementById("advthemefill").addEventListener("click", advFillThemeBoxes); // Fill theme boxes with current theme's values
        document.getElementById("advthemeclear").addEventListener("click", advClearThemeBoxes); // Empty theme boxes

        document.getElementById("advsiterefresh").addEventListener("change", function(){ GM_setValue("noRefresh", this.checked); }) // Refresh site on theme change
        document.getElementById("advrealtimeopacity").addEventListener("change", function(){ GM_setValue("realtimeOpacity", this.checked); }) // Update opacity slider in real time
        document.getElementById("advbritish").addEventListener("change", function(){ GM_setValue("britishEnglish", this.checked); }) // Use the correct spelling of colour
        document.getElementById("advlightmode").addEventListener("change", function(){ GM_setValue("lightmode", this.checked); }) // Toggle light mode

        document.getElementById("advimportsettings").addEventListener("click", function(){ document.getElementById("advimportupload").click(); }) // Import settings button
        document.getElementById("advimportupload").addEventListener("change", advImportSettings); // Import settings file upload
        document.getElementById("advexportsettings").addEventListener("click", advExportSettings); // Export settings
        document.getElementById("advresetsettings").addEventListener("click", advResetSettings); // Delete settings
    }

    // Called when the user updates their theme in advanced settings
    function advUpdateTheme() {
        // Save skin URL
        GM_setValue("customSkinURL", document.getElementById("advbgtextbox").value);

        // Save bg fade
        GM_setValue("customFadeColour", document.getElementById("advbgfade").value);
        
        // Save theme
        let customTheme = {colour: document.getElementById("advthemecolour").value,
            visited: document.getElementById("advthemevisited").value,
            hover: document.getElementById("advthemehover").value,
            hue: document.getElementById("advthemehue").value,
            saturate: document.getElementById("advthemesaturation").value,
            brightness: document.getElementById("advthemebrightness").value}
        GM_setValue("customThemeColour", customTheme);
        GM_setValue("customThemeId", -3);

        // Save opacity
        GM_setValue("siteOpacity", document.getElementById("advopacity").value);

        // Change to new theme
        changeSkin(document.getElementById("advbgtextbox").value);
        changeFadeColour(document.getElementById("advbgfade").value);
        changeTheme(customTheme);
        changeOpacity(document.getElementById("advopacity").value);

        // Update settings page to reflect changes
        updateSettingsPage();
    }

    // Called when the user fills in theme boxes in advanced settings
    function advFillThemeBoxes() {
        document.getElementById("advbgtextbox").value = GM_getValue("customSkinURL") != undefined && GM_getValue("customSkinURL") != "" ? GM_getValue("customSkinURL") : GM_getValue("lastDefaultSkinURL");
        document.getElementById("advbgfade").value = GM_getValue("customFadeColour") != undefined && GM_getValue("customFadeColour") != "" ? GM_getValue("customFadeColour") : defaultFadeColour;

        if (GM_getValue("customThemeId") >= 0 && GM_getValue("customThemeId") <= 20) { // Preset colour
            document.getElementById("advthemecolour").value = themes[GM_getValue("customThemeId")].colour;
            document.getElementById("advthemevisited").value = themes[GM_getValue("customThemeId")].visited;
            document.getElementById("advthemehover").value = themes[GM_getValue("customThemeId")].hover;
            document.getElementById("advthemehue").value = themes[GM_getValue("customThemeId")].hue;
            document.getElementById("advthemesaturation").value = themes[GM_getValue("customThemeId")].saturate;
            document.getElementById("advthemebrightness").value = themes[GM_getValue("customThemeId")].brightness;
        }
        else if (GM_getValue("customThemeId") == -3 && GM_getValue("customThemeColour") != undefined) { // Custom colour
            document.getElementById("advthemecolour").value = GM_getValue("customThemeColour").colour;
            document.getElementById("advthemevisited").value = GM_getValue("customThemeColour").visited;
            document.getElementById("advthemehover").value = GM_getValue("customThemeColour").hover;
            document.getElementById("advthemehue").value = GM_getValue("customThemeColour").hue;
            document.getElementById("advthemesaturation").value = GM_getValue("customThemeColour").saturate;
            document.getElementById("advthemebrightness").value = GM_getValue("customThemeColour").brightness;
        }
        else { // Default / random colour
            document.getElementById("advthemecolour").value = themes[4].colour;
            document.getElementById("advthemevisited").value = themes[4].visited;
            document.getElementById("advthemehover").value = themes[4].hover;
            document.getElementById("advthemehue").value = 0;
            document.getElementById("advthemesaturation").value = 100;
            document.getElementById("advthemebrightness").value = 100;
        }

        document.getElementById("advopacity").value = GM_getValue("siteOpacity") != undefined ? GM_getValue("siteOpacity") : 255;
    }

    // Called when the user empties the theme boxes in advanced settings
    function advClearThemeBoxes() {
        document.getElementById("advbgtextbox").value = "";
        document.getElementById("advthemecolour").value = "";
        document.getElementById("advthemevisited").value = "";
        document.getElementById("advthemehover").value = "";
        document.getElementById("advthemehue").value = "";
        document.getElementById("advthemesaturation").value = "";
        document.getElementById("advthemebrightness").value = "";
        document.getElementById("advopacity").value = "";
    }

    // Updates real time opacity bar settings
    function advRealtimeOpacity() {
        GM_setValue("realtimeOpacity", document.getElementById("advrealtimeopacity").value);
    }

    // Called when importing settings
    function advImportSettings() {
        if (!this.files[0]) return;

        let fileReader = new FileReader();
        fileReader.onloadend = function() {
            try {
                let jsonSettings = JSON.parse(fileReader.result);
                Object.keys(jsonSettings).forEach(function(key) {
                    GM_setValue(key, jsonSettings[key]);
                })
                location.reload();
            }
            catch (error) {
                console.error("Error importing JSON settings: ", error);
                alert("Failed to import settings. Check the console for more details.");
            }
        }
        fileReader.readAsText(this.files[0]);
    }

    // Called when the user wants to export their settings
    function advExportSettings() {
        // Convert settings into JSON
        let allSettings = {}
        GM_listValues().forEach(function(key) {
            allSettings[key] = GM_getValue(key);
        })

        // Create download link
        let downloadLink = document.createElement("a");
        downloadLink.href = URL.createObjectURL(new Blob([JSON.stringify(allSettings, null, 4)], {type: 'application/json'}));
        downloadLink.download = "NGCustomizationSettings.json";

        // Download .json file
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    }

    // Called when the user chooses to delete all settings
    function advResetSettings() {
        if (confirm("This will remove your current site theme along with every preset saved. This cannot be undone. Are you sure you want to do this?")) {
            GM_listValues().forEach(function(key) {
                GM_deleteValue(key);
            });
            location.reload();
        }
    }

    // Called when removing current popup from screen
    function removePopup() {
        popupActive = false; // Set popup active flag to false
        popup.remove(); // Remove popup from html
        popup.innerHTML = ""; // Erase popup contents
    }

    // Updates settings page to show the users currently chosen preference
    function updateSettingsPage() {
        // Skin dropdown
        let selectedBackgroundIndex = backgrounds.findIndex(function(bg) {return bg.url === GM_getValue("customSkinURL")}); // yeah idk how the fuck this works
        document.getElementById("skindropdown").children[selectedBackgroundIndex == -1 ? 0 : selectedBackgroundIndex].selected = true; // if index is -1 then actually make it 0

        // Wall artist
        changeWallArtist(selectedBackgroundIndex == -1 ? "" : backgrounds[selectedBackgroundIndex].artist);

        // Fade colour
        document.getElementById("fadecolour-input").value = GM_getValue("customFadeColour") != undefined && GM_getValue("customFadeColour") != "" ? GM_getValue("customFadeColour") : defaultFadeColour;

        // Background Resize
        document.getElementById("skinresize").checked = GM_getValue("backgroundResize");

        // Selected theme
        let themeButtons = document.getElementById("themesdiv").children;
        for (let themeOption in themeButtons) {
            if (themeButtons[themeOption].style != undefined) themeButtons[themeOption].style.outline = "";
        }
        document.getElementById("themebutton"+GM_getValue("customThemeId")).style.outline = "1px solid #fff";

        // Custom theme colour
        let colourText = GM_getValue("customThemeColour") == undefined ? "#fda238" : GM_getValue("customThemeColour").colour;
        let visitedText = GM_getValue("customThemeColour") == undefined ? "#fe3942" : GM_getValue("customThemeColour").visited;
        document.getElementById("themebutton-3").style.background = `linear-gradient(to bottom, ${colourText} 20%, ${visitedText} 100%)`;
        document.getElementById("themebutton-3").style.border = `2px solid ${visitedText}`;
        document.getElementById("customthemecolour").value = colourText;

        // Opacity slider
        document.getElementById("opacityslider").value = GM_getValue("siteOpacity") == undefined ? 255 : GM_getValue("siteOpacity");

        // Preset
        document.getElementById("presetdropdown").children[0].selected = true;

        // Pixel Scaling
        document.getElementById("aliasing").checked = GM_getValue("pixelScaling");
    }

    // Save preset changes on WIP preset manager page
    function pmSavePresets() {
        // Saved text
        let text = document.getElementById("savedpresettext").innerText;
        if (text == "") document.getElementById("savedpresettext").innerText = "Saved!";
        else if (text.length < 234) document.getElementById("savedpresettext").innerText += "!"; // the most amount of !s that can be added before text starts getting cut off
    }

    // Delete a preset on WIP preset manager page
    function pmDeletePreset() {
        if (confirm(`This will delete the preset "${this.parentNode.parentNode.children[0].value}". This cannot be undone. Are you sure you want to do this?`)) {
            this.parentNode.parentNode.remove();
        }
    }

    // Changes site background. Will not work if the site isn't fully loaded
    function changeSkin(url) {
        if (url == "" || url == "undefined") { // Check if skin url is empty, replace with default skin if thats the case
            url = defaultSkinURL;
        }

        GM_addStyle(`
            .background {
                background-image: url(${url}) !important;
            }
            .background img {
                height: auto !important;
            }
        `);

        // Change background image
        let background = document.getElementsByClassName("background"); // Find the background
        let backgroundImage = document.getElementsByClassName("background")[0].childNodes;
        if (!background[0] || !backgroundImage[0]) return;
        backgroundImage[0].src = url; // Update other image element so page resizes itself
    }

    // Changes the site's theme
    function changeTheme(theme) {
        let styleText = "";

        // Text
        styleText += `a:visited { color: ${theme.visited}; }`; // Visited link
        styleText += `a { color: ${theme.colour}; }`; // Generic link
        styleText += `a.no-visited, .no-visited a, a.no-href { color: ${theme.colour} !important; }`; // Generic links that shouldnt show the visited colour
        styleText += `a:hover { color: ${theme.hover} !important; }`; // Hovered generic link
        styleText += `.searchform-options .searchform-sort a.current { color: #fff !important; }`;
        styleText += `.fixed-form .form-row.required label:first-child::after, .fixed-form label:first-child.required::after { color: ${theme.colour}; }`;
        styleText += `a.item-collab-small .collab-user { color: ${theme.colour}; }`; // Username text on the help wanted page on the community tab
        styleText += `.tag-collection div.tag span, .tag-collection div.toggle span { color: ${theme.colour}; }`; // searched tags
        styleText += `#audio-listen-duration { color: ${theme.colour}; }`; // Duration on audio
        styleText += `span.reaction-button a { color: ${theme.colour}; }`; // "React" text on reviews
        styleText += `.searchform-options .searchform-sort a, a.faux { color: ${theme.colour}; }`; // "latest" "popular" "advanced" sorting options in portals
        // Search autocomplete
        styleText += `ul.ui-autocomplete li[class^="ui-autocomplete-content"] > a:not(.ui-state-active) { color: ${theme.colour}; }`;
        styleText += `ul.ui-autocomplete li[class^="ui-autocomplete-content"] > a:visited:not(.ui-state-active) { color: ${theme.visited}; }`;
        styleText += `ul.ui-autocomplete li[class^="ui-autocomplete-content"].selected > a, ul.ui-autocomplete li[class^="ui-autocomplete-content"] > a.ui-state-active { color: ${theme.hover}; }`;
        // Your Feed
        styleText += `ul.sidenav-breadcrumbs li.expands:hover, ul.sidenav-menu li.expands:hover, ul.sidenav-submenu li.expands:hover { background-color: ${theme.colour}; }`;
        // Textboxes
        styleText += `button .ql-stroke, .ql-picker-label .ql-stroke { stroke: ${theme.colour} !important; }`; // Icons inside rich textboxes (i think that's what they're called)
        styleText += `button .ql-fill { fill: ${theme.colour} !important; }`; // The underline from the underline button inside the textbox
        // Submit Button
        styleText += `.pod-body button { color: ${theme.colour} !important; }`; // Text inside submit buttons
        styleText += `.pod-body button:hover { color: ${theme.hover} !important; }`; // Text inside hovered submit buttons
        styleText += `a.button, a.button:visited { color: ${theme.colour}; }`; // Text inside other buttons styled like this
        // Your feed buttons
        styleText += `ul.sidenav-breadcrumbs li a, ul.sidenav-breadcrumbs li a:visited, ul.sidenav-breadcrumbs li button, ul.sidenav-menu li a, ul.sidenav-menu li a:visited, ul.sidenav-menu li button, ul.sidenav-submenu li a, ul.sidenav-submenu li a:visited, ul.sidenav-submenu li button { color: ${theme.colour}; }`; // Text inside Your feed filter buttons
        // Switches
        styleText += `input[type='checkbox'].switch:checked + label::before { background-color: ${theme.colour} !important; }`; // Switches you see on the account settings
        // Calendar
        styleText += `div.ui-datepicker tbody td.ui-datepicker-today a { border: 1px solid ${theme.colour} !important; }`; // Current day highlight when using the calendar in advanced search
        // Follow & Delete Project Button
        styleText += `div.item-follow-user span.favefollow-buttons span.favefollow-add a, .pod-body button.special-btn, .pod-body div.passportform button, div.passportform .pod-body button, .pod-body a.button.special-btn, .notification-bar button.special-btn, .notification-bar div.passportform button, div.passportform .notification-bar button, .notification-bar a.button.special-btn, .search-options button.special-btn, .search-options div.passportform button, div.passportform .search-options button, .search-options a.button.special-btn, .pod-like button.special-btn, .pod-like div.passportform button, div.passportform .pod-like button, .pod-like a.button.special-btn { background: linear-gradient(to bottom, ${theme.colour} 0%,${theme.visited} 100%) !important; }`; // Follow and delete project buttons
        styleText += `div.item-follow-user span.favefollow-buttons span.favefollow-add a:hover { background: ${theme.hover} !important; }`; // Follow button hover colour
        styleText += `div.item-follow-user span.favefollow-buttons a, .pod-body button.special-btn, .pod-body div.passportform button, div.passportform .pod-body button, .pod-body a.button.special-btn, .notification-bar button.special-btn, .notification-bar div.passportform button, div.passportform .notification-bar button, .notification-bar a.button.special-btn, .search-options button.special-btn, .search-options div.passportform button, div.passportform .search-options button, .search-options a.button.special-btn, .pod-like button.special-btn, .pod-like div.passportform button, div.passportform .pod-like button, .pod-like a.button.special-btn { color: #fff !important }`; // Button text
        styleText += `div.item-follow-user span.favefollow-buttons a:hover, .pod-body button.special-btn:hover, .pod-body div.passportform button:hover, div.passportform .pod-body button:hover, .pod-body a.button.special-btn:hover, .notification-bar button.special-btn:hover, .notification-bar div.passportform button:hover, div.passportform .notification-bar button:hover, .notification-bar a.button.special-btn:hover, .search-options button.special-btn:hover, .search-options div.passportform button:hover, div.passportform .search-options button:hover, .search-options a.button.special-btn:hover, .pod-like button.special-btn:hover, .pod-like div.passportform button:hover, div.passportform .pod-like button:hover, .pod-like a.button.special-btn:hover { color: ${theme.visited} !important; }`; // text hover colour
        // Forum Buttons
        styleText += `.pod-head span a:not([class^="icon"]):not([class^="ngicon"]):not([href]), .pod-head span a:not([class^="ngicon"]).visited, .pod-head span a:not([class^="ngicon"]):hover, .pod-head span button.active, .pod-head span button:not([class^="ngicon"]):hover, div.podtop span a:not([class^="icon"]):not([class^="ngicon"]):not([href]), div.podtop span a:not([class^="ngicon"]).visited, div.podtop span a:not([class^="ngicon"]):hover, div.podtop span button.active, div.podtop span button:not([class^="ngicon"]):hover { background-color: ${theme.colour}; }`;
        styleText += `.pod-head span a:not([class^="ngicon"]), .pod-head span button:not([class^="ngicon"]), div.podtop span a:not([class^="ngicon"]), div.podtop span button:not([class^="ngicon"]) { color: ${theme.colour}; }`;
        styleText += `.pod-head select { color: ${theme.colour}; }`;
        styleText += `.pod-head .select-wrapper::after { border-color: ${theme.colour} transparent transparent; }`;
        styleText += `div.expand-condensed { color: ${theme.visited}; }`; // more... buttons on long forum quotes
        // Video controls
        styleText += `.ng-video-player div.ng-video-ui div.ng-video-volume div.ng-video-volume-slider div.ng-video-volume-slider-bar { background-color: ${theme.colour}; }`; // Volume slider
        styleText += `.ng-video-player div.ng-video-ui div.ng-video-timeline-outer div.ng-video-cursor > span::before { border-top: 4px solid ${theme.colour}; }`; // Timeline scrubber time box arrow
        styleText += `.ng-video-player div.ng-video-ui div.ng-video-timeline-outer div.ng-video-cursor > span { background-color: ${theme.colour}; }`; // Timeline scrubber time box
        // High scores button
        styleText += `div.pod-body.optionlinks a { color: ${theme.colour}; }`;
        styleText += `div.pod-body.optionlinks a.viewing { border: solid 1px ${theme.colour}; }`;
        // Icons & Logo
        styleText += `div.notification-bar .logo a { background: url("https://img.ngfiles.com/newgroundstitle-mono.png?cached=1691221203") left top no-repeat !important; background-size: 180px 26px !important; }`; // Forcing mono version of newgrounds logo that lends itself better to being hue shifted
        styleText += `.searchform-options a.advanced, .playlist-play::before, div.user-buttons div.user-button a, div#comrades_top_container > div h2, div.podtop h2:not(.noicon)::before, .visibility-checkbox input[type="checkbox"] + label em::before, div.topbar-menu a.logo, div.notification-bar .logo a, .pod-head h2:not([class^="rated"])::before, .pod-head a[class^="icon"]::before, .pod-head button[class^="icon"]::before, h6.wall-artist a, [class^="ngicon-"]:not(.noshift)::before, div.user-buttons div.user-button div > a, span[class^="flag-"] label::before, div[class^="flag-"] label::before, li[class^="flag-"] label::before, .star-score, .star-variable, div.vote-input div.star-bar, #waveform > div, #waveform > wave, div.ui-datepicker .ui-datepicker-header a.ui-datepicker-prev:not(.ui-state-hover), div.ui-datepicker .ui-datepicker-header a.ui-datepicker-next:not(.ui-state-hover) { filter: hue-rotate(${theme.hue}deg) saturate(${theme.saturate}%) brightness(${theme.brightness}%) !important; }`; // Most site icons
        styleText += `:disabled .ngicon-small-movie::before, .disabled .ngicon-small-movie::before, .ngicon-small-movie:disabled::before, .ngicon-small-movie.disabled::before, .ngicon-small-movie.gray::before, :disabled .ngicon-small-game::before, .disabled .ngicon-small-game::before, .ngicon-small-game:disabled::before, .ngicon-small-game.disabled::before, .ngicon-small-game.gray::before { filter: brightness(46%) !important; }`;
        // Art portal
        styleText += `a.item-portalitem-art-medium { color: #c9bebe !important; }`; // Artist names in art portal should always be grey
        // User of the day requirements
        styleText += `div.pod-body.uotd ul.requirements i, div.pod-body.uotd ul.requirements ul li::before { color: ${theme.colour}; }`;
        // Wall of honour buttons (the wall of honour logo is hue shifted earlier in Icons & Logo)
        styleText += `#goals_for_wall a.support_now { background-color: ${theme.colour}; }`; // Join button colour
        styleText += `#goals_for_wall a.support_now:hover { color: ${theme.visited} !important; }`; // Join button text hover colour

        GM_addStyle(styleText);
    }

    // Resets the NG site theme back to normal
    function resetTheme() {
    	changeTheme(themes[3]);
    	// style to change ng logo back to normal one
        GM_addStyle(`div.notification-bar .logo a { background: url("https://img.ngfiles.com/newgroundstitle.webp?cached=1618843553") left top no-repeat !important; background-size: 180px 26px !important; }`);
    }

    // Changes the site's background opacity
    function changeOpacity(opacity) {
        // Convert int to hex (0-100 to 00-FF)
        let hexOpacity = parseInt(opacity, 10).toString(16);
        if (hexOpacity.length == 1) { hexOpacity = "0" + hexOpacity; }

        // Add opacity + blur style
        GM_addStyle(`.pod-body, div.row { background-color: #0000 !important; }
                     .pod, .blackout-inner .pod-body { background-color: #0F0B0C${hexOpacity} !important;
                            backdrop-filter: blur(8px); }`);
    }

    // Changes the site's background fade colour
    function changeFadeColour(colour) {
        GM_addStyle(`body:not(.skin-userpage) div.outer div.skin-inner {background-color: ${colour};}
                     body:not(.skin-userpage) div.outer div.skin-inner div.background::before {background: linear-gradient(to bottom, rgba(0,0,0,0) 5%,${colour} 100%)}`);
    }

    // Changes background image to resize to fit site or not
    function changeSkinResize(resize) {
        if (resize) {
            GM_addStyle(`
                .background { background-size: cover; }
                .background img { width: 100%; }
            `);
        }
        else {
            GM_addStyle(`
                .background { background-size: auto; }
                .background img { width: auto; }
            `);
        }
    }

    // Changes pixel scaling for background resizing
    function changePixelScaling(pixelate) {
        GM_addStyle(`.background { image-rendering: ${pixelate ? "crisp-edges" : "auto"}; }`);
    }

    // Update wall artist
    function changeWallArtist(artist) {
        let settingsCredit = document.getElementById("skinartist-label");
        if (settingsCredit != undefined) settingsCredit.innerHTML = artist == "" ? "" : `Wall Art by <br><a href="https://${artist}.newgrounds.com" id="skinartist-link">@${artist}</a>`;
    }

    // Enables light mode (unfinished)
    function lightMode() {
        GM_addStyle(`
            div.header-nav-container::before { background-color: #ffffff80; }
            div.header-nav-container { background-color: #fff; }
            nav.header-nav-buttons a { color: #000 !important; }

            div.pod, article.pod, section.pod, div.thincol > *, div.fatcol > * { border: 1px solid #fff; }

            div.pod-head, header.pod-head, div.pod-fakehead, header.pod-fakehead, div.podtop { border: 1px solid #fff; }
            div.pod-head, header.pod-head, div.pod-fakehead, header.pod-fakehead, div.podtop, .header-gradient { background: linear-gradient(to bottom, #DEEDF9 0%,#D4DFE8 48%,#B5C1D7 53%,#8c9ca8 100%); }
            .pod-head h2, div.podtop h2 { color: #000 !important; }

            div.pod-body, article.pod-body, section.pod-body, form.pod-body, footer.pod-body, form.podcontent, div.podcontent { background-color: #FBFBFB; }
            .pod-body a.button, .pod-body button, .notification-bar a.button, .notification-bar button, .search-options a.button, .search-options button, .pod-like a.button, .pod-like button {
                border: 2px solid #8c9ca8;
            }

            .pod-body a.button, .pod-body button, .notification-bar a.button, .notification-bar button, .search-options a.button, .search-options button, .pod-like a.button, .pod-like button {
                background: linear-gradient(to bottom, #DEEDF9 0%,#D4DFE8 48%,#B5C1D7 53%,#8c9ca8 100%);
            }
            .pod-head span a:not([class^="ngicon"]), .pod-head span button:not([class^="ngicon"]), div.podtop span a:not([class^="ngicon"]), div.podtop span button:not([class^="ngicon"]) {
                background-color: rgba(255,255,255,0.5);
            }
            div.pod-body, article.pod-body, section.pod-body, form.pod-body, footer.pod-body, form.podcontent, div.podcontent {
                border: 1px solid #fff;
                box-shadow: inset 0px 0px 0px 2px rgba(0,0,0,0.03);
            }

            ul.itemlist.alternating > li:nth-child(2n+1) a[class^="item-portalitem-art"]:hover { background-color: rgba(0,0,0,0.08); }
            a[class^="item-portalitem-art"]:hover { background-color: rgba(0,0,0,0.15); }
            ul.itemlist.alternating > li:nth-child(2n+1), ul.itemlist.alternating > li.alternate { background-color: rgba(0, 0, 0, 0.08); }

            a.item-calendar-list:hover { background-color: rgba(0,0,0,0.15); }
            a.item-calendar-list strong { color: #666; }
            a.item-calendar-list { background-color: rgba(0,0,0,0.08); }

            .highlight { color: #000 !important; }
            .fixed-form .form-row label:first-child, .fixed-form .form-row p:first-child + label, .fixed-form .form-row strong:first-child, .fixed-form .form-row .label-wrap > label:first-child, .fixed-form .form-row div.ratings-form > label {
                color: #4f4949;
            }
            body { color: #4f4949; background-color: #fff; }
            a:hover { color: #aaa; }

            body:not(.skin-userpage) div.outer div.skin-inner div.skin-bars { background: url("https://www.newgrounds.com/dump/draw/55d08128b531b127c963c4c03ba08ac7") center top repeat; }
        `);
        changeFadeColour("#d3d3e1");
    }

    // Reset currently chosen skin back to default
    function resetCurrentSkin() {
        GM_setValue("customSkinURL", "");
        GM_setValue("customFadeColour", "");
        GM_setValue("backgroundResize", false);
        GM_setValue("pixelScaling", false);
        GM_setValue("customThemeId", -1);
        GM_setValue("siteOpacity", 255);
    }

    // Convert hex code to HSL. Slightly modified but mostly stolen from: https://www.30secondsofcode.org/js/s/rgb-to-hsl/
    function RGB2HSL(rgbString) {
        let r = parseInt(rgbString.slice(1,3), 16);
        let g = parseInt(rgbString.slice(3,5), 16);
        let b = parseInt(rgbString.slice(5,7), 16);
        r /= 255;
        g /= 255;
        b /= 255;
        const l = Math.max(r, g, b);
        const s = l - Math.min(r, g, b);
        const h = s
        ? l === r
        ? (g - b) / s
        : l === g
        ? 2 + (b - r) / s 
        : 4 + (r - g) / s
        : 0;
        return [
            60 * h < 0 ? 60 * h + 360 : 60 * h,
            100 * (s ? (l <= 0.5 ? s / (2 * l - s) : s / (2 - (2 * l - s))) : 0), // genuinely what does this mean
            (100 * (2 * l - s)) / 2, 
        ];
    }

    // Convert HSL to hex code. Stolen from: https://stackoverflow.com/questions/36721830/convert-hsl-to-rgb-and-hex
    function HSL2HEX(h, s, l) {
        l /= 100;
        const a = s * Math.min(l, 1 - l) / 100;
        const f = n => {
            const k = (n + h / 30) % 12;
            const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
            return Math.round(255 * color).toString(16).padStart(2, '0'); // convert to Hex and prefix "0" if needed
        };
        return `#${f(0)}${f(8)}${f(4)}`;
    }
})();

//
// -----------------
// -     To-Do     -
// -----------------
//
// • Ability to reorder presets
// • Fix wall artist credit at the bottom of pages (probably not possible)
// • Ability to add custom skins to dropdown on settings page
// • Dedicated page to site skin customisation instead of using account settings(?)
//

// -----------------
// -   Changelog   -
// -----------------
//
// v3.2.1 (03/01/24)
// Added Winter 2024 skin
// 
// v3.2 (30/12/23) - Preset sharing
// Added preset export/importing
// Presets can now be exported as a single .json or in a .zip containing a .json for each preset
// Presets can now be imported using these exported files, with options for overwriting and replacing existing presets
// Fixed presets not updating background fade colour if the preset didn't have a custom fade colour assigned
//
// v3.1 (27/12/23) - No refreshing
// Removed "no refresh" setting. The site now never refreshes when changing site skin options
// Fixed all previous issues that came with using the "no refresh" setting
// Fixed colour themes not applying to search autocomplete and the advanced search gear icon
// "Fixed" parts of colour theme sometimes not appearing (i just apply the colour theme for a second time when the page loads lol)
// Other insignficant code changes
//
// v3.0 (17/12/23) - Skin loading rewrite
// Rewrote parts of the script for better readability and the reason below
// Custom skins now load BEFORE the main page does, meaning the default skin should no longer briefly appear
// Site now refreshes when the default skin resets and the user wants to reset their skin when this happens. Before it just didn't load the custom skin, but this is no longer possible due to the rewrite
// Presets now save background image scaling options
// Added option to disable anti-aliasing so rescaling pixel art backgrounds doesn't make them blurry (off by default)
// Added Christmas 2023 skin
// Fixed file upload backgrounds not updating properly when being applied on the settings page
//
// v2.1 (29/11/23) - Background image resizing
// Added option to resize background images so that they fit the site
//
// v2.0.2 (28/11/23)
// Removed the auto update fix that didnt work lol
//
// v2.0.1 (28/11/23)
// Added experimental light mode under advanced settings. Will likely never finish this as it isn't compatible with anything besides background skins and just looks bad.
// Fixed auto updates (maybe)
//
// v2.0 (25/11/23) - New settings page
// Remade the settings page.
// Added an advanced settings popup. Allows for directly changing theme values and other miscellaneous settings.
// Added the ability to change the background fade colour at the bottom of the page.
// Added British colour spelling option
// Added option to make the opacity slider update in real time.
// Added option to remove all currently saved settings/data.
// Fixed settings not appearing on "https://www.newgrounds.com/account#" (with the # at the end)
// Fixed popups being completely transparent
// Fixed site backgrounds sometimes not scaling height properly
//
// v1.4.1 (01/11/23)
// Added Alien Hominid HD skin
//
// v1.4.0 (13/09/23) - File uploads, custom themes and presets
// Site backgrounds can now be uploaded directly from files instead of just via URL. Loads slower but is more convenient
// Custom theme colours can now be chosen instead of the original profile page themes
// Added the ability to create site skin presets which load both a skin, theme and bg opacity
// Given everything in the settings area hover text
// Added Madness Day 2023 skin
//
// v1.3.0 (22/08/23) - Site opacity
// Added the ability to change the site's opacity
// Added wall artist next to dropdown box on settings page
// Fixed ETMA ratings on submissions being affected by custom colour themes
// Added Boxcar City RUSH, Everything By Everyone, Newgrounds Audio Deathmatch 2019, Piconjo Day 2021, Robot Day 2023 and 4 more Madness Day 2021 skins
//
// v1.2.2 (18/08/23)
// Fixed some more places not showing custom colour themes
//
// v1.2.1 (18/08/23)
// Fixed some places not showing custom colour themes
//
// v1.2.0 (17/08/23) - Colour themes
// Added the option to change link/icon colours of the site too (themes)
//
// v1.1.0 (15/08/23)
// Made the site background scale with the image height
// Dropdown box in account settings remembers your choice when re-visiting the page
// Added the option to reset the site skin when the default one is updated (on by default)
// Added New Years 2023, mleth and TSIOQUE skin
//
// v1.0.1 (15/08/23)
// Added Clock Day 2023 skin
//
// v1.0.0 (14/08/23) - Background image changing
// Site background can now change to any image URL
// URL can be set from a dropdown or from text input in the account settings page
//