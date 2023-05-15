import './style.css';
import 'reactflow/dist/style.css';

export function ThemeSelector() {

  return (
    <select id="pet-select" onChange= {
      async(event) => {
        const selected = event.target.value;
        await window.theme.set(selected);
      }
    }>
      <option value="light">Light</option>
      <option value="dark">Dark</option>
      <option value="system">System</option>
    </select>
  );
}

export default ThemeSelector;
