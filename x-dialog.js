// Copyright Alexander Elias. All rights reserved. MIT license.

class XDialog extends HTMLElement {

    static define() {
        customElements.define('x-dialog', XDialog);
    }

    #no;
    #yes;
    #form;
    #title;
    #dialog;
    #message;

    #shadow = /*html*/`
    <dialog part="dialog">
        <form part="form" method="dialog">
            <slot name="title"></slot>
            <slot name="message"></slot>
            <slot name="yes"></slot>
            <slot name="no"></slot>
        </form>
    </dialog>
    `;

    open (title, message) {
        if (this.#dialog.hasAttribute('open')) {
            throw new Error('dialog open');
        } else {
            this.#dialog.showModal();
            this.#title.textContent = title ?? '';
            this.#message.textContent = message ?? '';
            return new Promise(resolve => this.#dialog.onclose = () => {
                const value = this.#dialog.returnValue;
                this.#form.reset();
                this.#title.textContent = '';
                this.#dialog.returnValue = '';
                this.#message.textContent = '';
                resolve(value);
            });
        }
    }

    close (event) {
        const value = event.target.value;
        this.#dialog.returnValue = value;
        this.#dialog.close();
        return value;
    }

    constructor () {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = this.#shadow;
        this.#form = this.shadowRoot.querySelector('form');
        this.#dialog = this.shadowRoot.querySelector('dialog');
    }

    connectedCallback () {
        this.#message = this.shadowRoot.querySelector('slot[name="message"').assignedNodes()[0];
        this.#title = this.shadowRoot.querySelector('slot[name="title"').assignedNodes()[0];
        this.#yes = this.shadowRoot.querySelector('slot[name="yes"').assignedNodes()[0];
        this.#no = this.shadowRoot.querySelector('slot[name="no"').assignedNodes()[0];
        this.#yes?.addEventListener('click', (event) => this.close(event));
        this.#no?.addEventListener('click', (event) => this.close(event));
    }

}