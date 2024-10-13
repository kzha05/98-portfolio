const desktop = document.getElementById('desktop');
const icons = desktop.querySelectorAll('.icon-wrapper');
const body = document.querySelector('body');
const taskbar = document.getElementById('taskbar');
const bigDeleteButton = document.getElementById('deletebutton');
const cancel = document.getElementById('cancel');
const deleteButton = document.getElementById('delete');
const iconsArray = Array.from(icons);

const buttons = [];
const windows = [];

function unactiveAllButtons() {
	buttons.forEach(button => {
		button.classList.remove('active');
	});
}

export {
	desktop,
	icons,
	body,
	taskbar,
	buttons,
	windows,
	unactiveAllButtons,
	bigDeleteButton,
	cancel,
	deleteButton,
	iconsArray
};
