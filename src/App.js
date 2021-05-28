import {useState, useEffect} from "react";
import {BrowserRouter as Router, Route} from "react-router-dom";
import Header from "./components/Header";
import Tasks from "./components/Tasks";
import AddTask from "./components/AddTask";
import Footer from "./components/Footer";
import About from "./components/About";

function App() {
    const [showAddTask, setShowAddTask] = useState(false)
    const [tasks, setTasks] = useState([])

    useEffect(() => {
        const getTasks = async () => {
            const taskFromServer = await fetchTasks()
            setTasks(taskFromServer)
        }
        getTasks()
    }, [])
    //Fetch Tasks
    const fetchTasks = async () => {
        const res = await fetch('http://192.168.1.7:8080/api/task/get')
        const data = await res.json()

        return data
    }

    //Fetch Task
    const fetchTask = async (id) => {
        const res = await fetch(`http://192.168.1.7:8080/api/task/find?id=${id}`)
        const data = await res.json()

        return data
    }

    //Add Task
    const addTask = async (task) => {
        const res = await fetch('http://192.168.1.7:8080/api/task/create', {
            method: "POST", headers: {
                'Content-type': 'Application/json'
            },
            body: JSON.stringify(task)
        })

        const data = await res.json()

        setTasks([...tasks, data])

        // const id = Math.floor(Math.random() * 10000) + 1
        // const newTask = {id, ...task}
        // setTasks([...tasks, newTask])
    }

    //Delete Tasks
    const deleteTask = async (id) => {
        await fetch(`http://192.168.1.7:8080/api/task/delete?id=${id}`, {method: 'DELETE'})
        setTasks(tasks.filter((task) => task.id !== id))
    }

    //Toggle Reminder
    const toggleReminder = async (id) => {
        const taskToToggle = await fetchTask(id)
        const updatedTask = {...taskToToggle, reminder: !taskToToggle.reminder}

        const res = await fetch(`http://192.168.1.7:8080/api/task/update?id=${id}&reminder=${updatedTask.reminder}`,
            {method: `PUT`})

        const data = await res.json()

        setTasks(tasks.map((task) => task.id === id ? {...task, reminder: !data.reminder} : task))
    }

    return (
        <Router>
            <div className="container">
                <Header onAdd={() => setShowAddTask(!showAddTask)} showAdd={showAddTask}/>

                <Route path='/' exact render={(props) => (
                    <>
                        {showAddTask && <AddTask onAdd={addTask}/>}
                        {tasks.length > 0 ?
                            <Tasks tasks={tasks} onDelete={deleteTask}
                                   onToggle={toggleReminder}/> : ('No tasks to show')}
                    </>
                )}/>
                <Route path='/about' component={About}/>
                <Footer/>
            </div>
        </Router>
    );
}

export default App;
