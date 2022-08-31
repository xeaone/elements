// Copyright Alexander Elias. All rights reserved. MIT license.

export default class XToast extends HTMLElement {

    static define() {
        customElements.define('x-toast', XToast);
    }

    actions = [];

    get time() {
        return this._time || 3000;
    }

    set time(time) {
        return this._time = time || 3000;
    }

    open(data) {
        const time = data.time || this.time;
        const toast = document.createElement('div');
        const title = document.createElement('div');
        const message = document.createElement('div');

        toast.setAttribute('class', 'x-toast');
        title.setAttribute('class', 'x-toast-title');
        message.setAttribute('class', 'x-toast-message');

        title.textContent = data.title || '';
        message.textContent = data.message || '';

        toast.appendChild(title);

        if (data.title && data.message) {
            const seperator = document.createTextNode(typeof data.seperator === 'string' ? data.seperator : '\u00A0');
            toast.appendChild(seperator);
        }

        toast.appendChild(message);

        if (data.type || data.code) {
            const code = data.code;
            const type = data.type || data.code;

            if (typeof type === 'number') {
                if (code >= 200 && code < 300 || code == 304) {
                    type = 'success';
                } else {
                    type = 'error';
                }
            }

            toast.style.setProperty('background-color', `var(--x-toast-${type})`);
        }

        this.shadowRoot.appendChild(toast);

        const action = () => requestAnimationFrame(() => requestAnimationFrame(() => {
            toast.classList.add('active');
            if (!this.shadowRoot.contains(toast)) return;
            setTimeout(() => {
                if (!this.shadowRoot.contains(toast)) return;
                toast.classList.remove('active');
                this.actions.shift();
                this.actions[0]?.();
                requestAnimationFrame(() => requestAnimationFrame(() => toast.remove()));
            }, time);
        }));

        toast.addEventListener('click', () => {
            toast.classList.remove('active');
            this.actions.shift();
            this.actions[0]?.();
            requestAnimationFrame(() => requestAnimationFrame(() => toast.remove()));
        });

        if (!this.actions.length) action();
        this.actions.push(action);

    }

    #shadow = /*html*/ `
    <style>
        :host {
            --x-toast-font-size: 1rem;
            left: 0;
            bottom: 0;
            z-index: 1;
            width: 100%;
            display: block;
            position: fixed;
            overflow: hidden;
            counter-reset: toast;
            pointer-events: none;
            box-sizing: border-box;
            background: var(--x-toast-host-background);
            height: calc(var(--x-toast-font-size) + 0.4rem);
        }
        .x-toast {
            width: 100%;
            display: flex;
            cursor: pointer;
            padding: 0.2rem;
            position: absolute;
            align-items: center;
            pointer-events: auto;
            box-sizing: border-box;
            justify-content: center;
            transition: transform linear 150ms;
            font-size: var(--x-toast-font-size);
            background: var(--x-toast-background);
        }
        .x-toast-title {
            text-transform: capitalize;
            color: var(--x-toast-color);
            font-size: var(--x-toast-font-size);
        }
        .x-toast-message {
            text-transform: capitalize;
            color: var(--x-toast-color);
            font-size: var(--x-toast-font-size);
        }
        .x-toast.active {
            transform: translate(0, 0);
        }
        .x-toast:not(.active) {
            transform: translate(0, 100%);
        }
    </style>
    `;

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = this.#shadow;
    }

}