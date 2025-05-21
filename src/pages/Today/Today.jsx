import { TaskList } from "../../components/Task/TaskList"
import { Title } from "../../components/Title/Title"

export const TodayPage = () => {
    return(
        <>
            <Title title="Today"/>

            <TaskList api="https://task-ojt.onrender.com/tasks?today=true&status=initial&status=doing"/>
        </>
    )
}