// frontend/src/scripts/pages/edificio.js

function toggleInfoBalloon(id) {
    const leftPanel = document.getElementById('left-panel');
    const rightPanel = document.getElementById('right-panel');
    const leftContent = document.getElementById('left-content');
    const rightContent = document.getElementById('right-content');

    if (!leftPanel || !rightPanel || !leftContent || !rightContent) return;

    const [floorNumber, side] = id.split('-');
    const floor = document.querySelector(`.floor[data-label="${floorNumber}º"]`);
    if (!floor) return;

    const targetElement = floor.querySelector(`[data-side="${side}"]`);
    if (!targetElement) return;

    const info = targetElement.getAttribute('data-info');

    if (side === 'left') {
        if (leftPanel.classList.contains('show') && leftContent.innerHTML === info) {
            leftPanel.classList.remove('show');
        } else {
            leftContent.innerHTML = info;
            leftPanel.classList.add('show');
            rightPanel.classList.remove('show');
        }
    } else {
        if (rightPanel.classList.contains('show') && rightContent.innerHTML === info) {
            rightPanel.classList.remove('show');
        } else {
            rightContent.innerHTML = info;
            rightPanel.classList.add('show');
            leftPanel.classList.remove('show');
        }
    }
}

export function initEdificioPage() {
    window.toggleInfoBalloon = toggleInfoBalloon;
}