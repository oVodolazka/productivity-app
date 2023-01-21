

export const setPriorityClass = (priority) => {
    const classes = {
        'URGENT': 'settings__daily-icon--red', 'HIGH': 'settings__daily-icon--orange', 'MIDDLE': 'settings__daily-icon--yellow', 'LOW': 'settings__daily-icon--green',
    }
    const result = String(priority.toUpperCase())
    return classes[result]
}

export const setCategoryClass = (category) => {
    const classes = {
        'WORK': 'settings__daily--yellow', 'EDUCATION': 'settings__daily--blue', 'HOBBY': 'settings__daily--red', 'SPORT': 'settings__daily--violet', 'OTHER': 'settings__daily--darkblue',
    }
    const result = String(category.toUpperCase())
    return classes[result]
}

export const defineDay = (date) => {
    let today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();
    today = dd + '.' + mm + '.' + yyyy;

    let tomorrow = new Date();
    const ddTom = tomorrow.getDate() + 1;
    tomorrow = String(ddTom) + '.' + mm.padStart(2, '0') + '.' + yyyy;

    let yesterday = new Date();
    const ddYes = yesterday.getDate() - 1;
    yesterday = String(ddYes) + '.' + mm.padStart(2, '0') + '.' + yyyy;

    if (date == today) {
        return 'Today'
    } else if (date == yesterday) {
        return 'Yesterday'
    } else if (date == tomorrow) {
        return 'Tomorrow'
    }
    return date
}

export const createElement = (tagName, parent, classes, innerHTML, attributes = []) => {
    const elem = document.createElement(tagName)
    attributes.forEach(item => {
        let keys = Object.keys(item)
        for (let key of keys) {
            elem.setAttribute(key, item[key])
        }
    })
    classes.forEach(item => {
        elem.classList.add(item)
    })
    if (innerHTML) {
        elem.innerHTML = innerHTML
    }
    parent.appendChild(elem)
    return elem
}

export const getDay = () => {
    let getDay = new Date();
    const dd = String(getDay.getDate()).padStart(2, '0');
    const mm = String(getDay.getMonth() + 1).padStart(2, '0'); //January is 0!
    const yyyy = getDay.getFullYear();
    return getDay = dd + '.' + mm + '.' + yyyy;
}

