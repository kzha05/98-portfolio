import { body, buttons, taskbar, unactiveAllButtons, windows } from '../constants.js';
import createTaskbarButton from './createTaskbarButton.js';
import layering from '../layering.js';

function createWindow(name, image, iconTitle, applicationrender, wleft, wtop) {
	const windowElement = document.createElement('figure');
	windowElement.className = 'window';
	const clientWidth = document.documentElement.clientWidth;
	const clientHeight = document.documentElement.clientHeight;
	console.log('clientWidth:', clientWidth);
	console.log('clientHeight:', clientHeight);
	const portrait = clientWidth < clientHeight;
	if (portrait) {console.log('portrait detect')}

	const windowWidth = portrait ? clientWidth : clientWidth / 2;
	const windowHeight = portrait ? clientHeight / 3 : clientHeight / 2;
	const windowLeft = wleft ?? clientWidth / 2 - windowWidth / 2 + Math.floor(Math.random() * 200 - 100);
	const windowTop = wtop ?? clientHeight / 2 - windowHeight / 2 + Math.floor(Math.random() * 200 - 100);

	windowElement.style.left = portrait ? '0px' : isNaN(wleft) ? wleft : `${ windowLeft }px`;
	windowElement.style.top = isNaN(wtop) ? wtop : `${ windowTop }px`;
	windowElement.style.width = `${ windowWidth }px`;
	windowElement.style.height = `${ windowHeight }px`;

	let isDragging = false;
	let offsetX, offsetY;

	function hideWindow() {
		windowElement.animate([{ transform: 'scale(1)' }, { transform: 'scale(0) translate(-100%, -100%)' }], {
			duration: 200, easing: 'ease-in-out',
		}).onfinish = () => {
			windowElement.style.display = 'none';
		};
		unactiveAllButtons();
	}

	function bringWindowToFront(e, intent) {
		windowElement.style.display = 'block';
		layering.incrementHighestZIndex();
		windowElement.style.zIndex = layering.getHighestZIndex().toString();

		if (intent === 'drag') {
			isDragging = true;
			const rect = windowElement.getBoundingClientRect();
			offsetX = e.clientX - rect.left;
			offsetY = e.clientY - rect.top;

			document.addEventListener('mousemove', onMouseMove);
			document.addEventListener('mouseup', onMouseUp);
		}
	}

	function onMouseMove(e) {
		if (isDragging) {
			const left = e.clientX - offsetX;
			const top = e.clientY - offsetY;

			windowElement.style.left = `${ left }px`;
			windowElement.style.top = `${ top }px`;
		}
	}

	function onMouseUp() {
		isDragging = false;
		windowElement.style.opacity = '';
		document.removeEventListener('mousemove', onMouseMove);
		document.removeEventListener('mouseup', onMouseUp);
	}

	const button = createTaskbarButton(name, image, iconTitle, bringWindowToFront);

	windowElement.addEventListener('mousedown', e => {
		unactiveAllButtons();
		bringWindowToFront(e, 'drag');
		button.classList.add('active');
	});

	bringWindowToFront();

	const minimizeButton = document.createElement('button');
	minimizeButton.className = 'window-header-button window-header-button1';
	const minimizeIcon = document.createElement('i');
	minimizeIcon.className = 'fas fa-window-minimize';
	minimizeButton.appendChild(minimizeIcon);
	minimizeButton.addEventListener('click', () => {
		hideWindow();
	});

	const maximizeButton = document.createElement('button');
	maximizeButton.className = 'window-header-button window-header-button2';
	const maximizeIcon = document.createElement('img');
	maximizeIcon.src = 'img/icons/maximize-1.png';
	maximizeIcon.style.maxHeight = '13px';
	maximizeIcon.style.objectFit = 'contain';
	maximizeButton.appendChild(maximizeIcon);
	maximizeButton.addEventListener('click', () => {
		const clientWidth = document.documentElement.clientWidth;
		const clientHeight = document.documentElement.clientHeight;
		if (windowElement.style.height === `${ clientHeight - taskbar.clientHeight }px`) {
			maximizeIcon.src = 'img/icons/maximize-1.png';
			windowElement.style.width = `${ windowWidth }px`;
			windowElement.style.height = `${ windowHeight }px`;
			windowElement.style.left = portrait ? '0px' : `${ windowLeft }px`;
			windowElement.style.top = portrait ? `${clientHeight / 2 - windowHeight / 2}px` : `${ windowTop }px`;
			layering.incrementHighestZIndex();
			windowElement.style.zIndex = layering.getHighestZIndex().toString();
		} else {
			maximizeIcon.src = 'img/icons/maximize-2.png';
			windowElement.style.width = `${ clientWidth }px`;
			windowElement.style.height = `${ clientHeight - taskbar.clientHeight }px`;
			windowElement.style.left = '0';
			windowElement.style.top = '0';
			windowElement.style.zIndex = (layering.getHighestZIndex() * 50).toString();
		}

	});

	const closeButton = document.createElement('button');
	closeButton.className = 'window-header-button window-header-button3';
	const closeIcon = document.createElement('i');
	closeIcon.className = 'fas fa-times';
	closeButton.appendChild(closeIcon);
	closeButton.addEventListener('click', () => {
		windowElement.remove();
		button.remove();
		buttons.splice(buttons.indexOf(button), 1);
		windows.splice(windows.indexOf(windowElement), 1);
		unactiveAllButtons();
	});


	// First, insert the static part of the HTML into the DOM
	windowElement.insertAdjacentHTML('beforeend', `
    <header class="window-header">
        <div class="window-header-identity">
            <img class="window-header-identity-image" src="${ image }" alt="${ name }">
            <span class="window-header-identity-title">${ iconTitle + name }</span>
        </div>
        <div class="window-header-buttons">
        	<!-- Minimize button -->
			<!-- Maximize button -->
			<!-- Close button -->
        </div>
    </header>
    <main class="window-content">
        
    </main>
`);

	if (applicationrender !== undefined) {
		fetch(`applicationrenders/${ applicationrender }`)
			.then(response => response.text())
			.then(html => {
				windowElement.querySelector('.window-content').insertAdjacentHTML('beforeend', html);

				// Find and execute any script tags
				const scripts = windowElement.querySelectorAll('.window-content script');
				scripts.forEach(script => {
					const newScript = document.createElement('script');
					newScript.type = 'module';
					newScript.textContent = script.textContent;
					body.appendChild(newScript);
					body.removeChild(newScript);
				});
			})
			.catch(error => {
				console.error('Error fetching content:', error);
				windowElement.querySelector('.window-content').textContent = 'Error fetching content';
			});
	}

	windowElement.querySelector('.window-header-buttons').appendChild(minimizeButton);
	windowElement.querySelector('.window-header-buttons').appendChild(maximizeButton);
	windowElement.querySelector('.window-header-buttons').appendChild(closeButton);

	windows.push(windowElement);
	buttons.push(button);

	body.appendChild(windowElement);
}

export default createWindow;
