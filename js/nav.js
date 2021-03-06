'use strict';

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
	console.debug('navAllStories', evt);
	hidePageComponents();
	putStoriesOnPage();
}

$body.on('click', '#nav-all', navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
	console.debug('navLoginClick', evt);
	hidePageComponents();
	$loginForm.show();
	$signupForm.show();
}

$navLogin.on('click', navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
	console.debug('updateNavOnLogin');
	$('.main-nav-links').show();
	$navLogin.hide();
	$navLogOut.show();
	$navSpacers.show();
	$navUserProfile.text(`${currentUser.username}`).show();
}

// Show add story form when click on "Submit Story"

function navSubmitClick(evt) {
	console.debug('navSubmitClick', evt);
	hidePageComponents();
	$('#newstory-form').show();
}

$('#nav-submit').on('click', navSubmitClick);

// Show user favorite stories when click on "Favorite Stories"

function navFavoriteStoriesClick(evt) {
	console.debug('navFavoriteStoriesClick', evt);
	hidePageComponents();
	putFavoriteStoriesOnPage();
}

$body.on('click', '#nav-favorites', navFavoriteStoriesClick);

// Show user favorite stories when click on "My Stories"

function navMyStoriesClick(evt) {
	console.debug('navMyStoriesClick', evt);
	hidePageComponents();
	putOwnStoriesOnPage();
}

$body.on('click', '#nav-own-stories', navMyStoriesClick);
