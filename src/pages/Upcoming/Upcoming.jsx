import { TaskList } from "../../components/Task/TaskList"
import { Title } from "../../components/Title/Title"

export const UpComingPage = () => {
    return(
        <>
            <Title title="Upcoming"/>

            <TaskList api="https://task-ojt.onrender.com/tasks?status=initial&status=working"/>
        </>
    )
}