import { useState } from 'react';
import uuid from 'utils/uuid';

const initialState = {
    darkTheme: false,
    boards: [],
};

function useInitialState() {
    const [state, setState] = useState(() => {
        const rawState = window.localStorage.getItem('STATE');
        const parsedState = JSON.parse(rawState);
        return parsedState || initialState;
    });

    const setStateInStorage = (value) => {
        const stateStringified = JSON.stringify(value);
        window.localStorage.setItem('STATE', stateStringified);
    };

    const handleTheme = () => {
        const updatedState = { ...state, darkTheme: !state.darkTheme };
        setState(updatedState);
        setStateInStorage(updatedState);
    };

    const addBoard = ({ name, description }) => {
        const newBoard = { id: uuid(), name, description, tasks: [] };
        const updatedBoards = [...state.boards, newBoard];
        const updatedState = { ...state, boards: updatedBoards };
        setState(updatedState);
        setStateInStorage(updatedState);
    };

    const removeBoard = ({ id }) => {
        const { boards } = state;
        const updatedBoards = boards.filter((board) => board.id !== id);
        const updatedState = { ...state, boards: updatedBoards };
        setState(updatedState);
        setStateInStorage(updatedState);
    };

    const addTask = (boardId, { task }) => {
        const newTask = { id: uuid(), task, completed: false };
        const boardIndex = state.boards.findIndex((board) => board.id === boardId);
        const boards = [...state.boards];
        boards[boardIndex].tasks.push(newTask);
        const updatedState = { ...state, boards };
        setState(updatedState);
        setStateInStorage(updatedState);
    };

    const removeTask = ({ boardId, taskId }) => {
        const boardIndex = state.boards.findIndex((board) => board.id === boardId);
        const boards = [...state.boards];
        boards[boardIndex].tasks = boards[boardIndex].tasks.filter((task) => task.id !== taskId);
        const updatedState = { ...state, boards };
        setState(updatedState);
        setStateInStorage(updatedState);
    };

    const changeTaskStatus = ({ boardId, taskId }) => {
        const boardIndex = state.boards.findIndex((board) => board.id === boardId);
        const boards = [...state.boards];
        const taskIndex = boards[boardIndex].tasks.findIndex((task) => task.id === taskId);
        boards[boardIndex].tasks[taskIndex].completed = !boards[boardIndex].tasks[taskIndex].completed;
        const updatedState = { ...state, boards };
        setState(updatedState);
        setStateInStorage(updatedState);
    };

    return { state, handleTheme, addBoard, removeBoard, addTask, removeTask, changeTaskStatus };
}

export default useInitialState;