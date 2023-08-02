
export const disableSide = () => {
    const divElement = document.querySelector('.customSide');
    const linkElements = divElement.querySelectorAll('.customNavLink');
    linkElements.forEach(linkElement => {
        linkElement.classList.add('disabled');
    });
}

export const enableSide = () => {
    const divElement = document.querySelector('.customSide');
    const linkElements = divElement.querySelectorAll('.customNavLink');
    linkElements.forEach(linkElement => {
        linkElement.classList.remove('disabled');
    });
}