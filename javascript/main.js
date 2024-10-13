import { bigDeleteButton, cancel, deleteButton, iconsArray, unactiveAllButtons } from './constants.js';
import createWindow from './helpers/createWindow.js';

let iconClickCount = 0;
let lastIcon = null;
let currentDeleteIcon = null;

// null is random position
// createWindow('posts', 'img/icons/template_empty-2.png', '', 'other.html', '45vw', '43vh');
createWindow('Welcome!', 'img/icons/msn3-5.png', '', 'welcome.html', '25vw', '25vh');

function handleIconClick(event, icon) {
	return () => {
		if (lastIcon && lastIcon !== icon) {
			lastIcon.classList.remove('selected');
			iconClickCount = 0;
		}

		iconClickCount++;

		if (iconClickCount === 1) {
			icon.classList.add('selected');

			bigDeleteButton.style.display = "flex"; // Show the modal

			// Position the modal next to the mouse cursor
			const mouseX = event.clientX;
			const mouseY = event.clientY;

			// Adjust modal position slightly so it doesn't overlap the mouse
			bigDeleteButton.style.left = `${mouseX + 10}px`;
			bigDeleteButton.style.top = `${mouseY + 10}px`;

			const img = icon.querySelector('img');
			if (img.alt === "Trashcan") {
				deleteButton.style.display = "none";
			}
			if (img.alt !== "Trashcan") {
				deleteButton.style.display = "block";
			}

			currentDeleteIcon = icon;
		} else if (iconClickCount === 2) {
			icon.classList.remove('selected');
			bigDeleteButton.style.display = "none";
			iconClickCount = 0;

			unactiveAllButtons();
			const iconImage = icon.querySelector('.icon');
			const iconspan = icon.querySelector('span');
			const applicationrender = icon.dataset.applicationrender ?? undefined;
			const iconTitle = iconspan.dataset.customname === "true" ? `${iconspan.textContent + " - "}` : "";

			createWindow(iconImage.alt, iconImage.src, iconTitle, applicationrender, null, null);
		}

		lastIcon = icon;
	};
}

// Add click event listeners to each icon
iconsArray.forEach(icon => {
	icon.addEventListener('click', function(e) { handleIconClick(e,icon)() });
});

function handleClickOutside(event) {
	if (!iconsArray.some(icon => icon.contains(event.target))) {
		// Reset icon state if click is outside
		iconClickCount = 0;
		iconsArray.forEach(icon => icon.classList.remove('selected'));
		lastIcon = null;
		bigDeleteButton.style.display = "none";
	}

}

deleteButton.addEventListener("click", () => {
	if (currentDeleteIcon === null) { return; }

	const img = currentDeleteIcon.querySelector('img');

	if (img.alt === "Trashcan") {
		return;
	}

	console.log('deleted');
	currentDeleteIcon.style.display = "none";
	bigDeleteButton.style.display = "none";
});

cancel.addEventListener("click", () => {
	console.log('unclicked');
	bigDeleteButton.style.display = "none";
});

// Add click event listener to the document
document.addEventListener('click', handleClickOutside);
