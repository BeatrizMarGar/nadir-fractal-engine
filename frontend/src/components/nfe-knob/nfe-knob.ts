// -- CONSTANTES --

const MIN_ANGLE = -135;
const MAX_ANGLE = 135;
const DRAG_SENSITIVITY_PX = 150;
const EVENT_NAME = 'nfe-change';
const TAG_NAME = 'nfe-knob';

// - INTERFAZ TYPESCRIPT

interface KnobAttributes {
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
                gap: 8px;
                cursor: ns-resize;
                user-select: none;
            }
            
            .knob-wrapper {
                width: 48px;
                height: 48px;
                transform-origin: center center;
                will-change: transform;
                cursor: ns-resize;
            }

            .knob-body {
                width: 100%;
                height: 100%;
                background: #0a0a0f;
                border: 2px solid var(--nfe-accent, #00ffff);
                box-shadow: 0 0 8px var(--nfe-accent, #00ffff);
            }

            .indicator {
                width: 4px;
                height: 12px;
                background: var(--nfe-accent, #00ffff);
                margin: 0 auto;
                box-shadow: 0 0 6px var(--nfe-accent, #00ffff);
            }

        </style>

        <div class="knob-wrapper">
            <div class="knob-body">
                <div class="indicator"></div>
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

    constructor() {

        super();

        const shadow = this.attachShadow({ mode: 'open'});

        shadow.innerHTML = createTemplate();

        this._knobWrapper = shadow.querySelector('.knob-wrapper') as HTMLElement;
        this._valueDisplay = shadow.querySelector('.value-display') as HTMLElement;
        this._labelEl = shadow.querySelector('.label') as HTMLElement;

        this._onMouseDown = this._onMouseDown.bind(this);
        this._onMouseMove = this._onMouseMove.bind(this);
        this._onMouseUp = this._onMouseUp.bind(this);
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
        this._knobWrapper.addEventListener('mousedown', this._onMouseDown);
        this._render();
    }

// DISCONNECTED CALLBACK --

    disconnectedCallback(): void{
        this._knobWrapper.removeEventListener('mousedown', this._onMouseDown);
        document.removeEventListener('mousemove', this._onMouseMove);
        document.removeEventListener('mouseup', this._onMouseUp);
    }

// -- LÓGICA DEL DRAG --

    private _onMouseDown(e: MouseEvent): void{
        this._isDragging = true;
        this._dragStartY = e.clientY;
        this._dragStartValue = this._value;

        document.addEventListener('mouseup', this._onMouseUp);
        document.addEventListener('mousemove', this._onMouseMove);
    }

    private _onMouseMove(e: MouseEvent): void {
        if(!this._isDragging) return;
            const delta = this._dragStartY - e.clientY;
            const sensitivity = (this._max - this._min) / DRAG_SENSITIVITY_PX
            const rawValue = this._dragStartValue + delta * sensitivity;
            this._value = Math.min(Math.max(rawValue, this._min), this._max);

            this._render();
            this._emitChange();
        }

    private _onMouseUp(): void{
        this._isDragging = false;
        document.removeEventListener('mousemove', this._onMouseMove);
        document.removeEventListener('mouseup', this._onMouseUp);
    }

    private _mapValueToAngle(value: number, min: number, max: number): number{
        if (min===max) return MIN_ANGLE;
        const normalizado = (value - min) / (max - min);
        return normalizado * (MAX_ANGLE - MIN_ANGLE) + MIN_ANGLE;
    }

    private _render(): void {
    const angulo = this._mapValueToAngle(this._value, this._min, this._max);
    this._knobWrapper.style.transform = `rotate(${angulo}deg)`;
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