// Copyright Alexander Elias. All rights reserved. MIT license.

export default class XDialog extends HTMLElement {

    static define() {
        customElements.define('x-dialog', XDialog);
    }

    result = null;

    #no;
    #yes;
    #form;
    #title;
    #close;
    #input;
    #submit;
    #dialog;
    #message;

    #shadow = /*html*/`
    <dialog part="dialog">
        <form part="form" method="dialog">
            <slot name="title"></slot>
            <slot name="message"></slot>
            <slot name="yes"></slot>
            <slot name="no"></slot>
            <slot name="input"></slot>
            <slot name="submit"></slot>
            <slot name="close"></slot>
        </form>
    </dialog>
    `;

    #reset () {
        this.#form.reset();
        this.#input.value = null;
        this.#dialog.returnValue = null;
        this.#title.textContent = '';
        this.#dialog.returnValue = '';
        this.#message.textContent = '';
        this.#no.style.display = 'none';
        this.#yes.style.display = 'none';
        this.#close.style.display = 'none';
        this.#input.style.display = 'none';
        this.#submit.style.display = 'none';
    }

    prompt (title, message) {
        if (this.#dialog.hasAttribute('open')) {
            throw new Error('dialog open');
        } else {
            this.result = null;
            this.#dialog.returnValue = null;
            this.#input.style.display = null;
            this.#submit.style.display = null;
            this.#title.textContent = title ?? '';
            this.#message.textContent = message ?? '';
            this.#dialog.showModal();
            return new Promise(resolve => this.#dialog.onclose = () => resolve(this.result));
        }
    }

    question (title, message) {
        if (this.#dialog.hasAttribute('open')) {
            throw new Error('dialog open');
        } else {
            this.result = null;
            this.#no.style.display = null;
            this.#yes.style.display = null;
            this.#title.textContent = title ?? '';
            this.#message.textContent = message ?? '';
            this.#dialog.showModal();
            return new Promise(resolve => this.#dialog.onclose = () => resolve(this.result));
        }
    }

    notify (title, message) {
        if (this.#dialog.hasAttribute('open')) {
            throw new Error('dialog open');
        } else {
            this.result = null;
            this.#close.style.display = null;
            this.#title.textContent = title ?? '';
            this.#message.textContent = message ?? '';
            this.#dialog.showModal();
            return new Promise(resolve => this.#dialog.onclose = () => resolve(this.result));
        }
    }

    close (result) {
        this.result = result;
        this.#dialog.close();
        this.#reset();
        return result;
    }

    constructor () {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = this.#shadow;
        this.#form = this.shadowRoot.querySelector('form');
        this.#dialog = this.shadowRoot.querySelector('dialog');
    }

    connectedCallback () {
        this.#title = this.shadowRoot.querySelector('slot[name="title"').assignedNodes()[0];
        this.#message = this.shadowRoot.querySelector('slot[name="message"').assignedNodes()[0];

        this.#no = this.shadowRoot.querySelector('slot[name="no"').assignedNodes()[0];
        this.#yes = this.shadowRoot.querySelector('slot[name="yes"').assignedNodes()[0];
        this.#no?.addEventListener('click', () => this.close(false));
        this.#yes?.addEventListener('click', () => this.close(true));

        this.#close = this.shadowRoot.querySelector('slot[name="close"').assignedNodes()[0];
        this.#close?.addEventListener('click', () => this.close());

        this.#input = this.shadowRoot.querySelector('slot[name="input"').assignedNodes()[0];
        this.#submit = this.shadowRoot.querySelector('slot[name="submit"').assignedNodes()[0];
        this.#submit?.addEventListener('click', () => this.close(this.#input?.value));

        this.#reset();
    }

}