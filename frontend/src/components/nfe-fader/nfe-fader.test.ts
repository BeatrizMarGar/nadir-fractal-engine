import "./nfe-fader"

describe("Pruebas unitarias para el componente NfeFader", () => {
    
    let elemento: HTMLElement;

    beforeEach(()=> {
        elemento = document.createElement('nfe-fader');
        document.body.appendChild(elemento)
    })

    test("Test 1: Registro de componente", () => {
        //assert 
        const definicion = customElements.get('nfe-fader');
        expect(definicion).toBeDefined();
    })

    test("Test 2: valores por defecto", () => {
        const value = (elemento as any)._value
        const min = (elemento as any)._min
        const max = (elemento as any)._max
        const label = (elemento as any)._label
        
        expect(value).toBe(0);
        expect(typeof value).toBe('number');

        expect(min).toBe(0);
        expect(typeof min).toBe('number');

        expect(max).toBe(100);
        expect(typeof max).toBe('number');

        expect(label).toBe("");
        expect(typeof label).toBe('string');
    })

    test("Test 3: Parseo de atributos", () => {
        elemento.setAttribute('value', '75');
        const value = (elemento as any)._value

        expect(value).toBe(75);
        expect(typeof value).toBe('number');
    })
    
    test("Test 4: Clamp superior", () => {
        elemento.setAttribute('value', '999');
        const value = (elemento as any)._value

        expect(value).toBe(100);
        expect(typeof value).toBe('number');
    })    

    test("Test 5: Clamp inferior", () => {
        elemento.setAttribute('value', '-999');
        const value = (elemento as any)._value

        expect(value).toBe(0);
        expect(typeof value).toBe('number');
    })

    afterEach(()=> {
        document.body.removeChild(elemento)
    })

    test("Test 6: Re-clamp al cambiar el valor máximo", () => {
        elemento.setAttribute('value', '80');
        elemento.setAttribute('max', '50');
        const value = (elemento as any)._value

        expect(value).toBe(50);
        expect(typeof value).toBe('number');
    })

    test("Test 7: Emisión de evento", () => {

        let eventoRecibido: CustomEvent | null = null;

        elemento.addEventListener('nfe-change', (e) => {
            eventoRecibido = e as CustomEvent;
        })
        const thumb = (elemento as any)._thumb as HTMLElement;
        thumb.dispatchEvent(new MouseEvent('pointerdown', {clientY: 100, bubbles: true, cancelable: true }));
        document.dispatchEvent(new MouseEvent('pointermove', {clientY: 50, bubbles: true}))
        document.dispatchEvent(new MouseEvent('pointerup', {bubbles: true}))

        expect(eventoRecibido).not.toBeNull();

        expect(typeof (eventoRecibido as any).detail.value).toBe('number');
        expect((eventoRecibido as any).detail.value).toBeGreaterThanOrEqual(0);
        expect((eventoRecibido as any).detail.value).toBeLessThanOrEqual(100);
    })
})