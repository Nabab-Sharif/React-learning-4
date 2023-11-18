import { useEffect, useState } from "react"
import { getDatabase, onValue, push, ref, set, remove, update } from "firebase/database"

const App = () => {

  const db = getDatabase();


  let [text, setText] = useState("");
  let [todo, setTodo] = useState([]);
  let [togglebtn, setTogglebtn] = useState(false)
  let [allinfo, setAllinfo] = useState()




  let handleText = (e) => {
    setText(e.target.value)
  }

  let handleSubmit = () => {
    text === "" ?
      alert("please enter the value")
      :
      set(push(ref(db, "alltodo")), {
        todotext: text,
      })
    setText("")
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
      alert("Successfully Deleted")
    })
  }


  let handleEdit = (item) => {
    setTogglebtn(true);
    setAllinfo(item);
    setText(item.todotext)
  }


  let handleUpdate = () => {

    update(ref(db, "alltodo/" + allinfo.id), {
      ...allinfo,
      todotext: text,
    }).then(() => {
      alert("Successfully Updated")
      setText("")
      setTogglebtn(false)
    })
  }


  return (
    <>
      <div className="todoContent">
        <h2>Todo App</h2>
        <div>
          <input onChange={handleText} type="text" placeholder="Enter Your Task" value={text} />

          {
            togglebtn
              ?
              <button className="btn" onClick={handleUpdate}>Update</button>
              :
              <button className="btn" onClick={handleSubmit}>Add Task</button>
          }

        </div>

        <div>
          <ul>
            {todo.length > 0 ?

              (todo.map((item, index) => (
                <li key={index}>{item.todotext}

                  <button className="btn delete" onClick={() => handleDelete(item.id)}>Delete</button>

                  <button className="btn edit" onClick={() => handleEdit(item)}>Edit</button>

                </li>
              ))
              ) : (todo.length === 0
                ?
                <h1>No todo here</h1>
                :
                <h2>Loading....</h2>

              )
            }
          </ul>
        </div>

      </div>
    </>
  )
}

export default App
