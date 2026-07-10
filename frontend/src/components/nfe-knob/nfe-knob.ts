// -- CONSTANTES --

const MIN_ANGLE = -135;
const MAX_ANGLE = 135;
const DRAG_SENSITIVITY_PX = 150;
const EVENT_NAME = 'nfe-change';
const TAG_NAME = 'nfe-knob';

// - INTERFAZ TYPESCRIPT

export interface KnobAttributes {
    value: string;
    min: string;
    max: string;
    label: string;
}

interface KnobChangeDetail {
    value: number;
}

// -- TEMPLATE --

function createTemplate(): string {
    return `
        <style>
            :host {
                display: inline-flex;
                flex-direction: column;
                align-items: center;
                gap: 6px;
                cursor: ns-resize;
                user-select: none;
                -webkit-user-select: none;
                font-family: inherit;
                touch-action: none; 
                }

                .knob-wrapper {
                width: 56px;
                height: 56px;
                position: relative;
                background: #1b1430;
                border: 3px solid;
                border-color: #14101f #554a75 #554a75 #14101f;
                }

                .knob-body {
                position: absolute;
                inset: 6px;
                background: linear-gradient(135deg, #3d3358 0%, #241d38 60%, #1b1430 100%);
                border: 2px solid;
                border-color: #6a5f8a #14101f #14101f #6a5f8a;
                }

                .dial {
                position: absolute;
                inset: 0;
                transform-origin: center center;
                will-change: transform;
                }

                .indicator {
                width: 6px;
                height: 12px;
                background: var(--nfe-accent, #00ffff);
                position: absolute;
                top: 2px;
                left: 50%;
                transform: translateX(-50%);
                box-shadow: 0 0 6px var(--nfe-accent, #00ffff);
                }

                .label {
                font-family: inherit;
                font-size: 7px;
                color: #7d739e;
                letter-spacing: 1px;
                text-transform: uppercase;
                }

                .value-display {
                font-family: inherit;
                font-size: 9px;
                color: var(--nfe-accent, #00ffff);
                min-width: 3ch;
                text-align: center;
                background: #14101f;
                padding: 4px 6px;
                border: 2px solid;
                border-color: #14101f #3d3358 #3d3358 #14101f;
                }
        </style>

        <div class="knob-wrapper">
            <div class="knob-body">
                <div class="dial">
                <div class="indicator"></div>
                </div>
            </div>
        </div>
        <span class="label"></span>
        <span class="value-display"></span>
    `
}

// -- CLASE --

class NfeKnob extends HTMLElement {
    
    private _value: number = 0;
    private _min: number = 0;
    private _max: number = 100;
    private _label: string = "";
    private _isDragging: boolean = false;
    private _dragStartY: number = 0;
    private _dragStartValue: number = 0;
    private _knobWrapper!: HTMLElement;
    private _valueDisplay!: HTMLElement;
    private _labelEl!: HTMLElement;
    private _dial!: HTMLElement;

    constructor() {

        super();

        const shadow = this.attachShadow({ mode: 'open'});

        shadow.innerHTML = createTemplate();

        this._knobWrapper = shadow.querySelector('.knob-wrapper') as HTMLElement;
        this._valueDisplay = shadow.querySelector('.value-display') as HTMLElement;
        this._labelEl = shadow.querySelector('.label') as HTMLElement;

        this._onpointerdown = this._onpointerdown.bind(this);
        this._onpointermove = this._onpointermove.bind(this);
        this._onpointerup = this._onpointerup.bind(this);

        this._dial = shadow.querySelector('.dial') as HTMLElement;
    }

    // -- OBSERVED ATTRIBUTES --
    static get observedAttributes(): string[] {
        return ['value', 'min', 'max', 'label']
    }

    // --ATRIBUTE CHANGE CALLBACK --

    attributeChangedCallback(
        name: string,
        _oldValue: string | null,
        newValue: string | null,
    ) : void {

        if(newValue === null) return;

        switch(name) {
            case 'value':
                this._value = Math.min(
                    Math.max(parseFloat(newValue), this._min),
                    this._max
                );
                break;
            case 'min':
                this._min = parseFloat(newValue);
                this._value = Math.max(this._value, this._min);
                break;
            case 'max':
                this._max = parseFloat(newValue);
                this._value = Math.min(this._value, this._max);
                break;
            case 'label':
                this._label = newValue;
                break;
        }
        this._render();
    }

// -- CONNECTED CALLBACK --

    connectedCallback(): void{
        this._knobWrapper.addEventListener('pointerdown', this._onpointerdown);
        this._render();
    }

// DISCONNECTED CALLBACK --

    disconnectedCallback(): void{
        this._knobWrapper.removeEventListener('pointerdown', this._onpointerdown);
        document.removeEventListener('pointermove', this._onpointermove);
        document.removeEventListener('pointerup', this._onpointerup);
    }

// -- LÓGICA DEL DRAG --

    private _onpointerdown(e: MouseEvent): void{
        this._isDragging = true;
        this._dragStartY = e.clientY;
        this._dragStartValue = this._value;

        document.addEventListener('pointerup', this._onpointerup);
        document.addEventListener('pointermove', this._onpointermove);
    }

    private _onpointermove(e: MouseEvent): void {
        if(!this._isDragging) return;
            const delta = this._dragStartY - e.clientY;
            const sensitivity = (this._max - this._min) / DRAG_SENSITIVITY_PX
            const rawValue = this._dragStartValue + delta * sensitivity;
            this._value = Math.min(Math.max(rawValue, this._min), this._max);

            this._render();
            this._emitChange();
        }

    private _onpointerup(): void{
        this._isDragging = false;
        document.removeEventListener('pointermove', this._onpointermove);
        document.removeEventListener('pointerup', this._onpointerup);
    }

    private _mapValueToAngle(value: number, min: number, max: number): number{
        if (min===max) return MIN_ANGLE;
        const normalizado = (value - min) / (max - min);
        return normalizado * (MAX_ANGLE - MIN_ANGLE) + MIN_ANGLE;
    }

    private _render(): void {
    const angulo = this._mapValueToAngle(this._value, this._min, this._max);
    this._dial.style.transform = `rotate(${angulo}deg)`;
    this._valueDisplay.textContent = String(Math.round(this._value));
    this._labelEl.textContent = this._label;
    }

    private _emitChange(): void {
    const detail: KnobChangeDetail = { value: this._value };
    const evento = new CustomEvent<KnobChangeDetail>(EVENT_NAME, {
        detail,
        bubbles: true,
        composed: true
    });
    this.dispatchEvent(evento);
    }
}

    customElements.define(TAG_NAME, NfeKnob)
    export type {KnobChangeDetail}