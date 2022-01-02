const DEFAULT_STORAGE_NAMESPACE = 'plugin';

function handleGetClassName(dom) {
    const { parentNode } = dom;

    let names = [];

    let tag = dom.tagName;

    if(tag === 'BODY') {
        return [];
    }

    if(parentNode) {
        let name = handleGetClassName(parentNode);
        names.push(...name);
    }

    let name = dom.className;

    if(!name) {
        names.push(tag.toLowerCase());
    }

    if(name) {
        names.push(name.split(' ').map(item => `.${item}`).join(''));
    }

    return names
}

function handleHighlight() {
    const selection = window.getSelection();

    const dom = selection.baseNode.parentNode;
    const node = selection.baseNode;

    const { nodeType } = node;

    if(nodeType !== Node.TEXT_NODE) return;

    const { anchorOffset, focusOffset } = selection;

    const _target = node.textContent.slice(anchorOffset, focusOffset);

    let content = dom.innerHTML;

    content = content.replace(_target, `<span style="color: red;">${_target}</span>`);

    dom.innerHTML = content;

    const paths = handleGetClassName(dom);

    localStorage.setItem(DEFAULT_STORAGE_NAMESPACE, JSON.stringify({
        highlight: [
            {
                path: paths.join('>'),
                meta: {
                    anchor: anchorOffset,
                    length: focusOffset,
                    color: 'red'
                }
            }
        ]
    }));
}

function handleKeydown(event) {
    const { key, code, ctrlKey, shiftKey, altKey, metaKey } = event;

    const isCtrlKey = ctrlKey;
    const isMetaKey = metaKey;

    let _code = [];

    if(isMetaKey) {
        _code.push('meta');
    }

    _code.push(key);

    _code = _code.join('-').toUpperCase();

    switch(_code) {
        case ('META-M'): {
            handleHighlight();
            break;
        }
        default: {
        }
    }

}

(function main() {
    document.addEventListener('keydown', handleKeydown);

    window.onload = function() {
        const storage = localStorage.getItem(DEFAULT_STORAGE_NAMESPACE);
        if(storage) {
            const _data = JSON.parse(storage);

            const { highlight } = _data;

            for(let i = 0; i < highlight.length; i++) {
                const item = highlight[i];

                const { path, meta } = item;
                const { anchor, length } = meta;

                const dom = document.querySelector(path);

                const _target = dom.textContent.slice(anchor, length);

                let content = dom.innerHTML;

                content = content.replace(_target, `<span style="color: red;">${_target}</span>`);

                dom.innerHTML = content;
            }
        }
    }
})();
