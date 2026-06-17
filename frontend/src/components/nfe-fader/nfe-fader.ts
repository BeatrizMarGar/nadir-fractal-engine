// --CONSTANTES--

const TRACK_HEIGHT_PX = 120;
const THUMB_HEIGHT_PX = 20;
const DRAG_SENSITIVITY_PX = 150;
const EVENT_NAME = 'nfe-change';
const TAG_NAME = 'nfe-fader';

// --TIPOS-- 

interface FaderAttributes {
    value: string;
    min: string;
    max: string;
    label: string;
}

// --TEMPLATE--

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
            .track {
                width: 24px;
                height: ${TRACK_HEIGHT_PX}px;
                background: #0a0a0f;
                border: 2px solid var(--nfe-accent, #00ffff);
                box-shadow: 0 0 8px var(--nfe-accent, #00ffff);
                position: relative;
                overflow: hidden;
            }

            .thumb {
                width: 100%;
                height: ${THUMB_HEIGHT_PX}px;
                background: var(--nfe-accent, #00ffff);
                position: absolute;
                top: 0;
                box-shadow: 0 0 12px var(--nfe-accent, #00ffff);
            }

            .label {
                font-family: monospace;
                font-size: 10px;
                color: var(--nfe-accent, #00ffff);
                letter-spacing: 2px;
                text-transform: uppercase;
            }

            .value-display {
                font-family: monospace;
                font-size: 12px;
                color: #ffffff;
            }
        </style>

        <div class="track">
            <div class="thumb"></div>
        </div>
        <span class="label"></span>
        <span class="value-display"></span>
    `;
}

// -- CLASE --

class NfeFader extends HTMLElement {

    private _value: number = 0;
    private _min: number = 0;
    private _max: number = 100;
    private _label: string = "";
    private _isDragging: boolean = false;
    private _dragStartY: number = 0;
    private _dragStartValue: number = 0;
    private _thumb!: HTMLElement;
    private _valueDisplay!: HTMLElement;
    private _labelEl!: HTMLElement;

    constructor() {

        super();

        const shadow = this.attachShadow({ mode: 'open'});

        shadow.innerHTML = createTemplate();

        this._thumb = shadow.querySelector('.thumb') as HTMLElement;
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

    // -- ATTRIBUTE CHANGED CALLBACK --

    attributeChangedCallback(
        name: string,
        _oldValue: string | null,
        newValue: string | null,
    ) : void {
        if (newValue === null) return;

        switch(name) {
            case 'value':
                this._value = Math.min(
                    Math.max(parseFloat(newValue), this._min),
                    this._max
                );
                break;
            case 'min':
                this._min = parseFloat(newValue);
                break;
            case 'max':
                this._max = parseFloat(newValue);
                break;
            case 'label':
                this._label = newValue;
                break;
        }
        this._render();
    }


    // -- CONNECTED y DISCONNECTED CALLBACK -- 
    connectedCallback(): void {
        this._thumb.addEventListener('mousedown', this._onMouseDown);
        this._render();
    }

    disconnectedCallback(): void{
        this._thumb.removeEventListener('mousedown', this._onMouseDown);
        document.removeEventListener('mousemove', this._onMouseMove);
        document.removeEventListener('mouseup', this._onMouseUp);
    }

    // -- LÓGICA DEL DRAG --

    private _onMouseDown(e: MouseEvent): void{
        this._isDragging= true;
        this._dragStartY= e.clientY;
        this._dragStartValue = this._value;
        
        document.addEventListener('mouseup', this._onMouseUp);
        document.addEventListener('mousemove', this._onMouseMove);
        
    }

    private _onMouseMove(e: MouseEvent): void {
        if(!this._isDragging) return;

        const delta = this._dragStartY - e.clientY;
    }
}