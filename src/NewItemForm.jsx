import {useState} from "react"
function NewItemForm(props) {
    const [content, setContent] = useState("");
  
    const handleSubmit = (event) => {
      event.preventDefault();
      if (content.trim() === "") return;
      props.onAddItem(props.columnId, content);
      setContent("");
    };
  
    return (
   <div className="form-wrapper">
      <form className="new-item-form-container" onSubmit={handleSubmit}>
        <input className="new-item-form-input"
          type="text"
          placeholder="Add a new task"
          value={content}
          onChange={(event) => setContent(event.target.value)}
        />
        <button className="new-item-form-button" type="submit">Add</button>
      </form>
    </div>
    );
  }
  
  export default NewItemForm;