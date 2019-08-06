export function wrapperGenerate(id = '') {
    const wrapper = document.createElement('div');
    wrapper.id = id;
    wrapper.innerHTML = `
        <div class="container"></div>
        <br>
        <div class="container">
            <button
                id="hover"
                >hover me
            </button>
        </div>
        <div id="popper" class="popper1">
            This is a popper
        </div>
    `;
    return wrapper;
}