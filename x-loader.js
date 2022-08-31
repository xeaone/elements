// Copyright Alexander Elias. All rights reserved. MIT license.

export default class XLoader extends HTMLElement {

    static define () {
        customElements.define('x-loader', XLoader)
    }

    #shadow = /*html*/ `
    <style>
        :host {
            --x-loader-icon-color: rgb(0, 0, 0);
            --x-loader-background: rgba(0, 0, 0, 0.1);
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            display: flex;
            position: absolute;
            align-items: center;
            justify-content: center;
            background-color: var(--x-loader-background);
        }
        .x-loader {
            width: 60px;
            height: 60px;
            padding: 3px;
            position: relative;
        }
        .x-loader div {
            top: 50%;
            left: 50%;
            opacity: 0;
            position: absolute;
            border-radius: 50%;
            transform: translate(-50%, -50%);
            border: 3px solid var(--x-loader-icon-color);
            animation: x-loader-ripple infinite 900ms cubic-bezier(0, 0.3, 0.9, 1);
        }
        .x-loader div:nth-child(2) {
            animation-delay: 300ms;
        }
        @keyframes x-loader-ripple {
            0% {
                width: 0;
                height: 0;
                opacity: 0.9;
            }
            100% {
                opacity: 0;
                width: 60px;
                height: 60px;
            }
        }
    </style>
    <div class="x-loader" part="icon">
        <div></div>
        <div></div>
    </div>
	`;

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = this.#shadow;
    }

}