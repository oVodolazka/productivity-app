import eventBus from '../../eventBus';

class WelcomeView {
    constructor() {
        this.eventBus = eventBus;
    }

    initEventListeners() {
        const goToSettingsButton = document.querySelector('.modal__button-settings')
        goToSettingsButton.addEventListener('click', () => {
            window.router.navigate('/settings')
        })

        const skipButton = document.querySelector('.modal__button-skip')
        skipButton.addEventListener('click', () => {
            window.router.navigate('/task-list')
        })
    }

}


export default WelcomeView