

export function FunctionButton({id, text, on_click} : {id:string, text:string, on_click:any}) {
    return (<section className="form-section">
            <input id={id} type="text" placeholder="my_script.tnk" />
            <button type="button" onClick={on_click}>
            {text}
            </button>
        </section>);
}