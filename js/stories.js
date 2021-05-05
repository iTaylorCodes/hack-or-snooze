'use strict';

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
	storyList = await StoryList.getStories();
	$storiesLoadingMsg.remove();

	putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
	// console.debug("generateStoryMarkup", story);

	const hostName = story.getHostName();

	// Checks if there's a logged in user
	const showStar = Boolean(currentUser);

	// Checks if story is a favorite
	const isFav = currentUser.checkFavStatus(story);

	// Stars to show depending on if a favorite or not
	const favStarHTML = '<span class="star fav-star">&#9733;</span>';
	const nonFavStarHTML = '<span class="star non-fav-star">&#9734;</span>';

	// Returns story HTML with fav stars if a user is logged in
	if (showStar) {
		return $(`
			<li id="${story.storyId}">
				${isFav ? favStarHTML : nonFavStarHTML}
				<a href="${story.url}" target="a_blank" class="story-link">
				${story.title}
				</a>
				<small class="story-hostname">(${hostName})</small>
				<small class="story-author">by ${story.author}</small>
				<small class="story-user">posted by ${story.username}</small>
			</li>
		`);
	}

	// Returns story HTML without fav stars if no user logged in
	return $(`
	  <li id="${story.storyId}">
	    <a href="${story.url}" target="a_blank" class="story-link">
	      ${story.title}
	    </a>
	    <small class="story-hostname">(${hostName})</small>
	    <small class="story-author">by ${story.author}</small>
	    <small class="story-user">posted by ${story.username}</small>
	  </li>
	`);
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
	console.debug('putStoriesOnPage');

	$allStoriesList.empty();

	// loop through all of our stories and generate HTML for them
	for (let story of storyList.stories) {
		const $story = generateStoryMarkup(story);
		$allStoriesList.append($story);
	}

	$allStoriesList.show();
}

// Handler for submitting new story form
const $submitStoryForm = $('#newstory-form');

async function onNewStorySubmit(evt) {
	console.debug('onNewStorySubmit');
	evt.preventDefault();

	// new story form inputs
	const title = $('#story-title').val();
	const author = $('#story-author').val();
	const url = $('#story-url').val();

	const user = currentUser.username;

	const newStoryObj = { title, author, url, user };

	// creates the new story and prepends it to story list
	const newStory = await storyList.addStory(currentUser, newStoryObj);
	const story = generateStoryMarkup(newStory);
	$allStoriesList.prepend(story);

	// resets and hides form
	$submitStoryForm.trigger('reset');
	$submitStoryForm.hide();
	$allStoriesList.show();
}

$submitStoryForm.on('submit', onNewStorySubmit);

// Handler for adding/removing a favorite story
async function toggleStoryFavorite(evt) {
	console.debug('toggleStoryFavorite');

	const $target = $(evt.target);
	const $parentLi = $target.closest('li');
	const storyId = $parentLi.attr('id');
	const story = storyList.stories.find((s) => s.storyId === storyId);

	//  Check is the target story is a favorite
	if ($target.hasClass('fav-star')) {
		// If target story is a favorite, unfavorite it and empty star icon
		await currentUser.removeFavoriteStory(story);
		$target.toggleClass('fav-star');
		$target.toggleClass('non-fav-star');
		$target.html('&#9734;');
	} else {
		// If target story is not a favorite, favorite it and fill star icon
		await currentUser.addFavoriteStory(story);
		$target.toggleClass('non-fav-star');
		$target.toggleClass('fav-star');
		$target.html('&#9733;');
	}
}

$storiesLists.on('click', '.star', toggleStoryFavorite);
