import { useEffect, useState } from "react"
import { getDatabase, onValue, push, ref, set, remove } from "firebase/database"

const App = () => {

  const db = getDatabase();


  let [text, setText] = useState("");
  let [todo, setTodo] = useState([]);

  let handleText = (e) => {
    setText(e.target.value)

  }

  let handleSubmit = () => {
    set(push(ref(db, "alltodo")), {
      todotext: text,
    })
  }


  useEffect(() => {
    const todoRef = ref(db, "alltodo");
    onValue(todoRef, (snapshot) => {

      let arr = [];

      snapshot.forEach((item) => {
        arr.push({ ...item.val(), id: item.key })
      })

      setTodo(arr)

    });
  }, [])


  let handleDelete = (id) => {
    remove(ref(db, "alltodo/" + id)).then(() => {
      alert("deleted")
    })
  }


  let handleEdit = (id) => {
    console.log(id)
  }




  return (
    <>
      <div className="todoContent">
        <h2>Todo App</h2>
        <div>
          <input onChange={handleText} type="text" placeholder="Enter Your Task" />
          <button className="btn" onClick={handleSubmit}>Add Task</button>
        </div>

        <div>
          <ul>
            {todo.length > 0
              ?
              todo.map((item, index) => (
                <li key={index}>{item.todotext}

                  <button className="btn" onClick={() => handleDelete(item.id)}>Delete</button>

                  <button className="btn" onClick={() => handleEdit(item.id)}>Edit</button>

                </li>
              ))
              :
              <h1>Loading</h1>
            }
          </ul>
        </div>

      </div>
    </>
  )
}

export default App
