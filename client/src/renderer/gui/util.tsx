import React from 'react';

export function RequestFieldAndButton({
  id,
  placeholder,
  buttonText,
  callback,
}: {
  id: string;
  placeholder: string;
  buttonText: string;
  callback;
}) {
  const [textValue, setTextValue] = React.useState('');
  return (
    <>
      <input
        id={id}
        value={textValue}
        type="text"
        placeholder={placeholder}
        onChange={(e) => setTextValue(e.target.value)}
      />
      <button type="button" onClick={() => callback(textValue)}>
        {buttonText}
      </button>
    </>
  );
}

export function FunctionButton({
  id,
  text,
  on_click,
}: {
  id: string;
  text: string;
  on_click: any;
}) {
  return (
    <section className="form-section">
      <input id={id} type="text" placeholder="my_script.tnk" />
      <button type="button" onClick={on_click}>
        {text}
      </button>
    </section>
  );
}
