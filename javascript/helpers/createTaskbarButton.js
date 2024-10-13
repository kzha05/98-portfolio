import { taskbar, unactiveAllButtons } from '../constants.js';

function createTaskbarButton(name, image, iconTitle, bringWindowToFront) {
	const button = document.createElement('button');
	button.className = 'taskbar-button active';
	button.addEventListener('click', e => {
		unactiveAllButtons();
		bringWindowToFront(e);
		button.classList.add('active');
	});

	button.insertAdjacentHTML('beforeend', `
		<img class="taskbar-button-image" src="${ image }" alt="${ name }">
		<span class="taskbar-button-title">${ iconTitle + name }</span>
	`);

	taskbar.appendChild(button);

	return button;
}

export default createTaskbarButton;
