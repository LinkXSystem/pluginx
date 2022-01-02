function getClassName(dom) {
    const { parentNode } = dom;

    let names = [];

    let tag = dom.tagName;

    if (tag === 'BODY') {
        return [];
    }

    if(parentNode) {
        let name = getClassName(parentNode);
        names.push(...name);
    }

    let name = dom.className;

    if(!name) {
        names.push(tag.toLowerCase());
    }

    if (name) {
        names.push(name.split(' ').map(item => `.${item}`).join(''));
    }

    return names
}