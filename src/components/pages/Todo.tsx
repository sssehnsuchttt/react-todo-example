import React, { useState, useEffect, useRef } from 'react';
import './styles/Todo.css';
import { Tabs, Tab } from '../ui/Tabs';
import { useConfirmDialog } from '../ui/ConfirmDialog';
import { useInputDialog } from '../ui/InputDialog';
import autoAnimate from '@formkit/auto-animate';
import { useNavigate, useLocation } from 'react-router-dom';

interface Task {
    id: number;
    text: string;
    completed: boolean;
}

function Todo() {
    const [activeSection, setActiveSection] = useState<string>('all');
    const [newTaskText, setNewTaskText] = useState('');

    const [tasks, setTasks] = useState<Task[]>(() => {
        const savedTasks = localStorage.getItem('tasks');
        return savedTasks ? JSON.parse(savedTasks) : [];
    });

    const confirmDialog = useConfirmDialog();
    const inputDialog = useInputDialog();
    const navigate = useNavigate(); // Для навигации
    const location = useLocation(); // Для получения текущего пути

    const taskContainerRef = useRef(null);
    useEffect(() => {
        if (taskContainerRef.current) {
            autoAnimate(taskContainerRef.current);
        }
    }, [taskContainerRef]);

    const loadNextId = () => {
        const nextId = localStorage.getItem('nextId');
        return nextId ? Number(nextId) : 1;
    };

    const saveNextId = (nextId: number) => {
        localStorage.setItem('nextId', String(nextId));
    };

    const [nextId, setNextId] = useState<number>(loadNextId);

    useEffect(() => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }, [tasks]);

    const handleTabClick = (section: string) => {
        setActiveSection(section);
        const basePath = location.pathname.split('/').slice(0, -1).join('/'); // Получаем базовый путь
        navigate(`${basePath}/${section}`);
    };

    const handleAddTask = () => {
        if (newTaskText.trim() !== '') {
            const newTask: Task = {
                id: nextId,
                text: newTaskText,
                completed: false
            };
            setTasks([...tasks, newTask]);
            setNewTaskText('');

            const newNextId = nextId + 1;
            setNextId(newNextId);
            saveNextId(newNextId);
        }
    };

    const handleToggleTask = (id: number) => {
        const updatedTasks = tasks.map((task: Task) =>
            task.id === id ? { ...task, completed: !task.completed } : task
        );
        setTasks(updatedTasks);
    };

    const handleDeleteTask = (id: number) => {
        const updatedTasks = tasks.filter((task: Task) => task.id !== id);
        setTasks(updatedTasks);
    };

    const handleEditTask = (text: string, id: number) => {
        const taskToEdit = tasks.find((task: Task) => task.id === id);
        if (taskToEdit) {
            inputDialog.show(
                "Редактировать задачу",
                "Введите новое наименование",
                text,
                "Сохранить",
                "Отмена",
                (inputValue: string) => {
                    const updatedTasks = tasks.map((task: Task) =>
                        task.id === id ? { ...task, text: inputValue } : task
                    );
                    setTasks(updatedTasks);
                }
            );
        }
    };

    const getFilteredTasks = () => {
        if (activeSection === 'active') {
            return tasks.filter((task: Task) => !task.completed);
        } else if (activeSection === 'completed') {
            return tasks.filter((task: Task) => task.completed);
        }
        return tasks;
    };

    useEffect(() => {
        const path = location.pathname.split('/').pop();
        if (path) {
            setActiveSection(path);
        }
    }, [location]);

    return (
        <div className="Todo">
            <div className="card">
                <h1>Todo List Example</h1>

                <div className="add_task_container">
                    <input
                        className="add_input"
                        placeholder='Добавьте новую задачу'
                        value={newTaskText}
                        onChange={(e) => setNewTaskText(e.target.value)}
                    />
                    <button onClick={handleAddTask}>Добавить</button>
                </div>

                <Tabs>
                    <Tab
                        active={activeSection === 'all'}
                        onClick={() => handleTabClick('all')}
                        text="Все"
                    />
                    <Tab
                        active={activeSection === 'completed'}
                        onClick={() => handleTabClick('completed')}
                        text="Выполненные"
                    />
                    <Tab
                        active={activeSection === 'active'}
                        onClick={() => handleTabClick('active')}
                        text="Невыполненные"
                    />
                </Tabs>

                <div id="scrollable_container">
                    <div id="task_container" ref={taskContainerRef}>
                        {getFilteredTasks().map((task: Task) => (
                            <div className="task" key={task.id}>
                                <label className="checkbox_container">
                                    <input
                                        type="checkbox"
                                        checked={task.completed}
                                        onChange={() => handleToggleTask(task.id)}
                                    />
                                    <span className="checkmark"></span>
                                </label>
                                <p className={task.completed ? "task_name crossed" : "task_name"}>{task.text}</p>
                                <div className="space_filler"></div>
                                <span
                                    className="material-symbols-rounded"
                                    onClick={() => handleEditTask(task.text, task.id)}
                                >
                                    edit
                                </span>
                                <span
                                    className="material-symbols-rounded"
                                    onClick={() => confirmDialog.show(
                                        "Удалить задачу?",
                                        "Вы действительно хотите удалить эту задачу? Это действие нельзя будет отменить",
                                        "Удалить",
                                        "Отмена",
                                        () => handleDeleteTask(task.id)
                                    )}
                                >
                                    delete
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export { Todo };
